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

## 6. Tool Usage Priorities

1. **Task tool**: For complex searches across multiple services
2. **Grep/Glob**: For targeted searches within known services
3. **Read**: For examining specific files identified through search
4. **TodoWrite**: For tracking investigation progress across services
