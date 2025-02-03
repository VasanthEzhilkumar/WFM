import { TestInfo, test as baseTest } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { WebActions } from '@lib/WebActions';
import AxeBuilder from '@axe-core/playwright';
import { WFMHomePage } from '@pages/WFMHomePage';
import { WFMSchedulePlannerPage } from '@pages/WFMScheduleplannerPage';
import { WFMTimecardPage } from '@pages/WFMTimecardPage';
import { WFMNotificationPage } from '@pages/WFMNotificationPage';
import { WFMIntegrationPage } from '@pages/WFMIntegrationPage';
import { CurrentPayPeriodPage } from 'pageFactory/commonPages/CurrentPayPeriodPage';
import { WFMDataLibraryPage } from '@pages/WFMDataLibraryPage';
import { WFMAvailabilityChangePage } from 'pageFactory/pageRepository/WFMAvailabilityChangePage';
import {WFMControlCentrePage} from 'pageFactory/pageRepository/WFMControlCentrePage';
const test = baseTest.extend<{
    webActions: WebActions;
    loginPage: LoginPage;
    testInfo: TestInfo;
    wfmhomepage: WFMHomePage;
    wfmscheduleplannerpage: WFMSchedulePlannerPage;
    wfmtimecardpage: WFMTimecardPage;
    wfmnotificationpage: WFMNotificationPage;
    wfmintegrationpage: WFMIntegrationPage;
    currentPayPeriodPage: CurrentPayPeriodPage;
    wfmDatapage: WFMDataLibraryPage;
    wfmavailibilityChangePage: WFMAvailabilityChangePage;
    wfmControlCentrePage:WFMControlCentrePage;

}>({
    webActions: async ({ page, context }, use) => {
        await use(new WebActions(page, context));
    },
    loginPage: async ({ page, context }, use) => {
        await use(new LoginPage(page, context));
    },
    wfmhomepage: async ({ page, context }, use) => {
        await use(new WFMHomePage(page, context));
    },
    wfmscheduleplannerpage: async ({ page, context }, use) => {
        await use(new WFMSchedulePlannerPage(page, context));
    },
    wfmtimecardpage: async ({ page, context }, use) => {
        await use(new WFMTimecardPage(page, context));
    },
    wfmnotificationpage: async ({ page, context }, use) => {
        await use(new WFMNotificationPage(page, context));
    },
    wfmintegrationpage: async ({ page, context }, use) => {
        await use(new WFMIntegrationPage(page, context));
    },
    currentPayPeriodPage: async ({ page, context }, use) => {
        await use(new CurrentPayPeriodPage(page, context));
    },
    wfmDatapage: async ({ page, context }, use) => {
        await use(new WFMDataLibraryPage(page, context));
    },
    wfmavailibilityChangePage: async ({ page, context }, use) => {
        await use(new WFMAvailabilityChangePage(page, context));
    },
    wfmControlCentrePage:async ({ page, context }, use) => {
        await use(new WFMControlCentrePage(page, context));
    },




})

export default test;