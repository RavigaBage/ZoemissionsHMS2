import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { Prescription } from '../types';
import { Pill, CheckCircle2, RefreshCw, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export const PrescriptionsPage: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('pending');
  const [page, setPage] = useState<number>(1);
  const limit = 10;
  const [hasMore, setHasMore] = useState<boolean>(true);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrescriptions = async (status = filterStatus, pageNum = page) => {
    setIsLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        page: pageNum.toString(),
        limit: limit.toString(),
      });
      if (status !== 'all') {
        queryParams.append('status', status);
      }

      const data = await api.get<any>(`/api/prescriptions?${queryParams.toString()}`);
      const list = Array.isArray(data) ? data : (data?.items || data?.prescriptions || data?.data || []);
      setPrescriptions(list);
      setHasMore(list.length === limit);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch prescriptions list.');
      setPrescriptions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions(filterStatus, page);
  }, [filterStatus, page]);

  const handleStatusChange = (newStatus: string) => {
    setFilterStatus(newStatus);
    setPage(1);
  };

  const safePrescriptions = Array.isArray(prescriptions) ? prescriptions : [];
  const pendingCount = safePrescriptions.filter((p) => p.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold tracking-widest uppercase text-[var(--gold-700)] mb-1">
            Pharmacy Dispensing Station
          </div>
          <h1 className="font-serif text-3xl font-bold text-[var(--emerald-900)]">
            Prescription Queue
          </h1>
          <p className="text-sm text-[var(--ink-soft)] mt-1">
            Doctor-prescribed medication orders awaiting fulfillment at the pharmacy station.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchPrescriptions(filterStatus, page)}
            disabled={isLoading}
            className="inline-flex items-center gap-2 bg-[var(--cream-deep)] hover:bg-[var(--emerald-100)] text-[var(--emerald-900)] font-bold text-sm px-4 py-2.5 rounded-full border border-[var(--line)] transition-all min-h-[44px] cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Page Controls */}
      <div className="bg-white p-4 rounded-2xl border border-[var(--line)] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'pending', label: 'Pending Dispense' },
            { id: 'dispensed', label: 'Dispensed' },
            { id: 'all', label: 'All Prescriptions' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleStatusChange(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all min-h-[38px] cursor-pointer ${
                filterStatus === tab.id
                  ? 'bg-purple-900 text-white shadow-xs'
                  : 'bg-[var(--cream)] text-[var(--ink-soft)] hover:bg-purple-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-purple-900 bg-purple-50 px-3.5 py-1.5 rounded-full border border-purple-200">
            Page {page} &bull; Loaded: {safePrescriptions.length}
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
              className="p-2 rounded-full border border-[var(--line)] hover:bg-[var(--cream)] disabled:opacity-40 min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!hasMore || isLoading}
              className="p-2 rounded-full border border-[var(--line)] hover:bg-[var(--cream)] disabled:opacity-40 min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
          {error}
        </div>
      )}

      {/* Prescriptions List */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-[var(--line)] p-12 text-center text-[var(--ink-soft)]">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-purple-700" />
          <p className="font-bold text-base">Loading prescription orders…</p>
        </div>
      ) : safePrescriptions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[var(--line)] p-12 text-center">
          <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-[var(--emerald-600)]" />
          <h3 className="font-serif text-xl font-bold text-[var(--emerald-900)]">No prescriptions found</h3>
          <p className="text-sm text-[var(--ink-soft)] mt-1">
            {filterStatus === 'pending' ? 'All pending prescriptions have been dispensed.' : 'No prescription records available on this page.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {safePrescriptions.map((pr) => {
            const patient = pr.consultation?.encounter?.patient;
            const med = pr.medication;
            const isPending = pr.status === 'pending';

            return (
              <div
                key={pr.id}
                className={`bg-white rounded-2xl border p-6 shadow-xs flex flex-col justify-between space-y-4 ${
                  isPending ? 'border-purple-300 bg-purple-50/10' : 'border-[var(--line)]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      isPending ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-900'
                    }`}>
                      {pr.status === 'pending' ? 'Pending Dispense' : 'Dispensed'}
                    </span>

                    <span className="text-xs text-[var(--ink-soft)] font-mono">
                      Order #{pr.id}
                    </span>
                  </div>

                  {patient && (
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--gold-700)] block">
                        Patient
                      </span>
                      <h3 className="font-serif font-bold text-xl text-[var(--emerald-900)]">
                        {patient.first_name} {patient.Other_name}
                      </h3>
                      <p className="text-xs text-[var(--ink-soft)]">
                        Age: {patient.approx_age ?? 'N/A'} yrs &bull; Village: {patient.village || 'N/A'}
                      </p>
                    </div>
                  )}

                  <div className="p-4 rounded-xl bg-[var(--cream)] border border-[var(--line)] space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-serif font-bold text-base text-[var(--emerald-900)] flex items-center gap-1.5">
                          <Pill className="w-4 h-4 text-purple-700" />
                          {med?.name || 'Medication'}
                        </span>
                        <p className="text-xs text-[var(--ink)] mt-1 font-semibold">
                          Instructions: {pr.dosage_instructions || 'Take as directed by doctor'}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-purple-900 block">Quantity</span>
                        <span className="text-xl font-serif font-bold text-purple-900">{pr.quantity_prescribed}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--line)] flex items-center justify-between">
                  <span className="text-xs text-[var(--ink-soft)] font-medium">
                    Prescribed: {new Date(pr.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>

                  {isPending ? (
                    <Link
                      to="/dispensing"
                      className="inline-flex items-center gap-2 bg-purple-800 hover:bg-purple-950 text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-xs transition-all min-h-[40px]"
                    >
                      <span>Fulfill & Dispense</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Completed
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
