import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

import { RestaurentData } from '../restaurent-dash/restaurent.model';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://localhost:3000'; // JSON Server base URL

  constructor(private _http: HttpClient, private authService: AuthService) {}

  // -------------------- POSTS (generator wastes) --------------------

  postRestaurent(data: any) {
    return this._http.post<any>(`${this.apiUrl}/posts`, data).pipe(map(res => res));
  }

  getRestaurent() {
    return this._http.get<any>(`${this.apiUrl}/posts`).pipe(map(res => res));
  }

  getRestaurentByUserId(userId: string) {
    return this._http.get<any>(`${this.apiUrl}/posts?userId=${userId}`).pipe(map(res => res));
  }

  deleteRestaurant(id: string) {
    return this._http.delete<any>(`${this.apiUrl}/posts/${id}`).pipe(
      map(res => res),
      catchError((error: any) => {
        console.error('Delete failed', error);
        throw error;
      })
    );
  }

  updateRestaurant(id: number, data: any) {
    return this._http.put<any>(`${this.apiUrl}/posts/${id}`, data).pipe(map(res => res));
  }

  // -------------------- Lists for recycler page --------------------

  getAllGenerators() {
    return this._http.get<any[]>(`${this.apiUrl}/posts`);
  }

  getPosts(): Observable<any[]> {
    return this._http.get<any[]>(`${this.apiUrl}/posts`);
  }

  // Users (generators)
  getUsers(): Observable<any[]> {
    return this._http.get<any[]>(`${this.apiUrl}/gsignup`);
  }

  // Recycler profile by id
  getRecyclerById(recyclerId: string) {
    return this._http.get<any>(`${this.apiUrl}/rsignup/${recyclerId}`);
  }

  // -------------------- Requests (recycler <-> generator) --------------------

  /**
   * Create a new request from recycler to generator for a waste.
   * JSON shape is friendly for both generator and recycler queries.
   */
  sendRequest(
    wasteId: string,
    userId: string,      // generatorId
    recyclerId: string,
    recyclerName: string,
    transportation: string,
    address: string,
    quantity: number
  ): Observable<any> {
    const requestData = {
      id: this.generateUniqueId(),
      wasteId,
      generatorId: userId,      // for generator view: /requests?generatorId=...
      recyclerId,               // for recycler view:  /requests?recyclerId=...
      recyclerName,
      recycler_info: {
        recyclerId,             // keep your existing nested object as-is
        transportation,
        address,
        quantity
      },
      status: 'Pending',        // match UI: 'Pending' | 'Accepted' | 'Rejected'
      createdAt: new Date().toISOString()
    };

    return this._http.post(`${this.apiUrl}/requests`, requestData);
  }

  // Generator view: all requests received by this generator
  getRequestsForGenerator(generatorId: string): Observable<any[]> {
    return this._http.get<any[]>(`${this.apiUrl}/requests?generatorId=${generatorId}`);
  }

  // Recycler view: all requests sent by this recycler (for status on recpage)
  getRequestsByRecycler(recyclerId: string): Observable<any[]> {
    return this._http.get<any[]>(`${this.apiUrl}/requests?recyclerId=${recyclerId}`);
  }

  // Update request status (Generator clicks Accept/Reject)
  updateRequestStatus(
    requestId: string,
    status: 'Pending' | 'Accepted' | 'Rejected'
  ): Observable<any> {
    return this._http.patch<any>(`${this.apiUrl}/requests/${requestId}`, { status });
  }

  // -------------------- Utils --------------------

  private generateUniqueId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
