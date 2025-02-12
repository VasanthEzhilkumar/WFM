import fs from 'fs';
import * as CryptoJS from 'crypto-js';
import type { Page } from '@playwright/test';
import { BrowserContext, expect } from '@playwright/test';
import { Workbook } from 'exceljs';
import { testConfig } from '../testConfig';
import * as pdfjslib from 'pdfjs-dist-es5';
import { describe } from 'node:test';
import { exec } from 'child_process';
import { Locator } from 'playwright';

export class WebActions {

    readonly page: Page;
    readonly context: BrowserContext;

    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;
    }

    async decipherPassword(): Promise<string> {
        const key = `SECRET`;
        //ENCRYPT
        //  const cipher = CryptoJS.AES.encrypt('WFMManagerPassword@05!',key);
        //  console.log(cipher.toString());
        return CryptoJS.AES.decrypt(testConfig.WFMPassword, key).toString(CryptoJS.enc.Utf8);
    }

    async delay(time: number): Promise<void> {
        return new Promise(function (resolve) {
            setTimeout(resolve, time);
        });
    }

    async clickByText(text: string): Promise<void> {
        await this.page.getByText(text, { exact: true }).click();  //Matches locator with exact text and clicks
    }

    async clickElementJS(locator: string): Promise<void> {
        await this.page.$eval(locator, (element: HTMLElement) => element.click());
    }

    async readDataFromExcel(fileName: string, sheetName: string, rowNum: number, cellNum: number): Promise<string> {
        const workbook = new Workbook();
        return workbook.xlsx.readFile(`./Downloads/${fileName}`).then(function () {
            const sheet = workbook.getWorksheet(sheetName);
            return sheet.getRow(rowNum).getCell(cellNum).toString();
        });
    }

    async readValuesFromTextFile(filePath: string): Promise<string> {
        return fs.readFileSync(`${filePath}`, `utf-8`);
    }

    async writeDataIntoTextFile(filePath: number | fs.PathLike, data: string | NodeJS.ArrayBufferView): Promise<void> {
        fs.writeFile(filePath, data, (error) => {
            if (error)
                throw error;
        });
    }

    async getPdfPageText(pdf: any, pageNo: number) {
        const page = await pdf.getPage(pageNo);
        const tokenizedText = await page.getTextContent();
        const pageText = tokenizedText.items.map((token: any) => token.str).join('');
        return pageText;
    }

    /*
   @Auther: Madhukar Kirkan
   @Description : This method is used to open schedule planner for particular employee.
   @Date : 27/11/2024
   */
    async getEmployeeNameForEmployeeIDfromHomePage(EmployeeID: any): Promise<string> {
        const inputEmployeeSearch = await this.page.getByLabel('Employee Search');
        // const searchByEmployeNameOrId = await this.page.getByLabel('Search by Employee Name or ID');
        const searchByEmployeNameOrId = await this.page.frameLocator('//*[@title="Embedded content"]').locator('//div[@class="search-input-container"]//input');
        const search = await this.page.frameLocator('//*[@title="Embedded content"]').getByRole('button', { name: 'Search', exact: true });
        await inputEmployeeSearch.click();
        await this.page.waitForTimeout(500);
        await searchByEmployeNameOrId.focus();
        await searchByEmployeNameOrId.fill(String(EmployeeID));
        await this.page.waitForTimeout(500);
        await search.click();
        await this.page.waitForTimeout(500);
        let employeeName = await this.page.frameLocator('//*[@title="Embedded content"]').locator('//*[@role="listitem"]/div/*[@class="card__info ng-binding ng-scope mainTabularData"]').allInnerTexts();
        await this.page.getByLabel('Close', { exact: true }).click();
        return employeeName.toString().trim();
    }

    /*
   @Auther: Madhukar Kirkan
   @Description : This method is used to open schedule planner for particular employee.
   @Date : 27/11/2024
   */
    async selectScheduleForEmployee(EmployeeID: any) {
        const inputEmployeeSearch = await this.page.getByLabel('Employee Search');
        // const searchByEmployeNameOrId = await this.page.getByLabel('Search by Employee Name or ID');
        const searchByEmployeNameOrId = await this.page.locator('//div[@class="search-input-container"]//input');
        const selectItem = await this.page.getByLabel('Select Item');
        const goTO = await this.page.getByLabel('Go To');
        const optionSchedule = await this.page.getByRole('option', { name: 'Schedule' });
        const search = await this.page.getByRole('button', { name: 'Search', exact: true });

        await inputEmployeeSearch.click();
        await this.page.waitForTimeout(500);
        await searchByEmployeNameOrId.focus();
        await searchByEmployeNameOrId.fill(String(EmployeeID));
        // let employeeName = await searchByEmployeNameOrId.allInnerTexts();
        await this.page.waitForTimeout(500);
        await search.click();
        await this.page.waitForTimeout(500);
        await selectItem.click();

        await this.page.waitForTimeout(500);
        await goTO.click();
        await this.page.waitForTimeout(500);
        await optionSchedule.click();
        await this.page.waitForTimeout(500);
        //return employeeName.toString().trim();
    }


    /*
    @Auther: Madhukar Kirkan
    @Description : This function is used to take screenshot and will return screenshot of failed testcases.
    @Date : 27/11/2024
    */
    async takeScreenShot(): Promise<string> {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        // Take a screenshot and save it with a specific name
        const screenshotPath = process.cwd() + "\\WFMFailedScreenShot\\" + timestamp + ".png";
        await this.page.screenshot({ path: screenshotPath });
        return screenshotPath.toString();
    }

    /*
   @Auther: Madhukar Kirkan
   @Description : This method is used to switch between Tabs in browser by title of tabs.
   @Param : titleVar need to pass title of the page.
   @Date : 02/12/2024
   */
    async switchBetweenTabs(titleVar: string) {
        await this.page.waitForTimeout(2000);
        // Get all the open pages (tabs) in the context
        const allTabs = await this.context.pages();
        let tab: any = null;
        // Loop through all the tabs
        for (tab of allTabs) {
            // Get the title of the current tab
            const tabTitle = await tab.title();
            // Check if the tab's title includes the search string
            if (tabTitle.includes(titleVar)) {
                // Bring the tab to the front if it matches the title
                await tab.bringToFront();
                console.log(`Switched to tab with title: ${tabTitle}`);
                await tab.waitForLoadState('load');
                break; // Once the tab is found, exit the loop
            }
        }
        return tab;
    }

    /*
 @Auther: Madhukar Kirkan
 @Description : This method is used to upload file if its windows based popup using AUTOIT tool.
 @Param : filePath needs to be pass 
 @Date : 02/12/2024
 */
    async uploadFile(filePath: any) {
        // Use Node.js to execute AutoHotkey script (or another external automation tool)
        exec(`"H:\\WFM\\lib\\FileUploadScript\\autoit-v3.1.0\\AutoIt3.exe" "H:\\WFM\\lib\\FileUploadScript\\uploadFilescriptAutoIT.AU3" "${filePath}"`, (err, stdout, stderr) => {
            if (err) {
                console.error('Error executing AutoIT script:', err);
                return;
            }
            console.log('AutoIT script executed:', stdout);
        });
    }

    async getPDFText(filePath: any): Promise<string> {
        const dataBuffer = fs.readFileSync(filePath);
        const pdf = await pdfjslib.getDocument(dataBuffer).promise;
        const maxPages = pdf.numPages;
        const pageTextPromises = [];
        for (let pageNo = 1; pageNo <= maxPages; pageNo += 1) {
            pageTextPromises.push(this.getPdfPageText(pdf, pageNo));
        }
        const pageTexts = await Promise.all(pageTextPromises);
        return pageTexts.join(' ');
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

    /*
  @Auther: Madhukar Kirkan
  @Description : This method is used to select value From Custom DropDown.
  @Param : have to pass Locators and value that need to select.
  @Date : 21/01/2025
  */
    async selectFromCustomDropDown(locator1: any, varString: string) {

        try {
            await this.page.waitForTimeout(1000);
            await locator1.focus();
            await locator1.scrollIntoViewIfNeeded();
            // await this.page.keyboard.press('Enter');
            const custumLocator = locator1.locator("(//*[@data-automation-label='" + varString + "' or text()='" + varString + "'])[1]");
            await this.page.waitForTimeout(1000);
            if (await custumLocator.isVisible() && await custumLocator.count() > 0) {
                await custumLocator.scrollIntoViewIfNeeded();
                await custumLocator.click();
            }
            // await this.page.waitForTimeout(this.timeOut);
            console.log(`Selecting "${varString}" from Custom DropDown - into: ${locator1}`);
        } catch (error) {
            console.error(`Selecting  "${varString}" value from Custom DropDown- into: ${locator1} failed` + error);
            throw error;
        }
    }

    async excelDateToJSDate(excelDate: number): Promise<string> {
        const jsDate = new Date((excelDate - 25569) * 86400 * 1000);
        const day = String(jsDate.getUTCDate()).padStart(2, '0'); // Get day and pad to 2 digits
        const month = String(jsDate.getUTCMonth() + 1).padStart(2, '0'); // Get month (0-indexed, so add 1) and pad to 2 digits
        const year = jsDate.getUTCFullYear(); // Get the full year
        return `${day}/${month}/${year}`; // Format as dd/MM/yyyy
    }


}

