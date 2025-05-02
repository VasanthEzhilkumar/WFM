import { AutoSendReport } from '@lib/AutoSendReport';
import test from '@lib/BaseTest';
import { getEmployeeNumbers, writeResultsToExcel, writeResultToExcel } from '@lib/Excel';
import { excelToJson, getExcelFilePath } from '@lib/ExceltoJsonUtil';
import * as path from 'path';

const excelFileName = 'ShiftSwapsTemplate.xlsx';
const excelFilePath = getExcelFilePath(excelFileName);
const sheetsJson = excelToJson(excelFilePath);
const results: { empNumber: string, ruleViolations: string[] }[] = [];

for (const sheetName in sheetsJson) {
    const dataSet = sheetsJson[sheetName];

    dataSet.forEach((data, index) => {
        // Create a unique title by appending the sheet name and the index
        const testTitle = `@WFM Shift Swaps between ${data.FirstEmpNumber} and ${data.SecondEmpNumber} in sheet ${sheetName} (Row ${index + 1})`;

        test(testTitle, async ({ loginPage, webActions, wfmhomepage, wfmscheduleplannerpage, wfmtimecardpage, wfmshiftswappage }) => {
            await test.step(`Navigateto Application`, async () => {
                await loginPage.navigateToURL();
                await loginPage.changelanguage();
            });

            try {
                await test.step('Login into WFM Application as First Employee', async () => {
                    await loginPage.logininfromExcel(data.FirstEmpNumber, data.FirstEmpPassword);
                });

                await test.step('Request for shift swap from first employee', async () => {
                    await wfmshiftswappage.clickBtnShiftSwap();
                    await wfmshiftswappage.requestShiftSwap(data.ShiftToSwap, data.SecondEmpName);
                });

                await test.step('Logging off first employee', async () => {
                    await wfmshiftswappage.logOff();

                });

                await test.step('Login into WFM Application as Second Employee', async () => {
                    await loginPage.logininfromExcel(data.SecondEmpNumber, data.SecondEmpPassword);
                });

                await test.step('Accepting shift swap by second employee', async () => {
                    await wfmshiftswappage.clickBtnAllNotification();
                    await wfmshiftswappage.acceptShiftSwap(data.FirstEmpName, data.FullDate);
                });

                await test.step('Logging off Second employee', async () => {
                    await wfmshiftswappage.logOff();
                });

                await test.step('Login into WFM Application as Manager', async () => {
                    await loginPage.logininfromExcel(data.ManagerEmpNumber, data.ManagerEmpPassword);
                });

                await test.step('Approving shift swap by Manager', async () => {
                    await wfmshiftswappage.clickBtnShiftSwapNotification();
                    const result = await wfmshiftswappage.approveShiftSwap(data.FirstEmpName, data.FullDate);
                    await writeResultToExcel(excelFilePath, sheetName, index+1, result, 'TestResult');
                });
            }
            catch (error) {
                await writeResultToExcel(excelFilePath, sheetName, index+1, "Failed", 'TestResult');
            }
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