import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearHistoryModalComponent } from './clear-history-modal.component';

describe('ClearHistoryModalComponent', () => {
  let component: ClearHistoryModalComponent;
  let fixture: ComponentFixture<ClearHistoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClearHistoryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClearHistoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
