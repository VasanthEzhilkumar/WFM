import { Page, BrowserContext, Locator, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import * as unzipper from 'unzipper';
import csvParser from 'csv-parser';
import * as os from 'os';


import * as XLSX from 'xlsx';

export class WFMIntegrationPage {
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
    readonly integrationLink: Locator;
    readonly runIntegrationbtn: Locator;
    readonly selectIntegrationslovakia: Locator;
    readonly selectIntegration: Locator
    readonly closeIntegration: Locator
    readonly integrationRunName: Locator
    readonly refreshIntegration: Locator;
    readonly runIntbtn



    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;
        this.integrationLink = page.getByLabel('Integrations link');
        this.runIntegrationbtn = page.locator('div').filter({ hasText: /^Run an Integration$/ });
        this.selectIntegrationslovakia = page.getByRole('dialog').getByRole('list').locator('div').filter({ hasText: 'Payroll Export - Slovakia' }).nth(4)
        this.selectIntegration = page.getByRole('button', { name: 'Select' })
        this.closeIntegration = page.getByRole('button', { name: 'Payroll Export - Slovakia Close' })
        this.refreshIntegration = page.getByLabel('Refresh', { exact: true });
        this.runIntbtn = page.getByRole('button', { name: 'Run Integration' })
    }

    async SearchEMP_Timecard(EmpName: string): Promise<void> {
        await this.EMP_SELECTORDROPDOWN.click();
        await this.EMP_SEARCHBAR.click();
        await this.EMP_SEARCHBAR.fill(EmpName);
        await this.EMP_LIST.click();

    }

    async runIntegration(): Promise<string> {
        await this.integrationLink.click();
        await this.runIntegrationbtn.click();
        await this.selectIntegrationslovakia.click();
        await this.selectIntegration.click();
        await this.runIntbtn.click();
        // Capture the date and time when you click the run button
        const runTime = this.getFormattedDateTime();
        console.log(`Captured run time: ${runTime}`);
        await this.closeIntegration.click()

        return runTime;

    }

    // Function to get the current date and time in the format "11/11/2024 11:56"
    async getFormattedDateTime() {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${month}/${day}/${year} ${hours}:${minutes}`;
    }

    async checkIntegrationStatus(runTime: string): Promise<void> {

        await this.refreshIntegration.click()

        //await this.page.getByRole('button', { name: 'Integration Run Name Payroll Export - Slovakia-11/11/2024 11:56:01 Type Run now' })

        const integrationRunLocator = this.page.getByLabel('Item Integration Run Name Payroll Export - Slovakia-11/11/2024 13:10 not').getByRole('button', { name: '' })


        // const integrationRunLocator = this.page.getByLabel(
        //     `Item Integration Run Name Payroll Export - Slovakia-${runTime}.*not`
        // ).getByRole('button', { name: '' }); // The refresh button locator

        // Click the refresh button until the state becomes visible
        let isStateVisible = false;
        const maxRetries = 50; // Set a maximum retry limit to avoid infinite loop
        let attempts = 0;

        while (!isStateVisible && attempts < maxRetries) {
            try {
                // Click the refresh button
                await this.refreshIntegration.click();
                console.log(`Clicked refresh button, attempt ${attempts + 1}`);

                // Wait for the integration run state button to become visible
                //await integrationRunLocator.waitFor({ timeout: 5000 });

                if (await this.page.getByRole('button', { name: ' In Progress [0]' }).count() > 0) {


                    const txt = await this.page.locator('#ihub-inprogress-monitor-1-slat-area-2').allInnerTexts();
                    console.log();
                    // If no error is thrown, the state is now visible
                    isStateVisible = true;
                }


                //  console.log(`State is now visible after ${attempts + 1} attempts`);
            } catch (error) {
                // If the element is not visible, continue retrying
                console.log(`State not visible yet, retrying...`);
            }

            attempts++;
        }

        if (isStateVisible) {
            // Click the button after the state is visible
            await this.page.getByRole('button', {
                name: new RegExp(`Integration Run Name Payroll Export - Slovakia-${runTime}.*Type Run now`),
            }).click();
            console.log("Clicked the 'Run now' button");
            await this.page.getByRole('tab', { name: ' Output Files' }).click();
            const downloadPromise = this.page.waitForEvent('download');
            await this.page.getByText('Export File(s)SLK-PayData-').click();

            //             // Start waiting for download before clicking. Note no await.


            // const download = await downloadPromise;

            // // Wait for the download process to complete and save the downloaded file somewhere.
            // await download.saveAs('C:\\Users\\vezhil\\Downloads' + download.suggestedFilename());


            // Start waiting for the download event before clicking the download button.
            //const downloadPromise = page.waitForEvent('download');
            //await page.getByText('Download file').click();
            const download = await downloadPromise;

            // Get the user's Downloads directory dynamically
            const downloadDirectory = path.join(os.homedir(), 'Downloads');

            // Get the suggested filename from Playwright
            const suggestedFilename = download.suggestedFilename();

            // Construct the full file path where the file will be saved
            const fullFilePath = path.join(downloadDirectory, suggestedFilename);

            // Save the downloaded file to the specified path
            await download.saveAs(fullFilePath);

            console.log(`File has been saved at: ${fullFilePath}`);

        } else {
            console.error("State did not become visible after maximum retries");
        }

    }

    //     // Method to extract and read CSV file
    //     async extractAndValidateCSV(downloadPath: string, excelFilePath: string): Promise<void> {
    //         const zipFilePath = path.join(downloadPath, 'archive.zip');
    //         const extractedDir = path.join(downloadPath, 'extracted');
    //         const csvFilePath = path.join(extractedDir, 'yourFile.csv'); // Adjust this file name as needed

    //         // Step 1: Extract ZIP file
    //         await fs.createReadStream(zipFilePath)
    //             .pipe(unzipper.Extract({ path: extractedDir }))
    //             .promise();
    //         console.log(`Extracted ZIP file to ${extractedDir}`);

    //         // Step 2: Read CSV file
    //         const csvData: string[][] = await this.readCSV(csvFilePath);

    //         // Step 3: Read Excel file
    //         const excelData = this.readExcel(excelFilePath);

    //         // Step 4: Validate data
    //         for (const excelRow of excelData) {
    //             const { Paycode, Hours, Days } = excelRow;
    //             const matchingRow = csvData.find((csvRow) => csvRow[1] === Paycode);

    //             if (!matchingRow) {
    //                 console.error(`No matching Paycode found for ${Paycode}`);
    //                 continue;
    //             }

    //             const csvHours = matchingRow[4];
    //             const csvDays = matchingRow[5];

    //             if (csvHours !== Hours || csvDays !== Days) {
    //                 console.error(`Validation failed for Paycode ${Paycode}. Expected Hours: ${Hours}, Days: ${Days}. Found Hours: ${csvHours}, Days: ${csvDays}`);
    //             } else {
    //                 console.log(`Validation passed for Paycode ${Paycode}`);
    //             }
    //         }
    //     }

    //     // Helper function to read CSV file


    //     async readCSV(filePath: string): Promise<string[][]> {
    //         return new Promise((resolve, reject) => {
    //             const results: string[][] = [];
    //             fs.createReadStream(filePath)
    //                 .pipe(csvParser({ separator: '|' }))
    //                 .on('data', (data) => {
    //                     const row = Object.values(data) as string[];
    //                     results.push(row);
    //                 })
    //                 .on('end', () => resolve(results))
    //                 .on('error', reject);
    //         });
    //     }


    //     // Helper function to read Excel file
    //     readExcel(filePath: string): any[] {
    //         const workbook = XLSX.readFile(filePath);
    //         const sheetName = workbook.SheetNames[0];
    //         const sheet = workbook.Sheets[sheetName];
    //         return XLSX.utils.sheet_to_json(sheet);
    //     }
    // }








    // Method to extract and validate the CSV file
    async extractAndValidateCSV(downloadPath: string, excelFilePath: string): Promise<void> {
        const zipFilePath = path.join(downloadPath, 'archive.zip');
        const extractedDir = path.join(downloadPath, 'extracted');

        // Ensure the extraction directory exists
        if (!fs.existsSync(extractedDir)) {
            fs.mkdirSync(extractedDir);
        }

        // Step 1: Extract ZIP file
        await fs.createReadStream(zipFilePath)
            .pipe(unzipper.Extract({ path: extractedDir }))
            .promise();
        console.log(`Extracted ZIP file to ${extractedDir}`);

        // Step 2: Find the dynamic CSV file
        const csvFilePath = this.findCSVFile(extractedDir);
        if (!csvFilePath) {
            console.error('No CSV file found after extraction.');
            return;
        }
        console.log(`Found CSV file: ${csvFilePath}`);

        // Step 3: Read the CSV file
        const csvData: string[][] = await this.readCSV(csvFilePath);

        // Step 4: Read the Excel file
        const excelData = this.readExcel(excelFilePath);

        // Step 5: Validate data between Excel and CSV
        for (const excelRow of excelData) {
            const { Paycode, Hours, Days } = excelRow;
            const matchingRow = csvData.find((csvRow) => csvRow[1] === Paycode);

            if (!matchingRow) {
                console.error(`No matching Paycode found for ${Paycode}`);
                continue;
            }

            const csvHours = matchingRow[4];
            const csvDays = matchingRow[5];

            if (csvHours !== Hours || csvDays !== Days) {
                console.error(
                    `Validation failed for Paycode ${Paycode}. Expected Hours: ${Hours}, Days: ${Days}. Found Hours: ${csvHours}, Days: ${csvDays}`
                );
            } else {
                console.log(`Validation passed for Paycode ${Paycode}`);
            }
        }
    }

    // Helper function to find the CSV file in the extracted directory
    findCSVFile(directoryPath: string): string | null {
        const files = fs.readdirSync(directoryPath);
        const csvFile = files.find((file) => file.toLowerCase().endsWith('.csv'));
        return csvFile ? path.join(directoryPath, csvFile) : null;
    }

    // Helper function to read the CSV file
    async readCSV(filePath: string): Promise<string[][]> {
        return new Promise((resolve, reject) => {
            const results: string[][] = [];
            fs.createReadStream(filePath)
                .pipe(csvParser({ separator: '|' }))
                .on('data', (data) => {
                    const row = Object.values(data) as string[];
                    results.push(row);
                })
                .on('end', () => resolve(results))
                .on('error', reject);
        });
    }

    // Helper function to read the Excel file
    readExcel(filePath: string): any[] {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        return XLSX.utils.sheet_to_json(sheet);
    }
}




