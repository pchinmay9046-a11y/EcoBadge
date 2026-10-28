import React, { useState } from 'react';
import { useEcoBadge } from '../context/EcoBadgeContext';
import { UserRole } from '../types';
import {
  Leaf,
  Menu,
  X,
  RotateCcw,
  Shield,
  UserCheck,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

export type NavTab = 
  | 'dashboard'
  | 'issue-return'
  | 'inventory'
  | 'events'
  | 'attendees'
  | 'calculator'
  | 'lifecycle'
  | 'reminders'
  | 'tradeoffs'
  | 'reports'
  | 'student-portal';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab }) => {
  const { userRole, setUserRole, resetToDemoData } = useEcoBadge();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const navLinks: { id: NavTab; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'issue-return', label: 'Issue & Return' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'events', label: 'Events' },
    { id: 'attendees', label: 'Attendees' },
    { id: 'calculator', label: 'Impact' },
    { id: 'lifecycle', label: 'Eco-Design' },
    { id: 'reminders', label: 'Returns Hub' },
    { id: 'tradeoffs', label: 'Trade-Offs' },
    { id: 'reports', label: 'Reports' },
  ];

  const handleRoleChange = (role: UserRole) => {
    setUserRole(role);
    setShowRoleMenu(false);
    if (role === 'Student') {
      onSelectTab('student-portal');
    } else if (currentTab === 'student-portal') {
      onSelectTab('dashboard');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Zone (Single text element wordmark with icon) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onSelectTab('dashboard')}
              className="flex items-center gap-2 group text-left cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-900 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-800 transition-colors shadow-xs">
                <Leaf className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-slate-900 tracking-tight leading-tight flex items-center gap-1.5">
                  EcoBadge
                  <span className="text-[10px] font-medium tracking-normal text-emerald-700 bg-emerald-100/70 border border-emerald-200 px-1.5 py-0.2 rounded-sm">
                    DEMO
                  </span>
                </span>
                <span className="text-[10px] text-slate-500 hidden sm:inline leading-none font-medium">
                  Reusable College Badge System
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-1 overflow-x-auto py-1 scrollbar-none text-xs font-medium">
            {navLinks.map(link => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onSelectTab(link.id)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-emerald-900 text-white font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
            {userRole === 'Student' && (
              <button
                onClick={() => onSelectTab('student-portal')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1 ${
                  currentTab === 'student-portal'
                    ? 'bg-emerald-900 text-white font-semibold'
                    : 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                My Badge Pass
              </button>
            )}
          </nav>

          {/* Right Action Zone: Role Switcher & Reset Demo */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap"
                aria-label="Switch User Role"
              >
                {userRole === 'Admin' && <Shield className="w-3.5 h-3.5 text-slate-800" />}
                {userRole === 'Volunteer' && <UserCheck className="w-3.5 h-3.5 text-teal-700" />}
                {userRole === 'Student' && <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />}
                <span className="font-semibold">{userRole}</span>
                <span className="text-[10px] text-slate-600 ml-0.5">▼</span>
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 text-xs animate-in fade-in duration-100">
                  <div className="px-3 py-2 border-b border-slate-100 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                    Simulate Perspective
                  </div>
                  <button
                    onClick={() => handleRoleChange('Admin')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-slate-50 transition-colors ${
                      userRole === 'Admin' ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'text-slate-700'
                    }`}
                  >
                    <Shield className="w-4 h-4 text-emerald-800" />
                    <div>
                      <div className="font-medium">College Administrator</div>
                      <div className="text-[11px] text-slate-600">Full management & analytics</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleRoleChange('Volunteer')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-slate-50 transition-colors ${
                      userRole === 'Volunteer' ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'text-slate-700'
                    }`}
                  >
                    <UserCheck className="w-4 h-4 text-teal-700" />
                    <div>
                      <div className="font-medium">Event Volunteer</div>
                      <div className="text-[11px] text-slate-600">Fast check-in, issue & return desk</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleRoleChange('Student')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-slate-50 transition-colors ${
                      userRole === 'Student' ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'text-slate-700'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4 text-emerald-700" />
                    <div>
                      <div className="font-medium">Student / Attendee</div>
                      <div className="text-[11px] text-slate-600">Digital badge, drop-off map & rewards</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Quick Demo Reset */}
            <button
              onClick={resetToDemoData}
              title="Reset data to clean demo state"
              className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-300"
              aria-label="Reset demo data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Sub-nav for tablets (when between md and xl) */}
      <div className="hidden md:flex xl:hidden border-t border-slate-100 bg-slate-50/70 px-4 overflow-x-auto py-2 gap-1 text-xs">
        {navLinks.map(link => {
          const isActive = currentTab === link.id;
          return (
            <button
              key={link.id}
              onClick={() => onSelectTab(link.id)}
              className={`px-2.5 py-1 rounded-md whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-emerald-900 text-white font-medium'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {link.label}
            </button>
          );
        })}
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg animate-in slide-in-from-top-2">
          {navLinks.map(link => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  onSelectTab(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-900 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                onSelectTab('student-portal');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-emerald-800 bg-emerald-50 font-medium"
            >
              <GraduationCap className="w-4 h-4" />
              Attendee Digital Badge View
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
