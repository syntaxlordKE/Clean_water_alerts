import { MapPin, Clock, AlertTriangle } from 'lucide-react';
import type { WaterReport } from '../lib/supabase';

type AlertCardProps = {
  report: WaterReport;
};

export default function AlertCard({ report }: AlertCardProps) {
  const severityColors = {
    low: 'bg-blue-50 text-blue-700 border-blue-200',
    medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    high: 'bg-orange-50 text-orange-700 border-orange-200',
    critical: 'bg-red-50 text-red-700 border-red-200',
  };

  const statusColors = {
    active: 'bg-red-100 text-red-800',
    investigating: 'bg-yellow-100 text-yellow-800',
    resolved: 'bg-green-100 text-green-800',
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className={`border-l-4 p-5 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow ${severityColors[report.severity]}`}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[report.status]}`}>
          {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
        </span>
      </div>

      <p className="text-gray-700 mb-4 leading-relaxed">{report.description}</p>

      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4" />
          <span>{report.location}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          <span>{formatDate(report.created_at)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4" />
          <span className="capitalize">{report.severity} severity</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
        Reported by: {report.reported_by}
      </div>
    </div>
  );
}
