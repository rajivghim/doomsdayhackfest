import { ComplaintReport, ReportStatus, IssueCategory, PriorityLevel, TimelineEntry } from '../types';

const STORAGE_KEY = 'sewasathi_complaints_v2';
const USER_VOTES_KEY = 'sewasathi_user_upvotes';

// Verified high quality demo online images categorized for problem types
export const CATEGORY_DEMO_IMAGES: Record<IssueCategory, string[]> = {
  'Roads & Potholes': [
    'https://res.cloudinary.com/mhjjvqth/image/upload/v1787388222/d03fc2fe363172d449e218a84b557508.jpg',
  ],
  'Electric Wires': [
    'https://res.cloudinary.com/mhjjvqth/image/upload/v1787388222/68c8bb926d16ad123be8a1b7dbc673cd.jpg',
  ],
  'Garbage & Waste': [
    'https://res.cloudinary.com/mhjjvqth/image/upload/v1787388222/7efe66bdfed3b6b37c49c442eef47cfe.jpg',
  ],
};

export const DEMO_PRESET_IMAGES: { category: IssueCategory; label: string; url: string; tag: string }[] = [
  {
    category: 'Roads & Potholes',
    label: 'Roads & Potholes',
    tag: 'Pothole Hazard',
    url: 'https://res.cloudinary.com/mhjjvqth/image/upload/v1787388222/d03fc2fe363172d449e218a84b557508.jpg',
  },
  {
    category: 'Electric Wires',
    label: 'Electric Wires',
    tag: 'Dangling Cables',
    url: 'https://res.cloudinary.com/mhjjvqth/image/upload/v1787388222/68c8bb926d16ad123be8a1b7dbc673cd.jpg',
  },
  {
    category: 'Garbage & Waste',
    label: 'Garbage & Waste',
    tag: 'Waste Obstruction',
    url: 'https://res.cloudinary.com/mhjjvqth/image/upload/v1787388222/7efe66bdfed3b6b37c49c442eef47cfe.jpg',
  },
];

export function getRandomCategoryDemoImage(category: IssueCategory): string {
  const images = CATEGORY_DEMO_IMAGES[category] || CATEGORY_DEMO_IMAGES['Roads & Potholes'];
  return images[Math.floor(Math.random() * images.length)];
}

/**
 * Civic Priority & Upvote Algorithm:
 * Determines the priority level based on:
 * - Duplicate report count (weight: 3.5 per citizen report)
 * - Upvote / community endorsement count (weight: 1.5 per upvote)
 * - Category safety severity (Electric wires get an extra hazard boost)
 */
export function calculatePriorityScore(
  reportCount: number = 1,
  upvotes: number = 0,
  category: IssueCategory = 'Roads & Potholes'
): { priority: PriorityLevel; score: number } {
  // Base category multiplier
  const categoryHazardMultiplier = category === 'Electric Wires' ? 1.4 : category === 'Roads & Potholes' ? 1.2 : 1.0;
  
  const rawScore = (reportCount * 3.5 + upvotes * 1.5) * categoryHazardMultiplier;
  const score = Math.round(rawScore * 10) / 10;

  let priority: PriorityLevel = 'Low';
  if (score >= 14 || reportCount >= 4 || (category === 'Electric Wires' && (reportCount >= 2 || upvotes >= 4))) {
    priority = 'Emergency';
  } else if (score >= 8 || reportCount >= 2 || upvotes >= 3) {
    priority = 'High';
  } else if (score >= 4 || upvotes >= 1) {
    priority = 'Medium';
  } else {
    priority = 'Low';
  }

  return { priority, score };
}

export const INITIAL_REPORTS: ComplaintReport[] = [
  {
    id: 'SS-1048',
    title: 'Severe Road Crater & Pothole Hazard on Main Crossroad',
    category: 'Roads & Potholes',
    description: 'Deep road potholes and fractured asphalt causing vehicular accidents and heavy traffic congestion during rush hours.',
    location: 'Kathmandu, Baluwatar Crossroad',
    ward: 'Ward 4',
    coordinates: { lat: 27.7245, lng: 85.3312 },
    imageUrl: 'https://res.cloudinary.com/mhjjvqth/image/upload/v1787388222/d03fc2fe363172d449e218a84b557508.jpg',
    citizenName: 'Aarav Sharma',
    citizenPhone: '+977 9841234567',
    citizenEmail: 'aarav@example.com',
    createdAt: 'Aug 20, 2026 • 09:30 AM',
    status: 'IN_PROGRESS',
    upvotes: 18,
    reportCount: 5, // 5 citizens reported this exact issue
    priorityScore: 28.5,
    priority: 'Emergency',
    department: 'Department of Roads & Infrastructure',
    assignedOfficer: 'Er. Rajesh Manandhar (Senior Inspector)',
    timeline: [
      {
        id: 't-1',
        status: 'REPORTED',
        timestamp: 'Aug 20, 2026 • 09:30 AM',
        note: 'Initial grievance lodged with photo evidence and GPS verification.',
        actor: 'Citizen Portal',
      },
      {
        id: 't-1b',
        status: 'REPORTED',
        timestamp: 'Aug 20, 2026 • 10:15 AM',
        note: '4 additional citizens flagged this exact road hazard (Merged into SS-1048 with +18 community upvotes).',
        actor: 'Auto-Priority Engine',
      },
      {
        id: 't-2',
        status: 'VERIFIED',
        timestamp: 'Aug 20, 2026 • 11:15 AM',
        note: 'Elevated to EMERGENCY priority by Ward Intake Officer due to high civic upvote volume.',
        actor: 'Municipal Central Desk',
      },
      {
        id: 't-3',
        status: 'ASSIGNED',
        timestamp: 'Aug 20, 2026 • 02:40 PM',
        note: 'Assigned to Dept. of Roads & Infrastructure. Work order #RO-8821 dispatched.',
        actor: 'Ward 4 Administrator',
      },
      {
        id: 't-4',
        status: 'IN_PROGRESS',
        timestamp: 'Aug 21, 2026 • 10:00 AM',
        note: 'Road repair unit on site with heavy rollers. Bitumen patching underway.',
        actor: 'Field Operations Unit',
      },
    ],
  },
  {
    id: 'SS-1049',
    title: 'Hanging Low-Voltage Electric Wires Near School Gate',
    category: 'Electric Wires',
    description: 'Dangling overhead power cables sagged below 6 feet, sparking near pedestrian sidewalk and school entrance.',
    location: 'Lalitpur, Jhamsikhel Lane 2',
    ward: 'Ward 3',
    coordinates: { lat: 27.6710, lng: 85.3250 },
    imageUrl: 'https://res.cloudinary.com/mhjjvqth/image/upload/v1787388222/68c8bb926d16ad123be8a1b7dbc673cd.jpg',
    citizenName: 'Sunita Pradhan',
    citizenPhone: '+977 9812345678',
    citizenEmail: 'sunita.p@example.com',
    createdAt: 'Aug 19, 2026 • 07:15 PM',
    status: 'RESOLVED',
    upvotes: 12,
    reportCount: 3,
    priorityScore: 21.0,
    priority: 'Emergency',
    department: 'Nepal Electricity & Public Lighting Board',
    assignedOfficer: 'Sunil Shrestha (Chief Line Technician)',
    timeline: [
      {
        id: 't-11',
        status: 'REPORTED',
        timestamp: 'Aug 19, 2026 • 07:15 PM',
        note: 'Emergency electrical hazard logged by citizens.',
        actor: 'Citizen Portal',
      },
      {
        id: 't-12',
        status: 'VERIFIED',
        timestamp: 'Aug 19, 2026 • 07:45 PM',
        note: 'Auto-prioritized to Emergency via live upvoting algorithm.',
        actor: 'NEA Rapid Response Desk',
      },
      {
        id: 't-13',
        status: 'ASSIGNED',
        timestamp: 'Aug 19, 2026 • 08:30 PM',
        note: 'Assigned to Ward 3 Emergency Line Crew.',
        actor: 'NEA Central Control',
      },
      {
        id: 't-14',
        status: 'IN_PROGRESS',
        timestamp: 'Aug 20, 2026 • 07:00 AM',
        note: 'Loose poles tightened and insulated cables bundled overhead.',
        actor: 'Maintenance Crew',
      },
      {
        id: 't-15',
        status: 'RESOLVED',
        timestamp: 'Aug 20, 2026 • 11:30 AM',
        note: 'All cables bundled and secured at safe height. Clearance confirmed.',
        actor: 'NEA Ward Supervisor',
      },
    ],
  },
  {
    id: 'SS-1050',
    title: 'Uncollected Municipal Waste Pile Spilling on Public Road',
    category: 'Garbage & Waste',
    description: 'Overloaded garbage container left uncollected for 4 consecutive days, attracting stray dogs and generating foul odor.',
    location: 'Kathmandu, Baneshwor Chowk',
    ward: 'Ward 10',
    coordinates: { lat: 27.6915, lng: 85.3420 },
    imageUrl: 'https://res.cloudinary.com/mhjjvqth/image/upload/v1787388222/7efe66bdfed3b6b37c49c442eef47cfe.jpg',
    citizenName: 'Bikram Thapa',
    citizenPhone: '+977 9801234567',
    citizenEmail: 'bikram.thapa@example.com',
    createdAt: 'Aug 21, 2026 • 08:00 AM',
    status: 'VERIFIED',
    upvotes: 9,
    reportCount: 3,
    priorityScore: 15.0,
    priority: 'High',
    department: 'Solid Waste & Sanitation Bureau',
    assignedOfficer: 'Pending Sanitation Crew Dispatch',
    timeline: [
      {
        id: 't-21',
        status: 'REPORTED',
        timestamp: 'Aug 21, 2026 • 08:00 AM',
        note: 'Waste accumulation reported by neighborhood resident.',
        actor: 'Citizen Portal',
      },
      {
        id: 't-22',
        status: 'VERIFIED',
        timestamp: 'Aug 21, 2026 • 08:45 AM',
        note: 'High community upvote trigger confirmed. Added to daily compactor pickup schedule.',
        actor: 'Sanitation Bureau Desk',
      },
    ],
  },
  {
    id: 'SS-1051',
    title: 'Broken Road Section & Exposed Manhole Rim',
    category: 'Roads & Potholes',
    description: 'Broken tarmac surrounding sewer manhole creating a 10cm wheel trap for bikes.',
    location: 'Bhaktapur, Durbar Square Approach Road',
    ward: 'Ward 2',
    coordinates: { lat: 27.6715, lng: 85.4298 },
    imageUrl: 'https://res.cloudinary.com/mhjjvqth/image/upload/v1787388222/d03fc2fe363172d449e218a84b557508.jpg',
    citizenName: 'Nirajan KC',
    citizenPhone: '+977 9851122334',
    createdAt: 'Aug 21, 2026 • 02:15 PM',
    status: 'REPORTED',
    upvotes: 4,
    reportCount: 1,
    priorityScore: 5.8,
    priority: 'Medium',
    timeline: [
      {
        id: 't-31',
        status: 'REPORTED',
        timestamp: 'Aug 21, 2026 • 02:15 PM',
        note: 'Report logged with verified coordinates. Awaiting inspector review.',
        actor: 'Citizen Portal',
      },
    ],
  },
];

export function getStoredReports(): ComplaintReport[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REPORTS));
      return INITIAL_REPORTS;
    }
    const parsed: ComplaintReport[] = JSON.parse(data);
    // Ensure backwards compatibility and migrate to Cloudinary verified images
    const updated = parsed.map((r) => {
      const upvotes = r.upvotes ?? 1;
      const reportCount = r.reportCount ?? 1;
      const { priority, score } = calculatePriorityScore(reportCount, upvotes, r.category);
      let img = r.imageUrl;
      if (!img || img.includes('unsplash.com') || img.startsWith('/')) {
        img = getRandomCategoryDemoImage(r.category);
      }
      return {
        ...r,
        upvotes,
        reportCount,
        priorityScore: r.priorityScore ?? score,
        priority: r.priority || priority,
        imageUrl: img,
      };
    });
    saveReports(updated);
    return updated;
  } catch {
    return INITIAL_REPORTS;
  }
}

export function saveReports(reports: ComplaintReport[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  } catch (err) {
    console.error('Failed to save reports to localStorage', err);
  }
}

export function getUserUpvotes(): string[] {
  try {
    const data = localStorage.getItem(USER_VOTES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveUserUpvote(reportId: string): void {
  try {
    const votes = getUserUpvotes();
    if (!votes.includes(reportId)) {
      localStorage.setItem(USER_VOTES_KEY, JSON.stringify([...votes, reportId]));
    }
  } catch (err) {
    console.error('Failed to save user upvote', err);
  }
}

/**
 * Upvote / Endorse an existing issue
 * Increases priority and bumps issue up in the civic queue
 */
export function upvoteReport(reportId: string): { updatedReports: ComplaintReport[]; success: boolean; newPriority: PriorityLevel } {
  const currentReports = getStoredReports();
  let updatedPriority: PriorityLevel = 'Medium';
  let isSuccess = false;

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + 
    ' • ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const updated = currentReports.map((report) => {
    if (report.id === reportId) {
      isSuccess = true;
      const newUpvotes = (report.upvotes || 0) + 1;
      const reportCount = report.reportCount || 1;
      const { priority, score } = calculatePriorityScore(reportCount, newUpvotes, report.category);
      updatedPriority = priority;

      const timeline = [...report.timeline];
      // Add milestone note if priority elevated
      if (priority !== report.priority && (priority === 'Emergency' || priority === 'High')) {
        timeline.push({
          id: `t-up-${Date.now()}`,
          status: report.status,
          timestamp: dateStr,
          note: `⚡ Priority elevated to ${priority.toUpperCase()} due to community upvote surge (${newUpvotes} citizens affected).`,
          actor: 'Civic Priority Algorithm',
        });
      }

      return {
        ...report,
        upvotes: newUpvotes,
        priorityScore: score,
        priority: priority,
        timeline,
      };
    }
    return report;
  });

  if (isSuccess) {
    saveReports(updated);
    saveUserUpvote(reportId);
  }

  return { updatedReports: updated, success: isSuccess, newPriority: updatedPriority };
}

/**
 * Report same existing issue (Citizen Merge)
 * Increments reporter count + adds upvotes, preventing duplicate tickets
 */
export function mergeDuplicateReport(reportId: string, citizenPhone?: string): { updatedReports: ComplaintReport[]; mergedReport: ComplaintReport | null } {
  const currentReports = getStoredReports();
  let merged: ComplaintReport | null = null;

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + 
    ' • ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const updated = currentReports.map((report) => {
    if (report.id === reportId) {
      const newReportCount = (report.reportCount || 1) + 1;
      const newUpvotes = (report.upvotes || 0) + 2; // Extra weight for filing a full complaint
      const { priority, score } = calculatePriorityScore(newReportCount, newUpvotes, report.category);

      const newTimelineEntry: TimelineEntry = {
        id: `t-m-${Date.now()}`,
        status: report.status,
        timestamp: dateStr,
        note: `Additional citizen reported this exact issue${citizenPhone ? ` (Contact: ${citizenPhone})` : ''}. Total confirmed affected: ${newReportCount} citizens.`,
        actor: 'Auto-Merge Engine',
      };

      const updatedReport: ComplaintReport = {
        ...report,
        reportCount: newReportCount,
        upvotes: newUpvotes,
        priorityScore: score,
        priority: priority,
        timeline: [...report.timeline, newTimelineEntry],
      };

      merged = updatedReport;
      return updatedReport;
    }
    return report;
  });

  if (merged) {
    saveReports(updated);
    saveUserUpvote(reportId);
  }

  return { updatedReports: updated, mergedReport: merged };
}

/**
 * Search for similar open issues in the same ward or category
 */
export function findSimilarIssues(category: IssueCategory, ward?: string, locationQuery?: string): ComplaintReport[] {
  const reports = getStoredReports();
  return reports.filter((r) => {
    // Only check active, unresolved issues
    if (r.status === 'RESOLVED') return false;
    
    // Exact category match
    const sameCategory = r.category === category;
    
    // Same ward
    const sameWard = ward && r.ward && r.ward.toLowerCase() === ward.toLowerCase();
    
    // Partial location similarity
    let locationSimilar = false;
    if (locationQuery && locationQuery.trim().length > 3) {
      const tokens = locationQuery.toLowerCase().split(/[,\s]+/);
      const reportLoc = r.location.toLowerCase();
      locationSimilar = tokens.some((token) => token.length > 3 && reportLoc.includes(token));
    }

    return sameCategory && (sameWard || locationSimilar);
  });
}

/**
 * Create brand new complaint
 */
export function createNewReport(data: {
  title?: string;
  category: IssueCategory;
  description: string;
  location: string;
  ward?: string;
  coordinates?: { lat: number; lng: number };
  imageUrl?: string;
  citizenName?: string;
  citizenPhone?: string;
  citizenEmail?: string;
}): ComplaintReport {
  const currentReports = getStoredReports();
  const nextNum = 1048 + currentReports.length;
  const newId = `SS-${nextNum}`;

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + 
    ' • ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  // Auto-generate clean title if not provided
  let reportTitle = data.title?.trim();
  if (!reportTitle) {
    if (data.description && data.description.trim().length > 0) {
      reportTitle = data.description.trim().split('\n')[0];
      if (reportTitle.length > 55) {
        reportTitle = reportTitle.slice(0, 52) + '...';
      }
    } else {
      reportTitle = `${data.category} - ${data.location || 'Civic Issue'}`;
    }
  }

  // Assign demo online image if citizen didn't upload one
  const finalImageUrl = data.imageUrl || getRandomCategoryDemoImage(data.category);

  // Initial Priority Calculation
  const initialReportCount = 1;
  const initialUpvotes = 1;
  const { priority, score } = calculatePriorityScore(initialReportCount, initialUpvotes, data.category);

  const newReport: ComplaintReport = {
    id: newId,
    title: reportTitle,
    category: data.category,
    description: data.description || reportTitle,
    location: data.location,
    ward: data.ward || 'Ward Central',
    coordinates: data.coordinates,
    imageUrl: finalImageUrl,
    citizenName: data.citizenName || 'Citizen',
    citizenPhone: data.citizenPhone || '',
    citizenEmail: data.citizenEmail || '',
    createdAt: dateStr,
    status: 'REPORTED',
    upvotes: initialUpvotes,
    reportCount: initialReportCount,
    priorityScore: score,
    priority: priority,
    timeline: [
      {
        id: `t-${Date.now()}`,
        status: 'REPORTED',
        timestamp: dateStr,
        note: data.coordinates 
          ? `Grievance registered with verified GPS coordinates (${data.coordinates.lat.toFixed(5)}, ${data.coordinates.lng.toFixed(5)}).` 
          : 'Complaint registered by citizen with location tag.',
        actor: 'Citizen Portal',
      },
    ],
  };

  const updated = [newReport, ...currentReports];
  saveReports(updated);
  saveUserUpvote(newId);
  return newReport;
}

export function updateReportStatus(
  reportId: string, 
  newStatus: ReportStatus, 
  note: string, 
  actor: string,
  extra?: { department?: string; assignedOfficer?: string; priority?: PriorityLevel }
): ComplaintReport[] {
  const reports = getStoredReports();
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + 
    ' • ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const updated = reports.map((r) => {
    if (r.id === reportId) {
      const newTimelineEntry: TimelineEntry = {
        id: `t-${Date.now()}`,
        status: newStatus,
        timestamp: dateStr,
        note: note || `Status updated to ${newStatus}`,
        actor: actor || 'Authority Desk',
      };

      return {
        ...r,
        status: newStatus,
        department: extra?.department !== undefined ? extra.department : r.department,
        assignedOfficer: extra?.assignedOfficer !== undefined ? extra.assignedOfficer : r.assignedOfficer,
        priority: extra?.priority !== undefined ? extra.priority : r.priority,
        timeline: [...r.timeline, newTimelineEntry],
      };
    }
    return r;
  });

  saveReports(updated);
  return updated;
}

/**
 * Calculates distance between two coordinates in kilometers using Haversine formula.
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const dist = R * c;
  return Math.round(dist * 10) / 10;
}
