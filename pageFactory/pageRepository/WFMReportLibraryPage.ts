import { writeResultsToExcel } from '@lib/Excel';
import{readExcel} from '@lib/ExceltoJsonUtil'
import { Page, BrowserContext, Locator, expect } from '@playwright/test';


export class WFMReportLibraryPage {
    readonly page: Page;
    readonly context: BrowserContext;
    readonly EMP_SELECTORDROPDOWN: Locator;
    readonly EMP_SEARCHBAR: Locator;
    readonly EMP_LIST: Locator;
    readonly EMP_Select: Locator;
    readonly EMP_Selected: Locator;
    readonly EMP_NAME: Locator;
    readonly TIMECARD_SAVE: Locator;
    readonly TIMECARD_TOTAL: Locator
    ariaLabel: string;
    readonly integrationLink: Locator;
    readonly runIntegrationbtn: Locator;
    readonly selectIntegrationslovakia: Locator;
    readonly selectIntegration: Locator
    readonly closeIntegration: Locator
    readonly integrationRunName: Locator
    readonly refreshIntegration: Locator;
    readonly runReport: Locator;
    readonly reportAll: Locator;



    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;
        this.integrationLink = page.getByLabel('Integrations link');
        this.runIntegrationbtn = page.locator('div').filter({ hasText: /^Run an Integration$/ });
        this.selectIntegrationslovakia = page.getByRole('dialog').getByRole('list').locator('div').filter({ hasText: 'Payroll Export - Slovakia' }).nth(4)
        this.selectIntegration = page.getByRole('button', { name: 'Select' })
        this.closeIntegration = page.getByRole('button', { name: 'Payroll Export - Slovakia Close' })
        this.refreshIntegration = page.getByLabel('Refresh', { exact: true });
        this.runReport = page.getByTitle('Run Report').locator('div').nth(1);
        this.reportAll = page.getByRole('button', { name: 'All', exact: true })
    }

    async SearchEMP_Timecard(EmpName: string): Promise<void> {
        await this.EMP_SELECTORDROPDOWN.click();
        await this.EMP_SEARCHBAR.click();
        await this.EMP_SEARCHBAR.fill(EmpName);
        await this.EMP_LIST.click();

    }

    async runReportLibrary(): Promise<void> {
        await this.runReport.click();
      
    }


    async validateReports(excelFilePath: string): Promise<void> {
        // Step 1: Read the Excel file and get the list of report names
        await this.reportAll.click()
        const excelData = readExcel(excelFilePath);
        const reportNames = excelData.map((row) => String(row?.ReportName || '').trim());
    
        // Step 2: Get all list items inside the listbox
        const listItems = await this.page.locator('#Accordion1 ul[role="listbox"] > li');
      //  const listItems = await this.page.locator('ul[role="listbox"] > li');
        const count = await listItems.count();
        console.log(`Found ${count} reports in the list.`);
    
        // Step 3: Extract all report titles from the web page
        const webReportTitles: string[] = [];
        for (let i = 0; i < count; i++) {
            const button = listItems.nth(i).locator('button[role="option"]');
            const reportTitle = await button.getAttribute('aria-label');
    
            if (reportTitle) {
                webReportTitles.push(reportTitle.trim());
                console.log(`Report ${i + 1}: ${reportTitle}`);
            } else {
                console.error(`Button does not have a valid aria-label in item ${i + 1}`);
            }
        }
    
        // Step 4: Validate each report name from Excel against the web report titles
        for (let rowIndex = 0; rowIndex < reportNames.length; rowIndex++) {
            const reportName = reportNames[rowIndex];
    
            if (!reportName) {
                console.warn(`Skipping row ${rowIndex + 1} as ReportName is empty.`);
                await writeResultsToExcel(excelFilePath, 'Sheet1', rowIndex, 'EmpResult', 'Failed: ReportName is empty');
                continue;
            }
    
            // Check if the report name from Excel exists in the list of web report titles
            const isReportFound = webReportTitles.some((title) => title.toLowerCase() === reportName.toLowerCase());
    
            if (isReportFound) {
                console.log(`Validation passed for ReportName: ${reportName}`);
                await writeResultsToExcel(excelFilePath, 'Sheet1', rowIndex, '`Validation passed for ReportName: ${reportName}`', 'Passed');
            } else {
                console.error(`Validation failed for ReportName: ${reportName}`);
                await writeResultsToExcel(excelFilePath, 'Sheet1', rowIndex, '`Validation passed for ReportName: ${reportName}`', 'Failed: Report not found');
            }
        }
    }
    

    



}





