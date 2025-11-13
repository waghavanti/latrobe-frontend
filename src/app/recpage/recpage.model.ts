export interface GeneratorData {
  id: string;
  Waste_Type: string;
  userId: string;       // Ensure userId is part of the structure
  Description?: string; // Optional
  Address?: string;     // Optional
  Transportation?: string; // Optional (you’re already using this in tooltips)
  requestStatus?: string;  // ✅ Added for Pending / Accepted / Rejected status
}
