You need to remove a failed experimental feature and its feature flag. The experiment did not produce the desired results and should be completely removed from the codebase.

Start by searching the codebase to find all references to the experiment. Use the Task tool to search for the experiment name, feature flag, strategy implementation, and any related tests. This is critical to ensure you don't miss anything.

Create a todo list using TodoWrite to track the removal of: the experimental strategy implementation, strategy enum value, factory case, feature flag enum, feature flag checks, related tests, and any documentation or comments mentioning the experiment.

Begin removal in reverse order of dependencies to avoid TypeScript errors:

First, remove the feature flag check from apps/cxllm/src/cx/services/experiments.ts. Find the if statement that checks for your experiment's feature flag and remove the entire block.

Next, remove the strategy case from apps/cxllm/src/cx/services/strategies/factory.ts. Remove both the import statement for the strategy and its case in the switch statement.

Remove the experimental strategy implementation from the strategies file (e.g., apps/cxllm/src/cx/services/strategies/accurate.ts). Delete the entire export const block for your experiment strategy.

Remove the strategy name from libs/persisted-tools/src/types/strategies.types.ts in the LLMExecutionStrategyName enum. This will cause TypeScript errors if you missed any references.

Remove the feature flag from apps/cxllm/src/clients/ab_test/types.ts in the FeatureFlagName enum.

Remove or update any tests that reference the experiment. In apps/cxllm/src/cx/services/experiments.test.ts, remove test cases that verify the experimental feature flag behavior. Also search for any other test files that might reference the experiment.

Search for any comments, TODOs, or documentation that mention the experiment and remove them. Use grep to find any remaining references: grep -r "YourExperimentName" apps/cxllm

After each removal step, run npx nx run cxllm:tsc to catch any missed references. The TypeScript compiler will help you find anywhere the removed code was still being used.

Finally, run npx nx run cxllm:lint --fix to clean up any formatting issues and run the test suite to ensure nothing is broken: npx nx run cxllm:test

Common cleanup locations:
- Remove unused imports that were only used by the experiment
- Check for any configuration files that might reference the experiment
- Look for any metrics or logging code specific to the experiment
- Review any related PRs or documentation that mentioned the experiment

Important: Make sure to communicate with the team about removing the experiment, as there may be active A/B tests or users still on the experimental path.

$ARGUMENTS