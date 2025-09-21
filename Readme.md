# Library Management System – TypeScript Project

## 1. Overview

This project is a modular Library Management System (LMS) implemented in TypeScript following object-oriented principles.  
It allows managing books and members, borrowing/returning books, calculating fines, and sending notifications.

---

**Key Goals:**

- Practice TypeScript + OOP patterns
- Learn Repository, Strategy, Observer patterns
- Understand service layer design, contracts, and error handling
- Build maintainable, modular, and scalable code

## 2. Features Implemented

### Core Features

- Add, remove, and list books
- Register and unregister members
- Borrow and return books
- Track borrowed books with timestamps

### Advanced Features

- Fine calculation using Strategy Pattern
- Different rules for Regular vs Premium members
- Notifications using Observer/EventBus Pattern
- `BOOK_OVERDUE`, `BOOK_RETURNED`, `NEW_BOOK_ADDED` events
- Custom error handling with specific error classes

---

## 3. Folder & Module Structure

```typescript

lms-project/
│── src/
│ │── index.ts
│ │
│ ├── contracts/ # Interfaces for dependencies
│ ├── entities/ # Core business objects (Book, Member)
│ ├── repositories/ # Implementations of repositories
│ ├── services/ # LibraryService with business logic
│ ├── strategies/ # Fine calculation strategies
│ ├── events/ # EventBus (Observer Pattern)
│ ├── errors/ # Custom error classes
│ ├── utils/ # Logger or helper utilities
│── package.json
│── tsconfig.json
```

**Why this structure:**

- Contracts separate interface from implementation → modular and testable
- Entities represent domain objects → encapsulate state & behavior
- Repositories abstract storage → can replace with DB in future
- Services hold business logic → orchestrate entities, repositories, and events
- Strategies allow swapping rules (fines) without touching core service
- Events decouple notification logic from service
- Errors provide readable, maintainable error handling

---

## 4. Flow of Operations

1. Create Repositories: `BookRepository`, `MemberRepository`
2. Create `EventBus`: subscribe to notifications (console/log)
3. Create `FineStrategies`: `SimpleFineCalculator` & `PremiumFineCalculator`
4. Create Service: `LibraryService` (inject repos, strategies, EventBus)
5. Add books / register members → triggers events
6. Borrow books → updates book availability, member borrowed books
7. Return books → marks books returned, publishes events
8. Calculate fines → uses injected strategy based on member type

**Key Principle:** Each layer has single responsibility, dependencies injected for decoupling.

---

## 5. Techniques & Patterns Learned

### Object-Oriented Principles

- Encapsulation: private properties (`_isAvailable`, `_borrowedBooks`)
- Cohesion: small focused methods (`borrowBook`, `markAsBorrowed`)
- Readonly properties for immutable IDs and names

### Design Patterns

- Repository Pattern: abstract CRUD for Book & Member
- Strategy Pattern: fine calculation varies by member type
- Observer Pattern (EventBus): decouples notifications from core logic

### Error Handling

- Custom error classes (`BookNotAvailableError`, `MemberLimitExceededError`)
- Thrown in service, caught globally in entry point

### TypeScript & Contracts

- Interfaces (`IBookRepository`, `ILibraryService`, `IFineCalculator`, `IEventBus`)
- Strong typing for predictability, autocompletion, maintainability

---

## 6. Key Lessons Learned

1. Always define interfaces/contracts before implementation → easy swapping, testing
2. Inject dependencies (repos, strategies, EventBus) → avoids tight coupling
3. Keep entities pure (Book, Member) → they just manage state
4. Service orchestrates → repositories + events + strategies
5. Events decouple actions → Observer pattern keeps system flexible
6. Use types & enums for consistency → e.g., `MemberType`, `EventTypeEnum`

---

## 7. Recommended Flow for New Modules / Features

1. Understand the user story / requirement
2. Define domain entities first → what objects & state are involved
3. Define contracts/interfaces → what operations are required
4. Implement repositories → abstract storage & CRUD
5. Implement core service layer → orchestrate entities & repositories
6. Inject strategies or event handling if needed → for flexibility
7. Implement errors, logger, and utils → support for debugging & maintenance
8. Test the flow → add, borrow, return, fine calculation, notifications
9. Document everything → contracts, flow, exceptions, events

---

## 8. Outcome

- Fully modular, testable, and scalable TypeScript LMS
- Applied OOP, TypeScript typing, design patterns in real-life scenario
- Learned how to structure code for maintainability
- Practiced dependency injection, event-driven design, strategy pattern

## To test the flow

- run command ` npm test`

## To see the minified version

- run command `npm run minify`

## To see the working output

- Run command `npm run build` it will compile ts files to javascript
- Run compiled file using node run ` node dist/index.js`
