
import test from '@lib/BaseTest';
import { getRowNumberByCellValue, writeResultToExcel } from '@lib/Excel';
import { excelToJson, getExcelFilePath } from '@lib/ExceltoJsonUtil';

// Define the relative directory path to your Excel file
const excelFileName = '(3)OvertimeApproval_SK_REG - COMPLETE.xlsx';
// const excelFileName = 'OvertimeApproval.xlsx';
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

    test(`@WFM Overtime Approval for ${empId}`, async ({ loginPage, wfmhomepage, wfmtimecardpage, webActions }) => {

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
        await test.step('Overtime Approval at Time Card Page after Punch In-Out ', async () => {
            await wfmtimecardpage.selectPayPeriodBydateRange(String(dataSet[index].StartDate), String(dataSet[index].EndDate));
            // await wfmtimecardpage.clickListViewAndclickOnLoadMore();
            for (const data of dataSet) {
                // get Exceptions and error if any
                const rowNumber = await getRowNumberByCellValue(excelFilePath, sheetName, data.EmpNum, data.Date);
                //It will check if Red Overtime Clock present before overtime approval
                const redOvertimeClock = await wfmtimecardpage.isRedOvertimeClock(data.Date);
                //It will write result to excel sheet 
                await writeResultToExcel(excelFilePath, sheetName, rowNumber, redOvertimeClock, 'RedOvertimeClockBeforeApproval');
                //It will check if OT Paycode is present before overtime approval
                const OTPaycodeBeforeApproval = await wfmtimecardpage.isOTPaycodePresent();
                //It will write result to excel sheet 
                await writeResultToExcel(excelFilePath, sheetName, rowNumber, OTPaycodeBeforeApproval, 'OTUnapprovedPaycodeBeforeApproval');
                
                if (redOvertimeClock == "True") {
                    //It will Approve Overtime All or Partial
                    const result = await wfmtimecardpage.approveOvertime(data.Date, data.ALLorPARTIAL, data.OvertimeToApprove); //, data.Exceptions, data.Expected);
                    //It will check if Green Overtime Clock present after overtime approval
                    const greenOvertimeClock = await wfmtimecardpage.isGreenOvertimeClock(data.Date);
                    //It will write result to excel sheet 
                    await writeResultToExcel(excelFilePath, sheetName, rowNumber, greenOvertimeClock, 'GreenOvertimeClockAfterApproval');
                    //It will check if OT Paycode is present before overtime approval
                    const OTPaycodeAfterApproval = await wfmtimecardpage.isOTPaycodePresent();
                    //It will write result to excel sheet 
                    await writeResultToExcel(excelFilePath, sheetName, rowNumber, OTPaycodeAfterApproval, 'OTUnapprovedPaycodeAfterApproval');
                    if (greenOvertimeClock == "True")
                        await writeResultToExcel(excelFilePath, sheetName, rowNumber, "Passed", 'TestResult');
                    else
                        await writeResultToExcel(excelFilePath, sheetName, rowNumber, "Failed", 'TestResult');
                    }
                else{
                    await writeResultToExcel(excelFilePath, sheetName, rowNumber, "Overtime Not Found", 'TestResult');
                }

            }
            index = index + 1;
        });


    });
}
