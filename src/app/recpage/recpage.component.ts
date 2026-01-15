import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/api.service';
import { Router } from '@angular/router';

type ReqStatus = 'pending' | 'accepted' | 'rejected';

@Component({
  selector: 'app-recpage',
  templateUrl: './recpage.component.html',
  styleUrls: ['./recpage.component.css']
})
export class RecpageComponent implements OnInit {

  wastes: any[] = [];
  filteredWastes: any[] = [];
  searchText = '';

  myRequests: Record<string, ReqStatus> = {};

  selectedWasteId: string | null = null;

  quantity = 1;
  address = '';
  transportation = 'Yes';

  tooltips: { [key: string]: string } = {};

  constructor(
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const role = localStorage.getItem('role');

    if (role !== 'recycler') {
      alert('Access denied. Recycler only.');
      this.router.navigate(['/reclogin']);
      return;
    }

    this.loadWastes();
    this.loadMyRequests();
  }

  loadWastes(): void {
    this.api.getAllWastes().subscribe({
      next: (res: any[]) => {
        this.wastes = res;
        this.filteredWastes = res;
      }
    });
  }

  loadMyRequests(): void {
    const recyclerId = localStorage.getItem('userId');
    if (!recyclerId) return;

    this.api.getRequestsByRecycler(recyclerId).subscribe({
      next: (requests: any[]) => {
        this.myRequests = {};
        requests.forEach(req => {
          const wasteId =
            typeof req.wasteId === 'string'
              ? req.wasteId
              : req.wasteId._id;

          this.myRequests[wasteId] = req.status;
        });
      }
    });
  }

  filterWastes(): void {
    const s = this.searchText.toLowerCase();
    this.filteredWastes = this.wastes.filter(w =>
      w.wasteType?.toLowerCase().includes(s) ||
      w.location?.toLowerCase().includes(s)
    );
  }

  openRequestForm(wasteId: string): void {
    this.selectedWasteId =
      this.selectedWasteId === wasteId ? null : wasteId;
  }

  submitRequest(): void {
    const recyclerId = localStorage.getItem('userId');
    if (!recyclerId || !this.selectedWasteId) return;

    const waste = this.wastes.find(w => w._id === this.selectedWasteId);
    if (!waste) return;

    const payload = {
      wasteId: this.selectedWasteId,
      generatorId: waste.generatorId,
      recyclerId,
      quantity: this.quantity,
      address: this.address,
      transportation: this.transportation
    };

    this.api.sendRequest(payload).subscribe({
      next: () => {
        this.myRequests[this.selectedWasteId!] = 'pending';
        this.selectedWasteId = null;
        this.quantity = 1;
        this.address = '';
        this.transportation = 'Yes';
      },
      error: err => alert(err.error?.message || 'Request failed')
    });
  }

  getRequestStatus(wasteId: string): ReqStatus | null {
    return this.myRequests[wasteId] ?? null;
  }

  loadTooltip(waste: any): void {
    this.tooltips[waste._id] =
      `Generator Name: ${waste.generatorName || 'Generator'}\n` +
      `Contact: ${waste.generatorContact || 'NA'}\n` +
      `Email: ${waste.generatorEmail || 'NA'}`;
  }
}
