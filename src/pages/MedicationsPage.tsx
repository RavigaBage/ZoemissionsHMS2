import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Medication } from '../types';
import Pagnation from '../components/Pagnation';
import { Pill, Plus, AlertTriangle, Search, RefreshCw, Edit2, X, CheckCircle2, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const MedicationsPage: React.FC = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal / Add Form
  const [showModal, setShowModal] = useState(false);
  const [editingMed, setEditingMed] = useState<Medication | null>(null);

  const [name, setName] = useState('');
  const [unit, setUnit] = useState('tablet');
  const [quantityInStock, setQuantityInStock] = useState('100');
  const [reorderThreshold, setReorderThreshold] = useState('20');
  const [expiryDate, setExpiryDate] = useState('');
  const [batchNo, setBatchNo] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const { user } = useAuth();
  const { showSuccess, showError: showToastError } = useToast();

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this medication?')) return;
    try {
      await api.delete(`/api/medications/${id}`);
      showSuccess('Deleted', 'Medication removed successfully.');
      fetchMedications();
    } catch (err: any) {
      showToastError('Error', err.message || 'Failed to delete medication.');
    }
  };


  const fetchMedications = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get<any>('/api/medications');
      const list = Array.isArray(data) ? data : (data?.items || data?.medications || data?.data || []);
      setMedications(list);
    } catch (err: any) {
      setError(err.message || 'Failed to load medication inventory.');
      setMedications([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedications();
  }, []);

  const openAddModal = () => {
    setEditingMed(null);
    setName('');
    setUnit('tablet');
    setQuantityInStock('100');
    setReorderThreshold('20');
    setExpiryDate('');
    setBatchNo('');
    setModalError(null);
    setShowModal(true);
  };

  const openEditModal = (m: Medication) => {
    setEditingMed(m);
    setName(m.name);
    setUnit(m.unit);
    setQuantityInStock(String(m.quantity_in_stock));
    setReorderThreshold(String(m.reorder_threshold));
    setExpiryDate(m.expiry_date || '');
    setBatchNo(m.batch_no || '');
    setModalError(null);
    setShowModal(true);
  };

  const handleSaveMedication = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    if (!name.trim() || !unit.trim()) {
      setModalError('Medication name and unit are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        unit: unit.trim(),
        quantity_in_stock: parseInt(quantityInStock, 10) || 0,
        reorder_threshold: parseInt(reorderThreshold, 10) || 10,
        expiry_date: expiryDate || null,
        batch_no: batchNo.trim() || null,
      };

      if (editingMed) {
        await api.patch(`/api/medications/${editingMed.id}`, payload);
      } else {
        await api.post('/api/medications', payload);
      }

      setShowModal(false);
      fetchMedications();
    } catch (err: any) {
      setModalError(err.message || 'Failed to save medication.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredMeds = medications.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      (m.batch_no && m.batch_no.toLowerCase().includes(search.toLowerCase()))
  );

  const lowStockCount = medications.filter((m) => m.quantity_in_stock <= m.reorder_threshold).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold tracking-widest uppercase text-[var(--gold-700)] mb-1">
            Pharmacy Station
          </div>
          <h1 className="font-serif text-3xl font-bold text-[var(--emerald-900)]">
            Medication Inventory
          </h1>
          <p className="text-sm text-[var(--ink-soft)] mt-1">
            Track drug stock levels, batch numbers, expiration dates, and reorder alerts
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-[var(--emerald-700)] hover:bg-[var(--emerald-900)] text-[var(--cream)] font-bold text-sm px-6 py-3 rounded-full transition-all shadow-xs min-h-[44px] cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Medication</span>
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[var(--line)] shadow-xs">
          <span className="text-xs font-bold uppercase text-[var(--ink-soft)] block">Total Drug Items</span>
          <span className="text-3xl font-serif font-bold text-[var(--emerald-900)] mt-1 block">{medications.length}</span>
        </div>

        <div className={`p-5 rounded-2xl border shadow-xs ${lowStockCount > 0 ? 'bg-amber-50 border-amber-200' : 'bg-white border-[var(--line)]'}`}>
          <span className="text-xs font-bold uppercase text-amber-800 block flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> Low Stock Alerts
          </span>
          <span className="text-3xl font-serif font-bold text-amber-900 mt-1 block">{lowStockCount}</span>
          <span className="text-xs text-amber-700 font-semibold mt-1 block">Items below reorder threshold</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[var(--line)] shadow-xs">
          <span className="text-xs font-bold uppercase text-[var(--ink-soft)] block">Stock Status</span>
          <span className="text-3xl font-serif font-bold text-[var(--emerald-700)] mt-1 block">
            {medications.length - lowStockCount} / {medications.length}
          </span>
          <span className="text-xs text-[var(--emerald-700)] font-semibold mt-1 block">Sufficient stock</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-[var(--line)] shadow-xs flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-[var(--ink-soft)] pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search medication name or batch number…"
            className="block w-full pl-10 pr-4 py-2.5 border border-[var(--line)] rounded-xl text-sm bg-[var(--cream)] focus:bg-white focus:outline-none focus:border-[var(--emerald-700)] min-h-[44px]"
          />
        </div>

        <button
          onClick={fetchMedications}
          className="p-2.5 rounded-xl border border-[var(--line)] hover:bg-[var(--cream)] text-[var(--emerald-900)] min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
          title="Refresh Inventory"
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
          {error}
        </div>
      )}

      {/* Inventory Table */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-[var(--line)] p-12 text-center text-[var(--ink-soft)]">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-[var(--emerald-700)]" />
          <p className="font-bold text-base">Loading inventory items…</p>
        </div>
      ) : filteredMeds.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[var(--line)] p-12 text-center">
          <Pill className="w-12 h-12 mx-auto mb-3 text-[var(--ink-soft)]" />
          <h3 className="font-serif text-xl font-bold text-[var(--emerald-900)]">No medications found</h3>
          <p className="text-sm text-[var(--ink-soft)] mt-1">
            {search ? `No items match "${search}".` : 'No medication records in database.'}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-[var(--line)] rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-[var(--cream)] border-b border-[var(--line)] text-xs font-bold uppercase tracking-wider text-[var(--emerald-900)]">
                  <th className="p-4">Medication Name</th>
                  <th className="p-4">Stock Quantity</th>
                  <th className="p-4">Reorder Level</th>
                  <th className="p-4">Batch Number</th>
                  <th className="p-4">Expiration Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {filteredMeds.map((med) => {
                  const isLowStock = med.quantity_in_stock <= med.reorder_threshold;

                  return (
                    <tr key={med.id} className={`hover:bg-[var(--cream)] transition-colors ${isLowStock ? 'bg-amber-50/40' : ''}`}>
                      <td className="p-4 font-bold text-[var(--emerald-900)]">
                        <div className="flex items-center gap-2">
                          <Pill className="w-4 h-4 text-[var(--emerald-700)] shrink-0" />
                          <span>{med.name}</span>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className={`font-serif text-base font-bold px-3 py-1 rounded-full ${isLowStock ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'text-[var(--emerald-900)]'}`}>
                          {med.quantity_in_stock} {med.unit}(s)
                        </span>
                        {isLowStock && (
                          <span className="block text-[10px] font-extrabold uppercase tracking-wider text-amber-700 mt-1 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Low Stock Warning
                          </span>
                        )}
                      </td>

                      <td className="p-4 font-semibold text-[var(--ink-soft)]">
                        {med.reorder_threshold} {med.unit}(s)
                      </td>

                      <td className="p-4 font-mono text-xs text-[var(--ink-soft)] font-bold">
                        {med.batch_no || 'N/A'}
                      </td>

                      <td className="p-4 text-xs font-medium text-[var(--ink-soft)]">
                        {med.expiry_date ? new Date(med.expiry_date).toLocaleDateString() : 'N/A'}
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => openEditModal(med)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[var(--emerald-700)] hover:text-[var(--emerald-900)] bg-[var(--cream)] hover:bg-[var(--emerald-100)] px-3 py-1.5 rounded-full border border-[var(--line)] transition-colors cursor-pointer min-h-[36px]"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit Stock</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[var(--line)] rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-6 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
              <h3 className="font-serif font-bold text-xl text-[var(--emerald-900)]">
                {editingMed ? 'Update Medication Stock' : 'Add New Medication'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-[var(--ink-soft)] hover:bg-[var(--cream)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold">
                {modalError}
              </div>
            )}

            <form onSubmit={handleSaveMedication} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--emerald-900)] mb-1">
                  Medication Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Amoxicillin 500mg"
                  required
                  className="block w-full px-3.5 py-2.5 border border-[var(--line)] rounded-xl text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--emerald-700)] min-h-[44px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--emerald-900)] mb-1">
                    Unit Type *
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="block w-full px-3.5 py-2.5 border border-[var(--line)] rounded-xl text-sm text-[var(--ink)] focus:outline-none min-h-[44px]"
                  >
                    <option value="tablet">tablet</option>
                    <option value="capsule">capsule</option>
                    <option value="sachet">sachet</option>
                    <option value="vial">vial</option>
                    <option value="bottle">bottle</option>
                    <option value="canister">canister</option>
                    <option value="tube">tube</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--emerald-900)] mb-1">
                    Quantity In Stock *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={quantityInStock}
                    onChange={(e) => setQuantityInStock(e.target.value)}
                    required
                    className="block w-full px-3.5 py-2.5 border border-[var(--line)] rounded-xl text-sm font-bold text-[var(--ink)] focus:outline-none min-h-[44px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--emerald-900)] mb-1">
                    Reorder Alert Threshold
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={reorderThreshold}
                    onChange={(e) => setReorderThreshold(e.target.value)}
                    className="block w-full px-3.5 py-2.5 border border-[var(--line)] rounded-xl text-sm text-[var(--ink)] focus:outline-none min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--emerald-900)] mb-1">
                    Batch Number
                  </label>
                  <input
                    type="text"
                    value={batchNo}
                    onChange={(e) => setBatchNo(e.target.value)}
                    placeholder="e.g. AMX-2026-A"
                    className="block w-full px-3.5 py-2.5 border border-[var(--line)] rounded-xl text-sm font-mono text-[var(--ink)] focus:outline-none min-h-[44px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--emerald-900)] mb-1">
                  Expiration Date
                </label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="block w-full px-3.5 py-2.5 border border-[var(--line)] rounded-xl text-sm text-[var(--ink)] focus:outline-none min-h-[44px]"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[var(--line)]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-[var(--ink-soft)] hover:bg-[var(--cream)] border border-[var(--line)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[var(--emerald-700)] hover:bg-[var(--emerald-900)] text-[var(--cream)] font-bold text-xs px-6 py-2.5 rounded-full transition-all min-h-[40px] shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving…' : 'Save Medication'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Pagnation
        currentPage={1}
        totalPages={1}
        onPageChange={(page: number) => console.log('Change to page:', page)}
      />

    </div>
  );
};
