/**
 * Date utility functions for todo overdue calculations
 */

/**
 * Check if a todo is overdue
 * @param {string|null} dueDate - ISO date string (YYYY-MM-DD)
 * @param {boolean|number} completed - Completion status (0 or false = incomplete, 1 or true = complete)
 * @returns {boolean} True if incomplete and past due date
 */
export function isOverdue(dueDate, completed) {
  // Return false if no due date or completed
  if (!dueDate || completed) {
    return false;
  }
  
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
 * @returns {string} Formatted duration (e.g., "2d overdue", "1w overdue", "1mo overdue")
 */
export function getOverdueDuration(dueDate) {
  const due = new Date(dueDate);
  const today = new Date();
  
  // Set to midnight for consistent calculation
  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
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
