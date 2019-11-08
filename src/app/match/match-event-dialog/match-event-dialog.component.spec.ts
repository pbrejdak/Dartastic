import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchEventDialogComponent } from './match-event-dialog.component';

describe('MatchEventDialogComponent', () => {
  let component: MatchEventDialogComponent;
  let fixture: ComponentFixture<MatchEventDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchEventDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchEventDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
