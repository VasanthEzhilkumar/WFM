import test from '@lib/BaseTest';
import { writeResultsToExcel } from '@lib/Excel';
import { excelToJson, getExcelFilePath } from '@lib/ExceltoJsonUtil';
import path from 'path';


// Define the relative directory path to your Excel file
const dataDirectory = path.resolve(__dirname, '../Data');
const excelFileName = 'WFMSchedulePlanner_SK_REG - Copy.xlsx';
const excelFilePath = getExcelFilePath(excelFileName);

// Convert the Excel sheets to JSON format
const sheetsJson = excelToJson(excelFilePath);

// Iterate over each dataset and run the test
for (const sheetName in sheetsJson) {
    const dataSet = sheetsJson[sheetName];

    dataSet.forEach((data, index) => {
        // Create a unique title by appending the sheet name and the index
        const testTitle = `@WFM Schedule Planer Front End for ${data.EMPID || `Employee ${index + 1}`} in sheet ${sheetName} (Row ${index + 1})`;
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
                await wfmtimecardpage.selectPayPeriodBydateRange(String(data.ScheduleStartDate), String(data.ScheduleEndDate));
                EmpName = await webActions.getEmployeeName(data.EMPID);
            });
            //Schedule Planer Front End
            await test.step('Serach for employee and Add Shift', async () => {
                // await wfmtimecardpage.selectPayPeriodBydateRange(String(data.ScheduleStartDate), String(data.ScheduleEndDate));
                // await wfmscheduleplannerpage.setCurrentPayPeriod(data.FromDate, data.ToDate)
                await wfmhomepage.rightclickEmp(data.EMPID);
                await wfmhomepage.clickAddShift();
                await wfmhomepage.enterstarttimeendtime(data.ScheduleStartTime, data.ScheduleEndTime, data.ScheduleStartDate, data.ScheduleEndDate);
                const result = await wfmhomepage.validateSchedulePlanner();
                await writeResultsToExcel(excelFilePath, sheetName, index, "", result);
            });
        });
    });

}