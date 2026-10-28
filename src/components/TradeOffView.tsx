import React, { useState } from 'react';
import {
  Scale,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  RotateCcw,
  ShieldCheck,
  Truck,
  Layers,
  Sparkles,
} from 'lucide-react';

export const TradeOffView: React.FC = () => {
  // Sensitivity parameters for trade-off exploration
  const [lossRate, setLossRate] = useState<number>(5);
  const [cleaningLaborPerBadge, setCleaningLaborPerBadge] = useState<number>(0.10);
  const [targetReuses, setTargetReuses] = useState<number>(10);
  const [singleUseCost, setSingleUseCost] = useState<number>(1.75);
  const [reusableCost, setReusableCost] = useState<number>(4.80);

  // Marginal net savings calculation per use
  // Cost per use of reusable = (reusableCost / targetReuses) + 0.15 (insert) + cleaningLaborPerBadge + (lossRate/100 * reusableCost)
  const reusableCostPerUse =
    reusableCost / Math.max(1, targetReuses) +
    0.15 +
    cleaningLaborPerBadge +
    (lossRate / 100) * reusableCost;

  const netSavingsPerUse = singleUseCost - reusableCostPerUse;
  const isReusableAdvantaged = netSavingsPerUse > 0;
  const breakEvenUses = Math.ceil(
    reusableCost / Math.max(0.01, singleUseCost - (0.15 + cleaningLaborPerBadge + (lossRate / 100) * reusableCost))
  );

  const comparisonDimensions = [
    {
      title: 'Initial Capital Investment',
      disposable: 'Low / Zero upfront ($0 initial inventory; buy per event as needed).',
      reusable: 'Moderate upfront ($4.00–$6.50 per durable holder; require student budget allocation).',
      verdict: 'Disposable wins upfront, Reusable wins long-term.',
    },
    {
      title: 'Marginal Cost per Event Attendee',
      disposable: '$1.50–$2.25 per attendee every single conference or workshop.',
      reusable: '$0.15–$0.28 per attendee (compostable FSC name card insert + sanitization).',
      verdict: 'Reusable saves 80%+ operational cash per attendee after break-even.',
    },
    {
      title: 'Solid Waste Generation',
      disposable: '100% discarded into landfill or incinerator (approx. 28g PVC & polyester waste).',
      reusable: '95%+ waste reduction; only small 2g paper insert composted; holder reused 15+ times.',
      verdict: 'Reusable radically prevents municipal solid waste.',
    },
    {
      title: 'Reverse Logistics & Volunteer Labor',
      disposable: 'Zero collection effort required; bins can be placed at exit without staffing.',
      reusable: 'Requires volunteer check-in desk, return inspection, and periodic repair/sanitizing.',
      verdict: 'Disposable requires less administrative coordination.',
    },
    {
      title: 'Attendee Experience & Tactile Quality',
      disposable: 'Cheap, flimsy clear plastic sleeves prone to creasing, tearing, and flipping.',
      reusable: 'Premium bamboo/rPET feel, laser-etched texture, comfortable organic cotton lanyards.',
      verdict: 'Reusable provides superior institutional brand representation.',
    },
    {
      title: 'Break-Even Dependency',
      disposable: 'No threshold needed; flat burn rate.',
      reusable: 'Must be returned and reused at least 3 to 4 times to offset upfront manufacturing emissions.',
      verdict: 'Requires minimum return discipline to realize net eco-benefits.',
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
            <span>Critical Decision Engineering</span>
            <span className="text-slate-300">·</span>
            <span>Balanced Multi-Criteria Analysis</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Trade-Off Analysis & Sensitivity Model
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Reusable systems are not automatically superior in every scenario. Evaluate break-even thresholds and logistics costs.
          </p>
        </div>
      </div>

      {/* Balanced Nuance Callout */}
      <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 space-y-2">
        <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
          <Scale className="w-5 h-5 text-amber-700" />
          <span>The "Ecological Break-Even" Principle</span>
        </div>
        <p className="leading-relaxed text-amber-900/90 text-xs">
          Because durable reusable badges require more energy and materials during initial manufacturing than a flimsy
          disposable sleeve, <strong>a reusable badge that is discarded after a single use causes more environmental damage
          than a disposable one</strong>. The sustainability advantage is unlocked only when reverse logistics succeed and badges
          are reused at least <strong>{breakEvenUses} times</strong>.
        </p>
      </div>

      {/* Interactive Sensitivity Workbench */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Interactive Sensitivity Sliders</h3>
            <p className="text-xs text-slate-500">Test how volunteer loss rates and sanitization costs impact viability.</p>
          </div>
          <div className="text-xs">
            <span
              className={`px-3 py-1 rounded-lg font-bold ${
                isReusableAdvantaged
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {isReusableAdvantaged
                ? `Reusable is Viable (+$${netSavingsPerUse.toFixed(2)}/use)`
                : `Caution: Loss/Cleaning Costs Exceed Disposable`}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Unreturned Loss Rate */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-700">Loss / Missing Rate</span>
              <span className="font-bold font-mono text-slate-900">{lossRate}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              step="1"
              value={lossRate}
              onChange={e => setLossRate(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-700"
            />
            <span className="text-[10px] text-slate-500 block mt-1">
              Unrecovered badges that must be repurchased.
            </span>
          </div>

          {/* Sanitization / Volunteer Cost */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-700">Cleaning & Labor / Use</span>
              <span className="font-bold font-mono text-slate-900">${cleaningLaborPerBadge.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.00"
              max="0.50"
              step="0.02"
              value={cleaningLaborPerBadge}
              onChange={e => setCleaningLaborPerBadge(parseFloat(e.target.value))}
              className="w-full accent-emerald-700"
            />
            <span className="text-[10px] text-slate-500 block mt-1">
              Sanitizing wipes, inspection, and sorting labor.
            </span>
          </div>

          {/* Target Reuses */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-700">Expected Reuses / Badge</span>
              <span className="font-bold font-mono text-slate-900">{targetReuses} uses</span>
            </div>
            <input
              type="range"
              min="2"
              max="25"
              step="1"
              value={targetReuses}
              onChange={e => setTargetReuses(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-700"
            />
            <span className="text-[10px] text-slate-500 block mt-1">
              Average lifetime uses before physical retirement.
            </span>
          </div>

          {/* Single Use Cost Baseline */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-700">Single-Use Baseline Cost</span>
              <span className="font-bold font-mono text-slate-900">${singleUseCost.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="1.00"
              max="3.50"
              step="0.05"
              value={singleUseCost}
              onChange={e => setSingleUseCost(parseFloat(e.target.value))}
              className="w-full accent-emerald-700"
            />
            <span className="text-[10px] text-slate-500 block mt-1">
              Price of traditional plastic pouch badge.
            </span>
          </div>
        </div>

        {/* Dynamic Summary Strip */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-500 block text-[11px]">EcoBadge Effective Cost / Use</span>
            <span className="text-lg font-bold text-slate-900 tabular-nums">
              ${reusableCostPerUse.toFixed(2)}{' '}
              <span className="text-xs font-normal text-slate-500">per attendee</span>
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Net Savings per Attendee</span>
            <span
              className={`text-lg font-bold tabular-nums ${
                isReusableAdvantaged ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              {isReusableAdvantaged ? `+$${netSavingsPerUse.toFixed(2)}` : `-$${Math.abs(netSavingsPerUse).toFixed(2)}`}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Break-Even Threshold</span>
            <span className="text-lg font-bold text-slate-900 tabular-nums">
              {breakEvenUses} returns & reuses
            </span>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comprehensive Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50">
          <h3 className="text-base font-bold text-slate-900">
            Comparative Decision Matrix: Disposable vs. Reusable System
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Comprehensive evaluation across procurement, operations, human factors, and environmental impact.
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {comparisonDimensions.map((dim, idx) => (
            <div key={idx} className="p-5 grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
              <div className="md:col-span-3">
                <span className="font-bold text-slate-900 text-sm block">{dim.title}</span>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded inline-block mt-1">
                  {dim.verdict}
                </span>
              </div>

              <div className="md:col-span-4 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 font-bold block text-[10px] uppercase tracking-wider mb-1">
                  Single-Use Disposable Approach
                </span>
                <p className="text-slate-700 leading-relaxed">{dim.disposable}</p>
              </div>

              <div className="md:col-span-5 p-3 rounded-xl bg-emerald-50/50 border border-emerald-200">
                <span className="text-emerald-900 font-bold block text-[10px] uppercase tracking-wider mb-1">
                  EcoBadge Reusable System
                </span>
                <p className="text-slate-700 leading-relaxed">{dim.reusable}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
