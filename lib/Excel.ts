
import * as ExcelJS from 'exceljs';
import * as path from 'path';
import * as xlsx from 'xlsx';
import * as XLSX from 'xlsx';


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

// export const writeResultsToExcel = async (filePath: string, sheetName: string, rowIndex: number, empNum: string, status: string) => {
//   const workbook = new ExcelJS.Workbook();
//   await workbook.xlsx.readFile(filePath);
//   const worksheet = workbook.getWorksheet(sheetName);

//   let statusCol = -1;

//   // Determine which column to search based on empNum
//   const targetColumn = empNum === 'EmpResult' ? 'EmpTestResult' : 'TestResult';

//   // Find the column index for the target column
//   const headerRow = worksheet.getRow(1);
//   headerRow.eachCell((cell, colNumber) => {
//       if (cell.value === targetColumn) {
//           statusCol = colNumber;
//       }
//   });

//   if (statusCol !== -1) {
//       const row = worksheet.getRow(rowIndex + 2); // Adjust for 1-based index and header row
//       const statusCell = row.getCell(statusCol);

//       // Set the status in the correct column
//       statusCell.value = status;

//       // Apply color formatting based on the status
//     //   if (status === 'Failed') {
//     //       statusCell.fill = {
//     //           type: 'pattern',
//     //           pattern: 'solid',
//     //           fgColor: { argb: 'FFFF0000' } // Red color
//     //       };
//     //   } else if (status === 'Passed') {
//     //       statusCell.fill = {
//     //           type: 'pattern',
//     //           pattern: 'solid',
//     //           fgColor: { argb: 'FF00FF00' } // Green color
//     //       };
//     //   }

//       row.commit();
//       await workbook.xlsx.writeFile(filePath);
//   } else {
//       console.error(`${targetColumn} column not found`);
//   }
// };
export const writeResultsToExcel = async (filePath: string, sheetName: string, rowIndex: number, empNum: string, status: string) => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet(sheetName);

    let statusCol = -1;
    const targetColumn = empNum === 'EmpResult' ? 'EmpTestResult' : 'TestResult';

    // Find the column index
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell, colNumber) => {
        if (cell.value === targetColumn) {
            statusCol = colNumber;
        }
    });

    if (statusCol === -1) {
        console.error(`Column ${targetColumn} not found`);
        return;
    }

    const row = worksheet.getRow(rowIndex + 2);
    const statusCell = row.getCell(statusCol);

    if (statusCell) {
        console.log(`Writing status "${status}" to row ${rowIndex + 2}, column ${statusCol}`);
        statusCell.value = status;
        row.commit();
        await workbook.xlsx.writeFile(filePath);
        console.log(`Successfully wrote status for row ${rowIndex + 2}`);
    } else {
        console.error(`Failed to find cell at row ${rowIndex + 2}, column ${statusCol}`);
    }
};


// Generic Function to write values to Excel
export const writeResultToExcel = async (filePath: string, sheetName: string, rowIndex: number, columnValue: string, columnName: string) => {
    try {

        // Read the Excel file
        let workbook = XLSX.readFile(filePath);

        // Ensure the sheet exists
        let worksheet = workbook.Sheets[sheetName];

        // Convert the sheet to JSON (array of rows) where each row is an array of cell values
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
        // Debug: Log the rows to inspect the structure
        console.log('Rows:', rows);

        // Get the header row (first row) from the sheet
        const headerRow: any = rows[0];
        // Find the column index by comparing each header cell
        let columnIndex = headerRow.findIndex((cell: any) => cell === columnName);
        if (columnIndex !== -1) {
            columnIndex = columnIndex;
        }



        // Adjust for 1-based index and header row (use rowIndex to access data row)
        const row: any = rows[rowIndex]; // rowIndex is 0-based, so add 1 to access the correct row
        if (row) {
            // Update the cell value in the correct column
            row[columnIndex] = columnValue;

            // Debug: Log the updated row
            console.log('Updated Row:', row);

            // Apply cell background color based on the value of columnValue
            let cellStyle: any = {
                v: columnValue,  // The cell value
                t: 's',  // The type (string in this case)
                s: {} // Style will be added here
            };

            if (columnValue.includes('Passed')) {
                // Apply green fill to the cell if the test passed
                cellStyle.s.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { rgb: 'FF00FF01' } // Green color
                };
            } else {
                // Apply red fill to the cell if the test failed
                cellStyle.s.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { rgb: 'FFFF0000' } // Red color
                };
            }

            // Assign the styled cell to the correct column in the row
            row[columnIndex] = cellStyle;
            // Convert rows back to sheet format
            const updatedSheet = XLSX.utils.aoa_to_sheet(rows as any);

            // Replace the old sheet with the updated sheet
            workbook.Sheets[sheetName] = updatedSheet;

            // Write the workbook back to the file
            XLSX.writeFile(workbook, filePath);

            console.log('File has been updated successfully.');
        } else {
            console.error(`Row at index ${rowIndex} not found`);
        }
    } catch (error) {
        console.error(columnName + ' column not found');
    }
};

//export function async getRowNumberByCellValue(
// Function to get row number by cell value
export const getRowNumberByCellValue = async (filePath: string, sheetName: string, empID: string, targetValue: string) => {

    // Read the Excel file
    let workbook = XLSX.readFile(filePath);

    // Ensure the sheet exists
    let sheet = workbook.Sheets[sheetName];
    if (!sheet) {
        console.error(`Sheet with name "${sheetName}" not found.`);
        return null;
    }

    // Convert the sheet to JSON (array of rows) where each row is an array of cell values
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' }); // 'header: 1' to get rows as arrays

    // Debug: Log the rows to inspect the structure
    console.log('Rows:', rows);

    // Loop through the rows to find the target value
    for (let i: number = 0; i < rows.length; i++) {
        const row: any = rows[i];

        // Clean up any leading/trailing whitespace from each cell (important for matching values)
        const cleanedRow = row.map(cell => (typeof cell === 'string' ? cell.trim() : cell));

        // Check if the target value exists in the cleaned row
        if (cleanedRow.includes(targetValue) && cleanedRow.includes(empID)) {
            // Return 1-based row number
            return i;
        }
    }

    // If the value was not found, return null
    return null;
};


