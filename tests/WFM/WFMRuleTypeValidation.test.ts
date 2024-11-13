import test from '@lib/BaseTest';
import { getEmployeeNumbers, writeResultsToExcel } from '@lib/Excel';
import { excelToJson, getExcelFilePath } from '@lib/ExceltoJsonUtil';
import * as path from 'path';

const excelFileName = 'RuleTypeValidation_Amy2.xlsx';
const excelFilePath = getExcelFilePath(excelFileName);
const sheetsJson = excelToJson(excelFilePath);

const results: { empNumber: string, ruleViolations: string[] }[] = [];

for (const sheetName in sheetsJson) {
    const dataSet = sheetsJson[sheetName];

    dataSet.forEach((data, index) => {
        // Create a unique title by appending the sheet name and the index
        const testTitle = `@WFM Validate Rule type for ${data.EmpNum || `Employee ${index + 1}`} in sheet ${sheetName} (Row ${index + 1})`;

        test(testTitle, async ({ loginPage, webActions, wfmhomepage, wfmscheduleplannerpage }) => {
            await test.step(`Navigate to Application`, async () => {
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
                const empName = await wfmscheduleplannerpage.clickonRuleViolationTab(data.EmpNum);
                const ruleViolations = await wfmscheduleplannerpage.SearchEmpRuleViolation(empName.toString(), data.ExpectedDescription, data.Date);

                // Ensure ruleViolations is an array
                const violationArray = Array.isArray(ruleViolations) ? ruleViolations : [ruleViolations];
                
                results.push({ empNumber: data.EmpNum, ruleViolations: violationArray });

                writeResultsToExcel(excelFilePath, sheetName, index, "", ruleViolations);
            });
        });
    });
}
