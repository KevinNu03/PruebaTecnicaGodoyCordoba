import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateUsuarioComponent } from './update-usuario.component';

describe('UpdateUsuarioComponent', () => {
  let component: UpdateUsuarioComponent;
  let fixture: ComponentFixture<UpdateUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateUsuarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
