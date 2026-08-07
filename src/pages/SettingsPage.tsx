import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../api/client';
import { Settings, Wifi, Shield, Database, RefreshCw, CheckCircle2, Zap, Trash2, Bell } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { showSuccess, showInfo, showWarning, showError } = useToast();
  const [health, setHealth] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);

  const checkConnection = async () => {
    setIsTesting(true);
    try {
      const data = await api.get<any>('/api/health', true);
      setHealth(data);
      showSuccess('Host Network Active', 'Connected to field clinic local server.');
    } catch {
      setHealth({ status: 'offline', timestamp: new Date().toISOString() });
      showError('Connection Error', 'Cannot reach local host server.');
    } finally {
      setIsTesting(false);
    }
  };

  const handleClearCache = () => {
    api.clearCache();
    showInfo('Cache Purged', 'In-memory queue & inventory cache has been cleared.');
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="text-xs font-bold tracking-widest uppercase text-[var(--gold-700)] mb-1">
          Station Configuration
        </div>
        <h1 className="font-serif text-3xl font-bold text-[var(--emerald-900)]">
          System Diagnostics & Settings
        </h1>
        <p className="text-sm text-[var(--ink-soft)] mt-1">
          Verify local host network connection, server health status, and active session identity
        </p>
      </div>

      {/* Network & Server Health Card */}
      <div className="bg-white border border-[var(--line)] rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[var(--emerald-100)] text-[var(--emerald-700)]">
              <Wifi className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[var(--emerald-900)]">
                Local Server Host Status
              </h3>
              <p className="text-xs text-[var(--ink-soft)]">
                Host network connection to field clinic backend
              </p>
            </div>
          </div>

          <button
            onClick={checkConnection}
            disabled={isTesting}
            className="inline-flex items-center gap-2 bg-[var(--cream)] hover:bg-[var(--emerald-100)] text-[var(--emerald-900)] font-bold text-xs px-4 py-2 rounded-full border border-[var(--line)] transition-all min-h-[38px] cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
            <span>Test Connection</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[var(--cream)] border border-[var(--line)]">
            <span className="text-[10px] font-bold uppercase text-[var(--ink-soft)] block">API Connection State</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-serif font-bold text-base text-[var(--emerald-900)]">
                {health?.status === 'ok' ? 'Connected (Host Network Active)' : 'Checking Server…'}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--cream)] border border-[var(--line)]">
            <span className="text-[10px] font-bold uppercase text-[var(--ink-soft)] block">Backend Service</span>
            <span className="font-bold text-sm text-[var(--emerald-900)] mt-1 block">
              Missions Clinic Backend API v1.0
            </span>
          </div>
        </div>
      </div>

      {/* Active Session Identity */}
      <div className="bg-white border border-[var(--line)] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3 border-b border-[var(--line)] pb-4">
          <div className="p-2.5 rounded-xl bg-[var(--gold-100)] text-[var(--gold-700)]">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-[var(--emerald-900)]">
              Active Station Authentication
            </h3>
            <p className="text-xs text-[var(--ink-soft)]">
              Logged in staff identity and station role privileges
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[var(--cream)] border border-[var(--line)]">
            <span className="font-bold uppercase text-[10px] text-[var(--ink-soft)] block">Logged Staff</span>
            <span className="font-bold text-sm text-[var(--emerald-900)] mt-0.5 block">{user?.name}</span>
          </div>

          <div className="p-4 rounded-xl bg-[var(--cream)] border border-[var(--line)]">
            <span className="font-bold uppercase text-[10px] text-[var(--ink-soft)] block">Station Role</span>
            <span className="font-bold text-sm text-[var(--emerald-900)] capitalize mt-0.5 block">{user?.role}</span>
          </div>

          <div className="p-4 rounded-xl bg-[var(--cream)] border border-[var(--line)]">
            <span className="font-bold uppercase text-[10px] text-[var(--ink-soft)] block">Security Token</span>
            <span className="font-mono text-xs text-emerald-800 font-bold mt-0.5 block flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Bearer Token Active
            </span>
          </div>
        </div>
      </div>

      {/* Fast Flow & Cache Control */}
      <div className="bg-white border border-[var(--line)] rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-100 text-purple-900">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[var(--emerald-900)]">
                Fast Response Cache & Toast Config
              </h3>
              <p className="text-xs text-[var(--ink-soft)]">
                Configure in-memory response caching (10s TTL) and test toast notification alerts
              </p>
            </div>
          </div>

          <button
            onClick={handleClearCache}
            className="inline-flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-900 font-bold text-xs px-4 py-2 rounded-full border border-red-200 transition-all min-h-[38px] cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Purge Memory Cache</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[var(--cream)] border border-[var(--line)] space-y-2">
            <span className="text-[10px] font-bold uppercase text-[var(--ink-soft)] block">Response Cache Status</span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <span className="font-bold text-xs text-[var(--emerald-900)]">In-Memory TTL Active (10s auto-refresh)</span>
            </div>
            <p className="text-[11px] text-[var(--ink-soft)]">
              Automatically invalidates on patient check-ins, vitals updates, dispensing, or record modifications.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[var(--cream)] border border-[var(--line)] space-y-2">
            <span className="text-[10px] font-bold uppercase text-[var(--ink-soft)] block">Test Toast System</span>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={() => showSuccess('Success Toast', 'Patient triage status updated to Urgent.')}
                className="px-3 py-1.5 rounded-lg bg-emerald-800 text-white font-bold text-[11px] hover:bg-emerald-950 cursor-pointer"
              >
                Success
              </button>
              <button
                onClick={() => showInfo('Info Toast', 'New prescription order received at station.')}
                className="px-3 py-1.5 rounded-lg bg-[var(--emerald-900)] text-white font-bold text-[11px] cursor-pointer"
              >
                Info
              </button>
              <button
                onClick={() => showWarning('Warning Toast', 'Amoxicillin 250mg stock is below threshold.')}
                className="px-3 py-1.5 rounded-lg bg-amber-800 text-white font-bold text-[11px] cursor-pointer"
              >
                Warning
              </button>
              <button
                onClick={() => showError('Error Toast', 'Unable to record vitals: network busy.')}
                className="px-3 py-1.5 rounded-lg bg-red-800 text-white font-bold text-[11px] cursor-pointer"
              >
                Error
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
