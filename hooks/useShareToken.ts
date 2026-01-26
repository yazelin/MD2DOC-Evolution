/**
 * MD2DOC-Evolution
 * ShareToken Integration Hook
 * 處理來自 CTOS 分享連結的內容載入
 */

import { useState, useEffect, useCallback } from 'react';

// CTOS API 端點
const CTOS_API_BASE = 'https://ching-tech.ddns.net/ctos';

interface ShareTokenState {
  isLoading: boolean;
  showPasswordDialog: boolean;
  error: string | null;
  token: string | null;
}

interface UseShareTokenOptions {
  onLoadContent: (content: string, filename?: string) => void;
}

/**
 * Hook to handle shareToken parameter from URL
 * @param options - Configuration options
 */
export const useShareToken = (options: UseShareTokenOptions) => {
  const { onLoadContent } = options;

  const [state, setState] = useState<ShareTokenState>({
    isLoading: false,
    showPasswordDialog: false,
    error: null,
    token: null
  });

  const [password, setPassword] = useState('');
  const [attempts, setAttempts] = useState(0);

  // 檢測 URL 中的 shareToken 參數
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shareToken = params.get('shareToken');

    if (shareToken) {
      console.log('[MD2DOC] 檢測到 shareToken:', shareToken);
      setState(prev => ({
        ...prev,
        token: shareToken,
        showPasswordDialog: true
      }));

      // 清除 URL 中的 shareToken 參數，避免重複處理
      const url = new URL(window.location.href);
      url.searchParams.delete('shareToken');
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  // 驗證密碼並載入內容
  const submitPassword = useCallback(async () => {
    if (!state.token || !password) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch(
        `${CTOS_API_BASE}/api/public/${state.token}?password=${encodeURIComponent(password)}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('[MD2DOC] 成功載入分享內容', data);

        // 載入內容（API 回應結構：{ type, data: { content, filename }, ... }）
        const contentData = data.data || data;
        if (contentData.content) {
          onLoadContent(contentData.content, contentData.filename);
        }

        // 關閉對話框
        setState(prev => ({
          ...prev,
          isLoading: false,
          showPasswordDialog: false,
          token: null
        }));
        setPassword('');
        setAttempts(0);
      } else {
        const errorData = await response.json().catch(() => ({}));
        let errorMessage = '密碼錯誤';

        if (response.status === 404) {
          errorMessage = '連結不存在或已過期';
        } else if (response.status === 423) {
          errorMessage = '因錯誤次數過多，連結已鎖定';
        } else if (response.status === 410) {
          errorMessage = '連結已過期';
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        }

        setAttempts(prev => prev + 1);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: errorMessage
        }));
      }
    } catch (error) {
      console.error('[MD2DOC] 載入分享內容失敗:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: '網路錯誤，請稍後再試'
      }));
    }
  }, [state.token, password, onLoadContent]);

  // 關閉對話框
  const closeDialog = useCallback(() => {
    setState(prev => ({
      ...prev,
      showPasswordDialog: false,
      error: null,
      token: null
    }));
    setPassword('');
    setAttempts(0);
  }, []);

  return {
    ...state,
    password,
    setPassword,
    attempts,
    submitPassword,
    closeDialog
  };
};
