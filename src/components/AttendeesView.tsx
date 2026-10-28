import React, { useState } from 'react';
import { useEcoBadge } from '../context/EcoBadgeContext';
import { Attendee } from '../types';
import {
  Search,
  Filter,
  UserPlus,
  Send,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  QrCode,
  X,
  Mail,
} from 'lucide-react';
import { BadgeQRModal } from './BadgeQRModal';

interface AttendeesViewProps {
  onOpenStudentPortal: (attendeeId: string) => void;
}

export const AttendeesView: React.FC<AttendeesViewProps> = ({ onOpenStudentPortal }) => {
  const {
    attendees,
    badges,
    events,
    assignments,
    registerAttendee,
    sendReturnReminder,
    setActiveStudentId,
  } = useEcoBadge();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [qrModalBadgeId, setQrModalBadgeId] = useState<string | null>(null);

  // New Attendee Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [participantId, setParticipantId] = useState('');
  const [role, setRole] = useState<'Student' | 'Faculty' | 'Speaker' | 'External Guest' | 'Volunteer'>('Student');
  const [registeredEventId, setRegisteredEventId] = useState(events[0]?.id || '');

  const filteredAttendees = attendees.filter(att => {
    const matchesSearch =
      searchQuery === '' ||
      att.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      att.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      att.participantId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (att.assignedBadgeId && att.assignedBadgeId.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || att.issueStatus === statusFilter;
    const matchesRole = roleFilter === 'All' || att.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    registerAttendee({
      name: name.trim(),
      email: email.trim(),
      participantId: participantId.trim() || `ST-${Date.now().toString().slice(-4)}`,
      role,
      registeredEventId: registeredEventId || events[0]?.id || 'EVT-GEN',
    });

    setShowRegisterModal(false);
    setName('');
    setEmail('');
    setParticipantId('');
  };

  const overdueCount = attendees.filter(a => a.issueStatus === 'Overdue').length;

  const qrBadge = badges.find(b => b.id === qrModalBadgeId);
  const qrAttendee = attendees.find(a => a.assignedBadgeId === qrModalBadgeId);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
            <span>Participant Directory</span>
            <span className="text-slate-300">·</span>
            <span>{attendees.length} Registered Attendees</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Attendee Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitor badge issuance, follow up on return deadlines, and acknowledge individual reuse contributions.
          </p>
        </div>

        <button
          onClick={() => setShowRegisterModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition-all self-start sm:self-center cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          Register New Attendee
        </button>
      </div>

      {/* Alert banner if overdue returns exist */}
      {overdueCount > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold">{overdueCount} Unreturned Badges Pending Past Deadline</span>
              <p className="text-amber-800 text-[11px] mt-0.5">
                Send simulated return reminders with campus drop-off locations to recover reusable inventory.
              </p>
            </div>
          </div>
          <button
            onClick={() => setStatusFilter('Overdue')}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs shrink-0 cursor-pointer"
          >
            Filter Overdue ({overdueCount})
          </button>
        </div>
      )}

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, student ID, email, or badge ID..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 shrink-0">Status:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
          >
            <option value="All">All Statuses</option>
            <option value="Issued">Issued</option>
            <option value="Returned">Returned</option>
            <option value="Overdue">Overdue</option>
            <option value="Unissued">Unissued</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 shrink-0">Role:</span>
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
          >
            <option value="All">All Roles</option>
            <option value="Student">Student</option>
            <option value="Faculty">Faculty</option>
            <option value="Speaker">Speaker</option>
            <option value="External Guest">External Guest</option>
            <option value="Volunteer">Volunteer</option>
          </select>
        </div>
      </div>

      {/* Attendees Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10px] tracking-wider">
                <th className="py-3 px-4">Attendee</th>
                <th className="py-3 px-4">Role & ID</th>
                <th className="py-3 px-4">Registered Event</th>
                <th className="py-3 px-4">Badge Status</th>
                <th className="py-3 px-4">Assigned Badge</th>
                <th className="py-3 px-4 text-center">Reuse Impact</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAttendees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No attendees match the criteria.
                  </td>
                </tr>
              ) : (
                filteredAttendees.map(att => {
                  const event = events.find(e => e.id === att.registeredEventId);
                  const isOverdue = att.issueStatus === 'Overdue';
                  const isIssued = att.issueStatus === 'Issued';
                  const isReturned = att.issueStatus === 'Returned';

                  return (
                    <tr key={att.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Name & Email */}
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block">{att.name}</span>
                        <span className="text-[11px] text-slate-500">{att.email}</span>
                      </td>

                      {/* Role & ID */}
                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-700 block">{att.role}</span>
                        <span className="text-[10px] font-mono text-slate-500">{att.participantId}</span>
                      </td>

                      {/* Event */}
                      <td className="py-3 px-4 text-slate-700 truncate max-w-[150px]">
                        {event?.name || att.registeredEventId}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded font-bold text-[10px] ${
                            isOverdue
                              ? 'bg-rose-100 text-rose-800'
                              : isIssued
                              ? 'bg-teal-100 text-teal-800'
                              : isReturned
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {att.issueStatus}
                        </span>
                      </td>

                      {/* Badge ID */}
                      <td className="py-3 px-4">
                        {att.assignedBadgeId ? (
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-emerald-800">
                              {att.assignedBadgeId}
                            </span>
                            <button
                              onClick={() => setQrModalBadgeId(att.assignedBadgeId!)}
                              title="Show Digital QR Badge"
                              className="p-1 text-slate-400 hover:text-emerald-700"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">— None —</span>
                        )}
                      </td>

                      {/* Reuse Contributed */}
                      <td className="py-3 px-4 text-center tabular-nums font-bold text-emerald-800">
                        <span className="inline-flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-emerald-600" />
                          {att.personalReusesContributed} reuses
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Send Reminder button if issued or overdue */}
                          {(isIssued || isOverdue) && (
                            <button
                              onClick={() => sendReturnReminder(att.id, 'Email Simulation')}
                              title="Simulate sending return reminder"
                              className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg transition-colors cursor-pointer"
                            >
                              <Send className="w-3 h-3 text-amber-700" />
                              <span>Remind {att.remindersSentCount > 0 ? `(${att.remindersSentCount})` : ''}</span>
                            </button>
                          )}

                          {/* Student Pass View */}
                          <button
                            onClick={() => {
                              setActiveStudentId(att.id);
                              onOpenStudentPortal(att.id);
                            }}
                            className="px-2.5 py-1 text-xs font-medium text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 rounded-lg cursor-pointer"
                          >
                            Attendee View
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Modal */}
      {qrBadge && (
        <BadgeQRModal
          badge={qrBadge}
          attendee={qrAttendee}
          onClose={() => setQrModalBadgeId(null)}
        />
      )}

      {/* Register Attendee Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Register Attendee</h3>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Maya Chen"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">College Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. m.chen@college.edu"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Participant ID</label>
                  <input
                    type="text"
                    value={participantId}
                    onChange={e => setParticipantId(e.target.value)}
                    placeholder="e.g. ST-2026-441"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role</label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    <option value="Student">Student</option>
                    <option value="Faculty">Faculty</option>
                    <option value="Speaker">Speaker</option>
                    <option value="External Guest">External Guest</option>
                    <option value="Volunteer">Volunteer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Event Registration</label>
                <select
                  value={registeredEventId}
                  onChange={e => setRegisteredEventId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                >
                  {events.map(e => (
                    <option key={e.id} value={e.id}>
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
