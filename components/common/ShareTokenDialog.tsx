/**
 * MD2DOC-Evolution
 * ShareToken Password Dialog Component
 * 用於輸入分享連結的密碼
 */

import React, { KeyboardEvent } from 'react';

interface ShareTokenDialogProps {
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  password: string;
  attempts: number;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export const ShareTokenDialog: React.FC<ShareTokenDialogProps> = ({
  isOpen,
  isLoading,
  error,
  password,
  attempts,
  onPasswordChange,
  onSubmit,
  onClose
}) => {
  if (!isOpen) return null;

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading && password) {
      onSubmit();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-sm mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            載入分享內容
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          請輸入 4 位數密碼以載入分享內容
        </p>

        {/* Password Input */}
        <div className="mb-4">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={4}
            value={password}
            onChange={(e) => onPasswordChange(e.target.value.replace(/\D/g, '').slice(0, 4))}
            onKeyDown={handleKeyDown}
            placeholder="請輸入 4 位數密碼"
            className="w-full px-4 py-3 text-center text-2xl tracking-widest font-mono border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            autoFocus
            disabled={isLoading}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            {attempts > 0 && attempts < 5 && (
              <p className="text-xs text-red-500 dark:text-red-500 mt-1">
                已嘗試 {attempts} 次（5 次後將鎖定）
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            disabled={isLoading}
          >
            取消
          </button>
          <button
            onClick={onSubmit}
            disabled={isLoading || password.length !== 4}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                載入中...
              </>
            ) : (
              '確認'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
