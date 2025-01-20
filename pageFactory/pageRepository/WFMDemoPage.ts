import { Page, BrowserContext, Locator, expect } from '@playwright/test';
import { WebActions } from "@lib/WebActions";
import { testConfig } from '../../testConfig';
import { PrimaryExpression, forEachChild } from 'typescript';



export class WFMDemoPage {
    readonly page: Page;
    readonly context: BrowserContext;
    readonly MANAGESCHEDULE: Locator;
    readonly MAINMENU: Locator;
    readonly SCHEDULEPLANNERMENU: Locator;
    readonly SCHEDULEPLANNERLINK: Locator;
    readonly TIMECARDS:Locator;
    readonly PASSWORDWFM_EDITBOX:Locator;
    readonly WFMLOGIN_BUTTON: Locator;
    readonly TIMECARD: Locator;
    readonly TIMECARDLINK: Locator;
    readonly GL_ANNUAL_LEAVE_P: Locator;
    readonly PICK_DATES: Locator;
    readonly START_DATE: Locator;
    readonly END_DATE: Locator;
    readonly APPLY_BUTTON: Locator;
    readonly SELECT_DURATION: Locator;
    readonly FULL_DURATION: Locator;
    readonly SUBMIT: Locator;
    readonly NOTIFICATIONTILELINK: Locator
    readonly LOGOUT: Locator;
    


    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;
        this.TIMECARDS  = page.getByRole('link', { name: 'All Timecards' })
        this.MANAGESCHEDULE = page.getByRole('heading', { name: 'Manage Timecards' });
        this.MAINMENU = page.getByLabel('Main Menu');
        this.SCHEDULEPLANNERMENU = page.getByLabel('Schedule Menu');
        this.SCHEDULEPLANNERLINK = page.getByLabel('Schedule Planner link');
        this.TIMECARD = page.getByLabel('Time Menu');
        this.TIMECARDLINK = page.getByLabel('Timecards link')
        this.GL_ANNUAL_LEAVE_P = page.getByText('GL-Annual Leave-P');
        this.PICK_DATES = page.getByPlaceholder('Pick dates');
        this.START_DATE = page.getByLabel('Start date');
        this.END_DATE = page.getByLabel('End Date');
        this.APPLY_BUTTON = page.getByRole('button', { name: 'Apply' });
        this.SELECT_DURATION = page.getByText('Select Duration');
        this.FULL_DURATION = page.locator('krn-ng-select-item').filter({ hasText: 'Full' }).locator('div').nth(1)
        this.SUBMIT = page.getByRole('button', { name: 'Submit', exact: true })
        this.NOTIFICATIONTILELINK = page.getByRole('link', { name: 'View All Notifications' });
        this.LOGOUT = page.getByLabel('Sign Out');
    }

    async demotest(): Promise<void> {
        await this.TIMECARDS.click();
    }

    async Signout(): Promise<void> {
        await this.MAINMENU.click();
        await this.LOGOUT.click();
    }

    async verfiyManageScheuleCard(): Promise<void>{
        await this.MANAGESCHEDULE.isVisible();
    }

    async ClickonMainMenu(): Promise<void>{
        await this.MAINMENU.click()
    }

    async openSchedulePlannerPage(): Promise<void>{
        await this.SCHEDULEPLANNERMENU.click()
        await this.SCHEDULEPLANNERLINK.click()
    }

    async OpenTimeCardPage(): Promise<void>{

        await this.TIMECARD.click()
        await this.TIMECARDLINK.click()
    }
    

    async TimeOff(Start_Date: string ,End_Date: string): Promise<void> {
        await this.GL_ANNUAL_LEAVE_P.click();
        await this.page.locator('#ngx-popover-1').getByText('GL-Annual Leave-P').click();
        await this.PICK_DATES.click();
        await this.START_DATE.fill(Start_Date);
        await this.END_DATE.clear();
        await this.END_DATE.fill(End_Date);
        await this.APPLY_BUTTON.click();
        await this.SELECT_DURATION.click();
        await this.FULL_DURATION.click();
        await this.SUBMIT.click();
    }

    // async  OpenNotification(): Promise<void> {
    //     if (await this.NOTIFICATIONTILELINK.isVisible()) {
    //         await this.NOTIFICATIONTILELINK.click();
    
    //         const elements = await this.page.getByRole('button', { name: 'Request GL-Time Off Request Employee' }).all();
    //         if (elements.length > 0) {
    //             for (const ele of elements) {
    //                 const rawText = await ele.textContent();
    //                 if (rawText) {
    //                     const cleanedText = rawText.replace(/\s+/g, ' ').trim();
    //                     console.log(cleanedText);
    //                 }
    //                 await ele.click();
    //             }
    //         } else {
    //             console.log("No matching elements found.");
    //         }
    //     } else {
    //         console.log("Notification tile link is not visible.");
    //     }
    // }

    async  OpenNotification(): Promise<void> {
         await this.NOTIFICATIONTILELINK.click();
        // Ensure the page is fully loaded
        await this.page.waitForLoadState('domcontentloaded');

    }   
}