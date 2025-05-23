import { AutoSendReport } from '@lib/AutoSendReport';
import test from '@lib/BaseTest';
import { writeResultsToExcel } from '@lib/Excel';
import { excelToJson, getExcelFilePath } from '@lib/ExceltoJsonUtil';

const excelFileName = 'Romania_PT_RuleTypeValidation_RO_20250520.xlsx';
const excelFilePath = getExcelFilePath(excelFileName);
const sheetsJson = excelToJson(excelFilePath);
const results: { empNumber: string, ruleViolations: string[] }[] = [];

for (const sheetName in sheetsJson) {
    const dataSet = sheetsJson[sheetName];

    dataSet.forEach((data, index) => {
        // Create a unique title by appending the sheet name and the index
        const testTitle = `@WFM Validate Rule type for ${data.EmpNum || `Employee ${index + 1}`} in sheet ${sheetName} (Row ${index + 1})`;

        test(testTitle, async ({ loginPage, webActions, wfmhomepage, wfmscheduleplannerpage, wfmtimecardpage }) => {
            await test.step(`Navigateto Application`, async () => {
                await loginPage.navigateToURL();

            });

            await test.step('Login into WFM Application', async () => {
                await loginPage.changelanguage();
                await loginPage.logininASManager();
            });

            await test.step('Verify Manage schedule time card Exists', async () => {
                await wfmhomepage.verfiyManageScheuleCard();
            });

            await test.step('Open schedule Planner page', async () => {
                await wfmhomepage.ClickonMainMenu();
                await wfmhomepage.openSchedulePlannerPage();
            });

            await test.step(`Search for the Employee Rule Violation: ${data.EmpNum}`, async () => {
                await wfmtimecardpage.selectPayPeriodBydateRange(String(data.FromDate), String(data.ToDate));
                const empName = await wfmscheduleplannerpage.clickonRuleViolationTab(data.EmpNum);
                const ruleViolations = await wfmscheduleplannerpage.SearchEmpRuleViolation(empName.toString(), data.ExpectedDescription, data.Date, data.Expected, data.Severity);
                // Ensure ruleViolations is an array
                const violationArray = Array.isArray(ruleViolations) ? ruleViolations : [ruleViolations];
                results.push({ empNumber: data.EmpNum, ruleViolations: violationArray });
                writeResultsToExcel(excelFilePath, sheetName, index, "", ruleViolations);
            });
        });
    });
}


/* 
 * @author: Madhukar Kirkan 
 * @description: test.afterAll-this hook used to execute zipReport method and this will what does  -The HTML report will be compressed into a ZIP file.
 */
test.afterAll('Zip the Html Report and Send Report to client ', async () => {
    const zipPath: any = await new AutoSendReport().zipReport(excelFileName);
    //await new AutoSendReport().sendEmail(String(zipPath));
});