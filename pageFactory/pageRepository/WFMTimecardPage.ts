import { Page, BrowserContext, Locator, expect } from '@playwright/test';
import { exit } from 'process';

export class WFMTimecardPage {
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




    constructor(page: Page, context: BrowserContext) {
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
            if (hasPaycode && hasTotalvalue &&Exp==='Yes') {
                isValidRowFound = true;
                console.log(`Valid row found at index ${rowIndex + 1}`);
                return 'Passed';
            }
            // Validate if the row meets all criteria 
            if (hasPaycode && hasTotalvalue &&Exp==='No') {
                isValidRowFound = true;
                console.log("Valid row found at index ${rowIndex + 1}");
                return 'Failed';
                
            }
             
        }
     
        if (!isValidRowFound) {
            console.log('No valid row found.');
            return 'Validation Failed' +'No valid row found';
        }
    }
}
