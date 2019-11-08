import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchConfiguratorComponent } from './match-configurator.component';

describe('MatchConfiguratorComponent', () => {
  let component: MatchConfiguratorComponent;
  let fixture: ComponentFixture<MatchConfiguratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchConfiguratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchConfiguratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
