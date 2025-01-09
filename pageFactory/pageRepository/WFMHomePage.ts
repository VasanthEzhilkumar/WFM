import { WebActions } from "@lib/WebActions";
import { BrowserContext, Locator, Page, expect } from '@playwright/test';
import moment from 'moment';
import { throws } from "node:assert";
import { error } from "node:console";

export class WFMHomePage extends WebActions {
    public page: Page;
    readonly context: BrowserContext;
    readonly MANAGESCHEDULE: Locator;
    readonly MAINMENU: Locator;
    readonly SCHEDULEPLANNERMENU: Locator;
    readonly SCHEDULEPLANNERLINK: Locator;
    readonly TIMECARDS: Locator;
    readonly PASSWORDWFM_EDITBOX: Locator;
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
    readonly timeOff: Locator;
    readonly apply: Locator;
    readonly selectDate: Locator;
    readonly timeoffSubmit: Locator;
    readonly timeoffApproval: Locator;
    readonly done: Locator;
    readonly maintenanaceMainMenu: Locator;
    readonly integrationLink: Locator;
    readonly runIntegration: Locator;
    readonly selectIntegrationslovakia: Locator;
    readonly dataViewReports: Locator;
    readonly reportLibrary: Locator;
    readonly administrationMenu: Locator;
    readonly dataImportToolLink: Locator;
    readonly importExportDataMenu: Locator;
    readonly dataShift: Locator;
    readonly viewTempplateLink: Locator;
    readonly openFilelink: Locator;
    readonly btnChooseFile: Locator;
    readonly btnrefresh: Locator;
    //readonly reportLibrary: Locator
    readonly addshift: Locator;
    readonly dataViewLibrary: Locator;

    constructor(page: Page, context: BrowserContext) {
        super(page, context);
        this.page = page;
        this.context = context;
        this.TIMECARDS = page.getByRole('link', { name: 'All Timecards' })
        this.MANAGESCHEDULE = page.getByRole('heading', { name: 'Manage Timecards' });
        this.MAINMENU = page.getByLabel('Main Menu');
        this.SCHEDULEPLANNERMENU = page.getByLabel('Schedule Menu');
        this.SCHEDULEPLANNERLINK = page.getByLabel('Schedule Planner link');
        this.TIMECARD = page.getByLabel('Time Menu');
        this.TIMECARDLINK = page.getByLabel('Timecards link')
        this.GL_ANNUAL_LEAVE_P = page.locator('#selectReasonId');
        this.PICK_DATES = page.getByPlaceholder('Pick dates');
        this.START_DATE = page.getByLabel('Start date');
        this.END_DATE = page.getByLabel('End Date');
        this.APPLY_BUTTON = page.getByRole('button', { name: 'Apply' });
        this.SELECT_DURATION = page.getByText('Select Duration');
        this.FULL_DURATION = page.locator('krn-ng-select-item').filter({ hasText: 'Full' }).locator('div').nth(1)
        this.SUBMIT = page.locator('#timeOffSubmitBtnId')
        this.NOTIFICATIONTILELINK = page.locator('#viewAllNotificationsLink-239');
        this.LOGOUT = page.getByLabel('Sign Out');
        this.timeOff = page.getByTitle('Enter Time Off').locator('div').nth(1);
        this.apply = page.getByRole('button', { name: 'Apply', exact: true })
        this.selectDate = page.getByLabel('Dates ')
        this.timeoffSubmit = page.getByRole('button', { name: 'Submit' });
        this.timeoffApproval = page.locator('krn-message-inpage div').filter({ hasText: 'Information Your time-off' }).nth(2);
        this.done = page.getByRole('button', { name: 'Done' });
        this.maintenanaceMainMenu = page.getByLabel('Maintenance Menu');
        this.integrationLink = page.getByLabel('Integrations link');
        this.runIntegration = page.locator('div').filter({ hasText: /^Run an Integration$/ });
        this.selectIntegrationslovakia = page.getByRole('dialog').getByRole('list').locator('div').filter({ hasText: 'Payroll Export - Slovakia' }).nth(4)
        this.dataViewReports = page.getByLabel('Dataviews & Reports Menu');
        this.reportLibrary = page.getByLabel('Report Library link');
        this.administrationMenu = page.getByLabel('Administration Menu');
        this.dataImportToolLink = page.getByLabel('Data Import Tool link');
        this.importExportDataMenu = page.locator("(//button[@aria-label='Import/Export Data Menu'])[1]");
        this.dataShift = page.getByText('CloseCancel Data - Shift');
        this.viewTempplateLink = page.getByLabel('View Template');
        this.openFilelink = page.getByLabel('Open File');
        this.btnChooseFile = page.getByRole('button', { name: 'Choose File' });
        this.btnrefresh = page.getByLabel('{{ lastRefreshOn }}');
        this.addshift = page.getByRole('button', { name: 'Add Shift' });
        this.dataViewLibrary = page.getByLabel('Dataview Library link');

    }

    async clickonTimeCard(): Promise<void> {
        await this.TIMECARDS.click();
    }

    async Signout(): Promise<void> {
        await this.MAINMENU.click();
        await this.LOGOUT.click();
    }

    async verfiyManageScheuleCard(): Promise<void> {
        await this.MANAGESCHEDULE.isVisible();
    }

    async ClickonMainMenu(): Promise<void> {
        await this.MAINMENU.click()
    }
    async openDataView(): Promise<void> {
        await this.dataViewReports.click();
        await this.dataViewLibrary.click();
    }

    async openSchedulePlannerPage(): Promise<void> {
        await this.SCHEDULEPLANNERMENU.click()
        await this.SCHEDULEPLANNERLINK.click()
    }

    async openMaintenanceMenu(): Promise<void> {
        await this.maintenanaceMainMenu.click();
    }

    async openReportView(): Promise<void> {
        await this.dataViewReports.click();
        await this.reportLibrary.click();
    }

    async OpenTimeCardPage(): Promise<void> {

        await this.TIMECARD.click()
        await this.TIMECARDLINK.click()
    }

    async rightclickEmp(empNumber: string): Promise<void> {
        await this.page.locator(`[personnumber="${empNumber}"]`).click({ button: 'right' });


    }

    async clicktimeoff(): Promise<void> {
        await this.timeOff.click()
    }

    async clickAdministrationAndOpenDataImportLink() {
        await this.administrationMenu.click()
        await this.dataImportToolLink.click()
    }

    // const frames = tab.frames();
    // for (const frame of frames) {
    //     const iframeElement = await frame.getByLabel('{{ lastRefreshOn }}');
    //     if (await iframeElement.isVisible()) {
    //         await iframeElement.click();
    //     }
    // }

    async clickImportExportData(filePath: string) {
        let errorMessage = null;
        try {
            const tab = await super.switchBetweenTabs("Data Import Tool");
            this.page = tab;
            await tab.locator("(//button[@aria-label='Import/Export Data Menu'])[1]").click();
            await tab.getByText('CloseCancel AOID COID Import').click();
            await tab.getByLabel('demo-tree').getByText('Data - Shift').click();
            await tab.getByLabel('View Template').click();
            await tab.getByLabel('Open File').click();
            // Click the button that triggers the file input dialog
            const uploadButton = await tab.locator("//*[text()='Choose File']/ancestor::button[@role='button']");
            await uploadButton.click();
            await this.page.waitForTimeout(5000);
            //await this.page.waitForEvent("filechooser");
            await super.uploadFile(filePath.toString());
            await this.page.waitForTimeout(2000);
            const fileName = filePath.split('\\')[3];
            // Optionally, submit the form or verify the success message
            const successMessage = await tab.locator('//div[contains(@class,"document-list ")]').textContent();
            const errorMessageLocator = await tab.getByText('Supported file type is .csv.');
            if (await errorMessageLocator.isVisible()) {
                errorMessage = errorMessageLocator.textContent();
            }

            if (await successMessage.includes(fileName) && errorMessage === null) {
                await expect(successMessage).toEqual(fileName)
                await tab.getByLabel('Upload', { exact: true }).click();
                //await tab.getByLabel('Save records').click();
                const status = await tab.locator("(//div[@col-id='templateName' and text()='Data - Shift']/following-sibling::div[@col-id='status'])[1]");
                while (await status.allInnerTexts() !== 'Success' || await status.allInnerTexts() !== 'Errors') {
                    await tab.locator('[id="lastRefreshButton"]').click();
                }
                const errorCol = await tab.locator("(//div[@col-id='templateName' and text()='People - Person Load']/following-sibling::*[@col-id='error'])[1]//div//ukg-link");
                if ((await status.textContent()) === 'Errors') {
                    errorCol.click();
                } else {
                    return "Passed";
                }
            } else {
                await tab.getByLabel('Cancel').click();
                await new throws(error);
            }
        } catch (error) {
            console.error();
            return error + errorMessage;
        }

    }


    async enterTimeoffDetails(payCode: string): Promise<void> {

        //await this.page.getByTitle(`${payCode}`).click();//('SK-Annual Leave')
        await this.apply.click();

    }

    async validateTimeoff(empid: string, leaveType: string, startDateStr: string, endDateStr: string): Promise<void> {

        await expect(this.page.locator('#inpage-text-0-')).toContainText('Information Your time-off request has been approved.');

        await this.done.click()


        await expect(this.page.locator(`[id="tor_${empid}_${startDateStr}T00\\:00\\:00"] div`)).toBeVisible();

        await this.page.locator(`[id="tor_${empid}_${startDateStr}T00\\:00\\:00"] div`).hover();



        const tooltip = this.page.locator('.entity-tooltip-segments');
        await this.page.waitForSelector('.entity-tooltip-segments', { state: 'visible' });

        // Extract the text content from the tooltip
        const tooltipText = await tooltip.innerText();
        console.log('Tooltip text:', tooltipText);

        // Expected values
        const expectedLeaveType = leaveType;
        const expectedDateRange = `${startDateStr} - ${endDateStr}`;

        // Split the tooltip text into segments
        const [actualLeaveType, actualDateRange] = tooltipText.split('\n');

        // Validate the leave type and date range
        if (actualLeaveType.includes(expectedLeaveType) && actualDateRange.includes(expectedDateRange)) {
            console.log('Tooltip matches the expected values');
        } else {
            console.log('Tooltip does not match the expected values');
        }

    }




    async selectDatesandSubmit(startDateStr: string, endDateStr: string): Promise<void> {
        let startDate = moment(startDateStr);
        let endDate = moment(endDateStr);
        await this.selectDate.click();

        while (startDate <= endDate) {
            // Get the formatted date and the day of the week
            const toDate = startDate.format('YYYY-MM-DD');
            const dayName = startDate.format('dddd'); // Get the full name of the day
            // Construct the aria-label based on the date and day name
            const ariaLabel = `${toDate} ${dayName} unselected`;
            const dateSelector = `//td[@aria-label='${ariaLabel}']`;
            await this.page.waitForTimeout(500);

            const elements = await this.page.locator(dateSelector);
            const count = await elements.count();
            const targetElement = elements.first();

            await targetElement.focus();
            await this.page.waitForTimeout(500);
            await targetElement.click({ force: true });


            // Create a locator for the date element

            // Increment the start date by one day
            startDate = startDate.add(1, 'days');
        }

        await this.apply.click();
        await this.timeoffSubmit.click();
    }

    async checkforApproval(): Promise<void> {

        await this.page.waitForTimeout(500);

        if ((await this.timeoffApproval.count()) > 0) {

        }


    }


    async TimeOff(Start_Date: string, End_Date: string, Reason: string): Promise<string> {
        await this.page.getByText('SK-Annual Leave.: Multiple').click();

        // Check if the element exists before clicking
        const reasonLocator = this.page.locator('#ngx-popover-1').getByText(Reason);

        try {
            // Wait for the element to be visible within a 5-second timeout
            await reasonLocator.waitFor({ timeout: 5000 });
            await reasonLocator.click();
        } catch (error) {
            // If the element is not found, throw an error and fail the test
            return (`Reason "${Reason}" not found. Test failed.`);
            // throw new Error(`Reason "${Reason}" not found. Test failed.`);
        }
        await this.PICK_DATES.click();
        await this.START_DATE.fill(Start_Date);
        await this.END_DATE.clear();
        await this.END_DATE.fill(End_Date);
        await this.APPLY_BUTTON.click();
        await this.SELECT_DURATION.click();
        await this.page.waitForTimeout(2000);
        await this.FULL_DURATION.click();
        await this.page.waitForTimeout(2000);
        await this.SUBMIT.click();
        await this.page.waitForTimeout(2000);



        if (await this.page.locator('#restartBtn').count() > 0) {

            return "Passed"


        }
        else {
            // Check for the error message after submission
            const errorMessageLocator = await this.page.locator('krn-ng-single-message div').textContent();
            const errorMessageVisible = await this.page.getByText('1 ErrorClose').isVisible();
            console.error('Test failed: ' + errorMessageLocator);
            return "Failed"

        }
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

    async OpenNotification(): Promise<void> {
        await this.NOTIFICATIONTILELINK.click();
        // Ensure the page is fully loaded
        await this.page.waitForLoadState('domcontentloaded');

    }
    async clickAddShift(): Promise<void> {
        await this.addshift.click();
    }
    async enterstarttimeendtime(ScheduleStartTime: string, ScheduleEndTime: string, START_DATE: string, END_Date: string) {
        await this.page.waitForTimeout(500);

        await this.page.locator("//input[@id='krntime_start_0_inptext']").clear();
        await this.page.locator("//input[@id='krntime_start_0_inptext']").type(ScheduleStartTime.toString());
        await this.page.keyboard.press("Tab");
        await this.page.waitForTimeout(500);
        await this.page.getByRole('textbox', { name: 'End Time' }).clear();
        await this.page.getByRole('textbox', { name: 'End Time' }).fill(ScheduleEndTime.toString());
        await this.page.keyboard.press("Tab");
        await this.page.keyboard.press("Enter");



        if (START_DATE != "NaN" && START_DATE != "N/A" && START_DATE != undefined) {
            await this.page.getByLabel('Start Date').clear();
            await this.page.getByLabel('Start Date').fill(START_DATE.toString());
        }
        if (END_Date != "NaN" && END_Date != "N/A" && END_Date != undefined) {
            await this.page.getByLabel('End Date').clear();
            await this.page.getByLabel('End Date').fill(END_Date.toString());
        }
        await this.page.locator("(//button[@id='wfs.addshift.btn.apply'])[1]").click();
        await this.page.waitForTimeout(500);

        //for Save the schedule front end
        //await this.page.locator('//i[@class="icon-k-save button-highlight"]').click();
    }

    //2-24-
    async validateSchedulePlanner(): Promise<string> {
        const locator = await this.page.locator("//div[@id='inpage-text-0-']//div[@class='multiple-lines-wrap']");

        // Check if the element is visible
        const isVisible = await locator.isVisible();

        if (isVisible) {
            return "Failed" + await locator.allInnerTexts.toString();
        } else {
            return "Passed";
        }
    }













}


