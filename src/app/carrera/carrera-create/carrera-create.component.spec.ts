/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CarreraCreateComponent } from './carrera-create.component';
import {ToastrModule} from "ngx-toastr";
import {HttpClientModule} from "@angular/common/http";
import {ReactiveFormsModule} from "@angular/forms";
import {CarreraService} from "../carrera.service";
import {RouterTestingModule} from "@angular/router/testing";
import {HeaderComponent} from "../../app-header/header/header.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

describe('CarreraCreateComponent', () => {
  let component: CarreraCreateComponent;
  let fixture: ComponentFixture<CarreraCreateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ToastrModule.forRoot(),
        HttpClientModule,
        ReactiveFormsModule,
        RouterTestingModule,
        BrowserAnimationsModule,
      ],
      declarations: [CarreraCreateComponent, HeaderComponent],
      providers: [CarreraService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarreraCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
