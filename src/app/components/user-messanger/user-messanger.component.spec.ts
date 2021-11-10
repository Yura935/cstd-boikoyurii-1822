import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMessangerComponent } from './user-messanger.component';

describe('UserMessangerComponent', () => {
  let component: UserMessangerComponent;
  let fixture: ComponentFixture<UserMessangerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserMessangerComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMessangerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
