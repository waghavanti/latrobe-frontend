import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/api.service';
import { GeneratorData } from './recpage.model';

type ReqStatus = 'Pending' | 'Accepted' | 'Rejected';

@Component({
  selector: 'app-recpage',
  templateUrl: './recpage.component.html',
  styleUrls: ['./recpage.component.css']
})
export class RecpageComponent implements OnInit {

  apiUrl = 'http://localhost:3000';
  selectedWasteId: string | null = null;
  selectedUserId: string | null = null;

  transportation: string = 'Yes';
  address: string = '';
  quantity: number = 1;

  // Data
  allGeneratorData: (GeneratorData & { requestStatus?: ReqStatus | null })[] = [];
  filteredGeneratorData: (GeneratorData & { requestStatus?: ReqStatus | null })[] = [];

  // Search/filter
  searchText: string = '';
  selectedType: string = '';

  // Tooltip
  tooltips: { [key: string]: string } = {};

  // NEW: who is the logged-in recycler (to pull their requests)
  recyclerId: string = localStorage.getItem('recyclerId') || '';

  // NEW: map of wasteId -> {id, status}
  private requestStatusMap: Record<string, { id: string; status: ReqStatus }> = {};

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.fetchAllGeneratorData();
  }

  // Load wastes, then load statuses for this recycler and project them onto rows
  fetchAllGeneratorData(): void {
    this.api.getAllGenerators().subscribe(
      (res) => {
        this.allGeneratorData = res.map(post => ({
          ...post,
          userId: post.userId,
          requestStatus: null   // default shown as '-'
        }));
        this.filteredGeneratorData = [...this.allGeneratorData];

        // ⬇️ after wastes load, fetch request statuses for this recycler
        this.loadRequestStatuses();
      },
      (err) => {
        console.error("❌ Error fetching generator data:", err);
      }
    );
  }

  // NEW: pull /requests for this recycler and map wasteId -> status
  private loadRequestStatuses(): void {
    if (!this.recyclerId) return;

    this.api.getRequestsByRecycler(this.recyclerId).subscribe((reqs) => {
      this.requestStatusMap = {};
      reqs.forEach(r => {
        // Normalize status casing in case of "pending"
        const s = (r.status || 'Pending').toString();
        const status = (s[0].toUpperCase() + s.slice(1).toLowerCase()) as ReqStatus;
        this.requestStatusMap[r.wasteId] = { id: r.id, status };
      });

      // Project onto table rows
      this.allGeneratorData = this.allGeneratorData.map(row => ({
        ...row,
        requestStatus: this.requestStatusMap[row.id]?.status ?? null
      }));

      this.filterWastes(); // refresh filtered view
    });
  }

  // Search filter
  filterWastes(): void {
    const search = this.searchText.toLowerCase();
    const type = this.selectedType.toLowerCase();

    this.filteredGeneratorData = this.allGeneratorData.filter(item => {
      const wasteType = item.Waste_Type?.toLowerCase() || '';
      const description = item.Description?.toLowerCase() || '';
      const address = item.Address?.toLowerCase() || '';

      const matchesSearch =
        wasteType.includes(search) ||
        description.includes(search) ||
        address.includes(search);

      const matchesType = type ? wasteType === type : true;

      return matchesSearch && matchesType;
    });
  }

  // Tooltip
  loadTooltip(data: any): void {
    if (this.tooltips[data.id]) return;

    this.api.getPosts().subscribe(posts => {
      const matchedPost = posts.find(post => post.id === data.id);
      if (!matchedPost) {
        this.tooltips[data.id] = 'Generator not found';
        return;
      }

      const transportationStatus = matchedPost.Transportation ? matchedPost.Transportation : "Unknown"; 
      const userId = matchedPost.userId;

      this.api.getUsers().subscribe(users => {
        const matchedUser = users.find(user => user.id === userId);
        if (!matchedUser) {
          this.tooltips[data.id] = `Transportation: ${transportationStatus}\n\nUser details not found`;
          return;
        }

        this.tooltips[data.id] =
          `Name: ${matchedUser.name}\n` +
          `Contact: ${matchedUser.mobile}\n` +
          `Transportation: ${transportationStatus}\n`;
      });
    });
  }

  // Request form toggle
  openRequestForm(wasteId: string, userId: string) {
    if (this.selectedWasteId === wasteId) {
      this.selectedWasteId = null;
      this.selectedUserId = null;
    } else {
      this.selectedWasteId = wasteId;
      this.selectedUserId = userId;
    }
  }

  // Send request -> set local Pending and also refresh from server
  submitRequest() {
    if (!this.selectedWasteId || !this.selectedUserId) {
      console.error("Missing Waste ID or User ID!");
      return;
    }

    const recyclerId = localStorage.getItem('recyclerId');
    const recyclerName = localStorage.getItem('recyclerName');

    if (!recyclerId || !recyclerName) {
      console.error("Recycler details not found! Make sure the user is logged in.");
      return;
    }

    this.api.sendRequest(
      this.selectedWasteId,
      this.selectedUserId,
      recyclerId,
      recyclerName,
      this.transportation,
      this.address,
      this.quantity
    ).subscribe(
      () => {
        alert("✅ Request submitted successfully!");

        // set local row to Pending immediately
        const row = this.allGeneratorData.find(w => w.id === this.selectedWasteId);
        if (row) row.requestStatus = 'Pending';
        this.filterWastes();

        // refresh from server to keep in sync
        this.loadRequestStatuses();
        this.resetForm();
      },
      (error) => {
        alert("❌ Failed to submit request.");
        console.error(error);
      }
    );
  }

  resetForm() {
    this.selectedWasteId = null;
    this.selectedUserId = null;
    this.transportation = 'Yes';
    this.address = '';
    this.quantity = 1;
    this.searchText = '';
    this.filterWastes();
  }
}
