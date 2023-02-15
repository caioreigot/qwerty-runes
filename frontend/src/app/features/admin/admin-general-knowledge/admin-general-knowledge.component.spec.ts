import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGeneralKnowledgeComponent } from './admin-general-knowledge.component';

describe('AdminGeneralKnowledgeComponent', () => {
  let component: AdminGeneralKnowledgeComponent;
  let fixture: ComponentFixture<AdminGeneralKnowledgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminGeneralKnowledgeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminGeneralKnowledgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
