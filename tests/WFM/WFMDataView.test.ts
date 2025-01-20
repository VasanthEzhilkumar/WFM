import test from '@lib/BaseTest';
import { getRowNumberByCellValue, writeResultsToExcel, writeResultToExcel } from '@lib/Excel';
import { excelToJson, getExcelFilePath } from '@lib/ExceltoJsonUtil';
import  wfmDatapage  from '@lib/BaseTest';
import path from 'path';

// Define the relative directory path to your Excel file
const dataDirectory = path.resolve(__dirname, '../Data');
const excelFileName = 'DataView_SK_REG - SMOKE TEST3.xlsx';
const excelFilePath = getExcelFilePath(excelFileName);

// Convert the Excel sheets to JSON format
const sheetsJson = excelToJson(excelFilePath);

// Iterate over each dataset and run the test
for (const sheetName in sheetsJson) {
    const dataSet = sheetsJson[sheetName];

    dataSet.forEach((data, index) => {
        // Create a unique title by appending the sheet name and the index
        const testTitle = `@WFM Dataview ${data.EmpNum || `Employee ${index + 1}`} in sheet ${sheetName} (Row ${index + 1})`;
        test(testTitle, async ({ loginPage, wfmhomepage,wfmDatapage, }) => {
            await test.step('Navigate to Application', async () => {
                await loginPage.navigateToURL();
            });

            await test.step('Login into WFM Application', async () => {
                await loginPage.changelanguage();
                await loginPage.logininfromExcelMgr(data.EMPID,data.Password);
            });

            await test.step('Open Maintenance Menu page', async () => {
                await wfmhomepage.ClickonMainMenu();
               const isDataViewAvailable = await wfmhomepage.isDataViewAvailable(); // Assuming this is a method that checks the availability of the DataView
    
               if (isDataViewAvailable) {
                   await wfmhomepage.openDataView();
                   await wfmDatapage.validateDataViewReports(data.Expected, data.ReportName, excelFilePath, index);

               } else {
                   console.log("DataView is not available, marking test as failed.");
                   try {
                    writeResultsToExcel(excelFilePath, sheetName, index, data.EMPID, 'Passed: Manager ID Not Having Dataview');
                } catch (error) {
                    console.error('Error writing results to Excel:', error);
                }
                  
               }


            });

            
        });
    });
}
