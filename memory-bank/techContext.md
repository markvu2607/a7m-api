# A7M API - Technical Context

## Core Technologies

### Framework

- **NestJS**: Primary framework providing the architectural foundation
- **TypeScript**: Programming language providing type safety and modern features
- **Express**: Underlying HTTP server (via NestJS platform-express)

### Data Storage

- **PostgreSQL**: Primary relational database
- **TypeORM**: Object-Relational Mapper for database interactions
- **S3-compatible storage**: For file storage (likely AWS S3 or compatible alternative)
- **Redis**: For caching via @nestjs/cache-manager and @keyv/redis, also used for token blacklisting

### Authentication & Security

- **JWT**: JSON Web Tokens for stateless authentication
- **Passport**: Authentication middleware with strategies
- **Argon2**: Secure password hashing
- **class-validator**: Input validation

### Communication

- **NestJS Mailer**: Email service integration
- **Nodemailer**: Underlying email sending capability
- **Axios**: HTTP client for external API communication
- **RxJS**: Reactive programming library for handling asynchronous operations

### Code Execution

- **Judge0**: External API for secure code execution in various languages
- **HTTP-based integration**: RESTful API calls to Judge0 service
- **Retry mechanism**: For handling in-progress code execution

### Testing

- **Jest**: Testing framework
- **Supertest**: HTTP testing utilities

## Development Tooling

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **SWC**: Fast TypeScript/JavaScript compiler for development
- **pnpm**: Package manager

## Third-Party Integrations

- Email service (via NestJS Mailer/Nodemailer)
- S3-compatible storage service
- Judge0 API for code execution (https://judge0.com/)
- Redis service for caching and token management

## Development Setup

### Requirements

- Node.js (latest LTS recommended)
- pnpm package manager
- PostgreSQL database
- Redis server
- S3-compatible storage account
- Judge0 API access or self-hosted instance

### Environment Configuration

Environment variables are managed through .env files and @nestjs/config:

- Database connection details
- JWT secrets and configuration
- Email service credentials
- S3 credentials and configuration
- Redis configuration
- Judge0 API endpoint and credentials

### Local Development Commands

```bash
# Install dependencies
pnpm install

# Development with hot reload
pnpm run start:dev

# Testing
pnpm run test
pnpm run test:e2e

# Building for production
pnpm run build
```

## Deployment

The application is designed to be deployed in various environments:

- Container-based deployment (likely Docker)
- Traditional Node.js hosting
- Serverless deployment (with adaptation)

## Technical Constraints

- API-only design (no server-side rendering)
- RESTful API principles
- Stateless architecture
- PostgreSQL as the database
- TypeScript as the development language
- Required external services: PostgreSQL, Redis, S3, Judge0
