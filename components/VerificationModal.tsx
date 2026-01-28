
import React, { useState } from 'react';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (verifierName: string) => void;
}

const VerificationModal: React.FC<VerificationModalProps> = ({ isOpen, onClose, onVerify }) => {
  const [verifier, setVerifier] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifier.trim().length < 2) return;
    onVerify(verifier);
    setVerifier('');
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl animate-popIn p-8 text-center">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
          🛡️
        </div>
        
        <h3 className="text-2xl font-bold text-slate-900 mb-2">第二人歸還驗證</h3>
        <p className="text-slate-500 mb-8">基於資產管理規範，請由另一位同仁在此確認設備已現場點交歸還。</p>
        
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">驗證人姓名 (同仁)</label>
            <input 
              type="text" 
              placeholder="請同仁輸入姓名..."
              className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none"
              value={verifier}
              onChange={(e) => setVerifier(e.target.value)}
              required
              autoFocus
            />
          </div>
          
          <button 
            type="submit"
            className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 mt-4"
          >
            確認並完成歸還
          </button>
          
          <button 
            type="button"
            onClick={onClose}
            className="w-full py-3 text-slate-400 font-medium hover:text-slate-600"
          >
            稍後再說
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerificationModal;
