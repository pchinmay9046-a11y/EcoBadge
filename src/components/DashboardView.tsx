import React from 'react';
import { useEcoBadge } from '../context/EcoBadgeContext';
import { calculateFactualDatabaseImpact } from '../utils/sustainability';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  DollarSign,
  AlertCircle,
  Clock,
  Layers,
  Award,
} from 'lucide-react';
import { NavTab } from './Navbar';

interface DashboardViewProps {
  onNavigate: (tab: NavTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { badges, assignments, events } = useEcoBadge();

  const factualImpact = calculateFactualDatabaseImpact(badges, assignments);

  // Return rate by event
  const eventStats = events.map(evt => {
    const eventAssignments = assignments.filter(a => a.eventId === evt.id);
    const returnedCount = eventAssignments.filter(a => a.status === 'Returned').length;
    const totalIssued = eventAssignments.length;
    const returnRate = totalIssued > 0 ? Math.round((returnedCount / totalIssued) * 100) : 0;
    return {
      event: evt,
      totalIssued,
      returnedCount,
      returnRate,
    };
  });

  // Circulation counts
  const availableCount = badges.filter(b => b.status === 'Available').length;
  const issuedCount = badges.filter(b => b.status === 'Issued').length;
  const pendingCount = badges.filter(b => b.status === 'Return Pending').length;
  const damagedCount = badges.filter(b => b.status === 'Damaged').length;
  const missingCount = badges.filter(b => b.status === 'Missing').length;
  const retiredCount = badges.filter(b => b.status === 'Retired').length;
  const totalBadgesCount = badges.length;

  // Cost comparison estimates
  const baselineSingleUseSpent = (factualImpact.totalVerifiedReuses + issuedCount) * 1.75;
  const reusableInvested = badges.reduce((acc, b) => acc + b.cost, 0);
  const reusableRunningCost = factualImpact.totalVerifiedReuses * 0.15; // name inserts
  const totalReusableCost = reusableInvested + reusableRunningCost;
  const costSavingsRealized = Math.max(0, baselineSingleUseSpent - totalReusableCost);

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner / Hero with Mission & Quick Actions */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white shadow-xl border border-slate-800">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img
            src="/src/assets/images/ecobadge_hero_product_1793160977272.jpg"
            alt="EcoBadge reusable badge hardware"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Campus Closed-Loop Initiative</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-300">Live Circulation Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Every Badge Deserves <br />
              <span className="text-emerald-400">Another Life.</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Replacing disposable single-use hackathon and seminar badges with durable bamboo, rPET, and
              ocean-bound composite holders. Track returns, inspect wear, and verify actual waste diversion.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => onNavigate('issue-return')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              <span>Issue / Return Hub</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('events')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm border border-slate-700 transition-colors cursor-pointer"
            >
              <span>Manage Events</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Total Badges */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1 font-medium">
            <span>Badge Assets</span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {factualImpact.totalBadges}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {availableCount} currently available
          </div>
        </div>

        {/* Currently Issued */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1 font-medium">
            <span>In Use / Issued</span>
            <span className="w-2 h-2 rounded-full bg-teal-500" />
          </div>
          <div className="text-2xl font-bold text-teal-800 tabular-nums">
            {factualImpact.issuedBadges}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Across active sessions
          </div>
        </div>

        {/* Verified Reuses */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1 font-medium">
            <span>Lifetime Reuses</span>
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-800 tabular-nums">
            {factualImpact.totalVerifiedReuses}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">
            Verified returns logged
          </div>
        </div>

        {/* Waste Avoided */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1 font-medium">
            <span>Waste Avoided</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {factualImpact.factualPlasticWasteAvoidedKg} <span className="text-sm font-normal text-slate-500">kg</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {factualImpact.disposableAvoidedActual} single-use badges saved
          </div>
        </div>

        {/* Net Cost Savings */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1 font-medium">
            <span>Net Savings</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-800 tabular-nums">
            ${costSavingsRealized.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            vs. single-use purchase
          </div>
        </div>

        {/* Return Rate */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1 font-medium">
            <span>Overall Return %</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {factualImpact.returnRatePercent}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {pendingCount + missingCount} pending/overdue
          </div>
        </div>
      </div>

      {/* Main Grid: Sustainability Score & Circulation Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sustainability Circulatory Index Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Eco-Performance
              </span>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                Defensible ISO 14040
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              Campus Circularity Score
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Calculated dynamically from return compliance (40%), asset utilization (30%), damage prevention (15%), and loss reduction (15%).
            </p>

            {/* Score Radial/Visual */}
            <div className="my-6 flex items-center justify-center">
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="#e2e8f0"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="#047857"
                    strokeWidth="10"
                    strokeDasharray={263.89}
                    strokeDashoffset={263.89 - (263.89 * factualImpact.sustainabilityScore) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center px-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tabular-nums leading-none">
                    {factualImpact.sustainabilityScore}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider mt-1 max-w-[120px] leading-tight">
                    {factualImpact.sustainabilityScore >= 80
                      ? 'Grade A (Closed-Loop)'
                      : factualImpact.sustainabilityScore >= 65
                      ? 'Grade B (Advancing)'
                      : 'Grade C (Starting)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Factor breakdown */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-600">
                <span>Attendee Return Compliance</span>
                <span className="font-semibold tabular-nums text-slate-900">{factualImpact.returnRatePercent}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: `${factualImpact.returnRatePercent}%` }} />
              </div>

              <div className="flex justify-between items-center text-slate-600 pt-1">
                <span>Reusable Asset Integrity</span>
                <span className="font-semibold tabular-nums text-slate-900">
                  {Math.round(((totalBadgesCount - damagedCount) / Math.max(1, totalBadgesCount)) * 100)}%
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-teal-600 h-1.5 rounded-full"
                  style={{ width: `${Math.round(((totalBadgesCount - damagedCount) / Math.max(1, totalBadgesCount)) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
            <span className="text-slate-500">Methodology strictly separates measured reuses from projections.</span>
          </div>
        </div>

        {/* Badge Circulation Breakdown Visual */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Physical Inventory Distribution
              </span>
              <button
                onClick={() => onNavigate('inventory')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 hover:underline cursor-pointer"
              >
                Inspect All Assets →
              </button>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              Badge Asset State Breakdown
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Current live status of all registered badges across campus venues.
            </p>

            {/* Segmented Bar */}
            <div className="my-5">
              <div className="h-6 w-full rounded-xl overflow-hidden flex bg-slate-100 shadow-inner">
                {availableCount > 0 && (
                  <div
                    style={{ width: `${(availableCount / totalBadgesCount) * 100}%` }}
                    className="bg-emerald-600 transition-all hover:opacity-90 relative group"
                    title={`Available: ${availableCount}`}
                  />
                )}
                {issuedCount > 0 && (
                  <div
                    style={{ width: `${(issuedCount / totalBadgesCount) * 100}%` }}
                    className="bg-teal-500 transition-all hover:opacity-90 relative group"
                    title={`Issued: ${issuedCount}`}
                  />
                )}
                {pendingCount > 0 && (
                  <div
                    style={{ width: `${(pendingCount / totalBadgesCount) * 100}%` }}
                    className="bg-amber-500 transition-all hover:opacity-90 relative group"
                    title={`Return Pending: ${pendingCount}`}
                  />
                )}
                {damagedCount > 0 && (
                  <div
                    style={{ width: `${(damagedCount / totalBadgesCount) * 100}%` }}
                    className="bg-rose-500 transition-all hover:opacity-90 relative group"
                    title={`Damaged: ${damagedCount}`}
                  />
                )}
                {missingCount > 0 && (
                  <div
                    style={{ width: `${(missingCount / totalBadgesCount) * 100}%` }}
                    className="bg-slate-700 transition-all hover:opacity-90 relative group"
                    title={`Missing: ${missingCount}`}
                  />
                )}
                {retiredCount > 0 && (
                  <div
                    style={{ width: `${(retiredCount / totalBadgesCount) * 100}%` }}
                    className="bg-slate-400 transition-all hover:opacity-90 relative group"
                    title={`Retired: ${retiredCount}`}
                  />
                )}
              </div>

              {/* Legend Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mt-4 text-xs">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="w-3 h-3 rounded-md bg-emerald-600 shrink-0" />
                  <div>
                    <span className="text-slate-500 block text-[11px]">Available</span>
                    <span className="font-bold text-slate-800 tabular-nums">{availableCount}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="w-3 h-3 rounded-md bg-teal-500 shrink-0" />
                  <div>
                    <span className="text-slate-500 block text-[11px]">Issued</span>
                    <span className="font-bold text-slate-800 tabular-nums">{issuedCount}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="w-3 h-3 rounded-md bg-amber-500 shrink-0" />
                  <div>
                    <span className="text-slate-500 block text-[11px]">Pending</span>
                    <span className="font-bold text-slate-800 tabular-nums">{pendingCount}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="w-3 h-3 rounded-md bg-rose-500 shrink-0" />
                  <div>
                    <span className="text-slate-500 block text-[11px]">Damaged</span>
                    <span className="font-bold text-slate-800 tabular-nums">{damagedCount}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="w-3 h-3 rounded-md bg-slate-700 shrink-0" />
                  <div>
                    <span className="text-slate-500 block text-[11px]">Missing</span>
                    <span className="font-bold text-slate-800 tabular-nums">{missingCount}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="w-3 h-3 rounded-md bg-slate-400 shrink-0" />
                  <div>
                    <span className="text-slate-500 block text-[11px]">Retired</span>
                    <span className="font-bold text-slate-800 tabular-nums">{retiredCount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Return Rates Table */}
            <div className="mt-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                Event-Wise Badge Return Progress
              </h4>
              <div className="space-y-3">
                {eventStats.map(({ event, totalIssued, returnedCount, returnRate }) => (
                  <div key={event.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-semibold text-slate-900">{event.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 tabular-nums">
                          {returnedCount} of {totalIssued} returned
                        </span>
                        <span
                          className={`font-bold px-1.5 py-0.5 rounded text-[11px] ${
                            returnRate >= 90
                              ? 'bg-emerald-100 text-emerald-800'
                              : returnRate >= 60
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {returnRate}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${returnRate}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Updates in real-time on every return & check-in.</span>
            <button
              onClick={() => onNavigate('calculator')}
              className="font-medium text-emerald-800 hover:text-emerald-950 hover:underline cursor-pointer"
            >
              Parametric Impact Calculator →
            </button>
          </div>
        </div>
      </div>

      {/* Comparison: Disposable vs Reusable Cost & Environmental Curve */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Economics Comparison
            </span>
            <span className="text-xs text-emerald-700 font-medium">Break-Even @ 3 Uses</span>
          </div>
          <h3 className="text-base font-bold text-slate-900 mt-1">
            Disposable vs. EcoBadge Cost Curve
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Disposable single-use badges incur continuous per-event linear cost ($1.75/badge). EcoBadge amortizes initial holder manufacturing by event cycle 3.
          </p>

          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between text-xs p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <span className="font-semibold text-slate-800 block">Single-Use Disposable Baseline</span>
                <span className="text-slate-500 text-[11px]">$1.75 per disposable badge assembly</span>
              </div>
              <span className="text-sm font-bold text-rose-700 tabular-nums">
                ${baselineSingleUseSpent.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs p-3 bg-emerald-50/70 rounded-xl border border-emerald-200">
              <div>
                <span className="font-semibold text-emerald-900 block">EcoBadge System Actuals</span>
                <span className="text-emerald-700 text-[11px]">Holders + FSC Paper Inserts + Replacements</span>
              </div>
              <span className="text-sm font-bold text-emerald-900 tabular-nums">
                ${totalReusableCost.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs p-3 bg-teal-50/80 rounded-xl border border-teal-200 font-semibold text-teal-900">
              <span>Net College Savings to Date</span>
              <span className="text-base font-extrabold text-teal-950 tabular-nums">
                +${costSavingsRealized.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Volunteer Desk Action Shortcut */}
        <div className="bg-linear-to-br from-emerald-900 to-slate-900 text-white p-6 rounded-2xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              <span>Event Volunteer Fast Desk</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1">
              Active Check-In & Return Queue
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Fast-track attendee registration, assign available badges with zero duplicates, or inspect returned badges and restore them to available status.
            </p>

            <div className="my-5 grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white/10 border border-white/15">
                <span className="text-slate-400 block text-[11px]">Awaiting Return</span>
                <span className="text-xl font-bold text-amber-300 tabular-nums">{pendingCount} badges</span>
              </div>
              <div className="p-3 rounded-xl bg-white/10 border border-white/15">
                <span className="text-slate-400 block text-[11px]">Ready to Issue</span>
                <span className="text-xl font-bold text-emerald-300 tabular-nums">{availableCount} badges</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('issue-return')}
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs text-center transition-colors cursor-pointer"
            >
              Open Volunteer Station
            </button>
            <button
              onClick={() => onNavigate('reminders')}
              className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs border border-white/20 transition-colors cursor-pointer"
            >
              Drop-Off Desks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
