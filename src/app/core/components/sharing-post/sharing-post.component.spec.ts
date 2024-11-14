import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharingPostComponent } from './sharing-post.component';

describe('SharingPostComponent', () => {
  let component: SharingPostComponent;
  let fixture: ComponentFixture<SharingPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharingPostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharingPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
