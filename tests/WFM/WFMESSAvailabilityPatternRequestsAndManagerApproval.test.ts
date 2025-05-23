import { AutoSendReport } from '@lib/AutoSendReport';
import test from '@lib/BaseTest';
import { getRowNumberByCellValue, writeResultsToExcel, writeResultToExcel } from '@lib/Excel';
import { excelToJson, getExcelFilePath } from '@lib/ExceltoJsonUtil';
import path from 'path';

// Define the relative directory path to your Excel file
const dataDirectory = path.resolve(__dirname, '../Data');
const excelFileName = 'ESS Availability Pattern Requests and Manager Approval_SK_REG.xlsx';
const excelFilePath = getExcelFilePath(excelFileName);

///// Convert the Excel sheets to JSON format
const sheetsJson = excelToJson(excelFilePath);


// Convert the Excel sheets to JSON format
//const sheetsJson = excelToJson(excelFilePath);

// Log the keys to verify the sheet names
console.log("Available Sheets: ", Object.keys(sheetsJson));

// Ensure the sheet exists
const sheetName = 'Sheet1';  // Update this if your sheet has a different name
if (!sheetsJson[sheetName]) {
    throw new Error(`Sheet '${sheetName}' not found in the Excel file.`);
}

// Group the data by EmployeeID and StartDate
const groupedData = sheetsJson[sheetName].reduce((acc, row) => {
    const key = `${row.EmployeeID}-${row.StartDate}`; // Create a unique composite key
    if (!acc[key]) {
        acc[key] = [];
    }
    acc[key].push(row);
    return acc;
}, {});

let index = 0;
// Iterate over each grouped dataset and run the test
for (const key in groupedData) {
    const dataSet = groupedData[key];

    // Iterate over each dataset and run the test
    // for (const sheetName in sheetsJson) {
    //     const dataSet = sheetsJson[sheetName];

    // dataSet.forEach((dataSet, index) => {
    // Create a unique title by appending the sheet name and the index
    const testTitle = `@WFM ESS Availabilty Pattern Request for ${key || `Employee ${index}`} in sheet ${sheetName} (Row ${index + 1})`;
    test(testTitle, async ({ loginPage, wfmhomepage, webActions, wfmControlCentrePage, wfmnotificationpage, wfmavailibilityChangePage }) => {
        await test.step('Navigate to Application', async () => {
            await loginPage.navigateToURL();
        });
        // try {

        await test.step('Login into WFM Application', async () => {
            await loginPage.changelanguage();
            //await loginPage.logininASManager();
            await loginPage.logininfromExcel(dataSet[index].EmployeeID, dataSet[index].EmployeePassword);
        });

        let EmpName: string;

        await test.step('Open ESS AVailability Pattern Request ', async () => {
            //await wfmavailibilityChangePage.verifyCangeMyAvailabilityRequestPage();
            await wfmhomepage.ClickonchangeMyAvailabilityRequest();
            await wfmavailibilityChangePage.clickOnGLAvailabilityChangesGeneric(dataSet[index].GLAvailabilityChanges);
        });

        await test.step('Set Start and Specify Date for ESS AVailability Pattern Request ', async () => {
            //await wfmavailibilityChangePage.setSelectAdateAndSpecifyDate(dataSet[index].StartDate, dataSet[index].EndDate);
            await wfmavailibilityChangePage.selectStartAndSpecifyDateWithBothUI(dataSet[index].StartDate, dataSet[index].EndDate);
        });

        await test.step('Set Repeat Every Days&Weeks Count for ESS AVailability Pattern Request ', async () => {
            await wfmavailibilityChangePage.setRepeatEveryAndDaysANDWeeks(dataSet[index].DaysORWeeks, dataSet[index].RepeatEvery);
        });
        let repeat = 1;
        await test.step('Edit Availablity Days for ESS AVailability Pattern Request ', async () => {

            for (const data of dataSet) {

                await wfmavailibilityChangePage.clickEditAvailabilityByDays(data.StartTime, data.EndTime, data.Status, String(repeat));
                // Handle punch-in/punch-out actions for each day
                //await writeResultToExcel(excelFilePath, sheetName, rowNumber, result, 'TestResult');
                repeat = repeat + 1;
            }
            await wfmavailibilityChangePage.clickReviewAndSubmit();
            // index = index + 1;
        });

        await test.step('Login As Manager for ESS AVailability Pattern Approval ', async () => {
            await wfmhomepage.ClickonMainMenu();
            EmpName = await webActions.getEmployeeNamefromHomePage();
            await wfmhomepage.ClickonCloseMenu();

            await loginPage.logOut();
            await loginPage.changelanguage();
            await loginPage.logininfromExcel(dataSet[index].ManagerID, dataSet[index].ManagerPassword);
        });
        await test.step('Open Availability Pattern Requests for Approval ', async () => {

            await wfmnotificationpage.selectAvailabilityPatternRequests();
            await wfmControlCentrePage.selectAvailabilityPatternRequests(dataSet[index].GLAvailabilityChanges);
        });

        await test.step('click Availablity PatternRequest For Approval after login as manager And Approve or Refuse', async () => {
            const result = await wfmControlCentrePage.clickAvailablityPatternRequestForApprovalAndApprove_Refuse(String(EmpName), dataSet[index].Approve);
            const rowNumber = await getRowNumberByCellValue(excelFilePath, sheetName, dataSet[index].EmployeeID, dataSet[index].StartDate);
            //It will write result to excel sheet by rowNumber(index)
            //await writeResultToExcel(excelFilePath, sheetName, rowNumber, result, 'TestResult');
            for (let i = 1; i < Number(repeat); i++) {
                //await writeResultsToExcel(excelFilePath, sheetName, rowNumber, "", result);
                await writeResultToExcel(excelFilePath, sheetName, rowNumber, result, 'TestResult');
            }

        });
        // } catch (error) {
        //     await writeResultsToExcel(excelFilePath, sheetName, index, "", "Failed");
        // }
    });
    // });
}

/* 
 * @author: Madhukar Kirkan 
 * @description: test.afterAll — This hook is used to execute the zipReport method, which compresses the HTML report into a ZIP file.
 */
test.afterAll('Zip the Html Report and Send Report to CLient ', async () => {
    const zipPath: any = await new AutoSendReport().zipReport(excelFileName);
    //await new AutoSendReport().sendEmail(String(zipPath));
});
