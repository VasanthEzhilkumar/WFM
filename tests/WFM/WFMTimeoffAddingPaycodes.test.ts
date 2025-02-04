import test from '@lib/BaseTest';
import { writeResultsToExcel } from '@lib/Excel';
import { excelToJson, getExcelFilePath } from '@lib/ExceltoJsonUtil';
import path from 'path';

// Define the relative directory path to your Excel file
const dataDirectory = path.resolve(__dirname, '../Data');
// const excelFileName = 'WFMEnterTimeOff_AddPaycode_Updated_SmokeTest.xlsx';
const excelFileName = '(3) AddPaycode_Updated_COMPLETE_.xlsx';

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
                await wfmhomepage.openSchedulePlannerForEmployee(data.EmpID);
                await wfmtimecardpage.selectPayPeriodBydateRange(String(data.RangeStartDate), String(data.RangeEndDate));
                EmpName = await webActions.getEmployeeName(data.EmpID);
            });

            await test.step('Select Add PayCode for the Emp', async () => {
                await wfmhomepage.rightclickEmp(data.EmpID);
                await wfmhomepage.clickOnAddPayCode();
                await wfmhomepage.enterTimeOffByaddPayCode(String(data.Paycode).trim(), String(data.Duration), String(data.RangeStartDate));
            });

            await test.step('Validate the Add PayCode', async () => {
                const result = await wfmhomepage.validateAddPaycodes(data.EmpID, data.Paycode, data.StartDate, data.EndDate)
                //const rowNumber = await getRowNumberByCellValue(excelFilePath, sheetName, data.EmpID, data.StartDate);
                //It will write result to excel sheet by rowNumber(index)
                //await writeResultToExcel(excelFilePath, sheetName, index, result, 'TestResult');
                await writeResultsToExcel(excelFilePath, sheetName, index, "", result);
            })
        });
    });
}
