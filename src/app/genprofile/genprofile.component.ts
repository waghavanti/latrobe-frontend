import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/api.service';
import { AuthService } from '../shared/auth.service';

type ReqStatus = 'Pending' | 'Accepted' | 'Rejected';

interface RequestRow {
  id: string;              // request doc id (in /requests)
  wasteId: string;
  generatorId: string;
  recyclerId: string;
  recyclerName?: string;
  status: ReqStatus;
  // Optional extra data you already store:
  transportation?: string;
  address?: string;
  quantity?: number;
  recycler_info?: {
    recyclerId?: string;
    transportation?: string;
    address?: string;
    quantity?: number;
  };
}

@Component({
  selector: 'app-genprofile',
  templateUrl: './genprofile.component.html',
  styleUrls: ['./genprofile.component.css']
})
export class GenprofileComponent implements OnInit {
  logged: string | null = '';
  userId: string = '';
  eeemail: string = '';
  phoneno: string = '';

  requests: RequestRow[] = [];
  loading = false;

  tooltips: { [key: string]: string } = {};

  constructor(private api: ApiService, private authService: AuthService) {}

  ngOnInit(): void {
    // User details
    this.logged  = localStorage.getItem('loggeduser')  || 'Guest';
    this.eeemail = localStorage.getItem('loggedmail')  || 'Guest';
    this.phoneno = localStorage.getItem('loggedcont')  || 'Guest';

    // Logged-in generator id
    this.userId = this.authService.getUserId() || '';

    if (this.userId) {
      this.loadRequests();
    }
  }

  // Pull all requests addressed to this generator
  loadRequests(): void {
    this.loading = true;
    this.api.getRequestsForGenerator(this.userId).subscribe({
      next: (rows: any[]) => {
        // Normalize data + attach recycler names
        this.requests = rows.map(r => ({
          id: r.id,
          wasteId: r.wasteId,
          generatorId: r.generatorId,
          recyclerId: r.recyclerId,
          recyclerName: r.recyclerName,                 // may be filled below as well
          status: (r.status || 'Pending') as ReqStatus,
          transportation: r.transportation,
          address: r.address,
          quantity: r.quantity,
          recycler_info: r.recycler_info
        }));

        // fetch/display recycler names if missing
        this.requests.forEach(req => {
          if (!req.recyclerName && req.recyclerId) {
            this.api.getRecyclerById(req.recyclerId).subscribe(recycler => {
              req.recyclerName = recycler?.name || 'Recycler';
            });
          }
        });

        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  // Accept a pending request
  accept(r: RequestRow): void {
    if (r.status !== 'Pending') return;
    // Requires ApiService method:
    // updateRequestStatus(id: string, status: 'Pending'|'Accepted'|'Rejected')
    this.api.updateRequestStatus(r.id, 'Accepted').subscribe({
      next: () => { r.status = 'Accepted'; },
      error: () => { /* optionally show toast */ }
    });
  }

  // Reject a pending request
  reject(r: RequestRow): void {
    if (r.status !== 'Pending') return;
    this.api.updateRequestStatus(r.id, 'Rejected').subscribe({
      next: () => { r.status = 'Rejected'; },
      error: () => { /* optionally show toast */ }
    });
  }

  // Tooltip content for the info button
  loadTTooltip(request: RequestRow) {
    const info = request.recycler_info || {};
    this.tooltips[request.wasteId] = `
      Recycler Id: ${info.recyclerId ?? request.recyclerId ?? '—'}
      Transportation: ${info.transportation ?? '—'}
      Address: ${info.address ?? '—'}
      Quantity: ${info.quantity ?? '—'}
    `;
  }
}
