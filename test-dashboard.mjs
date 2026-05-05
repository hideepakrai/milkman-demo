import { getDashboardData } from "./src/lib/data-service.js";

async function main() {
  try {
    const data = await getDashboardData();
    console.log("Success:", Object.keys(data));
  } catch (err) {
    console.error("Error executing getDashboardData:", err);
  }
}

main();
