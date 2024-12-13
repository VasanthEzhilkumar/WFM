import { expect, Locator, Page, BrowserContext } from '@playwright/test';
export class CurrentPayPeriodPage {
    readonly page: Page;
    readonly context: BrowserContext;
    readonly CurrentPayPeriod: Locator;
    readonly SelectRange: Locator;
    readonly Apply: Locator;
    ariaLabel: string;

    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;
        this.CurrentPayPeriod = page.getByTitle('Select Timeframe');
        this.SelectRange = page.getByRole('button', { name: 'Select Range' });
        this.Apply = page.getByRole('button', { name: 'Apply' });
    }


    async setCurrentPayPeriod(StartDate: any , EndDate:any) {
        await this.page.waitForTimeout(1000);
        await this.CurrentPayPeriod.click();
        await this.page.waitForTimeout(500);
        await this.SelectRange.click();
        await this.page.waitForTimeout(2000);
        await this.page.locator("//input[@id='startDateTimeInput']").type(StartDate.toString());
        //await this.page.getByLabel('Start Date').type(StartDate.toString());
        await this.page.waitForTimeout(2000);
        await this.page.locator("//input[@id='endDateTimeInput']").type(EndDate.toString());
        await this.page.waitForTimeout(2000);
        await this.Apply.click();
        await this.page.waitForTimeout(500);

    }
}