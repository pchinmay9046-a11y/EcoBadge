import React, { useState, useMemo } from 'react';
import { calculateImpactMetrics } from '../utils/sustainability';
import { ImpactCalculatorInputs } from '../types';
import {
  TrendingUp,
  DollarSign,
  Layers,
  Sparkles,
  HelpCircle,
  RotateCcw,
  CheckCircle2,
  Info,
} from 'lucide-react';

export const ImpactCalculatorView: React.FC = () => {
  const defaultInputs: ImpactCalculatorInputs = {
    attendees: 300,
    eventsCount: 6,
    disposableBadgeCost: 1.85,
    reusableHolderCost: 4.80,
    replacementInsertCost: 0.18,
    holderReusesTarget: 12,
    badgeWeightGrams: 24,
    disposableWeightGrams: 28,
    recyclingLossRatePercent: 4,
  };

  const [inputs, setInputs] = useState<ImpactCalculatorInputs>(defaultInputs);

  const results = useMemo(() => calculateImpactMetrics(inputs), [inputs]);

  const handleChange = (field: keyof ImpactCalculatorInputs, val: number) => {
    setInputs(prev => ({ ...prev, [field]: val }));
  };

  // Generate comparison curve across 1 to 12 events
  const curvePoints = useMemo(() => {
    const points = [];
    const maxEvents = Math.max(8, inputs.eventsCount + 2);
    for (let evt = 1; evt <= maxEvents; evt++) {
      const calc = calculateImpactMetrics({ ...inputs, eventsCount: evt });
      points.push({
        eventNum: evt,
        disposableCost: calc.disposableSystemCost,
        reusableCost: calc.reusableSystemCost,
        netSavings: calc.netSavings,
      });
    }
    return points;
  }, [inputs]);

  const maxCost = Math.max(
    ...curvePoints.map(p => Math.max(p.disposableCost, p.reusableCost)),
    100
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
            <span>Life-Cycle Assessment (LCA) Model</span>
            <span className="text-slate-300">·</span>
            <span>Transparent Mathematical Rigor</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Sustainability & Financial Impact Calculator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Model college event savings and plastic waste diversion with customizable institutional variables.
          </p>
        </div>

        <button
          onClick={() => setInputs(defaultInputs)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors self-start sm:self-center cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Baseline Values
        </button>
      </div>

      {/* Main Grid: Parameters on Left, Outputs on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 5 Cols: Sliders & Parameter Inputs */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Parametric Assumptions
            </h3>
            <span className="text-[11px] text-slate-500">Live recalculation</span>
          </div>

          {/* Attendees per Event */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-700">Attendees per Event</span>
              <span className="font-mono font-bold text-slate-900 tabular-nums">
                {inputs.attendees} attendees
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="1500"
              step="25"
              value={inputs.attendees}
              onChange={e => handleChange('attendees', parseInt(e.target.value, 10))}
              className="w-full accent-emerald-700"
            />
          </div>

          {/* Events per Year */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-700">Events per Academic Cycle</span>
              <span className="font-mono font-bold text-slate-900 tabular-nums">
                {inputs.eventsCount} events
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="24"
              step="1"
              value={inputs.eventsCount}
              onChange={e => handleChange('eventsCount', parseInt(e.target.value, 10))}
              className="w-full accent-emerald-700"
            />
          </div>

          {/* Single-Use Disposable Cost */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-700">Single-Use Badge Assembly Cost</span>
              <span className="font-mono font-bold text-slate-900 tabular-nums">
                ${inputs.disposableBadgeCost.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0.75"
              max="4.00"
              step="0.05"
              value={inputs.disposableBadgeCost}
              onChange={e => handleChange('disposableBadgeCost', parseFloat(e.target.value))}
              className="w-full accent-emerald-700"
            />
            <span className="text-[10px] text-slate-600 block mt-0.5">
              Includes PVC pouch, metal clip, polyester lanyard, and printing.
            </span>
          </div>

          {/* Reusable Holder Unit Cost */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-700">EcoBadge Reusable Holder Capital Cost</span>
              <span className="font-mono font-bold text-slate-900 tabular-nums">
                ${inputs.reusableHolderCost.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="2.50"
              max="9.00"
              step="0.10"
              value={inputs.reusableHolderCost}
              onChange={e => handleChange('reusableHolderCost', parseFloat(e.target.value))}
              className="w-full accent-emerald-700"
            />
            <span className="text-[10px] text-slate-600 block mt-0.5">
              Durable bamboo/rPET casing + organic cotton clip lanyard.
            </span>
          </div>

          {/* Replacement Insert Cost */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-700">Replacement Name Insert Cost</span>
              <span className="font-mono font-bold text-slate-900 tabular-nums">
                ${inputs.replacementInsertCost.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.60"
              step="0.01"
              value={inputs.replacementInsertCost}
              onChange={e => handleChange('replacementInsertCost', parseFloat(e.target.value))}
              className="w-full accent-emerald-700"
            />
            <span className="text-[10px] text-slate-600 block mt-0.5">
              Compostable FSC certified recycled card / plantable seed paper.
            </span>
          </div>

          {/* Unreturned / Loss Rate Allowance */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-700">Unreturned Loss / Damage Allowance</span>
              <span className="font-mono font-bold text-slate-900 tabular-nums">
                {inputs.recyclingLossRatePercent}%
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              step="1"
              value={inputs.recyclingLossRatePercent}
              onChange={e => handleChange('recyclingLossRatePercent', parseInt(e.target.value, 10))}
              className="w-full accent-emerald-700"
            />
            <span className="text-[10px] text-slate-600 block mt-0.5">
              Realistic safety buffer for lost or damaged badge replacements.
            </span>
          </div>
        </div>

        {/* Right 7 Cols: Results & Break-Even Visual */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top Result KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-slate-500 text-[11px] block">Estimated Net Savings</span>
              <span className="text-2xl font-extrabold text-emerald-800 tabular-nums">
                ${results.netSavings.toLocaleString()}
              </span>
              <span className="text-[11px] text-emerald-800 block mt-0.5">
                Over {inputs.eventsCount} events
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-slate-500 text-[11px] block">Plastic Waste Avoided</span>
              <span className="text-2xl font-extrabold text-teal-800 tabular-nums">
                {results.materialWasteAvoidedKg}{' '}
                <span className="text-sm font-normal text-slate-500">kg</span>
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                {results.disposableBadgesAvoided.toLocaleString()} single-use badges
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs col-span-2 sm:col-span-1">
              <span className="text-slate-500 text-[11px] block">Break-Even Point</span>
              <span className="text-2xl font-extrabold text-slate-900 tabular-nums">
                {results.breakEvenEvents}{' '}
                <span className="text-sm font-normal text-slate-500">events</span>
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                ~{results.breakEvenReusesPerHolder} reuses per holder
              </span>
            </div>
          </div>

          {/* Interactive Cost Curve Chart (Pure SVG, zero lag) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Cumulative Cost Projection (1 to {curvePoints.length} Events)
                </h3>
                <p className="text-xs text-slate-500">
                  Break-even occurs when the green EcoBadge curve drops below the red single-use baseline.
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-rose-600 rounded-full" />
                  <span className="text-slate-600">Single-Use</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-emerald-700 rounded-full" />
                  <span className="text-slate-600">EcoBadge</span>
                </div>
              </div>
            </div>

            {/* SVG Chart */}
            <div className="w-full h-56 pt-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200">
                {/* Grid horizontal lines */}
                {[0, 50, 100, 150].map(y => (
                  <line
                    key={y}
                    x1="40"
                    y1={y}
                    x2="480"
                    y2={y}
                    stroke="#f1f5f9"
                    strokeWidth="1"
                  />
                ))}

                {/* Y-axis labels */}
                <text x="32" y="15" fill="#94a3b8" fontSize="10" textAnchor="end">
                  ${Math.round(maxCost)}
                </text>
                <text x="32" y="105" fill="#94a3b8" fontSize="10" textAnchor="end">
                  ${Math.round(maxCost / 2)}
                </text>
                <text x="32" y="195" fill="#94a3b8" fontSize="10" textAnchor="end">
                  $0
                </text>

                {/* Single-Use Polyline (Linear upward) */}
                <polyline
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  points={curvePoints
                    .map((p, idx) => {
                      const x = 40 + (idx / (curvePoints.length - 1)) * 440;
                      const y = 190 - (p.disposableCost / maxCost) * 175;
                      return `${x},${Math.max(15, y)}`;
                    })
                    .join(' ')}
                />

                {/* Reusable Polyline (Higher start due to capital, then flat slow rise) */}
                <polyline
                  fill="none"
                  stroke="#047857"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  points={curvePoints
                    .map((p, idx) => {
                      const x = 40 + (idx / (curvePoints.length - 1)) * 440;
                      const y = 190 - (p.reusableCost / maxCost) * 175;
                      return `${x},${Math.max(15, y)}`;
                    })
                    .join(' ')}
                />

                {/* Points on Reusable */}
                {curvePoints.map((p, idx) => {
                  const x = 40 + (idx / (curvePoints.length - 1)) * 440;
                  const y = 190 - (p.reusableCost / maxCost) * 175;
                  const isCurrent = p.eventNum === inputs.eventsCount;

                  return (
                    <g key={idx}>
                      <circle
                        cx={x}
                        cy={Math.max(15, y)}
                        r={isCurrent ? 5 : 3}
                        fill={isCurrent ? '#047857' : '#ffffff'}
                        stroke="#047857"
                        strokeWidth="2"
                      />
                      <text
                        x={x}
                        y="205"
                        fill={isCurrent ? '#047857' : '#94a3b8'}
                        fontWeight={isCurrent ? 'bold' : 'normal'}
                        fontSize="9"
                        textAnchor="middle"
                      >
                        Evt {p.eventNum}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Transparent Formula & Methodology Explanation */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs space-y-3">
            <div className="flex items-center gap-1.5 text-slate-800 font-bold">
              <Info className="w-4 h-4 text-emerald-700" />
              <span>Transparent Formula Disclosure</span>
            </div>

            <div className="space-y-1.5 font-mono text-[11px] text-slate-600 bg-white p-3 rounded-xl border border-slate-200">
              <div>
                <strong>Single-Use Cost:</strong> {inputs.attendees} attendees × {inputs.eventsCount} events × $
                {inputs.disposableBadgeCost.toFixed(2)} = ${results.disposableSystemCost.toFixed(2)}
              </div>
              <div className="pt-1 border-t border-slate-100">
                <strong>Reusable System Cost:</strong> Holders Capital (${inputs.reusableHolderCost} ×{' '}
                {Math.ceil(inputs.attendees * (1 + inputs.recyclingLossRatePercent / 100))}) + Inserts ($
                {inputs.replacementInsertCost} × {inputs.attendees * inputs.eventsCount}) + Loss Reserve = $
                {results.reusableSystemCost.toFixed(2)}
              </div>
              <div className="pt-1 border-t border-slate-100 text-emerald-800 font-bold">
                <strong>Net Realized Savings:</strong> ${results.disposableSystemCost.toFixed(2)} − $
                {results.reusableSystemCost.toFixed(2)} = +${results.netSavings.toFixed(2)}
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              * Note: Calculations represent parametric life-cycle estimates. True operational savings depend on
              actual campus return rates and volunteer collection desk compliance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
