# Commit, Push, and PR Workflow

Complete the full workflow to commit, push, and create a pull request for your changes:

1. First, compare your branch changes to master using git diff to understand what will be included
2. Run typecheck (npx nx run cxllm:tsc) and linting (npx nx run cxllm:lint --fix) to ensure code quality
3. Fix any errors found and repeat verification until all checks pass
4. Stage all relevant files for commit
5. Create a commit following the monorepo's Git conventions:
   - Use a type prefix: feat, fix, docs, style, refactor, perf, test, build, ci, chore, or revert
   - Write a highly descriptive message that provides complete context
   - Explain the rationale behind changes, alternative approaches considered, technical decisions made, and clear next steps
   - Format as 'type: detailed description'
   - Add "[agent]" at the end of the message for metric tracking
   - Do not include attribution messages like 'Generated with Claude Code'
6. Push your changes to the remote repository
7. Create a pull request with a comprehensive description that explains the changes

Example commit message:

```text
refactor: optimize database query performance in user lookup service

This refactor addresses performance bottlenecks identified in the user lookup service where queries were taking 2-3 seconds under load. The optimization reduces query time to under 200ms by implementing proper indexing and query restructuring.

Changes implemented:
- Added composite index on (user_id, status, created_at) columns
- Replaced multiple JOIN operations with targeted subqueries
- Implemented query result caching with 5-minute TTL
- Removed unnecessary SELECT * and specified required columns only

Technical decisions:
- Chose composite index over multiple single indexes based on query pattern analysis
- Used Redis for caching instead of in-memory cache for better scalability
- Kept backward compatibility by maintaining the same API interface

Performance improvements measured:
- Average query time: 2.3s → 180ms (92% improvement)
- Database CPU usage reduced by 40%
- Concurrent request handling increased from 50 to 200 RPS

Next steps:
- Monitor production metrics for 2 weeks
- Consider similar optimizations for the policy lookup service
- Document query optimization patterns for team reference

[agent]
```

Example PR description:

```markdown
## Summary
Optimized database query performance in the user lookup service, reducing average query time from 2.3 seconds to 180ms through strategic indexing and query restructuring.

## Changes

### Query Optimization
- Added composite index on (user_id, status, created_at) for faster lookups
- Replaced multiple JOIN operations with targeted subqueries
- Implemented Redis-based query result caching with 5-minute TTL
- Removed SELECT * queries and specified only required columns
- Maintained backward compatibility with existing API interface
```