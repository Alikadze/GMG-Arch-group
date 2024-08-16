import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerCompaniesComponent } from './partner-companies.component';

describe('PartnerCompaniesComponent', () => {
  let component: PartnerCompaniesComponent;
  let fixture: ComponentFixture<PartnerCompaniesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartnerCompaniesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartnerCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
