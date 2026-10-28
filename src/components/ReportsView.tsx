import React, { useState } from 'react';
import { useEcoBadge } from '../context/EcoBadgeContext';
import { calculateFactualDatabaseImpact } from '../utils/sustainability';
import {
  FileText,
  Download,
  Filter,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  TrendingUp,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { events, badges, assignments } = useEcoBadge();

  const [selectedEventId, setSelectedEventId] = useState<string>('All');
  const [reportType, setReportType] = useState<
    'event-summary' | 'inventory-status' | 'damaged-missing' | 'reuse-impact'
  >('event-summary');

  const factualImpact = calculateFactualDatabaseImpact(badges, assignments);

  // Filtered assignments based on selected event
  const filteredAssignments = assignments.filter(a => {
    if (selectedEventId === 'All') return true;
    return a.eventId === selectedEventId;
  });

  // Export CSV handler
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';

    if (reportType === 'event-summary') {
      csvContent += 'Event ID,Event Name,Date,Expected Attendees,Badges Issued,Badges Returned,Return Rate %,Plastic Waste Avoided (kg)\n';
      events.forEach(evt => {
        const asgns = assignments.filter(a => a.eventId === evt.id);
        const returned = asgns.filter(a => a.status === 'Returned').length;
        const rate = asgns.length > 0 ? Math.round((returned / asgns.length) * 100) : 0;
        const kg = Math.round(returned * 0.028 * 100) / 100;
        csvContent += `"${evt.id}","${evt.name}","${evt.date}",${evt.expectedAttendees},${asgns.length},${returned},${rate}%,${kg}\n`;
      });
    } else if (reportType === 'inventory-status') {
      csvContent += 'Badge ID,Material,Status,Condition,Lifetime Reuses,Unit Cost ($),Current Attendee,Current Event\n';
      badges.forEach(b => {
        csvContent += `"${b.id}","${b.material}","${b.status}","${b.condition}",${b.reuseCount},${b.cost},"${b.currentAttendeeName || 'None'}","${b.currentEventName || 'Storage'}"\n`;
      });
    } else if (reportType === 'damaged-missing') {
      csvContent += 'Badge ID,Status,Condition,Material,Reuses Prior,Purchase Date,Notes\n';
      badges
        .filter(b => b.status === 'Damaged' || b.status === 'Missing' || b.status === 'Retired')
        .forEach(b => {
          csvContent += `"${b.id}","${b.status}","${b.condition}","${b.material}",${b.reuseCount},"${b.purchaseDate}","${b.notes || ''}"\n`;
        });
    } else {
      // reuse-impact
      csvContent += 'Metric,Value,Unit,Calculation Source\n';
      csvContent += `Total Physical Badges,${factualImpact.totalBadges},units,Registry Database\n`;
      csvContent += `Verified Lifetime Reuses,${factualImpact.totalVerifiedReuses},cycles,Logged Returns\n`;
      csvContent += `Plastic Waste Diverted,${factualImpact.factualPlasticWasteAvoidedKg},kg,28g single-use baseline\n`;
      csvContent += `Net Financial Savings,$${factualImpact.netSavingsActual.toFixed(2)},USD,Disposable - Insert costs\n`;
      csvContent += `Circularity Compliance Score,${factualImpact.sustainabilityScore},/100,Weighted ISO 14040 metric\n`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ecobadge_${reportType}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
            <span>Institutional Accountability</span>
            <span className="text-slate-300">·</span>
            <span>Verifiable ESG Audit Data</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Reports & Sustainability Audits
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Export structured CSV data and generate comprehensive circularity summaries for college administration.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition-all self-start sm:self-center cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Export Report to CSV
        </button>
      </div>

      {/* Report Type Selector Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { id: 'event-summary', title: 'Event Circulation', desc: 'Return rates & waste per event' },
          { id: 'inventory-status', title: 'Badge Assets', desc: 'Materials, condition & reuses' },
          { id: 'damaged-missing', title: 'Damages & Losses', desc: 'Repair queue & recovery rates' },
          { id: 'reuse-impact', title: 'Sustainability Score', desc: 'LCA waste & financial savings' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setReportType(tab.id as any)}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              reportType === tab.id
                ? 'bg-emerald-900 text-white border-emerald-900 shadow-xs'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <span className="font-bold text-xs block">{tab.title}</span>
            <span
              className={`text-[11px] block mt-0.5 ${
                reportType === tab.id ? 'text-emerald-200' : 'text-slate-500'
              }`}
            >
              {tab.desc}
            </span>
          </button>
        ))}
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-slate-700">Filter Event Scope:</span>
          <select
            value={selectedEventId}
            onChange={e => setSelectedEventId(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg"
          >
            <option value="All">All Campus Events</option>
            {events.map(e => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </div>

        <span className="text-slate-500 hidden sm:inline text-[11px]">
          Data sourced dynamically from active and archived state records.
        </span>
      </div>

      {/* Report Table Display */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm capitalize">
              {reportType.replace('-', ' ')} Audit Table
            </h3>
            <span className="text-xs text-slate-500">Live query result</span>
          </div>
          <span className="text-xs font-mono font-medium text-slate-500">
            {new Date().toISOString().split('T')[0]}
          </span>
        </div>

        <div className="overflow-x-auto">
          {reportType === 'event-summary' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="py-3 px-4">Event Name</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Badges Issued</th>
                  <th className="py-3 px-4">Badges Returned</th>
                  <th className="py-3 px-4">Return Compliance</th>
                  <th className="py-3 px-4 text-right">Plastic Avoided</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events
                  .filter(e => selectedEventId === 'All' || e.id === selectedEventId)
                  .map(evt => {
                    const evtAsgns = assignments.filter(a => a.eventId === evt.id);
                    const returned = evtAsgns.filter(a => a.status === 'Returned').length;
                    const rate = evtAsgns.length > 0 ? Math.round((returned / evtAsgns.length) * 100) : 0;
                    const plasticKg = Math.round(returned * 0.028 * 100) / 100;

                    return (
                      <tr key={evt.id} className="hover:bg-slate-50/70">
                        <td className="py-3 px-4 font-bold text-slate-900">{evt.name}</td>
                        <td className="py-3 px-4 text-slate-500">{evt.date}</td>
                        <td className="py-3 px-4 font-mono">{evtAsgns.length}</td>
                        <td className="py-3 px-4 font-mono">{returned}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                              rate >= 90 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {rate}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right tabular-nums font-bold text-emerald-800">
                          {plasticKg} kg
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          )}

          {reportType === 'inventory-status' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="py-3 px-4">Badge ID</th>
                  <th className="py-3 px-4">Material</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Condition</th>
                  <th className="py-3 px-4">Lifetime Reuses</th>
                  <th className="py-3 px-4 text-right">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {badges.slice(0, 15).map(b => (
                  <tr key={b.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{b.id}</td>
                    <td className="py-3 px-4 text-slate-700">{b.material}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{b.condition}</td>
                    <td className="py-3 px-4 font-bold text-emerald-800 tabular-nums">{b.reuseCount} uses</td>
                    <td className="py-3 px-4 text-right tabular-nums text-slate-700">${b.cost.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'damaged-missing' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="py-3 px-4">Badge ID</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Material</th>
                  <th className="py-3 px-4">Prior Reuses</th>
                  <th className="py-3 px-4">Notes / Recovery Route</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {badges
                  .filter(b => b.status === 'Damaged' || b.status === 'Missing' || b.status === 'Retired')
                  .map(b => (
                    <tr key={b.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{b.id}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            b.status === 'Damaged'
                              ? 'bg-rose-100 text-rose-800'
                              : b.status === 'Missing'
                              ? 'bg-slate-800 text-white'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700">{b.material}</td>
                      <td className="py-3 px-4 tabular-nums font-bold text-slate-800">{b.reuseCount}</td>
                      <td className="py-3 px-4 text-slate-600">{b.notes || '—'}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}

          {reportType === 'reuse-impact' && (
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block">Single-Use Badges Avoided</span>
                  <span className="text-2xl font-bold text-slate-900 tabular-nums">
                    {factualImpact.disposableAvoidedActual}
                  </span>
                </div>
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="text-emerald-800 block font-medium">Plastic Waste Diverted</span>
                  <span className="text-2xl font-bold text-emerald-900 tabular-nums">
                    {factualImpact.factualPlasticWasteAvoidedKg} kg
                  </span>
                </div>
                <div className="p-4 bg-teal-50 rounded-xl border border-teal-200">
                  <span className="text-teal-800 block font-medium">Net Realized Cash Savings</span>
                  <span className="text-2xl font-bold text-teal-900 tabular-nums">
                    ${factualImpact.netSavingsActual.toFixed(2)}
                  </span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block">Circularity Index</span>
                  <span className="text-2xl font-bold text-slate-900 tabular-nums">
                    {factualImpact.sustainabilityScore} / 100
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 text-xs text-slate-600 leading-relaxed border border-slate-200">
                <strong>Auditor Certification Statement:</strong> Figures in this report reflect actual check-in and return
                scans recorded in the local application state. Estimates for single-use plastic diversion are based on 28g per
                disposable badge assembly (polyvinyl chloride card sleeve + polyester lanyard).
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
