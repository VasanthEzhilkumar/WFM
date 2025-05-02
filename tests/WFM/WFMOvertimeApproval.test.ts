import { AutoSendReport } from '@lib/AutoSendReport';
import test from '@lib/BaseTest';
import { getEmployeeNumbers, getRowNumberByCellValue, writeResultsToExcel, writeResultToExcel } from '@lib/Excel';
import { excelToJson, getExcelFilePath } from '@lib/ExceltoJsonUtil';
import * as path from 'path';

// const excelFileName = 'OvertimeApproval.xlsx';
const excelFileName = '(3)OvertimeApproval_SK_REG - COMPLETE.xlsx';
const excelFilePath = getExcelFilePath(excelFileName);
const sheetsJson = excelToJson(excelFilePath);
const results: { empNumber: string, ruleViolations: string[] }[] = [];

for (const sheetName in sheetsJson) {
    const dataSet = sheetsJson[sheetName];

    dataSet.forEach((data, index) => {
        // Create a unique title by appending the employee number, date, sheet name and the index
        const testTitle = `@WFM Overtime Approval for ${data.EmpNum} on date ${data.Date} in sheet ${sheetName} (Row ${index + 1})`;

        test(testTitle, async ({ loginPage, wfmhomepage, wfmtimecardpage, webActions }) => {

            await test.step('Navigate to Application', async () => {
                await loginPage.navigateToURL();
            });

            await test.step('Change language and Login into WFM Application', async () => {
                await loginPage.changelanguage();
                await loginPage.logininASManager();
            });

            let EmpName: string;

            await test.step('Open schedule Planner page', async () => {
                await wfmhomepage.ClickonMainMenu();
                await wfmhomepage.openSchedulePlannerPage();
                EmpName = await webActions.getEmployeeName(data.EmpNum);
            });

            await test.step('Open TimeCard page', async () => {
                await wfmhomepage.ClickonMainMenu();
                await wfmhomepage.OpenTimeCardPage();
            });

            await test.step('Search for the Employee in Time Card Page', async () => {
                await wfmtimecardpage.SearchEMP_Timecard(EmpName);
            });
            await test.step('Approve Overtime at Time Card Page', async () => {
                await wfmtimecardpage.selectPayPeriodBydateRange(String(dataSet[index].FullDate), String(dataSet[index].FullDate));
                const rowNumber = await getRowNumberByCellValue(excelFilePath, sheetName, data.EmpNum, data.Date);
                //It will check if Red Overtime Clock present before overtime approval
                const redOvertimeClock = await wfmtimecardpage.isRedOvertimeClock(data.Date);
                await writeResultToExcel(excelFilePath, sheetName, rowNumber, redOvertimeClock, 'RedOvertimeClockBeforeApproval');
                //It will check if OT Paycode is present before overtime approval
                const OTPaycodeBeforeApproval = await wfmtimecardpage.isOTPaycodePresent();
                await writeResultToExcel(excelFilePath, sheetName, rowNumber, OTPaycodeBeforeApproval, 'OTUnapprovedPaycodeBeforeApproval');

                if (redOvertimeClock == "True" && OTPaycodeBeforeApproval == "True") {
                    //It will Approve Overtime All or Partial
                    const result = await wfmtimecardpage.approveOvertime(data.Date, data.ALLorPARTIAL, data.OvertimeToApprove); //, data.Exceptions, data.Expected);
                    //It will check if Green Overtime Clock present after overtime approval
                    const greenOvertimeClock = await wfmtimecardpage.isGreenOvertimeClock(data.Date);
                    await writeResultToExcel(excelFilePath, sheetName, rowNumber, greenOvertimeClock, 'GreenOvertimeClockAfterApproval');
                    //It will check if OT Paycode is present before overtime approval
                    const OTPaycodeAfterApproval = await wfmtimecardpage.isOTPaycodePresent();
                    await writeResultToExcel(excelFilePath, sheetName, rowNumber, OTPaycodeAfterApproval, 'OTUnapprovedPaycodeAfterApproval');
                    //It will validate test case as Pass or failed depending on overtime click color and presense of OT Paycode 
                    if (greenOvertimeClock == "True" && OTPaycodeAfterApproval == data.IsOTUnapprovedPaycodeExpectedAfterApproval)
                        await writeResultToExcel(excelFilePath, sheetName, rowNumber, "Passed", 'TestResult');
                    else
                        await writeResultToExcel(excelFilePath, sheetName, rowNumber, "Failed", 'TestResult');
                }
                else {
                    await writeResultToExcel(excelFilePath, sheetName, rowNumber, "Overtime Not Found", 'TestResult');
                }
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
