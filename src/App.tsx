import React, { useState } from 'react';
import { EcoBadgeProvider, useEcoBadge } from './context/EcoBadgeContext';
import { Navbar, NavTab } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { IssueReturnHub } from './components/IssueReturnHub';
import { InventoryView } from './components/InventoryView';
import { EventsView } from './components/EventsView';
import { AttendeesView } from './components/AttendeesView';
import { ImpactCalculatorView } from './components/ImpactCalculatorView';
import { LifeCycleView } from './components/LifeCycleView';
import { ReturnsRemindersView } from './components/ReturnsRemindersView';
import { TradeOffView } from './components/TradeOffView';
import { ReportsView } from './components/ReportsView';
import { StudentPortalView } from './components/StudentPortalView';
import { ToastContainer } from './components/ToastContainer';
import { Leaf, Heart, Shield, Sparkles } from 'lucide-react';

const AppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const { setActiveStudentId, setUserRole, userRole } = useEcoBadge();

  const handleOpenStudentPortal = (attendeeId: string) => {
    setActiveStudentId(attendeeId);
    setUserRole('Student');
    setCurrentTab('student-portal');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Navigation */}
      <Navbar currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {currentTab === 'dashboard' && <DashboardView onNavigate={setCurrentTab} />}
        {currentTab === 'issue-return' && <IssueReturnHub />}
        {currentTab === 'inventory' && <InventoryView />}
        {currentTab === 'events' && (
          <EventsView onNavigateToHub={() => setCurrentTab('issue-return')} />
        )}
        {currentTab === 'attendees' && (
          <AttendeesView onOpenStudentPortal={handleOpenStudentPortal} />
        )}
        {currentTab === 'calculator' && <ImpactCalculatorView />}
        {currentTab === 'lifecycle' && <LifeCycleView />}
        {currentTab === 'reminders' && (
          <ReturnsRemindersView onNavigateToHub={() => setCurrentTab('issue-return')} />
        )}
        {currentTab === 'tradeoffs' && <TradeOffView />}
        {currentTab === 'reports' && <ReportsView />}
        {currentTab === 'student-portal' && <StudentPortalView onNavigate={setCurrentTab} />}
      </main>

      {/* Global Notification Toasts */}
      <ToastContainer />

      {/* Quiet, Professional Collegiate Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-900 flex items-center justify-center text-emerald-400">
              <Leaf className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-900">EcoBadge</span>
            <span className="text-slate-300">·</span>
            <span className="italic text-slate-600">"Reuse More. Waste Less. Make Every Event Count."</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-600">
            <span>ISO 14040/14044 LCA Principles</span>
            <span className="text-slate-300">·</span>
            <span>Closed-Loop Campus Circularity</span>
            <span className="text-slate-300">·</span>
            <button
              onClick={() => setCurrentTab('student-portal')}
              className="text-emerald-800 hover:text-emerald-950 hover:underline cursor-pointer font-medium"
            >
              Student Portal
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <EcoBadgeProvider>
      <AppContent />
    </EcoBadgeProvider>
  );
}
