import { AutoSendReport } from '@lib/AutoSendReport';
import test from '@lib/BaseTest';
import { writeResultToExcel } from '@lib/Excel';
import { excelToJson, getExcelFilePath } from '@lib/ExceltoJsonUtil';

const excelFileName = 'ScheduleImport_Test.xlsx';
const excelFilePath = getExcelFilePath(excelFileName);
const sheetsJson = excelToJson(excelFilePath);

for (const sheetName in sheetsJson) {
    const dataSet = sheetsJson[sheetName];

    dataSet.forEach((data, index) => {
        // Create a unique title by appending the sheet name and the index
        const testTitle = `@WFM schedule planner import(Auto) for ${data.TestCases || `Testcases ${index + 1}`} in sheet ${sheetName} (Row ${index + 1})`;

        test(testTitle, async ({ loginPage, wfmhomepage }) => {
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
                const result = await wfmhomepage.clickImportExportData(data.FilePaths);
                //const rowNumber = await getRowNumberByCellValue(excelFilePath, sheetName, data.EmpNum, data.Date);
                await writeResultToExcel(excelFilePath, sheetName, index + 1, result, 'TestResult');
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