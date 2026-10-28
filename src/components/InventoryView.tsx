import React, { useState } from 'react';
import { useEcoBadge } from '../context/EcoBadgeContext';
import { Badge, BadgeMaterial, BadgeCondition, BadgeStatus } from '../types';
import {
  Search,
  Filter,
  Plus,
  QrCode,
  Sparkles,
  Wrench,
  Archive,
  CheckCircle2,
  AlertTriangle,
  Layers,
  X,
} from 'lucide-react';
import { BadgeQRModal } from './BadgeQRModal';

export const InventoryView: React.FC = () => {
  const {
    badges,
    events,
    repairBadge,
    retireBadge,
    markBadgeDamaged,
    markBadgeMissing,
    addBadge,
  } = useEcoBadge();

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [materialFilter, setMaterialFilter] = useState<string>('All');
  const [conditionFilter, setConditionFilter] = useState<string>('All');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [qrModalBadge, setQrModalBadge] = useState<Badge | null>(null);
  const [confirmRetireBadge, setConfirmRetireBadge] = useState<Badge | null>(null);
  const [retireReason, setRetireReason] = useState('Completed lifecycle; sent to filament recycling.');

  // New Badge Form State
  const [newBadgeId, setNewBadgeId] = useState('');
  const [newMaterial, setNewMaterial] = useState<BadgeMaterial>('Bamboo Composite');
  const [newCost, setNewCost] = useState('4.80');
  const [newWeight, setNewWeight] = useState('24');
  const [batchCount, setBatchCount] = useState(1);

  // Filtered Badges
  const filteredBadges = badges.filter(b => {
    const matchesSearch =
      searchQuery === '' ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.currentAttendeeName && b.currentAttendeeName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    const matchesMaterial = materialFilter === 'All' || b.material === materialFilter;
    const matchesCondition = conditionFilter === 'All' || b.condition === conditionFilter;

    return matchesSearch && matchesStatus && matchesMaterial && matchesCondition;
  });

  // Summary counts
  const availableCount = badges.filter(b => b.status === 'Available').length;
  const issuedCount = badges.filter(b => b.status === 'Issued').length;
  const damagedCount = badges.filter(b => b.status === 'Damaged').length;
  const retiredCount = badges.filter(b => b.status === 'Retired').length;

  const handleAddBadgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const count = Math.max(1, Math.min(25, batchCount));

    for (let i = 0; i < count; i++) {
      const generatedId =
        count === 1 && newBadgeId.trim()
          ? newBadgeId.trim().toUpperCase()
          : `ECO-${1000 + badges.length + i + 1}`;

      addBadge({
        id: generatedId,
        material: newMaterial,
        condition: 'Pristine',
        cost: parseFloat(newCost) || 4.8,
        weightGrams: parseInt(newWeight, 10) || 24,
        purchaseDate: new Date().toISOString().split('T')[0],
        notes: 'Registered in inventory batch.',
      });
    }

    setShowAddModal(false);
    setNewBadgeId('');
    setBatchCount(1);
  };

  const handleConfirmRetire = () => {
    if (confirmRetireBadge) {
      retireBadge(confirmRetireBadge.id, retireReason);
      setConfirmRetireBadge(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
            <span>Physical Asset Registry</span>
            <span className="text-slate-300">·</span>
            <span>{badges.length} Units Cataloged</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Reusable Badge Inventory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track individual badge lifecycles, material provenance, maintenance queues, and circular reuses.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition-all self-start sm:self-center cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Badge / Batch
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-slate-500 text-[11px] block">Total Registered Assets</span>
          <span className="text-xl font-bold text-slate-900 tabular-nums">{badges.length}</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-slate-500 text-[11px] block">Available for Assignment</span>
          <span className="text-xl font-bold text-emerald-700 tabular-nums">{availableCount}</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-slate-500 text-[11px] block">In Active Loan / Event</span>
          <span className="text-xl font-bold text-teal-700 tabular-nums">{issuedCount}</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-slate-500 text-[11px] block">Maintenance / Damaged</span>
          <span className="text-xl font-bold text-rose-700 tabular-nums">{damagedCount}</span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by badge ID (e.g. ECO-1001), material, or attendee..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 shrink-0">Status:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Issued">Issued</option>
              <option value="Return Pending">Return Pending</option>
              <option value="Damaged">Damaged</option>
              <option value="Missing">Missing</option>
              <option value="Retired">Retired</option>
            </select>
          </div>

          {/* Material filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 shrink-0">Material:</span>
            <select
              value={materialFilter}
              onChange={e => setMaterialFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All">All Materials</option>
              <option value="Recycled PET (rPET)">Recycled PET (rPET)</option>
              <option value="Bamboo Composite">Bamboo Composite</option>
              <option value="Post-Consumer Ocean Plastic">Post-Consumer Ocean Plastic</option>
              <option value="Anodized Aluminum & Seed Paper">Anodized Aluminum & Seed Paper</option>
              <option value="Recycled Polycarbonate">Recycled Polycarbonate</option>
            </select>
          </div>

          {/* Condition filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 shrink-0">Condition:</span>
            <select
              value={conditionFilter}
              onChange={e => setConditionFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All">All Conditions</option>
              <option value="Pristine">Pristine</option>
              <option value="Good">Good</option>
              <option value="Minor Wear">Minor Wear</option>
              <option value="Needs Repair">Needs Repair</option>
              <option value="Damaged">Damaged</option>
            </select>
          </div>
        </div>
      </div>

      {/* Badges Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10px] tracking-wider">
                <th className="py-3 px-4">Badge ID</th>
                <th className="py-3 px-4">Material</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Condition</th>
                <th className="py-3 px-4 text-center">Verified Reuses</th>
                <th className="py-3 px-4">Current Loan / Event</th>
                <th className="py-3 px-4 text-right">Cost</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBadges.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No badges found matching the selected filters.
                  </td>
                </tr>
              ) : (
                filteredBadges.map(badge => {
                  const isAvailable = badge.status === 'Available';
                  const isIssued = badge.status === 'Issued';
                  const isPending = badge.status === 'Return Pending';
                  const isDamaged = badge.status === 'Damaged';
                  const isMissing = badge.status === 'Missing';
                  const isRetired = badge.status === 'Retired';

                  return (
                    <tr key={badge.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* ID */}
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {badge.id}
                      </td>

                      {/* Material */}
                      <td className="py-3 px-4 font-medium text-slate-700">
                        {badge.material}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded font-semibold text-[10px] ${
                            isAvailable
                              ? 'bg-emerald-100 text-emerald-800'
                              : isIssued
                              ? 'bg-teal-100 text-teal-800'
                              : isPending
                              ? 'bg-amber-100 text-amber-800'
                              : isDamaged
                              ? 'bg-rose-100 text-rose-800'
                              : isMissing
                              ? 'bg-slate-700 text-white'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {badge.status}
                        </span>
                      </td>

                      {/* Condition */}
                      <td className="py-3 px-4 text-slate-600">
                        <span
                          className={
                            badge.condition === 'Damaged' || badge.condition === 'Needs Repair'
                              ? 'text-rose-700 font-semibold'
                              : 'text-slate-700'
                          }
                        >
                          {badge.condition}
                        </span>
                      </td>

                      {/* Reuse Count */}
                      <td className="py-3 px-4 text-center tabular-nums font-bold text-emerald-800">
                        <span className="inline-flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-emerald-600" />
                          {badge.reuseCount}
                        </span>
                      </td>

                      {/* Current Loan */}
                      <td className="py-3 px-4">
                        {badge.currentAttendeeName ? (
                          <div>
                            <span className="font-semibold text-slate-900 block truncate max-w-[140px]">
                              {badge.currentAttendeeName}
                            </span>
                            <span className="text-[10px] text-slate-400 block truncate max-w-[140px]">
                              {badge.currentEventName}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">— None (In Storage) —</span>
                        )}
                      </td>

                      {/* Cost */}
                      <td className="py-3 px-4 text-right tabular-nums text-slate-700">
                        ${badge.cost.toFixed(2)}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* QR Pass */}
                          <button
                            onClick={() => setQrModalBadge(badge)}
                            title="View Scannable QR Badge"
                            className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-800 hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>

                          {/* Repair if damaged */}
                          {isDamaged && (
                            <button
                              onClick={() => repairBadge(badge.id)}
                              title="Mark as Repaired & Restore to Available"
                              className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                            >
                              <Wrench className="w-4 h-4" />
                            </button>
                          )}

                          {/* Retire button */}
                          {!isRetired && (
                            <button
                              onClick={() => setConfirmRetireBadge(badge)}
                              title="Retire badge asset for campus material recovery"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-700 hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                              <Archive className="w-4 h-4" />
                            </button>
                          )}
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

      {/* Add Badge Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Add Reusable Badge(s)</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddBadgeSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Material Specification
                </label>
                <select
                  value={newMaterial}
                  onChange={e => setNewMaterial(e.target.value as BadgeMaterial)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Bamboo Composite">Natural Bamboo Composite (2.0mm)</option>
                  <option value="Recycled PET (rPET)">Recycled Post-Consumer PET (1.0mm)</option>
                  <option value="Post-Consumer Ocean Plastic">Post-Consumer Ocean Plastic (OceanTex)</option>
                  <option value="Anodized Aluminum & Seed Paper">Anodized Aluminum Frame + Seed Paper</option>
                  <option value="Recycled Polycarbonate">Recycled Impact Polycarbonate</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Holder Cost ($)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={newCost}
                    onChange={e => setNewCost(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Weight (grams)</label>
                  <input
                    type="number"
                    value={newWeight}
                    onChange={e => setNewWeight(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Batch Quantity (1 to 25 units)
                </label>
                <input
                  type="number"
                  min="1"
                  max="25"
                  value={batchCount}
                  onChange={e => setBatchCount(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Unique sequential identifiers (e.g. ECO-{1000 + badges.length + 1}) will be auto-assigned.
                </span>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg"
                >
                  Confirm & Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Retire Dialog */}
      {confirmRetireBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm mb-2">
              <AlertTriangle className="w-5 h-5" />
              Retire Badge Asset
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to retire badge <strong className="font-mono">{confirmRetireBadge.id}</strong>?
              This badge has completed <strong>{confirmRetireBadge.reuseCount}</strong> event cycles and will be
              routed to the campus material recovery stream.
            </p>

            <div className="mt-3">
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Recovery Reason / Destination
              </label>
              <input
                type="text"
                value={retireReason}
                onChange={e => setRetireReason(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setConfirmRetireBadge(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Keep Active
              </button>
              <button
                onClick={handleConfirmRetire}
                className="px-4 py-1.5 text-xs bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-lg"
              >
                Confirm Retire
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Modal */}
      {qrModalBadge && (
        <BadgeQRModal badge={qrModalBadge} onClose={() => setQrModalBadge(null)} />
      )}
    </div>
  );
};
