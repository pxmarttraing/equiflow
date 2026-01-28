
import React, { useState } from 'react';
import { EquipmentItem, ItemStatus, User, Reservation, ReservationStatus } from '../types';
import MyBookingsView from './MyBookingsView';

interface AdminViewProps {
  items: EquipmentItem[];
  categories: string[];
  users: User[];
  allReservations: Reservation[];
  notifications: {message: string, type: 'info' | 'warning', time: string}[];
  onClearNotifications: () => void;
  onAddItem: (name: string, category: string, specifications: string) => void;
  onDeleteItem: (id: string) => void;
  onUpdateItem: (id: string, name: string, specifications: string, category: string) => void;
  onAddCategory: (cat: string) => void;
  onDeleteCategory: (cat: string) => void;
  onAddUser: (name: string, role: 'employee' | 'admin', email: string) => void;
  onDeleteUser: (id: string) => void;
  onUpdateUserRole: (id: string, role: 'employee' | 'admin') => void;
  onUpdateUserName: (id: string, name: string, email: string) => void;
  onResetUserPassword: (id: string) => void;
  onCancelReservation: (id: string) => void;
  onImportFullData?: (data: string) => void; // 新增導入功能
  activeTab: string;
}

const AdminView: React.FC<AdminViewProps> = ({ 
  items, categories, users, allReservations, notifications, onClearNotifications, onAddItem, onDeleteItem, onUpdateItem, onAddCategory, onDeleteCategory, onAddUser, onDeleteUser, onUpdateUserRole, onUpdateUserName, onResetUserPassword, onCancelReservation, onImportFullData, activeTab
}) => {
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState(categories[0] || '');
  const [newSpecs, setNewSpecs] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'employee' | 'admin'>('employee');
  const [newCatInput, setNewCatInput] = useState('');

  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editItemName, setEditItemName] = useState('');
  const [editItemSpecs, setEditItemSpecs] = useState('');
  const [editItemCategory, setEditItemCategory] = useState('');

  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editUserName, setEditUserName] = useState('');
  const [editUserEmail, setEditUserEmail] = useState('');
  const [editUserRole, setEditUserRole] = useState<'employee' | 'admin'>('employee');

  const [resetSuccessId, setResetSuccessId] = useState<string | null>(null);
  const [importText, setImportText] = useState('');
  const [showImport, setShowImport] = useState(false);

  const startEditingItem = (item: EquipmentItem) => {
    // 檢查是否有預約紀錄
    const hasHistory = allReservations.some(r => r.itemIds.includes(item.id));
    if (hasHistory) {
      alert("此備品已有預約歷史紀錄，為維護報表一致性，不可修改基本資料。");
      return;
    }
    setEditingItemId(item.id);
    setEditItemName(item.name);
    setEditItemSpecs(item.specifications || '');
    setEditItemCategory(item.category);
  };

  const saveItemEdit = () => {
    if (editingItemId && editItemName.trim()) {
      onUpdateItem(editingItemId, editItemName.trim(), editItemSpecs.trim(), editItemCategory);
      setEditingItemId(null);
    }
  };

  const startEditingUser = (user: User) => {
    setEditingUserId(user.id);
    setEditUserName(user.name);
    setEditUserEmail(user.email || '');
    setEditUserRole(user.role);
  };

  const saveUserEdit = () => {
    if (editingUserId && editUserName.trim()) {
      onUpdateUserName(editingUserId, editUserName.trim(), editUserEmail.trim());
      onUpdateUserRole(editingUserId, editUserRole);
      setEditingUserId(null);
    }
  };

  const handleExport = () => {
    const fullData = {
      users,
      items,
      reservations: allReservations,
      categories
    };
    const dataStr = btoa(unescape(encodeURIComponent(JSON.stringify(fullData))));
    navigator.clipboard.writeText(dataStr);
    alert("系統數據已轉換為加密字串並複製到剪貼簿！請到另一台電腦貼上導入。");
  };

  const handleResetAction = (id: string) => {
    onResetUserPassword(id);
    setResetSuccessId(id);
    setTimeout(() => { setResetSuccessId(null); }, 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {activeTab === 'admin-items' && '備品庫存與標籤'}
            {activeTab === 'admin-bookings' && '借用總覽與日誌'}
            {activeTab === 'admin-users' && '成員與密碼管理'}
          </h2>
          <p className="text-slate-500 text-sm mt-1">管理員專區：控管公司資產與成員權限</p>
        </div>
        
        <div className="flex gap-2">
          <button onClick={handleExport} className="text-xs font-bold bg-slate-100 text-slate-600 px-4 py-2 rounded-xl hover:bg-slate-200 transition-all">📤 導出數據備份</button>
          <button onClick={() => setShowImport(!showImport)} className="text-xs font-bold bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-all">📥 導入數據恢復</button>
        </div>
      </div>

      {showImport && (
        <div className="bg-indigo-600 p-6 rounded-2xl text-white animate-popIn">
          <h4 className="font-bold mb-2">導入數據恢復 (同步至此瀏覽器)</h4>
          <p className="text-xs opacity-80 mb-4">請貼上從另一台電腦「導出」的代碼。注意：這將會覆蓋此瀏覽器目前的所有資料。</p>
          <div className="flex gap-2">
            <input 
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm outline-none placeholder:text-white/40" 
              placeholder="在此貼上加密代碼..."
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
            />
            <button 
              onClick={() => { if(onImportFullData) onImportFullData(importText); setImportText(''); setShowImport(false); }}
              className="bg-white text-indigo-600 font-bold px-6 py-2 rounded-xl text-sm shadow-xl"
            >
              開始導入
            </button>
          </div>
        </div>
      )}

      {activeTab === 'admin-items' && (
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">🏷️ 分類管理</h3>
            <form onSubmit={(e) => { e.preventDefault(); onAddCategory(newCatInput); setNewCatInput(''); }} className="flex gap-2">
              <input type="text" placeholder="輸入新分類名稱..." className="flex-1 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" value={newCatInput} onChange={(e) => setNewCatInput(e.target.value)} />
              <button type="submit" className="bg-slate-800 text-white px-6 py-2 rounded-xl text-sm font-bold">新增分類</button>
            </form>
            <div className="flex flex-wrap gap-2 mt-4">
              {categories.map(cat => (
                <div key={cat} className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 group">
                  <span className="text-xs font-bold text-slate-600">{cat}</span>
                  <button onClick={() => onDeleteCategory(cat)} className="text-slate-300 hover:text-red-500 transition-colors">✕</button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">➕ 加入新備品</h3>
            <form onSubmit={(e) => { e.preventDefault(); onAddItem(newName, newCategory, newSpecs); setNewName(''); setNewSpecs(''); }} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input type="text" placeholder="備品名稱" className="border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={newName} onChange={(e) => setNewName(e.target.value)} required />
              <select className="border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white font-medium" value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <input type="text" placeholder="規格/型號" className="border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={newSpecs} onChange={(e) => setNewSpecs(e.target.value)} />
              <button type="submit" className="bg-indigo-600 text-white font-bold py-2 rounded-xl hover:bg-indigo-700 shadow-lg active:scale-95 transition-all">確認加入</button>
            </form>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">備品內容</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">分類標籤</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">操作項目</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map(item => {
                  const hasHistory = allReservations.some(r => r.itemIds.includes(item.id));
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        {editingItemId === item.id ? (
                          <div className="space-y-2">
                            <input className="w-full text-sm font-bold border rounded-lg px-2 py-1 outline-none" value={editItemName} onChange={(e) => setEditItemName(e.target.value)} />
                            <input className="w-full text-xs border rounded-lg px-2 py-1 outline-none text-slate-500" value={editItemSpecs} onChange={(e) => setEditItemSpecs(e.target.value)} />
                          </div>
                        ) : (
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800">{item.name}</span>
                            <span className="text-xs text-slate-400 mt-0.5">{item.specifications || '無規格資料'}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingItemId === item.id ? (
                          <select className="text-xs font-bold border rounded-lg px-2 py-1 outline-none" value={editItemCategory} onChange={(e) => setEditItemCategory(e.target.value)}>
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                          </select>
                        ) : (
                          <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">{item.category}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {editingItemId === item.id ? (
                          <div className="flex justify-end gap-2">
                            <button onClick={saveItemEdit} className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">儲存</button>
                            <button onClick={() => setEditingItemId(null)} className="text-xs font-bold text-slate-400 px-3 py-1.5 rounded-lg border border-slate-100">取消</button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-3 items-center">
                            {hasHistory ? (
                              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-300">
                                🔒 已有借用紀錄
                              </div>
                            ) : (
                              <>
                                <button onClick={() => startEditingItem(item)} className="text-xs font-bold text-indigo-500 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">編輯</button>
                                <button onClick={() => onDeleteItem(item.id)} className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors text-red-400 hover:bg-red-50`}>移除</button>
                              </>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'admin-bookings' && (
        <div className="space-y-12">
          <MyBookingsView reservations={allReservations} items={items} onCancel={onCancelReservation} onReturnInitiate={() => {}} onBrowse={() => {}} isAdminMode={true} />
        </div>
      )}

      {activeTab === 'admin-users' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4">👤 新增公司成員</h3>
            <form onSubmit={(e) => { e.preventDefault(); onAddUser(newUserName, newUserRole, newUserEmail); setNewUserName(''); setNewUserEmail(''); }} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input type="text" placeholder="真實姓名" className="border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} required />
              <input type="email" placeholder="電子郵件" className="border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} required />
              <select className="border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none bg-white" value={newUserRole} onChange={(e) => setNewUserRole(e.target.value as any)}>
                <option value="employee">一般同仁</option>
                <option value="admin">管理員</option>
              </select>
              <button type="submit" className="bg-indigo-600 text-white font-bold py-2 rounded-xl shadow-lg active:scale-95 transition-all">加入成員</button>
            </form>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">同仁識別</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">權限與管理</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-black text-sm shrink-0">{user.name.charAt(0)}</div>
                        {editingUserId === user.id ? (
                          <div className="flex flex-col gap-2 flex-1">
                            <div className="flex gap-2">
                              <input className="border rounded-lg px-2 py-1 text-sm font-bold flex-1" value={editUserName} onChange={(e) => setEditUserName(e.target.value)} placeholder="姓名" />
                              <select className="border rounded-lg px-2 py-1 text-xs font-bold" value={editUserRole} onChange={(e) => setEditUserRole(e.target.value as any)}>
                                <option value="employee">一般同仁</option>
                                <option value="admin">管理員</option>
                              </select>
                            </div>
                            <input className="border rounded-lg px-2 py-1 text-xs text-slate-400" value={editUserEmail} onChange={(e) => setEditUserEmail(e.target.value)} placeholder="Email" />
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-800">{user.name}</span>
                              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${user.role === 'admin' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                {user.role === 'admin' ? 'ADMIN' : 'STAFF'}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">{user.email || '未設定信箱'}</p>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {editingUserId === user.id ? (
                        <div className="flex justify-end gap-2">
                          <button onClick={saveUserEdit} className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">儲存</button>
                          <button onClick={() => setEditingUserId(null)} className="text-xs font-bold text-slate-400">取消</button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleResetAction(user.id)} 
                            className={`px-4 py-2 rounded-xl text-[11px] font-black border transition-all flex items-center gap-2 ${resetSuccessId === user.id ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg scale-105' : 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100'}`}
                          >
                            {resetSuccessId === user.id ? '✅ 已重設為 1234' : '🔑 重設密碼'}
                          </button>
                          <button onClick={() => startEditingUser(user)} className="text-[11px] font-bold text-indigo-500 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">編輯</button>
                          <button onClick={() => onDeleteUser(user.id)} className="text-[11px] font-bold text-red-400 hover:bg-red-50 px-3 py-2 rounded-xl">移除</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminView;
