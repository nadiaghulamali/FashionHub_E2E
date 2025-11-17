import axios from "axios";
import * as fs from "fs";
import * as path from "path";
import * as ExcelJS from "exceljs";

const REPO_OWNER = "appwrite";
const REPO_NAME = "appwrite";

/**
 * Fetches the list of open Pull Requests from GitHub and generates a formatted Excel file (.xlsx).
 * @returns The file path of the generated Excel report.
 */
export async function generateFinalPrExcel() {
  const apiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/pulls?state=open`;

  const outputDir = path.join(process.cwd(), "reports/github");
  const outputFile = path.join(outputDir, "open_prs_latest.xlsx");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log("Fetching open PRs...");
  const resp = await axios.get(apiUrl, {
    headers: { "User-Agent": "Playwright-Automation" }
  });

  const prs = resp.data;
  console.log(`Received ${prs.length} PRs.`);

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Open PRs");

  // 1. Define Columns, 
  sheet.columns = [
    { header: "PR Name", key: "title", width: 50 },
    { header: "Created Date", key: "created", width: 15 },
    { header: "Author", key: "author", width: 20 },
    { header: "URL", key: "url", width: 70 }, 
  ];

  // 2. Style the header row for readability
  sheet.getRow(1).eachCell(cell => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } }; // White bold text
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1F4E78" } // Dark blue background
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
  });

  // 3. Populate data rows
  prs.forEach((pr: any) => {
    // Helper function for date formatting (DD-MM-YYYY)
    const d = new Date(pr.created_at);
    const date = `${String(d.getDate()).padStart(2,"0")}-${String(d.getMonth()+1).padStart(2,"0")}-${d.getFullYear()}`;

    // Add row data, gracefully handling missing fields
    sheet.addRow({
      title: pr.title || 'Unknown Title',
      created: date || 'Unknown Date',
      author: pr.user?.login || 'Unknown Author',
      url: pr.html_url || 'Unknown URL' // Included URL
    });
  });

  // 4. Add summary row
  sheet.addRow([`Total Open PRs: ${prs.length}`]).font = { bold: true };
  
  // Apply auto-filter to the header row for ease of use
  if (prs.length > 0) {
     sheet.autoFilter = 'A1:D1';
  }

  console.log("Saving Excel:", outputFile);
  await workbook.xlsx.writeFile(outputFile);

  console.log("Excel Saved!");
  return outputFile;
}