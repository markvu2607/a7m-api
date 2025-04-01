# A7M API - System Patterns

## Architecture Overview

A7M API follows a modular architecture based on NestJS principles, organized around domain-driven features with clear separation of concerns.

## Core Design Patterns

### Module-Based Structure

- Each domain feature is encapsulated in its own module (users, auth, problems, solutions, submissions, coding)
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

### Service Adapter Pattern

- External services are wrapped in adapter services (Judge0Service)
- Core business logic interacts with adapters rather than directly with external APIs
- Enables easier switching of external services and simplified testing

## Component Relationships

### Core Flow

1. Request enters through a controller endpoint
2. Guards validate authentication/authorization
3. DTOs validate and transform input data
4. Controller delegates to service layer
5. Services implement business logic
6. Repositories handle data persistence or external services are called
7. Response is transformed and returned

### Code Execution Flow

1. User submits code to the coding controller
2. CodingService processes the submission
3. Judge0Service sends code to the Judge0 API
4. System solution is executed to generate expected outputs
5. User solution is executed and compared against expected outputs
6. Results are recorded in the submission repository
7. Formatted response is returned to the user

### Cross-Cutting Concerns

- Exception filters handle error responses
- Interceptors manage request/response transformations
- Pipes validate and transform input data
- Middleware handles common processing tasks
- Cache manager provides Redis-based caching capabilities

## Data Model

The system is built around these key entities:

- Users: Account information and authentication
- Problems: Coding challenges with descriptions, constraints, and test cases
- Solutions: Official solutions to problems
- Submissions: User attempts at solving problems with execution results
- Tags: Categorization system for problems
- Testcases: Input/output pairs for validating solutions

## Integration Points

- S3 service for file storage
- Email service for notifications
- Judge0 API for code execution and evaluation
- Redis for caching and token blacklisting
