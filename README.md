Playwright TypeScript Test Framework
Installation
Clone the repository:
sh
Copy code
git clone https://github.com/VasanthEzhilkumar/PlaywrightFramework.git
Navigate to the project folder and install npm packages:
sh
Copy code
cd PlaywrightFramework
npm install
For first time installation, download the required browsers:
sh
Copy code
npx playwright install
Usage
Browser Configuration
Modify the required parameters in playwright.config.ts to configure the browser settings.

Running Tests
Execute Entire Test Suite on All Browsers
To run the entire test suite on all available browsers, use the following command where ENV can be qa or dev. Test cases are located in the tests folder:

sh
Copy code
npm run test --ENV="qa"
Execute a Single Test Case on Chrome
To run a single test case on the Chrome browser, use:

sh
Copy code
npm run test:single --ENV="qa"
To change the browser (e.g., Firefox), modify the --project parameter in package.json to match the browser name given in playwright.config.ts.

Execute Test Cases in Parallel
Add the tag @SmokeTest at the start of your test case name. Then, in package.json, set the tag value for test:parallel and execute:

sh
Copy code
npm run test:parallel --ENV="qa"
Execute Test Cases in Sequence
Add the tag @SmokeTest at the start of your test case name. Then, in package.json, set the tag value for test:serial and execute. The --workers parameter corresponds to the number of test cases you want to execute simultaneously (e.g., --workers=3 executes 3 test cases simultaneously):

sh
Copy code
npm run test:serial --ENV="qa"
Execute API Test Cases
For API tests, set the ENV value to qaApi or devApi:

sh
Copy code
npm run test:api --ENV="qaApi"
Record Test Scripts
To record test scripts, use:

sh
Copy code
npm run test:record
Visual Comparison of Screenshots
To produce and visually compare screenshots, execute the following command. On the first execution, a reference screenshot will be generated for comparison with subsequent runs:

sh
Copy code
npm run test:visual --ENV="qa"
Emulate Test Cases on Any Device
In playwright.config.ts, under the device section, provide the desired device name and execute:

sh
Copy code
npm run test:device --ENV="qa"
Generate Allure Report
To generate an Allure Report, use:

sh
Copy code
npm run allureReport
Generate HTML Report
To generate an HTML report, which is a single static HTML file (index.html) that can be sent via email, use:

sh
Copy code
npm run html-report
Debugging
For debugging test cases, add breakpoints and press CTRL+SHIFT+P, then type debug:debug npm script. In the edit box, select the desired script.

Output Files
Screenshots, videos, and trace files will be generated in the test-results folder.

Changing Username and Password
Change Username
To change your username, update the value in testConfig.ts.

Change Password
In lib/WebActions, uncomment the ENCRYPT code block in decipherPassword() and replace the placeholder with your password.
Execute the test case to print the encrypted password in your console.
Copy the encrypted password to the password field in testConfig.ts.
Comment out the ENCRYPT block after this.
Execute Postgres DB Test Case
Navigate to testConfig.ts and provide values for dbUsername, dbPassword, dbServerName, dbPort, and dbName. Refer to tests/DB.test.ts for connecting to the DB and executing a query.

Viewing Trace Files
To view trace files, navigate to the folder where trace.zip is generated and execute:

sh
Copy code
npx playwright show-trace trace.zip
Custom Logging
Change the logging message at the test case/test step level in CustomReporterConfig.ts.

Shorten Import Paths
In tsconfig.json, you can re-assign long path imports to a variable starting with @ to shorten your import statements. For example, replace:

json
Copy code
"../../pageFactory/pageRepository/"
with:

json
Copy code
"@pages/*":["pageFactory/pageRepository/*"]
This will allow you to use @pages instead of the long import path in your files.