import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

import { RestaurentData } from '../restaurent-dash/restaurent.model';

import { Observable, throwError } from 'rxjs';  //  Import Observable
import { map, catchError, switchMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

export class ApiService {

  private apiUrl = 'http://localhost:3000'; // Define the API URL


  constructor(private _http: HttpClient, private authService: AuthService) {}

  // POST request to add a restaurant
  postRestaurent(data: any) {
    return this._http.post<any>("http://localhost:3000/posts", data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // GET request to retrieve all restaurant data
  getRestaurent() {
    return this._http.get<any>("http://localhost:3000/posts").pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // GET request to retrieve restaurant data by user ID
  getRestaurentByUserId(userId: string) {
    return this._http.get<any>(`http://localhost:3000/posts?userId=${userId}`).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // DELETE request to delete a restaurant
  deleteRestaurant(id: string) {
    return this._http.delete<any>(`http://localhost:3000/posts/${id}`).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: any) => {
        console.error('Delete failed', error);
        throw error;
      })
    );
  }

  // PUT request to update a restaurant
  updateRestaurant(id: number, data: any) {
    return this._http.put<any>(`http://localhost:3000/posts/${id}`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }


  // Fetch all generator waste data
  getAllGenerators() {
    return this._http.get<any[]>(`http://localhost:3000/posts`);
  }
 
  
  getPosts(): Observable<any[]> {
    return this._http.get<any[]>(`${this.apiUrl}/posts`);
  }

  // Fetch all users from gsignup
  getUsers(): Observable<any[]> {
    return this._http.get<any[]>(`${this.apiUrl}/gsignup`);
  }
  
  

 
  sendRequest(
    wasteId: string,
    userId: string,
    recyclerId: string,
    recyclerName: string,
    transportation: string,
    address: string,
    quantity: number
  ): Observable<any> {
    const requestData = {
      id: this.generateUniqueId(), 
      wasteId,
      generatorId: userId,
      recyclerName,
      recycler_info: {
        recyclerId,
        transportation,
        address,
        quantity
      },
      status: "pending"
    };

    return this._http.post(`${this.apiUrl}/requests`, requestData);
  }

  private generateUniqueId(): string {
    return Math.random().toString(36).substr(2, 9); 
  }
  
  
  
  
  
  

  getRequestsForGenerator(generatorId: string): Observable<any[]> {
    return this._http.get<any[]>(`${this.apiUrl}/requests?generatorId=${generatorId}`);
  }
  
  
  getRecyclerById(recyclerId: string) {
    return this._http.get<any>(`${this.apiUrl}/rsignup/${recyclerId}`);
  }
  

  
}


