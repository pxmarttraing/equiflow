
import React, { useState } from 'react';
import { EquipmentItem } from '../types';

interface ReservationModalProps {
  selectedItems: EquipmentItem[];
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (startDate: string, endDate: string) => void;
  checkConflicts: (itemIds: string[], start: string, end: string) => boolean;
}

const ReservationModal: React.FC<ReservationModalProps> = ({ selectedItems, isOpen, onClose, onConfirm, checkConflicts }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!startDate || !endDate) {
      setError('請選擇開始與結束日期');
      return;
    }

    // Changed from >= to > to allow same day booking
    if (new Date(startDate) > new Date(endDate)) {
      setError('結束日期不能早於開始日期');
      return;
    }

    const itemIds = selectedItems.map(i => i.id);
    if (checkConflicts(itemIds, startDate, endDate)) {
      setError('所選時段與現有預約重疊，請更換日期');
      return;
    }

    onConfirm(startDate, endDate);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-popIn">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-indigo-50/50">
          <h3 className="text-xl font-bold text-slate-800">確認預約申請</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">預約清單</label>
            <div className="flex flex-wrap gap-2">
              {selectedItems.map(item => (
                <span key={item.id} className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-xs border border-slate-200">
                  {item.name}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">開始日期</label>
              <input 
                type="date" required
                min={new Date().toLocaleDateString('en-CA')}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">結束日期</label>
              <input 
                type="date" required
                min={startDate || new Date().toLocaleDateString('en-CA')}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100 flex items-center gap-2"><span>⚠️</span> {error}</div>}

          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose} className="flex-1 px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50">取消</button>
            <button type="submit" className="flex-1 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">確認送出</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationModal;
