import React, { useState, useEffect } from 'react';
import { logger } from '../../lib/services/logging';

export const LogViewer: React.FC = () => {
  const [logs, setLogs] = useState(logger.getLogs());
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(logger.getLogs());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!import.meta.env.DEV) return null;

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-md opacity-50 hover:opacity-100"
      >
        Show Logs
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-96 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="font-medium">Application Logs</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          Close
        </button>
      </div>
      
      <div className="h-full overflow-auto p-4">
        {logs.map((log, index) => (
          <div 
            key={index}
            className={`mb-2 p-2 rounded ${
              log.level === 'error' ? 'bg-red-50 text-red-700' :
              log.level === 'warn' ? 'bg-yellow-50 text-yellow-700' :
              log.level === 'info' ? 'bg-blue-50 text-blue-700' :
              'bg-gray-50 text-gray-700'
            }`}
          >
            <div className="text-xs opacity-75">
              {new Date(log.timestamp).toLocaleTimeString()}
            </div>
            <div className="font-medium">{log.message}</div>
            {log.data && (
              <pre className="text-xs mt-1 overflow-x-auto">
                {JSON.stringify(log.data, null, 2)}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};