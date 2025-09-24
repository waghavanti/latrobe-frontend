import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/api.service';
import { AuthService } from '../shared/auth.service'; // Ensure this matches the actual path

@Component({
  selector: 'app-genprofile',
  templateUrl: './genprofile.component.html',
  styleUrls: ['./genprofile.component.css']
})
export class GenprofileComponent implements OnInit {
  logged: string | null = '';
  userId: string = ''; // Variable to store userId
  eeemail: string = '';
  requests: any[] = [];
  phoneno: string='';

  tooltips: { [key: string]: string } = {}; 


  constructor(private api: ApiService, private authService: AuthService) {}

  ngOnInit(): void {
    // User details from localStorage
    this.logged = localStorage.getItem('loggeduser') || 'Guest';
    this.eeemail = localStorage.getItem('loggedmail') || 'Guest';
    this.phoneno = localStorage.getItem("loggedcont")|| 'Guest';

    // Fetch generator ID (user ID) from AuthService
    this.userId = this.authService.getUserId() || ''; 

    if (this.userId) {
      this.api.getRequestsForGenerator(this.userId).subscribe((data: any[]) => {
        this.requests = data;

        // Fetch recycler names for each request
        this.requests.forEach(request => {
          this.api.getRecyclerById(request.recyclerId).subscribe(recycler => {
            request.recyclerName = recycler.name; // Attach recycler name
          });
        });
      });
    }
  }







  
loadTTooltip(request: any) {
  this.tooltips[request.wasteId] = `
    Recycler Id: ${request.recycler_info.recyclerId} 
    Transportation: ${request.recycler_info.transportation} 
    Address: ${request.recycler_info.address} 
    Quantity: ${request.recycler_info.quantity}

  `;
}

}
