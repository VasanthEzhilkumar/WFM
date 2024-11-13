import { Page, BrowserContext, Locator, expect } from '@playwright/test';

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
                    // Try clicking the locator
                    await clickLocator.click();
                    
                    // Wait for the textbox to appear and fill the value
                    await this.page.getByRole('textbox').fill(inputText.toString());
                    
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
                    await this.page.waitForTimeout(500);
                }
            }
        }
    
        // Perform the punch-in and punch-out actions with retry logic
        await retryClickAndFill.call(this, inpunchLocator, inpunch); // Apply retry logic for inpunch
        await retryClickAndFill.call(this, outpunchLocator, outpunch); // Apply retry logic for outpunch
    
        // Handle the "add time" condition
        if (addTime) {
            await addButtonLocator.click();
            await this.page.waitForTimeout(1000);
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
                    const isFirstPunch = punchIn2 && punchIn2.trim() !== '' ? true : false;

                    // Punch in/out for the first punch (rowIndex)
                    await this.punchTime(rowIndex, punchIn, punchOut, isFirstPunch);

                    // Skip the second punch if punchIn2 is empty or blank
                    if (punchIn2 && punchIn2.trim() !== '') {

                        await this.punchTime(rowIndex + 1, punchIn2, punchOut2, false);
                    } else {
                        console.log(`Skipping punchIn2 for Row ${rowIndex + 2} due to empty punchIn2 value`);
                    }

                    punchSuccess = true;
                    break;


                }
            }
            // Return success if the punch was performed, else return failure
            // if (punchSuccess) {
            //     console.log("Punch operation completed successfully.");
            //     return "Passed";
            // } else {
            //     console.error(`No row found for the date ${date}.`);
            //     return "Failed";
            // }
        } catch (error) {
            console.error(`Error during punch operation: ${error.message}`);
            return "Failed";
        }
    }


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


}





