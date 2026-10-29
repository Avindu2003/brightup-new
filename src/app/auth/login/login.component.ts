import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LocalStorageService } from '../../local-storage.service';


@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {

  form = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    // rememberMe: new FormControl(false)
  })

  errorMessage: string;
  loading: boolean = false;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit(): void {
    //throw new Error('Method not implemented.');
    this.form.get('username')?.valueChanges.subscribe(() => this.errorMessage = '');
    this.form.get('password')?.valueChanges.subscribe(() => this.errorMessage = '');
  }


  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {

      let data = {
        userName: this.form.get('username')?.value,
        password: this.form.get('password')?.value,
        // rememberMe: this.form.get('rememberMe')?.value
      }

      this.loading = true;

      // const { username, password } = this.form.value;
      this.loginService.login(data).subscribe({
        next: (response) => {
          if (response.code === 200) {
            // localStorage.setItem('LoginToken', response.token);
            this.localStorageService.setToken(response.token); 
            this.router.navigateByUrl('student/registration-summary');
          } else if (response.code === 401) {
            this.errorMessage = 'Username or password incorrect';
            this.loading = false;
            //reset password
          } else if (response.code === 202) {
            this.localStorageService.setToken(response.token); 
            this.router.navigateByUrl('auth/reset-password');
          }else {
            Swal.fire('Warning', 'Something went wrong. Please try again later.', 'warning');
            this.loading = false;
          }
        },
        error: () => {
          Swal.fire('Warning', 'Something went wrong. Please try again later.', 'warning');
          this.loading = false;

        }
      });
    }
  }
}
