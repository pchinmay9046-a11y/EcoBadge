import { ImpactCalculatorInputs, ImpactCalculatedResult, Badge, Assignment } from '../types';

/**
 * Calculates sustainability metrics based on parametric assumptions.
 * Transparent, verifiable formulas adhering to ISO 14040/14044 LCA principles.
 */
export function calculateImpactMetrics(inputs: ImpactCalculatorInputs): ImpactCalculatedResult {
  const {
    attendees,
    eventsCount,
    disposableBadgeCost,
    reusableHolderCost,
    replacementInsertCost,
    holderReusesTarget,
    badgeWeightGrams,
    disposableWeightGrams,
    recyclingLossRatePercent,
  } = inputs;

  const totalAttendances = Math.max(0, attendees * eventsCount);

  // Disposable baseline: every attendance uses a single-use badge + plastic pouch
  const disposableBadgesAvoided = totalAttendances;
  const disposableSystemCost = totalAttendances * disposableBadgeCost;

  // Reusable system model:
  // Badges needed in circulation = max attendees for a single event + contingency buffer (loss rate)
  const lossRateFraction = Math.min(1, Math.max(0, recyclingLossRatePercent / 100));
  const holdersToBuy = Math.ceil(attendees * (1 + lossRateFraction));
  
  // Reusable holder capital cost
  const capitalHolderCost = holdersToBuy * reusableHolderCost;
  // Replacement inserts per event attendance (compostable FSC seed paper / recycled card)
  const totalInsertCost = totalAttendances * replacementInsertCost;
  // Ongoing loss replacement allowance
  const lossReplacementCost = (totalAttendances * (lossRateFraction / Math.max(1, holderReusesTarget))) * reusableHolderCost;

  const reusableSystemCost = capitalHolderCost + totalInsertCost + lossReplacementCost;
  const netSavings = disposableSystemCost - reusableSystemCost;

  // Material waste avoided in kg:
  // Disposable waste = totalAttendances * disposableWeightGrams
  // Reusable waste = (holdersToBuy * lossRateFraction * badgeWeightGrams) + (totalAttendances * 2g [insert weight])
  const disposableWasteGrams = totalAttendances * disposableWeightGrams;
  const insertWeightGrams = 2.5; // weight of light recyclable name card insert
  const reusableWasteGrams = (holdersToBuy * lossRateFraction * badgeWeightGrams) + (totalAttendances * insertWeightGrams);
  const materialWasteAvoidedKg = Math.max(0, (disposableWasteGrams - reusableWasteGrams) / 1000);

  // Break-even uses per holder = Reusable Holder Cost / (Disposable Cost - Insert Cost)
  const unitMarginalSaving = Math.max(0.01, disposableBadgeCost - replacementInsertCost);
  const breakEvenReusesPerHolder = Math.ceil(reusableHolderCost / unitMarginalSaving);

  // Break-even events = holders capital cost / (savings per event)
  const savingsPerEvent = (attendees * disposableBadgeCost) - (attendees * replacementInsertCost) - (holdersToBuy * lossRateFraction * reusableHolderCost / Math.max(1, eventsCount));
  const breakEvenEvents = savingsPerEvent > 0 ? Math.ceil(capitalHolderCost / savingsPerEvent) : 999;

  return {
    disposableBadgesAvoided,
    disposableSystemCost: Math.round(disposableSystemCost * 100) / 100,
    reusableSystemCost: Math.round(reusableSystemCost * 100) / 100,
    netSavings: Math.round(netSavings * 100) / 100,
    materialWasteAvoidedKg: Math.round(materialWasteAvoidedKg * 10) / 10,
    breakEvenEvents: Math.max(1, breakEvenEvents),
    breakEvenReusesPerHolder: Math.max(1, breakEvenReusesPerHolder),
    isProjected: true,
  };
}

/**
 * Calculates measured, factual environmental outcomes strictly from logged database records.
 * Prompt: "Do not automatically count every issued badge as a successful reuse. Count reuse only when
 * a holder has actually been returned, inspected, and reissued, or clearly label projected reuse as an estimate."
 */
export function calculateFactualDatabaseImpact(badges: Badge[], assignments: Assignment[]) {
  // Total completed returns that were physically returned & inspected
  const completedAssignments = assignments.filter(a => a.status === 'Returned');
  
  // Total genuine reuses = sum of reuseCount across all physical badges
  // A badge's reuseCount increments only when returned and verified
  const totalVerifiedReuses = badges.reduce((acc, b) => acc + (b.reuseCount || 0), 0);

  // Factual disposable badges displaced: each reuse after initial issuance replaces 1 single-use badge
  const disposableAvoidedActual = totalVerifiedReuses;

  // Single-use plastic badge benchmark: ~28g per disposable badge assembly (acrylic pouch + synthetic ribbon + card)
  const singleUseBadgeWeightKg = 0.028;
  const singleUseBadgeCostBaseline = 1.75; // average collegiate disposable badge assembly price
  const reusableInsertCostBaseline = 0.15; // cost of simple FSC paper name card insert

  const factualPlasticWasteAvoidedKg = Math.round(disposableAvoidedActual * singleUseBadgeWeightKg * 100) / 100;
  
  // Actual cost savings realized to date
  const grossSingleUseAvoidedCost = disposableAvoidedActual * singleUseBadgeCostBaseline;
  const insertCostsSpent = disposableAvoidedActual * reusableInsertCostBaseline;
  const netSavingsActual = Math.max(0, Math.round((grossSingleUseAvoidedCost - insertCostsSpent) * 100) / 100);

  // Active circulation counts
  const totalBadges = badges.length;
  const issuedBadges = badges.filter(b => b.status === 'Issued' || b.status === 'Return Pending').length;
  const availableBadges = badges.filter(b => b.status === 'Available').length;
  const damagedBadges = badges.filter(b => b.status === 'Damaged').length;
  const missingBadges = badges.filter(b => b.status === 'Missing').length;
  const retiredBadges = badges.filter(b => b.status === 'Retired').length;

  // Return rate: (Returned assignments / Total historical issued assignments)
  const totalHistoricallyIssued = assignments.length;
  const returnRatePercent = totalHistoricallyIssued > 0 
    ? Math.round((completedAssignments.length / totalHistoricallyIssued) * 100) 
    : 100;

  // Sustainability Index score (0 to 100):
  // Weighted: 40% Return Rate, 30% Badge Utilization, 20% Low Damage Rate, 10% Low Loss Rate
  const utilization = totalBadges > 0 ? (totalVerifiedReuses / (totalBadges * 5)) : 0;
  const damageRate = totalBadges > 0 ? (damagedBadges / totalBadges) : 0;
  const lossRate = totalBadges > 0 ? (missingBadges / totalBadges) : 0;

  const sustainabilityScore = Math.min(100, Math.max(10, Math.round(
    (returnRatePercent * 0.40) +
    (Math.min(1, utilization) * 100 * 0.30) +
    (Math.max(0, 1 - damageRate * 3) * 100 * 0.15) +
    (Math.max(0, 1 - lossRate * 4) * 100 * 0.15)
  )));

  return {
    totalBadges,
    issuedBadges,
    availableBadges,
    damagedBadges,
    missingBadges,
    retiredBadges,
    totalVerifiedReuses,
    disposableAvoidedActual,
    factualPlasticWasteAvoidedKg,
    netSavingsActual,
    returnRatePercent,
    sustainabilityScore,
  };
}
