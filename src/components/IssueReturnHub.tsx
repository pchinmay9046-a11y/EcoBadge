import React, { useState } from 'react';
import { useEcoBadge } from '../context/EcoBadgeContext';
import { BadgeCondition, Badge } from '../types';
import {
  QrCode,
  Search,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  UserPlus,
  ShieldCheck,
  Camera,
  X,
} from 'lucide-react';
import { BadgeQRModal } from './BadgeQRModal';

export const IssueReturnHub: React.FC = () => {
  const {
    events,
    badges,
    attendees,
    assignments,
    issueBadge,
    returnBadge,
    registerAttendee,
    userRole,
  } = useEcoBadge();

  const [activeTab, setActiveTab] = useState<'issue' | 'return'>('issue');

  // Issue Form State
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || '');
  const [attendeeSearchQuery, setAttendeeSearchQuery] = useState<string>('');
  const [selectedAttendeeId, setSelectedAttendeeId] = useState<string>('');
  const [badgeSearchQuery, setBadgeSearchQuery] = useState<string>('');
  const [selectedBadgeId, setSelectedBadgeId] = useState<string>('');
  const [volunteerName, setVolunteerName] = useState<string>('Volunteer Desk #1');

  // Quick Register Attendee Modal in Hub
  const [showQuickRegister, setShowQuickRegister] = useState<boolean>(false);
  const [newAttendeeName, setNewAttendeeName] = useState<string>('');
  const [newAttendeeEmail, setNewAttendeeEmail] = useState<string>('');
  const [newAttendeeId, setNewAttendeeId] = useState<string>('');
  const [newAttendeeRole, setNewAttendeeRole] = useState<
    'Student' | 'Faculty' | 'Speaker' | 'External Guest' | 'Volunteer'
  >('Student');

  // Return Form State
  const [returnLookupQuery, setReturnLookupQuery] = useState<string>('');
  const [selectedReturnBadge, setSelectedReturnBadge] = useState<Badge | null>(null);
  const [inspectedCondition, setInspectedCondition] = useState<BadgeCondition>('Good');
  const [returnNotes, setReturnNotes] = useState<string>('');
  const [returnDeskVolunteer, setReturnDeskVolunteer] = useState<string>('Volunteer Desk #1');

  // Camera QR Scanner Simulation
  const [isScanningQr, setIsScanningQr] = useState<boolean>(false);

  // QR Modal View
  const [qrModalBadge, setQrModalBadge] = useState<Badge | null>(null);

  // Available badges pool for issuing
  const availableBadges = badges.filter(
    b =>
      b.status === 'Available' &&
      (badgeSearchQuery === '' ||
        b.id.toLowerCase().includes(badgeSearchQuery.toLowerCase()) ||
        b.material.toLowerCase().includes(badgeSearchQuery.toLowerCase()))
  );

  // Active issued badges / return pending badges
  const issuedBadges = badges.filter(
    b => b.status === 'Issued' || b.status === 'Return Pending'
  );

  // Attendees eligible for issuance in the selected event (or all events)
  const eligibleAttendees = attendees.filter(a => {
    const matchesSearch =
      attendeeSearchQuery === '' ||
      a.name.toLowerCase().includes(attendeeSearchQuery.toLowerCase()) ||
      a.email.toLowerCase().includes(attendeeSearchQuery.toLowerCase()) ||
      a.participantId.toLowerCase().includes(attendeeSearchQuery.toLowerCase());
    return matchesSearch;
  });

  // Handle Quick Register Attendee
  const handleQuickRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAttendeeName.trim() || !newAttendeeEmail.trim()) return;

    const registered = registerAttendee({
      name: newAttendeeName.trim(),
      email: newAttendeeEmail.trim(),
      participantId: newAttendeeId.trim() || `ST-${Date.now().toString().slice(-4)}`,
      role: newAttendeeRole,
      registeredEventId: selectedEventId || events[0]?.id || 'EVT-GEN',
    });

    setSelectedAttendeeId(registered.id);
    setShowQuickRegister(false);
    setNewAttendeeName('');
    setNewAttendeeEmail('');
    setNewAttendeeId('');
  };

  // Handle Issue Submission
  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBadgeId || !selectedAttendeeId || !selectedEventId) return;

    const success = issueBadge(
      selectedBadgeId,
      selectedAttendeeId,
      selectedEventId,
      volunteerName || 'Volunteer Desk'
    );

    if (success) {
      setSelectedBadgeId('');
      setSelectedAttendeeId('');
    }
  };

  // Handle Return Selection
  const handleSelectBadgeForReturn = (badge: Badge) => {
    setSelectedReturnBadge(badge);
    setInspectedCondition(badge.condition || 'Good');
    setReturnNotes('');
  };

  // Handle Return Submission
  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReturnBadge) return;

    const success = returnBadge(
      selectedReturnBadge.id,
      inspectedCondition,
      returnNotes,
      returnDeskVolunteer || 'Volunteer Desk'
    );

    if (success) {
      setSelectedReturnBadge(null);
      setReturnLookupQuery('');
      setReturnNotes('');
    }
  };

  // Simulate scanning a real badge via QR viewfinder
  const handleSimulateQrScan = (badgeId: string) => {
    setIsScanningQr(false);
    const targetBadge = badges.find(b => b.id.toUpperCase() === badgeId.toUpperCase());
    if (targetBadge) {
      if (activeTab === 'issue') {
        if (targetBadge.status === 'Available') {
          setSelectedBadgeId(targetBadge.id);
        }
      } else {
        handleSelectBadgeForReturn(targetBadge);
      }
    }
  };

  const selectedAttendee = attendees.find(a => a.id === selectedAttendeeId);
  const selectedBadge = badges.find(b => b.id === selectedBadgeId);
  const selectedEvent = events.find(e => e.id === selectedEventId);

  return (
    <div className="space-y-6 pb-12">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
            <span>Fast Check-In & Collection Console</span>
            <span className="text-slate-300">·</span>
            <span>Role: {userRole}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Badge Issuance & Return Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time assignment and physical inspection workflow ensuring closed-loop badge reuse with zero loss.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-xl shrink-0 self-start sm:self-center">
          <button
            onClick={() => setActiveTab('issue')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'issue'
                ? 'bg-emerald-900 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/50'
            }`}
          >
            1. Issue Badge
          </button>
          <button
            onClick={() => setActiveTab('return')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'return'
                ? 'bg-emerald-900 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/50'
            }`}
          >
            2. Record Return & Inspect
          </button>
        </div>
      </div>

      {/* Camera QR Scanner Simulation Overlay */}
      {isScanningQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative w-full max-w-md bg-slate-900 text-white rounded-2xl p-6 border border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold">QR Camera Viewfinder</h3>
              </div>
              <button
                onClick={() => setIsScanningQr(false)}
                aria-label="Close viewfinder"
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Viewfinder Target */}
            <div className="my-6 relative w-64 h-64 mx-auto border-2 border-emerald-400 rounded-2xl flex items-center justify-center bg-black/40 overflow-hidden">
              <div className="absolute inset-x-0 h-0.5 bg-emerald-400 animate-pulse top-1/2" />
              <div className="text-center p-4">
                <QrCode className="w-16 h-16 mx-auto text-emerald-400/80 mb-2" />
                <span className="text-xs text-slate-300">Point at physical EcoBadge QR code</span>
              </div>
            </div>

            {/* Simulated Detected Codes */}
            <div className="space-y-2">
              <span className="text-xs text-slate-400 block font-medium">Simulate Instant Optical Scan:</span>
              <div className="grid grid-cols-2 gap-2">
                {(activeTab === 'issue' ? availableBadges : issuedBadges).slice(0, 4).map(b => (
                  <button
                    key={b.id}
                    onClick={() => handleSimulateQrScan(b.id)}
                    className="p-2 text-xs bg-slate-800 hover:bg-emerald-950 border border-slate-700 hover:border-emerald-500 rounded-lg text-left transition-colors cursor-pointer"
                  >
                    <span className="font-bold text-white block">{b.id}</span>
                    <span className="text-[10px] text-slate-400">{b.material.slice(0, 18)}...</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800 text-[11px] text-slate-400 text-center">
              Fallback: Manual badge ID entry is always accessible without camera permissions.
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 1: ISSUE BADGE WORKFLOW ================= */}
      {activeTab === 'issue' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Step-by-Step Form */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Issue Reusable Badge</h3>
                  <p className="text-xs text-slate-500">Associate an available physical badge with an attendee.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsScanningQr(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                Scan QR
              </button>
            </div>

            <form onSubmit={handleIssueSubmit} className="space-y-5">
              {/* Step 1: Select Event */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Step 1: Select Event
                </label>
                <select
                  value={selectedEventId}
                  onChange={e => setSelectedEventId(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  required
                >
                  {events.map(evt => (
                    <option key={evt.id} value={evt.id}>
                      {evt.name} ({evt.status}) — {evt.location}
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 2: Select or Search Attendee */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Step 2: Attendee Check-In
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowQuickRegister(true)}
                    className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    + New Attendee
                  </button>
                </div>

                {/* Attendee search box */}
                <div className="relative mb-2">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={attendeeSearchQuery}
                    onChange={e => setAttendeeSearchQuery(e.target.value)}
                    placeholder="Search by student name, college ID, or email..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                {/* Attendee list selector */}
                <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 bg-white">
                  {eligibleAttendees.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No attendees matched query. Click "+ New Attendee" to register on the fly.
                    </div>
                  ) : (
                    eligibleAttendees.map(att => {
                      const isSelected = selectedAttendeeId === att.id;
                      const hasBadge = !!att.assignedBadgeId && att.issueStatus === 'Issued';

                      return (
                        <div
                          key={att.id}
                          onClick={() => {
                            if (!hasBadge) setSelectedAttendeeId(att.id);
                          }}
                          className={`p-2.5 flex items-center justify-between text-xs cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-emerald-50 border-l-4 border-emerald-600'
                              : hasBadge
                              ? 'bg-slate-50 opacity-60 cursor-not-allowed'
                              : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="min-w-0">
                            <span className="font-semibold text-slate-900 block truncate">{att.name}</span>
                            <span className="text-[11px] text-slate-500">
                              {att.participantId} · {att.email}
                            </span>
                          </div>
                          <div className="shrink-0 flex items-center gap-2">
                            {hasBadge ? (
                              <span className="text-[10px] bg-slate-200 text-slate-700 font-medium px-2 py-0.5 rounded">
                                Has Badge {att.assignedBadgeId}
                              </span>
                            ) : (
                              <span
                                className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                                  isSelected ? 'bg-emerald-700 text-white font-bold' : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {isSelected ? 'Selected' : 'Select'}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Step 3: Select Physical Badge from Available Pool */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Step 3: Select Available Physical Badge
                  </label>
                  <span className="text-xs text-slate-500">
                    {availableBadges.length} available in inventory
                  </span>
                </div>

                {/* Badge Search */}
                <div className="relative mb-2">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={badgeSearchQuery}
                    onChange={e => setBadgeSearchQuery(e.target.value)}
                    placeholder="Search badge ID (e.g. ECO-1001) or material..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                {/* Badge selection grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1 border border-slate-200 rounded-xl bg-slate-50/50">
                  {availableBadges.map(b => {
                    const isSelected = selectedBadgeId === b.id;
                    return (
                      <div
                        key={b.id}
                        onClick={() => setSelectedBadgeId(b.id)}
                        className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-emerald-900 text-white border-emerald-900 shadow-xs'
                            : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold">{b.id}</span>
                          <span
                            className={`text-[10px] px-1 rounded ${
                              isSelected ? 'bg-emerald-800 text-emerald-200' : 'bg-emerald-50 text-emerald-700'
                            }`}
                          >
                            {b.reuseCount} uses
                          </span>
                        </div>
                        <div
                          className={`text-[11px] truncate mt-1 ${
                            isSelected ? 'text-emerald-100' : 'text-slate-500'
                          }`}
                        >
                          {b.material}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 4: Volunteer Desk metadata & Submit */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-100">
                <div className="w-full sm:w-1/2">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Recorded By (Station ID)
                  </label>
                  <input
                    type="text"
                    value={volunteerName}
                    onChange={e => setVolunteerName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={!selectedBadgeId || !selectedAttendeeId || !selectedEventId}
                  className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Confirm Badge Assignment
                </button>
              </div>
            </form>
          </div>

          {/* Right Col: Live Summary Card of Current Assignment */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Assignment Verification
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                Badge Circulation Pass
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Review verified details before handing physical badge to attendee.
              </p>

              <div className="mt-5 p-4 rounded-xl border border-dashed border-emerald-300 bg-emerald-50/40 space-y-3 text-xs">
                <div>
                  <span className="text-slate-600 block text-[11px]">Selected Event</span>
                  <span className="font-semibold text-slate-800">
                    {selectedEvent ? selectedEvent.name : '— Select Event —'}
                  </span>
                </div>

                <div className="pt-2 border-t border-emerald-100">
                  <span className="text-slate-600 block text-[11px]">Assigned Attendee</span>
                  {selectedAttendee ? (
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">{selectedAttendee.name}</span>
                      <span className="text-slate-500">{selectedAttendee.email}</span>
                    </div>
                  ) : (
                    <span className="text-slate-400 italic">No attendee chosen</span>
                  )}
                </div>

                <div className="pt-2 border-t border-emerald-100">
                  <span className="text-slate-600 block text-[11px]">Assigned Physical Badge</span>
                  {selectedBadge ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-mono font-bold text-emerald-800 text-sm block">
                          {selectedBadge.id}
                        </span>
                        <span className="text-slate-500">{selectedBadge.material}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setQrModalBadge(selectedBadge)}
                        className="text-xs text-emerald-700 underline font-medium hover:text-emerald-900 cursor-pointer"
                      >
                        View QR
                      </button>
                    </div>
                  ) : (
                    <span className="text-slate-400 italic">No badge selected</span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-slate-100 text-xs text-slate-500 space-y-1">
              <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero Duplicate Guarantee</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                The database locks this badge immediately upon issue, preventing simultaneous double assignment.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: RETURN & INSPECT WORKFLOW ================= */}
      {activeTab === 'return' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Col: Search & Active Badges List */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Check-In Queue</h3>
                <p className="text-xs text-slate-500">Search badge ID or scan drop box return.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsScanningQr(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                Scan QR
              </button>
            </div>

            {/* Quick Lookup Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={returnLookupQuery}
                onChange={e => setReturnLookupQuery(e.target.value)}
                placeholder="Enter Badge ID (e.g. ECO-1011) or name..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            {/* List of currently issued badges to pick for return */}
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                Active & Pending Badges ({issuedBadges.length})
              </div>
              {issuedBadges.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 border border-dashed rounded-xl">
                  All badges currently accounted for. No active loans.
                </div>
              ) : (
                issuedBadges
                  .filter(
                    b =>
                      returnLookupQuery === '' ||
                      b.id.toLowerCase().includes(returnLookupQuery.toLowerCase()) ||
                      (b.currentAttendeeName &&
                        b.currentAttendeeName.toLowerCase().includes(returnLookupQuery.toLowerCase()))
                  )
                  .map(b => {
                    const isSelected = selectedReturnBadge?.id === b.id;
                    const isPending = b.status === 'Return Pending';

                    return (
                      <div
                        key={b.id}
                        onClick={() => handleSelectBadgeForReturn(b)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-emerald-900 text-white border-emerald-900 shadow-xs'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold">{b.id}</span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                              isPending
                                ? isSelected
                                  ? 'bg-amber-400 text-slate-900'
                                  : 'bg-amber-100 text-amber-800'
                                : isSelected
                                ? 'bg-emerald-800 text-emerald-100'
                                : 'bg-teal-100 text-teal-800'
                            }`}
                          >
                            {b.status}
                          </span>
                        </div>

                        <div className={`mt-1 font-semibold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                          {b.currentAttendeeName || 'Unknown Attendee'}
                        </div>
                        <div className={`text-[11px] ${isSelected ? 'text-emerald-200' : 'text-slate-500'}`}>
                          {b.currentEventName || 'Campus Event'}
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>

          {/* Right 2 Cols: Inspection Checklist & Return Confirmation */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Physical Condition Inspection</h3>
                    <p className="text-xs text-slate-500">Verify holder integrity before returning to available pool.</p>
                  </div>
                </div>
              </div>

              {selectedReturnBadge ? (
                <form onSubmit={handleReturnSubmit} className="mt-5 space-y-5">
                  {/* Selected Badge Overview */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-slate-600 block text-[11px]">Badge Asset ID</span>
                      <span className="font-mono font-bold text-slate-900">{selectedReturnBadge.id}</span>
                    </div>
                    <div>
                      <span className="text-slate-600 block text-[11px]">Returning Attendee</span>
                      <span className="font-semibold text-slate-900">
                        {selectedReturnBadge.currentAttendeeName || 'Attendee'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-600 block text-[11px]">Material Type</span>
                      <span className="font-medium text-slate-800">{selectedReturnBadge.material}</span>
                    </div>
                    <div>
                      <span className="text-slate-600 block text-[11px]">Current Reuse Count</span>
                      <span className="font-bold text-emerald-800 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        {selectedReturnBadge.reuseCount} uses
                      </span>
                    </div>
                  </div>

                  {/* Physical Inspection Condition Radio Selector */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Physical Condition Assessment
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {[
                        {
                          condition: 'Pristine' as BadgeCondition,
                          title: 'Pristine / Like New',
                          desc: 'Zero scratches, clip intact, seed insert removed cleanly. Ready to sanitize & reissue.',
                          statusEffect: '→ Returns to Available Inventory',
                        },
                        {
                          condition: 'Good' as BadgeCondition,
                          title: 'Good / Normal',
                          desc: 'Normal light cosmetic wear, clip and lanyard fully functional.',
                          statusEffect: '→ Returns to Available Inventory',
                        },
                        {
                          condition: 'Minor Wear' as BadgeCondition,
                          title: 'Minor Surface Wear',
                          desc: 'Surface scuff, but structural integrity 100% sound.',
                          statusEffect: '→ Returns to Available Inventory',
                        },
                        {
                          condition: 'Needs Repair' as BadgeCondition,
                          title: 'Needs Repair',
                          desc: 'Snapped organic cotton clip or loose fastener. Can be restrung.',
                          statusEffect: '→ Routes to Maintenance Queue',
                        },
                        {
                          condition: 'Damaged' as BadgeCondition,
                          title: 'Damaged',
                          desc: 'Cracked plastic or broken frame. Sent to campus filament recycling.',
                          statusEffect: '→ Routes to Material Recovery',
                        },
                      ].map(item => (
                        <div
                          key={item.condition}
                          onClick={() => setInspectedCondition(item.condition)}
                          className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                            inspectedCondition === item.condition
                              ? 'bg-emerald-50/70 border-emerald-600 ring-2 ring-emerald-500/20'
                              : 'bg-white hover:bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold text-slate-900">
                            <span>{item.title}</span>
                            {inspectedCondition === item.condition && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1 leading-snug">{item.desc}</p>
                          <span className="text-[10px] font-semibold text-emerald-800 block mt-2">
                            {item.statusEffect}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Return Notes */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Inspection Notes (Optional)
                    </label>
                    <input
                      type="text"
                      value={returnNotes}
                      onChange={e => setReturnNotes(e.target.value)}
                      placeholder="e.g. Returned at Student Center desk; seed insert composted."
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>

                  {/* Volunteer info & Submit */}
                  <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="w-full sm:w-1/2">
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Inspector Volunteer ID
                      </label>
                      <input
                        type="text"
                        value={returnDeskVolunteer}
                        onChange={e => setReturnDeskVolunteer(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Record Return & Increment Reuse Count
                    </button>
                  </div>
                </form>
              ) : (
                <div className="py-16 text-center text-slate-400 space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <RotateCcw className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-semibold text-slate-700">No Badge Selected for Return</div>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Select a badge from the active loans on the left or scan a physical badge QR code with the camera.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Returned badges only become re-issuable after passing condition inspection.</span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Register Attendee Modal */}
      {showQuickRegister && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Register Attendee</h3>
              <button
                onClick={() => setShowQuickRegister(false)}
                aria-label="Close modal"
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleQuickRegisterSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newAttendeeName}
                  onChange={e => setNewAttendeeName(e.target.value)}
                  placeholder="e.g. Jordan Hayes"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">College Email</label>
                <input
                  type="email"
                  required
                  value={newAttendeeEmail}
                  onChange={e => setNewAttendeeEmail(e.target.value)}
                  placeholder="e.g. j.hayes@university.edu"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Student / Faculty ID</label>
                  <input
                    type="text"
                    value={newAttendeeId}
                    onChange={e => setNewAttendeeId(e.target.value)}
                    placeholder="e.g. ST-2026-904"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role</label>
                  <select
                    value={newAttendeeRole}
                    onChange={e => setNewAttendeeRole(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  >
                    <option value="Student">Student</option>
                    <option value="Faculty">Faculty</option>
                    <option value="Speaker">Speaker</option>
                    <option value="External Guest">External Guest</option>
                    <option value="Volunteer">Volunteer</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowQuickRegister(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg"
                >
                  Register & Select
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Modal for viewing/printing */}
      {qrModalBadge && (
        <BadgeQRModal badge={qrModalBadge} onClose={() => setQrModalBadge(null)} />
      )}
    </div>
  );
};
