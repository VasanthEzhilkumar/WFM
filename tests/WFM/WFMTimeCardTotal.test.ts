import { AutoSendReport } from '@lib/AutoSendReport';
import test from '@lib/BaseTest';
import { writeResultsToExcel } from '@lib/Excel';
import { excelToJson, getExcelFilePath } from '@lib/ExceltoJsonUtil';
import path from 'path';

// Define the relative directory path to your Excel file
const dataDirectory = path.resolve(__dirname, '../Data');
const excelFileName = 'Timecard_Total_Amy2.xlsx';
const excelFilePath = getExcelFilePath(excelFileName);

// Convert the Excel sheets to JSON format
const sheetsJson = excelToJson(excelFilePath);

// Iterate over each dataset and run the test
for (const sheetName in sheetsJson) {
    const dataSet = sheetsJson[sheetName];

    dataSet.forEach((data, index) => {
        // Create a unique title by appending the sheet name and the index
        const testTitle = `@WFM Validate Rule type for ${data.EmpNum || `Employee ${index + 1}`} in sheet ${sheetName} (Row ${index + 1})`;
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
                await currentPayPeriodPage.selectPayPeriodBydateRange(data.StartDate, data.EndDate);
                const result = await wfmtimecardpage.ValidateTotal(data.Paycode, data.Total);
                writeResultsToExcel(excelFilePath, sheetName, index, "", result);
            });
        });
    });
}

/* 
 * @author: Madhukar Kirkan 
 * @description: test.afterAll — This hook is used to execute the zipReport method, which compresses the HTML report into a ZIP file.
 */
test.afterAll('Zip the Html Report and Send Report to CLient ', async () => {
    const zipPath: any = await new AutoSendReport().zipReport(excelFileName);
    //await new AutoSendReport().sendEmail(String(zipPath));
});