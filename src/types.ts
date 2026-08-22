export type ActiveTab = 'home' | 'report' | 'my-reports' | 'contact' | 'authority-login' | 'authority-dashboard';

export type ReportStatus = 'REPORTED' | 'VERIFIED' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED';

export type IssueCategory = 
  | 'Roads & Potholes'
  | 'Electric Wires'
  | 'Garbage & Waste';

export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Emergency';

export interface TimelineEntry {
  id: string;
  status: ReportStatus;
  timestamp: string;
  note: string;
  actor: string;
}

export interface ComplaintReport {
  id: string; // e.g. SS-1048
  title: string;
  category: IssueCategory;
  description: string;
  location: string;
  ward?: string;
  coordinates?: { lat: number; lng: number };
  imageUrl?: string;
  citizenName?: string;
  citizenPhone?: string;
  citizenEmail?: string;
  createdAt: string;
  status: ReportStatus;
  priority: PriorityLevel;
  priorityScore: number; // dynamically computed score
  upvotes: number; // citizen upvote count
  reportCount: number; // number of citizens reporting this identical issue
  upvotedBy?: string[]; // tracks user identifiers to prevent duplicate upvoting
  department?: string;
  assignedOfficer?: string;
  timeline: TimelineEntry[];
}
