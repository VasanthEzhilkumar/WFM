import { expect, Locator, Page, BrowserContext } from '@playwright/test';
export class CurrentPayPeriodPage {
    readonly page: Page;
    readonly context: BrowserContext;
    readonly CurrentPayPeriod: Locator;
    readonly SelectRange: Locator;
    readonly Apply: Locator;
    readonly ButtonTimeframe :Locator;
    readonly PreviousPayPeriod:Locator;
    readonly SignOff:Locator;
    ariaLabel: string;

    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;
        this.CurrentPayPeriod = page.getByTitle('Select Timeframe');
        this.SelectRange = page.getByRole('button', { name: 'Select Range' });
        this.Apply = page.getByRole('button', { name: 'Apply' });
        this.ButtonTimeframe=page.getByTitle('Select Timeframe');
        this.PreviousPayPeriod=page.getByRole('option', { name: 'Previous Pay Period' });
        this.SignOff=page.getByLabel('Sign-Off', { exact: true });

    }


    async selectPayPeriodBydateRange(StartDate: string, EndDate: string) {

        await this.page.waitForTimeout(500);
        await this.CurrentPayPeriod.click();
        await this.SelectRange.click();
        await this.page.waitForTimeout(500);
        await this.page.locator("(//input[@id='startDateTimeInput'])[1]").fill(StartDate);
        await this.page.keyboard.press('Tab');
        await this.page.waitForTimeout(1000);
        await this.page.locator("(//input[@id='endDateTimeInput'])[1]").fill(EndDate);
        await this.page.keyboard.press('Tab');
        // await this.page.waitForTimeout(2000);
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

    async selectPreviousPayPeriod() {
        await this.page.waitForTimeout(500);
        await this.CurrentPayPeriod.click();
        //await this.ButtonTimeframe.click();
        await this.page.waitForTimeout(500);
        await this.PreviousPayPeriod.click();
        await this.page.waitForTimeout(500);

    }
    async signOffButton()
    {
        await this.page.waitForTimeout(500);
        // Click the "Sign-Off" button by label text

        const SignOFFlocator = await this.page.locator("//div[@data-visibility='true'][@id='signoffAction'][@title='Sign-Off'][@class='widget-button btn-group margin-mini']");

        // Check if the element is visible
        const isEnabled = await SignOFFlocator.isVisible();
        //const isEnabled = await this.page.getByRole('button').isEnabled();
        if (isEnabled) {
            await this.SignOff.click();
            return("Passed")
            console.log('Clicked the Button')
        } else {
            console.log('Button is disabled, cannot interact with it.');
            return ("Failed:Button Disabled For This Manager");
        }

    // Define the XPath for the popup element
    const strXpath = "//span[contains(text(),'Signed Off by')]";

    // Wait for the popup element (the span containing the text "Signed Off by") to appear
    const popupElement = this.page.locator(strXpath);

    // Validate if the popup is visible
    const isPopupVisible = await popupElement.isVisible();

    // Pass or fail the test based on the popup's visibility
    if (isPopupVisible) {
        console.log("Test Passed: Popup is visible");
        return("Passed");
    } else {
        console.log("Test Failed: Popup is not visible");
        return("Failed");
    }


        
    }

        
       
}