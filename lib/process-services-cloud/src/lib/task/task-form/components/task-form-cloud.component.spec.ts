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

import { DebugElement, SimpleChange } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IdentityUserService, setupTestBed } from '@alfresco/adf-core';
import { ProcessServiceCloudTestingModule } from '../../../testing/process-service-cloud.testing.module';
import { TaskFormCloudComponent } from './task-form-cloud.component';
import { TaskDetailsCloudModel } from '../../start-task/models/task-details-cloud.model';
import { TaskCloudService } from '../../services/task-cloud.service';
import { TranslateModule } from '@ngx-translate/core';

const taskDetails: TaskDetailsCloudModel = {
    appName: 'simple-app',
    assignee: 'admin.adf',
    completedDate: null,
    createdDate: new Date(1555419255340),
    description: null,
    formKey: null,
    id: 'bd6b1741-6046-11e9-80f0-0a586460040d',
    name: 'Task1',
    owner: 'admin.adf',
    standalone: true,
    status: 'ASSIGNED'
};

describe('TaskFormCloudComponent', () => {

    let taskCloudService: TaskCloudService;
    let identityUserService: IdentityUserService;

    let getTaskSpy: jasmine.Spy;
    let getCurrentUserSpy: jasmine.Spy;
    let debugElement: DebugElement;

    let component: TaskFormCloudComponent;
    let fixture: ComponentFixture<TaskFormCloudComponent>;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessServiceCloudTestingModule
        ]
    });

    beforeEach(() => {
        taskDetails.status = 'ASSIGNED';
        identityUserService = TestBed.inject(IdentityUserService);
        getCurrentUserSpy = spyOn(identityUserService, 'getCurrentUserInfo').and.returnValue({ username: 'admin.adf' });
        taskCloudService = TestBed.inject(TaskCloudService);
        getTaskSpy = spyOn(taskCloudService, 'getTaskById').and.returnValue(of(taskDetails));
        spyOn(taskCloudService, 'getCandidateGroups').and.returnValue(of([]));
        spyOn(taskCloudService, 'getCandidateUsers').and.returnValue(of([]));

        fixture = TestBed.createComponent(TaskFormCloudComponent);
        debugElement = fixture.debugElement;
        component = fixture.componentInstance;
   });

    describe('Complete button', () => {

        it('should show complete button when status is ASSIGNED', async () => {
            component.appName = 'app1';
            component.taskId = 'task1';

            component.loadTask();

            fixture.detectChanges();
            await fixture.whenStable();

            const completeBtn = debugElement.query(By.css('[adf-cloud-complete-task]'));
            expect(completeBtn.nativeElement).toBeDefined();
        });

        it('should not show complete button when status is ASSIGNED but assigned to a different person', async () => {
            component.appName = 'app1';
            component.taskId = 'task1';

            getCurrentUserSpy.and.returnValue({});

            component.loadTask();

            fixture.detectChanges();
            await fixture.whenStable();

            const completeBtn = debugElement.query(By.css('[adf-cloud-complete-task]'));
            expect(completeBtn).toBeNull();
        });

        it('should not show complete button when showCompleteButton=false', async () => {
            component.appName = 'app1';
            component.taskId = 'task1';
            component.showCompleteButton = false;

            component.loadTask();

            fixture.detectChanges();
            await fixture.whenStable();

            const completeBtn = debugElement.query(By.css('[adf-cloud-complete-task]'));
            expect(completeBtn).toBeNull();
        });
    });

    describe('Claim/Unclaim buttons', () => {

        it('should not show release button for standalone task', async () => {
            component.taskId = 'task1';
            component.loadTask();
            getTaskSpy.and.returnValue(of(taskDetails));

            fixture.detectChanges();
            await fixture.whenStable();

            const unclaimBtn = debugElement.query(By.css('[adf-cloud-unclaim-task]'));
            expect(unclaimBtn).toBeNull();
        });

        it('should show release button when task has candidate users and is assigned to one of these users', async () => {
            spyOn(component, 'hasCandidateUsers').and.returnValue(true);

            component.appName = 'app1';
            component.taskId = 'task1';

            component.loadTask();

            fixture.detectChanges();
            await fixture.whenStable();

            const unclaimBtn = debugElement.query(By.css('[adf-cloud-unclaim-task]'));
            expect(unclaimBtn).not.toBeNull();
        });

        it('should not show unclaim button when status is ASSIGNED but assigned to different person', async () => {
            component.appName = 'app1';
            component.taskId = 'task1';

            getCurrentUserSpy.and.returnValue({});

            component.loadTask();

            fixture.detectChanges();
            await fixture.whenStable();

            const unclaimBtn = debugElement.query(By.css('[adf-cloud-unclaim-task]'));
            expect(unclaimBtn).toBeNull();
        });

        it('should not show unclaim button when status is not ASSIGNED', async () => {
            component.appName = 'app1';
            component.taskId = 'task1';
            taskDetails.status = undefined;
            getTaskSpy.and.returnValue(of(taskDetails));

            component.loadTask();

            fixture.detectChanges();
            await fixture.whenStable();

            const unclaimBtn = debugElement.query(By.css('[adf-cloud-unclaim-task]'));
            expect(unclaimBtn).toBeNull();
        });

        it('should show claim button when status is CREATED', async () => {
            component.appName = 'app1';
            component.taskId = 'task1';
            taskDetails.status = 'CREATED';
            getTaskSpy.and.returnValue(of(taskDetails));

            component.loadTask();

            fixture.detectChanges();
            await fixture.whenStable();

            const claimBtn = debugElement.query(By.css('[adf-cloud-claim-task]'));
            expect(claimBtn.nativeElement).toBeDefined();
        });

        it('should not show claim button when status is not CREATED', async () => {
            component.appName = 'app1';
            component.taskId = 'task1';
            taskDetails.status = undefined;
            getTaskSpy.and.returnValue(of(taskDetails));

            component.loadTask();

            fixture.detectChanges();
            await fixture.whenStable();

            const claimBtn = debugElement.query(By.css('[adf-cloud-claim-task]'));
            expect(claimBtn).toBeNull();
        });
    });

    describe('Cancel button', () => {

        it('should show cancel button by default', async () => {
            component.appName = 'app1';
            component.taskId = 'task1';

            component.loadTask();

            fixture.detectChanges();
            await fixture.whenStable();

            const cancelBtn = debugElement.query(By.css('#adf-cloud-cancel-task'));
            expect(cancelBtn.nativeElement).toBeDefined();
        });

        it('should not show cancel button when showCancelButton=false', async () => {
            component.appName = 'app1';
            component.taskId = 'task1';
            component.showCancelButton = false;

            component.loadTask();

            fixture.detectChanges();
            await fixture.whenStable();

            const cancelBtn = debugElement.query(By.css('#adf-cloud-cancel-task'));
            expect(cancelBtn).toBeNull();
        });
    });

    describe('Inputs', () => {

        it('should not show complete/claim/unclaim buttons when readOnly=true', async () => {
            component.appName = 'app1';
            component.taskId = 'task1';
            component.readOnly = true;

            component.loadTask();

            fixture.detectChanges();
            await fixture.whenStable();

            const completeBtn = debugElement.query(By.css('[adf-cloud-complete-task]'));
            expect(completeBtn).toBeNull();

            const claimBtn = debugElement.query(By.css('[adf-cloud-claim-task]'));
            expect(claimBtn).toBeNull();

            const unclaimBtn = debugElement.query(By.css('[adf-cloud-unclaim-task]'));
            expect(unclaimBtn).toBeNull();

            const cancelBtn = debugElement.query(By.css('#adf-cloud-cancel-task'));
            expect(cancelBtn.nativeElement).toBeDefined();
        });

        it('should load data when appName changes', () => {
            component.taskId = 'task1';
            component.ngOnChanges({ appName: new SimpleChange(null, 'app1', false) });
            expect(getTaskSpy).toHaveBeenCalled();
        });

        it('should load data when taskId changes', () => {
            component.appName = 'app1';
            component.ngOnChanges({ taskId: new SimpleChange(null, 'task1', false) });
            expect(getTaskSpy).toHaveBeenCalled();
        });

        it('should not load data when appName changes and taskId is not defined', () => {
            component.ngOnChanges({ appName: new SimpleChange(null, 'app1', false) });
            expect(getTaskSpy).not.toHaveBeenCalled();
        });

        it('should not load data when taskId changes and appName is not defined', () => {
            component.ngOnChanges({ taskId: new SimpleChange(null, 'task1', false) });
            expect(getTaskSpy).not.toHaveBeenCalled();
        });
    });

    describe('Events', () => {

        it('should emit cancelClick when cancel button is clicked', (done) => {
            component.appName = 'app1';
            component.taskId = 'task1';

            component.cancelClick.subscribe(() => {
                done();
            });

            component.loadTask();
            fixture.detectChanges();
            const cancelBtn = debugElement.query(By.css('#adf-cloud-cancel-task'));

            cancelBtn.nativeElement.click();
        });

        it('should emit taskCompleted when task is completed', (done) => {

            spyOn(taskCloudService, 'completeTask').and.returnValue(of({}));

            component.appName = 'app1';
            component.taskId = 'task1';

            component.taskCompleted.subscribe(() => {
                done();
            });

            component.loadTask();
            fixture.detectChanges();
            const completeBtn = debugElement.query(By.css('[adf-cloud-complete-task]'));

            completeBtn.nativeElement.click();
        });

        it('should emit taskClaimed when task is claimed', (done) => {
            spyOn(taskCloudService, 'claimTask').and.returnValue(of({}));
            taskDetails.status = 'CREATED';
            getTaskSpy.and.returnValue(of(taskDetails));

            component.appName = 'app1';
            component.taskId = 'task1';

            component.taskClaimed.subscribe(() => {
                done();
            });

            component.loadTask();
            fixture.detectChanges();
            const claimBtn = debugElement.query(By.css('[adf-cloud-claim-task]'));

            claimBtn.nativeElement.click();
        });

        it('should emit error when error occurs', (done) => {
            component.appName = 'app1';
            component.taskId = 'task1';

            component.error.subscribe(() => {
                done();
            });

            component.onError({});
        });

        it('should emit taskCompleted when task is completed', () => {

            spyOn(taskCloudService, 'completeTask').and.returnValue(of({}));
            const reloadSpy = spyOn(component, 'loadTask').and.callThrough();

            component.appName = 'app1';
            component.taskId = 'task1';

            component.loadTask();
            fixture.detectChanges();
            const completeBtn = debugElement.query(By.css('[adf-cloud-complete-task]'));

            completeBtn.nativeElement.click();
            expect(reloadSpy).toHaveBeenCalled();
        });

        it('should emit taskClaimed when task is claimed', () => {
            spyOn(taskCloudService, 'claimTask').and.returnValue(of({}));
            const reloadSpy = spyOn(component, 'loadTask').and.callThrough();

            taskDetails.status = 'CREATED';
            getTaskSpy.and.returnValue(of(taskDetails));

            component.appName = 'app1';
            component.taskId = 'task1';

            component.loadTask();
            fixture.detectChanges();
            const claimBtn = debugElement.query(By.css('[adf-cloud-claim-task]'));

            claimBtn.nativeElement.click();
            expect(reloadSpy).toHaveBeenCalled();
        });

        it('should emit taskUnclaimed when task is unclaimed', () => {
            spyOn(taskCloudService, 'unclaimTask').and.returnValue(of({}));
            const reloadSpy = spyOn(component, 'loadTask').and.callThrough();
            spyOn(component, 'hasCandidateUsers').and.returnValue(true);

            taskDetails.status = 'ASSIGNED';
            getTaskSpy.and.returnValue(of(taskDetails));

            component.appName = 'app1';
            component.taskId = 'task1';

            component.loadTask();
            fixture.detectChanges();
            const unclaimBtn = debugElement.query(By.css('[adf-cloud-unclaim-task]'));

            unclaimBtn.nativeElement.click();
            expect(reloadSpy).toHaveBeenCalled();
        });

        it('should show loading template while task data is being loaded', () => {
            component.loading = true;
            fixture.detectChanges();

            const loadingTemplate = debugElement.query(By.css('mat-progress-spinner'));

            expect(loadingTemplate).toBeDefined();
        });

        it('should not show loading template while task data is not being loaded', () => {
            component.loading = false;
            component.appName = 'app1';
            component.taskId = 'task1';

            component.loadTask();
            fixture.detectChanges();

            const loadingTemplate = debugElement.query(By.css('mat-progress-spinner'));

            expect(loadingTemplate).toBeNull();
        });
    });

    it('should display task name as title on no form template if showTitle is true', () => {
        component.taskId = taskDetails.id;

        fixture.detectChanges();
        const noFormTemplateTitle = debugElement.query(By.css('.adf-form-title'));

        expect(noFormTemplateTitle.nativeElement.innerText).toEqual('Task1');
    });

    it('should display default name as title on no form template if the task name empty/undefined', () => {
        const mockTaskDetailsWithOutName = { id: 'mock-task-id', name: null, formKey: null };
        getTaskSpy.and.returnValue(of(mockTaskDetailsWithOutName));
        component.taskId = 'mock-task-id';

        fixture.detectChanges();
        const noFormTemplateTitle = debugElement.query(By.css('.adf-form-title'));

        expect(noFormTemplateTitle.nativeElement.innerText).toEqual('FORM.FORM_RENDERER.NAMELESS_TASK');
    });

    it('should not display no form title if showTitle is set to false', () => {
        component.taskId = taskDetails.id;
        component.showTitle = false;

        fixture.detectChanges();
        const noFormTemplateTitle = debugElement.query(By.css('.adf-form-title'));

        expect(noFormTemplateTitle).toBeNull();
    });
});
