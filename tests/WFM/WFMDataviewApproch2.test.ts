import test from '@lib/BaseTest';
import { getRowNumberByCellValue, getRowNumberByEmployeeID, writeResultsToExcel, writeResultToExcel } from '@lib/Excel';
import { excelToJson, getExcelFilePath } from '@lib/ExceltoJsonUtil';
import wfmDatapage from '@lib/BaseTest';
import path from 'path';

// Define the relative directory path to your Excel file
const excelFileName = 'DataView_SK_REG_COMPLETE_updated1 - Copy.xlsx';
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

// Iterate over each dataset and run the test

for (const empId in groupedData) {
    const dataSet = groupedData[empId];

    // dataSet.forEach((data, index) => {
    //     // Create a unique title by appending the sheet name and the index
    //     const testTitle = `@WFM Dataview ${data.EmpNum || `Employee ${index + 1}`} in sheet ${sheetName} (Row ${index + 1})`;
    test(`@WFM Dataview Approch2 for ${empId}`, async ({ loginPage, wfmhomepage, wfmDatapage, }) => {
        await test.step('Navigate to Application', async () => {
            await loginPage.navigateToURL();
        });

        await test.step('Login into WFM Application', async () => {
            await loginPage.changelanguage();
            await loginPage.logininfromExcelMgr(dataSet[index].EmpID, dataSet[index].Password);
        });

        await test.step('Open Maintenance Menu page', async () => {
            await wfmhomepage.ClickonMainMenu();
            // Assuming this is a method that checks the availability of the DataView
            const isDataViewAvailable = await wfmhomepage.isDataViewAvailable();
            let i = 0;
            let row:number= await getRowNumberByEmployeeID(excelFilePath, sheetName, dataSet[index].EmpID);
            for (const data of dataSet) {

                if (isDataViewAvailable) {
                    if (i === 0) {
                        await wfmhomepage.openDataView();
                        i ++;
                    }
                    //await wfmDatapage.validateDataViewReports2(data.Expected, data.ReportName);
                    const result = await wfmDatapage.validateDataViewReports2(data.Expected, data.ReportName);

                    await writeResultsToExcel(excelFilePath, sheetName, row-1, data.EmpID, result);

                    row ++;



                } else {
                    console.log("DataView is not available, marking test as failed.");
                    try {
                        await writeResultsToExcel(excelFilePath, sheetName, index, dataSet[index].EmpID, 'Passed: Manager ID Not Having Dataview');
                    } catch (error) {
                        console.error('Error writing results to Excel:', error);
                    }
                    break;

                }
            }


        });


    });

}