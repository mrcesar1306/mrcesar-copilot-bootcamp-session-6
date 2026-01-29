# Developer Quickstart: Overdue Todo Items Feature

**Feature**: Support for Overdue Todo Items  
**Branch**: `001-overdue-todos`  
**Date**: January 29, 2026

## Overview

This guide helps developers quickly understand and implement the overdue todos feature. The feature adds visual indicators and duration text for incomplete todo items past their due date.

## Quick Facts

- **Type**: Frontend-focused feature
- **Backend Changes**: None (uses existing API and database schema)
- **New Files**: 2 (dateUtils.js + test file)
- **Modified Files**: ~2 (TodoCard.js + test file, possibly theme.css)
- **Estimated Effort**: 4-6 hours (including tests)
- **Risk Level**: Low (no breaking changes, purely additive)

## Prerequisites

Before starting development:

1. **Environment Setup**:
   ```bash
   cd /workspaces/mrcesar-copilot-bootcamp-session-6
   npm install
   ```

2. **Run Tests** (ensure baseline passes):
   ```bash
   npm test
   ```

3. **Start Dev Environment**:
   ```bash
   npm run start
   # Frontend: http://localhost:3000
   # Backend: http://localhost:3030
   ```

4. **Review Documentation**:
   - [Feature Spec](./spec.md) - Requirements and user stories
   - [Research](./research.md) - Technical decisions
   - [Data Model](./data-model.md) - Schema and derived properties

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│             Frontend (React)                    │
├─────────────────────────────────────────────────┤
│                                                 │
│  TodoList Component                             │
│    │                                            │
│    ├─> TodoCard Component (MODIFIED)           │
│    │     ├─> Display todo data                 │
│    │     ├─> Calculate overdue status          │
│    │     └─> Show overdue indicator            │
│    │                                            │
│    └─> Uses: dateUtils (NEW)                   │
│          ├─> isOverdue(dueDate, completed)     │
│          └─> getOverdueDuration(dueDate)       │
│                                                 │
└─────────────────────────────────────────────────┘
                      ↕ HTTP
┌─────────────────────────────────────────────────┐
│          Backend (Express + SQLite)             │
├─────────────────────────────────────────────────┤
│                                                 │
│  NO CHANGES REQUIRED                            │
│  - Existing API endpoints unchanged             │
│  - Database schema unchanged                    │
│  - Returns todos with dueDate & completed       │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Implementation Steps

### Step 1: Create Date Utility Functions (30-45 min)

**File**: `packages/frontend/src/utils/dateUtils.js`

```javascript
/**
 * Check if a todo is overdue
 * @param {string|null} dueDate - ISO date string (YYYY-MM-DD)
 * @param {boolean|number} completed - Completion status
 * @returns {boolean} True if incomplete and past due date
 */
export function isOverdue(dueDate, completed) {
  // Return false if no due date or completed
  if (!dueDate || completed) return false;
  
  const due = new Date(dueDate);
  const today = new Date();
  
  // Set to midnight for fair comparison
  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  // Overdue only if due date is in the past
  return due < today;
}

/**
 * Get formatted overdue duration
 * @param {string} dueDate - ISO date string (YYYY-MM-DD)
 * @returns {string} Formatted duration (e.g., "2d overdue", "1w overdue")
 */
export function getOverdueDuration(dueDate) {
  const due = new Date(dueDate);
  const today = new Date();
  
  // Calculate difference in days
  const diffMs = today - due;
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
}
```

**Why this structure?**
- Pure functions (easy to test)
- No dependencies (KISS)
- Follows existing codebase patterns
- Single Responsibility Principle

### Step 2: Write Unit Tests (45-60 min)

**File**: `packages/frontend/src/utils/__tests__/dateUtils.test.js`

```javascript
import { isOverdue, getOverdueDuration } from '../dateUtils';

describe('dateUtils', () => {
  describe('isOverdue', () => {
    const today = new Date('2026-01-29');
    
    test('returns false for future due date', () => {
      expect(isOverdue('2026-02-01', false)).toBe(false);
    });
    
    test('returns false for today due date', () => {
      expect(isOverdue('2026-01-29', false)).toBe(false);
    });
    
    test('returns true for past due date (incomplete)', () => {
      expect(isOverdue('2026-01-28', false)).toBe(true);
    });
    
    test('returns false for past due date (completed)', () => {
      expect(isOverdue('2026-01-28', true)).toBe(false);
    });
    
    test('returns false for null due date', () => {
      expect(isOverdue(null, false)).toBe(false);
    });
    
    test('handles completed as number (0/1)', () => {
      expect(isOverdue('2026-01-28', 0)).toBe(true);
      expect(isOverdue('2026-01-28', 1)).toBe(false);
    });
  });
  
  describe('getOverdueDuration', () => {
    test('formats days correctly (<7 days)', () => {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() - 3);
      expect(getOverdueDuration(dueDate.toISOString().split('T')[0]))
        .toBe('3d overdue');
    });
    
    test('formats weeks correctly (7-29 days)', () => {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() - 14);
      expect(getOverdueDuration(dueDate.toISOString().split('T')[0]))
        .toBe('2w overdue');
    });
    
    test('formats months correctly (≥30 days)', () => {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() - 45);
      expect(getOverdueDuration(dueDate.toISOString().split('T')[0]))
        .toBe('1mo overdue');
    });
    
    test('edge case: exactly 7 days = 1 week', () => {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() - 7);
      expect(getOverdueDuration(dueDate.toISOString().split('T')[0]))
        .toBe('1w overdue');
    });
    
    test('edge case: exactly 30 days = 1 month', () => {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() - 30);
      expect(getOverdueDuration(dueDate.toISOString().split('T')[0]))
        .toBe('1mo overdue');
    });
  });
});
```

**Run tests**:
```bash
npm test -- dateUtils
```

### Step 3: Update TodoCard Component (60-90 min)

**File**: `packages/frontend/src/components/TodoCard.js`

**Add import** at the top:
```javascript
import { isOverdue, getOverdueDuration } from '../utils/dateUtils';
```

**Add overdue calculation** inside component:
```javascript
function TodoCard({ todo, onToggle, onEdit, onDelete, isLoading }) {
  // Existing state...
  
  // Calculate overdue status
  const overdueStatus = isOverdue(todo.dueDate, todo.completed);
  const overdueDuration = overdueStatus ? getOverdueDuration(todo.dueDate) : null;
  
  // Rest of component...
}
```

**Update JSX** to display overdue indicator:
```javascript
// In the render section, after due date display:
{todo.dueDate && (
  <div className="todo-date">
    <span className={overdueStatus ? 'overdue-date' : ''}>
      Due: {formatDate(todo.dueDate)}
    </span>
    {overdueStatus && (
      <>
        <div className="overdue-indicator">
          ⚠️ OVERDUE
        </div>
        <div className="overdue-duration">
          {overdueDuration}
        </div>
      </>
    )}
  </div>
)}
```

**Add CSS class** to card container:
```javascript
<div className={`todo-card ${overdueStatus ? 'overdue' : ''} ${isEditing ? 'todo-card-edit' : ''}`}>
```

### Step 4: Add CSS Styles (15-30 min)

**File**: `packages/frontend/src/styles/theme.css` (or TodoCard-specific CSS)

```css
/* Overdue todo card styling */
.todo-card.overdue {
  border-left: 4px solid var(--danger-color);
}

.overdue-date {
  color: var(--danger-color);
  font-weight: 600;
}

.overdue-indicator {
  color: var(--danger-color);
  font-size: 12px;
  font-weight: 600;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.overdue-duration {
  color: var(--text-secondary);
  font-size: 12px;
  margin-top: 2px;
  margin-left: 20px; /* Indent under OVERDUE text */
}

/* Ensure danger color is defined in both themes */
:root {
  --danger-color: #c62828; /* Red for light mode */
}

[data-theme='dark'] {
  --danger-color: #ef5350; /* Light red for dark mode */
}
```

### Step 5: Update TodoCard Tests (45-60 min)

**File**: `packages/frontend/src/components/__tests__/TodoCard.test.js`

**Add new test cases**:
```javascript
import { render, screen } from '@testing-library/react';
import TodoCard from '../TodoCard';

describe('TodoCard - Overdue Feature', () => {
  const mockOnToggle = jest.fn();
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  
  test('displays overdue indicator for incomplete todo with past due date', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const overdueTodo = {
      id: 1,
      title: 'Overdue task',
      dueDate: yesterday.toISOString().split('T')[0],
      completed: false,
    };
    
    render(
      <TodoCard
        todo={overdueTodo}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    expect(screen.getByText(/OVERDUE/i)).toBeInTheDocument();
    expect(screen.getByText(/1d overdue/i)).toBeInTheDocument();
  });
  
  test('does NOT display overdue indicator for future due date', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const futureTodo = {
      id: 2,
      title: 'Future task',
      dueDate: tomorrow.toISOString().split('T')[0],
      completed: false,
    };
    
    render(
      <TodoCard
        todo={futureTodo}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    expect(screen.queryByText(/OVERDUE/i)).not.toBeInTheDocument();
  });
  
  test('does NOT display overdue indicator for completed todo', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const completedTodo = {
      id: 3,
      title: 'Completed task',
      dueDate: yesterday.toISOString().split('T')[0],
      completed: true,
    };
    
    render(
      <TodoCard
        todo={completedTodo}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    expect(screen.queryByText(/OVERDUE/i)).not.toBeInTheDocument();
  });
  
  test('does NOT display overdue indicator for todo with no due date', () => {
    const noDueDateTodo = {
      id: 4,
      title: 'No due date task',
      dueDate: null,
      completed: false,
    };
    
    render(
      <TodoCard
        todo={noDueDateTodo}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    expect(screen.queryByText(/OVERDUE/i)).not.toBeInTheDocument();
  });
  
  test('applies overdue CSS class to card', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const overdueTodo = {
      id: 5,
      title: 'Overdue task',
      dueDate: yesterday.toISOString().split('T')[0],
      completed: false,
    };
    
    const { container } = render(
      <TodoCard
        todo={overdueTodo}
        onToggle={mockOnToggle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    const card = container.querySelector('.todo-card');
    expect(card).toHaveClass('overdue');
  });
});
```

**Run tests**:
```bash
npm test -- TodoCard
```

### Step 6: Verify Coverage (15 min)

```bash
npm test -- --coverage
```

**Expected Coverage**:
- `dateUtils.js`: 100% (pure functions, all branches tested)
- `TodoCard.js`: Should maintain existing coverage + new overdue logic

**Minimum Requirement**: 80%+ overall coverage

### Step 7: Manual Testing (30 min)

1. **Start the app**:
   ```bash
   npm run start
   ```

2. **Test Cases**:
   - ✅ Create todo with past due date → See overdue indicator
   - ✅ Create todo with future due date → No overdue indicator
   - ✅ Create todo with today's date → No overdue indicator
   - ✅ Create todo without due date → No overdue indicator
   - ✅ Mark overdue todo complete → Overdue indicator disappears
   - ✅ Mark completed overdue todo incomplete → Overdue indicator reappears
   - ✅ Toggle dark mode → Overdue colors change appropriately
   - ✅ Check accessibility (keyboard nav, screen reader, color contrast)

3. **Browser Testing**:
   - Chrome
   - Firefox
   - Safari (if available)

## Key Files Reference

### New Files
- `packages/frontend/src/utils/dateUtils.js` - Date utility functions
- `packages/frontend/src/utils/__tests__/dateUtils.test.js` - Unit tests

### Modified Files
- `packages/frontend/src/components/TodoCard.js` - Add overdue display logic
- `packages/frontend/src/components/__tests__/TodoCard.test.js` - Add overdue tests
- `packages/frontend/src/styles/theme.css` - Add overdue styles (optional, may use inline CSS)

### Unchanged Files
- All backend files (no changes needed)
- `packages/frontend/src/services/todoService.js` (API client unchanged)
- Other components (TodoList, TodoForm, etc.)

## Common Pitfalls

### ❌ Mistake 1: Comparing dates with time components
```javascript
// WRONG - includes time, causes incorrect overdue status
const due = new Date(dueDate);
const today = new Date();
return due < today;
```

```javascript
// CORRECT - compare at midnight
due.setHours(0, 0, 0, 0);
today.setHours(0, 0, 0, 0);
return due < today;
```

### ❌ Mistake 2: Showing overdue for completed todos
```javascript
// WRONG - doesn't check completed status
const overdueStatus = isOverdue(todo.dueDate);
```

```javascript
// CORRECT - pass completed status
const overdueStatus = isOverdue(todo.dueDate, todo.completed);
```

### ❌ Mistake 3: Hardcoding colors instead of using CSS variables
```javascript
// WRONG - doesn't support dark mode
<div style={{ color: '#c62828' }}>OVERDUE</div>
```

```javascript
// CORRECT - uses CSS variables
<div className="overdue-indicator">OVERDUE</div>
/* CSS: .overdue-indicator { color: var(--danger-color); } */
```

### ❌ Mistake 4: Not handling null/undefined due dates
```javascript
// WRONG - crashes if dueDate is null
const due = new Date(dueDate);
```

```javascript
// CORRECT - guard clause
if (!dueDate) return false;
const due = new Date(dueDate);
```

## Debugging Tips

### Test is failing: "Expected overdue but got false"
- Check date comparison logic (ensure midnight normalization)
- Verify test is using past date correctly
- Console.log the calculated dates to inspect

### Overdue indicator not showing in UI
- Check `completed` prop value (0 vs false)
- Inspect DOM to see if JSX is rendering but CSS is missing
- Verify conditional logic in component

### Coverage below 80%
- Add edge case tests (null dates, boundary conditions)
- Test both completed and incomplete states
- Test different duration formats (days, weeks, months)

## Performance Monitoring

**Acceptable Metrics**:
- Date calculation: <1ms per todo
- Component render time: No noticeable change
- Bundle size increase: <1KB

**Red Flags**:
- Multiple re-renders per todo
- Visible lag when scrolling todo list
- Bundle size increase >5KB

**Profiling**:
```bash
# Use React DevTools Profiler
# Check render time for TodoCard before/after changes
```

## Checklist Before Pull Request

- [ ] All new tests pass
- [ ] Coverage is 80%+
- [ ] ESLint passes with no warnings
- [ ] Manual testing complete (all scenarios above)
- [ ] Dark mode works correctly
- [ ] Accessibility tested (keyboard, contrast, screen reader)
- [ ] Code follows existing patterns (naming, structure)
- [ ] JSDoc comments added to utility functions
- [ ] No console.log statements left in code
- [ ] Commit messages are descriptive
- [ ] Branch is up to date with main

## Getting Help

**Documentation**:
- [Feature Spec](./spec.md) - Requirements and acceptance criteria
- [Research](./research.md) - Technical decisions and alternatives
- [Data Model](./data-model.md) - Schema and derived properties
- [Coding Guidelines](/docs/coding-guidelines.md) - Style and best practices
- [Testing Guidelines](/docs/testing-guidelines.md) - Testing strategy

**Code References**:
- Existing `TodoCard.js` - Component structure and patterns
- Existing tests in `__tests__/` - Test patterns and setup
- `theme.css` - Design system and CSS variables

**Questions?**
- Check edge cases in [spec.md](./spec.md)
- Review similar features in existing components
- Consult constitution principles in `.specify/memory/constitution.md`

## Next Steps After Implementation

After feature is complete and merged:
1. Update documentation if needed
2. Monitor for bug reports from users
3. Consider future enhancements (sorting, filtering by overdue status)
4. Plan next feature iteration
