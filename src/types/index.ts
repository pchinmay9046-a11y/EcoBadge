export type BadgeStatus = 
  | 'Available' 
  | 'Issued' 
  | 'Return Pending' 
  | 'Returned' 
  | 'Damaged' 
  | 'Missing' 
  | 'Retired';

export type BadgeCondition = 'Pristine' | 'Good' | 'Minor Wear' | 'Needs Repair' | 'Damaged';

export type BadgeMaterial = 
  | 'Recycled PET (rPET)' 
  | 'Bamboo Composite' 
  | 'Post-Consumer Ocean Plastic' 
  | 'Anodized Aluminum & Seed Paper' 
  | 'Recycled Polycarbonate';

export interface Badge {
  id: string; // e.g., "ECO-1001"
  qrCodeValue: string;
  material: BadgeMaterial;
  condition: BadgeCondition;
  status: BadgeStatus;
  reuseCount: number;
  cost: number; // in USD or standard currency units
  weightGrams: number;
  purchaseDate: string;
  notes?: string;
  currentAttendeeId?: string;
  currentAttendeeName?: string;
  currentEventId?: string;
  currentEventName?: string;
  lastInspectedDate?: string;
}

export type EventStatus = 'Upcoming' | 'Active' | 'Completed' | 'Cancelled';

export interface CollegeEvent {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  endDate?: string;
  location: string;
  expectedAttendees: number;
  badgesRequired: number;
  status: EventStatus;
  description: string;
  department: string;
  dropOffDeskLocation: string;
}

export interface Attendee {
  id: string; // e.g., "ATT-501"
  name: string;
  email: string;
  participantId: string; // Student/Faculty ID
  role: 'Student' | 'Faculty' | 'Speaker' | 'External Guest' | 'Volunteer';
  registeredEventId: string;
  assignedBadgeId?: string;
  issueStatus: 'Unissued' | 'Issued' | 'Returned' | 'Overdue';
  issueTimestamp?: string;
  returnTimestamp?: string;
  remindersSentCount: number;
  lastReminderSent?: string;
  personalReusesContributed: number;
}

export interface Assignment {
  id: string;
  badgeId: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  eventId: string;
  eventName: string;
  issueTimestamp: string;
  returnTimestamp?: string;
  returnCondition?: BadgeCondition;
  recordedBy: string; // Volunteer or Admin name
  status: 'Active' | 'Returned' | 'Marked Missing' | 'Marked Damaged';
  returnNotes?: string;
}

export interface ReminderLog {
  id: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  badgeId: string;
  eventName: string;
  sentAt: string;
  channel: 'Email Simulation' | 'SMS Simulation' | 'Push Notification';
  status: 'Simulated Delivery';
}

export interface ImpactCalculatorInputs {
  attendees: number;
  eventsCount: number;
  disposableBadgeCost: number; // e.g. 1.75
  reusableHolderCost: number;   // e.g. 4.50
  replacementInsertCost: number; // e.g. 0.15
  holderReusesTarget: number;   // e.g. 10
  badgeWeightGrams: number;     // e.g. 24
  disposableWeightGrams: number;// e.g. 28
  recyclingLossRatePercent: number; // e.g. 5%
}

export interface ImpactCalculatedResult {
  disposableBadgesAvoided: number;
  disposableSystemCost: number;
  reusableSystemCost: number;
  netSavings: number;
  materialWasteAvoidedKg: number;
  breakEvenEvents: number;
  breakEvenReusesPerHolder: number;
  isProjected: boolean;
}

export type UserRole = 'Admin' | 'Volunteer' | 'Student';
