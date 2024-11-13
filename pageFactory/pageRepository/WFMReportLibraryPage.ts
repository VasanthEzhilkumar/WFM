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

    // Function to get the current date and time in the format "11/11/2024 11:56"
    async getFormattedDateTime() {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${month}/${day}/${year} ${hours}:${minutes}`;
    }

    async checkIntegrationStatus(runTime : string ): Promise<void> {

        await this.refreshIntegration.click()

        //await this.page.getByRole('button', { name: 'Integration Run Name Payroll Export - Slovakia-11/11/2024 11:56:01 Type Run now' })

const integrationRunLocator = this.page.getByLabel('Item Integration Run Name Payroll Export - Slovakia-11/11/2024 13:10 not').getByRole('button', { name: '' })


        // const integrationRunLocator = this.page.getByLabel(
        //     `Item Integration Run Name Payroll Export - Slovakia-${runTime}.*not`
        // ).getByRole('button', { name: '' }); // The refresh button locator

        // Click the refresh button until the state becomes visible
        let isStateVisible = false;
        const maxRetries = 50; // Set a maximum retry limit to avoid infinite loop
        let attempts = 0;

        while (!isStateVisible && attempts < maxRetries) {
            try {
                // Click the refresh button
                await this.refreshIntegration.click();
                console.log(`Clicked refresh button, attempt ${attempts + 1}`);

                // Wait for the integration run state button to become visible
                //await integrationRunLocator.waitFor({ timeout: 5000 });

                if (await this.page.getByRole('button', { name: ' In Progress [0]' }).count() > 0) {
    

                    const txt = await this.page.locator('#ihub-inprogress-monitor-1-slat-area-2').allInnerTexts();
                    console.log();
                      // If no error is thrown, the state is now visible
                isStateVisible = true;
                }
              

              //  console.log(`State is now visible after ${attempts + 1} attempts`);
            } catch (error) {
                // If the element is not visible, continue retrying
                console.log(`State not visible yet, retrying...`);
            }

            attempts++;
        }

        if (isStateVisible) {
            // Click the button after the state is visible
            await this.page.getByRole('button', {
                name: new RegExp(`Integration Run Name Payroll Export - Slovakia-${runTime}.*Type Run now`),
            }).click();
            console.log("Clicked the 'Run now' button");
        } else {
            console.error("State did not become visible after maximum retries");
        }

    }




}





