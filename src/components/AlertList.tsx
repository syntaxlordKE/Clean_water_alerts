import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { supabase, type WaterReport } from '../lib/supabase';
import AlertCard from './AlertCard';

export default function AlertList() {
  const [reports, setReports] = useState<WaterReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'investigating' | 'resolved'>('all');

  useEffect(() => {
    fetchReports();

    const channel = supabase
      .channel('water_reports_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'water_reports' },
        () => {
          fetchReports();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('water_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = filter === 'all'
    ? reports
    : reports.filter(report => report.status === filter);

  const activeCount = reports.filter(r => r.status === 'active').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Water Supply Alerts</h2>
          {activeCount > 0 && (
            <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              {activeCount} active {activeCount === 1 ? 'alert' : 'alerts'}
            </p>
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            All ({reports.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'active'
                ? 'bg-red-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Active ({reports.filter(r => r.status === 'active').length})
          </button>
          <button
            onClick={() => setFilter('investigating')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'investigating'
                ? 'bg-yellow-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Investigating ({reports.filter(r => r.status === 'investigating').length})
          </button>
          <button
            onClick={() => setFilter('resolved')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'resolved'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Resolved ({reports.filter(r => r.status === 'resolved').length})
          </button>
        </div>
      </div>

      {filteredReports.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            {filter === 'all'
              ? 'No water issues reported yet.'
              : `No ${filter} reports found.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <AlertCard key={report.id} report={report} />
          ))}
        </div>
      )}
    </div>
  );
}
