import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { useFarm } from '../context/FarmContext.tsx';
import { Globe, User as UserIcon, RefreshCw, Menu, X, Shield, Settings as SettingsIcon } from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
  onOpenSettings?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, onOpenSettings }) => {
  const { language, setLanguage, t } = useLanguage();
  const { currentUser, users, switchUser } = useAuth();
  const { refreshAll, loading } = useFarm();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-stone-900 border-b border-stone-800 text-stone-100 shadow-sm print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark & Mobile Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
            aria-label="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white font-bold text-sm shadow-inner">
              YO
            </div>
            <a href="/" className="text-lg font-bold tracking-tight text-white hover:text-emerald-400 transition-colors whitespace-nowrap">
              {language === 'hi' ? 'यमुना ऑर्गेनिक फार्म्स' : 'Yamuna Organic Farms'}
            </a>
          </div>
        </div>

        {/* Zone 2: Location and Trust Indicator */}
        <div className="hidden lg:flex items-center gap-4 text-xs text-stone-400">
          <span className="text-stone-300 font-medium">Dhanbad, Jharkhand</span>
          <span aria-hidden="true" className="text-stone-600">·</span>
          <span>Oyster Mushroom Cultivation & Supply</span>
          <span aria-hidden="true" className="text-stone-600">·</span>
          <span className="text-amber-400 font-mono">Asia/Kolkata</span>
        </div>

        {/* Zone 3: Actions - Language toggle, User role switcher, Refresh */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Refresh button */}
          <button
            onClick={() => refreshAll()}
            disabled={loading}
            title="Refresh Real-time Data"
            className="p-2 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
          </button>

          {/* Bilingual Switcher */}
          <div className="flex items-center bg-stone-800 rounded-lg p-0.5 border border-stone-700">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                language === 'en'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                language === 'hi'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              हिंदी
            </button>
          </div>

          {/* Role / User Switcher */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-700 text-xs text-stone-200 transition-colors"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-[10px] font-bold">
                {currentUser.name.charAt(0)}
              </div>
              <span className="hidden sm:inline font-medium truncate max-w-[120px]">
                {currentUser.name}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded uppercase font-semibold bg-stone-900 text-amber-400 border border-amber-400/20">
                {currentUser.role}
              </span>
            </button>

            {userDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-64 bg-stone-900 border border-stone-700 rounded-xl shadow-xl p-2 z-50 text-xs"
                onClick={() => setUserDropdownOpen(false)}
              >
                <div className="px-3 py-2 border-b border-stone-800 mb-1">
                  <div className="font-semibold text-white">{currentUser.name}</div>
                  <div className="text-stone-400 text-[11px] capitalize">{currentUser.role} · PIN: {currentUser.pin}</div>
                </div>

                <div className="text-[11px] font-medium text-stone-400 px-3 py-1">
                  {language === 'hi' ? 'उपयोगकर्ता बदलें' : 'Switch Role / User'}:
                </div>

                {users.map(u => (
                  <button
                    key={u.id}
                    onClick={() => switchUser(u.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors ${
                      u.id === currentUser.id ? 'bg-emerald-900/50 text-white font-medium' : 'text-stone-300 hover:bg-stone-800'
                    }`}
                  >
                    <div>
                      <div>{u.name}</div>
                      <div className="text-[10px] text-stone-400 capitalize">{u.role}</div>
                    </div>
                    {u.id === currentUser.id && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    )}
                  </button>
                ))}

                {onOpenSettings && (
                  <div className="mt-2 pt-2 border-t border-stone-800">
                    <button
                      onClick={onOpenSettings}
                      className="w-full text-left px-3 py-2 rounded-lg text-stone-300 hover:bg-stone-800 flex items-center gap-2"
                    >
                      <SettingsIcon className="w-3.5 h-3.5 text-stone-400" />
                      <span>{t('settings')} & Backup</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
