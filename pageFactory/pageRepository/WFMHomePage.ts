import { WebActions } from "@lib/WebActions";
import { BrowserContext, Locator, Page, expect } from '@playwright/test';
import moment from 'moment';
import { throws } from "node:assert";
import { error } from "node:console";
import { UnexpectedResponseException } from "pdfjs-dist-es5";

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
    readonly AddPayCode: Locator;
    //readonly reportLibrary: Locator
    readonly addshift: Locator;
    readonly settingsMenuButton: Locator;

    readonly dataViewLibrary: Locator;
    readonly empSearchlabel: Locator;

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
        this.AddPayCode = page.getByTitle('Add Pay code').locator('div').nth(1);

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
        this.settingsMenuButton = page.locator('//*[@automation-id="settingsMenuButton"]');
        this.dataViewLibrary = page.getByLabel('Dataview Library link');
        this.empSearchlabel = page.getByLabel('Employee Search')
    }

    async clickDutyManger(DutyManager: any) {//SK-Duty Manager
        await this.page.waitForTimeout(500);
        await this.page.getByLabel('My Role ' + DutyManager + ' not').click();
    }

    async clickSettingMenuButton(): Promise<string> {
        try {
            await this.page.waitForTimeout(500);
            await this.settingsMenuButton.click();
        } catch (error) {
            return "Failed :SwapToDutyManager/settings Menu Button options not available for this line manager"
        }

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

    async searchEmpviaEmpSearch(empId: string, option: string): Promise<void> {
        try {
            // Click the button to trigger the iframe load
            await this.empSearchlabel.click();

            // Wait for the iframe to load
            await this.page.waitForSelector('iframe[name^="portal-frame-"]', { timeout: 10000 });
            const frame = this.page.frameLocator('iframe[name^="portal-frame-"]');

            // Fill the employee ID and click Search
            await frame.getByLabel('Search by Employee Name or ID').fill(empId);
            await frame.getByRole('button', { name: 'Search', exact: true }).click();

            // Wait for the results to load and select the item
            await frame.getByLabel('Select Item').click();
            await frame.getByLabel('Go To').click();

            // Select the option from the dropdown
            await frame.getByRole('option', { name: option }).click();

            console.log(`Employee search completed for ID: ${empId} with option: ${option}`);
        } catch (error) {
            console.error(`Error during employee search: ${error.message}`);
            throw new Error(`Failed to search employee: ${error.message}`);
        }
    }
    //   this.page.frameLocator('iframe[name="portal-frame-264743002521"]').getByLabel('Search by Employee Name or ID').fill("10649101")
    //   this.page.frameLocator('iframe[name="portal-frame-264743002521"]').locator('form div').filter({ hasText: 'Search' }).nth(2).click();
    //  this.page.frameLocator('iframe[name="portal-frame-264743002521"]').getByLabel('Select Item').click();
    //   this.page.frameLocator('iframe[name="portal-frame-264743002521"]').locator('#krn-slat-0-slat-area-2').first().click();
    //   await this.page.frameLocator('iframe[name="portal-frame-264743002521"]').getByLabel('Select Item').check();
    //   await this.page.frameLocator('iframe[name="portal-frame-264743002521"]').getByLabel('Go To').click();
    //   await this.page.frameLocator('iframe[name="portal-frame-264743002521"]').getByRole('option', { name: 'Timecard' }).click();



    async ClickonMainMenu(): Promise<void> {
        await this.page.waitForTimeout(500);
        await this.MAINMENU.click();

    }

    async ClickonCloseMenu(): Promise<void> {
        await this.page.waitForTimeout(500);
        await this.page.getByRole('button', { name: 'Close Menu' }).click();
    }

    async ClickOnHomeLink(): Promise<void> {
        await this.page.waitForTimeout(500);
        //await this.page.getByLabel('Home link').click();
        await this.page.getByRole('button', { name: 'Home' }).click();
        await this.page.waitForTimeout(5000);
    }


    async clickDataView(): Promise<void> {
        await this.page.waitForTimeout(500);
        await this.dataViewLibrary.click();
        await this.page.waitForTimeout(5000);
    }

    async openDataView(): Promise<void> {
        await this.dataViewReports.click();
        await this.page.waitForTimeout(500);
        await this.dataViewLibrary.click();
        await this.page.waitForTimeout(6000);
    }
    async isDataViewAvailable() {
        try {
            const dataViewElement = await this.page.locator("//div[@id='585_category'][@class='expander']"); // Replace with actual selector
            return await dataViewElement.isVisible(); // Return true if DataView is visible
        } catch (error) {
            return false; // Return false if an error occurs (e.g., element not found)
        }
    }

    async isDataViewAndReportViewAvailable() {
        try {
            return await this.dataViewReports.isVisible(); // Return true if DataView is visible
        } catch (error) {
            return false; // Return false if an error occurs (e.g., element not found)
        }
    }

    async ClickonchangeMyAvailabilityRequest() {
        await this.page.waitForTimeout(500);
        await this.page.locator('#changeMyAvailabilityRequestButton').click();
    }

    async openSchedulePlannerPage(): Promise<void> {
        await this.SCHEDULEPLANNERMENU.click()
        await this.SCHEDULEPLANNERLINK.click()
    }

    async openSchedulePlannerForEmployee(empid: any): Promise<void> {
        await super.selectScheduleForEmployee(String(empid).trim());
    }


    async openMaintenanceMenu(): Promise<void> {
        await this.maintenanaceMainMenu.click();
    }

    async openReportView(): Promise<void> {
        await this.page.waitForTimeout(500);
        await this.dataViewReports.click();
        await this.reportLibrary.click();

    }
    async clickReportLibrary(): Promise<void> {
        await this.page.waitForTimeout(500);
        await this.reportLibrary.click();
    }

    async OpenTimeCardPage(): Promise<void> {
        await this.TIMECARD.click()
        await this.TIMECARDLINK.click()
    }

    async rightclickEmp(empNumber: string): Promise<void> {
        await this.page.waitForTimeout(800);
        await this.page.locator(`[personnumber="${empNumber}"]`).click({ button: 'right' });
    }

    async clicktimeoff(): Promise<void> {
        await this.timeOff.click()
    }
    async clickOnAddPayCode(): Promise<void> {
        await this.AddPayCode.click()
    }
    async clickOnCancelbtn(): Promise<void> {
        await this.page.getByRole('button', { name: 'Cancel' }).first().click()
    }

    async clickAdministrationAndOpenDataImportLink() {
        await this.administrationMenu.click()
        await this.dataImportToolLink.click()
    }

    async validateSwapToDutyManagerPersona(dutyManager: string): Promise<string> {

        try {
            this.page.waitForTimeout(500);
            if (await this.page.getByText('Acting as ' + dutyManager.toString().trim() + '').isVisible()) {
                return "Passed";
            } else {
                return "Failed";
            }
        } catch (error) {
            return "Failed";
        }
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
            console.error("Data not imported" + error + errorMessage);
            return error + errorMessage;
        }

    }

    async enterTimeoffDetails2(payCode: string): Promise<void> {
        try {
            const TimeOffRequest = await this.page.locator('//div/label[@class="radio-btn ng-binding" and contains(text(),"-Time Off Request")]');
            const originalTimeOFF = await this.page.locator('(//div[@role="menu"]//label[text()="' + payCode.trim() + '"])[1]');
            await this.page.waitForTimeout(3000);
            if (await originalTimeOFF.count() > 0) {
                await this.page.waitForTimeout(1000);
                await originalTimeOFF.click();
                await this.apply.click();
            } else if (await TimeOffRequest.isVisible() && await TimeOffRequest.count() > 0) {
                await this.page.waitForTimeout(1000);
                await TimeOffRequest.click();
                await this.apply.click();
                await this.page.waitForTimeout(3000);
                const paycodeTImeOff = await this.page.locator('(//div[@role="menu"]//div[@class="radio-btn accruals-container"]/label[text()="' + payCode.trim() + '"])[1]');
                await paycodeTImeOff.click();
            }
            //await this.page.getByText(`${payCode}`).first().click();//('SK-Annual Leave');
        } catch (error) {
            console.error("Failed: Exact paycode not found.");
            throw new Error("Failed: Exact paycode not found." + error);
        }
    }

    async enterTimeOffByaddPayCode(payCode: string, duration: string, dates: string): Promise<void> {
        // try {
        //const comboboxPayCode = this.page.getByRole('combobox', { name: 'Paycode*' });
        const comboboxPayCode = this.page.locator("(//button[@role='combobox' and @aria-labelledby='paycode-label'])[1]");
        // const comboboxPayCode = this.page.getByLabel('Pay code', { exact: true });
        const selectPaycodes = this.page.locator("//li[@role='menuitem']//span[@title='" + String(payCode) + "']");
        const selectDuration = this.page.locator("//li[@role='menuitem']//span[@title='" + String(duration) + "']");
        const durationComboxBox = this.page.getByLabel('Duration');
        const saveBtn = this.page.getByLabel('Save Schedule Content');

        const txtAmountHours = this.page.getByLabel('Amount Hours');
        const selectDate = this.page.getByPlaceholder('Select a date');

        await this.page.waitForTimeout(2000);
        if (await comboboxPayCode.isVisible()) {
            await this.page.waitForTimeout(500);
            await comboboxPayCode.click();
            await this.page.waitForTimeout(500);
            await this.page.getByRole('textbox', { name: 'Search' }).fill(String(payCode));
            await this.page.waitForTimeout(500);
            //await selectPaycodes.scrollIntoViewIfNeeded();
            await selectPaycodes.click();
        }
        //Full Schedule Day
        await this.page.waitForTimeout(500);
        if (await durationComboxBox.isVisible() && duration !== '' && duration !== undefined) {
            await this.page.waitForTimeout(500);
            await durationComboxBox.click();
            //await this.page.waitForTimeout(500);
            await selectDuration.click();
        }
        await this.page.waitForTimeout(500);
        if (await selectDate.isVisible() && dates !== '' && dates !== undefined) {
            await this.page.waitForTimeout(500);
            await selectDate.click();
            // await this.page.waitForTimeout(500);
            await selectDate.clear();
            await selectDate.fill(String(dates)); await selectDate.press('Tab');
        }

        await this.page.waitForTimeout(500);
        await this.apply.click();
        await saveBtn.click();
        await this.page.waitForTimeout(500);
        const warningPopup = this.page.getByRole('heading', { name: 'Warning' });
        const saveAndNotify = this.page.getByRole('button', { name: 'Save & Notify' });
        await this.page.waitForTimeout(500);
        if (await warningPopup.isVisible()) {
            if (await saveAndNotify.isVisible()) {
                await saveAndNotify.click();
            }
        }
        // } 
    }

    async enterTimeoffDetails(payCode: string): Promise<void> {
        await this.page.getByTitle(`${payCode}`).click();//('SK-Annual Leave')
        await this.apply.click();
    }


    async selectDates(startDateStr: string, endDateStr: string) {
        let startDate = moment(startDateStr);
        let endDate = moment(endDateStr);
        await this.selectDate.click();

        while (startDate <= endDate) {
            // Get the formatted date and the day of the week
            const toDate = startDate.format('YYYY-MM-DD');
            const dayName = startDate.format('dddd'); // Get the full name of the day
            await this.page.waitForTimeout(500);
            // Construct the aria-label based on the date and day name
            const ariaLabel = `${toDate} ${dayName} unselected`;
            const dateSelector1 = `//td[@aria-label='${ariaLabel}']`;
            const dateSelector = `//td[@data-date='${toDate}' and @role='button']`;
            await this.page.waitForTimeout(500);
            const elements = await this.page.locator(dateSelector);
            const count = await elements.count();
            const targetElement = elements.first();
            await targetElement.focus();
            await this.page.waitForTimeout(500);
            await targetElement.click({ force: true });
            const toCheckElement = await this.page.locator(dateSelector1).first();
            if (await toCheckElement.count() > 0) {
                await targetElement.focus();
                await this.page.waitForTimeout(500);
                await targetElement.click({ force: true });
            }
            // Create a locator for the date element
            // Increment the start date by one day
            startDate = startDate.add(1, 'days');
        }
    }



    async clickDoneAndOpenScheduleForEmployee(empid: string): Promise<string> {
        try {
            await expect(this.page.locator('#inpage-text-0-')).toContainText('Information Your time-off request has been approved.');
            await this.done.click()
            return "Passed";
        } catch (error) {
            return "Failed";
        }

        //await super.selectScheduleForEmployee(empid);
    }

    async validateAddPaycodes(empid: string, leaveType: string, startDateStr: any, endDateStr: string): Promise<string> {
        try {
            await expect(this.page.getByText('Success', { exact: true }).first()).toBeVisible();
            await this.page.waitForTimeout(2000);
            let startDate = moment(startDateStr);
            const toDate = startDate.format('YYYY-MM-DD');
            //'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
            // await expect(this.page.locator(`[id="tor_${empid}_${toDate}T00\\:00\\:00"] div`).first()).toBeVisible();
            // await this.page.locator(`[id="tor_${empid}_${toDate}T00\\:00\\:00"] div`).first().hover();

            // const tooltip = this.page.locator('.entity-tooltip-segments');
            // await this.page.waitForSelector('.entity-tooltip-segments', { state: 'visible' });

            // // Extract the text content from the tooltip
            // const tooltipText = await tooltip.innerText();
            // console.log('Tooltip text:', tooltipText);

            // // Expected values
            // const expectedLeaveType = leaveType;
            // const expectedDateRange = `${startDateStr} - ${endDateStr}`;

            // // Split the tooltip text into segments
            // const [actualLeaveType, actualDateRange] = tooltipText.split('\n');

            // // Validate the leave type and date range
            // if (actualLeaveType.includes(expectedLeaveType) && expectedDateRange.includes(actualDateRange)) {
            //     console.log('Tooltip matches the expected values');
            return "Passed";
            // } else {
            //     console.log('Tooltip does not match the expected values');
            //     return "Failed";
            // }
        } catch (error) {
            return "Failed";
        }
    }

    async validateTimeoff(empid: string, leaveType: string, startDateStr: any, endDateStr: string): Promise<string> {
        try {


            // await expect(this.page.locator('#inpage-text-0-')).toContainText('Information Your time-off request has been approved.');
            // await this.done.click()
            await this.page.waitForTimeout(2000);
            let startDate = moment(startDateStr);
            const toDate = startDate.format('YYYY-MM-DD');
            //'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
            await expect(this.page.locator(`[id="tor_${empid}_${toDate}T00\\:00\\:00"] div`).first()).toBeVisible();
            await this.page.locator(`[id="tor_${empid}_${toDate}T00\\:00\\:00"] div`).first().hover();

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
            if (actualLeaveType.includes(expectedLeaveType) && expectedDateRange.includes(actualDateRange)) {
                console.log('Tooltip matches the expected values');
                return "Passed";
            } else {
                console.log('Tooltip does not match the expected values');
                return "Failed";
            }
        } catch (error) {
            return "Failed";
        }
    }




    async selectDatesandSubmit(startDateStr: string, endDateStr: string): Promise<void> {
        let startDate = moment(startDateStr);
        let endDate = moment(endDateStr);
        await this.selectDate.click();

        while (startDate <= endDate) {
            // Get the formatted date and the day of the week
            const toDate = startDate.format('YYYY-DD-MM');
            const startDatefroDay = moment(toDate);
            const dayName = startDatefroDay.format('dddd'); // Get the full name of the day
            await this.page.waitForTimeout(500);
            // Construct the aria-label based on the date and day name
            const ariaLabel = `${toDate} ${dayName} unselected`;
            const dateSelector1 = `//td[@aria-label='${ariaLabel}']`;
            const dateSelector = `//td[@data-date='${toDate}' and @role='button']`;
            await this.page.waitForTimeout(500);
            const elements = await this.page.locator(dateSelector);
            const count = await elements.count();
            const targetElement = elements.first();
            await targetElement.focus();
            await this.page.waitForTimeout(500);
            await targetElement.click({ force: true });
            const toCheckElement = await this.page.locator(dateSelector1).first();
            if (await toCheckElement.count() > 0) {
                await targetElement.focus();
                await this.page.waitForTimeout(500);
                await targetElement.click({ force: true });
            }

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

        await this.page.locator('#one-click-time-off-advanced-btn').click();
        //await this.page.locator('ukg-item').filter({ hasText: 'Request type *' }).click();
        await this.page.getByText('Request type *').click();
        // await this.page.getByLabel('Request type *: ').click();
        await this.page.getByRole('menuitemradio', { name: `${Reason}` }).click();
        // await this.page.getByLabel('Starting date *').getByPlaceholder('DD/MM/YYYY').click();
        // await this.page.getByLabel('Starting date *').getByPlaceholder('DD/MM/YYYY').fill(Start_Date);
        // await this.page.getByLabel('End date *').getByPlaceholder('DD/MM/YYYY').click();
        // await this.page.getByLabel('End date *').getByPlaceholder('DD/MM/YYYY').fill(End_Date);

        await this.page.getByRole('group', { name: 'Start Date' }).or(this.page.getByLabel('Starting date *')).getByPlaceholder('DD/MM/YYYY').click();
        await this.page.getByRole('group', { name: 'Start Date' }).or(this.page.getByLabel('Starting date *')).getByPlaceholder('DD/MM/YYYY').fill(Start_Date);
        await this.page.getByRole('group', { name: 'End Date' }).or(this.page.getByLabel('End date *')).getByPlaceholder('DD/MM/YYYY').click();
        await this.page.getByRole('group', { name: 'End Date' }).or(this.page.getByLabel('End date *')).getByPlaceholder('DD/MM/YYYY').fill(End_Date);
        await this.page.waitForTimeout(1000);
        await this.page.getByRole('button', { name: 'Next' }).dblclick({ 'force': true });
        await this.page.getByRole('button', { name: 'Next' }).dblclick({ 'force': true });
        await this.page.waitForTimeout(2000);
        await this.page.getByRole('button', { name: 'Submit' }).click({ 'force': true });
        await this.page.waitForTimeout(2000);
        const error1 = await this.page.locator('//*[@data-tag-name="banner"]//span');
        let errorMsg;

        if (await error1.isVisible()) {
            errorMsg = await error1.innerText();
        }
        
        // if (await error.isVisible()) {
        //     await this.page.getByRole('textbox', { name: 'Start time' }).click();
        //     await this.page.getByRole('textbox', { name: 'Start time' }).fill("9");
        //     await this.page.getByRole('textbox', { name: 'End time' }).click();
        //     await this.page.getByRole('textbox', { name: 'End time' }).fill("17");
        //     await this.page.keyboard.press('Tab');
        //     await this.page.getByRole('button', { name: 'Submit' }).click({ 'force': true });
        //     errorMsg = undefined;
        // }

        if (errorMsg === "" || errorMsg === undefined) {
            return "Passed";
        } else {
            return "Failed - " + errorMsg;
        }

        // if (await this.page.locator('#restartBtn').count() > 0) {

        //     return "Passed"


        // }
        // else {
        //     // Check for the error message after submission
        //     const errorMessageLocator = await this.page.locator('krn-ng-single-message div').textContent();
        //     const errorMessageVisible = await this.page.getByText('1 ErrorClose').isVisible();
        //     console.error('Test failed: ' + errorMessageLocator);
        //     return "Failed"

        // }
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


