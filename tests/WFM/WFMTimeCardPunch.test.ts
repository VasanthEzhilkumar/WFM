
import test from '@lib/BaseTest';
import { getRowNumberByCellValue, writeResultToExcel } from '@lib/Excel';
import { excelToJson, getExcelFilePath } from '@lib/ExceltoJsonUtil';

// Define the relative directory path to your Excel file
const excelFileName = 'TimecardPunch_Amy2.xlsx';
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

// Iterate over each grouped dataset and run the test
for (const empId in groupedData) {
    const dataSet = groupedData[empId];

    test(`@WFM Time card punch for ${empId}`, async ({ loginPage, wfmhomepage, wfmtimecardpage, webActions }) => {

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
            await wfmtimecardpage.selectPreviousPayPeriod();
            for (const data of dataSet) {
                // Handle punch-in/punch-out actions for each day
                const result = await wfmtimecardpage.pucnInPunchOutByDate(data.Date, String(data.PunchIn), String(data.PunchOut), String(data.PunchIn2), String(data.PunchOut2));
                const rowNumber = await getRowNumberByCellValue(excelFilePath, sheetName, data.EmpNum, data.Date);
                //It will write result to excel sheet by rowNumber(index)
                await writeResultToExcel(excelFilePath, sheetName, rowNumber, result, 'TestResult');
            }
        });

        await test.step('Save the timesheet and validate if there are no errors ', async () => {
            //await wfmtimecardpage.saveTimesheet();
        })
    });
}


