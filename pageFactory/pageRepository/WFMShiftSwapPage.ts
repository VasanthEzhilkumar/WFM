import { expect, Locator, Page, BrowserContext } from '@playwright/test';

export class WFMShiftSwapPage {
    readonly page: Page;
    readonly context: BrowserContext;
    readonly btnShiftSwap: Locator;
    readonly availableShifts: Locator;
    readonly empSearchBox: Locator;
    readonly swapRequestSubmit: Locator;
    readonly swapSummaryOk: Locator;
    shiftToSwap: Locator;
    searchEmpResult: Locator;
    shiftToSwapOption: Locator;
    readonly openMenu: Locator;
    readonly SignOut: Locator;
    readonly btnAllNotifications: Locator;
    readonly btnShiftSwapNotifications: Locator;
    readonly btnAccept: Locator;
    readonly btnApprove: Locator;

    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;
        this.btnShiftSwap = this.page.locator('#swapMyShiftRequestButton');
        this.availableShifts = this.page.frameLocator('//iframe[@id="angularIframeSlider"]').locator('//div[@id="swapshift-multi-select-employee-selected-item"]');
        this.empSearchBox = this.page.frameLocator('//iframe[@id="angularIframeSlider"]').locator('//input[@placeholder="Search" and @type="text"]');
        this.swapRequestSubmit = this.page.frameLocator('//iframe[@id="angularIframeSlider"]').locator('//button[@id="swap-shift-requested-submit"]');
        this.swapSummaryOk = this.page.frameLocator('//iframe[@id="angularIframeSlider"]').locator('//button[@id="swap-summary-ok"]');
        this.openMenu = this.page.locator('button[automation-id="openMenuHeaderButton"]');
        this.SignOut = this.page.getByLabel('Sign Out');
        this.btnAllNotifications = this.page.locator('#viewAllNotificationsLink-239');
        this.btnAccept = this.page.getByLabel('Accept');
        this.btnShiftSwapNotifications = this.page.getByText('Shift Swap');
        this.btnApprove = this.page.getByLabel('Approve', { exact: true });
    
    }

    async requestShiftSwap(shift: string, EmpName:string): Promise<void> {
        let dateArray = shift.split(" ");
        const weekday = dateArray[1].trim();
        let dateDigit = dateArray[0].trim();
        this.shiftToSwap = this.page.frameLocator('//iframe[@id="angularIframeSlider"]').locator('//div[@class="header-slat-group__values"]//span[contains(text(),"'+dateDigit+'")]/parent::div/following-sibling::div//span[contains(text(),"'+weekday+'")]//ancestor::div[contains(@id,"krn-slat")]/following-sibling::div[1]');
        await this.shiftToSwap.click({force:true});
        await this.availableShifts.click();
        await this.empSearchBox.fill(String(EmpName));
        await this.page.waitForTimeout(3000);
        this.searchEmpResult = this.page.frameLocator('//iframe[@id="angularIframeSlider"]').locator('//div[@class="acol"]//span[text()="'+EmpName+'"]');
        await this.searchEmpResult.click();
        this.shiftToSwapOption = this.page.frameLocator('//iframe[@id="angularIframeSlider"]').locator('(//div[@class="employee-info"]/strong[text()="'+EmpName+'"])[1]');
        await this.shiftToSwapOption.click();
        await this.swapRequestSubmit.click();
        await this.swapSummaryOk.click();
        await this.page.waitForTimeout(2000);
        console.log("Shift Swap Request Submitted by First Employee");

    }

    async clickBtnShiftSwap(): Promise<void> {
        await this.btnShiftSwap.click();
    }

    async logOff(): Promise<void> {
        await this.openMenu.click();
        await this.SignOut.click();
        console.log("First Employee Signed Out");

    }

    async clickBtnAllNotification(): Promise<void> {
        await this.btnAllNotifications.click();
    }

    async acceptShiftSwap(EmpName: string, date:string): Promise<void> {
        this.shiftToSwap = this.page.locator('(//div[@transclude-id="tabular"]//span[@title="GL-Shift Swap"]//ancestor::li[@class="card__data"][1]/following-sibling::li//span[text()="'+EmpName+'"]//ancestor::li[@class="card__data"]/following-sibling::li//span[contains(text(),"'+date+'")])[1]');
        await this.shiftToSwap.click();
        this.btnAccept.click();
        await this.page.waitForTimeout(2000);
        console.log("Shift Swap Request accepted by Second Employee");

    }

    async clickBtnShiftSwapNotification(): Promise<void> {
        await this.btnShiftSwapNotifications.scrollIntoViewIfNeeded();
        await this.btnShiftSwapNotifications.click();
    }

    async approveShiftSwap(EmpName: string, date:string): Promise<string> {
        this.shiftToSwap = this.page.locator('(//div[@transclude-id="tabular"]//span[@title="GL-Shift Swap"]//ancestor::li[@class="card__data"][1]/following-sibling::li//span[text()="'+EmpName+'"]//ancestor::li[@class="card__data"]/following-sibling::li//span[contains(text(),"'+date+'")])[1]');
        await this.shiftToSwap.click();
        this.btnApprove.click();
        await this.page.waitForTimeout(2000);
        console.log("Shift Swap Request approved by Manager");
        return "Passed"
    }

 
}