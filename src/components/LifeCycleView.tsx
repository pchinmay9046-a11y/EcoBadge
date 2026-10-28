import React, { useState } from 'react';
import {
  Layers,
  Factory,
  Truck,
  RotateCw,
  Recycle,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Lightbulb,
  CheckCircle2,
  Scale,
  Users,
  Compass,
} from 'lucide-react';

interface StageData {
  stageNumber: number;
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  concern: string;
  designDecision: string;
  expectedBenefit: string;
  practicalExample: string;
  designLever: string;
  userBehaviour: string;
  tradeOff: string;
}

export const LifeCycleView: React.FC = () => {
  const stages: StageData[] = [
    {
      stageNumber: 1,
      id: 'materials',
      title: 'Materials',
      subtitle: 'Feedstock & Responsible Sourcing',
      icon: Layers,
      concern:
        'Single-use PVC/vinyl pouches release phthalates, resist biodegradation for 400+ years, and generate microplastics in campus municipal waste streams.',
      designDecision:
        'Specify natural bamboo composite frames and post-consumer recycled PET (rPET) with FSC certified plantable wildflower seed paper name inserts.',
      expectedBenefit:
        'Reduces virgin petroleum polymer consumption by 88% and eliminates toxic chlorinated plastic compounds.',
      practicalExample:
        'Campus Hackathon badges use laser-etched bamboo cards and plantable seed paper attendees can take home and plant in campus pollinator gardens.',
      designLever: 'Material substitution (bio-based renewable & post-consumer recycled feedstock).',
      userBehaviour: 'Students treasure plantable seed paper rather than throwing away plastic name tags.',
      tradeOff: 'Higher initial material purchasing cost ($4.80 vs $0.35) offset through reuse cycles.',
    },
    {
      stageNumber: 2,
      id: 'manufacture',
      title: 'Manufacture',
      subtitle: 'Zero-Adhesive Modular Architecture',
      icon: Factory,
      concern:
        'Traditional badges use solvent-based adhesives, ultrasonic laminations, and non-detachable metal crimps that prevent material separation.',
      designDecision:
        'Modular snap-fit architecture without glue. Laser-etched permanent QR codes and standardized reusable organic cotton lanyard clasps.',
      expectedBenefit:
        'Disassembly time reduced to <10 seconds; allows individual component replacement without discarding the entire badge.',
      practicalExample:
        'University Makerspace 3D prints snap-in retaining clips from recycled college plastic scrap, enabling zero-waste local manufacturing.',
      designLever: 'Design for Disassembly (DfD) & modularity.',
      userBehaviour: 'Volunteers can swap damaged clips in 15 seconds at the check-in desk.',
      tradeOff: 'Requires tighter mechanical manufacturing tolerances for reliable snap-fit longevity.',
    },
    {
      stageNumber: 3,
      id: 'transport',
      title: 'Transport',
      subtitle: 'Bulk Nesting & Local Storage',
      icon: Truck,
      concern:
        'Bulky packaging, individual plastic polybags for each badge, and repeated shipping between conferences cause heavy freight carbon footprints.',
      designDecision:
        'Flat, compact interlocking badge geometry that nests tightly into reusable collegiate storage crates; localized storage on campus.',
      expectedBenefit:
        '500 badges fit in a single 14" container (70% volumetric space reduction). Zero single-use polybag packaging.',
      practicalExample:
        'Stackable plywood crates stored in the Student Union basement, rolled directly to venues on a lightweight campus handcart.',
      designLever: 'Volumetric packing efficiency & local reverse logistics.',
      userBehaviour: 'Student organizers roll crates between buildings instead of ordering new online deliveries.',
      tradeOff: 'Requires dedicated physical campus storage shelf space in student facilities.',
    },
    {
      stageNumber: 4,
      id: 'use',
      title: 'Use',
      subtitle: 'Multi-Day Comfort & Return Ergonomics',
      icon: RotateCw,
      concern:
        'Attendees find stiff badges uncomfortable, lose them during hackathons, or neglect to return them without frictionless return touchpoints.',
      designDecision:
        'Lightweight ergonomic rounded corners, smooth organic cotton lanyards, and clearly marked return instructions with high-visibility campus drop-boxes.',
      expectedBenefit:
        'Increased comfort, fewer lost badges, and a 94%+ return rate across collegiate hackathons and seminars.',
      practicalExample:
        'Volunteers station return desks right beside the dinner line and exit doors, providing instant digital check-off and campus cafe incentive points.',
      designLever: 'Ergonomic tactile appeal & intuitive return affordances.',
      userBehaviour: 'Gamified returns rewarded with campus dining credits and sustainability badges.',
      tradeOff: 'Volunteer effort required to staff collection points during peak post-event exit rush.',
    },
    {
      stageNumber: 5,
      id: 'end-of-life',
      title: 'End of Life',
      subtitle: 'Closed-Loop Material Recovery',
      icon: Recycle,
      concern:
        'Worn or broken badges end up in municipal landfills, contributing to electronic and mixed-material municipal refuse.',
      designDecision:
        'Mono-material components easily sorted: bamboo is compostable; rPET is shredded on campus into 3D printer filament; aluminum is melted down.',
      expectedBenefit:
        'True zero-landfill lifecycle. Retired badges directly supply feedstock for engineering student robotics projects.',
      practicalExample:
        'Retired badges from 2024 were granulated in the mechanical engineering lab and 3D printed into drone chassis for student coursework.',
      designLever: 'Closed-loop material cycling & cascade utilization.',
      userBehaviour: 'Students witness their old badges transformed into new campus prototypes.',
      tradeOff: 'Requires active coordination with college engineering labs for in-house shredding.',
    },
  ];

  const [activeStage, setActiveStage] = useState<number>(1);
  const currentStage = stages[activeStage - 1];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
            <span>Eco-Design Framework</span>
            <span className="text-slate-300">·</span>
            <span>Cradle-to-Cradle Methodology</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            5 Stages of Product Life-Cycle
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Analyzing environmental concerns, design decisions, user behaviors, and trade-offs from feedstock to recovery.
          </p>
        </div>
      </div>

      {/* Materials Photographic Spotlight Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-12">
        <div className="md:col-span-5 relative h-64 md:h-auto overflow-hidden bg-slate-100">
          <img
            src="/src/assets/images/badge_materials_lifecycle_1793160977596.jpg"
            alt="EcoBadge sustainable materials comparison"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Material Provenance & Circularity
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Engineered for 20+ Event Lifecycles
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Every EcoBadge balances three non-negotiables: structural durability through rigorous campus events,
              immediate biodegradability or circular recyclability at end-of-life, and frictionless separation
              between components with zero glue or permanent welds.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-xs">
            <div>
              <span className="text-slate-600 block text-[11px]">Primary Frame</span>
              <span className="font-bold text-slate-800">Bamboo / rPET</span>
            </div>
            <div>
              <span className="text-slate-600 block text-[11px]">Lanyard Ribbon</span>
              <span className="font-bold text-slate-800">Organic Cotton</span>
            </div>
            <div>
              <span className="text-slate-600 block text-[11px]">Name Insert</span>
              <span className="font-bold text-emerald-800">Plantable Seed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Desktop Horizontal Timeline / Mobile Stepper */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Life-Cycle Stages Navigator
          </h3>
          <span className="text-xs text-slate-500 font-medium">Stage {activeStage} of 5</span>
        </div>

        {/* Timeline Buttons */}
        <div className="grid grid-cols-5 gap-2 pb-2">
          {stages.map(st => {
            const IconComponent = st.icon;
            const isCurrent = st.stageNumber === activeStage;
            const isCompleted = st.stageNumber < activeStage;

            return (
              <button
                key={st.id}
                onClick={() => setActiveStage(st.stageNumber)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-emerald-900 text-white border-emerald-900 shadow-md ring-2 ring-emerald-600/30'
                    : isCompleted
                    ? 'bg-emerald-50 text-emerald-950 border-emerald-200 hover:bg-emerald-100'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      isCurrent
                        ? 'bg-emerald-800 text-emerald-200'
                        : isCompleted
                        ? 'bg-emerald-200 text-emerald-900'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    0{st.stageNumber}
                  </span>
                  <IconComponent className="w-4 h-4 shrink-0" />
                </div>
                <div className="font-bold text-xs truncate">{st.title}</div>
                <div
                  className={`text-[10px] hidden sm:block truncate ${
                    isCurrent ? 'text-emerald-200' : 'text-slate-600'
                  }`}
                >
                  {st.subtitle}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Stage Detailed Breakdown Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Stage 0{currentStage.stageNumber}
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500 font-medium">{currentStage.subtitle}</span>
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
              {currentStage.title} Phase
            </h3>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              disabled={activeStage === 1}
              onClick={() => setActiveStage(prev => Math.max(1, prev - 1))}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
            >
              ← Previous
            </button>
            <button
              disabled={activeStage === 5}
              onClick={() => setActiveStage(prev => Math.min(5, prev + 1))}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-800 hover:bg-emerald-900 text-white disabled:opacity-40 cursor-pointer"
            >
              Next Stage →
            </button>
          </div>
        </div>

        {/* 4 Core Life-Cycle Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Environmental Concern */}
          <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-900">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Environmental Concern</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {currentStage.concern}
            </p>
          </div>

          {/* Proposed Design Decision */}
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
              <Lightbulb className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Proposed Design Decision</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {currentStage.designDecision}
            </p>
          </div>

          {/* Expected Benefit */}
          <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-teal-950">
              <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
              <span>Expected Benefit</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {currentStage.expectedBenefit}
            </p>
          </div>

          {/* Practical Collegiate Example */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Practical College Example</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {currentStage.practicalExample}
            </p>
          </div>
        </div>

        {/* The 3 Core Design Considerations */}
        <div className="pt-4 border-t border-slate-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
            Key Design Considerations for this Stage
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Design Lever */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
                <Compass className="w-4 h-4 text-emerald-700" />
                <span>1. Design Lever</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                {currentStage.designLever}
              </p>
            </div>

            {/* User Behaviour */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
                <Users className="w-4 h-4 text-teal-700" />
                <span>2. User Behaviour</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                {currentStage.userBehaviour}
              </p>
            </div>

            {/* Trade-Off */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
                <Scale className="w-4 h-4 text-amber-600" />
                <span>3. Real Trade-Off</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                {currentStage.tradeOff}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
