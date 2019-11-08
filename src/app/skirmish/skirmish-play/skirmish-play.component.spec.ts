import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkirmishPlayComponent } from './skirmish-play.component';

describe('SkirmishPlayComponent', () => {
  let component: SkirmishPlayComponent;
  let fixture: ComponentFixture<SkirmishPlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkirmishPlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkirmishPlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
