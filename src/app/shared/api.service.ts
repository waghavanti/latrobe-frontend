import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // ✅ SINGLE SOURCE OF BACKEND URL
  private baseUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  // ================= WASTE APIs =================

  // ✅ DO NOT MODIFY PAYLOAD HERE
  addWaste(payload: any): Observable<any> {
    console.log('📡 API sending payload:', payload);
    return this.http.post(`${this.baseUrl}/waste/add`, payload);
  }

  getAllWastes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/waste`);
  }

  getWastesByGenerator(generatorId: string) {
    return this.http.get<any[]>(
      `${this.baseUrl}/waste/generator/${generatorId}`
    );
  }

  acceptWaste(wasteId: string, recyclerId: string): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/waste/accept/${wasteId}`,
      { recyclerId }
    );
  }

  rejectWaste(wasteId: string): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/waste/reject/${wasteId}`,
      {}
    );
  }

  // ================= AUTH APIs =================

  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/login`, data);
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/register`, data);
  }

  // ================= REQUEST APIs =================

  // 🔹 SEND REQUEST
  sendRequest(payload: any) {
    return this.http.post(
      `${this.baseUrl}/requests/send`,
      payload
    );
  }

  // 🔹 GET REQUESTS FOR GENERATOR
  getRequestsForGenerator(generatorId: string) {
    return this.http.get<any[]>(
      `${this.baseUrl}/requests/generator/${generatorId}`
    );
  }

  // 🔹 ACCEPT REQUEST
  acceptRequest(requestId: string) {
    return this.http.put(
      `${this.baseUrl}/requests/accept/${requestId}`,
      {}
    );
  }

  // 🔹 GET REQUESTS FOR RECYCLER
  getRequestsByRecycler(recyclerId: string) {
    return this.http.get<any[]>(
      `${this.baseUrl}/requests/recycler/${recyclerId}`
    );
  }

  // ================= WASTE =================

  markWasteAccepted(wasteId: string) {
    return this.http.put(
      `${this.baseUrl}/waste/accept/${wasteId}`,
      {}   // backend already knows what to do
    );
  }

  // ================= TEMP STUBS (KEEP AS IS) =================

  getRecyclerById(_: string) {
    return of({});
  }

  updateRequestStatus(_: string, __: string) {
    return of({});
  }
}
