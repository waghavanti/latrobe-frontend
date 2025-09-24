import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiService } from '../shared/api.service';
import { RestaurentData } from './restaurent.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-restaurent-dash',
  templateUrl: './restaurent-dash.component.html',
  styleUrls: ['./restaurent-dash.component.css'],
})
export class RestaurentDashComponent implements OnInit {
  formValue!: FormGroup;
  restaurentModelObj: RestaurentData = new RestaurentData();
  allRestaurentData: any = [];  // Ensure this is initialized as an array
  showAdd!: boolean;
  showBtn!: boolean;
  isEditMode: boolean = false;  // Flag for edit mode
  userId: string = '';  // Variable to store userId

  logged: string | null = '';

  constructor(
    private formbuilder: FormBuilder,
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formValue = this.formbuilder.group({
      Waste_Type: [''],
      Description: [''],
      Transportation: [''],
      Address: ['']
    });

    this.logged = localStorage.getItem('loggeduser') || 'Guest';
    // Get the userId from localStorage (or your authentication service)
    this.userId = localStorage.getItem('userId') || '';  // Assuming user ID is stored in localStorage

    // If userId is not found, redirect to login page
    if (!this.userId) {
      this.router.navigate(['/genlogin']);
    }

    this.getRestaurentDataForUser();
  }

  logout(): void {
    localStorage.removeItem('loggeduser');
    localStorage.removeItem('userId');
    window.location.href = '/genlogin'; // Redirect to login page
  }

  // Fetch restaurant data for the logged-in user
  getRestaurentDataForUser() {
    this.api.getRestaurentByUserId(this.userId).subscribe(
      (res) => {
        console.log("Fetched Wastes:", res);  // Debugging
        this.allRestaurentData = res;
      },
      (err) => {
        console.log("Fetch Error:", err);
      }
    );
  }

  getTransportationStatus(wasteId: string): string {
    const wasteItem = this.allRestaurentData.find((waste: any) => waste.id === wasteId);
    return wasteItem ? wasteItem.Transportation : "Unknown"; 
  }
  
 

  clickAddResto() {
    this.formValue.reset();
    this.isEditMode = false;
    this.showAdd = true;
    this.showBtn = true;
  }

  addRestaurent() {
    if (this.formValue.invalid) {
      alert("Please fill all required fields!");
      return;
    }
    
    this.restaurentModelObj = {
      ...this.formValue.value,
      userId: this.userId,  // Attach userId
    };
  
    this.api.postRestaurent(this.restaurentModelObj).subscribe(
      (res) => {
        alert("Waste Added Successfully");
        this.formValue.reset();
        document.getElementById("close")?.click();
        this.getRestaurentDataForUser();
      },
      (err) => {
        console.log(err);
        alert("Waste Addition Failed!");
      }
    );
  } 

  

  deleteResto(data: any) {
    if (!data.id) {
      alert("Error: No Waste ID found for deletion.");
      return;
    }
  
    if (confirm('Are you sure you want to delete this Waste?')) {
      this.api.deleteRestaurant(data.id).subscribe(
        (res) => {
          alert('Waste Deleted Successfully');
          this.getRestaurentDataForUser();  // Refresh the data after deletion
        },
        (err) => {
          console.log("Delete Error:", err);
          alert('Failed to delete Waste!');
        }
      );
    }
  }
  
  onEditResto(data: any) {
    this.isEditMode = true;
    this.showAdd = false;
    this.showBtn = true;
  
    // Ensure the correct ID is set before updating
    this.restaurentModelObj.id = data.id;  
    this.formValue.controls['Waste_Type'].setValue(data.Waste_Type);
    this.formValue.controls['Description'].setValue(data.Description);
    this.formValue.controls['Transportation'].setValue(data.Transportation);
    this.formValue.controls['Address'].setValue(data.Address);
  }
  

  updateResto() {
    if (!this.restaurentModelObj.id) {
      alert("Error: No Waste selected for update.");
      return;
    }
  
    const updatedData = {
      Waste_Type: this.formValue.value.Waste_Type,
      Description: this.formValue.value.Description,
      Transportation: this.formValue.value.Transportation,
      Address: this.formValue.value.Address,
      userId: this.userId,  // Ensure the userId is passed as well
    };
  
    this.api.updateRestaurant(this.restaurentModelObj.id, updatedData).subscribe(
      (res) => {
        alert('Waste Updated Successfully');
        document.getElementById('close')?.click();
        this.getRestaurentDataForUser();  // Reload data after update
      },
      (err) => {
        console.log(err);
        alert('Waste Update Failed!');
      }
    );
  }

  
}
