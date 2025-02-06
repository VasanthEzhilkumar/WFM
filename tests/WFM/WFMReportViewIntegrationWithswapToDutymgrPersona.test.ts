import test from '@lib/BaseTest';
import { getRowNumberByEmployeeID, writeResultsToExcel } from '@lib/Excel';
import { excelToJson, getExcelFilePath } from '@lib/ExceltoJsonUtil';
import { throws } from 'assert';
import { error } from 'console';
import path from 'path';

// Define the relative directory path to your Excel file
const dataDirectory = path.resolve(__dirname, '../Data');
const excelFileName = 'ReportView_SK_REG_COMPLETE_updated.xlsx';
const excelFilePath = getExcelFilePath(excelFileName);

// Convert the Excel sheets to JSON format
const sheetsJson = excelToJson(excelFilePath);

// Ensure the sheet exists
const sheetName = 'Sheet1';  // Update this if your sheet has a different name
if (!sheetsJson[sheetName]) {
    throw new Error(`Sheet '${sheetName}' not found in the Excel file.`);
}

// Group the data by EmpID
const groupedData = sheetsJson[sheetName].reduce((acc, row) => {
    if (!acc[row.EMPID]) {
        acc[row.EMPID] = [];
    }
    acc[row.EMPID].push(row);
    return acc;
}, {});

let index = 0;
// Iterate over each grouped dataset and run the test
for (const empId in groupedData) {
    const dataSet = groupedData[empId];


    //     dataSet.forEach((data, index) => {
    // Create a unique title by appending the sheet name and the index
    const testTitle = `@WFM Report view WithSwap Duty manager persona for ${dataSet[index].EMPID || `Employee ${dataSet[index] + 1}`} in sheet ${sheetName} (Row ${index + 1})`;
    test(testTitle, async ({ loginPage, wfmhomepage, wfmreportpage }) => {
        await test.step('Navigate to Application', async () => {
            await loginPage.navigateToURL();
        });

        await test.step('Login into WFM Application', async () => {
            await loginPage.changelanguage();
            // await loginPage.logininASManager();
            await loginPage.logininfromExcel(dataSet[index].EMPID, dataSet[index].Password);

        });

        let EmpName: string;

        await test.step('Open Maintenance Menu page', async () => {
            await wfmhomepage.ClickonMainMenu();
            await wfmhomepage.openReportView();
        });

        await test.step('Validate the Reports ', async () => {
            await wfmreportpage.runReportLibrary();
            //it will return row number 
            let rowNumber = await getRowNumberByEmployeeID(excelFilePath, sheetName, dataSet[index].EMPID);
            let j = 0;
            let errorMsg = "";
            for (const data of dataSet) {
                //String(dataSet[index].Manager).toLocaleLowerCase() !== 'line manager' &&
                if (String(data.SwapToDutyMgr).toLocaleLowerCase() !== 'yes') {
                    const result = await wfmreportpage.validateReports2(data.ReportName, data.Expected)
                    //It will write result to excel sheet by rowNumber(index)
                    await writeResultsToExcel(excelFilePath, 'Sheet1', rowNumber - 1, data.EMPID, result);
                    rowNumber++;
                } else {
                    try {
                        if (j === 0) {
                            // let EmpName: string;
                            await test.step('select the drop down menu', async () => {
                                await wfmhomepage.clickOnCancelbtn();
                                await wfmhomepage.ClickonMainMenu();
                                errorMsg = await wfmhomepage.clickSettingMenuButton();
                                j++;
                            });
                            if (errorMsg !== "" && errorMsg !== undefined) throw new Error(errorMsg);

                            await test.step('Persona changed to Line manager to Duty Manager', async () => {
                                await wfmhomepage.clickDutyManger("Duty manager");
                            });

                            await test.step('Validate the Swap To Duty Manager Persona', async () => {
                                await wfmhomepage.validateSwapToDutyManagerPersona("Duty manager")
                                await wfmhomepage.ClickonMainMenu();
                                await wfmhomepage.clickReportLibrary();
                                await wfmreportpage.runReportLibrary();
                            });
                            j++;
                        }
                        if (errorMsg === "" || errorMsg === undefined) {
                            const result = await wfmreportpage.validateReports2(data.ReportName, data.Expected)
                            //It will write result to excel sheet by rowNumber(index)
                            await writeResultsToExcel(excelFilePath, 'Sheet1', rowNumber - 1, data.EMPID, result);
                            rowNumber++;
                        } else {
                            new throws(error);
                        }
                    } catch (error) {
                        await writeResultsToExcel(excelFilePath, 'Sheet1', rowNumber - 1, data.EMPID, errorMsg);
                        rowNumber++;
                    }
                }
            }
            index++;
        });

    });
}



