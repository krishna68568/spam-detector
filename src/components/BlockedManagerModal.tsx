import React, { useState } from 'react';
import { Ban, Plus, X, PhoneOff, Trash2, CheckCircle2 } from 'lucide-react';
import { BlockedNumber } from '../types';
import { EmptyState } from './EmptyState';

interface BlockedManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  blockedList: BlockedNumber[];
  onUnblock: (number: string) => void;
  onAddNewBlocked: (number: string, name: string, category: string) => void;
}

export const BlockedManagerModal: React.FC<BlockedManagerModalProps> = ({
  isOpen,
  onClose,
  blockedList,
  onUnblock,
  onAddNewBlocked
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newNumber, setNewNumber] = useState('');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Telemarketing');

  if (!isOpen) return null;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNumber.trim()) return;
    onAddNewBlocked(newNumber.trim(), newName.trim() || 'Manual Block', newCategory);
    setNewNumber('');
    setNewName('');
    setShowAddForm(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md max-h-[85vh] rounded-t-3xl sm:rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-rose-950/80 border border-rose-800/60 flex items-center justify-center text-rose-400">
              <Ban className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Blocked Numbers</h3>
              <p className="text-[11px] text-slate-400">{blockedList.length} numbers blocked</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Add Number Button / Form Toggle */}
        <div className="pt-3 pb-2">
          {!showAddForm ? (
            <button
              id="add-blocked-number-btn"
              onClick={() => setShowAddForm(true)}
              className="w-full py-2.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md shadow-blue-600/30"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Number to Blocklist</span>
            </button>
          ) : (
            <form onSubmit={handleAddSubmit} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">Manually Block a Number</span>
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)}
                  className="text-slate-400 hover:text-white text-xs"
                >
                  Cancel
                </button>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  placeholder="+91 98765 43210"
                  value={newNumber}
                  onChange={(e) => setNewNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Label / Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Card Sales"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Telemarketing">Telemarketing</option>
                    <option value="Scam">Scam</option>
                    <option value="Robocall">Robocall</option>
                    <option value="Harassment">Harassment</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-colors"
              >
                Confirm & Block
              </button>
            </form>
          )}
        </div>

        {/* Blocked Numbers List (Section 9) */}
        <div className="flex-1 overflow-y-auto space-y-2 py-2 pr-1">
          {blockedList.length === 0 ? (
            <EmptyState type="blocked" />
          ) : (
            blockedList.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between hover:bg-slate-950 transition-colors"
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center space-x-2">
                    <p className="font-mono text-xs font-bold text-white truncate">
                      {item.phoneNumber}
                    </p>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800/50">
                      {item.category}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                    {item.name || item.reason}
                  </p>

                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Blocked on {item.blockedAt}
                  </p>
                </div>

                <button
                  onClick={() => onUnblock(item.phoneNumber)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white border border-slate-700 hover:border-blue-500 text-xs font-semibold transition-all shrink-0"
                >
                  Unblock
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
