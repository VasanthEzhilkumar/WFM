import { Page, BrowserContext, Locator } from '@playwright/test';

// Define the interface for rule violations
interface RuleViolation {
    date: string;
    name: string;
    severity: string;
    employeeOrg: string;
    ruleType: string;
    description: string;    
}

export class WFMSchedulePlannerPage {
    readonly page: Page;
    readonly context: BrowserContext;
    readonly RULEVIOLATIONTAB: Locator;
    readonly EMP_SEARCHBAR: Locator;
    readonly EMP_RELOAD: Locator;
    readonly EMP_Select: Locator;
    readonly EMP_Selected: Locator;
    employeeNumbers: string[];


    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;
        this.RULEVIOLATIONTAB = page.getByRole('tab', { name: 'Rule Violation' });
        this.EMP_SEARCHBAR = page.getByRole('textbox', { name: 'Search' });
        this.EMP_RELOAD = page.getByRole('button', { name: ' Reload' });
        this.EMP_Select = page.getByRole('button', { name: 'Select people' });
        this.EMP_Selected = page.getByRole('menu', { name: 'Select people' }).locator('label');

    }

    // async clickonRuleViolationTab(empNumber: string): Promise<string> {
    //     const EMP_NAME = this.page.locator(`[personnumber="${empNumber}"]`);
    //     const ariaLabel = await EMP_NAME.getAttribute('aria-label');

    //     console.log(`Employee Name for ${empNumber}: ${ariaLabel}`);

    //     if (ariaLabel) {
    //         await EMP_NAME.click({ button: "right" });
    //         await this.RULEVIOLATIONTAB.click();
    //     } else {
    //         console.error(`No element found with personnumber: ${empNumber}`);
    //     }
    //     return ariaLabel.toString();
    // }

    async clickonRuleViolationTab(empNumber: string): Promise<string | null> {
        const ariaLabel = await this.getEmployeeName(empNumber);

        if (ariaLabel) {
            const EMP_NAME = this.page.locator(`[personnumber="${empNumber}"]`);
            console.log(`Employee Name for ${empNumber}: ${ariaLabel}`);
            await EMP_NAME.click({ button: "right" });
            await this.RULEVIOLATIONTAB.click();
        } else {
            console.error(`No element found with personnumber: ${empNumber}`);
        }

        return ariaLabel;
    }

    async getEmployeeName(empNumber: string): Promise<string | null> {
        const EMP_NAME = this.page.locator(`[personnumber="${empNumber}"]`);
        const ariaLabel = await EMP_NAME.getAttribute('aria-label');

        if (!ariaLabel) {
            console.error(`No element found with personnumber: ${empNumber}`);
            return null;
        }

        return ariaLabel.toString();
    }

    async SearchEmpRuleViolation(ariaLabel: string, Rule: string, date: string, exp: string, exp_severity: string): Promise<string> {

        await this.EMP_Select.click();
        await this.EMP_SEARCHBAR.fill(ariaLabel);
        await this.page.waitForTimeout(3000);
        // await this.EMP_Selected.click();
        // Updated by Ramchandra because locator was resolving to 2 employees
        await this.page.locator('//div[@role="menuitem"]//span[text()="'+ariaLabel+'"]').click();
        
        await this.EMP_RELOAD.click();
        await this.page.waitForTimeout(3000);

        const cssSelector = 'div.ui-grid-contents-wrapper > div:nth-child(3) div.ui-grid-viewport > div > div';
        const rows = await this.page.locator(cssSelector).all();

        const ruleViolations: RuleViolation[] = [];

        for (let i = 0; i < rows.length; i++) {
            const rowDate = await rows[i].locator('div:nth-child(1)').first().textContent();
            const name = await rows[i].locator('div:nth-child(2)').textContent();
            const severity = await rows[i].locator('div:nth-child(3)').textContent();
            const employeeOrg = await rows[i].locator('div:nth-child(4)').textContent();
            const ruleType = await rows[i].locator('div:nth-child(5)').textContent();
            const description = await rows[i].locator('div:nth-child(6)').textContent();
            // Sanitize the string by trimming leading/trailing spaces
            const sanitizedRowDate = rowDate.trim();

            // Log the sanitized row date to debug
            console.log(`Sanitized Row Date: "${sanitizedRowDate}"`);

            // Updated regular expression to match the date (in the format MM/DD/YYYY)
            const dateMatch = sanitizedRowDate.match(/(\d{1,2}\/\d{1,2}\/\d{4})/);

            // Extracted date or an empty string if no match is found
            const trimmedDate = dateMatch ? dateMatch[0] : '';

            console.log(trimmedDate); // Output: 8/22/2024
            const trimmedRuleType = ruleType?.trim() || '';
            const trimmedDescription = description?.trim() || '';
            // Validation: Check if the current row matches the provided date and Rule
            // if (trimmedDate === date && trimmedRuleType.toLowerCase().includes(Rule.toLowerCase().trim())) {
            //     return 'Passed';
            // }

            const cleanedRule = Rule.replace(/[\s,.]+/g, '').toLowerCase();
            const cleanedDescription = trimmedDescription.replace(/[\s,.]+/g, '').toLowerCase();

            //     if (trimmedDate === date && cleanedRule.includes(cleanedDescription)) {
            //         return 'Passed';
            //     } 

            // }

            // return "Failed"

            // if (trimmedDate === date && cleanedRule.includes(cleanedDescription)) {
            if (cleanedDescription.includes(cleanedRule) && severity.includes(exp_severity)) {
                // if (exp === 'Yes') {
                //     return 'Passed';
                // }
                // If no row matches and `exp` is "No", return "Passed"; otherwise, "Failed"
                return exp === 'Yes' ? 'Passed' : 'Failed';
            }
            }
            // If the first condition fails, check the value of exp
            if (exp === 'No') {
                return 'Passed';
            } else {
                return 'Failed';
            }
            // If no row matches and `exp` is "No", return "Passed"; otherwise, "Failed"
            return exp === 'No' ? 'Passed' : 'Failed';


        // }
    }


    async SearchEmpRuleViolation1(ariaLabel: string, Rule: string, date: string): Promise<string> {




        await this.EMP_Select.click();
        await this.EMP_SEARCHBAR.fill(ariaLabel);
        await this.page.waitForTimeout(3000);
        await this.EMP_Selected.click();
        await this.EMP_RELOAD.click();
        await this.page.waitForTimeout(3000);

        const cssSelector = 'div.ui-grid-contents-wrapper > div:nth-child(3) div.ui-grid-viewport > div > div';
        const rows = await this.page.locator(cssSelector).all();

        const ruleViolations: RuleViolation[] = [];

        for (let i = 0; i < rows.length; i++) {
            const rowDate = await rows[i].locator('div:nth-child(1)').first().textContent();
            const name = await rows[i].locator('div:nth-child(2)').textContent();
            const severity = await rows[i].locator('div:nth-child(3)').textContent();
            const employeeOrg = await rows[i].locator('div:nth-child(4)').textContent();
            const ruleType = await rows[i].locator('div:nth-child(5)').textContent();
            const description = await rows[i].locator('div:nth-child(6)').textContent();
            // Sanitize the string by trimming leading/trailing spaces
            const sanitizedRowDate = rowDate.trim();

            // Log the sanitized row date to debug
            console.log(`Sanitized Row Date: "${sanitizedRowDate}"`);

            // Updated regular expression to match the date (in the format MM/DD/YYYY)
            const dateMatch = sanitizedRowDate.match(/(\d{1,2}\/\d{1,2}\/\d{4})/);

            // Extracted date or an empty string if no match is found
            const trimmedDate = dateMatch ? dateMatch[0] : '';

            console.log(trimmedDate); // Output: 8/22/2024
            const trimmedRuleType = ruleType?.trim() || '';
            const trimmedDescription = description?.trim() || '';
            // Validation: Check if the current row matches the provided date and Rule
            // if (trimmedDate === date && trimmedRuleType.toLowerCase().includes(Rule.toLowerCase().trim())) {
            //     return 'Passed';
            // }

            const cleanedRule = Rule.replace(/[\s,.]+/g, '').toLowerCase();
            const cleanedDescription = trimmedDescription.replace(/[\s,.]+/g, '').toLowerCase();

            // if (trimmedDate === date && cleanedRule.includes(cleanedDescription)) {
            if (cleanedDescription.includes(cleanedRule)) {
                return 'Passed';
            }

        }

        return "Failed"


    }





    async SearchEmpRution(ariaLabel: string, Rule: string, date: string): Promise<string> {
        await this.EMP_Select.click();
        await this.EMP_SEARCHBAR.fill(ariaLabel);
        await this.page.waitForTimeout(3000);
        await this.EMP_Selected.click();
        await this.EMP_RELOAD.click();
        await this.page.waitForTimeout(3000);
    
        const cssSelector = 'div.ui-grid-contents-wrapper > div:nth-child(3) div.ui-grid-viewport > div > div';
        const rows = await this.page.locator(cssSelector).all();
    
        for (let i = 0; i < rows.length; i++) {
            const rowDate = await rows[i].locator('div:nth-child(1)').first().textContent();
            const name = await rows[i].locator('div:nth-child(2)').textContent();
            const severity = await rows[i].locator('div:nth-child(3)').textContent();
            const employeeOrg = await rows[i].locator('div:nth-child(4)').textContent();
            const ruleType = await rows[i].locator('div:nth-child(5)').textContent();
            const description = await rows[i].locator('div:nth-child(6)').textContent();
            
            // Sanitize the string by trimming leading/trailing spaces
            const sanitizedRowDate = rowDate.trim();
            console.log(`Sanitized Row Date: "${sanitizedRowDate}"`);
    
            // Updated regular expression to match the date (in the format MM/DD/YYYY)
            const dateMatch = sanitizedRowDate.match(/(\d{1,2}\/\d{1,2}\/\d{4})/);
            const trimmedDate = dateMatch ? dateMatch[0] : '';
    
            const trimmedRuleType = ruleType?.trim() || '';
    
            // Check if the current row matches the provided date and Rule
            if (trimmedDate === date && trimmedRuleType.toLowerCase().includes(Rule.toLowerCase().trim())) {
                return 'Passed'; // If match found, return 'Passed'
            }
        }
    
        // If no match was found after checking all rows, return 'Failed'
        return 'Failed';
    }
    

}

