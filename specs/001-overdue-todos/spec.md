# Feature Specification: Support for Overdue Todo Items

**Feature Branch**: `001-overdue-todos`  
**Created**: January 29, 2026  
**Status**: Draft  
**Input**: User description: "Support for Overdue Todo Items: Users need a clear, visual way to identify which todos have not been completed by their due date"

## Clarifications

### Session 2026-01-29

- Q: The spec requires "distinct visual treatment" for overdue todos but doesn't specify the exact UI approach. This impacts both frontend implementation and accessibility testing. → A: Multiple visual indicators (color + icon/emoji + text label like "⚠️ OVERDUE")
- Q: FR-008 requires displaying "overdue duration" with examples like "2 days overdue" or "1 week overdue", but doesn't specify the exact format rules for all time ranges. → A: Abbreviated format: "1d overdue", "5d overdue", "2w overdue", "3mo overdue"
- Q: The spec mentions color for overdue indicators but doesn't specify which color(s) to use. This affects UI consistency and user expectations. → A: Use red/danger color from existing design system
- Q: User Story 2 mentions displaying overdue duration alongside todos, but doesn't specify where in the UI this text should appear relative to other todo card elements (title, due date, checkbox, actions). → A: Display below the due date
- Q: The spec requires the warning icon/emoji (⚠️) but doesn't specify its position within the todo card layout. → A: Display icon before "OVERDUE" text label

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visual Identification of Overdue Todos (Priority: P1)

When a user opens their todo list, any incomplete todo items that have passed their due date are immediately visually distinguished from other todos, allowing the user to quickly identify which tasks require urgent attention.

**Why this priority**: This is the core value proposition of the feature - enabling users to instantly recognize overdue items without manual date comparison. Without this, the feature has no value.

**Independent Test**: Can be fully tested by creating todos with past due dates, marking them incomplete, and verifying they display with distinct visual treatment. Delivers immediate value by highlighting what needs attention.

**Acceptance Scenarios**:

1. **Given** a user has incomplete todos with due dates in the past, **When** the user views their todo list, **Then** all overdue items are visually distinguished (different color/styling) from non-overdue items
2. **Given** a user has multiple todos with different states (some overdue, some not, some completed), **When** the user views the list, **Then** only incomplete todos past their due date show the overdue visual indicator
3. **Given** a todo item becomes overdue (current date passes the due date), **When** the user refreshes or reopens the todo list, **Then** the item automatically displays as overdue without any manual action
4. **Given** a user marks an overdue todo as complete, **When** the status changes, **Then** the overdue visual indicator is removed/no longer applies

---

### User Story 2 - Clear Date Context for Overdue Items (Priority: P2)

Users can see how long a todo has been overdue to understand the urgency level and prioritize accordingly.

**Why this priority**: Enhances the core functionality by adding context. Users can differentiate between items 1 day overdue vs 30 days overdue, but the basic overdue indicator (P1) still provides value without this.

**Independent Test**: Can be tested independently by displaying relative date information ("2 days overdue", "1 week overdue") alongside overdue items and verifying accuracy. Provides additional prioritization value.

**Acceptance Scenarios**:

1. **Given** a user has an overdue todo item, **When** viewing the todo list, **Then** the overdue duration is displayed in abbreviated format (e.g., "2d overdue", "1w overdue", "3mo overdue")
2. **Given** todos with different overdue durations exist, **When** the user views the list, **Then** each displays its specific overdue duration accurately relative to today's date using abbreviated format (days for <7 days, weeks for 7-29 days, months for ≥30 days)

---

### User Story 3 - Consistent Overdue Status Across Sessions (Priority: P3)

Overdue status is calculated dynamically based on the current date, ensuring accuracy across different user sessions and devices without requiring data updates.

**Why this priority**: Ensures reliability over time but doesn't add new user-facing functionality. The P1 story already implies this behavior; this explicitly validates it across edge cases.

**Independent Test**: Can be tested by accessing the same todo list on different days and verifying overdue status updates correctly. Ensures consistency without adding visible features.

**Acceptance Scenarios**:

1. **Given** a todo with a due date of yesterday, **When** the user logs in today, **Then** it displays as overdue
2. **Given** a todo with a due date of tomorrow, **When** the user logs in today, **Then** it does NOT display as overdue
3. **Given** the user last viewed the list yesterday, **When** they return today and a todo's due date has passed, **Then** it now displays as overdue
4. **Given** a todo was overdue yesterday but marked complete today, **When** viewing the list, **Then** it displays as complete with no overdue indicator

---

### Edge Cases

- What happens when a todo has no due date? (It should never display as overdue)
- What happens when a todo's due date equals today's date? (Should be treated as NOT overdue until the date has passed - overdue starts tomorrow)
- What happens at midnight when the date changes? (Users viewing the page should see updated overdue status on next page load/refresh)
- What happens with completed todos that were previously overdue? (Overdue visual indicator should not apply; completion status takes precedence)
- What happens when system date/time is incorrect? (Overdue calculation uses system date; no special handling needed - user's environment responsibility)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST compare each incomplete todo's due date against the current date to determine overdue status
- **FR-002**: System MUST display overdue todos with multiple visual indicators including: (a) danger color styling (red: #c62828 light mode, #ef5350 dark mode per design system), (b) a warning icon or emoji (e.g., ⚠️) positioned before the text label, and (c) a text label (e.g., "⚠️ OVERDUE") to ensure accessibility for users with color blindness
- **FR-003**: System MUST only apply overdue visual treatment to todos that are both incomplete AND past their due date
- **FR-004**: System MUST NOT apply overdue status to todos without a due date
- **FR-005**: System MUST calculate overdue status dynamically based on current date at time of display
- **FR-006**: System MUST NOT display overdue indicator for completed todos, regardless of their due date
- **FR-007**: System MUST treat todos with due date equal to current date as NOT overdue (overdue only when due date is in the past)
- **FR-008**: System MUST display the overdue duration in abbreviated format: "Xd overdue" for days (X < 7), "Xw overdue" for weeks (7 ≤ X < 30 days, calculated as days/7 rounded down), "Xmo overdue" for months (X ≥ 30 days, calculated as days/30 rounded down), positioned below the due date in the todo card UI
- **FR-009**: Visual treatment for overdue items MUST be consistent with the application's existing design system, support both light and dark modes, and meet WCAG AA color contrast requirements for accessibility
- **FR-010**: System MUST update overdue status when todos transition between complete and incomplete states

### Key Entities

- **Todo Item**: Represents a task with attributes including completion status (boolean), due date (optional date), and created date. The overdue state is a derived attribute calculated by comparing due date to current date when the todo is incomplete.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can identify overdue todos within 2 seconds of viewing their todo list
- **SC-002**: 100% of incomplete todos with past due dates display the overdue visual indicator
- **SC-003**: 0% of todos without due dates, with future due dates, or with completed status display the overdue indicator
- **SC-004**: Users correctly identify which todos are overdue in 95%+ of cases without manually checking dates
- **SC-005**: Overdue status updates accurately when users refresh or return to the application after date changes
- **SC-006**: Visual distinction between overdue and non-overdue items is clear and accessible (meets color contrast requirements)
