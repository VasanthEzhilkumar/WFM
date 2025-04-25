import { AutoSendReport } from '@lib/AutoSendReport';
import test from '@lib/BaseTest';
import { writeResultsToExcel } from '@lib/Excel';
import { excelToJson, getExcelFilePath } from '@lib/ExceltoJsonUtil';
import path from 'path';

// Define the relative directory path to your Excel file
const dataDirectory = path.resolve(__dirname, '../Data');
// const excelFileName = 'WFMAddingPaycodes_EnterTimeOFF_SK_REG.xlsx';
const excelFileName = '(2) EnterTimeOFF_SK_REG -COMPLETE_Failed.xlsx';

const excelFilePath = getExcelFilePath(excelFileName);

// Convert the Excel sheets to JSON format
const sheetsJson = excelToJson(excelFilePath);

// Iterate over each dataset and run the test
for (const sheetName in sheetsJson) {
    const dataSet = sheetsJson[sheetName];

    dataSet.forEach((data, index) => {
        // Create a unique title by appending the sheet name and the index
        const testTitle = `@WFM Validate Rule type for ${data.EmpNum || `Employee ${index + 1}`} in sheet ${sheetName} (Row ${index + 1})`;
        test(testTitle, async ({ loginPage, wfmhomepage, wfmtimecardpage, webActions }) => {
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
                await wfmtimecardpage.selectPayPeriodBydateRange(String(data.RangeStartDate), String(data.RangeEndDate));
                EmpName = await webActions.getEmployeeName(data.EmpID);
            });

            await test.step('Select Timeoff for the Emp', async () => {
                await wfmhomepage.rightclickEmp(data.EmpID);
                await wfmhomepage.clicktimeoff();
                await wfmhomepage.enterTimeoffDetails2(data.Paycode);
            });

            await test.step('Select the dates ', async () => {
                await wfmhomepage.selectDatesandSubmit(data.StartDate, data.EndDate);
            });

            await test.step('Validate the Timeoff', async () => {
                const result = await wfmhomepage.clickDoneAndOpenScheduleForEmployee(data.EmpID);
                // await wfmtimecardpage.selectPayPeriodBydateRange(String(data.RangeStartDate), String(data.RangeEndDate));
                // const result = await wfmhomepage.validateTimeoff(data.EmpID, data.Paycode, data.StartDate, data.EndDate)
                //const rowNumber = await getRowNumberByCellValue(excelFilePath, sheetName, data.EmpID, data.StartDate);
                //It will write result to excel sheet by rowNumber(index)
                //await writeResultToExcel(excelFilePath, sheetName, index, result, 'TestResult');
                await writeResultsToExcel(excelFilePath, sheetName, index, "", result);

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
