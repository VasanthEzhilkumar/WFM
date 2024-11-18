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

// Helper function to get the absolute path to the Excel file from a specific directory
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
