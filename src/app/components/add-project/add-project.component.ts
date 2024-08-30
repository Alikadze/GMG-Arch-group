import { Component, EventEmitter, inject, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AddProjectImagesComponent } from "../add-project-images/add-project-images.component";
import { FloatLabelModule } from 'primeng/floatlabel';
import { TooltipModule } from 'primeng/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { ProjectFacade } from '../../core/facades/project.facade';
import { MessageService } from 'primeng/api';
import { ProjectPayload } from '../../core/interfaces/project';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { HttpClientModule } from '@angular/common/http';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { Router } from '@angular/router';
import { map, Subject, switchMap, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-add-project',
  standalone: true,
  imports: [
    AddProjectImagesComponent,
    FloatLabelModule,
    TooltipModule,
    TranslateModule,
    CommonModule,
    FormsModule,
    DividerModule,
    InputTextareaModule,
    InputTextModule,
    FileUploadModule,
    ButtonModule,
    BadgeModule, 
    ProgressBarModule, 
    ToastModule, 
    HttpClientModule,
    CalendarModule,
    InputNumberModule,
    DatePipe,
    DropdownModule
  ],
  templateUrl: './add-project.component.html',
  styleUrl: './add-project.component.scss'
})
export class AddProjectComponent implements OnInit, OnDestroy {
  projectFacade = inject(ProjectFacade);
  messageService = inject(MessageService);
  translateService = inject(TranslateService);
  router = inject(Router);

  isAuthenticated = false;

  projectName: string = '';
  projectDesc: string = '';
  projectType:  { label: string, value: string } = { label: '', value: '' };
  offeredPrice!: number | undefined;
  startDate: Date | undefined = new Date();
  endDate: Date | undefined = new Date();
  totalFlatSpace!: number | undefined;

  
  types: { label: string, value: string }[] = [];

  ngOnInit() {
    this.clearForm();
    
    this.translateService.onLangChange.pipe(
      tap(() => {
        this.loadTranslations();
      }),
      takeUntil(this.destroy$)
    ).subscribe();
    
    this.loadTranslations();
  }

  private loadTranslations(): void {
    this.translateService.get(['Ended', 'Offered']).subscribe((translations: any) => {
      this.types = [
        { label: translations['Ended'], value: 'ended' },
        { label: translations['Offered'], value: 'offered' },
      ];
    });
  }



  files: File[] | undefined = [];

  isLoading = false;
  areProjectsLoading = false;
  totalSize: number = 0;
  totalSizePercent = this.totalSize / 10;

  destroy$ = new Subject<void>();

  @Output() projectAdded = new EventEmitter<ProjectPayload>();
  @ViewChild('fileUpload') fileUpload!: FileUpload;

  onSelectedFiles(event: any) {
    this.files = event.currentFiles;
  }


  onSubmit() {

    this.translateService.get(['Error', 'Please enter project name', 'Please enter project description', 'Please select project type', 'Please enter offered price', 'Please select start and end date', 'Please enter total flat space', 'Please select at least one image']).pipe(
      tap((translations: any) => {
        if (this.projectType.value === '') {
          this.messageService.add({key:'addProject',  severity: 'error', summary: translations['Error'], detail: translations['Please select project type'] });
          return;
        } else if (this.projectName === '') {
          this.messageService.add({key:'addProject',  severity: 'error', summary: translations['Error'], detail: translations['Please enter project name'] });
          return;
        } else if (this.projectDesc === '') {
          this.messageService.add({key:'addProject',  severity: 'error', summary: translations['Error'], detail: translations['Please enter project description']});
          return; 
        } else if (this.projectType.value === 'offered' && this.offeredPrice === undefined) {
          this.messageService.add({key:'addProject',  severity: 'error', summary: translations['Error'], detail: translations['Please enter offered price'] });
          return;
        } else if (this.projectType.value === 'ended' && (this.startDate === undefined || this.endDate === undefined)) {
          this.messageService.add({key:'addProject',  severity: 'error', summary: translations['Error'], detail: translations['Please select start and end date'] });
          return;
        } else if (this.totalFlatSpace === undefined) {
          this.messageService.add({key:'addProject',  severity: 'error', summary: translations['Error'], detail: translations['Please enter total flat space'] });
          return;
        } else if (this.files?.length === 0) {
          this.messageService.add({key:'addProject',  severity: 'error', summary: translations['Error'], detail: translations['Please select at least one image'] });
          return;
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe();

    if (typeof this.files === 'undefined') {
      return;
    }


    if (this.projectName && this.projectDesc && this.files.length > 0) {
      this.isLoading = true;

      const project: ProjectPayload = {
        type: this.projectType.value,
        name: this.projectName,
        description: this.projectDesc,
        offeredPrice: this.projectType.value === 'offered' ? this.offeredPrice : 1,
        startDate: this.projectType.value === 'ended' ? this.startDate as Date : new Date(),
        endDate: this.projectType.value === 'ended' ? this.endDate as Date : new Date(),
        flatSpace: this.totalFlatSpace as number,
        images: []
      };

      const projectId = project.id;

      this.projectFacade.addProject(project, this.files as File[]).pipe(
        tap(() => {
          this.translateService.get(['Success', 'Project added successfully']).pipe(
            tap((translations: any) => {
              this.messageService.add({  severity: 'success', summary: translations['Success'], detail: translations['Project added successfully'], life: 1500 });
            }),
            takeUntil(this.destroy$)
          ).subscribe();
          
          this.isLoading = false;
          this.clearForm();
          this.projectAdded.emit(project);
        }, error => {
          this.messageService.add({key:'addProject',  severity: 'error', summary: 'Error', detail: error.message });
          this.isLoading = false;
        }),
        takeUntil(this.destroy$)
      ).subscribe()
      return;
    }
  }

  clearForm() {
    this.projectName = '';
    this.projectDesc = '';
    this.startDate = undefined;
    this.endDate = undefined;
    this.totalFlatSpace = undefined;
    this.offeredPrice = undefined;
    this.projectType = { label: '', value: '' };
    this.files = new Array<File>();

    if (this.fileUpload) {
      this.fileUpload.clear();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
