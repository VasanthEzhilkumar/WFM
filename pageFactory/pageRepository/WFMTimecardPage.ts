import { WebActions } from '@lib/WebActions';
import { BrowserContext, Locator, Page } from '@playwright/test';
import { throws } from 'assert';
import { error } from 'console';


export class WFMTimecardPage extends WebActions {
    readonly page: Page;
    readonly context: BrowserContext;
    readonly EMP_SELECTORDROPDOWN: Locator;
    readonly EMP_SEARCHBAR: Locator;
    readonly EMP_LIST: Locator;
    readonly EMP_Select: Locator;
    readonly EMP_Selected: Locator;
    readonly EMP_NAME: Locator;
    readonly TIMECARD_SAVE: Locator;
    readonly TIMECARD_TOTAL: Locator;
    readonly TIMECARD_TOTAL_CLOSE: Locator
    readonly APPLY_OVERTIME: Locator
    //Loctors for punch in -out
    readonly txtInPunch: Locator;
    readonly txtInPunch2: Locator;
    readonly txtOutPunch: Locator;
    readonly txtOutPunch2: Locator;
    readonly txtOutPunch21: Locator;
    readonly btnAddPunch: Locator;
    readonly btnSave: Locator;
    readonly btnLoadMore: Locator;
    readonly CurrentPayPeriod: Locator;
    readonly SelectRange: Locator;
    readonly Apply: Locator;
    readonly ToOvertimeSpansOne: Locator;
    readonly ToOvertimeSpansTwo: Locator;

    ariaLabel: string;




    constructor(page: Page, context: BrowserContext) {
        super(page, context);
        this.page = page;
        this.context = context;
        this.EMP_SELECTORDROPDOWN = page.getByLabel('Employee selector');
        this.EMP_SEARCHBAR = page.getByRole('textbox', { name: 'Search' });
        this.EMP_LIST = page.locator('//li[@id="combo_li0"]');
        this.EMP_Select = page.getByRole('button', { name: 'Select people' });
        this.EMP_Selected = page.getByRole('menu', { name: 'Select people' }).locator('label');
        this.EMP_NAME = page.locator('[personnumber="80010054"]');
        this.TIMECARD_SAVE = page.getByTitle('Save').locator('div').nth(1);
        this.TIMECARD_TOTAL = page.getByRole('tab', { name: 'Totals' });
        this.TIMECARD_TOTAL_CLOSE = page.getByLabel('Close Totals');
        //locators for punch in-out
        this.txtInPunch = this.page.locator('#segment0inPunch');
        this.txtInPunch2 = this.page.locator('#segment1inPunch');
        this.txtOutPunch = this.page.locator('#segment0outPunch');
        this.txtOutPunch2 = this.page.locator('//input[@id="segment1outPunch"]');
        this.txtOutPunch21 = this.page.locator('//input[@id="segment2outPunch"]');
        this.btnAddPunch = this.page.getByRole('button', { name: 'Add Punch' });
        this.btnSave = this.page.getByRole('button', { name: 'Save' });
        this.btnLoadMore = this.page.getByRole('button', { name: 'Load More' });
        // this.CurrentPayPeriod = page.getByTitle('Select Timeframe');
        // this.CurrentPayPeriod = page.getByRole('button', { name: 'Current Schedule Period' });
        this.CurrentPayPeriod = page.locator('(//span[contains(@class,"timeframe btn-link")]//button[contains(@title,"Select Time")])[1]');
        //this.CurrentPayPeriod = page.getByTitle('Select Timeframe');
        this.SelectRange = page.getByRole('button', { name: 'Select Range' });
        this.Apply = page.getByRole('button', { name: 'Apply' });
        //Updated CurrentPayPeriod to below locator so that it will work with both UK English and American English by Ramchandra
        // this.CurrentPayPeriod = page.locator('//button[contains(@class,"select-timeframe-button")]');
        // this.SelectRange = page.getByRole('button', { name: 'Select Range' });
        // this.Apply = page.getByRole('button', { name: 'Apply' });
        this.ToOvertimeSpansOne = page.getByLabel('To', { exact: true });
        this.ToOvertimeSpansTwo = page.getByLabel('To', { exact: true }).nth(1);
    }

    async SearchEMP_Timecard(EmpName: string): Promise<void> {
        await this.EMP_SELECTORDROPDOWN.click();
        await this.EMP_SEARCHBAR.click();
        await this.EMP_SEARCHBAR.fill(EmpName);
        await this.EMP_LIST.click();
    }

    async selectPreviousPayPeriod() {
        await this.page.getByTitle('Select Timeframe').click();
        await this.page.getByText('Previous Pay Period').click();
        await this.page.waitForTimeout(1500);
        const txtListView = this.page.getByLabel('List View');
        const btnLoadMore = this.page.getByRole('button', { name: 'Load More' });
        await txtListView.click();
        await btnLoadMore.click();
    }

    async clickListViewAndclickOnLoadMore() {
        const txtListView = this.page.getByLabel('List View');
        const btnLoadMore = this.page.getByRole('button', { name: 'Load More' });
        await txtListView.click();
        if (await btnLoadMore.count() > 0) {
            await btnLoadMore.click();
        }

    }

    async selectPayPeriodBydateRange(StartDate: string, EndDate: string) {

        await this.page.waitForTimeout(500);
        await this.CurrentPayPeriod.click();
        await this.SelectRange.click();
        await this.page.locator("(//input[@id='startDateTimeInput'])[1]").focus();
        await this.page.waitForTimeout(500);
        await this.page.locator("(//input[@id='startDateTimeInput'])[1]").fill(StartDate);
        // await this.page.waitForTimeout(200);
        await this.page.locator("(//input[@id='endDateTimeInput'])[1]").focus();
        await this.page.waitForTimeout(500);
        await this.page.locator("(//input[@id='endDateTimeInput'])[1]").fill(EndDate);
        // await this.page.waitForTimeout(200);
        await this.Apply.first().focus();
        await this.Apply.first().click();
        await this.page.waitForTimeout(500);

    }

    async justifyExceptionstesting(empPayCodes: string): Promise<string> {
        try {
            const payCodes = empPayCodes.split(',').map(code => code.trim());

            let warningIcons = await this.page.locator('.icon-k-warning');

            let i = 0;
            while (await warningIcons.count() > 0) {
                // Fetch the latest warning icon dynamically
                const firstIcon = warningIcons.first();

                if (!firstIcon) break; // If no more icons, exit

                await firstIcon.click({ button: 'right' });

                await this.page.getByText('Justify Exception').click();

                // Select pay code dynamically
                const payCodeToSelect = i < payCodes.length ? payCodes[i] : payCodes[payCodes.length - 1];
                await this.page.waitForTimeout(1000);
                await this.page.getByLabel('Pay code', { exact: true }).selectOption(empPayCodes);
                //await this.page.getByLabel('Pay code').nth(3).selectOption(payCodeToSelect);

                // Approve justification
                await this.page.locator('#justify-exception-approve').click();

                // Optional: Wait for UI update before proceeding
                await this.page.waitForTimeout(1000);

                // Re-fetch the warning icons after modification
                warningIcons = await this.page.locator('.icon-k-warning');

                i++;
                await this.page.waitForTimeout(1000);
            }

            return "Passed";
        } catch (error) {
            console.error("Justification failed:", error);
            return "Failed";
        }
    }

    async justifyExceptions(empPayCodes: string): Promise<string> {
        try {
            const payCodes = empPayCodes.split(',').map(code => code.trim());

            let warningIcons = await this.page.locator('.icon-k-warning');

            let i = 0;
            const firstIcon = warningIcons.first();
            await firstIcon.click({ button: 'right' });

            await this.page.getByText('Justify Exception').click();

            // Select pay code dynamically
            const payCodeToSelect = i < payCodes.length ? payCodes[i] : payCodes[payCodes.length - 1];
            await this.page.waitForTimeout(1000);
            await this.page.getByLabel('Pay code', { exact: true }).selectOption(empPayCodes);
            //await this.page.getByLabel('Pay code').nth(3).selectOption(payCodeToSelect);

            // Approve justification
            await this.page.locator('#justify-exception-approve').click();

            // Optional: Wait for UI update before proceeding
            await this.page.waitForTimeout(1000);

            return "Passed";
        } catch (error) {
            console.error("Justification failed:", error);
            return "Failed";
        }
    }



    async punchTime(index: number, inpunch: string, outpunch: string, addTime?: boolean): Promise<void> {
        // Format the index for locators based on the value of index
        const formattedIndex = index >= 10 ? `\\3${Math.floor(index / 10)} ${index % 10}` : `\\3${index}`;

        // Create locators with the properly formatted index
        const inpunchLocator = this.page.locator(`[id="${formattedIndex}_inpunch"]`);
        const outpunchLocator = this.page.locator(`[id="${formattedIndex}_outpunch"]`);
        const addButtonLocator = this.page.locator(`[id="${formattedIndex}_add"] span`);

        // Retry function for click and fill actions
        async function retryClickAndFill(clickLocator: Locator, inputText: any, retries = 2) {
            let attempts = 0;
            while (attempts < retries) {
                try {
                    //  await clickLocator.waitFor({ state: 'attached' });
                    // Try clicking the locator
                    await clickLocator.click({ 'force': true });
                    await this.page.waitForTimeout(2000);
                    // Wait for the textbox to appear and fill the value
                    const setInputText = await this.page.getByRole('textbox');
                    await this.page.waitForTimeout(2000);
                    await setInputText.fill(inputText.toString());
                    // If the fill was successful, break the loop
                    break;
                } catch (error) {
                    console.log(`Attempt ${attempts + 1} failed: ${error.message}`);
                    attempts++;

                    // If maximum attempts reached, throw an error
                    if (attempts >= retries) {
                        throw new Error(`Failed to fill the textbox after ${retries} attempts`);
                    }
                    // Optional: Add a short delay before retrying
                    await this.page.waitForTimeout(1000);
                }
            }
        }

        // Perform the punch-in and punch-out actions with retry logic
        if (inpunch != null && inpunch != undefined) {
            // Apply retry logic for inpunch
            await retryClickAndFill.call(this, inpunchLocator, inpunch);
        }
        if (outpunch != null && outpunch != undefined) {
            // Apply retry logic for outpunch
            await retryClickAndFill.call(this, outpunchLocator, outpunch);
        }
        // Handle the "add time" condition
        if (addTime) {
            await addButtonLocator.click();

        } else {
            // Increment the index and format it again
            index = index + 1;
            const formattedNextIndex = index >= 10 ? `\\3${Math.floor(index / 10)} ${index % 10}` : `\\3${index}`;
            if (await this.page.locator(`[id="${formattedNextIndex}_inpunch"]`).count() > 0) {
                await this.page.locator(`[id="${formattedNextIndex}_inpunch"]`).dblclick();
            } else {
                console.log('Next punch not found, skipping...');
            }
            // await this.page.locator(`[id="${formattedNextIndex}_inpunch"]`).dblclick();
            await this.page.waitForTimeout(3000);
        }
    }



    async editPunchFillandApply(inputString: string, selectPunch: string): Promise<string> {
        await this.page.waitForTimeout(1000);
        await this.page.locator('//div[@data-component="timeComponent"]//input[@id="punch-effective-time_inptext"]').focus();
        await this.page.waitForTimeout(1000);
        await this.page.locator('//div[@data-component="timeComponent"]//input[@id="punch-effective-time_inptext"]').fill(inputString);
        // await this.page.waitForTimeout(1000);
        await this.page.keyboard.press('Tab');
        await this.page.locator('//button[@type="button" and @aria-labelledby="punch-editor-override-label"]').click({ 'force': true });
        await this.page.locator("//a/span[text() ='" + selectPunch + "']").scrollIntoViewIfNeeded();
        await this.page.locator("//a/span[text() ='" + selectPunch + "']").click();
        await this.page.getByRole('button', { name: 'Apply' }).click({ 'force': true });
        // await this.page.waitForTimeout(1000);
        const alertMsg = await this.page.locator('//div[@class="msg-wrapper alert alert-error"or @class="inline-error"]');
        await this.page.waitForTimeout(1000);
        if (await alertMsg.isVisible()) {
            const alertPopupMsg = await alertMsg.allInnerTexts();
            console.log(alertPopupMsg);
            const error1 = alertPopupMsg + "& find failed Screenshot Path:->" + String(await super.takeScreenShot());
            // await this.page.waitForTimeout(1000);
            await this.page.locator('//div[@class="text-right"]//button[text()="Cancel" and @id="punch_cancel" ]').click();
            if (alertPopupMsg !== null) {
                return error1;
            }
        }
    }

    /*
   @Auther: Madhukar Kirkan
   @Description: This function is valid TimeCard Exceptions such as early in-out, late in-out, long break and out of sequense.
   @Date: 27/11/2024
 */
    async puchExceptions(date: string, exceptions: string, expectedCondition: string): Promise<string> {
        let dateArray = date.split(" ");
        const weekday = dateArray[0].trim();
        let month = dateArray[1].split("/")[1].trim();
        let dateDigit = dateArray[1].split("/")[0].trim();
        let resultMsgError = "";
        let errorMsgafterSave = "";
        let flag = false;
        //----------------------------------------------------------------------------------------------------
        const selectListViewForPucnhInOut = this.page.locator("//div[@class='tk-calendar-box']//div[contains(text(),'" + weekday + "')]/following-sibling::div[contains(text(),'" + dateDigit + "')]");
        //--------------------------------------------------------------------------------------------------------

        try {
            await this.page.waitForTimeout(1000);
            if (await selectListViewForPucnhInOut.count() > 0) {
                console.log("List view for punch In-Out is present on screen");
            } else {
                if (await this.btnLoadMore.count() > 0) {
                    await this.page.waitForTimeout(500);
                    await this.btnLoadMore.scrollIntoViewIfNeeded();
                    await this.btnLoadMore.click();
                }
            }

            if (await selectListViewForPucnhInOut.count() > 0) {
                await this.page.waitForTimeout(2000);
                await selectListViewForPucnhInOut.click();
                const actualExceptions = await this.getExceptions();
                //await this.page.waitForTimeout(500);
                const btncancel = await this.page.locator('(//div[@class="text-right"]//button[text()="Cancel"])[1]');
                const btnYes = await this.page.locator('//button[@aria-label="Yes"]');
                await this.page.waitForTimeout(1000);
                if (await btncancel.isVisible()) {
                    await btncancel.click();
                    await this.page.waitForTimeout(800);
                    if (await btnYes.isVisible()) {
                        await btnYes.click();
                    }
                }

                // Check if actualException is a valid non-empty value
                let flag = actualExceptions !== undefined && actualExceptions !== null && actualExceptions !== '';

                // Normalize the expected condition by replacing "@" with a space
                let expectedConditionArray = exceptions.replace("@", " ");
                let actualException = actualExceptions.trim();
                // Check if actualException matches the expected condition
                const isConditionMet = (actualException.includes(expectedConditionArray) && expectedCondition === 'Yes') ||
                    (!actualException.includes(expectedConditionArray) && expectedCondition === 'No');

                // Return "Passed" or "Failed" based on the flag
                if (flag) {
                    return isConditionMet ? "Passed" : "Failed";
                } else {
                    return isConditionMet ? "Passed" : "Failed";
                }
            }
        }
        catch (error) {
            console.log(error);
            return "Failed";
        }

    }

    async isRedOvertimeClock(date: string): Promise<string> {
        let dateArray = date.split(" ");
        const weekday = dateArray[0].trim();
        await this.page.waitForTimeout(3000);
        const redClock = await this.page.getByTitle('' + weekday + ' ' + dateArray[1].trim() + '; Overtime Pending');
        // await redClock.scrollIntoViewIfNeeded();
        const redClockCount = await redClock.count();
        if ((redClockCount > 0))
            return "True";
        else
            return "False";
    }

    async isOTPaycodePresent(): Promise<string> {
        let flag, OTPayCode;
        await this.TIMECARD_TOTAL.click();
        // await this.page.waitForTimeout(500);
        // this.page.locator('//ukg-button[@title="Expand Totals"]').click();
        await this.page.waitForTimeout(3000);
        OTPayCode = this.page.locator("//div[@class='ui-grid-canvas']//div[contains(@title,'OT Unapproved')]");
        const OTPayCodeCount = await OTPayCode.count();
        if (OTPayCodeCount > 0)
            flag = "True";
        else
            flag = "False";

        await this.page.waitForTimeout(3000);
        await this.TIMECARD_TOTAL_CLOSE.click();
        return flag;
    }

    async isGreenOvertimeClock(date: string): Promise<string> {
        let dateArray = date.split(" ");
        const weekday = dateArray[0].trim();
        await this.page.waitForTimeout(3000);
        const greenClock = await this.page.getByTitle('' + weekday + ' ' + dateArray[1].trim() + '; Overtime Reviewed');
        // await greenClock.scrollIntoViewIfNeeded();
        const greenClockCount = await greenClock.count();
        if ((greenClockCount > 0))
            return "True";
        else
            return "False";
    }

    /*
   @Auther: Ramchandra Desai
   @Description: This function works on both the process of approval of ALL worked overtime hours, and approval of PARTIAL overtime worked hours, in this order:
1.	Validating that before overtime approval, the ‘SK-OT Unapproved’ paycode is displayed in timecard totals for the total time of overtime worked, and overtime ‘clock’ is red in colour.
2.	After approval of ALL worked overtime, validating ‘clock’ changes to green in colour and that ‘SK-OT Unapproved’ paycode is removed from timecard totals.
3.	Validating that before overtime approval, the ‘SK-OT Unapproved’ paycode is displayed in timecard totals for the total time of overtime worked, and overtime ‘clock’ is red in colour.
4.	After approval of PARTIAL worked overtime, validating ‘clock’ changes to green in colour and that ‘SK-OT Unapproved’ paycode updates to the amount of overtime that was not approved. 

   @Date: 02/01/2025
 */
    async approveOvertime(date: string, ALLorPARTIAL: string, OvertimeToApprove: string): Promise<string> {//, exceptions: string, expectedCondition: string): Promise<string> {
        let dateArray = date.split(" ");
        const weekday = dateArray[0].trim();
        let dateDigit = dateArray[1].split("/")[0].trim();
        //----------------------------------------------------------------------------------------------------
        const selectListViewForOvertime = this.page.locator("//div[@class='tk-calendar-box']//div[contains(text(),'" + weekday + "')]/following-sibling::div[contains(text(),'" + dateDigit + "')]");
        //--------------------------------------------------------------------------------------------------------

        try {
            await this.page.waitForTimeout(2000);
            const txtListView = this.page.getByLabel('List View');
            const txtTableView = this.page.getByLabel('Table View');
            await this.page.waitForTimeout(2000);
            await txtListView.click();

            await this.page.waitForTimeout(2000);

            let ListViewCounter = await selectListViewForOvertime.count();
            let LoadMoreCounter = await this.btnLoadMore.count();
            if (ListViewCounter > 0) {
                console.log("List view for Overtime is present on screen");
            } else {
                if (LoadMoreCounter > 0) {
                    await this.page.waitForTimeout(500);
                    await this.btnLoadMore.scrollIntoViewIfNeeded();
                    await this.btnLoadMore.click();
                }
            }

            if (ListViewCounter > 0) {
                await this.page.waitForTimeout(3500);
                await selectListViewForOvertime.click();
                // const btnApproveOvertime = this.page.locator('(//div[@id="approveOvertimeAction.popup"]//button[@aria-label="Approve Overtime"])[2]');
                const btnApproveOvertime = this.page.locator('//div[@transclude-id="slideout-content"]//form//button[@aria-label="Approve Overtime"]');
                //---
                await this.page.waitForTimeout(3000);
                await btnApproveOvertime.click();

                if (String(ALLorPARTIAL.toLocaleLowerCase()) == "all") {
                    await this.page.waitForTimeout(2000);
                } else if (String(ALLorPARTIAL.toLocaleLowerCase()) == "partial") {
                    await this.page.waitForTimeout(2000);
                    if (await this.ToOvertimeSpansTwo.count() > 0) {
                        await this.ToOvertimeSpansTwo.focus();
                        await this.ToOvertimeSpansTwo.fill(OvertimeToApprove);
                        await this.page.waitForTimeout(2000);
                    }
                    else if (await this.ToOvertimeSpansOne.count() > 0) {
                        await this.ToOvertimeSpansOne.focus();
                        await this.ToOvertimeSpansOne.fill(OvertimeToApprove);
                        await this.page.waitForTimeout(2000);
                    }
                }
                this.Apply.click({ force: true });
                await this.page.waitForTimeout(3000);
                await this.page.locator('//button[@id="day-details-submit-btn"]').click({ force: true });
                await this.page.waitForTimeout(3000);
                await txtTableView.click();
            }
        }
        catch (error) {
            console.log(error);
            return "Failed";
        }

    }


    async getExceptions(): Promise<string> {
        let exceptionsArray = "";
        let j = 1;
        try {
            const exception = await this.page.locator('//div[@class="tk-exception"]//span[@class="tk-exception-text"]/span[@class="tk-exception-value"]');
            await this.page.waitForTimeout(2000);
            const exceptionsCount = await exception.count();

            for (let i = 0; i < exceptionsCount; i++) {
                const exceptionByIndex = await this.page.locator('(//div[@class="tk-exception"]//span[@class="tk-exception-text"]/span[@class="tk-exception-value"])[' + j + ']');
                await this.page.waitForTimeout(1500);
                const textValue = await exceptionByIndex.textContent();
                exceptionsArray = exceptionsArray + textValue + " ";
                j = j + 1;
            }
            return exceptionsArray;
        } catch (error) {
            console.log("Error -" + error);
            return error;
        }


    }



    /*
    @Auther: Madhukar Kirkan
    @Description: This function is used to fill Punch In-Out by selecting from the listview and returns any error messages.
    @Date: 27/11/2024
  */
    async pucnInPunchOutByDate(date: string, punchIn: string, punchOut: string, punchIn2: string, punchOut2: string): Promise<string> {
        const [weekday, dateArray] = date.split(" ");
        const [dateDigit, month] = dateArray.split("/");

        let resultMsgError = "";
        let errorMsgafterSave = "";
        //----------------------------------------------------------------------------------------------------
        const selectListViewForPucnhInOut = this.page.locator("//div[@class='tk-calendar-box']//div[contains(text(),'" + weekday + "')]/following-sibling::div[contains(text(),'" + dateDigit + "')]");
        //--------------------------------------------------------------------------------------------------------
        try {
            const punchValues = [punchIn, punchOut, punchIn2, punchOut2];
            const isAnyDefined = punchValues.some(value => value !== null && value !== undefined && value !== '');
            await this.page.waitForTimeout(500);
            if (isAnyDefined) {
                await this.page.waitForTimeout(1000);
                if (await selectListViewForPucnhInOut.count() > 0) {
                    console.log("List view for punch In-Out is present on screen");
                } else {
                    if (await this.btnLoadMore.count() > 0) {
                        await this.page.waitForTimeout(500);
                        await this.btnLoadMore.scrollIntoViewIfNeeded();
                        await this.btnLoadMore.click();
                    }
                }
                if (await selectListViewForPucnhInOut.count() > 0) {
                    await selectListViewForPucnhInOut.click();

                    if (weekday.includes('Sat') || weekday.includes('Sun')) {
                        resultMsgError = await this.handleWeekendPunchInOut(punchIn, punchOut);
                        await this.page.waitForTimeout(1000);
                        const errorCheck = await this.page.locator('(//div[@class="multiple-lines-wrap"])[1]');
                        if (await errorCheck.isVisible()) {
                            errorMsgafterSave = "" + errorCheck.allInnerTexts();
                            errorMsgafterSave = errorMsgafterSave + "& find failed screenshot --> " + String(await super.takeScreenShot());
                        }
                        if (errorMsgafterSave !== undefined && errorMsgafterSave !== null && errorMsgafterSave !== '') {
                            new throws(error);
                        } else {
                            return "Passed";
                        }
                    } else {
                        if (punchIn !== '' && punchIn !== undefined && punchIn !== null) {
                            if (await this.txtInPunch.isVisible()) {
                                await this.txtInPunch.fill(punchIn);
                                await this.page.keyboard.press("Tab");
                                await this.page.waitForTimeout(1000);
                            } else {
                                resultMsgError = await this.handleWeekendPunchInOut(punchIn, punchOut);
                            }

                        }
                        if (punchOut !== '' && punchOut !== undefined && punchOut !== null) {
                            if (punchIn !== null && punchIn !== '') {
                                // Split the time string into hours and minutes
                                let [hours, minutes] = punchIn.split(":").map(Number);
                                // Combine hours and minutes into a decimal number (e.g., 9 + 16/60 = 9.2666...)
                                let punchInNumber = hours + minutes / 60;
                                //|| punchInNumber < 8.44
                                if (punchInNumber > 9) {
                                    // await this.page.waitForTimeout(500);
                                    await this.txtOutPunch2.fill(punchOut);
                                    await this.page.keyboard.press("Tab");
                                    //await this.page.waitForTimeout(500);
                                } else {
                                    await this.page.waitForTimeout(1000);
                                    await this.txtOutPunch.fill(punchOut);
                                    await this.page.keyboard.press("Tab");
                                    //await this.page.waitForTimeout(500);
                                }
                            } else {
                                await this.page.waitForTimeout(1000);
                                await this.txtOutPunch.fill(punchOut);
                                await this.page.keyboard.press("Tab");
                                //await this.page.waitForTimeout(500);
                            }
                        }
                        if ((punchIn !== '' && punchIn !== undefined && punchIn !== null) || (punchOut !== '' && punchOut !== undefined && punchOut !== null) && (punchIn2 !== '' && punchIn2 !== undefined && punchIn2 !== null)) {
                            if (punchIn2 !== '' && punchIn2 !== null && punchIn2 !== undefined) {
                                await this.page.waitForTimeout(1500);
                                await this.btnAddPunch.click();
                                await this.page.waitForTimeout(500);
                                resultMsgError = await this.editPunchFillandApply(punchIn2, "In Punch");
                                if (resultMsgError !== null && resultMsgError !== '' && resultMsgError !== undefined) {
                                    new throws(error);
                                }

                                if (punchOut2 !== '' && punchOut2 !== null && punchOut2 !== undefined) {
                                    await this.page.waitForTimeout(1000);
                                    await this.btnAddPunch.click();
                                    await this.page.waitForTimeout(500);
                                    await this.page.waitForTimeout(500);
                                    resultMsgError = await this.editPunchFillandApply(punchOut2, "Out Punch");
                                    if (resultMsgError !== null && resultMsgError !== '' && resultMsgError !== undefined) {
                                        new throws(error);
                                    }
                                }


                            } else if ((punchOut2 !== '' && punchOut2 !== undefined && punchOut2 !== null)) {
                                await this.page.waitForTimeout(1500);
                                await this.btnAddPunch.click();
                                await this.page.waitForTimeout(500);
                                resultMsgError = await this.editPunchFillandApply(punchOut2, "Out Punch");
                                if (resultMsgError !== null && resultMsgError !== '' && resultMsgError !== undefined) {
                                    new throws(error);
                                }
                                if ((punchIn2 !== '' && punchIn2 !== undefined && punchIn2 !== null)) {
                                    await this.page.waitForTimeout(1000);
                                    await this.btnAddPunch.click();
                                    await this.page.waitForTimeout(500);
                                    resultMsgError = await this.editPunchFillandApply(punchIn2, "In Punch");
                                    if (resultMsgError !== null && resultMsgError !== '' && resultMsgError !== undefined) {
                                        new throws(error);
                                    }
                                }

                            }
                        } else if ((punchIn !== '' && punchIn !== undefined && punchIn !== null) || (punchOut !== '' && punchOut !== undefined && punchOut !== null) && (punchOut2 !== '' && punchOut2 !== undefined && punchOut2 !== null)) {
                            if (punchOut2 !== '' && punchOut2 !== undefined && punchOut2 !== null) {
                                await this.page.waitForTimeout(1500);
                                await this.btnAddPunch.click();
                                await this.page.waitForTimeout(500);
                                resultMsgError = await this.editPunchFillandApply(punchOut2, "Out Punch");
                                if (resultMsgError !== null && resultMsgError !== '' && resultMsgError !== undefined) {
                                    new throws(error);
                                }
                                await this.page.waitForTimeout(1500);
                                await this.btnAddPunch.click();
                                await this.page.waitForTimeout(500);
                                resultMsgError = await this.editPunchFillandApply(punchIn2, "In Punch");
                                if (resultMsgError !== null && resultMsgError !== '' && resultMsgError !== undefined) {
                                    new throws(error);
                                }

                            }
                        }
                        if ((punchIn === '' || punchIn === null) && (punchOut === '' || punchOut === null)) {

                            if (punchIn2 !== '' && punchIn2 !== undefined && punchIn2 !== null) {
                                // await this.page.waitForTimeout(500);
                                await this.txtInPunch.fill(punchIn2);
                                await this.page.keyboard.press("Tab");
                            }
                            if (punchOut2 !== '' && punchOut2 !== undefined && punchOut2 !== null) {
                                if (punchIn !== null && punchIn !== '') {
                                    // Split the time string into hours and minutes
                                    let [hours, minutes] = punchIn.split(":").map(Number);
                                    // Combine hours and minutes into a decimal number (e.g., 9 + 16/60 = 9.2666...)
                                    let punchInNumber = hours + minutes / 60;
                                    if (punchInNumber > 9 || punchInNumber > 14) {
                                        // await this.page.waitForTimeout(500);
                                        await this.txtOutPunch21.fill(punchOut2);
                                        await this.page.keyboard.press("Tab");
                                        //await this.page.waitForTimeout(500);
                                    } else {
                                        // await this.page.waitForTimeout(500);
                                        await this.txtOutPunch.fill(punchOut2);
                                        await this.page.keyboard.press("Tab");
                                        // await this.page.waitForTimeout(500);
                                    }
                                } else {
                                    // await this.page.waitForTimeout(500);
                                    await this.txtOutPunch2.fill(punchOut2);
                                    await this.page.keyboard.press("Tab");
                                    //await this.page.waitForTimeout(500);
                                }
                            }
                        }
                        await this.page.waitForTimeout(500);
                        await this.btnSave.click();
                        await this.page.waitForTimeout(500);
                        const errorCheck = await this.page.locator('(//div[@class="multiple-lines-wrap"])[1]');
                        if (await errorCheck.isVisible()) {
                            errorMsgafterSave = "" + errorCheck.allInnerTexts();
                            errorMsgafterSave = errorMsgafterSave + "& find failed screenshot --> " + String(await super.takeScreenShot());
                        }
                        if (errorMsgafterSave !== undefined && errorMsgafterSave !== null && errorMsgafterSave !== '') {
                            new throws(error);
                        } else {
                            return "Passed";
                        }
                    }
                } else {
                    return resultMsgError = "Failed : " + resultMsgError + " No valid entries or test data issue.";
                }
            }
        } catch (error) {
            console.log(error);
            const btncancel = await this.page.locator('(//div[@class="text-right"]//button[text()="Cancel"])[1]');
            const btnYes = await this.page.locator('//button[@aria-label="Yes"]');
            await this.page.waitForTimeout(500);
            if (await btncancel.isVisible()) {
                await btncancel.click();
                await this.page.waitForTimeout(500);
                if (await btnYes.isVisible()) {
                    //await this.page.waitForTimeout(500);
                    await btnYes.click();
                } else {
                    if (await btncancel.isVisible()) {
                        await btncancel.click();
                        await this.page.waitForTimeout(500);
                        await btnYes.click();
                    }
                }
            }
            if (resultMsgError !== undefined && resultMsgError !== null && resultMsgError !== '') {
                return "Failed : " + resultMsgError;
            } else if (errorMsgafterSave !== undefined && errorMsgafterSave !== null && errorMsgafterSave !== '') {
                return "Failed : " + errorMsgafterSave;
            }

        }
    }

    async handleWeekendPunchInOut(punchIn: string, punchOut: string): Promise<string> {
        let resultMsgError;
        if (punchIn !== null && punchIn !== '' && punchIn !== undefined) {
            await this.page.waitForTimeout(1500);
            await this.btnAddPunch.click();
            await this.page.waitForTimeout(1000);
            resultMsgError = await this.editPunchFillandApply(punchIn, "In Punch");
            if (resultMsgError !== null && resultMsgError !== '' && resultMsgError !== undefined) {
                new throws(error);
            }
            await this.txtOutPunch.fill(punchOut);
            await this.page.keyboard.press("Tab");
        } else if (punchOut !== '' && punchOut !== undefined && punchOut !== null) {
            await this.page.waitForTimeout(1500);
            await this.btnAddPunch.click();
            await this.page.waitForTimeout(1000);
            resultMsgError = await this.editPunchFillandApply(punchOut, "Out Punch");
            if (resultMsgError !== null && resultMsgError !== '' && resultMsgError !== undefined) {
                new throws(error);
            }
            await this.txtInPunch.fill(punchIn);
            await this.page.keyboard.press("Tab");
        }
        return resultMsgError;
    }

    async handleWeekdayPunchInOut(punchIn: string, punchOut: string) {
        if (punchIn) {
            await this.page.waitForTimeout(1000);
            if (await this.txtInPunch.isVisible()) {
                await this.txtInPunch.fill(punchIn);
                await this.page.keyboard.press("Tab");
                await this.page.waitForTimeout(1000);
            } else {
                await this.handleWeekendPunchInOut(punchIn, punchOut)
            }

        }
        if (punchOut) {
            if (punchIn) {
                const [hours, minutes] = punchIn.split(":").map(Number);
                const punchInNumber = hours + minutes / 60;
                if (punchInNumber > 9) {
                    await this.txtOutPunch2.fill(punchOut);
                    await this.page.keyboard.press("Tab");
                } else {
                    await this.txtOutPunch.fill(punchOut);
                    await this.page.keyboard.press("Tab");
                }
            } else {
                await this.txtOutPunch.fill(punchOut);
                await this.page.keyboard.press("Tab");
            }
        }
    }

    async handleAdditionalPunches(punchIn2: string, punchOut2: string) {
        if (punchIn2) {
            await this.page.waitForTimeout(1500);
            await this.btnAddPunch.click();
            await this.page.waitForTimeout(500);
            let resultMsgError = await this.editPunchFillandApply(punchIn2, "In Punch");
            if (resultMsgError) throw new Error(resultMsgError);
        }
        if (punchOut2) {
            await this.page.waitForTimeout(1000);
            await this.btnAddPunch.click();
            await this.page.waitForTimeout(500);
            let resultMsgError = await this.editPunchFillandApply(punchOut2, "Out Punch");
            if (resultMsgError) throw new Error(resultMsgError);
        }
    }

    async punchInOutMultipleDays(date: string, punchIn: any, punchOut: any, punchIn2: any, punchOut2: any): Promise<string> {

        try {

            const gridContainer = this.page.locator('.ui-grid-viewport .ui-grid-canvas');

            // Get all rows in the grid
            const rows = gridContainer.locator('.ui-grid-row');
            const rowCount = await rows.count();
            console.log(`Total rows: ${rowCount}`);

            let punchSuccess = false;

            for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
                const row = rows.nth(rowIndex);

                // Locate the cell in the current row containing the date
                const cell = row.locator('.ui-grid-cell .ui-grid-cell-contents[title*="' + date + '"]');

                if (await cell.count() > 0) {
                    console.log(`Date ${date} found in Row ${rowIndex + 1}`);

                    // If punchIn2 is empty, pass false for the "isFirstPunch" argument
                    const isSecPunchIn = punchIn2 && punchIn2.trim() !== '' ? true : false;

                    // If punchOut2 is empty, pass false for the "isFirstPunch" argument
                    const isSecPunchOut = punchOut2 && punchOut2.trim() !== '' ? true : false;

                    if (isSecPunchIn) {
                        // Punch in/out for the first punch (rowIndex)
                        await this.punchTime(rowIndex, punchIn, punchOut, isSecPunchIn);
                    } else if (isSecPunchOut) {
                        // Punch in/out for the first punch (rowIndex)
                        await this.punchTime(rowIndex, punchIn, punchOut, isSecPunchOut);
                    } else {
                        // Punch in/out for the first punch (rowIndex)
                        await this.punchTime(rowIndex, punchIn, punchOut, false);
                    }


                    // Skip the second punch if punchIn2 is empty or blank
                    if (punchIn2 && punchIn2.trim() !== '') {
                        await this.punchTime(rowIndex + 1, punchIn2, punchOut2, false);
                    } else if (punchOut2 != null && punchOut2.trim() !== '') {
                        await this.punchTime(rowIndex + 1, punchIn2, punchOut2, false);
                    } else {
                        console.log(`Skipping punchIn2 for Row ${rowIndex + 2} due to empty punchIn2 value`);
                    }
                    punchSuccess = true;

                    break;
                }
            }
            // Return success if the punch was performed, else return failure
            if (punchSuccess) {
                console.log("Punch operation completed successfully.");
                return "Passed";
            } else {
                console.error(`No row found for the date ${date}.`);
                return "Failed";
            }

        } catch (error) {
            console.error(`Error during punch operation: ${error.message}`);
            return "Failed";
        }
    }


    // async selectPreviousPayPeriod() {
    //     await this.page.getByTitle('Select Timeframe').click();
    //     await this.page.getByText('Previous Pay Period').click();
    //     await this.page.waitForTimeout(1500);
    //     const txtListView = this.page.getByLabel('List View');
    //     const btnLoadMore = this.page.getByRole('button', { name: 'Load More' });
    //     await txtListView.click();
    //     await btnLoadMore.click();
    // }
    // async punchTime(index: number, inpunch: string, outpunch: string, addTime?: boolean): Promise<void> {
    //     // Format the index for locators based on the value of index
    //     const formattedIndex = index >= 10 ? `\\3${Math.floor(index / 10)} ${index % 10}` : `\\3${index}`;

    //     // Create locators with the properly formatted index
    //     const inpunchLocator = this.page.locator(`[id="${formattedIndex}_inpunch"]`);
    //     const outpunchLocator = this.page.locator(`[id="${formattedIndex}_outpunch"]`);
    //     const addButtonLocator = this.page.locator(`[id="${formattedIndex}_add"] span`);

    //     // Perform the punch-in and punch-out actions
    //     await inpunchLocator.click();
    //     await this.page.getByRole('textbox').fill(inpunch.toString());
    //     await outpunchLocator.click();
    //     await this.page.getByRole('textbox').fill(outpunch.toString());

    //     // Handle the "add time" condition
    //     if (addTime) {
    //         await addButtonLocator.click();
    //     } else {
    //         // Increment the index and format it again
    //         index = index + 1;
    //         const formattedNextIndex = index >= 10 ? `\\3${Math.floor(index / 10)} ${index % 10}` : `\\3${index}`;
    //         await this.page.locator(`[id="${formattedNextIndex}_inpunch"]`).dblclick();
    //         await this.page.waitForTimeout(3000);
    //     }
    // }

    async ValidateTotal(Paycode: string, Totalvalue: string): Promise<string> {
        await this.TIMECARD_TOTAL.click();
        await this.page.waitForTimeout(3000);
        // Locate the grid container
        const gridContainer = await this.page.locator('.ui-grid-viewport .ui-grid-canvas');
        // Get all rows at once
        const rows = gridContainer.locator('.ui-grid-row');
        const rowCount = await rows.count();
        console.log(`Total rows: ${rowCount}`);

        let isValidRowFound = false;
        // Process all rows
        const rowPromises = Array.from({ length: rowCount }, (_, rowIndex) => {
            const row = rows.nth(rowIndex);
            const cells = row.locator('.ui-grid-cell');

            return cells.evaluateAll((cellElements) => {
                return cellElements.map(cell => ({
                    content: cell.textContent?.trim() || '',
                    title: cell.querySelector('.ui-grid-cell-contents')?.getAttribute('title') || '',
                    ariaSelected: cell.getAttribute('aria-selected')
                }));
            }).then(cellData => {
                // Flags for the required values
                let hasRegular = false;
                let hasTime = false;

                cellData.forEach((cell) => {
                    if (cell.title === Paycode) {
                        hasRegular = true;
                    }
                    if (cell.title === Totalvalue) {
                        hasTime = true;
                    }
                    if (cell.ariaSelected === 'true') {
                        console.log(`Cell in Row ${rowIndex + 1} is selected.`);
                    }
                });

                // Check if all required values are present in the same row
                if (hasRegular && hasTime) {
                    isValidRowFound = true;
                    console.log(`Valid row found: Row ${rowIndex + 1}`);
                }
            });
        });

        // Wait for all row processing to complete
        await Promise.all(rowPromises);

        // Return based on whether a valid row was found
        if (isValidRowFound) {
            //await expect(this.page.getByRole('button', { name: 'Amount' })).toBeVisible();
            return "Passed";
        } else {
            console.error("No row found with all required values.");
            return "Failed"; // Or throw an error, or handle as needed
        }
    }



    async saveTimesheet(): Promise<void> {
        // Click the save button
        await this.TIMECARD_SAVE.click();

        // Wait for a short duration to ensure the save action has completed
        await this.page.waitForTimeout(2000); // Adjust the timeout based on your app's response time

        // Check if the save button is disabled after the save action
        const isDisabled = await this.TIMECARD_SAVE.isDisabled();

        // If the button is not disabled, throw an error indicating the save was unsuccessful
        if (!isDisabled) {
            throw new Error("Save unsuccessful. There might be errors preventing the save.");
        }

        console.log("Save successful. Button is disabled.");
    }

    async ValidateTotal2(Paycode: string, Totalvalue: string, Exp: string): Promise<string> {
        // Click on the TIME CARD TOTAL element
        await this.TIMECARD_TOTAL.click();
        await this.page.waitForTimeout(3000);

        // Locate the grid container
        const gridContainer = this.page.locator('.ui-grid-viewport .ui-grid-canvas');

        // Get all rows at once
        const rows = gridContainer.locator('.ui-grid-row');
        const rowCount = await rows.count();
        console.log(`Total rows: ${rowCount}`);

        let isValidRowFound = false;

        // Process all rows
        for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
            const row = rows.nth(rowIndex);
            const cells = row.locator('.ui-grid-cell');

            // Extract text content for all cells in the current row
            const cellTexts = await cells.evaluateAll((cellElements) => {
                return cellElements.map(cell => cell.textContent?.trim() || '');
            });

            // Flags for the required values
            let hasPaycode = false;
            let hasTotalvalue = false;


            // Process each cell's text content for the current row

            cellTexts.forEach((cellText) => {
                console.log(cellText);
                if (cellText === Paycode) {
                    hasPaycode = true;
                }
                if (cellText === Totalvalue) {
                    hasTotalvalue = true;
                }
            });

            // Validate if the row meets all criteria
            if (hasPaycode && hasTotalvalue && Exp === 'Yes') {
                isValidRowFound = true;
                console.log(`Valid row found at index ${rowIndex + 1}`);
                return 'Passed';
            }
            // Validate if the row meets all criteria 
            if (hasPaycode && hasTotalvalue && Exp === 'No') {
                isValidRowFound = true;
                console.log("Valid row found at index ${rowIndex + 1}");
                return 'Failed';

            }

        }

        if (!isValidRowFound) {
            console.log('No valid row found.');
            return 'Validation Failed' + 'No valid row found';
        }
    }
    //16-1-25
    async ValidateSignOFF(): Promise<string> {
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
