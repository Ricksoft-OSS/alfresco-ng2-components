/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { browser, by, element } from 'protractor';
import { EditProcessFilterDialogPage } from './dialog/edit-process-filter-dialog.page';
import { BrowserVisibility } from '../../core/utils/browser-visibility';
import { BrowserActions } from '../../core/utils/browser-actions';
import { DropdownPage } from '../../core/pages/material/dropdown.page';
import { PeopleCloudComponentPage } from './people-cloud-component.page';

export interface FilterProps {
    name?: string;
    status?: string;
    sort?: string;
    order?: string;
    initiator?: string;
    processName?: string;
}

export class EditProcessFilterCloudComponentPage {

    rootElement = element.all(by.css('adf-cloud-edit-process-filter')).first();
    customiseFilter = element(by.id('adf-edit-process-filter-sub-title-id'));
    saveButton = element(by.css('button[data-automation-id="adf-filter-action-save"]'));
    saveAsButton = element(by.css('button[data-automation-id="adf-filter-action-saveAs"]'));
    deleteButton = element(by.css('button[data-automation-id="adf-filter-action-delete"]'));
    filter = element(by.css(`adf-cloud-edit-process-filter mat-expansion-panel-header`));

    private locatorAppNameDropdown = element(by.css(`mat-select[data-automation-id='adf-cloud-edit-process-property-appName']`));
    private locatorStatusDropdown = element(by.css(`mat-select[data-automation-id='adf-cloud-edit-process-property-status']`));
    private locatorSortDropdown = element(by.css(`mat-select[data-automation-id='adf-cloud-edit-process-property-sort']`));
    private locatorOrderDropdown = element(by.css(`mat-select[data-automation-id='adf-cloud-edit-process-property-order']`));
    private locatorProcessDefinitionNameDropdown = element(by.css(`mat-select[data-automation-id='adf-cloud-edit-process-property-processDefinitionName']`));
    private expansionPanelExtended = this.rootElement.element(by.css('mat-expansion-panel-header.mat-expanded'));
    private content = this.rootElement.element(by.css('div.mat-expansion-panel-content[style*="visible"]'));

    appNameDropdown = new DropdownPage(this.locatorAppNameDropdown);
    statusDropdown = new DropdownPage(this.locatorStatusDropdown);
    sortDropdown = new DropdownPage(this.locatorSortDropdown);
    orderDropdown = new DropdownPage(this.locatorOrderDropdown);
    processDefinitionNameDropdown = new DropdownPage(this.locatorProcessDefinitionNameDropdown);
    peopleCloudComponent = new PeopleCloudComponentPage();

    editProcessFilterDialogPage = new EditProcessFilterDialogPage();

    editProcessFilterDialog(): EditProcessFilterDialogPage {
        return this.editProcessFilterDialogPage;
    }

    isFilterDisplayed(): Promise<boolean> {
        return BrowserVisibility.waitUntilElementIsVisible(this.filter);
    }

    async openFilter(): Promise<void> {
        await this.isFilterDisplayed();
        await BrowserActions.click(this.customiseFilter);
        await this.checkHeaderIsExpanded();
    }

    async checkHeaderIsExpanded(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.expansionPanelExtended);
        await BrowserVisibility.waitUntilElementIsVisible(this.content);
    }

    async closeFilter(): Promise<void> {
        await BrowserActions.click(this.customiseFilter);
        await this.checkHeaderIsCollapsed();
    }

    async checkHeaderIsCollapsed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.expansionPanelExtended, 1000);
        await BrowserVisibility.waitUntilElementIsNotVisible(this.content, 1000);
    }

    setStatusFilterDropDown(option: string): Promise<void> {
        return this.statusDropdown.selectDropdownOption(option);
    }

    getStateFilterDropDownValue(): Promise<string> {
        return BrowserActions.getText(element(by.css("mat-form-field[data-automation-id='status'] span")));
    }

    async setSortFilterDropDown(option): Promise<void> {
        await this.sortDropdown.selectDropdownOption(option);
    }

    async getSortFilterDropDownValue(): Promise<string> {
        const sortLocator = element.all(by.css("mat-form-field[data-automation-id='sort'] span")).first();
        return BrowserActions.getText(sortLocator);
    }

    async setOrderFilterDropDown(option): Promise<void> {
        await this.orderDropdown.selectDropdownOption(option);
        await browser.sleep(1500);
    }

    getOrderFilterDropDownValue(): Promise<string> {
        return BrowserActions.getText(element(by.css("mat-form-field[data-automation-id='order'] span")));
    }

    setAppNameDropDown(option: string): Promise<void> {
        return this.appNameDropdown.selectDropdownOption(option);
    }

    setProcessDefinitionNameDropDown(option: string): Promise<void> {
        return this.processDefinitionNameDropdown.selectDropdownOption(option);
    }

    async getApplicationSelected(): Promise<string> {
        const applicationDropdown = element(by.css(`[data-automation-id='adf-cloud-edit-process-property-appName']`));
        return applicationDropdown.getText();
    }

    async checkAppNamesAreUnique(): Promise<boolean> {
        const appNameList = element.all(by.css('mat-option[data-automation-id="adf-cloud-edit-process-property-optionsappName"] span'));
        const appTextList: any = await appNameList.getText();
        const uniqueArray = appTextList.filter((appName) => {
            const sameAppNameArray = appTextList.filter((eachApp) => eachApp === appName);
            return sameAppNameArray.length === 1;
        });
        return uniqueArray.length === appTextList.length;
    }

    async getNumberOfAppNameOptions(): Promise<number> {
        await this.appNameDropdown.clickDropdown();
        return this.appNameDropdown.getNumberOfOptions();
    }

    isApplicationListLoaded(): Promise<boolean> {
        const emptyList = element(by.css(`[data-automation-id='adf-cloud-edit-process-property-appName'] .mat-select-placeholder`));
        return BrowserVisibility.waitUntilElementIsNotVisible(emptyList);
    }

    setProcessInstanceId(option: string): Promise<void> {
        return this.setProperty('processInstanceId', option);
    }

    setProcessDefinitionKey(option: string): Promise<void> {
        return this.setProperty('processDefinitionKey', option);
    }

    setProcessName(option: string): Promise<void> {
        return this.setProperty('processName', option);
    }

    setInitiator(value: string): Promise<void> {
        return this.peopleCloudComponent.searchAssigneeAndSelect(value);
    }

    getProcessInstanceId(): Promise<string> {
        return this.getProperty('processInstanceId');
    }

    async getProperty(property: string): Promise<string> {
        const locator = element.all(by.css('input[data-automation-id="adf-cloud-edit-process-property-' + property + '"]')).first();
        return BrowserActions.getInputValue(locator);
    }

    async setProperty(property: string, option: string): Promise<void> {
        const locator = element.all(by.css('input[data-automation-id="adf-cloud-edit-process-property-' + property + '"]')).first();
        await BrowserVisibility.waitUntilElementIsVisible(locator);
        await BrowserActions.clearSendKeys(locator, option);
    }

    checkSaveButtonIsDisplayed(): Promise<void> {
        return BrowserVisibility.waitUntilElementIsVisible(this.saveButton);
    }

    checkSaveAsButtonIsDisplayed(): Promise<void> {
        return BrowserVisibility.waitUntilElementIsVisible(this.saveAsButton);
    }

    checkDeleteButtonIsDisplayed(): Promise<void> {
        return BrowserVisibility.waitUntilElementIsVisible(this.deleteButton);
    }

    checkDeleteButtonIsNotDisplayed(): Promise<void> {
        return BrowserVisibility.waitUntilElementIsNotVisible(this.deleteButton);
    }

    async checkSaveButtonIsEnabled(): Promise<boolean> {
        await BrowserVisibility.waitUntilElementIsVisible(this.saveButton);
        return this.saveButton.isEnabled();
    }

    async checkSaveAsButtonIsEnabled(): Promise<boolean> {
        await BrowserVisibility.waitUntilElementIsVisible(this.saveAsButton);
        return this.saveAsButton.isEnabled();
    }

    async checkDeleteButtonIsEnabled(): Promise<boolean> {
        await BrowserVisibility.waitUntilElementIsVisible(this.deleteButton);
        return this.deleteButton.isEnabled();
    }

    async saveAs(name: string): Promise<void> {
        await this.clickSaveAsButton();
        await this.editProcessFilterDialog().setFilterName(name);
        await this.editProcessFilterDialog().clickOnSaveButton();

        await browser.driver.sleep(1000);
    }

    async clickSaveAsButton(): Promise<void> {
        await BrowserActions.click(this.saveAsButton);
        await browser.driver.sleep(1000);
    }

    clickDeleteButton(): Promise<void> {
        return BrowserActions.click(this.deleteButton);
    }

    clickSaveButton(): Promise<void> {
        return BrowserActions.click(this.saveButton);
    }

    async setFilter(props: FilterProps): Promise<void> {
        await this.openFilter();
        if (props.name) { await this.setProcessName(props.name); }
        if (props.status) { await this.setStatusFilterDropDown(props.status); }
        if (props.sort) { await this.setSortFilterDropDown(props.sort);     }
        if (props.order) { await this.setOrderFilterDropDown(props.order);   }
        if (props.initiator) { await this.setInitiator(props.initiator);   }
        if (props.processName) { await this.setProcessName(props.processName);   }
        await this.closeFilter();
    }
}
