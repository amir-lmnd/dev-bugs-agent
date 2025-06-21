import { pullBugDataFromFibery } from "../../lib/services/bug_data.service";

async function main() {
  try {
    const bugs = await pullBugDataFromFibery();
    console.log(bugs);
  } catch (error) {
    console.error("❌ Error in main:", error);

    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    process.exit(1);
  }
}

main();
