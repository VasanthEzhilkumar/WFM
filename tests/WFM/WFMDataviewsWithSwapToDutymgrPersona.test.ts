import { AutoSendReport } from '@lib/AutoSendReport';
import test from '@lib/BaseTest';
import { getRowNumberByEmployeeID, writeResultsToExcel } from '@lib/Excel';
import { excelToJson, getExcelFilePath } from '@lib/ExceltoJsonUtil';
import { throws } from 'assert';
import { error } from 'console';
import path from 'path';

// Define the relative directory path to your Excel file
const dataDirectory = path.resolve(__dirname, '../Data');
const excelFileName = 'DataView_RO_20250508_001.xlsx';
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


    //dataSet.forEach((data, index) => {
    //Create a unique title by appending the sheet name and the index
    const testTitle = `@WFM Data view With Swap Duty manager persona for ${dataSet[index].EMPID || `Employee ${dataSet[index] + 1}`} in sheet ${sheetName} (Row ${index + 1})`;
    test(testTitle, async ({ loginPage, wfmhomepage, wfmDatapage }) => {
        await test.step('Navigate to Application', async () => {
            await loginPage.navigateToURL();
        });

        await test.step('Login into WFM Application', async () => {
            await loginPage.changelanguage();
            await loginPage.logininfromExcel(dataSet[index].EMPID, dataSet[index].Password);

        });

        let EmpName: string;

        await test.step('Open Maintenance Menu page', async () => {
            await wfmhomepage.ClickonMainMenu();
        });

        await test.step('Open Data View and validate dataviews', async () => {
            // Assuming this is a method that checks the availability of the DataView
            const isDataViewAvailable = await wfmhomepage.isDataViewAvailable();
            let i = 0, j = 0, p = 0;
            let errorMsg = "";
            let rowNumber: number = await getRowNumberByEmployeeID(excelFilePath, sheetName, dataSet[index].EMPID);
            let getDataViewsTitiles: string[] = null;
            for (const data of dataSet) {

                if (isDataViewAvailable) {
                    if (i === 0) {
                        await wfmhomepage.openDataView();
                        getDataViewsTitiles = await wfmDatapage.getDataViewsTitiles();
                        i++;
                    }
                    if (String(data.SwapToDutyMgr).toLocaleLowerCase() !== 'yes') {
                        //await wfmDatapage.validateDataViewReports2(data.Expected, data.ReportName);
                        const result = await wfmDatapage.validateDataView(data.Expected, data.ReportName, getDataViewsTitiles);
                        await writeResultsToExcel(excelFilePath, sheetName, rowNumber - 1, data.EMPID, result);
                        rowNumber++;
                    } else {
                        try {
                            if (j === 0) {
                                // let EmpName: string;
                                await test.step('select the drop down menu', async () => {
                                    // await wfmhomepage.clickOnCancelbtn();
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
                                    const isDataViewAndReportViewAvailable = await wfmhomepage.isDataViewAndReportViewAvailable();
                                    if (isDataViewAndReportViewAvailable) {
                                        if (p === 0) {
                                            getDataViewsTitiles = null;
                                            await wfmhomepage.clickDataView();
                                            getDataViewsTitiles = await wfmDatapage.getDataViewsTitiles();
                                            p++;
                                        }
                                    } else {
                                        let resultAsNoption = "";
                                        if (data.Expected === 'No') {
                                            resultAsNoption = 'Passed';
                                        } else {
                                            resultAsNoption = 'Failed';
                                        }
                                        await writeResultsToExcel(excelFilePath, 'Sheet1', rowNumber - 1, data.EMPID, resultAsNoption);
                                        rowNumber++;
                                    }
                                });
                                j++;
                            }
                            if (errorMsg === "" || errorMsg === undefined) {
                                const result = await wfmDatapage.validateDataView(data.Expected, data.ReportName, getDataViewsTitiles);
                                // const result = await wfmDatapage.validateDataViewReports2(data.ReportName, data.Expected)
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

                } else {
                    let resultAsNoption = "";
                    if (data.Expected === 'No') {
                        resultAsNoption = 'Passed: DataView is not available for this Manager ID';
                    } else {
                        resultAsNoption = 'Failed: DataView is not available for this Manager ID';
                    }
                    console.log("DataView is not available, marking test as failed /Passed as expected.");
                    await writeResultsToExcel(excelFilePath, sheetName, rowNumber - 1, data.EMPID, resultAsNoption);
                    rowNumber++;
                    // continue;
                }
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