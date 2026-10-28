import React, { useState } from 'react';
import { useEcoBadge } from '../context/EcoBadgeContext';
import { CAMPUS_DROPOFF_POINTS } from '../data/seedData';
import { BadgeQRModal } from './BadgeQRModal';
import {
  GraduationCap,
  Sparkles,
  QrCode,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Award,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { NavTab } from './Navbar';

interface StudentPortalViewProps {
  onNavigate: (tab: NavTab) => void;
}

export const StudentPortalView: React.FC<StudentPortalViewProps> = ({ onNavigate }) => {
  const {
    attendees,
    badges,
    events,
    activeStudentId,
    setActiveStudentId,
  } = useEcoBadge();

  const [showQrModal, setShowQrModal] = useState(false);

  const activeAttendee =
    attendees.find(a => a.id === activeStudentId) ||
    attendees.find(a => a.assignedBadgeId) ||
    attendees[0];

  const assignedBadge = badges.find(b => b.id === activeAttendee?.assignedBadgeId);
  const registeredEvent = events.find(e => e.id === activeAttendee?.registeredEventId);

  const isOverdue = activeAttendee?.issueStatus === 'Overdue';
  const isIssued = activeAttendee?.issueStatus === 'Issued';

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      {/* Top Bar Switcher to Test Different Student Perspectives */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-emerald-700" />
          <span className="font-bold text-slate-900">Student & Attendee Pass View</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-500">Switching perspective simulates attendee mobile app:</span>
        </div>

        <select
          value={activeAttendee?.id}
          onChange={e => setActiveStudentId(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
        >
          {attendees.map(att => (
            <option key={att.id} value={att.id}>
              {att.name} ({att.role}) — {att.issueStatus === 'Issued' ? `Badge ${att.assignedBadgeId}` : att.issueStatus}
            </option>
          ))}
        </select>
      </div>

      {/* Main Student Pass Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Pass Top Ribbon */}
        <div className="bg-linear-to-r from-emerald-900 to-slate-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Campus Sustainable Event Pass</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {activeAttendee?.name}
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              {activeAttendee?.participantId} · {activeAttendee?.email} · {activeAttendee?.role}
            </p>
          </div>

          <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-1">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                isOverdue
                  ? 'bg-rose-500 text-white'
                  : isIssued
                  ? 'bg-emerald-400 text-slate-950'
                  : 'bg-slate-700 text-white'
              }`}
            >
              {activeAttendee?.issueStatus}
            </span>
            <span className="text-[11px] text-slate-300">
              {registeredEvent?.name}
            </span>
          </div>
        </div>

        {/* Pass Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {assignedBadge ? (
            <div className="p-5 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/40 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8 space-y-3 text-xs">
                <div>
                  <span className="text-slate-600 block text-[11px] uppercase tracking-wider font-semibold">
                    Physical Badge In Your Care
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono font-extrabold text-2xl text-emerald-900">
                      {assignedBadge.id}
                    </span>
                    <span className="bg-emerald-200 text-emerald-950 font-semibold px-2 py-0.5 rounded text-xs">
                      {assignedBadge.material}
                    </span>
                  </div>
                </div>

                <p className="text-slate-600 text-xs leading-relaxed">
                  This badge has been cleaned, sanitized, and successfully reused{' '}
                  <strong className="text-emerald-900 font-bold">{assignedBadge.reuseCount} times</strong> before
                  reaching your hands. When your sessions conclude, return it to keep the cycle going.
                </p>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => setShowQrModal(true)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-900 hover:bg-emerald-950 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    <QrCode className="w-4 h-4" />
                    Open Digital QR Pass
                  </button>
                  <span className="text-[11px] text-slate-500">
                    Use this QR at kiosks if physical badge is packed.
                  </span>
                </div>
              </div>

              {/* Personal Impact Pill */}
              <div className="md:col-span-4 p-4 rounded-xl bg-white border border-slate-200 text-center shadow-xs">
                <Sparkles className="w-6 h-6 text-emerald-600 mx-auto mb-1.5" />
                <span className="text-2xl font-black text-slate-900 block tabular-nums">
                  {activeAttendee.personalReusesContributed}
                </span>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                  Collegiate Reuses
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">
                  ~{(activeAttendee.personalReusesContributed * 0.028).toFixed(2)} kg plastic diverted
                </span>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <div className="font-bold text-slate-800 text-sm">No Active Badge Loan</div>
              <p className="max-w-md mx-auto">
                You do not currently hold an unreturned badge. When you arrive at your next registered event, pick up
                your reusable EcoBadge at the check-in desk!
              </p>
            </div>
          )}

          {/* Overdue Warning Callout */}
          {isOverdue && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Return Past Due for {registeredEvent?.name}</span>
                <p className="mt-0.5 leading-relaxed text-[11px]">
                  Your event concluded and your EcoBadge has not been checked in. Please drop it into any of the
                  campus bins listed below to avoid replacement fees and earn your reward points.
                </p>
              </div>
            </div>
          )}

          {/* Return Instructions & Drop-Off Points */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Campus Drop-Off Locations & Return Instructions
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {CAMPUS_DROPOFF_POINTS.map((pt, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>{pt.name}</span>
                    <span className="text-[10px] text-emerald-800 bg-emerald-100 font-semibold px-1.5 py-0.2 rounded">
                      {pt.type}
                    </span>
                  </div>
                  <div className="text-slate-600 text-[11px] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{pt.building}</span>
                  </div>
                  <div className="text-slate-500 text-[10px] flex items-center justify-between pt-1">
                    <span>{pt.hours}</span>
                    <span className="font-semibold text-emerald-700">{pt.incentive}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* QR Modal */}
      {showQrModal && assignedBadge && (
        <BadgeQRModal
          badge={assignedBadge}
          attendee={activeAttendee}
          event={registeredEvent}
          onClose={() => setShowQrModal(false)}
        />
      )}
    </div>
  );
};
