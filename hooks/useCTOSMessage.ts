/**
 * MD2DOC-Evolution
 * CTOS PostMessage Integration Hook
 * 接收來自 CTOS 的檔案內容
 */

import { useEffect, useRef } from 'react';

interface CTOSMessage {
  type: 'load-file';
  filename: string;
  content: string;
}

interface UseCTOSMessageOptions {
  appId: string;
  onLoadFile: (filename: string, content: string) => void;
}

/**
 * Hook to handle postMessage communication with CTOS
 * @param options - Configuration options
 */
export const useCTOSMessage = (options: UseCTOSMessageOptions) => {
  const { appId, onLoadFile } = options;
  const hasReceivedFile = useRef(false);

  useEffect(() => {
    // 判斷是否在 iframe 中
    const isInIframe = window.parent !== window;

    const handleMessage = (event: MessageEvent) => {
      const { data } = event;

      // 忽略非物件訊息
      if (!data || typeof data !== 'object') return;

      // 處理 load-file 訊息
      if (data.type === 'load-file' && data.content) {
        console.log(`[${appId}] 收到檔案:`, data.filename);
        hasReceivedFile.current = true;
        onLoadFile(data.filename, data.content);
      }
    };

    // 監聽訊息
    window.addEventListener('message', handleMessage);

    // 如果在 iframe 中，發送 ready 訊號
    if (isInIframe) {
      // 延遲發送，確保 CTOS 已準備好接收
      setTimeout(() => {
        window.parent.postMessage({
          type: 'ready',
          appId
        }, '*');
        console.log(`[${appId}] 已發送 ready 訊號`);
      }, 100);
    }

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [appId, onLoadFile]);

  return {
    hasReceivedFile: hasReceivedFile.current
  };
};
