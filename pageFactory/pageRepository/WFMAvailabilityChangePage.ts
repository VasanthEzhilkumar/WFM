import { WebActions } from "@lib/WebActions";
import { BrowserContext, Locator, Page, expect } from '@playwright/test';
import moment from 'moment';
import { throws } from "node:assert";



let webActions: WebActions;

export class WFMAvailabilityChangePage extends WebActions {
    readonly page: Page;
    readonly context: BrowserContext;
    readonly btnCangeMyAvailabilityRequest: Locator;
    readonly lnkGLAvailabilityOverride: Locator;
    readonly lnkGLAvailabilityPattern: Locator;
    readonly txtSelectAdate: Locator;
    readonly rdbtnSpecifyDate: Locator;
    readonly txtEndDate: Locator;
    readonly txtpatternepeatSelect: Locator;
    readonly drpdwRepeatEvery: Locator;
    readonly btnEditAvailability: Locator;
    readonly drpStatus: Locator;
    readonly txtStartTime: Locator;
    readonly txtEndtime: Locator;
    readonly ReplaceByPreSchedule: Locator;
    readonly save: Locator;
    readonly btnBack: Locator;
    readonly statuOption: Locator;
    readonly btnReview: Locator;
    readonly btnSubmit: Locator;
    readonly btnNext: Locator;
    apply: Locator;
    selectDate: Locator;
    timeoffSubmit: any;
    nextbtn: Locator;



    constructor(page: Page, context: BrowserContext) {
        super(page, context);
        this.page = page;
        this.context = context;

        this.apply = page.getByRole('button', { name: 'Apply', exact: true })
        this.nextbtn = page.getByRole('button', { name: 'Next', exact: true });
        this.selectDate = page.getByLabel('Dates ')
        this.btnCangeMyAvailabilityRequest = page.locator('#changeMyAvailabilityRequestButton');
        this.lnkGLAvailabilityOverride = page.frameLocator('//iframe[@title="Embedded content"]').getByText('GL-Availability Override')
        this.lnkGLAvailabilityPattern = page.frameLocator('//iframe[@title="Embedded content"]').getByText('GL-Availability Pattern');
        this.txtSelectAdate = page.frameLocator('//iframe[@title="Embedded content"]').getByPlaceholder('Select a date');
        this.txtEndDate = page.frameLocator('//iframe[@title="Embedded content"]').locator('#input-date-picker-id-availability-request-pattern-input-end-date');
        this.txtpatternepeatSelect = page.frameLocator('//iframe[@title="Embedded content"]').getByLabel('Repeat every');
        this.rdbtnSpecifyDate = page.frameLocator('//iframe[@title="Embedded content"]').getByLabel('Specify date');
        this.drpdwRepeatEvery = page.frameLocator('//iframe[@title="Embedded content"]').locator('#availability-request-pattern-repeat-select');
        this.btnEditAvailability = page.frameLocator('//iframe[@title="Embedded content"]').getByRole('button', { name: 'Edit availability' });
        this.drpStatus = page.frameLocator('//iframe[@title="Embedded content"]').getByLabel('Status', { exact: true });
        this.txtStartTime = page.frameLocator('//iframe[@title="Embedded content"]').getByLabel('Start Time', { exact: true });
        this.txtEndtime = page.frameLocator('//iframe[@title="Embedded content"]').getByLabel('End Time', { exact: true });
        this.ReplaceByPreSchedule = page.frameLocator('//iframe[@title="Embedded content"]').getByLabel('Replace Previously Scheduled')
        this.save = page.frameLocator('//iframe[@title="Embedded content"]').getByRole('button', { name: 'Save' })
        this.btnBack = page.frameLocator('//iframe[@title="Embedded content"]').getByRole('button', { name: 'Back' })
        this.statuOption = page.frameLocator('//iframe[@title="Embedded content"]').locator('#segmentEditorDropdown0').getByText('Unavailable', { exact: true })
        this.btnReview = page.frameLocator('//iframe[@title="Embedded content"]').getByRole('button', { name: 'Review' })
        this.btnSubmit = page.frameLocator('//iframe[@title="Embedded content"]').getByRole('button', { name: 'Submit' })
        this.btnNext = page.frameLocator('//iframe[@title="Embedded content"]').getByRole('button', { name: 'Next', exact: true });




    }

    async clickOnCangeMyAvailabilityRequest(): Promise<void> {
        await this.page.waitForTimeout(1000);
        if (await this.btnCangeMyAvailabilityRequest.isVisible()) {
            await this.btnCangeMyAvailabilityRequest.click();
        } else {
            console.log("Not present on screen")
        }
    }


    async clickOnGLAvailabilityPattern(): Promise<void> {
        await this.page.waitForTimeout(6000);
        if (await this.lnkGLAvailabilityPattern.isVisible()) {
            await this.lnkGLAvailabilityPattern.click();
            await this.clickOnApply();
        }
    }

    async clickOnGLAvailabilityChangesGeneric(GLAvailabilityChanges: string): Promise<void> {
        await this.page.waitForTimeout(6000);
        const lnkGLAvailabilityPattern1 = this.page.frameLocator('//iframe[@title="Embedded content"]').getByText(GLAvailabilityChanges, { exact: true });
        if (await lnkGLAvailabilityPattern1.isVisible()) {
            await lnkGLAvailabilityPattern1.click();
            await this.clickOnApply();
        }
    }

    async clickOnGLAvailabilityOverride(): Promise<void> {
        await this.page.waitForTimeout(4000);
        if (await this.lnkGLAvailabilityOverride.isVisible()) {
            await this.lnkGLAvailabilityOverride.click();
            await this.page.waitForTimeout(500);
            await this.clickOnApply();
        }
    }

    async clickOnApply() {
        await this.page.frameLocator('//iframe[@title="Embedded content"]').getByRole('button', { name: 'Apply' }).click();
    }

    async selectStartAndSpecifyDateWithBothUI(StartDate: string, EndDate: string) {
        if (await this.txtSelectAdate.isVisible()) {
            await this.setSelectAdateAndSpecifyDate(StartDate, EndDate);
        } else {
            await this.selectDates(StartDate, EndDate);
        }
    }

    async setSelectAdateAndSpecifyDate(StartDate: string, EndDate: string): Promise<void> {
        await this.page.waitForTimeout(3000);
        await this.txtSelectAdate.focus();
        await this.txtSelectAdate.fill(String(StartDate));
        await this.page.keyboard.press('Tab');
        await this.page.waitForTimeout(400);
        await this.rdbtnSpecifyDate.click();
        await this.txtEndDate.fill(String(EndDate));
        await this.page.keyboard.press('Tab');
    }

    async selectDates(startDateStr: string, endDateStr: string): Promise<void> {
        const frame = this.page.locator('iframe[id="angularIframeSlider"][title="Embedded content"]').contentFrame();
        const nextMonth = this.page.locator('iframe[id="angularIframeSlider"][title="Embedded content"]').contentFrame().getByRole('button', { name: 'Next month' })
        const preiousMonth = this.page.locator('iframe[id="angularIframeSlider"][title="Embedded content"]').contentFrame().getByRole('button', { name: 'Previous month' })
        const monthYearText = this.page.locator('iframe[id="angularIframeSlider"][title="Embedded content"]').contentFrame().locator('//div[@class="calendar-info-panel"]/div');

        let startDate = moment(startDateStr, 'DD/MM/YYYY', true);
        let endDate = moment(endDateStr, 'DD/MM/YYYY', true);
        const today = moment();
        let diffInDays: number;

        if (startDate.isValid() && endDate.isValid()) {
            diffInDays = endDate.diff(startDate, 'days');
            console.log(`Difference: ${diffInDays} days`);
        } else {
            console.error('One or both dates are invalid.');
        }

        const parsed = moment(startDateStr, 'DD/MM/YYYY', true);
        const month = parsed.format('MMMM'); // "May"
        const year = parsed.format('YYYY');  // "2025"
        const monthYearFromStartDate = month + " " + year;
        const dateFromApplication = await monthYearText.textContent();

        while (await monthYearText.textContent() !== monthYearFromStartDate) {
            await nextMonth.click();
        }

        diffInDays++;
        while (diffInDays > 0) {
            // Now format the current date in YYYY-MM-DD for data-date
            const formattedDate = startDate.format('YYYY-MM-DD'); // Match attribute format
            const dayName = startDate.format('dddd'); // For aria-label
            const ariaLabel = `${formattedDate} ${dayName} unselected`;

            // Build selectors
            const dateSelector = `//td[@data-date='${formattedDate}' and @role='button']`;
            const ariaLabelSelector = `//td[@aria-label='${ariaLabel}']`;
            // Interact with the date cell
            const dateElements = frame.locator(dateSelector);
            if (await dateElements.count() > 0) {
                const element = dateElements.first();
                await element.scrollIntoViewIfNeeded();
                await element.click({ force: true });
                const checkElement = frame.locator(ariaLabelSelector);
                if (await checkElement.count() > 0) {
                    await element.click({ force: true }); // Re-click if not selected
                }
            } else {
                console.warn(`Date ${formattedDate} not found in calendar`);
            }
            // // Increment the start date by one day
            startDate = startDate.add(1, 'days');
            diffInDays--;
        }

        const nextbtn = frame.getByRole('button', { name: 'Next', exact: true });
        if (await nextbtn.isDisabled()) {
            const errorMasg = await frame.locator('(//div[@class="msg-wrapper alert alert-error"]/div[contains(@id,"inpage-text-")]//span)[2]').innerText();
            console.log(`ERROR - ${errorMasg} `);
            //await expect(errorMasg).toBeNull();
            throw new Error(`error: ${errorMasg}`);
        } else {
            await nextbtn.click({ force: true });
        }
    }

    async setRepeatEveryAndDaysANDWeeks(RepeatDaysWeeks: string, RepeatNumber: string): Promise<void> {
        await this.page.waitForTimeout(3000);
        if (await this.drpdwRepeatEvery.count() > 0) {
            // await this.drpdwRepeatEvery.focus();
            // await this.drpdwRepeatEvery.click();
            await this.drpdwRepeatEvery.selectOption({ label: String(RepeatDaysWeeks) });
            await this.page.waitForTimeout(400);
            await this.txtpatternepeatSelect.click();
            await this.txtpatternepeatSelect.fill(String(RepeatNumber));
            await this.page.keyboard.press('Tab');
            await this.page.waitForTimeout(400);
            await this.btnNext.click();
        }

    }

    async clickEditAvailabilityByDays(StartTime: string, EndateTime: string, Status: string, RepeatNumber: string): Promise<void> {
        await this.page.waitForTimeout(3000);
        // await this.drpdwRepeatEvery.focus();
        // for (let i = 1; i < Number(RepeatNumber) + 1; i++) {
        const repeatNumberdays = await this.page.frameLocator('//iframe[@title="Embedded content"]').locator('//div[@class="availability-pattern-edit-day"]//input[contains(@aria-label,"Day ' + RepeatNumber + '")]')
        if (await repeatNumberdays.count() > 0 && await repeatNumberdays.isVisible()) {
            await this.page.frameLocator('//iframe[@title="Embedded content"]').locator('//div[@class="availability-pattern-edit-day"]//input[contains(@aria-label,"Day ' + RepeatNumber + '")]').click();
            await this.btnEditAvailability.click();
            await this.setStartEndatTimeWithStatus(StartTime, EndateTime, Status);
        } else {
            await this.setStartEndatTimeWithStatus(StartTime, EndateTime, Status);
        }
    }

    async clickReviewAndSubmit() {
        await this.page.waitForTimeout(2000);
        await this.btnReview.click();
        await this.page.waitForTimeout(2000);
        await this.btnSubmit.click();
    }


    async setStartEndatTimeWithStatus(StartTime: string, EndateTime: string, Status: string) {
        await this.drpStatus.click();
        await super.selectFromCustomDropDown(this.drpStatus, Status);
        await this.txtStartTime.focus();
        await this.txtStartTime.clear();
        await this.txtStartTime.fill(String(StartTime));

        await this.txtEndtime.focus();
        await this.txtEndtime.clear();
        await this.txtEndtime.fill(String(EndateTime));
        await this.clickOnSave();
    }

    async verifyCangeMyAvailabilityRequestPage() {
        await this.page.waitForTimeout(1000);
        await expect(this.btnCangeMyAvailabilityRequest).toBeVisible();
    }

    async clickOnSave() {
        const savebtn = await this.page.frameLocator('//iframe[@title="Embedded content"]').getByRole('button', { name: 'Save' });
        if (await savebtn.isVisible() && await savebtn.count() > 0) {
            await savebtn.click();
        }
    }

    async PK() {
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