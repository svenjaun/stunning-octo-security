import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BackendService } from 'src/app/shared/services/backend.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  
  commandForm: FormGroup;
  output: string = '';
  isAdmin: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private backendService: BackendService
  ) {
  }

  ngOnInit() {
    
    this.backendService.getRole().subscribe((res) => {
      this.isAdmin = res['role'] === "Octo_Boss" || res['role'] === "Octo_Admin";
    })

    this.commandForm = this.formBuilder.group({
      command: ['', Validators.required]
    });
  }

  onSubmit() {
    // stop here if form is invalid
    if (this.commandForm.invalid) {
      alert("Invalid")
      return;
    }

    this.backendService.command(this.commandForm.controls.command.value).subscribe(res => {
      this.output = res['output'];
    }, 
    error => {
      this.output = "Invalid / malicious request";
    });
  }
}
