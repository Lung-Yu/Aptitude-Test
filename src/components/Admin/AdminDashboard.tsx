import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllRecords } from '../../utils/adminDataFetcher';
import type { ParticipantRecord } from '../../types/admin.types';
import type { Level } from '../../types/results.types';
import { MultiRadarChart } from './MultiRadarChart';

// Helper function to get level badge
const getLevelBadge = (level: Level) => {
  const badges = {
    'Entry': { emoji: '🌱', color: 'text-gray-600 bg-gray-100', label: 'Entry' },
    'Junior': { emoji: '📘', color: 'text-blue-600 bg-blue-100', label: 'Junior' },
    'Mid': { emoji: '🚀', color: 'text-green-600 bg-green-100', label: 'Mid' },
    'Senior': { emoji: '⭐', color: 'text-orange-600 bg-orange-100', label: 'Senior' },
    'Staff': { emoji: '👑', color: 'text-purple-600 bg-purple-100', label: 'Staff' }
  };
  return badges[level];
};

export const AdminDashboard: React.FC = () => {
  const [records, setRecords] = useState<ParticipantRecord[]>([]);
  const [visibleRecords, setVisibleRecords] = useState<Set<string>>(new Set());
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toggleExpand = (email: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(email)) {
        next.delete(email);
      } else {
        next.add(email);
      }
      return next;
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    const result = await fetchAllRecords();
    
    if (result.success) {
      setRecords(result.records);
      // Initially show all
      setVisibleRecords(new Set(result.records.map(r => r.email)));
    } else {
      setError(result.error || '載入失敗');
    }
    
    setLoading(false);
  };

  const togglePerson = (email: string) => {
    setVisibleRecords((prev) => {
      const next = new Set(prev);
      if (next.has(email)) {
        next.delete(email);
      } else {
        next.add(email);
      }
      return next;
    });
  };

  const filteredRecords = records.filter((r) => visibleRecords.has(r.email));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl text-gray-700">載入中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">載入錯誤</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={loadData}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            重新載入
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link 
              to="/"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              ← 返回測驗
            </Link>
            <button
              onClick={loadData}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              🔄 重新整理
            </button>
          </div>
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              管理儀表板
            </h1>
            <p className="text-gray-600">
              共 {records.length} 位參與者 · 目前顯示 {filteredRecords.length} 位
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">選擇顯示對象</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setVisibleRecords(new Set(records.map(r => r.email)))}
                className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                全選
              </button>
              <button
                onClick={() => setVisibleRecords(new Set())}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                全不選
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {records.map((record) => (
              <label
                key={record.email}
                className="flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer hover:bg-gray-50 transition-colors"
                style={{
                  borderColor: visibleRecords.has(record.email) ? '#3b82f6' : '#e5e7eb'
                }}
              >
                <input
                  type="checkbox"
                  checked={visibleRecords.has(record.email)}
                  onChange={() => togglePerson(record.email)}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{record.name}</p>
                  <p className="text-sm text-gray-600 truncate">{record.email}</p>
                  <p className="text-xs text-gray-500">
                    {record.percentage.toFixed(1)}% ({record.totalScore}/{record.totalMaxScore})
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Radar Chart */}
        {filteredRecords.length > 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">能力雷達圖對比</h2>
            <MultiRadarChart records={filteredRecords} />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center mb-8">
            <p className="text-gray-500 text-lg">請至少選擇一位參與者以顯示雷達圖</p>
          </div>
        )}

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">詳細資料</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-2 font-semibold text-gray-700 w-8"></th>
                <th className="text-left py-3 px-2 font-semibold text-gray-700">時間</th>
                <th className="text-left py-3 px-2 font-semibold text-gray-700">姓名</th>
                <th className="text-left py-3 px-2 font-semibold text-gray-700">Email</th>
                <th className="text-left py-3 px-2 font-semibold text-gray-700">公司</th>
                <th className="text-left py-3 px-2 font-semibold text-gray-700">職稱</th>
                <th className="text-center py-3 px-2 font-semibold text-gray-700">職級</th>
                <th className="text-right py-3 px-2 font-semibold text-gray-700">總分</th>
                <th className="text-right py-3 px-2 font-semibold text-gray-700">百分比</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => {
                const isExpanded = expandedRows.has(record.email);
                const badge = record.overallLevel ? getLevelBadge(record.overallLevel) : null;
                
                return (
                  <React.Fragment key={record.email}>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-2">
                        {record.dimensionLevels && (
                          <button
                            onClick={() => toggleExpand(record.email)}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                            title="展開查看各維度職級"
                          >
                            {isExpanded ? '▼' : '▶'}
                          </button>
                        )}
                      </td>
                      <td className="py-3 px-2 text-gray-600 whitespace-nowrap">
                        {new Date(record.timestamp).toLocaleString('zh-TW', {
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="py-3 px-2 font-medium text-gray-900">{record.name}</td>
                      <td className="py-3 px-2 text-gray-600">{record.email}</td>
                      <td className="py-3 px-2 text-gray-600">{record.organization || '-'}</td>
                      <td className="py-3 px-2 text-gray-600">{record.role || '-'}</td>
                      <td className="py-3 px-2 text-center">
                        {badge ? (
                          <div 
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}
                            title={`${badge.label} - ${record.percentage.toFixed(1)}%`}
                          >
                            <span>{badge.emoji}</span>
                            <span>{badge.label}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-2 text-right font-medium text-gray-900">
                        {record.totalScore} / {record.totalMaxScore}
                      </td>
                      <td className="py-3 px-2 text-right font-medium text-blue-600">
                        {record.percentage.toFixed(1)}%
                      </td>
                    </tr>
                    
                    {/* Expanded row showing dimension levels */}
                    {isExpanded && record.dimensionLevels && record.quadrantPercentages && (
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <td colSpan={9} className="py-4 px-6">
                          <div className="text-sm">
                            <p className="font-semibold text-gray-700 mb-3">各維度職級評估：</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              {Object.entries(record.dimensionLevels).map(([dimension, level]) => {
                                const dimBadge = getLevelBadge(level);
                                const percentage = record.quadrantPercentages?.[dimension] ?? 0;
                                
                                return (
                                  <div key={dimension} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                                    <span className="text-gray-700 font-medium text-xs">
                                      {dimension}
                                    </span>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs text-gray-500">
                                        {percentage.toFixed(1)}%
                                      </span>
                                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${dimBadge.color}`}>
                                        <span>{dimBadge.emoji}</span>
                                        <span>{dimBadge.label}</span>
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
