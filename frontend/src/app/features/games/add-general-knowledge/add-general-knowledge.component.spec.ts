import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGeneralKnowledgeComponent } from './add-general-knowledge.component';

describe('AddGeneralKnowledgeComponent', () => {
  let component: AddGeneralKnowledgeComponent;
  let fixture: ComponentFixture<AddGeneralKnowledgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddGeneralKnowledgeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddGeneralKnowledgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
