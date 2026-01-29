# Data Model: Overdue Todo Items Feature

**Feature**: Support for Overdue Todo Items  
**Date**: January 29, 2026  
**Status**: Complete

## Overview

This feature adds **derived properties** for todo items to indicate overdue status. The existing database schema remains unchanged. Overdue status is calculated client-side based on the relationship between a todo's `dueDate` field and the current date.

## Existing Schema (No Changes)

### Todo Entity

**Database Table**: `todos` (SQLite via better-sqlite3)

```sql
CREATE TABLE todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  dueDate TEXT,              -- ISO 8601 date string (YYYY-MM-DD) or NULL
  completed INTEGER DEFAULT 0, -- Boolean: 0 = incomplete, 1 = complete
  createdAt TEXT DEFAULT (datetime('now')) -- ISO 8601 timestamp
);
```

**Fields**:
- `id` (integer, primary key, auto-increment): Unique identifier for todo
- `title` (string, required, max 255 chars): Todo task description
- `dueDate` (string, nullable): ISO 8601 date format (YYYY-MM-DD)
- `completed` (integer, boolean): 0 = incomplete, 1 = complete
- `createdAt` (string, timestamp): ISO 8601 timestamp of creation

**Validation Rules** (existing, enforced in backend):
- `title`: Required, non-empty after trim, max 255 characters
- `dueDate`: Optional, must be valid ISO date format if provided
- `completed`: Boolean (0 or 1)

**State Transitions** (existing):
- New todo: `completed = 0`
- Toggle complete: `completed` switches between 0 and 1
- Update: `title` and/or `dueDate` can be modified
- Delete: Todo removed from database

## Derived Properties (Computed Client-Side)

### isOverdue

**Type**: Boolean (computed)  
**Description**: Indicates whether an incomplete todo has passed its due date  
**Calculation**:
```javascript
isOverdue = (completed === 0 || completed === false) 
            && dueDate !== null 
            && Date.parse(dueDate) < Date.now() (midnight comparison)
```

**Rules**:
- Returns `false` if todo is completed (regardless of due date)
- Returns `false` if todo has no due date
- Returns `false` if due date equals current date (not overdue until date has passed)
- Returns `true` ONLY if incomplete AND due date is in the past

**Edge Cases**:
- Due date = today: `isOverdue = false`
- Due date = yesterday: `isOverdue = true` (if incomplete)
- No due date: `isOverdue = false`
- Completed + past due date: `isOverdue = false` (completion takes precedence)

### overdueDuration

**Type**: String (computed)  
**Description**: Human-readable abbreviated text showing how long a todo has been overdue  
**Format**: 
- Days (0-6 days): `"Xd overdue"` (e.g., "1d overdue", "5d overdue")
- Weeks (7-29 days): `"Xw overdue"` (e.g., "1w overdue", "3w overdue")
- Months (≥30 days): `"Xmo overdue"` (e.g., "1mo overdue", "6mo overdue")

**Calculation**:
```javascript
if (!isOverdue) return null;

const diffMs = currentDate - Date.parse(dueDate);
const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

if (diffDays < 7) {
  return `${diffDays}d overdue`;
} else if (diffDays < 30) {
  const weeks = Math.floor(diffDays / 7);
  return `${weeks}w overdue`;
} else {
  const months = Math.floor(diffDays / 30);
  return `${months}mo overdue`;
}
```

**Rules**:
- Only calculated when `isOverdue = true`
- Returns `null` for non-overdue todos
- Truncates fractional values (e.g., 6.9 days = 6d, not 7d)
- Week calculation: `Math.floor(days / 7)`
- Month calculation: `Math.floor(days / 30)` (approximation, not calendar months)

**Examples**:
- Due date: 2 days ago → `"2d overdue"`
- Due date: 10 days ago → `"1w overdue"` (10 / 7 = 1.42 → floor = 1)
- Due date: 45 days ago → `"1mo overdue"` (45 / 30 = 1.5 → floor = 1)
- Due date: 90 days ago → `"3mo overdue"`

## Data Flow

### Frontend Display Flow

```
1. Frontend fetches todos from backend API
   ↓
2. Backend returns array of todo objects (existing schema)
   ↓
3. Frontend receives todos in TodoList component
   ↓
4. For each todo, TodoCard component:
   a. Calls dateUtils.isOverdue(todo.dueDate, todo.completed)
   b. If overdue, calls dateUtils.getOverdueDuration(todo.dueDate)
   c. Renders visual indicators + duration text
   ↓
5. User sees overdue styling and duration (if applicable)
```

### No Backend Changes

**API Endpoints**: No changes to existing endpoints  
- `GET /api/todos` - Returns todos as-is
- `POST /api/todos` - Creates todo (existing validation)
- `PUT /api/todos/:id` - Updates todo (existing validation)
- `PATCH /api/todos/:id/toggle` - Toggles completion
- `DELETE /api/todos/:id` - Deletes todo

**Backend Rationale**: Overdue status is a **view concern**, not a data storage concern. Calculating overdue client-side:
1. Avoids backend schema changes
2. Ensures overdue status is always current (no stale data)
3. Reduces backend complexity
4. Follows separation of concerns (business logic vs. display logic)

## Relationships

**No new relationships.** This feature operates on existing todo entities.

### Entity Diagram

```
┌─────────────────────────────────┐
│         Todo Entity             │
│ (Existing - no changes)         │
├─────────────────────────────────┤
│ id: integer (PK)                │
│ title: string (required)        │
│ dueDate: string | null          │
│ completed: boolean              │
│ createdAt: timestamp            │
└─────────────────────────────────┘
                │
                │ Derived (computed client-side)
                ↓
┌─────────────────────────────────┐
│     Overdue Properties          │
│ (NOT stored in database)        │
├─────────────────────────────────┤
│ isOverdue: boolean              │
│   = !completed                  │
│     && dueDate != null          │
│     && dueDate < currentDate    │
│                                 │
│ overdueDuration: string | null  │
│   = format(currentDate-dueDate) │
│     if isOverdue                │
└─────────────────────────────────┘
```

## Type Definitions (Frontend)

**JavaScript (with JSDoc types)**:

```javascript
/**
 * Todo item from backend API
 * @typedef {Object} Todo
 * @property {number} id - Unique identifier
 * @property {string} title - Todo task description
 * @property {string|null} dueDate - ISO date string (YYYY-MM-DD) or null
 * @property {number} completed - 0 = incomplete, 1 = complete
 * @property {string} createdAt - ISO timestamp of creation
 */

/**
 * Overdue status (computed)
 * @typedef {Object} OverdueStatus
 * @property {boolean} isOverdue - True if incomplete and past due date
 * @property {string|null} duration - Formatted duration string (e.g., "2d overdue") or null
 */
```

## Validation Rules (Unchanged)

**Existing backend validation** (no changes):
- Title: Required, 1-255 characters after trim
- Due date: Optional, must be valid ISO date if provided
- Completed: Must be boolean/integer (0 or 1)

**No new validation required** for overdue properties (they are derived, not input).

## Test Data Examples

### Example 1: Overdue Todo (1 day)
```json
{
  "id": 1,
  "title": "Submit report",
  "dueDate": "2026-01-28",
  "completed": 0,
  "createdAt": "2026-01-25T10:00:00Z"
}
```
**Derived** (as of 2026-01-29):
- `isOverdue`: `true`
- `overdueDuration`: `"1d overdue"`

### Example 2: Overdue Todo (2 weeks)
```json
{
  "id": 2,
  "title": "Call dentist",
  "dueDate": "2026-01-15",
  "completed": 0,
  "createdAt": "2026-01-10T14:00:00Z"
}
```
**Derived** (as of 2026-01-29):
- `isOverdue`: `true`
- `overdueDuration`: `"2w overdue"` (14 days / 7 = 2 weeks)

### Example 3: Not Overdue (Future Due Date)
```json
{
  "id": 3,
  "title": "Prepare presentation",
  "dueDate": "2026-02-05",
  "completed": 0,
  "createdAt": "2026-01-28T09:00:00Z"
}
```
**Derived** (as of 2026-01-29):
- `isOverdue`: `false`
- `overdueDuration`: `null`

### Example 4: Completed (Past Due Date)
```json
{
  "id": 4,
  "title": "Buy groceries",
  "dueDate": "2026-01-20",
  "completed": 1,
  "createdAt": "2026-01-18T11:00:00Z"
}
```
**Derived** (as of 2026-01-29):
- `isOverdue`: `false` (completed takes precedence)
- `overdueDuration`: `null`

### Example 5: No Due Date
```json
{
  "id": 5,
  "title": "Read book",
  "dueDate": null,
  "completed": 0,
  "createdAt": "2026-01-20T16:00:00Z"
}
```
**Derived** (as of 2026-01-29):
- `isOverdue`: `false` (no due date)
- `overdueDuration`: `null`

### Example 6: Due Today (Edge Case)
```json
{
  "id": 6,
  "title": "Morning meeting",
  "dueDate": "2026-01-29",
  "completed": 0,
  "createdAt": "2026-01-29T08:00:00Z"
}
```
**Derived** (as of 2026-01-29):
- `isOverdue`: `false` (due today, not past due)
- `overdueDuration`: `null`

## Migration Notes

**No database migration required.** This is a non-breaking, additive feature that operates on existing data.

**Rollback**: Simply remove overdue display logic from frontend. No data cleanup needed.

## Performance Considerations

**Calculation Cost**: 
- `isOverdue`: O(1) - simple date comparison
- `overdueDuration`: O(1) - arithmetic operations
- Per-todo overhead: <1ms

**Scale**: 
- Typical todo list: 10-50 items
- Total calculation time: <10ms for 100 todos
- No memoization needed at this scale

**Rendering**: 
- Overdue todos add ~2 extra text elements
- Minimal DOM impact
- CSS styling via classes (no inline styles)

## Future Considerations

**Potential Enhancements** (out of scope for this feature):
- Sort todos by overdue status (overdue first)
- Filter to show only overdue todos
- Backend API to return pre-calculated overdue status
- Email/push notifications for overdue todos
- "Snooze" functionality to defer due dates

**Why Not Now**: 
- Spec focuses on visual identification only
- KISS principle - solve immediate need first
- Backend changes increase complexity
- Client-side calculation is sufficient for current scale
