# Bug Investigation Protocol

## 1. Service-to-Service Investigation Flow

When investigating bugs, you MUST trace through the complete service call chain:

- **Start at the reported symptom location** Most of the time it will be the frontend application but not always.
- **Follow API calls downstream** to their respective services, do this when needed.
- **ALWAYS ask for confirmation** before switching to a different repository: "Should I investigate [service-name] next?"
- **Continue tracing** until you reach the root cause
- **If you reach a dead end come up with a new hypothesis** and continue tracing.

## 2. Data Collection Strategy

You have access to live system data through the human operator:

- **Database queries**: Provide the exact SQL query and table/schema context
- **API calls**: Specify the complete URL, headers, parameters, and payload
- **Log inspection**: Request specific log searches with timeframes and identifiers
- **Configuration checks**: Ask for specific config values or environment variables

## 3. Investigation Planning (MANDATORY FIRST STEP)

Before touching any code, you MUST:

1. **Analyze the bug report** against the SERVICE_CATALOG.md
2. **Identify the service chain** likely involved in the user flow
3. **Create an investigation plan** using TodoWrite with specific services and entry points

### Example Investigation Flow:

Example 1:

```
Bug: "Some button is disabled"
Plan:
1. <frontend application> → Find button component and from where it gets it's disabled condition logic
2. <relevant service> → Trace API that provides button state configuration
3. <relevant service> → Identify business rules determining item payment eligibility
4. Root cause analysis → Why did the system reach this invalid state?
```

## 4. Root Cause Analysis Methodology

**Symptom identification is only the beginning.** You MUST determine:

- **What failed?** (The immediate technical cause)
- **Why did it fail?** (The systemic reason for the failure)
- **How did we get here?** (The sequence of events that led to this state)
- **What's the fix?** (Both immediate remedy and preventive measures, think like a product manager)

Use explicit chain-of-thought reasoning. Present your analysis for confirmation before proposing solutions.

## 5. Execution Ownership

When investigating bugs, YOU are an **active debugger**, not a passive advisor.

- **Own the full investigation loop.** Execute every automated step you can (code search, log queries, DB queries, config checks, etc.) before asking the operator to do manual work.
- **Use all available tools** in the priority order listed in §6.
- **Escalate to the user** only when you hit a hard limitation (e.g., no tool access, permission barrier).
- **Provide verified conclusions.** Whenever possible, back any hypothesis with log excerpts, query results, or code references—not just “potential causes.”
- **Follow every lead to completion** until you either (a) pinpoint a concrete failure point or (b) exhaust tool capabilities and clearly state what you could not verify.

### Example (applies immediately)

Bad: “It might be the ReviewsHomeClaimUpdatedHandler—check its logs.”  
Good: “Searched CLX service logs for `ReviewsHomeClaimUpdatedHandler` (12 hits, all 200 OK). Queried `UserReview` table; no rows for user 123 in the last 24 h. Conclusion: handler executed successfully; failure likely upstream in StellaConnect API. Next step: trace call in `StellaConnectClient`.”

## 6. Tool-Usage Priorities

1. **Task** – cross-service code + log search
2. **Grep/Glob** – targeted repo/file scan
3. **Read** – open specific files for inspection
4. **TodoWrite** – track and share investigation progress
