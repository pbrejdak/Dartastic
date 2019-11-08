import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaguePlayComponent } from './league-play.component';

describe('LeaguePlayComponent', () => {
  let component: LeaguePlayComponent;
  let fixture: ComponentFixture<LeaguePlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaguePlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaguePlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
