import { Page, BrowserContext, Locator, expect } from '@playwright/test';

export class WFMTimecardPage {
    readonly page: Page;
    readonly context: BrowserContext;
    readonly EMP_REQUEST: Locator;
    readonly EMP_SEARCHBAR: Locator;
    readonly EMP_LIST: Locator;
    readonly EMP_Select: Locator;
    readonly EMP_Selected: Locator;
    readonly EMP_NAME: Locator;
    readonly TIMECARD_SAVE: Locator;
    readonly TIMECARD_TOTAL: Locator
    ariaLabel: string;

    

    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;
        this.EMP_REQUEST = page.getByRole('button', { name: 'Employee Requests' })
        this.EMP_SEARCHBAR = page.getByRole('textbox', { name: 'Search' });
        this.EMP_LIST = page.locator('//li[@id="combo_li0"]');
        this.EMP_Select = page.getByRole('button', { name: 'Select people' });
        this.EMP_Selected = page.getByRole('menu', { name: 'Select people' }).locator('label');
        this.EMP_NAME = page.locator('[personnumber="80010054"]');
        this.TIMECARD_SAVE = page.getByLabel('Save');
        this.TIMECARD_TOTAL = page.getByRole('tab', { name: 'Totals' });
    }

    async SearchEMP_Timecard(EmpName: string): Promise<void> {
        //await this.EMP_SELECTORDROPDOWN.click();
        await this.EMP_SEARCHBAR.click();
        await this.EMP_SEARCHBAR.fill(EmpName);
        await this.EMP_LIST.click();

    }
    async punchTime(index: number, inpunch: string, outpunch: string, addTime?: boolean): Promise<void> {
        const inpunchLocator = this.page.locator(`[id="\\3${index} _inpunch"]`);
        const outpunchLocator = this.page.locator(`[id="\\3${index} _outpunch"]`);
        const addButtonLocator = this.page.locator(`[id="\\3${index} _add"] span`);

        await inpunchLocator.click();
        await this.page.getByRole('textbox').fill(inpunch);
        await outpunchLocator.click();
        await this.page.getByRole('textbox').fill(outpunch);
        
        if (addTime) {
            await addButtonLocator.click();
        }
        else
        {
            index = index+1;
            await this.page.locator(`[id="\\3${index} _inpunch"]`).dblclick();
            await this.page.waitForTimeout(3000);

        }
    }

    async punchInOutMultipleDays(): Promise<void> {
        await this.punchTime(1, '09:00', '13:00', true);
        await this.punchTime(2, '13:30', '17:00',false);
 
        await this.punchTime(2, '09:00', '13:00', true);
        await this.punchTime(3, '13:30', '17:00',false);
        // await this.page.keyboard.press("Tab");
        // await this.page.waitForTimeout(3000);
        await this.punchTime(3, '09:00', '13:00', true);
        await this.punchTime(4, '13:30', '17:00',false);
    }

    async ValidateTotal(): Promise<void>{

        await this.TIMECARD_TOTAL.click();
        await expect(this.page.getByRole('button', { name: 'Amount' })).toBeVisible();
//await expect(this.page.locator('[id="\\31 720176347840-0-uiGrid-00M5-cell"]')).toContainText('8:30');

        
    }
}


