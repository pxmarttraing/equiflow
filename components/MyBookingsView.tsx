
import React, { useState } from 'react';
import { Reservation, EquipmentItem, ReservationStatus } from '../types';

interface MyBookingsViewProps {
  reservations: Reservation[];
  items: EquipmentItem[];
  onCancel: (id: string) => void;
  onReturnInitiate: (id: string) => void;
  onBrowse: () => void;
  isAdminMode?: boolean;
}

const MyBookingsView: React.FC<MyBookingsViewProps> = ({ 
  reservations, 
  items, 
  onCancel, 
  onReturnInitiate, 
  onBrowse,
  isAdminMode = false
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'current' | 'history'>('current');

  const getStatusStyle = (status: ReservationStatus) => {
    switch (status) {
      case ReservationStatus.ACTIVE: return "bg-emerald-100 text-emerald-700";
      case ReservationStatus.PENDING: return "bg-amber-100 text-amber-700";
      case ReservationStatus.COMPLETED: return "bg-slate-100 text-slate-700";
      case ReservationStatus.CANCELLED: return "bg-red-50 text-red-500";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const getStatusLabel = (status: ReservationStatus) => {
    switch (status) {
      case ReservationStatus.ACTIVE: return "使用中";
      case ReservationStatus.PENDING: return "預約待生效";
      case ReservationStatus.COMPLETED: return "已完成歸還";
      case ReservationStatus.CANCELLED: return "已取消預約";
      default: return "未知";
    }
  };

  const currentReservations = reservations.filter(r => 
    r.status === ReservationStatus.ACTIVE || r.status === ReservationStatus.PENDING
  ).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  const historyReservations = reservations.filter(r => 
    r.status === ReservationStatus.COMPLETED || r.status === ReservationStatus.CANCELLED
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const displayReservations = activeSubTab === 'current' ? currentReservations : historyReservations;

  return (
    <div className="space-y-6">
      {!isAdminMode && (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">借用紀錄中心</h2>
            <p className="text-slate-500">管理您個人的設備借用與歷史足跡</p>
          </div>
          <div className="flex p-1 bg-slate-100 rounded-xl">
            <button 
              onClick={() => setActiveSubTab('current')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeSubTab === 'current' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              目前預約 ({currentReservations.length})
            </button>
            <button 
              onClick={() => setActiveSubTab('history')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeSubTab === 'history' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              歷史紀錄 ({historyReservations.length})
            </button>
          </div>
        </div>
      )}

      {isAdminMode && (
        <div className="flex p-1 bg-slate-100 rounded-xl w-fit mb-4">
          <button 
            onClick={() => setActiveSubTab('current')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeSubTab === 'current' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            活躍中紀錄 ({currentReservations.length})
          </button>
          <button 
            onClick={() => setActiveSubTab('history')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeSubTab === 'history' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            歷史紀錄存檔 ({historyReservations.length})
          </button>
        </div>
      )}

      {displayReservations.length === 0 ? (
        <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-slate-100">
          <div className="text-5xl mb-6">📅</div>
          <p className="text-slate-400 font-medium text-lg">此區塊暫無資料</p>
          {!isAdminMode && activeSubTab === 'current' && (
            <button 
              onClick={onBrowse}
              className="mt-6 bg-indigo-50 text-indigo-600 px-8 py-3 rounded-2xl font-bold hover:bg-indigo-100 transition-all"
            >
              立即去預約設備 →
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {displayReservations.map(res => {
            const resItems = items.filter(i => res.itemIds.includes(i.id));
            return (
              <div key={res.id} className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-all animate-fadeIn">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusStyle(res.status)}`}>
                      {getStatusLabel(res.status)}
                    </span>
                    {isAdminMode && (
                      <span className="text-sm font-bold text-indigo-600">👤 {res.userName}</span>
                    )}
                    <span className="text-[10px] text-slate-300 font-mono tracking-tighter">REF: {res.id.toUpperCase()}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {resItems.map(item => (
                      <div key={item.id} className="group relative flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2">
                        <span className="text-lg">
                          {item.category === 'Audio' ? '🎧' : item.category === 'Laptops' ? '💻' : '📦'}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-slate-800 leading-none">{item.name}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{item.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm text-slate-500 border-t border-slate-50 pt-3">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">時段:</span>
                      <span className="font-semibold text-slate-700">{res.startDate} ~ {res.endDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">申請日:</span>
                      <span className="text-slate-600">{new Date(res.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 min-w-[120px]">
                  {(res.status === ReservationStatus.PENDING || (isAdminMode && res.status === ReservationStatus.ACTIVE)) && (
                    <button 
                      onClick={() => onCancel(res.id)}
                      className="w-full px-4 py-2.5 text-red-500 font-bold text-sm border border-red-100 rounded-xl hover:bg-red-50 transition-all"
                    >
                      {isAdminMode ? '強制取消' : '取消預約'}
                    </button>
                  )}
                  {res.status === ReservationStatus.ACTIVE && !isAdminMode && (
                    <button 
                      onClick={() => onReturnInitiate(res.id)}
                      className="w-full px-6 py-3 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95"
                    >
                      申請歸還
                    </button>
                  )}
                  {res.status === ReservationStatus.COMPLETED && (
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 w-full text-center">
                      <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">驗證歸還人</p>
                      <p className="text-sm font-bold text-slate-700">✅ {res.verifiedBy}</p>
                    </div>
                  )}
                  {res.status === ReservationStatus.CANCELLED && (
                    <p className="text-xs text-slate-300 italic">已於 {new Date(res.createdAt).toLocaleDateString()} 撤回</p>
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

export default MyBookingsView;
