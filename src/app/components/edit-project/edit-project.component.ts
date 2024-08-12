import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectFacade } from '../../core/facades/project.facade';
import { ActivatedRoute } from '@angular/router';
import { ProjectPayload } from '../../core/interfaces/project';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-edit-project',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    DropdownModule,
    TooltipModule,
    TranslateModule,
    CalendarModule
  ],
  templateUrl: './edit-project.component.html',
  styleUrl: './edit-project.component.scss'
})
export class EditProjectComponent implements OnInit {
  projectFacade = inject(ProjectFacade);
  route = inject(ActivatedRoute);
  translateService = inject(TranslateService);

  projectId: string | null = null;

  @Input() project!: ProjectPayload;
  @Output() projectUpdated = new EventEmitter<ProjectPayload>();


   ngOnInit(): void {
    if (this.project) {
      this.loadProjectData(this.project);
    }

    this.translateService.onLangChange.subscribe(() => {
      this.loadTranslations();
    });

    this.loadTranslations();
  }

  types: { label: string, value: string }[] = [];

  private loadTranslations(): void {
    this.translateService.get(['Ended', 'Offered']).subscribe((translations: any) => {
      this.types = [
        { label: translations['Ended'], value: 'ended' },
        { label: translations['Offered'], value: 'offered' },
      ];
    });
  }


  form = new FormGroup({
    projectName: new FormControl(''),
    projectDescription: new FormControl(''),
    projectStartDate: new FormControl<Date>(new Date()),
    projectTotalFlatSpace: new FormControl<number>(0),
    projectEndDate: new FormControl<Date>(new Date()),
    projectOfferedPrice: new FormControl<number>(0),
    projectType: new FormControl(''),
  });

  private loadProjectData(project: ProjectPayload): void {
    this.form.patchValue({
      projectName: project.name,
      projectDescription: project.description,
      projectStartDate: project.startDate,
      projectEndDate: project.endDate,
      projectOfferedPrice: project.offeredPrice,
      projectType: project.type,
      projectTotalFlatSpace: project.flatSpace,
    });
  }



  onSubmit(): void {

    if (!this.form.valid) {
      return;
    }


    const updatedProject: ProjectPayload = {
      ...this.project,
      name: this.form.get('projectName')?.value as string,
      description: this.form.get('projectDescription')?.value as string,
      startDate: this.form.get('projectStartDate')?.value as Date,
      endDate: this.form.get('projectEndDate')?.value as Date,
      offeredPrice: this.form.get('projectOfferedPrice')?.value as number,
      type: this.form.get('projectType')?.value as string,
      flatSpace: this.form.get('projectTotalFlatSpace')?.value as number,
      images: this.project.images,
    };

    this.projectUpdated.emit(updatedProject);
  }

  clearForm(): void {
    this.form.reset();
  }
}
