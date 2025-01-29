// import test from '@lib/BaseTest';
// import { writeResultsToExcel } from '@lib/Excel';
// import { excelToJson, getExcelFilePath } from '@lib/ExceltoJsonUtil';
// import path from 'path';

// // Define the relative directory path to your Excel file
// const dataDirectory = path.resolve(__dirname, '../Data');
// const excelFileName = 'PayrollInputAmySmokeTest.xlsx';
// const excelFilePath = getExcelFilePath(excelFileName);

// // Convert the Excel sheets to JSON format
// const sheetsJson = excelToJson(excelFilePath);

// // Iterate over each dataset and run the test
// for (const sheetName in sheetsJson) {
//     const dataSet = sheetsJson[sheetName];

//     //dataSet.forEach((data, index) => {
//     // Create a unique title by appending the sheet name and the index
//     // const testTitle = `@WFM Validate Rule type for ${data.EmpNum || `Employee ${index + 1}`} in sheet ${sheetName} (Row ${index + 1})`;
//     test(`@WFM Validate Paycode`, async ({ loginPage, wfmhomepage, wfmintegrationpage, webActions }) => {
//         await test.step('Navigate to Application', async () => {
//             await loginPage.navigateToURL();
//         });

//         await test.step('Login into WFM Application', async () => {
//             await loginPage.changelanguage();
//             await loginPage.logininASUser();
//         });

//         let EmpName: string;

//         await test.step('Open Maintenance Menu page', async () => {
//             await wfmhomepage.ClickonMainMenu();
//             await wfmhomepage.openMaintenanceMenu();
//             //EmpName = await webActions.getEmployeeName(data.EmpID);
//         });

//         let runTime: string;

//         await test.step('Run the integration', async () => {
//             // await wfmhomepage.rightclickEmp(data.EmpID);
//             runTime = await wfmintegrationpage.runIntegration(String(data.FromDate), String(data.ToDate));
//             //await wfmhomepage.enterTimeoffDetails("SK-Annual Leave");
//         });

//         let csvFilePath: string;

//        // csvFilePath = `C:\\Users\\vezhil\\Downloads\\SLK-PayData-112024-20241113-124345.csv`

//         await test.step('Check Integration status  ', async () => {
//             csvFilePath = await wfmintegrationpage.checkIntegrationStatus(runTime);

//         });

//         await test.step('Validate the inputs in the file ', async () => {

//             await wfmintegrationpage.extractAndValidateCSV(csvFilePath, excelFilePath);

//         })

//         await test.step('Validate the row count of CSV and Excel input file', async () => {
//             const { isMatch, csvRowCount, excelRowCount } = await wfmintegrationpage.validateRowCount(csvFilePath, excelFilePath);

//             if (!isMatch) {
//                 console.error(`Row count mismatch! CSV has ${csvRowCount} rows, but Excel has ${excelRowCount} rows.`);
//                 throw new Error('Row count mismatch between CSV and Excel files.');
//             }

//             console.log(`Row count validation passed: CSV (${csvRowCount} rows) matches Excel (${excelRowCount} rows).`);
//         });




//     });
//     //});
// }

import test from '@lib/BaseTest';
import { writeResultsToExcel } from '@lib/Excel';
import { excelToJson, getExcelFilePath } from '@lib/ExceltoJsonUtil';
import path from 'path';

// Define the relative directory path to your Excel file
const dataDirectory = path.resolve(__dirname, '../Data');
const excelFileName = 'PayrollInput_SK_REG_COMPLETE.xlsx';
const excelFilePath = getExcelFilePath(excelFileName);

// Convert the Excel sheets to JSON format
const sheetsJson = excelToJson(excelFilePath);

// Extract "From Date" and "To Date" from the first dataset (assuming it's in the first row of the first sheet)
let fromDate: string | undefined;
let toDate: string | undefined;

for (const sheetName in sheetsJson) {
    const dataSet = sheetsJson[sheetName];
    if (dataSet.length > 0) {
        const firstRow = dataSet[0]; // Assuming "From Date" and "To Date" are in the first row
        fromDate = firstRow.FromDate;
        toDate = firstRow.ToDate;
        console.log(fromDate, toDate)
        break; // Exit after finding the first sheet's first row
    }
}



// Use these values in your test
test(`@WFM Validate Paycode`, async ({ loginPage, wfmhomepage, wfmintegrationpage, webActions }) => {
    await test.step('Navigate to Application', async () => {
        await loginPage.navigateToURL();
    });

    await test.step('Login into WFM Application', async () => {
        await loginPage.changelanguage();
        await loginPage.logininASUser();
    });

    let EmpName: string;

    await test.step('Open Maintenance Menu page', async () => {
        await wfmhomepage.ClickonMainMenu();
        await wfmhomepage.openMaintenanceMenu();
        // EmpName = await webActions.getEmployeeName(data.EmpID);
    });

    //let runTime: string;
    function formatDateToDDMMYYYY(date) {
        const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with 0 if needed
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-based) and pad
        const year = date.getFullYear(); // Get full year
        return `${day}/${month}/${year}`;
    }
    let runTimeRaw : any

    await test.step('Run the integration', async () => {
         runTimeRaw = await wfmintegrationpage.runIntegration(fromDate, toDate);
        //const runTimeRaw = await wfmintegrationpage.runIntegration(fromDate, toDate);
        const runTimeDate = new Date(runTimeRaw); // Convert the raw string to a Date object
        runTimeRaw = formatDateToDDMMYYYY(runTimeDate); // Format it to DD/MM/YYYY
        console.log("RunTime: ", runTimeRaw);

        console.log("RunTime : ", runTimeRaw) // Pass the extracted dates
    });
  


    let csvFilePath: string;

    await test.step('Check Integration status', async () => {
        csvFilePath = await wfmintegrationpage.checkIntegrationStatus(runTimeRaw);
    });

    await test.step('Validate the inputs in the file', async () => {
        await wfmintegrationpage.extractAndValidateCSV(csvFilePath, excelFilePath);
    });

    await test.step('Validate the row count of CSV and Excel input file', async () => {
        const { isMatch, csvRowCount, excelRowCount } = await wfmintegrationpage.validateRowCount(csvFilePath, excelFilePath);

        if (!isMatch) {
            console.error(`Row count mismatch! CSV has ${csvRowCount} rows, but Excel has ${excelRowCount} rows.`);
            throw new Error('Row count mismatch between CSV and Excel files.');
        }

        console.log(`Row count validation passed: CSV (${csvRowCount} rows) matches Excel (${excelRowCount} rows).`);
    });
});
