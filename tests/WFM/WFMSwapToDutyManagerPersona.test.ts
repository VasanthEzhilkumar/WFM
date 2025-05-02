import { AutoSendReport } from '@lib/AutoSendReport';
import test from '@lib/BaseTest';
import { writeResultToExcel } from '@lib/Excel';
import { excelToJson, getExcelFilePath } from '@lib/ExceltoJsonUtil';
import path from 'path';

// Define the relative directory path to your Excel file
const dataDirectory = path.resolve(__dirname, '../Data');
const excelFileName = 'WFMSwapToDutymangerPersonaTestData.xlsx';
const excelFilePath = getExcelFilePath(excelFileName);

// Convert the Excel sheets to JSON format
const sheetsJson = excelToJson(excelFilePath);

// Iterate over each dataset and run the test
for (const sheetName in sheetsJson) {
    const dataSet = sheetsJson[sheetName];

    dataSet.forEach((data, index) => {
        // Create a unique title by appending the sheet name and the index
        const testTitle = `@WFM Swap To Duty Manager Persona for ${data.EmpNum || `Employee ${index + 1}`} in sheet ${sheetName} (Row ${index + 1})`;
        test(testTitle, async ({ loginPage, wfmhomepage, wfmtimecardpage, webActions }) => {
            await test.step('Navigate to Application', async () => {
                await loginPage.navigateToURL();
            });

            await test.step('Login into WFM Application', async () => {
                await loginPage.changelanguage();
                //await loginPage.logininASManager();// line manager
                await loginPage.logininfromExcelMgr(data.LineManagerID, data.Password);
            });

            let EmpName: string;

            await test.step('select the drop down menu', async () => {
                await wfmhomepage.ClickonMainMenu();
                await wfmhomepage.clickSettingMenuButton();
            });

            await test.step('Persona changed to Line manager to Duty Manager', async () => {
                await wfmhomepage.clickDutyManger(data.DutyManager);
            });

            await test.step('Validate the Swap To Duty Manager Persona', async () => {
                const result = await wfmhomepage.validateSwapToDutyManagerPersona(data.DutyManager)
                await wfmhomepage.ClickonMainMenu();
                await wfmhomepage.openReportView();
                await writeResultToExcel(excelFilePath, sheetName, index+1, result, "TestResult");
            })
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
