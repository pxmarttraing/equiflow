
import React from 'react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User;
  onSwitchUser: () => void;
  onChangePassword: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, currentUser, onSwitchUser, onChangePassword }) => {
  const allTabs = [
    { id: 'inventory', name: '備品清單', icon: '📋', roles: ['employee', 'admin'] },
    { id: 'my-bookings', name: '我的借用', icon: '👤', roles: ['employee', 'admin'] },
    { id: 'admin-items', name: '備品管理', icon: '📦', roles: ['admin'] },
    { id: 'admin-bookings', name: '借用總覽', icon: '📊', roles: ['admin'] },
    { id: 'admin-users', name: '成員權限', icon: '👥', roles: ['admin'] },
  ];

  const visibleTabs = allTabs.filter(tab => tab.roles.includes(currentUser.role));

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-auto md:h-screen z-40 shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="bg-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold">全</div>
          <h1 className="text-lg font-bold text-slate-800 tracking-tight">營運訓練處</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-50 text-indigo-600 font-semibold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="text-sm font-medium">{tab.name}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 mt-auto bg-slate-50/50">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold shrink-0">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="truncate">
                  <p className="text-sm font-bold text-slate-800 truncate">{currentUser.name}</p>
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${currentUser.role === 'admin' ? 'text-indigo-600' : 'text-slate-400'}`}>
                    {currentUser.role === 'admin' ? '管理員' : '員工'}
                  </p>
                </div>
              </div>
              <button 
                onClick={onSwitchUser}
                title="登出"
                className="text-slate-400 hover:text-red-500 transition-colors p-2"
              >
                🚪
              </button>
            </div>
            <button 
              onClick={onChangePassword}
              className="w-full text-xs py-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-white hover:text-indigo-600 transition-all font-medium"
            >
              🔑 變更密碼
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
