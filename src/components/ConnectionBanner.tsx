import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';

export const ConnectionBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [showRestored, setShowRestored] = useState(false);

  useEffect(() => {
    let timer: any = null;

    const unsubscribe = api.subscribeConnection((online, reconnecting) => {
      if (!online) {
        setIsOnline(false);
        setIsReconnecting(reconnecting);
        setShowRestored(false);
      } else {
        if (!isOnline) {
          setShowRestored(true);
          timer = setTimeout(() => {
            setShowRestored(false);
          }, 4000);
        }
        setIsOnline(true);
        setIsReconnecting(false);
      }
    });

    return () => {
      unsubscribe();
      if (timer) clearTimeout(timer);
    };
  }, [isOnline]);

  if (isOnline && !showRestored) {
    return null;
  }

  if (showRestored) {
    return (
      <div className="bg-[var(--emerald-100)] border-b border-[var(--emerald-600)] text-[var(--emerald-900)] px-4 py-2 text-sm font-semibold flex items-center justify-center gap-2 transition-all">
        <Wifi className="w-4 h-4 text-[var(--emerald-700)]" />
        <span>Back online. Connection to clinic system restored.</span>
      </div>
    );
  }

  return (
    <div className="bg-[#FFF3CD] border-b border-[var(--gold-600)] text-[var(--gold-700)] px-4 py-2 text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-xs">
      <WifiOff className="w-4 h-4 text-[var(--gold-700)] animate-pulse" />
      <span>
        {isReconnecting
          ? 'Reconnecting… your last action will retry automatically'
          : "Can't reach the clinic system. Checking connection…"}
      </span>
      <RefreshCw className="w-3.5 h-3.5 animate-spin ml-1 opacity-75" />
    </div>
  );
};
