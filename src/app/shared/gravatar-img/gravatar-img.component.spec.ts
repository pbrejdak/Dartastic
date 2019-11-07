import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GravatarImgComponent } from './gravatar-img.component';

describe('GravatarImgComponent', () => {
  let component: GravatarImgComponent;
  let fixture: ComponentFixture<GravatarImgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GravatarImgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GravatarImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
