import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralKnowledgeBoardComponent } from './general-knowledge-board.component';

describe('GeneralKnowledgeBoardComponent', () => {
  let component: GeneralKnowledgeBoardComponent;
  let fixture: ComponentFixture<GeneralKnowledgeBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralKnowledgeBoardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralKnowledgeBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
