# Create Pull Request

Compare your branch changes to master using git diff, then typecheck and lint your code. Fix any errors and repeat verification until clean. Once passing, commit with a descriptive message, push to the remote repository, and create a pull request for review.

Example PR description:

```markdown
## Summary
Implemented retry mechanism for failed API calls in the interaction service to improve reliability during transient network issues.

## Changes

### Retry Logic Implementation
- Added exponential backoff retry strategy with configurable max attempts (default: 3)
- Implemented circuit breaker pattern to prevent cascading failures
- Added detailed logging for retry attempts and failure reasons
- Created new configuration options for retry behavior customization
- Updated error handling to distinguish between retryable and non-retryable errors
```