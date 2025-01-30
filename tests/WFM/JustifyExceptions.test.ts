
import test from '@lib/BaseTest';
import { getRowNumberByCellValue, writeResultToExcel, writeResultsToExcel } from '@lib/Excel';
import { excelToJson, getExcelFilePath } from '@lib/ExceltoJsonUtil';

// Define the relative directory path to your Excel file
const excelFileName = 'TestRun - Copy.xlsx';
const excelFilePath = getExcelFilePath(excelFileName);

// Convert the Excel sheets to JSON format
const sheetsJson = excelToJson(excelFilePath);

// Log the keys to verify the sheet names
console.log("Available Sheets: ", Object.keys(sheetsJson));

// Ensure the sheet exists
const sheetName = 'Sheet1';  // Update this if your sheet has a different name
if (!sheetsJson[sheetName]) {
    throw new Error(`Sheet '${sheetName}' not found in the Excel file.`);
}

// Group the data by EmpID
const groupedData = sheetsJson[sheetName].reduce((acc, row) => {
    if (!acc[row.EmpID]) {
        acc[row.EmpID] = [];
    }
    acc[row.EmpID].push(row);
    return acc;
}, {});
let index = 0;
// Iterate over each grouped dataset and run the test
for (const empId in groupedData) {
    const dataSet = groupedData[empId];

    test(`@WFM Time card punch for ${empId}`, async ({ loginPage, wfmhomepage, wfmtimecardpage, webActions }) => {

        await test.step(`Navigate to Application`, async () => {
            await loginPage.navigateToURL();
        });

        await test.step('Login into WFM Application', async () => {
            await loginPage.changelanguage();
            await loginPage.logininASManager();
        });

        await test.step('Verify Manage schedule time card Exists', async () => {
            await wfmhomepage.searchEmpviaEmpSearch(empId, "Timecard");
        });

        await test.step('Select Pay Period in the Timecard Page', async () => {
            
        });

        await test.step('Select All the exceptions and provide justify reasons', async () => {
            for (const data of dataSet) {
                await wfmtimecardpage.selectPayPeriodBydateRange(String(data.FromDate), String(data.ToDate));
                const justificationStatus = await wfmtimecardpage.justifyExceptions(data.Paycodes); // Run justification

                // Write status to Excel
                await writeResultsToExcel(excelFilePath, sheetName, index, "Justification Status", justificationStatus);
                index = index + 1;
            }
            
        });




    });


}
