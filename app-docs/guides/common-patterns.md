# Common Patterns

This document contains a list of common patterns and reusable utilities in this project. Adding to this document will help the AI avoid reinventing the wheel.

## API Standards

- **Error Handling:** All API endpoints should use the `handleError` utility for consistent error responses.
- **Authentication:** All protected routes should use the `authenticate` middleware.

## Design Patterns

- **Singleton:** The `Database` class is implemented as a singleton to ensure a single connection pool.
