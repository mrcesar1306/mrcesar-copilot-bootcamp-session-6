<!--
Sync Impact Report:
================================================================================
Version Change: Initial → 1.0.0
Principles Added:
  - Code Quality First (DRY, KISS, SOLID)
  - Test-Driven Development (NON-NEGOTIABLE)
  - Consistent Code Style
  - User Experience Focus
  - Maintainability & Documentation

Sections Added:
  - Core Principles (5 principles)
  - Technical Standards
  - Development Workflow
  - Governance

Templates Status:
  ✅ plan-template.md - Constitution Check section aligns with all 5 principles
  ✅ spec-template.md - Requirements structure supports constitution enforcement
  ✅ tasks-template.md - Task organization supports TDD and code quality principles

Follow-up TODOs: None - all placeholders filled
================================================================================
-->

# Todo App Constitution

## Core Principles

### I. Code Quality First

**DRY, KISS, and SOLID principles are NON-NEGOTIABLE.**

- Code MUST follow DRY (Don't Repeat Yourself): Extract common code into shared functions/utilities
- Code MUST follow KISS (Keep It Simple, Stupid): Prefer simple, straightforward implementations over complex ones
- Code MUST adhere to SOLID principles:
  - **Single Responsibility**: Each module/component has one reason to change
  - **Open/Closed**: Open for extension, closed for modification
  - **Liskov Substitution**: Subtypes must be substitutable for parent types
  - **Interface Segregation**: Depend on specific interfaces, not broad ones
  - **Dependency Inversion**: Depend on abstractions, not concrete implementations

**Rationale**: These principles ensure code maintainability, readability, and extensibility. They prevent technical debt accumulation and make the codebase easier to understand and modify.

### II. Test-Driven Development (NON-NEGOTIABLE)

**Tests MUST be written as part of the development process with 80%+ code coverage.**

- Tests MUST describe expected behavior before or alongside implementation
- Code coverage MUST be 80%+ across all packages (frontend and backend)
- Tests MUST focus on behavior, not implementation details
- Tests MUST be independent and not rely on other tests
- All tests MUST pass before code review approval
- Test utilities and fixtures MUST be used to reduce duplication

**Rationale**: TDD ensures code quality, catches bugs early, and serves as living documentation. The 80% coverage target provides confidence in code reliability while remaining pragmatic.

### III. Consistent Code Style

**All code MUST follow standardized formatting and naming conventions.**

- Indentation: 2 spaces for JavaScript, JSON, CSS, Markdown
- Line length: Max 100 characters for code
- Naming: `camelCase` for variables/functions, `PascalCase` for components/classes, `UPPER_SNAKE_CASE` for constants
- Import order: External libraries → Internal modules → Styles (with blank lines between groups)
- ESLint MUST pass with no errors or warnings before commits
- Pre-commit hooks MUST be followed

**Rationale**: Consistent style improves code readability, reduces cognitive load, and prevents style-related code review comments. ESLint automation catches errors early.

### IV. User Experience Focus

**UI MUST follow Material Design principles with accessibility and responsiveness.**

- All interactive elements MUST be keyboard accessible
- Color contrast MUST meet WCAG AA standards
- Focus indicators MUST be visible and distinct
- Design system colors, typography, and spacing (8px grid) MUST be followed
- Components MUST support both light and dark modes
- UI MUST be responsive (mobile, tablet, desktop breakpoints defined)

**Rationale**: Consistent, accessible design ensures usability for all users. Material Design provides proven patterns that users understand. Accessibility is a legal and ethical requirement.

### V. Maintainability & Documentation

**Code MUST be self-documenting with meaningful comments and proper error handling.**

- Comments MUST explain "why", not "what" (avoid obvious comments)
- JSDoc MUST be used for public functions and components
- Error handling MUST be implemented with try-catch blocks
- Error messages MUST be clear and actionable
- Git commits MUST be atomic with descriptive messages
- Feature branches MUST be used for new work
- Code review checklist MUST be completed before PRs

**Rationale**: Good documentation and error handling reduce maintenance burden and improve developer productivity. Clear Git practices enable collaboration and code review effectiveness.

## Technical Standards

**Technology Stack Requirements**

- **Frontend**: React, React Testing Library, Jest, CSS
- **Backend**: Node.js, Express.js, Jest
- **Architecture**: Monorepo using npm workspaces
- **Node Version**: v16 or higher
- **Package Manager**: npm v7 or higher

**Code Organization Standards**

- Frontend structure: `components/`, `services/`, `utils/`, `__tests__/`
- Backend structure: `routes/`, `controllers/`, `services/`, `middleware/`, `__tests__/`
- Tests MUST be colocated in `__tests__/` directories
- Test files MUST be named `{filename}.test.js`

**Performance & Quality Standards**

- Components MUST avoid unnecessary renders (use `useMemo`, `useCallback` appropriately)
- API responses MUST be handled asynchronously with proper error handling
- No `console.log` statements in production code (warnings in ESLint)
- Type safety via JSDoc annotations for critical functions

## Development Workflow

**Pre-Development Checklist**

1. Review functional requirements and design guidelines
2. Identify which principles apply to the feature
3. Plan test cases before implementation
4. Create feature branch from main

**Development Process**

1. Write tests first (or alongside implementation) that describe expected behavior
2. Ensure tests fail before implementing feature
3. Implement feature following code quality principles
4. Run tests and ensure they pass
5. Run ESLint and fix all errors/warnings
6. Verify code coverage meets 80%+ threshold

**Code Review Requirements**

All PRs MUST verify:
- [ ] Code follows naming conventions
- [ ] Imports are organized correctly
- [ ] No linting errors or warnings
- [ ] Code is DRY and avoids repetition
- [ ] Functions/components have single responsibility
- [ ] Error handling is implemented
- [ ] Comments are clear and helpful
- [ ] Tests are written for new functionality
- [ ] All tests pass
- [ ] Coverage meets 80%+ threshold
- [ ] Git commits are atomic and well-described
- [ ] No console.log statements in production code

**Definition of Done**

A feature is complete when:
1. All functional requirements are met
2. Tests are written and passing (80%+ coverage)
3. Code review checklist is complete
4. Documentation is updated (if applicable)
5. UI guidelines are followed (for frontend work)
6. All principles are satisfied

## Governance

**Constitution Authority**

This constitution supersedes all other development practices and guidelines. When conflicts arise between this document and other documentation, this constitution takes precedence.

**Amendment Process**

1. Amendments MUST be proposed via pull request to `.specify/memory/constitution.md`
2. Amendment rationale MUST be documented in the PR description
3. Impact on existing code and templates MUST be assessed
4. Version MUST be updated following semantic versioning:
   - **MAJOR**: Backward incompatible governance/principle removals or redefinitions
   - **MINOR**: New principle/section added or materially expanded guidance
   - **PATCH**: Clarifications, wording, typo fixes, non-semantic refinements
5. Templates and documentation MUST be updated to reflect changes
6. Sync Impact Report MUST be added to the top of the constitution file

**Compliance Review**

- All pull requests MUST verify compliance with constitution principles
- Code review MUST include constitution checklist verification
- Violations MUST be justified and documented (see "Complexity Tracking" in plan template)
- Regular audits SHOULD be conducted to ensure ongoing compliance

**Documentation References**

Runtime development guidance can be found in:
- `/docs/coding-guidelines.md` - Detailed coding standards and examples
- `/docs/testing-guidelines.md` - Comprehensive testing strategy
- `/docs/ui-guidelines.md` - Design system and UI specifications
- `/docs/functional-requirements.md` - Feature requirements
- `/docs/project-overview.md` - Architecture and technology overview

**Version**: 1.0.0 | **Ratified**: 2026-01-29 | **Last Amended**: 2026-01-29
