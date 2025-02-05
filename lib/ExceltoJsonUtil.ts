// excelToJsonUtil.ts
import * as XLSX from 'xlsx';
import path from 'path';

export function excelToJson(filePath: string): Record<string, any[]> {
    const workbook = XLSX.readFile(filePath);
    const sheetsJson: Record<string, any[]> = {};

    workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        sheetsJson[sheetName] = XLSX.utils.sheet_to_json(worksheet, { defval: null });
    });

    return sheetsJson;
}

//Helper function to get the absolute path to the Excel file from a specific directory
export function getExcelFilePath(fileName: string): string {
    const directory = path.resolve(__dirname,'../Data');
    return path.resolve(directory, fileName);
}
export function readExcel(filePath: string):any[] {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(sheet);
}

// function excelDateToJSDate(excelDate: number): string {
//     const jsDate = new Date((excelDate - 25569) * 86400 * 1000);
//     const day = String(jsDate.getUTCDate()).padStart(2, '0'); // Get day and pad to 2 digits
//     const month = String(jsDate.getUTCMonth() + 1).padStart(2, '0'); // Get month (0-indexed, so add 1) and pad to 2 digits
//     const year = jsDate.getUTCFullYear(); // Get the full year
//     return `${day}/${month}/${year}`; // Format as dd/MM/yyyy
// }


// export function excelToJson(filePath: string): Record<string, any[]> {
//     const workbook = XLSX.readFile(filePath);
//     const sheetsJson: Record<string, any[]> = {};

//     workbook.SheetNames.forEach(sheetName => {
//         const worksheet = workbook.Sheets[sheetName];
//         const sheetData = XLSX.utils.sheet_to_json(worksheet, { defval: null });

//         // Iterate over each row and convert date fields
//         sheetData.forEach((row: any) => {
//             for (const key in row) {
//                 if (row.hasOwnProperty(key)) {
//                     const cellValue = row[key];
//                     // Check if the value is a number and falls within the range of possible Excel dates
//                     if (typeof cellValue === 'number' && cellValue > 25569 && cellValue < 60000) {
//                         row[key] = excelDateToJSDate(cellValue);
//                     }
//                 }
//             }
//         });

//         sheetsJson[sheetName] = sheetData;
//     });

//     return sheetsJson;

//}
