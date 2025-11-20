import { generateFinalPrExcel } from "./src/utils/generatePrExcel";
import * as fs from "fs";
import * as path from "path";

export default async function globalTeardown() {
  console.log("Global Teardown Triggered");

  try {
    console.log("Generating Excel file...");
    const filePath = await generateFinalPrExcel();
    console.log("Excel file generated successfully at:", filePath);

    console.log("Ensuring file system is flushed...");
    
    // WAIT LONGER to guarantee file system sync inside Docker
    await new Promise(res => setTimeout(res, 10000));

    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      console.log("File exists. Size:", stats.size, "bytes");
    } else {
      console.error("Excel file NOT FOUND after wait:", filePath);
    }

  } catch (err) {
    console.error("Error during Excel generation:", err);
  }

  console.log("Final teardown wait...");
  await new Promise(res => setTimeout(res, 3000));

  console.log("Global teardown finished.");
}
