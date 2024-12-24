import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Target,
  Link as LinkIcon,
  Settings,
  BarChart3,
  Globe,
  Users,
  LogOut,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import { signOut } from '../../lib/auth';
import { Button } from '../ui/Button';

const NavItem: React.FC<{
  to: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}> = ({ to, icon, label, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group relative ${
        isActive
          ? 'bg-gradient-to-r from-brand-600/10 to-brand-700/10 text-brand-600'
          : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      <div className={`relative ${isActive ? 'animate-pulse-slow' : ''}`}>
        {React.cloneElement(icon as React.ReactElement, {
          className: `w-5 h-5 ${isActive ? 'text-brand-600' : 'text-gray-500 group-hover:text-brand-500'}`
        })}
      </div>
      <span className={`font-medium ${isActive ? 'text-brand-600' : 'group-hover:text-brand-600'}`}>
        {label}
      </span>
      {isActive && (
        <ChevronRight className="w-4 h-4 text-brand-600 absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </Link>
  );
};

export const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          icon={isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        />
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-72 bg-white min-h-screen border-r border-gray-100 
        flex flex-col shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center space-x-3 px-6 py-8">
          <div className="bg-gradient-to-br from-brand-500 to-brand-700 p-3 rounded-2xl shadow-glow animate-float">
            <Target className="w-8 h-8 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-brand-600 to-brand-700 text-transparent bg-clip-text">
              LeadFlow Pro
            </span>
            <span className="text-xs text-gray-500 block">
              Analytics & Tracking
            </span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1.5 py-4 overflow-y-auto">
          <div className="mb-8">
            <span className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Principal
            </span>
            <div className="mt-4 space-y-1">
              <NavItem
                to="/dashboard"
                icon={<LayoutDashboard />}
                label="Dashboard"
                onClick={closeSidebar}
              />
              <NavItem
                to="/analytics"
                icon={<BarChart3 />}
                label="Analytics"
                onClick={closeSidebar}
              />
            </div>
          </div>

          <div className="mb-8">
            <span className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Gerenciamento
            </span>
            <div className="mt-4 space-y-1">
              <NavItem
                to="/websites"
                icon={<Globe />}
                label="Websites"
                onClick={closeSidebar}
              />
              <NavItem
                to="/leads"
                icon={<Users />}
                label="Leads"
                onClick={closeSidebar}
              />
              <NavItem
                to="/conversions"
                icon={<Target />}
                label="Conversões"
                onClick={closeSidebar}
              />
              <NavItem
                to="/tracking-links"
                icon={<LinkIcon />}
                label="Links"
                onClick={closeSidebar}
              />
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-1 bg-gray-50/50">
          <NavItem
            to="/settings"
            icon={<Settings />}
            label="Configurações"
            onClick={closeSidebar}
          />
          <button
            onClick={() => {
              handleSignOut();
              closeSidebar();
            }}
            className="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-gray-600 hover:bg-red-50 hover:text-red-600 w-full group"
          >
            <LogOut className="w-5 h-5 group-hover:text-red-500" />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </div>
    </>
  );
};