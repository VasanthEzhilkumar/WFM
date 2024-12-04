import test from '@lib/BaseTest';
import { getEmployeeNumbers, writeResultsToExcel, writeResultToExcel } from '@lib/Excel';
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
        const testTitle = `@WFM SchedulePanner Import for ${data.TestCases}`;

        test(`@WFM Schedule Planner Import (Auto) for ${data.TestCases}`, async ({ loginPage, wfmhomepage }) => {

            await test.step('Navigate to Application', async () => {
                await loginPage.navigateToURL();
            });

            await test.step('Login into WFM Application', async () => {
                await loginPage.changelanguage();
                ///await loginPage.logininASManager();
                await loginPage.logininASUser();
            });

            await test.step('click on Administration from Menu And Open DataImport tool ', async () => {
                await wfmhomepage.ClickonMainMenu();
                await wfmhomepage.clickAdministrationAndOpenDataImportLink();
            });

            await test.step('Open Import/ Export and Upload File', async () => {
                //  const result = await wfmhomepage.clickImportExportData("H:\\WFM\\Data\\Emp_ImportData.csv");
                const result = await wfmhomepage.clickImportExportData(data.filePaths);
                //const rowNumber = await getRowNumberByCellValue(excelFilePath, sheetName, data.EmpNum, data.Date);
                await writeResultToExcel(excelFilePath, sheetName, index + 1, result, 'TestResult');
            });

        });
    });
}
