# A7M API - Active Context

## Current Focus

The A7M API project is a NestJS-based backend for a coding platform or online judge system. The current focus is on the coding execution and evaluation functionality through the recently developed coding module, which integrates with Judge0 for code execution.

## Recent Changes

- Implementation of the coding module with Judge0 integration
- Development of code execution endpoints for running and submitting code
- Integration of submission processing with problem management
- Implementation of testcase handling and result validation
- Creation of NestJS standards rule to maintain consistent code quality and architecture

## Current State

The project has several key modules implemented:

- Authentication system with JWT
- User management with password reset functionality
- Problems management with testcase support
- Solutions management
- Submissions processing and tracking
- Tag system for problem categorization
- S3 integration for file storage
- Email service integration
- Coding module with Judge0 integration for code execution and evaluation

## Active Decisions

- Using Judge0 as the code execution engine
- Implementing a two-phase code evaluation process:
  1. Run system solution to generate expected outputs
  2. Run user code and compare against expected outputs
- Testing solutions against multiple testcases and stopping at the first failure
- Storing detailed submission information for future reference
- Adopting standardized NestJS development practices as documented in the `.cursor/rules/nestjs-rules/rule-nestjs-standards-agent.mdc` file

## Next Steps

1. Enhance the coding module with more language support
2. Implement batch submission processing for efficiency
3. Add performance metrics and execution time limits
4. Develop comprehensive error handling for code execution edge cases
5. Implement caching strategies for common operations
6. Add support for custom test cases submitted by users
7. Ensure all code follows the established NestJS standards

## Open Questions

- What is the current deployment strategy?
- How can the code execution be optimized for better performance?
- Are there any security considerations for the code execution environment?
- How should the system handle very large testcases or outputs?
- What is the state of the front-end application that consumes this API?

## Current Challenges

- Ensuring secure execution of user-submitted code
- Handling edge cases in different programming languages
- Managing execution timeouts and resource limits
- Scaling the code execution service efficiently
- Providing meaningful feedback for different types of code failures
- Maintaining consistency across the codebase as it grows
