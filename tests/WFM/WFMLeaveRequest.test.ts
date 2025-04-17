import test from '@lib/BaseTest';
import { writeResultsToExcel } from '@lib/Excel';
import { excelToJson, getExcelFilePath } from '@lib/ExceltoJsonUtil';
import path from 'path';

// Define the relative directory path to your Excel file
// const excelFileName = 'LeaveRequest_Amy2.xlsx';
const excelFileName = 'LeaveRequest_ESS_SK_REG_U.xlsx';
const excelFilePath = getExcelFilePath(excelFileName);

// Convert the Excel sheets to JSON format
const sheetsJson = excelToJson(excelFilePath);
let result: string;

// Iterate over each dataset and run the test
for (const sheetName in sheetsJson) {
    const dataSet = sheetsJson[sheetName];

    dataSet.forEach((data, index) => {
        // Create a unique title by appending the sheet name and the index
        const testTitle = `@WFM Leave Request for ${data.EmpNum || `Employee ${index + 1}`} in sheet ${sheetName} (Row ${index + 1})`;

        test(testTitle, async ({ loginPage, wfmhomepage, wfmnotificationpage }) => {
            await test.step('Navigate to Application', async () => {
                await loginPage.navigateToURL();
            });

            await test.step('Login into WFM Application', async () => {
                await loginPage.changelanguage();
                await loginPage.logininfromExcel(data.EmpID,data.EmpPwd);
            });

            await test.step('Open TimeCard page and perform TimeOff action', async () => {
                result = await wfmhomepage.TimeOff(data.Start_Date, data.End_Date, data.Reason);
                writeResultsToExcel(excelFilePath, sheetName, index, "EmpResult", result);
                //writeResultsToExcel(excelFilePath, sheetName, index, "", "Not Run");
            });

            // Determine which column to search based on empNum
            const targetColumn = result === 'Passed' ? 'Passed' : 'Failed';

            // Proceed with steps only if targetColumn is not 'Failed'
            if (targetColumn !== 'Failed') {
                await test.step('Logout from WFM Application', async () => {
                    await wfmhomepage.Signout();
                });

                await test.step('Login into WFM Application as Manager', async () => {
                    await loginPage.changelanguage();
                    await loginPage.logininfromExcelMgr(data.MgrID, data.MgrPwd);
                });

                await test.step('Open Notification and check the TimeOff request', async () => {
                    await wfmhomepage.OpenNotification();
                    result = await wfmnotificationpage.SelectEmpRequests(data.Start_Date, data.End_Date,data.Reason);
                    writeResultsToExcel(excelFilePath, sheetName, index, "", result);
                });
            } else {
                console.log("Test failed. Skipping further steps.");
            }

        });
    });
}

