import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ResetPasswordService } from './reset-password.service';
import { LocalStorageService } from '../../local-storage.service';

@Component({
  selector: 'ngx-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  providers: [ResetPasswordService]
})
export class ResetPasswordComponent {

  form = new FormGroup({
    newpass: new FormControl('', [Validators.required]),
    compass: new FormControl('', [Validators.required, Validators.minLength(4)])
  })

  errorMessage: any;
  loading: boolean = false;

  constructor(
    private resetpasswordService: ResetPasswordService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) { }


  ngOnInit(): void {
    // this.form.get('newpass')?.valueChanges.subscribe(() => this.errorMessage = '');
    // this.form.get('compass')?.valueChanges.subscribe(() => this.errorMessage = '');
  }


  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {

      let data = {
        newpass: this.form.get('newpass')?.value,
        compass: this.form.get('compass')?.value
      }

      if(this.form.get('compass')?.value !== this.form.get('newpass')?.value) {
        this.errorMessage= 'Password does not match';
        return;
      }

      console.log("new:",data.newpass)
      console.log("confirm:",data.compass)

      this.errorMessage= false;

      const payload = {
        password : this.form.getRawValue().compass
      }

      console.log("backend:",payload)

      this.loading = true;

      this.resetpasswordService.changepassword(payload).subscribe({
        next: (response) => {
          // console.log(response)
          if (response.code === 200) {
            this.localStorageService.setToken(response.token);
            // this.router.navigate(['auth/login']);
            this.router.navigate(['student/registration-summary']);
          }
          else {
            Swal.fire('Warning', 'Something went wrong. Please try again later. testing', 'warning');
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