
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

/**
 * @author : Madhukar Kirkan 
 * @description : This method used to get current row number by employeeID and Date
 * @param : empID,filepath,sheetName etc
 */
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
export const getRowNumberByEmpId = async (filePath: string, sheetName: string, empID: string) => {

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
        if (cleanedRow.includes(empID)) {
            // Return 1-based row number
            return i;
        }
    }

    // If the value was not found, return null
    return null;

    
};

//export function async getRowNumberByCellValue(
// Function to get row number by cell value
/**
 * @author : Madhukar Kirkan 
 * @description : This method used to get current row number by employeeID
 * @param : empID,filepath,sheetName etc
 */
export const getRowNumberByEmployeeID = async (filePath: string, sheetName: string, empID: string) => {

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
        if (cleanedRow.includes(empID)) {
            // Return 1-based row number
            return i;
        }
    }

    // If the value was not found, return null
    return null;
};

