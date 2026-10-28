import React, { useState } from 'react';
import { useEcoBadge } from '../context/EcoBadgeContext';
import { CAMPUS_DROPOFF_POINTS } from '../data/seedData';
import {
  Send,
  AlertTriangle,
  Clock,
  MapPin,
  Award,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { NavTab } from './Navbar';

interface ReturnsRemindersViewProps {
  onNavigateToHub: () => void;
}

export const ReturnsRemindersView: React.FC<ReturnsRemindersViewProps> = ({ onNavigateToHub }) => {
  const {
    attendees,
    badges,
    events,
    sendReturnReminder,
    reminderLogs,
  } = useEcoBadge();

  const [selectedChannel, setSelectedChannel] = useState<'Email Simulation' | 'SMS Simulation' | 'Push Notification'>('Email Simulation');

  // Filter pending and overdue attendees
  const pendingAttendees = attendees.filter(
    a => (a.issueStatus === 'Issued' || a.issueStatus === 'Overdue') && a.assignedBadgeId
  );

  const overdueAttendees = attendees.filter(a => a.issueStatus === 'Overdue');

  const handleBatchRemind = () => {
    overdueAttendees.forEach(att => {
      sendReturnReminder(att.id, selectedChannel);
    });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
            <span>Reverse Logistics & Behavioral Nudges</span>
            <span className="text-slate-300">·</span>
            <span>{pendingAttendees.length} Badges Currently in the Field</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Return Reminders & Campus Drop-Off Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Motivate prompt returns through convenient drop points, polite reminders, and campus green rewards.
          </p>
        </div>

        {overdueAttendees.length > 0 && (
          <button
            onClick={handleBatchRemind}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all self-start sm:self-center cursor-pointer"
          >
            <Send className="w-4 h-4" />
            Dispatch Nudge to All {overdueAttendees.length} Overdue
          </button>
        )}
      </div>

      {/* Hero Collection Visual Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-12">
        <div className="md:col-span-6 relative h-64 md:h-auto overflow-hidden bg-slate-100">
          <img
            src="/src/assets/images/campus_event_collection_1793160978453.jpg"
            alt="College students returning EcoBadges at wooden collection drop-box"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Campus Behavioral Strategy
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              "The 30-Second Return Friction Cap"
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Research in collegiate environmental psychology shows return compliance plummets when attendees must
              walk more than 2 minutes to a drop box. EcoBadge places smart collection receptacles directly along natural
              exit paths, cafeterias, and library entrances.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
            <span className="font-bold text-emerald-900 block mb-1">Polite, Positive Nudge Language:</span>
            <p className="text-emerald-800 italic leading-snug">
              "Your event has wrapped up! Please return your EcoBadge at any campus drop desk so it can welcome the next class of innovators."
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Pending/Overdue Queue on Left, Drop-Off Points on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 7 Cols: Pending & Overdue Badge Queue */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Pending & Overdue Badge Holders ({pendingAttendees.length})
              </h3>
              <p className="text-xs text-slate-500">Track active loans and dispatch simulated return reminders.</p>
            </div>

            <select
              value={selectedChannel}
              onChange={e => setSelectedChannel(e.target.value as any)}
              className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg"
            >
              <option value="Email Simulation">Email Simulation</option>
              <option value="SMS Simulation">SMS Simulation</option>
              <option value="Push Notification">Push Notification</option>
            </select>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {pendingAttendees.length === 0 ? (
              <div className="p-8 text-center text-slate-400 border border-dashed rounded-xl">
                No active loans pending. All issued badges have been checked back into storage!
              </div>
            ) : (
              pendingAttendees.map(att => {
                const isOverdue = att.issueStatus === 'Overdue';
                const event = events.find(e => e.id === att.registeredEventId);

                return (
                  <div
                    key={att.id}
                    className={`p-4 rounded-xl border text-xs transition-all ${
                      isOverdue
                        ? 'bg-rose-50/50 border-rose-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{att.name}</span>
                          <span
                            className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                              isOverdue ? 'bg-rose-100 text-rose-800' : 'bg-teal-100 text-teal-800'
                            }`}
                          >
                            {att.issueStatus}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 block mt-0.5">
                          {att.email} · {att.participantId}
                        </span>
                        <div className="mt-2 text-slate-600 text-[11px]">
                          <strong>Badge:</strong> <span className="font-mono text-emerald-800 font-bold">{att.assignedBadgeId}</span> ·{' '}
                          <strong>Event:</strong> {event?.name || 'College Event'}
                        </div>
                      </div>

                      <div className="shrink-0 flex flex-col items-end gap-1.5">
                        <button
                          onClick={() => sendReturnReminder(att.id, selectedChannel)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 shadow-2xs transition-colors cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Remind ({att.remindersSentCount})</span>
                        </button>
                      </div>
                    </div>

                    {att.lastReminderSent && (
                      <div className="mt-2 pt-2 border-t border-slate-200/60 text-[10px] text-slate-500 flex items-center justify-between">
                        <span>Last reminder sent: {new Date(att.lastReminderSent).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="text-emerald-700 font-medium">Drop-off: {event?.dropOffDeskLocation}</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Reminder delivery is strictly simulated for college privacy compliance.</span>
            <button
              onClick={onNavigateToHub}
              className="font-bold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
            >
              Open Return Desk →
            </button>
          </div>
        </div>

        {/* Right 5 Cols: Campus Drop-Off Locations & Student Incentive Points */}
        <div className="lg:col-span-5 space-y-6">
          {/* Drop-Off Points Directory */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
              <MapPin className="w-4 h-4 text-emerald-700" />
              <span>Campus Drop-Off Locations</span>
            </div>
            <p className="text-xs text-slate-500">
              Students and guests can return badges to any of these four designated campus hubs.
            </p>

            <div className="space-y-3">
              {CAMPUS_DROPOFF_POINTS.map((point, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{point.name}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                      {point.type}
                    </span>
                  </div>
                  <div className="text-slate-600 text-[11px]">{point.building}</div>
                  <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {point.hours}
                    </span>
                    <span className="font-semibold text-emerald-700">{point.incentive}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gamified Campus Incentive System */}
          <div className="bg-linear-to-br from-emerald-900 to-slate-900 text-white p-6 rounded-2xl shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>Zero-Waste Return Rewards</span>
            </div>
            <h3 className="text-base font-bold text-white">
              Campus Cafe & Sustainability Points
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every on-time badge return deposits <strong>+15 EcoBadge Points</strong> into the student's campus card,
              redeemable for free coffee at the student union cafe or discounts at the campus bookstore.
            </p>

            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-white/10">
              <div className="p-2 bg-white/10 rounded-lg">
                <span className="text-emerald-300 font-bold block text-sm">94.2%</span>
                <span className="text-[10px] text-slate-300">Return Rate</span>
              </div>
              <div className="p-2 bg-white/10 rounded-lg">
                <span className="text-emerald-300 font-bold block text-sm">&lt;24h</span>
                <span className="text-[10px] text-slate-300">Avg Return</span>
              </div>
              <div className="p-2 bg-white/10 rounded-lg">
                <span className="text-emerald-300 font-bold block text-sm">340+</span>
                <span className="text-[10px] text-slate-300">Rewards Issued</span>
              </div>
            </div>
          </div>

          {/* Simulated Dispatch Log */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-xs space-y-2">
            <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block">
              Recent Reminder Audit Log
            </span>
            <div className="divide-y divide-slate-100 max-h-36 overflow-y-auto">
              {reminderLogs.map(log => (
                <div key={log.id} className="py-2 flex items-center justify-between text-[11px]">
                  <div>
                    <span className="font-semibold text-slate-800 block">{log.attendeeName}</span>
                    <span className="text-slate-400">
                      {log.channel} · {new Date(log.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <span className="text-[10px] text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded font-mono">
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
