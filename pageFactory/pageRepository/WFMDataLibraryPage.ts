import { Page, BrowserContext, Locator, expect } from '@playwright/test';
import { writeResultsToExcel } from '@lib/Excel';
import { readExcel } from '@lib/ExceltoJsonUtil'
export class WFMDataLibraryPage {
    readonly page: Page;
    readonly context: BrowserContext;

    ariaLabel: string;




    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;
    }



    async validateDataViewReports(exp: string, reportName: string, excelFilePath: string, index: number): Promise<void> {

        // Step 2: Get all list items inside the listbox
        await this.page.waitForTimeout(6000);
        const listItems = await this.page.locator('//li[@role="listitem"]//span[@class="card__info boldRow mainTabularData"]');
        const count = await listItems.count();
        console.log(`Found ${count} reports in the list.`);

        // Step 3: Extract all report titles from the web page
        let flag = false;
        for (let i = 0; i < count; i++) {
            const button = listItems.nth(i);
            const dataviewtitle = await button.textContent();
            //await this.page.waitForTimeout(500);
            if (dataviewtitle.toLowerCase() === reportName.toLowerCase()) {
                console.log(dataviewtitle, reportName)
                flag = true;
                break;
            }
        }

        if (flag && exp.toLowerCase() === 'yes') {
            console.log(`Validation passed for ReportName: ${reportName}`);
            await this.page.waitForTimeout(1000);
            await writeResultsToExcel(excelFilePath, 'Sheet1', index, `Validation passed for ReportName: ${reportName}`, 'Passed');
        }
        else if (flag && exp.toLowerCase() === 'no') {
            await writeResultsToExcel(excelFilePath, 'Sheet1', index, `Validation Passed for ReportName: ${reportName}`, 'Failed');
        }
        else if (!flag && exp.toLowerCase() === 'yes') {
            await this.page.waitForTimeout(1000);
            await writeResultsToExcel(excelFilePath, 'Sheet1', index, `Validation failed for ReportName: ${reportName}`, 'Failed:ReportNotFound');
        }
        else if (!flag && exp.toLowerCase() === 'no') {
            await this.page.waitForTimeout(1000);
            await writeResultsToExcel(excelFilePath, 'Sheet1', index, `Validation failed for ReportName: ${reportName}`, 'Passed');
        }


    }


    async validateDataViewReports2(exp: string, reportName: string): Promise<string> {

        // Step 2: Get all list items inside the listbox
        await this.page.waitForTimeout(6000);
        const listItems = await this.page.locator('//li[@role="listitem"]//span[@class="card__info boldRow mainTabularData"]');
        const count = await listItems.count();
        console.log(`Found ${count} reports in the list.`);

        // Step 3: Extract all report titles from the web page
        let flag = false;
        for (let i = 0; i < count; i++) {
            const button = listItems.nth(i);
            const dataviewtitle = await button.textContent();
            //await this.page.waitForTimeout(500);
            if (dataviewtitle.toLowerCase() === reportName.toLowerCase()) {
                console.log(dataviewtitle, reportName)
                flag = true;
                break;
            }
        }

        if (flag && exp.toLowerCase() === 'yes') {
            console.log(`Validation passed for ReportName: ${reportName}`);
            await this.page.waitForTimeout(1000);
            return 'Passed'
            //await writeResultsToExcel(excelFilePath, 'Sheet1', index, `Validation passed for ReportName: ${reportName}`, 'Passed');
        }
        else if (flag && exp.toLowerCase() === 'no') {
            return 'Failed'
            //await writeResultsToExcel(excelFilePath, 'Sheet1', index, `Validation Passed for ReportName: ${reportName}`, 'Failed');
        }
        else if (!flag && exp.toLowerCase() === 'yes') {
            await this.page.waitForTimeout(1000);
            return 'Failed:ReportNotFound';
            //await writeResultsToExcel(excelFilePath, 'Sheet1', index, `Validation failed for ReportName: ${reportName}`, 'Failed:ReportNotFound');
        }
        else if (!flag && exp.toLowerCase() === 'no') {
            await this.page.waitForTimeout(1000);
            return 'Passed';
            //await writeResultsToExcel(excelFilePath, 'Sheet1', index, `Validation failed for ReportName: ${reportName}`, 'Passed');
        }


    }





}

