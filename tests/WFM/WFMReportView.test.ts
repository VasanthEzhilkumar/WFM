import test from '@lib/BaseTest';
import { getRowNumberByEmployeeID, writeResultsToExcel } from '@lib/Excel';
import { excelToJson, getExcelFilePath } from '@lib/ExceltoJsonUtil';
import path from 'path';

// Define the relative directory path to your Excel file
const dataDirectory = path.resolve(__dirname, '../Data');
const excelFileName = 'ReportView_SK_REG_COMPLETE_updated.xlsx';
const excelFilePath = getExcelFilePath(excelFileName);

// Convert the Excel sheets to JSON format
const sheetsJson = excelToJson(excelFilePath);

// Ensure the sheet exists
const sheetName = 'Sheet1';  // Update this if your sheet has a different name
if (!sheetsJson[sheetName]) {
    throw new Error(`Sheet '${sheetName}' not found in the Excel file.`);
}

// Group the data by EmpID
const groupedData = sheetsJson[sheetName].reduce((acc, row) => {
    if (!acc[row.EMPID]) {
        acc[row.EMPID] = [];
    }
    acc[row.EMPID].push(row);
    return acc;
}, {});

let index = 0;
// Iterate over each grouped dataset and run the test
for (const empId in groupedData) {
    const dataSet = groupedData[empId];

    // // Iterate over each dataset and run the test
    // for (const sheetName in sheetsJson) {
    //     const dataSet = sheetsJson[sheetName];

    //     dataSet.forEach((data, index) => {
    // Create a unique title by appending the sheet name and the index
    const testTitle = `@WFM Report view for ${dataSet[index].EMPID || `Employee ${dataSet[index] + 1}`} in sheet ${sheetName} (Row ${index + 1})`;
    test(testTitle, async ({ loginPage, wfmhomepage, wfmreportpage }) => {
        await test.step('Navigate to Application', async () => {
            await loginPage.navigateToURL();
        });

        await test.step('Login into WFM Application', async () => {
            await loginPage.changelanguage();
            await loginPage.logininASManager();
        });

        let EmpName: string;

        await test.step('Open Maintenance Menu page', async () => {
            await wfmhomepage.ClickonMainMenu();
            await wfmhomepage.openReportView();
        });

        await test.step('Validate the Reports ', async () => {
            await wfmreportpage.runReportLibrary();
            //it will return row number 
            let rowNumber = await getRowNumberByEmployeeID(excelFilePath, sheetName, dataSet[index].EMPID);
            for (const data of dataSet) {
                const result = await wfmreportpage.validateReports2(data.ReportName, data.Expected)
                //It will write result to excel sheet by rowNumber(index)
                await writeResultsToExcel(excelFilePath, 'Sheet1', rowNumber - 1, data.EMPID, result);
                rowNumber = rowNumber + 1;
            }
            index = index + 1;
        });


    });

}
