import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Badge,
  CollegeEvent,
  Attendee,
  Assignment,
  ReminderLog,
  UserRole,
  BadgeCondition,
} from '../types';
import {
  INITIAL_EVENTS,
  INITIAL_BADGES,
  INITIAL_ATTENDEES,
  INITIAL_ASSIGNMENTS,
  INITIAL_REMINDER_LOGS,
} from '../data/seedData';
import { validateCanIssueBadge, applyBadgeIssue, applyBadgeReturn } from '../utils/badgeRules';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

interface EcoBadgeContextType {
  events: CollegeEvent[];
  badges: Badge[];
  attendees: Attendee[];
  assignments: Assignment[];
  reminderLogs: ReminderLog[];
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  activeStudentId: string;
  setActiveStudentId: (id: string) => void;
  toasts: ToastMessage[];
  addToast: (type: 'success' | 'error' | 'info', title: string, description?: string) => void;
  dismissToast: (id: string) => void;
  
  // Badge Operations
  issueBadge: (badgeId: string, attendeeId: string, eventId: string, recordedBy?: string) => boolean;
  returnBadge: (badgeId: string, condition: BadgeCondition, notes?: string, recordedBy?: string) => boolean;
  markBadgeMissing: (badgeId: string) => boolean;
  markBadgeDamaged: (badgeId: string, condition: BadgeCondition, notes?: string) => boolean;
  repairBadge: (badgeId: string) => boolean;
  retireBadge: (badgeId: string, notes?: string) => boolean;
  addBadge: (newBadge: Omit<Badge, 'id' | 'qrCodeValue' | 'reuseCount' | 'status'> & { id?: string }) => Badge;

  // Event Operations
  createEvent: (event: Omit<CollegeEvent, 'id'>) => CollegeEvent;
  updateEvent: (id: string, updates: Partial<CollegeEvent>) => boolean;
  cancelEvent: (id: string) => boolean;

  // Attendee Operations
  registerAttendee: (attendee: Omit<Attendee, 'id' | 'issueStatus' | 'remindersSentCount' | 'personalReusesContributed'>) => Attendee;
  sendReturnReminder: (attendeeId: string, channel?: 'Email Simulation' | 'SMS Simulation' | 'Push Notification') => boolean;

  // System
  isDemoMode: boolean;
  resetToDemoData: () => void;
}

const EcoBadgeContext = createContext<EcoBadgeContextType | undefined>(undefined);

const STORAGE_KEY = 'ecobadge_state_v1';

export const EcoBadgeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<CollegeEvent[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_events`);
      return saved ? JSON.parse(saved) : INITIAL_EVENTS;
    } catch {
      return INITIAL_EVENTS;
    }
  });

  const [badges, setBadges] = useState<Badge[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_badges`);
      return saved ? JSON.parse(saved) : INITIAL_BADGES;
    } catch {
      return INITIAL_BADGES;
    }
  });

  const [attendees, setAttendees] = useState<Attendee[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_attendees`);
      return saved ? JSON.parse(saved) : INITIAL_ATTENDEES;
    } catch {
      return INITIAL_ATTENDEES;
    }
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_assignments`);
      return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
    } catch {
      return INITIAL_ASSIGNMENTS;
    }
  });

  const [reminderLogs, setReminderLogs] = useState<ReminderLog[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_reminders`);
      return saved ? JSON.parse(saved) : INITIAL_REMINDER_LOGS;
    } catch {
      return INITIAL_REMINDER_LOGS;
    }
  });

  const [userRole, setUserRole] = useState<UserRole>('Admin');
  const [activeStudentId, setActiveStudentId] = useState<string>('ATT-201');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_events`, JSON.stringify(events));
      localStorage.setItem(`${STORAGE_KEY}_badges`, JSON.stringify(badges));
      localStorage.setItem(`${STORAGE_KEY}_attendees`, JSON.stringify(attendees));
      localStorage.setItem(`${STORAGE_KEY}_assignments`, JSON.stringify(assignments));
      localStorage.setItem(`${STORAGE_KEY}_reminders`, JSON.stringify(reminderLogs));
    } catch (err) {
      console.warn('Could not persist to localStorage:', err);
    }
  }, [events, badges, attendees, assignments, reminderLogs]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, description?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Issue Badge Workflow
  const issueBadge = (badgeId: string, attendeeId: string, eventId: string, recordedBy = 'Volunteer'): boolean => {
    const targetBadge = badges.find(b => b.id.toUpperCase() === badgeId.trim().toUpperCase());
    const targetAttendee = attendees.find(a => a.id === attendeeId);
    const targetEvent = events.find(e => e.id === eventId);

    if (!targetBadge) {
      addToast('error', 'Badge Not Found', `Badge identifier "${badgeId}" was not found in inventory.`);
      return false;
    }
    if (!targetAttendee) {
      addToast('error', 'Attendee Not Found', `Attendee ID "${attendeeId}" does not exist.`);
      return false;
    }
    if (!targetEvent) {
      addToast('error', 'Event Not Found', `Event "${eventId}" was not recognized.`);
      return false;
    }

    const validation = validateCanIssueBadge(targetBadge, targetAttendee);
    if (!validation.valid) {
      addToast('error', 'Cannot Issue Badge', validation.error);
      return false;
    }

    const { updatedBadge, updatedAttendee, newAssignment } = applyBadgeIssue({
      badge: targetBadge,
      attendee: targetAttendee,
      eventId: targetEvent.id,
      eventName: targetEvent.name,
      recordedBy,
    });

    setBadges(prev => prev.map(b => (b.id === updatedBadge.id ? updatedBadge : b)));
    setAttendees(prev => prev.map(a => (a.id === updatedAttendee.id ? updatedAttendee : a)));
    setAssignments(prev => [newAssignment, ...prev]);

    addToast(
      'success',
      'Badge Successfully Issued',
      `Assigned ${updatedBadge.id} to ${updatedAttendee.name} for ${targetEvent.name}.`
    );
    return true;
  };

  // Return Badge Workflow
  const returnBadge = (
    badgeId: string,
    condition: BadgeCondition,
    notes?: string,
    recordedBy = 'Volunteer Desk'
  ): boolean => {
    const normalizedId = badgeId.trim().toUpperCase();
    const targetBadge = badges.find(b => b.id.toUpperCase() === normalizedId);

    if (!targetBadge) {
      addToast('error', 'Badge Not Found', `Badge "${badgeId}" not found in inventory.`);
      return false;
    }

    // Find active assignment for this badge
    const activeAssignment = assignments.find(
      a => a.badgeId.toUpperCase() === normalizedId && a.status === 'Active'
    );

    if (!activeAssignment && targetBadge.status === 'Available') {
      addToast('error', 'Already Returned', `Badge ${targetBadge.id} is already in the available inventory.`);
      return false;
    }

    let targetAttendee = attendees.find(a => a.id === targetBadge.currentAttendeeId);
    if (!targetAttendee && activeAssignment) {
      targetAttendee = attendees.find(a => a.id === activeAssignment.attendeeId);
    }

    if (!targetAttendee) {
      // Fallback if attendee record not linked
      targetAttendee = {
        id: `GUEST-${Date.now()}`,
        name: targetBadge.currentAttendeeName || 'Event Attendee',
        email: 'guest@college.edu',
        participantId: 'GUEST',
        role: 'Student',
        registeredEventId: targetBadge.currentEventId || 'EVT-GEN',
        issueStatus: 'Issued',
        remindersSentCount: 0,
        personalReusesContributed: 0,
      };
    }

    const dummyAssignment: Assignment = activeAssignment || {
      id: `ASGN-${Date.now()}`,
      badgeId: targetBadge.id,
      attendeeId: targetAttendee.id,
      attendeeName: targetAttendee.name,
      attendeeEmail: targetAttendee.email,
      eventId: targetBadge.currentEventId || 'EVT-HACK26',
      eventName: targetBadge.currentEventName || 'College Event',
      issueTimestamp: new Date().toISOString(),
      recordedBy,
      status: 'Active',
    };

    const { updatedBadge, updatedAttendee, updatedAssignment } = applyBadgeReturn({
      badge: targetBadge,
      assignment: dummyAssignment,
      attendee: targetAttendee,
      condition,
      notes,
      recordedBy,
    });

    setBadges(prev => prev.map(b => (b.id === updatedBadge.id ? updatedBadge : b)));
    setAttendees(prev => prev.map(a => (a.id === updatedAttendee.id ? updatedAttendee : a)));
    setAssignments(prev => {
      const exists = prev.some(a => a.id === updatedAssignment.id);
      if (exists) {
        return prev.map(a => (a.id === updatedAssignment.id ? updatedAssignment : a));
      }
      return [updatedAssignment, ...prev];
    });

    addToast(
      'success',
      'Badge Return Confirmed',
      `Badge ${updatedBadge.id} recorded with condition "${condition}". Lifetime reuses: ${updatedBadge.reuseCount}.`
    );
    return true;
  };

  const markBadgeMissing = (badgeId: string): boolean => {
    const target = badges.find(b => b.id === badgeId);
    if (!target) return false;

    setBadges(prev =>
      prev.map(b => (b.id === badgeId ? { ...b, status: 'Missing', notes: 'Marked missing by admin/volunteer' } : b))
    );
    setAssignments(prev =>
      prev.map(a =>
        a.badgeId === badgeId && a.status === 'Active'
          ? { ...a, status: 'Marked Missing', returnTimestamp: new Date().toISOString() }
          : a
      )
    );
    addToast('info', 'Badge Marked Missing', `Badge ${badgeId} status updated to Missing.`);
    return true;
  };

  const markBadgeDamaged = (badgeId: string, condition: BadgeCondition, notes?: string): boolean => {
    setBadges(prev =>
      prev.map(b =>
        b.id === badgeId
          ? { ...b, status: 'Damaged', condition, notes: notes || 'Damaged during use/handling' }
          : b
      )
    );
    addToast('info', 'Badge Moved to Repair Queue', `Badge ${badgeId} flagged as ${condition}.`);
    return true;
  };

  const repairBadge = (badgeId: string): boolean => {
    setBadges(prev =>
      prev.map(b =>
        b.id === badgeId
          ? {
              ...b,
              status: 'Available',
              condition: 'Good',
              notes: 'Inspected and repaired by college sustainability team.',
              lastInspectedDate: new Date().toISOString().split('T')[0],
            }
          : b
      )
    );
    addToast('success', 'Badge Repaired & Available', `Badge ${badgeId} is back in circulation.`);
    return true;
  };

  const retireBadge = (badgeId: string, notes?: string): boolean => {
    setBadges(prev =>
      prev.map(b =>
        b.id === badgeId
          ? {
              ...b,
              status: 'Retired',
              notes: notes || 'Decommissioned for material recycling / campus filament recovery.',
            }
          : b
      )
    );
    addToast('info', 'Badge Retired', `Badge ${badgeId} sent for campus material recovery.`);
    return true;
  };

  const addBadge = (
    newBadgeData: Omit<Badge, 'id' | 'qrCodeValue' | 'reuseCount' | 'status'> & { id?: string }
  ): Badge => {
    const nextNumber = 1000 + badges.length + 1;
    const id = newBadgeData.id || `ECO-${nextNumber}`;
    const newBadge: Badge = {
      ...newBadgeData,
      id,
      qrCodeValue: id,
      reuseCount: 0,
      status: 'Available',
      purchaseDate: newBadgeData.purchaseDate || new Date().toISOString().split('T')[0],
    };

    setBadges(prev => [newBadge, ...prev]);
    addToast('success', 'New Reusable Badge Added', `Registered ${newBadge.id} (${newBadge.material}).`);
    return newBadge;
  };

  const createEvent = (eventData: Omit<CollegeEvent, 'id'>): CollegeEvent => {
    const id = `EVT-${Date.now().toString(36).toUpperCase()}`;
    const newEvent: CollegeEvent = {
      ...eventData,
      id,
    };
    setEvents(prev => [newEvent, ...prev]);
    addToast('success', 'Event Created', `Created "${newEvent.name}" requiring ${newEvent.badgesRequired} badges.`);
    return newEvent;
  };

  const updateEvent = (id: string, updates: Partial<CollegeEvent>): boolean => {
    setEvents(prev => prev.map(e => (e.id === id ? { ...e, ...updates } : e)));
    addToast('success', 'Event Updated', 'Changes were saved successfully.');
    return true;
  };

  const cancelEvent = (id: string): boolean => {
    setEvents(prev => prev.map(e => (e.id === id ? { ...e, status: 'Cancelled' } : e)));
    addToast('info', 'Event Cancelled', 'Event status has been updated to Cancelled.');
    return true;
  };

  const registerAttendee = (
    attendeeData: Omit<Attendee, 'id' | 'issueStatus' | 'remindersSentCount' | 'personalReusesContributed'>
  ): Attendee => {
    const id = `ATT-${Date.now().toString(36).substring(4).toUpperCase()}`;
    const newAttendee: Attendee = {
      ...attendeeData,
      id,
      issueStatus: 'Unissued',
      remindersSentCount: 0,
      personalReusesContributed: 0,
    };
    setAttendees(prev => [newAttendee, ...prev]);
    addToast('success', 'Attendee Registered', `Added ${newAttendee.name} to registration list.`);
    return newAttendee;
  };

  const sendReturnReminder = (
    attendeeId: string,
    channel: 'Email Simulation' | 'SMS Simulation' | 'Push Notification' = 'Email Simulation'
  ): boolean => {
    const attendee = attendees.find(a => a.id === attendeeId);
    if (!attendee) return false;

    const assignedBadge = badges.find(b => b.id === attendee.assignedBadgeId);
    const event = events.find(e => e.id === attendee.registeredEventId);

    const newLog: ReminderLog = {
      id: `REM-${Date.now().toString(36).toUpperCase()}`,
      attendeeId: attendee.id,
      attendeeName: attendee.name,
      attendeeEmail: attendee.email,
      badgeId: attendee.assignedBadgeId || 'N/A',
      eventName: event?.name || 'College Event',
      sentAt: new Date().toISOString(),
      channel,
      status: 'Simulated Delivery',
    };

    setReminderLogs(prev => [newLog, ...prev]);
    setAttendees(prev =>
      prev.map(a =>
        a.id === attendeeId
          ? {
              ...a,
              remindersSentCount: a.remindersSentCount + 1,
              lastReminderSent: new Date().toISOString(),
            }
          : a
      )
    );

    addToast(
      'info',
      'Reminder Simulated',
      `Sent return instructions via ${channel} to ${attendee.email}. (Simulated: No external outbound email dispatched).`
    );
    return true;
  };

  const resetToDemoData = () => {
    setEvents(INITIAL_EVENTS);
    setBadges(INITIAL_BADGES);
    setAttendees(INITIAL_ATTENDEES);
    setAssignments(INITIAL_ASSIGNMENTS);
    setReminderLogs(INITIAL_REMINDER_LOGS);
    localStorage.removeItem(`${STORAGE_KEY}_events`);
    localStorage.removeItem(`${STORAGE_KEY}_badges`);
    localStorage.removeItem(`${STORAGE_KEY}_attendees`);
    localStorage.removeItem(`${STORAGE_KEY}_assignments`);
    localStorage.removeItem(`${STORAGE_KEY}_reminders`);
    addToast('info', 'Demo Data Reset', 'Restored pristine sample events, badges, and circulation logs.');
  };

  return (
    <EcoBadgeContext.Provider
      value={{
        events,
        badges,
        attendees,
        assignments,
        reminderLogs,
        userRole,
        setUserRole,
        activeStudentId,
        setActiveStudentId,
        toasts,
        addToast,
        dismissToast,
        issueBadge,
        returnBadge,
        markBadgeMissing,
        markBadgeDamaged,
        repairBadge,
        retireBadge,
        addBadge,
        createEvent,
        updateEvent,
        cancelEvent,
        registerAttendee,
        sendReturnReminder,
        isDemoMode: true,
        resetToDemoData,
      }}
    >
      {children}
    </EcoBadgeContext.Provider>
  );
};

export const useEcoBadge = (): EcoBadgeContextType => {
  const context = useContext(EcoBadgeContext);
  if (!context) {
    throw new Error('useEcoBadge must be used within an EcoBadgeProvider');
  }
  return context;
};
