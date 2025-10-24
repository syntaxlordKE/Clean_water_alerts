import { useState, useEffect } from 'react';
import { MapPin, AlertTriangle } from 'lucide-react';
import { supabase, type WaterReport } from '../lib/supabase';

export default function MapView() {
  const [reports, setReports] = useState<WaterReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<WaterReport | null>(null);

  useEffect(() => {
    fetchReports();
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

  const groupByLocation = (reports: WaterReport[]) => {
    const grouped = reports.reduce((acc, report) => {
      const location = report.location;
      if (!acc[location]) {
        acc[location] = [];
      }
      acc[location].push(report);
      return acc;
    }, {} as Record<string, WaterReport[]>);

    return Object.entries(grouped).map(([location, reports]) => ({
      location,
      reports,
      activeCount: reports.filter(r => r.status === 'active').length,
      totalCount: reports.length,
    }));
  };

  const locationGroups = groupByLocation(reports);

  const severityColors = {
    low: 'border-blue-400',
    medium: 'border-yellow-400',
    high: 'border-orange-400',
    critical: 'border-red-400',
  };

  const statusColors = {
    active: 'bg-red-100 text-red-800',
    investigating: 'bg-yellow-100 text-yellow-800',
    resolved: 'bg-green-100 text-green-800',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Location-Based View</h2>
        <p className="text-sm text-gray-600 mt-1">
          {locationGroups.length} {locationGroups.length === 1 ? 'location' : 'locations'} with reported issues
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3 h-fit">
          {locationGroups.map((group) => (
            <div
              key={group.location}
              className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-blue-400"
              onClick={() => setSelectedReport(group.reports[0])}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900">{group.location}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {group.totalCount} {group.totalCount === 1 ? 'report' : 'reports'}
                    </p>
                  </div>
                </div>
                {group.activeCount > 0 && (
                  <div className="flex items-center gap-1 bg-red-50 text-red-700 px-2 py-1 rounded text-xs font-medium">
                    <AlertTriangle className="w-3 h-3" />
                    {group.activeCount}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-1 mt-3">
                {group.reports.slice(0, 3).map((report) => (
                  <span
                    key={report.id}
                    className={`text-xs px-2 py-0.5 rounded ${statusColors[report.status]}`}
                  >
                    {report.status}
                  </span>
                ))}
                {group.reports.length > 3 && (
                  <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                    +{group.reports.length - 3} more
                  </span>
                )}
              </div>
            </div>
          ))}

          {locationGroups.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No locations with reports found.</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20 h-fit">
          {selectedReport ? (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Details</h3>

              <div className={`border-l-4 p-4 bg-gray-50 rounded ${severityColors[selectedReport.severity]} mb-4`}>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900">{selectedReport.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[selectedReport.status]}`}>
                    {selectedReport.status}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-3">{selectedReport.description}</p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedReport.location}</span>
                  </div>
                  <div className="text-gray-600">
                    <span className="font-medium">Severity:</span> {selectedReport.severity}
                  </div>
                  <div className="text-gray-600">
                    <span className="font-medium">Reported by:</span> {selectedReport.reported_by}
                  </div>
                  <div className="text-gray-600">
                    <span className="font-medium">Date:</span> {new Date(selectedReport.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedReport(null)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear selection
              </button>
            </div>
          ) : (
            <div className="text-center py-12">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-sm">Select a location to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
