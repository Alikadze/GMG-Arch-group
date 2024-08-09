import { Component, EventEmitter, inject, OnInit, Output, ViewChild } from '@angular/core';
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
    CommonModule,
    DividerModule,
    CalendarModule,
    InputNumberModule,
    DatePipe
  ],
  templateUrl: './add-project.component.html',
  styleUrl: './add-project.component.scss'
})
export class AddProjectComponent{
  projectFacade = inject(ProjectFacade);
  messageService = inject(MessageService);
  translateService = inject(TranslateService);

  projectName: string = '';
  projectDesc: string = '';
  startDate!: Date | undefined;
  endDate!: Date | undefined;
  totalFlatSpace!: number | undefined;



  files: File[] | undefined = [];

  isLoading = false;
  totalSize: number = 0;
  totalSizePercent = this.totalSize / 10;

  @Output() projectAdded = new EventEmitter<ProjectPayload>();
  @ViewChild('fileUpload') fileUpload!: FileUpload;

  onSelectedFiles(event: any) {
    this.files = event.currentFiles;
  }

  onSubmit() {
    if (typeof this.files === 'undefined') {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select at least one image' });
      return;
      
    }

    if (this.projectName && this.projectDesc && this.files.length > 0) {
      this.isLoading = true;

      const project: ProjectPayload = {
        name: this.projectName,
        description: this.projectDesc,
        startDate: this.startDate as Date,
        endDate: this.endDate as Date,
        flatSpace: this.totalFlatSpace as number,
        images: []
      };

      this.projectFacade.addProject(project, this.files as File[]).subscribe(() => {
        this.translateService.get('Success', 'Project added successfully').subscribe((translation: string) => {
          this.messageService.add({ severity: 'success', summary: translation, detail: 'Project added successfully', life: 1500 });
        });
        this.isLoading = false;
        this.clearForm();
        this.projectAdded.emit(project);
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
        this.isLoading = false;
      });
      return;
    }
  }

  clearForm() {
    this.projectName = '';
    this.projectDesc = '';
    this.startDate = undefined;
    this.endDate = undefined;
    this.totalFlatSpace = undefined;
    this.files = new Array<File>();

    if (this.fileUpload) {
      this.fileUpload.clear();
    }
  }

  ngOnInit() {
    this.clearForm()
  }
}
