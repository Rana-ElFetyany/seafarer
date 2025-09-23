import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeafarerModalComponent } from './seafarer-modal.component';

describe('SeafarerModalComponent', () => {
  let component: SeafarerModalComponent;
  let fixture: ComponentFixture<SeafarerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeafarerModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeafarerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
