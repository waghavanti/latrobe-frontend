import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/api.service';
import { GeneratorData } from './recpage.model'; // ✅ Import the interface

 



@Component({
  selector: 'app-recpage',
  templateUrl: './recpage.component.html',
  styleUrls: ['./recpage.component.css']
})
export class RecpageComponent implements OnInit {



  apiUrl = 'http://localhost:3000'; // Adjust API URL
 
  selectedWasteId: string | null = null; // Track selected waste item
  selectedUserId: string | null = null; // Track selected user's ID

  transportation: string = 'Yes';
  address: string = '';
  quantity: number = 1;
  

  
  allGeneratorData: GeneratorData[] = []; // Store all waste data

  tooltips: { [key: string]: string } = {}; // Store tooltips per ID

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    
  
   
    this.fetchAllGeneratorData();
    console.log(" Full API Response:", this.allGeneratorData);
    
  }

  // Fetch all waste data from generators
  fetchAllGeneratorData(): void {
    this.api.getAllGenerators().subscribe(
      (res) => {
        console.log("🛠 API Response:", res);
        this.allGeneratorData = res.map(post => ({
          ...post, 
          userId: post.userId // Ensure userId is included
        }));
      },
      (err) => {
        console.error(" Error fetching generator data:", err);
      }
    );
  }
  
  


  /*loadTooltip(data: any): void {
    if (this.tooltips[data.id]) return; // Avoid duplicate API calls

    this.api.getPosts().subscribe(posts => {
      const matchedPost = posts.find(post => post.id === data.id);
      if (!matchedPost) {
        this.tooltips[data.id] = 'Generator not found';
        return; 
      }

      const userId = matchedPost.userId;
      this.api.getUsers().subscribe(users => {
        const matchedUser = users.find(user => user.id === userId);
        if (!matchedUser) {
          this.tooltips[data.id] = 'User details not found';
          return;
        }

        this.tooltips[data.id] = `Name: ${matchedUser.name} \nContact: ${matchedUser.mobile}`;
      });
    });
  }*/


    loadTooltip(data: any): void {
  if (this.tooltips[data.id]) return; // Avoid duplicate API calls

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

      // Proper format for separate lines
      this.tooltips[data.id] = 
      `Name: ${matchedUser.name}\n` +
      `Contact: ${matchedUser.mobile}\n`+ 
        `Transportation: ${transportationStatus}\n`;
    });
  });
}

    

  /*sendRequest(wasteId: string) {
    const foundItem = this.allGeneratorData.find(item => item.id === wasteId);
    const recyclerId = localStorage.getItem('recyclerId');
    const recyclerName = localStorage.getItem('recyclerName'); // Get name from localStorage
  
    if (!recyclerId || !recyclerName) {
      console.error(" Recycler details not found! Make sure the user is logged in.");
      return;
    }
  
    if (foundItem?.userId) {
      this.api.sendRequest(wasteId, foundItem.userId, recyclerId, recyclerName);
    } else {
      console.error("User ID not found for waste ID:", wasteId);
    }
  }
  
  
  */



  // Function to toggle request form visibility
openRequestForm(wasteId: string, userId: string) {
  if (this.selectedWasteId === wasteId) {
    this.selectedWasteId = null; // Close form if clicked again
    this.selectedUserId = null;
  } else {
    this.selectedWasteId = wasteId;
    this.selectedUserId = userId;
  }
}

// Function to submit the request
submitRequest() {
  if (!this.selectedWasteId || !this.selectedUserId) {
    console.error("Missing Waste ID or User ID!");
    return;
  }

  const recyclerId = localStorage.getItem('recyclerId');
  const recyclerName = localStorage.getItem('recyclerName');

  if (!recyclerId || !recyclerName) {
    console.error(" Recycler details not found! Make sure the user is logged in.");
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
    (response) => {
      console.log(" Request Sent Successfully!", response);
      alert("Request submitted successfully!");
      this.resetForm();
    },
    (error) => {
      console.error(" Error Submitting Request:", error);
      alert("Failed to submit request.");
    }
  );
}

// Reset Form After Submission
resetForm() {
  this.selectedWasteId = null;
  this.selectedUserId = null;
  this.transportation = 'Yes';
  this.address = '';
  this.quantity = 1;
}



}

   
  


  
  


 
  
  
  
  
  
  
  
    
  
  
  
  
  
  


  

