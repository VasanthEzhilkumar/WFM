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



    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;
        this.integrationLink = page.getByLabel('Integrations link');
        this.runIntegrationbtn = page.locator('div').filter({ hasText: /^Run an Integration$/ });
        this.selectIntegrationslovakia = page.getByRole('dialog').getByRole('list').locator('div').filter({ hasText: 'Payroll Export - Slovakia' }).nth(4)
        this.selectIntegration = page.getByRole('button', { name: 'Select' })
        this.closeIntegration = page.getByRole('button', { name: 'Payroll Export - Slovakia Close' })
        this.refreshIntegration = page.getByLabel('Refresh', { exact: true });
        this.runReport = page.getByTitle('Run Report').locator('div').nth(1)
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

    



}





