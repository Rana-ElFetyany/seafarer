import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeafarersListComponent } from './seafarers-list.component';

describe('SeafarersListComponent', () => {
  let component: SeafarersListComponent;
  let fixture: ComponentFixture<SeafarersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeafarersListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeafarersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
