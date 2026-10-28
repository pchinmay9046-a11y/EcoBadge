import { Badge, Assignment, Attendee, BadgeCondition } from '../types';

export interface IssueBadgeParams {
  badge: Badge;
  attendee: Attendee;
  eventId: string;
  eventName: string;
  recordedBy: string;
}

export interface ReturnBadgeParams {
  badge: Badge;
  assignment: Assignment;
  attendee: Attendee;
  condition: BadgeCondition;
  notes?: string;
  recordedBy: string;
}

export function validateCanIssueBadge(badge: Badge, attendee: Attendee): { valid: boolean; error?: string } {
  if (badge.status !== 'Available') {
    return { valid: false, error: `Badge ${badge.id} is currently ${badge.status} and cannot be issued.` };
  }
  if (badge.condition === 'Damaged') {
    return { valid: false, error: `Badge ${badge.id} is damaged and must be repaired or replaced before issuance.` };
  }
  if (attendee.assignedBadgeId && attendee.issueStatus === 'Issued') {
    return { valid: false, error: `Attendee ${attendee.name} already holds active badge ${attendee.assignedBadgeId}.` };
  }
  return { valid: true };
}

export function applyBadgeIssue(params: IssueBadgeParams): {
  updatedBadge: Badge;
  updatedAttendee: Attendee;
  newAssignment: Assignment;
} {
  const { badge, attendee, eventId, eventName, recordedBy } = params;
  const now = new Date().toISOString();

  const updatedBadge: Badge = {
    ...badge,
    status: 'Issued',
    currentAttendeeId: attendee.id,
    currentAttendeeName: attendee.name,
    currentEventId: eventId,
    currentEventName: eventName,
  };

  const updatedAttendee: Attendee = {
    ...attendee,
    assignedBadgeId: badge.id,
    issueStatus: 'Issued',
    issueTimestamp: now,
    returnTimestamp: undefined,
  };

  const newAssignment: Assignment = {
    id: `ASGN-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 899 + 100)}`,
    badgeId: badge.id,
    attendeeId: attendee.id,
    attendeeName: attendee.name,
    attendeeEmail: attendee.email,
    eventId,
    eventName,
    issueTimestamp: now,
    recordedBy,
    status: 'Active',
  };

  return { updatedBadge, updatedAttendee, newAssignment };
}

export function applyBadgeReturn(params: ReturnBadgeParams): {
  updatedBadge: Badge;
  updatedAttendee: Attendee;
  updatedAssignment: Assignment;
} {
  const { badge, assignment, attendee, condition, notes, recordedBy } = params;
  const now = new Date().toISOString();

  // Increment genuine reuse count (this badge was used and returned)
  const newReuseCount = (badge.reuseCount || 0) + 1;

  // Determine new badge status based on physical condition inspection
  let newStatus: Badge['status'] = 'Available';
  if (condition === 'Damaged') {
    newStatus = 'Damaged';
  } else if (condition === 'Needs Repair') {
    newStatus = 'Damaged'; // flagged until repaired
  }

  const updatedBadge: Badge = {
    ...badge,
    status: newStatus,
    condition,
    reuseCount: newReuseCount,
    lastInspectedDate: now,
    currentAttendeeId: undefined,
    currentAttendeeName: undefined,
    currentEventId: undefined,
    currentEventName: undefined,
    notes: notes || badge.notes,
  };

  const updatedAttendee: Attendee = {
    ...attendee,
    assignedBadgeId: undefined,
    issueStatus: 'Returned',
    returnTimestamp: now,
    personalReusesContributed: (attendee.personalReusesContributed || 0) + 1,
  };

  const updatedAssignment: Assignment = {
    ...assignment,
    status: 'Returned',
    returnTimestamp: now,
    returnCondition: condition,
    returnNotes: notes,
    recordedBy,
  };

  return { updatedBadge, updatedAttendee, updatedAssignment };
}
