# A7M API - System Patterns

## Architecture Overview

A7M API follows a modular architecture based on NestJS principles, organized around domain-driven features with clear separation of concerns.

## Core Design Patterns

### Module-Based Structure

- Each domain feature is encapsulated in its own module (users, auth, problems, solutions, submissions)
- Modules contain controllers, services, entities, DTOs, and related components
- Promotes high cohesion and low coupling

### Repository Pattern

- TypeORM repositories provide data access abstraction
- Services interact with repositories rather than directly with the database
- Enables easier testing and database implementation swapping

### Dependency Injection

- NestJS's built-in DI container manages service instantiation and dependencies
- Promotes testability and modularity
- Simplifies service composition

### DTO Pattern

- Data Transfer Objects define the structure of incoming and outgoing data
- Separate DTOs for creation, updating, and responses
- Used with class-validator for input validation

### Guard-Based Authorization

- JWT-based authentication using Guards and Strategies
- Role-based access control for secured endpoints
- Custom decorators for clean controller implementation

## Component Relationships

### Core Flow

1. Request enters through a controller endpoint
2. Guards validate authentication/authorization
3. DTOs validate and transform input data
4. Controller delegates to service layer
5. Services implement business logic
6. Repositories handle data persistence
7. Response is transformed and returned

### Cross-Cutting Concerns

- Exception filters handle error responses
- Interceptors manage request/response transformations
- Pipes validate and transform input data
- Middleware handles common processing tasks

## Data Model

The system is built around these key entities:

- Users: Account information and authentication
- Problems: Coding challenges with descriptions, constraints, and test cases
- Solutions: Official solutions to problems
- Submissions: User attempts at solving problems
- Tags: Categorization system for problems

## Integration Points

- S3 service for file storage
- Email service for notifications
- External judging system (likely through the coding module)
