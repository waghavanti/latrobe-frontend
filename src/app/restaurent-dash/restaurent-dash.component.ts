import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../shared/api.service';

@Component({
  selector: 'app-restaurent-dash',
  templateUrl: './restaurent-dash.component.html',
  styleUrls: ['./restaurent-dash.component.css']
})
export class RestaurentDashComponent implements OnInit {

  formValue!: FormGroup;
  allRestaurentData: any[] = [];
  searchText: string = '';

  constructor(
    private fb: FormBuilder,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.formValue = this.fb.group({
      Waste_Type: ['', Validators.required],
      Description: [''],
      Transportation: [''],
      Address: ['', Validators.required]
    });

    this.loadWastes();
  }

  // ================= LOAD GENERATOR WASTES =================
  loadWastes() {
    const generatorId = localStorage.getItem('userId');
    if (!generatorId) return;

    this.api.getWastesByGenerator(generatorId).subscribe({
      next: (data) => {
        this.allRestaurentData = data;
      },
      error: (err) => {
        console.error('Failed to load wastes', err);
      }
    });
  }

  // ================= ADD WASTE =================
  addRestaurent() {
    if (this.formValue.invalid) {
      alert('Please fill required fields');
      return;
    }

    const generatorId = localStorage.getItem('userId');
    if (!generatorId) {
      alert('Generator not logged in');
      return;
    }

    // ✅ BACKEND-READY PAYLOAD
    const payload = {
      wasteType: this.formValue.value.Waste_Type,
      quantity: 10,
      location: this.formValue.value.Address,
      generatorId: generatorId
    };

    console.log('🚀 Final payload:', payload);

    this.api.addWaste(payload).subscribe({
      next: () => {
        alert('Waste Added Successfully');
        this.formValue.reset();
        this.loadWastes();
      },
      error: (err) => {
        console.error('❌ Add waste error:', err.error);
        alert('Waste Addition Failed');
      }
    });
  }

  // ================= FILTER =================
  get filteredWasteList(): any[] {
    if (!this.searchText) return this.allRestaurentData;

    return this.allRestaurentData.filter(item =>
      item.wasteType?.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
}
