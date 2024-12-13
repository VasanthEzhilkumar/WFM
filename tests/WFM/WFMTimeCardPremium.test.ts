import test from '@lib/BaseTest';
import { writeResultsToExcel } from '@lib/Excel';
import { excelToJson, getExcelFilePath } from '@lib/ExceltoJsonUtil';
import { CurrentPayPeriodPage } from 'pageFactory/commonPages/CurrentPayPeriodPage';
import path from 'path';

// Define the relative directory path to your Excel file
const dataDirectory = path.resolve(__dirname, '../Data');
const excelFileName = 'TimeCardPremiumN.xlsx';
const excelFilePath = getExcelFilePath(excelFileName);

// Convert the Excel sheets to JSON format
const sheetsJson = excelToJson(excelFilePath);

// Iterate over each dataset and run the test
for (const sheetName in sheetsJson) {
    const dataSet = sheetsJson[sheetName];

    dataSet.forEach((data, index) => {
        // Create a unique title by appending the sheet name and the index
        const testTitle = `@WFM Validate Pay Code and Total for Employee ${data.EmpID || `Employee ${index + 1}`} in sheet ${sheetName} (Row ${index + 1})`;
        test(testTitle, async ({ loginPage, wfmhomepage, wfmtimecardpage, webActions, currentPayPeriodPage }) => {
            await test.step('Navigate to Application', async () => {
                await loginPage.navigateToURL();
            });

            await test.step('Login into WFM Application', async () => {
                await loginPage.changelanguage();
                await loginPage.logininASManager();
            });

            let EmpName: string;

            await test.step('Open schedule Planner page', async () => {
                await wfmhomepage.ClickonMainMenu();
                await wfmhomepage.openSchedulePlannerPage();
                EmpName = await webActions.getEmployeeName(data.EmpID);
            });

            await test.step('Open TimeCard page', async () => {
                //await wfmhomepage.TimeOff();
                await wfmhomepage.ClickonMainMenu();
                await wfmhomepage.OpenTimeCardPage();
            });

            await test.step('Search for the Employee in Time Card Page', async () => {
                await wfmtimecardpage.SearchEMP_Timecard(EmpName || `Employee ${index + 1}`);
                //step added to select the payrange 
                await currentPayPeriodPage.setCurrentPayPeriod(data.FromDate, data.ToDate);
                //step added for validation for Paycode and Totals
                const result = await wfmtimecardpage.ValidateTotal2(data.Paycode, data.Total,data.Exp);
                writeResultsToExcel(excelFilePath, sheetName, index, "", result);
            });
        });
    });
}
