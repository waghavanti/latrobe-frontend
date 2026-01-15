import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/api.service';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';

type ReqStatus = 'pending' | 'accepted' | 'rejected';

interface RequestRow {
  id: string;
  wasteId: any;
  generatorId: string;
  recyclerId: string;
  recyclerName?: string;
  status: ReqStatus;

  transportation?: string;
  address?: string;
  quantity?: number;
}

@Component({
  selector: 'app-genprofile',
  templateUrl: './genprofile.component.html',
  styleUrls: ['./genprofile.component.css']
})
export class GenprofileComponent implements OnInit {

  // ================= PROFILE INFO =================
  logged = '';
  eeemail = '';
  phoneno = '';

  // ================= AUTH =================
  userId!: string;

  // ================= DATA =================
  requests: RequestRow[] = [];
  loading = false;

  tooltips: { [key: string]: string } = {};

  constructor(
    private api: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const role = localStorage.getItem('role');
    if (role !== 'generator') {
      alert('Unauthorized access');
      this.router.navigate(['/genlogin']);
      return;
    }

    // ✅ ALWAYS read logged-in generator info
    this.logged  = localStorage.getItem('name')   ?? 'Generator';
    this.eeemail = localStorage.getItem('email')  ?? '';
    this.phoneno = localStorage.getItem('contact') ?? '';

    const uid = this.authService.getUserId();
    if (!uid) {
      alert('Session expired');
      this.logout();
      return;
    }

    this.userId = uid;
    this.loadRequests();
  }

  // ================= LOAD REQUESTS =================
  loadRequests(): void {
    this.loading = true;

    this.api.getRequestsForGenerator(this.userId).subscribe({
      next: (rows: any[]) => {
        this.requests = rows.map(r => ({
          id: r._id,
          wasteId: typeof r.wasteId === 'string' ? r.wasteId : r.wasteId?._id,
          generatorId: r.generatorId,
          recyclerId: r.recyclerId,
          recyclerName: r.recyclerId?.name || 'Recycler',
          status: r.status as ReqStatus,
          transportation: r.transportation,
          address: r.address,
          quantity: r.quantity
        }));

        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  // ================= ACCEPT REQUEST =================
  accept(r: RequestRow): void {
    if (r.status !== 'pending') return;

    this.api.acceptRequest(r.id).subscribe({
      next: () => {
        r.status = 'accepted';

        // Reject others of same waste
        this.requests.forEach(req => {
          if (req.wasteId === r.wasteId && req.id !== r.id) {
            req.status = 'rejected';
          }
        });
      }
    });
  }

  // ================= REJECT REQUEST =================
  reject(r: RequestRow): void {
    if (r.status !== 'pending') return;

    this.api.updateRequestStatus(r.id, 'rejected').subscribe({
      next: () => {
        r.status = 'rejected';
      }
    });
  }

  // ================= TOOLTIP =================
  loadTTooltip(request: RequestRow): void {
    this.tooltips[request.wasteId] = `
Recycler ID: ${request.recyclerId}
Transportation: ${request.transportation ?? '—'}
Address: ${request.address ?? '—'}
Quantity: ${request.quantity ?? '—'}
`;
  }

  // ================= LOGOUT =================
  logout(): void {
    localStorage.clear();
    this.router.navigate(['/genlogin']);
  }
}
