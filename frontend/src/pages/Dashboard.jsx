import { useState } from 'react';
import { Link } from 'react-router-dom';
import StatsDashboard from '@/components/data/StatsDashboard';
import AccidentTable from '@/components/data/AccidentTable';
import ExportPanel from '@/components/data/ExportPanel';
import SQLQueryBuilder from '@/components/filters/SQLQueryBuilder';
import { useFilters } from '@/contexts/FilterContext';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview'); // overview, query, data

  return (
    <div className="flex-1 overflow-y-auto" id="dashboard-page">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-sm text-dark-300 mt-1">Accident data analysis & research tools</p>
          </div>
          <Link to="/" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-600 text-dark-200 hover:text-white text-sm no-underline transition-colors border border-dark-500">
            ← Back to Map
          </Link>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 p-1 rounded-xl bg-dark-700/50 border border-dark-500/50 w-fit">
          {[
            ['overview', '📊 Overview'],
            ['query', '🔬 SQL Query'],
            ['data', '📋 Records'],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === key
                  ? 'bg-accent text-white shadow-lg shadow-accent/20'
                  : 'text-dark-300 hover:text-white hover:bg-dark-600'
              }`}
              id={`tab-${key}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && <StatsDashboard />}

        {activeTab === 'query' && (
          <div className="space-y-6">
            <SQLQueryBuilder />
          </div>
        )}

        {activeTab === 'data' && (
          <div className="space-y-4">
            <ExportPanel />
            <AccidentTable />
          </div>
        )}
      </div>
    </div>
  );
}
