import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateImpactMetrics, calculateFactualDatabaseImpact } from './sustainability';
import { validateCanIssueBadge, applyBadgeIssue, applyBadgeReturn } from './badgeRules';
import { Badge, Attendee, Assignment } from '../types';

test('calculateImpactMetrics calculates disposable cost, reusable cost and break-even correctly', () => {
  const result = calculateImpactMetrics({
    attendees: 200,
    eventsCount: 5,
    disposableBadgeCost: 2.00,
    reusableHolderCost: 5.00,
    replacementInsertCost: 0.20,
    holderReusesTarget: 10,
    badgeWeightGrams: 25,
    disposableWeightGrams: 30,
    recyclingLossRatePercent: 5,
  });

  // Total attendances = 1000
  // Disposable cost = 1000 * 2.00 = 2000
  assert.equal(result.disposableBadgesAvoided, 1000);
  assert.equal(result.disposableSystemCost, 2000);
  
  // Reusable system should show net positive savings over 5 events of 200 attendees
  assert.ok(result.netSavings > 0, `Expected net savings to be positive, got ${result.netSavings}`);
  assert.ok(result.materialWasteAvoidedKg > 0, 'Expected positive material waste avoided');
  assert.ok(result.breakEvenEvents <= 5, 'Break even events should be <= 5');
});

test('validateCanIssueBadge blocks issuing unavailable badges or already assigned attendees', () => {
  const availableBadge: Badge = {
    id: 'ECO-100',
    qrCodeValue: 'ECO-100',
    material: 'Recycled PET (rPET)',
    condition: 'Good',
    status: 'Available',
    reuseCount: 2,
    cost: 4.5,
    weightGrams: 25,
    purchaseDate: '2026-01-15',
  };

  const busyAttendee: Attendee = {
    id: 'ATT-1',
    name: 'Alex Rivera',
    email: 'alex@college.edu',
    participantId: 'CS2026-88',
    role: 'Student',
    registeredEventId: 'EVT-1',
    assignedBadgeId: 'ECO-099',
    issueStatus: 'Issued',
    remindersSentCount: 0,
    personalReusesContributed: 1,
  };

  const checkBusyAttendee = validateCanIssueBadge(availableBadge, busyAttendee);
  assert.equal(checkBusyAttendee.valid, false);
  assert.match(checkBusyAttendee.error || '', /already holds active badge/);

  const issuedBadge: Badge = { ...availableBadge, status: 'Issued' };
  const freshAttendee: Attendee = { ...busyAttendee, assignedBadgeId: undefined, issueStatus: 'Unissued' };

  const checkUnavailableBadge = validateCanIssueBadge(issuedBadge, freshAttendee);
  assert.equal(checkUnavailableBadge.valid, false);
  assert.match(checkUnavailableBadge.error || '', /currently Issued/);

  const checkValid = validateCanIssueBadge(availableBadge, freshAttendee);
  assert.equal(checkValid.valid, true);
});

test('applyBadgeIssue and applyBadgeReturn state transitions increment reuse and reset availability', () => {
  const badge: Badge = {
    id: 'ECO-200',
    qrCodeValue: 'ECO-200',
    material: 'Bamboo Composite',
    condition: 'Pristine',
    status: 'Available',
    reuseCount: 3,
    cost: 5.0,
    weightGrams: 22,
    purchaseDate: '2026-02-01',
  };

  const attendee: Attendee = {
    id: 'ATT-2',
    name: 'Sarah Chen',
    email: 'sarah@college.edu',
    participantId: 'EE2026-14',
    role: 'Student',
    registeredEventId: 'EVT-1',
    issueStatus: 'Unissued',
    remindersSentCount: 0,
    personalReusesContributed: 2,
  };

  // Step 1: Issue
  const issueResult = applyBadgeIssue({
    badge,
    attendee,
    eventId: 'EVT-1',
    eventName: 'College Hackathon 2026',
    recordedBy: 'Volunteer Mia',
  });

  assert.equal(issueResult.updatedBadge.status, 'Issued');
  assert.equal(issueResult.updatedBadge.currentAttendeeId, 'ATT-2');
  assert.equal(issueResult.updatedAttendee.assignedBadgeId, 'ECO-200');
  assert.equal(issueResult.updatedAttendee.issueStatus, 'Issued');
  assert.equal(issueResult.newAssignment.status, 'Active');

  // Step 2: Return with Pristine condition
  const returnResult = applyBadgeReturn({
    badge: issueResult.updatedBadge,
    assignment: issueResult.newAssignment,
    attendee: issueResult.updatedAttendee,
    condition: 'Good',
    notes: 'Clean return at desk',
    recordedBy: 'Volunteer Mia',
  });

  assert.equal(returnResult.updatedBadge.status, 'Available');
  assert.equal(returnResult.updatedBadge.reuseCount, 4, 'Reuse count must increment by exactly 1');
  assert.equal(returnResult.updatedBadge.currentAttendeeId, undefined);
  assert.equal(returnResult.updatedAttendee.assignedBadgeId, undefined);
  assert.equal(returnResult.updatedAttendee.issueStatus, 'Returned');
  assert.equal(returnResult.updatedAttendee.personalReusesContributed, 3);
  assert.equal(returnResult.updatedAssignment.status, 'Returned');
});

test('applyBadgeReturn with Damaged condition routes badge to Damaged status', () => {
  const badge: Badge = {
    id: 'ECO-300',
    qrCodeValue: 'ECO-300',
    material: 'Post-Consumer Ocean Plastic',
    condition: 'Good',
    status: 'Issued',
    reuseCount: 1,
    cost: 4.0,
    weightGrams: 26,
    purchaseDate: '2026-01-20',
  };

  const attendee: Attendee = {
    id: 'ATT-3',
    name: 'David Kim',
    email: 'david@college.edu',
    participantId: 'ME2026-05',
    role: 'Student',
    registeredEventId: 'EVT-2',
    assignedBadgeId: 'ECO-300',
    issueStatus: 'Issued',
    remindersSentCount: 0,
    personalReusesContributed: 0,
  };

  const assignment: Assignment = {
    id: 'ASGN-TEST-1',
    badgeId: 'ECO-300',
    attendeeId: 'ATT-3',
    attendeeName: 'David Kim',
    attendeeEmail: 'david@college.edu',
    eventId: 'EVT-2',
    eventName: 'Design Workshop',
    issueTimestamp: new Date().toISOString(),
    recordedBy: 'Admin Jordan',
    status: 'Active',
  };

  const damagedReturn = applyBadgeReturn({
    badge,
    assignment,
    attendee,
    condition: 'Damaged',
    notes: 'Clip snapped during session',
    recordedBy: 'Admin Jordan',
  });

  assert.equal(damagedReturn.updatedBadge.status, 'Damaged');
  assert.equal(damagedReturn.updatedBadge.reuseCount, 2);
  assert.equal(damagedReturn.updatedAssignment.returnCondition, 'Damaged');
});

test('calculateFactualDatabaseImpact calculates exact counts from database', () => {
  const badges: Badge[] = [
    { id: '1', qrCodeValue: '1', material: 'Bamboo Composite', condition: 'Good', status: 'Available', reuseCount: 5, cost: 5, weightGrams: 25, purchaseDate: '2026-01-01' },
    { id: '2', qrCodeValue: '2', material: 'Recycled PET (rPET)', condition: 'Good', status: 'Issued', reuseCount: 3, cost: 5, weightGrams: 25, purchaseDate: '2026-01-01' },
    { id: '3', qrCodeValue: '3', material: 'Recycled PET (rPET)', condition: 'Damaged', status: 'Damaged', reuseCount: 2, cost: 5, weightGrams: 25, purchaseDate: '2026-01-01' },
  ];

  const assignments: Assignment[] = [
    { id: 'a1', badgeId: '1', attendeeId: 'u1', attendeeName: 'U1', attendeeEmail: 'u1@c.edu', eventId: 'e1', eventName: 'E1', issueTimestamp: '2026-02-01', status: 'Returned', recordedBy: 'Admin' },
    { id: 'a2', badgeId: '2', attendeeId: 'u2', attendeeName: 'U2', attendeeEmail: 'u2@c.edu', eventId: 'e1', eventName: 'E1', issueTimestamp: '2026-02-01', status: 'Active', recordedBy: 'Admin' },
  ];

  const impact = calculateFactualDatabaseImpact(badges, assignments);
  assert.equal(impact.totalBadges, 3);
  assert.equal(impact.availableBadges, 1);
  assert.equal(impact.issuedBadges, 1);
  assert.equal(impact.damagedBadges, 1);
  assert.equal(impact.totalVerifiedReuses, 10); // 5 + 3 + 2
  assert.ok(impact.factualPlasticWasteAvoidedKg > 0);
  assert.equal(impact.returnRatePercent, 50); // 1 returned out of 2 assignments
});
