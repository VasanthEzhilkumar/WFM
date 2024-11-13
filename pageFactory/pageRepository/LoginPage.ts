import { Page, BrowserContext, Locator, expect } from '@playwright/test';
import { WebActions } from "@lib/WebActions";
import { testConfig } from '../../testConfig';
import { PrimaryExpression } from 'typescript';
import moment from 'moment';


let webActions: WebActions;

export class LoginPage {
    readonly page: Page;
    readonly context: BrowserContext;
    readonly USERNAME_EDITBOX: Locator;
    readonly PASSWORD_EDITBOX: Locator;
    readonly LOGIN_BUTTON: Locator;
    readonly BOOKS_SEARCH_BOX: Locator;
    readonly USERNAMEWFM_EDITBOX: Locator;
    readonly PASSWORDWFM_EDITBOX: Locator;
    readonly WFMLOGIN_BUTTON: Locator;


    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;
        webActions = new WebActions(this.page, this.context);
        this.USERNAME_EDITBOX = page.locator('#userName');
        this.PASSWORD_EDITBOX = page.locator('#password');
        this.USERNAMEWFM_EDITBOX = page.getByLabel('Username');
        this.PASSWORDWFM_EDITBOX = page.getByLabel('Password');
        this.LOGIN_BUTTON = page.locator('#login');
        this.BOOKS_SEARCH_BOX = page.getByPlaceholder('Type to search');
        this.WFMLOGIN_BUTTON = page.getByRole('button', { name: 'Sign In' });


    }

    async navigateToURL(): Promise<void> {
        await this.page.goto("/");
    }

    async clickOnLoginMainButton(): Promise<void> {
        await this.LOGIN_BUTTON.click();
    }

    async loginToApplication(): Promise<void> {
        const decipherPassword = await webActions.decipherPassword();
        await this.USERNAME_EDITBOX.fill(testConfig.username);
        await this.PASSWORD_EDITBOX.fill(decipherPassword);
        await this.LOGIN_BUTTON.click();
    }

    async verifyProfilePage(): Promise<void> {
        await expect(this.BOOKS_SEARCH_BOX).toBeVisible();
    }

    async logininTOWFMApplication(): Promise<void> {
        const decipherPassword = await webActions.decipherPassword();
        await this.USERNAMEWFM_EDITBOX.fill(testConfig.WFMUSername);
        await this.PASSWORDWFM_EDITBOX.fill(decipherPassword);
        await this.WFMLOGIN_BUTTON.click()

        // await this.page.pause();


    }

    async changelanguage(): Promise<void> {

        await this.page.getByRole('link', { name: 'American English' }).click();

    }
    async logininASWFMApplication(): Promise<void> {

        await this.USERNAMEWFM_EDITBOX.fill(testConfig.WFMEmpUSername);
        await this.PASSWORDWFM_EDITBOX.fill(testConfig.WFMEmpPassword);
        await this.WFMLOGIN_BUTTON.click()

        //await this.page.pause();

    }
    async logininfromExcel(usrname: any, pwd: string): Promise<void> {
        const usernameStr: string = String(usrname);
        await this.USERNAMEWFM_EDITBOX.fill(usernameStr);
        await this.PASSWORDWFM_EDITBOX.fill(pwd);
        await this.WFMLOGIN_BUTTON.click()

        //await this.page.pause();

    }
    async logininfromExcelMgr(usrname: any, password: string): Promise<void> {
        const usernameStr: string = String(usrname);
        await this.USERNAMEWFM_EDITBOX.fill(usernameStr);
        await this.PASSWORDWFM_EDITBOX.fill(password);
        await this.WFMLOGIN_BUTTON.click()

        //await this.page.pause();

    }
    async logininASManager(): Promise<void> {
        await this.USERNAMEWFM_EDITBOX.fill(testConfig.WFMMgrUSername);
        await this.PASSWORDWFM_EDITBOX.fill(testConfig.WFMMgrPassword);
        await this.WFMLOGIN_BUTTON.click()

        //await this.page.pause();

    }
    async logininASUser(): Promise<void>{
        await this.USERNAMEWFM_EDITBOX.fill(testConfig.WFMUsrUsername);
        await this.PASSWORDWFM_EDITBOX.fill(testConfig.WFMUsrPassword);
        await this.WFMLOGIN_BUTTON.click()
    }

    async enterTimeoff(): Promise<void> {

        // Helper function to calculate the number of days between two dates
        function getDateDifference(fromDate: string, toDate: string): number {
            const from = new Date(fromDate);
            const to = new Date(toDate);
            const timeDiff = to.getTime() - from.getTime();
            const dayDiff = timeDiff / (1000 * 3600 * 24); // convert milliseconds to days
            return Math.ceil(dayDiff); // round up to full days
        }

        // Function to drag/scroll the calendar from a 'from date' to a 'to date'
        async function scrollToRevealDate(fromDate: string, toDate: string) {
            const dateSelector = `//td[@data-date="${toDate}"][1]`; // replace with your date locator strategy

            // Calculate the difference between fromDate and toDate
            const daysDifference = getDateDifference(fromDate, toDate);

            // The calendar might need to be dragged or scrolled by a certain amount of pixels
            const pixelsPerDay = 50;  // Adjust this based on your calendar's scrolling behavior

            // Scroll the calendar to reveal the 'to date'
            let dateVisible = await this.page.isVisible(dateSelector);

            while (!dateVisible) {
                // Perform drag action or scroll action
                const scrollAmount = Math.min(pixelsPerDay * daysDifference, 300); // limit to a certain scroll per action

                // Simulate a drag action to scroll the calendar
                const calendar = this.page.locator('.calendar-container'); // Adjust selector for your calendar container
                await calendar.hover();  // Hover over the calendar element
                await this.page.mouse.down(); // Start dragging
                await this.page.mouse.move(0, -scrollAmount, { steps: 10 }); // Drag upwards (adjust the distance if needed)
                await this.page.mouse.up(); // Stop dragging

                // Check again if the 'to date' is visible
                dateVisible = await this.page.isVisible(dateSelector);
            }


            async function getDatesBetween(startDateStr: string, endDateStr: string): Promise<string[]> {
                let startDate = moment(startDateStr);
                let endDate = moment(endDateStr);
                let dates: string[] = [];
            
                while (startDate <= endDate) {
                    let toDate = startDate.format('YYYY-MM-DD'); // Format the date to match your date picker
                    dates.push(toDate);
            
                    // Build your XPath selector dynamically for the current date
                    const dateSelector = `//td[@data-date="${toDate}"]`;
            
                    // Click on the date in the date picker
                    await this.page.locator(dateSelector).first().click();
            
                    // Increment the start date by one day
                    startDate = startDate.add(1, 'days');
                }
            
                return dates;
            }
            // Usage example
            let startDateStr = '2024-10-01';
            let endDateStr = '2024-10-26';
            let dateArray = getDatesBetween(startDateStr, endDateStr);
            console.log(dateArray);

            // Once the date is visible, click it
            await this.page.locator(dateSelector).first().click();
        }
        // Example: Scroll from October 1, 2024 to October 26, 2024
        const fromDate = '2024-10-01';
        const toDate = '2024-10-26';

        await scrollToRevealDate.call(this, fromDate, toDate); // Ensure correct binding to 'this'



    }
}