import React, { useState } from 'react';
import { useEcoBadge } from '../context/EcoBadgeContext';
import { CollegeEvent, EventStatus } from '../types';
import {
  Calendar,
  MapPin,
  Users,
  Award,
  Plus,
  TrendingUp,
  X,
  AlertTriangle,
  Layers,
  Sparkles,
} from 'lucide-react';
import { NavTab } from './Navbar';

interface EventsViewProps {
  onNavigateToHub: () => void;
}

export const EventsView: React.FC<EventsViewProps> = ({ onNavigateToHub }) => {
  const { events, createEvent, cancelEvent, assignments, badges } = useEcoBadge();

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [selectedEventDetail, setSelectedEventDetail] = useState<CollegeEvent | null>(null);
  const [confirmCancelEventId, setConfirmCancelEventId] = useState<string | null>(null);

  // New Event Form State
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [expectedAttendees, setExpectedAttendees] = useState(150);
  const [badgesRequired, setBadgesRequired] = useState(150);
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState('School of Engineering');
  const [dropOffDeskLocation, setDropOffDeskLocation] = useState('Main Foyer Welcome Desk');

  const filteredEvents = events.filter(e => {
    if (statusFilter === 'All') return true;
    return e.status === statusFilter;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !date) return;

    createEvent({
      name: name.trim(),
      date,
      endDate: endDate || date,
      location: location.trim() || 'Campus Center',
      expectedAttendees: Number(expectedAttendees) || 100,
      badgesRequired: Number(badgesRequired) || 100,
      status: 'Upcoming',
      description: description.trim() || 'College sustainability event.',
      department: department.trim() || 'Campus Activities',
      dropOffDeskLocation: dropOffDeskLocation.trim() || 'Main Exit Desk',
    });

    setShowCreateModal(false);
    setName('');
    setDate('');
    setEndDate('');
    setLocation('');
    setDescription('');
  };

  const handleConfirmCancel = () => {
    if (confirmCancelEventId) {
      cancelEvent(confirmCancelEventId);
      setConfirmCancelEventId(null);
      if (selectedEventDetail?.id === confirmCancelEventId) {
        setSelectedEventDetail(null);
      }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
            <span>Campus Event Lifecycle</span>
            <span className="text-slate-300">·</span>
            <span>{events.length} Events on Schedule</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Event Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Plan badge asset quotas, coordinate volunteer collection desks, and monitor event return rates.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition-all self-start sm:self-center cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create New Event
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl max-w-fit">
        {['All', 'Active', 'Upcoming', 'Completed', 'Cancelled'].map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === status
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredEvents.map(evt => {
          const eventAssignments = assignments.filter(a => a.eventId === evt.id);
          const returnedCount = eventAssignments.filter(a => a.status === 'Returned').length;
          const activeLoanCount = eventAssignments.filter(a => a.status === 'Active').length;
          const totalIssued = eventAssignments.length;
          const returnRate = totalIssued > 0 ? Math.round((returnedCount / totalIssued) * 100) : 0;
          const plasticSavedKg = Math.round(returnedCount * 0.028 * 100) / 100;

          return (
            <div
              key={evt.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between hover:border-slate-300 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        evt.status === 'Active'
                          ? 'bg-teal-100 text-teal-800'
                          : evt.status === 'Upcoming'
                          ? 'bg-emerald-100 text-emerald-800'
                          : evt.status === 'Completed'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {evt.status}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-2 leading-snug">{evt.name}</h3>
                    <span className="text-xs text-slate-500 font-medium block mt-0.5">
                      {evt.department}
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedEventDetail(evt)}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-lg shrink-0 cursor-pointer"
                  >
                    View Details →
                  </button>
                </div>

                <p className="text-xs text-slate-600 mt-3 leading-relaxed line-clamp-2">
                  {evt.description}
                </p>

                {/* Event Metadata Strip */}
                <div className="grid grid-cols-2 gap-2 mt-4 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{evt.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{evt.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{evt.expectedAttendees} Expected</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{evt.badgesRequired} Badges Needed</span>
                  </div>
                </div>

                {/* Return Progress Bar */}
                <div className="mt-5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-slate-600 font-medium">Badge Collection & Return</span>
                    <span className="font-bold text-slate-900">
                      {returnedCount} / {totalIssued} returned ({returnRate}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${returnRate}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-slate-500 mt-2">
                    <span>Active on site: {activeLoanCount}</span>
                    <span className="font-semibold text-emerald-700">
                      {plasticSavedKg} kg plastic saved
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500">
                  Drop-off: {evt.dropOffDeskLocation}
                </span>

                <div className="flex items-center gap-2">
                  {evt.status === 'Active' && (
                    <button
                      onClick={onNavigateToHub}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg cursor-pointer"
                    >
                      Issue/Return Desk
                    </button>
                  )}
                  {evt.status !== 'Cancelled' && (
                    <button
                      onClick={() => setConfirmCancelEventId(evt.id)}
                      className="text-slate-400 hover:text-rose-700 font-medium p-1 cursor-pointer"
                      title="Cancel Event"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Event Detail Modal / Drawer */}
      {selectedEventDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs uppercase font-bold text-emerald-800">
                  Event Circularity Report
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                  {selectedEventDetail.name}
                </h3>
                <span className="text-xs text-slate-500">
                  {selectedEventDetail.department} · {selectedEventDetail.location}
                </span>
              </div>
              <button
                onClick={() => setSelectedEventDetail(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Event Stats Summary */}
            <div className="my-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Expected Attendance</span>
                <span className="text-lg font-bold text-slate-900">{selectedEventDetail.expectedAttendees}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Badges Issued</span>
                <span className="text-lg font-bold text-teal-800">
                  {assignments.filter(a => a.eventId === selectedEventDetail.id).length}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Badges Returned</span>
                <span className="text-lg font-bold text-emerald-800">
                  {assignments.filter(a => a.eventId === selectedEventDetail.id && a.status === 'Returned').length}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Drop-Off Point</span>
                <span className="text-xs font-semibold text-slate-800 truncate block">
                  {selectedEventDetail.dropOffDeskLocation}
                </span>
              </div>
            </div>

            {/* Registered Attendee Roster & Assigned Badges */}
            <div className="mt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Circulation Roster for this Event
              </h4>
              <div className="max-h-56 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 text-xs">
                {assignments.filter(a => a.eventId === selectedEventDetail.id).length === 0 ? (
                  <div className="p-6 text-center text-slate-400">
                    No badges have been assigned yet for this event.
                  </div>
                ) : (
                  assignments
                    .filter(a => a.eventId === selectedEventDetail.id)
                    .map(asgn => (
                      <div key={asgn.id} className="p-3 flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-slate-900 block">{asgn.attendeeName}</span>
                          <span className="text-[11px] text-slate-500">
                            Badge {asgn.badgeId} · Issued by {asgn.recordedBy}
                          </span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                            asgn.status === 'Returned'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {asgn.status}
                        </span>
                      </div>
                    ))
                )}
              </div>
            </div>

            {/* Environmental Impact of Event */}
            <div className="mt-5 p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span>Environmental Benefit Achieved</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                By reusing holders rather than purchasing single-use badge pouches for this event, the college avoided an estimated{' '}
                <strong>
                  {Math.round(
                    assignments.filter(a => a.eventId === selectedEventDetail.id && a.status === 'Returned').length *
                      0.028 *
                      100
                  ) / 100}{' '}
                  kg
                </strong>{' '}
                of single-use plastic waste and prevented disposable badge disposal fees.
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedEventDetail(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Create Campus Event</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Event Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. AI & Robotics Symposium 2026"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Venue / Location</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. Campus Amphitheater & Student Union"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Expected Attendees</label>
                  <input
                    type="number"
                    min="10"
                    value={expectedAttendees}
                    onChange={e => setExpectedAttendees(parseInt(e.target.value, 10) || 50)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Badges Required</label>
                  <input
                    type="number"
                    min="10"
                    value={badgesRequired}
                    onChange={e => setBadgesRequired(parseInt(e.target.value, 10) || 50)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Organizing Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  placeholder="e.g. Department of Mechanical Engineering"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Badge Drop-Off Desk Location</label>
                <input
                  type="text"
                  value={dropOffDeskLocation}
                  onChange={e => setDropOffDeskLocation(e.target.value)}
                  placeholder="e.g. Exit Kiosk Desk A & Volunteer Bin"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Key themes, attendee details, return schedule..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg"
                >
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Cancel Event Modal */}
      {confirmCancelEventId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm mb-2">
              <AlertTriangle className="w-5 h-5" />
              Cancel Event
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to cancel this event? Its status will be marked as Cancelled and any unissued
              allocated badges will be released.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setConfirmCancelEventId(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                No, Keep Event
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-1.5 text-xs bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-lg"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
