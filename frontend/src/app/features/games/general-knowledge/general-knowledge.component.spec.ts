import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralKnowledgeComponent } from './general-knowledge.component';

describe('GeneralKnowledgeComponent', () => {
  let component: GeneralKnowledgeComponent;
  let fixture: ComponentFixture<GeneralKnowledgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralKnowledgeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralKnowledgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
