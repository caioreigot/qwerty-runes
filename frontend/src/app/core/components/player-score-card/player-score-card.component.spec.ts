import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerScoreCardComponent } from './player-score-card.component';

describe('PlayerScoreCardComponent', () => {
  let component: PlayerScoreCardComponent;
  let fixture: ComponentFixture<PlayerScoreCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerScoreCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerScoreCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
