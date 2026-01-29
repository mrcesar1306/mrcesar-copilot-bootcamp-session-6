# API Contracts: Overdue Todo Items Feature

**Feature**: Support for Overdue Todo Items  
**Date**: January 29, 2026  
**Status**: Complete

## Overview

**NO API CHANGES REQUIRED** for this feature. Overdue status is calculated client-side using existing todo data returned from the backend API.

This document serves as a reference to confirm that existing API endpoints remain unchanged and provide the necessary data for the overdue feature.

## Existing API Endpoints (Unchanged)

All endpoints remain unchanged. The overdue feature operates on existing fields (`dueDate`, `completed`) without requiring new API responses.

### GET /api/todos

**Description**: Retrieve all todos  
**Method**: `GET`  
**URL**: `/api/todos`  
**Authentication**: None (single-user app)

**Response**:
```json
Status: 200 OK
Content-Type: application/json

[
  {
    "id": 1,
    "title": "Submit report",
    "dueDate": "2026-01-28",
    "completed": 0,
    "createdAt": "2026-01-25T10:00:00Z"
  },
  {
    "id": 2,
    "title": "Call dentist",
    "dueDate": null,
    "completed": 1,
    "createdAt": "2026-01-20T14:00:00Z"
  }
]
```

**Notes**:
- Frontend will use `dueDate` and `completed` fields to calculate overdue status
- No additional fields needed from backend

---

### GET /api/todos/:id

**Description**: Retrieve a single todo by ID  
**Method**: `GET`  
**URL**: `/api/todos/:id`  
**Authentication**: None

**Response**:
```json
Status: 200 OK
Content-Type: application/json

{
  "id": 1,
  "title": "Submit report",
  "dueDate": "2026-01-28",
  "completed": 0,
  "createdAt": "2026-01-25T10:00:00Z"
}
```

**Error Responses**:
- `404 Not Found`: Todo with specified ID does not exist

---

### POST /api/todos

**Description**: Create a new todo  
**Method**: `POST`  
**URL**: `/api/todos`  
**Authentication**: None

**Request Body**:
```json
{
  "title": "New todo item",
  "dueDate": "2026-02-15"  // Optional, can be null or omitted
}
```

**Response**:
```json
Status: 201 Created
Content-Type: application/json

{
  "id": 3,
  "title": "New todo item",
  "dueDate": "2026-02-15",
  "completed": 0,
  "createdAt": "2026-01-29T12:00:00Z"
}
```

**Validation** (existing):
- `title`: Required, 1-255 characters
- `dueDate`: Optional, must be valid ISO date format

**Error Responses**:
- `400 Bad Request`: Invalid title or dueDate format

---

### PUT /api/todos/:id

**Description**: Update a todo's title and/or due date  
**Method**: `PUT`  
**URL**: `/api/todos/:id`  
**Authentication**: None

**Request Body**:
```json
{
  "title": "Updated title",      // Optional
  "dueDate": "2026-03-01"        // Optional, can be null to clear
}
```

**Response**:
```json
Status: 200 OK
Content-Type: application/json

{
  "id": 1,
  "title": "Updated title",
  "dueDate": "2026-03-01",
  "completed": 0,
  "createdAt": "2026-01-25T10:00:00Z"
}
```

**Error Responses**:
- `404 Not Found`: Todo with specified ID does not exist
- `400 Bad Request`: Invalid title or dueDate

---

### PATCH /api/todos/:id/toggle

**Description**: Toggle a todo's completion status  
**Method**: `PATCH`  
**URL**: `/api/todos/:id/toggle`  
**Authentication**: None

**Request Body**: None required

**Response**:
```json
Status: 200 OK
Content-Type: application/json

{
  "id": 1,
  "title": "Submit report",
  "dueDate": "2026-01-28",
  "completed": 1,               // Toggled from 0 to 1
  "createdAt": "2026-01-25T10:00:00Z"
}
```

**Notes**:
- When todo is toggled to completed (`completed: 1`), frontend will stop displaying overdue indicator
- When toggled back to incomplete (`completed: 0`) and due date has passed, overdue indicator will reappear

**Error Responses**:
- `404 Not Found`: Todo with specified ID does not exist

---

### DELETE /api/todos/:id

**Description**: Delete a todo  
**Method**: `DELETE`  
**URL**: `/api/todos/:id`  
**Authentication**: None

**Response**:
```json
Status: 204 No Content
```

**Error Responses**:
- `404 Not Found`: Todo with specified ID does not exist

---

## Client-Side Data Processing

### Overdue Calculation

The frontend will enhance the todo object with derived properties:

**Input** (from API):
```json
{
  "id": 1,
  "title": "Submit report",
  "dueDate": "2026-01-28",
  "completed": 0,
  "createdAt": "2026-01-25T10:00:00Z"
}
```

**Enhanced** (in frontend state):
```javascript
{
  id: 1,
  title: "Submit report",
  dueDate: "2026-01-28",
  completed: 0,
  createdAt: "2026-01-25T10:00:00Z",
  // Derived properties (not from API)
  isOverdue: true,              // Calculated by dateUtils.isOverdue()
  overdueDuration: "1d overdue"  // Calculated by dateUtils.getOverdueDuration()
}
```

**Calculation Logic**:
```javascript
import { isOverdue, getOverdueDuration } from '../utils/dateUtils';

function enhanceTodo(todo) {
  if (!todo.dueDate || todo.completed) {
    return { ...todo, isOverdue: false, overdueDuration: null };
  }
  
  const overdue = isOverdue(todo.dueDate, todo.completed);
  const duration = overdue ? getOverdueDuration(todo.dueDate) : null;
  
  return { ...todo, isOverdue: overdue, overdueDuration: duration };
}
```

**Usage in Component**:
```javascript
function TodoCard({ todo }) {
  const { isOverdue, overdueDuration } = enhanceTodo(todo);
  
  return (
    <div className={`todo-card ${isOverdue ? 'overdue' : ''}`}>
      {/* ... */}
      {isOverdue && (
        <div className="overdue-indicator">
          ⚠️ OVERDUE
          <div className="overdue-duration">{overdueDuration}</div>
        </div>
      )}
    </div>
  );
}
```

## Why No Backend Changes?

**Rationale**:
1. **Separation of Concerns**: Overdue status is a presentation/display concern, not a data storage concern
2. **Simplicity**: No database schema changes, migrations, or backend logic modifications
3. **Accuracy**: Client-side calculation always reflects current date (no stale data)
4. **Performance**: Calculation is trivial (O(1), <1ms per todo)
5. **Scale**: Single-user app with small todo lists (<100 items typically)
6. **KISS Principle**: Simplest solution that meets requirements

**Future Consideration**: If the app scales to multi-user with thousands of todos, or if backend filtering/sorting by overdue status is needed, then backend calculation may be warranted. For now, client-side is sufficient.

## Contract Validation

**Existing tests cover all endpoints.** No new contract tests needed.

**Frontend responsibilities**:
- Consume existing API responses unchanged
- Calculate overdue status from `dueDate`, `completed`, and current date
- Display overdue indicators in UI
- Maintain 80%+ test coverage for new display logic

**Backend responsibilities**:
- Continue providing valid `dueDate` (ISO format) and `completed` (0/1) fields
- Maintain existing validation rules
- No changes required for this feature

## OpenAPI Specification

Since no API changes are required, the existing OpenAPI spec (if one exists) remains unchanged. For reference, the existing endpoints would be documented as shown above.

If a formal OpenAPI 3.0 spec is needed in the future, it would follow this structure:

```yaml
openapi: 3.0.0
info:
  title: Todo API
  version: 1.0.0
paths:
  /api/todos:
    get:
      summary: Get all todos
      responses:
        '200':
          description: List of todos
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Todo'
  # ... other endpoints

components:
  schemas:
    Todo:
      type: object
      properties:
        id:
          type: integer
        title:
          type: string
          maxLength: 255
        dueDate:
          type: string
          format: date
          nullable: true
        completed:
          type: integer
          enum: [0, 1]
        createdAt:
          type: string
          format: date-time
      required:
        - id
        - title
        - completed
        - createdAt
```

## Summary

- ✅ No API endpoint changes required
- ✅ Existing responses provide all necessary data
- ✅ Frontend calculates overdue status client-side
- ✅ Backend remains unchanged (zero risk, zero migration)
- ✅ Aligns with KISS principle and separation of concerns
