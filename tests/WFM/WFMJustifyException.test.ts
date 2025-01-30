import test from '@lib/BaseTest';
import { getEmployeeNumbers, writeResultsToExcel } from '@lib/Excel';
import { excelToJson, getExcelFilePath } from '@lib/ExceltoJsonUtil';
import * as path from 'path';

const excelFileName = 'TestRun.xlsx';
const excelFilePath = getExcelFilePath(excelFileName);
const sheetsJson = excelToJson(excelFilePath);
const results: { empNumber: string, ruleViolations: string[] }[] = [];

for (const sheetName in sheetsJson) {
    const dataSet = sheetsJson[sheetName];

    dataSet.forEach((data, index) => {
        // Create a unique title by appending the sheet name and the index
        const testTitle = `@WFM Validate Rule type for ${data.EmpNum || `Employee ${index + 1}`} in sheet ${sheetName} (Row ${index + 1})`;

        test(testTitle, async ({ loginPage, webActions, wfmhomepage, wfmscheduleplannerpage, wfmtimecardpage }) => {
            await test.step(`Navigate to Application`, async () => {
                await loginPage.navigateToURL();
            });
        
            await test.step('Login into WFM Application', async () => {
                await loginPage.changelanguage();
                await loginPage.logininASManager();
            });
        
            await test.step('Verify Manage schedule time card Exists', async () => {
                await wfmhomepage.searchEmpviaEmpSearch(data.EmpID, "Timecard");
            });
        
            await test.step('Select Pay Period in the Timecard Page', async () => {
                await wfmtimecardpage.selectPayPeriodBydateRange(String(data.FromDate), String(data.ToDate));
            });
        
            await test.step('Select All the exceptions and provide justify reasons', async () => {
                const justificationStatus = await wfmtimecardpage.justifyExceptions(data.Paycodes); // Run justification
        
                // Write status to Excel
                writeResultsToExcel(excelFilePath, sheetName, index, "Justification Status", justificationStatus);
            });
        });
        
    });
}