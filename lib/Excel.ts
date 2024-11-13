
 import * as xlsx from 'xlsx';
 import * as path from 'path';
import * as ExcelJS from 'exceljs';


export function getEmployeeNumbers(): string[] {
    const filePath = path.resolve(__dirname, '../Data/emp_data.xlsx');
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 }) as string[][];

    const employeeNumbers = data.slice(1).map(row => row[0] as string);
    return employeeNumbers;
}

// export function writeResultsToExcel(results: { empNumber: string, ruleViolations: { date: string, name: string,  description: string }[] }[]): void {
//     const filePath = path.resolve(__dirname, '../Data/emp_data.xlsx');
//     const workbook = xlsx.readFile(filePath);
//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];

//     // const startRowIndex = 2; // Start writing from the second row (skip header)
//     // let currentRowIndex = startRowIndex;
// // Find the next empty row in the existing sheet
// let currentRowIndex = sheet['!ref'] ? xlsx.utils.decode_range(sheet['!ref']).e.r + 1 : 1;

//     results.forEach(result => {
//         result.ruleViolations.forEach(violation => {
//             sheet[`B${currentRowIndex}`] = { t: 's', v: violation.date };
//             sheet[`c${currentRowIndex}`] = { t: 's', v: violation.name };
//             sheet[`D${currentRowIndex}`] = { t: 's', v: violation.description };
//             currentRowIndex++;
//         });
//     });

//     xlsx.writeFile(workbook, filePath);
// }



// export const writeResultsToExcel = async (filePath: string, sheetName: string, rowIndex: number, empNum: string, status: string) => {
//     const workbook = new ExcelJS.Workbook();
//     await workbook.xlsx.readFile(filePath);
//     const worksheet = workbook.getWorksheet(sheetName);
  
//     // Find the column indices for Employee ID and Test Status
//     const headerRow = worksheet.getRow(1);
  
//     let testStatusCol = -1;
  
//     headerRow.eachCell((cell, colNumber) => {
//        if (cell.value === 'TestResult') {
//         testStatusCol = colNumber;
//       }
//     });
  
//     if ( testStatusCol !== -1) {
//       const row = worksheet.getRow(rowIndex + 2); // Adjust for 1-based index and header row
      
//       const statusCell = row.getCell(testStatusCol);
  
//      ;
//       statusCell.value = status;
  
//       if (status === 'Failed') {
//         // Apply red fill to the cell if the test failed
//         statusCell.fill = {
//           type: 'pattern',
//           pattern: 'solid',
//           fgColor: { argb: 'FFFF0000' } // Red color
//         };
//       } else if (status === 'Passed') {
//         // Apply green fill to the cell if the test passed
//         statusCell.fill = {
//           type: 'pattern',
//           pattern: 'solid',
//           fgColor: { argb: 'FF00FF00' } // Green color
//         };
//       }
  
//       row.commit();
//       await workbook.xlsx.writeFile(filePath);
//     } else {
//       console.error('Employee ID or Test Status column not found');
//     }
//   };
  
export const writeResultsToExcel = async (filePath: string, sheetName: string, rowIndex: number, empNum: string, status: string) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.getWorksheet(sheetName);

  let statusCol = -1;

  // Determine which column to search based on empNum
  const targetColumn = empNum === 'EmpResult' ? 'EmpTestResult' : 'TestResult';

  // Find the column index for the target column
  const headerRow = worksheet.getRow(1);
  headerRow.eachCell((cell, colNumber) => {
      if (cell.value === targetColumn) {
          statusCol = colNumber;
      }
  });

  if (statusCol !== -1) {
      const row = worksheet.getRow(rowIndex + 2); // Adjust for 1-based index and header row
      const statusCell = row.getCell(statusCol);
    
      // Set the status in the correct column
      statusCell.value = status;

      // Apply color formatting based on the status
    //   if (status === 'Failed') {
    //       statusCell.fill = {
    //           type: 'pattern',
    //           pattern: 'solid',
    //           fgColor: { argb: 'FFFF0000' } // Red color
    //       };
    //   } else if (status === 'Passed') {
    //       statusCell.fill = {
    //           type: 'pattern',
    //           pattern: 'solid',
    //           fgColor: { argb: 'FF00FF00' } // Green color
    //       };
    //   }

      row.commit();
      await workbook.xlsx.writeFile(filePath);
  } else {
      console.error(`${targetColumn} column not found`);
  }
};
