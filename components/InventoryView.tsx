
import React, { useState, useMemo } from 'react';
import { EquipmentItem, ItemStatus, Reservation, ReservationStatus } from '../types';

interface InventoryViewProps {
  items: EquipmentItem[];
  reservations: Reservation[];
  onReserve: (itemIds: string[]) => void;
}

const InventoryView: React.FC<InventoryViewProps> = ({ items, reservations, onReserve }) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const cats = new Set(items.map(i => i.category));
    return ['All', ...Array.from(cats)];
  }, [items]);

  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesCategory;
  });

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const getStatusBadge = (status: ItemStatus) => {
    if (status === ItemStatus.BORROWED) {
      return <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-[10px] font-bold whitespace-nowrap shrink-0">借用中</span>;
    }
    return <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-[10px] font-bold whitespace-nowrap shrink-0">可使用</span>;
  };

  const getItemSchedule = (itemId: string) => {
    const today = new Date().toLocaleDateString('en-CA');
    const itemRes = reservations
      .filter(r => r.itemIds.includes(itemId) && r.status !== ReservationStatus.CANCELLED && r.status !== ReservationStatus.COMPLETED)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    
    const current = itemRes.find(r => today >= r.startDate && today <= r.endDate);
    const allUpcoming = itemRes.filter(r => r.startDate > (current ? current.endDate : today));
    
    return { current, allUpcoming };
  };

  return (
    <div className="flex flex-col min-h-full">
      <div className="space-y-6 animate-fadeIn flex-grow">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">營運訓練處備品資產庫</h2>
          <p className="text-slate-500 text-sm">請選取欲預約的品項，可查看目前與未來完整排程</p>
        </div>

        <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600'}`}>{cat === 'All' ? '全部' : cat}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map(item => {
            const { current, allUpcoming } = getItemSchedule(item.id);
            const isSelected = selectedIds.has(item.id);
            return (
              <div 
                key={item.id} onClick={() => toggleSelection(item.id)}
                className={`group relative p-6 rounded-2xl border transition-all cursor-pointer flex flex-col min-h-[14rem] ${isSelected ? 'border-indigo-600 ring-2 ring-indigo-100 bg-indigo-50/30' : 'border-slate-200 hover:border-indigo-300 hover:shadow-md bg-white'}`}
              >
                <div className="flex justify-between items-start mb-2 gap-3 overflow-hidden">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-slate-800 text-lg leading-tight truncate" title={item.name}>{item.name}</h3>
                    <p className="text-[10px] font-semibold text-indigo-500 mt-0.5 uppercase tracking-wider truncate">{item.category}</p>
                  </div>
                  {getStatusBadge(item.status)}
                </div>
                
                {item.specifications && <p className="text-[10px] text-slate-400 mb-3 line-clamp-1 italic">{item.specifications}</p>}

                <div className="mt-auto space-y-3 pt-4 border-t border-slate-100">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">當前狀態</span>
                    <span className="text-[11px] text-slate-700 font-medium">
                      {current ? (
                        <span className="text-orange-600 font-bold">👤 {current.userName} ({current.startDate} ~ {current.endDate})</span>
                      ) : '✅ 目前無人借用'}
                    </span>
                  </div>
                  
                  {allUpcoming.length > 0 && (
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">未來預約紀錄</span>
                      <div className="max-h-24 overflow-y-auto space-y-1 pr-1 scrollbar-hide">
                        {allUpcoming.map(res => (
                          <div key={res.id} className="text-[10px] text-slate-500 border-l-2 border-indigo-200 pl-2 py-0.5">
                            <span className="font-semibold">{res.userName}</span>: {res.startDate} ~ {res.endDate}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <div className="bg-indigo-600 text-white p-1 rounded-full shadow-lg">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {selectedIds.size > 0 && (
        <div className="sticky bottom-6 mt-8 flex justify-end pointer-events-none">
          <button onClick={() => onReserve(Array.from(selectedIds))} className="pointer-events-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all active:scale-95 flex items-center gap-3 animate-slideUp z-[50]">
            <div className="relative">
              <span className="text-xl">✨</span>
              <span className="absolute -top-3 -right-3 bg-white text-indigo-600 text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center shadow-md ring-2 ring-indigo-600">{selectedIds.size}</span>
            </div>
            <span className="tracking-wide">預約已選項目</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default InventoryView;
