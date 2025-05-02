
import { AutoSendReport } from '@lib/AutoSendReport';
import test from '@lib/BaseTest';
import { getRowNumberByCellValue, writeResultToExcel } from '@lib/Excel';
import { excelToJson, getExcelFilePath } from '@lib/ExceltoJsonUtil';

// Define the relative directory path to your Excel file
const excelFileName = '(2) TimecardPunchExceptions_T&A_SK_REG_COMPLETE.xlsx';
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
    if (!acc[row.EmpNum]) {
        acc[row.EmpNum] = [];
    }
    acc[row.EmpNum].push(row);
    return acc;
}, {});
let index = 0
// Iterate over each grouped dataset and run the test
for (const empId in groupedData) {
    const dataSet = groupedData[empId];

    test(`@WFM Time card Exceptions for ${empId}`, async ({ loginPage, wfmhomepage, wfmtimecardpage, webActions }) => {

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
            EmpName = await webActions.getEmployeeName(empId);
        });

        await test.step('Open TimeCard page', async () => {
            await wfmhomepage.ClickonMainMenu();
            await wfmhomepage.OpenTimeCardPage();
        });

        await test.step('Search for the Employee in Time Card Page', async () => {
            await wfmtimecardpage.SearchEMP_Timecard(EmpName);
        });
        await test.step('Validate the Exceptions in Time Card Page after Punch In-Out ', async () => {
            await wfmtimecardpage.selectPayPeriodBydateRange(String(dataSet[index].StartDate), String(dataSet[index].EndDate));
            await wfmtimecardpage.clickListViewAndclickOnLoadMore();
            for (const data of dataSet) {
                // get Exceptions and error if any
                const result = await wfmtimecardpage.puchExceptions(data.Date, data.Exceptions, data.Expected);
                const rowNumber = await getRowNumberByCellValue(excelFilePath, sheetName, data.EmpNum, data.Date);
                //It will write result to excel sheet by rowNumber(index)
                await writeResultToExcel(excelFilePath, sheetName, rowNumber, result, 'TestResult');
            }
            index = index + 1;
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
