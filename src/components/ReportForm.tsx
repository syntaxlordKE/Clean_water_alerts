import { useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

type ReportFormProps = {
  onSuccess: () => void;
};

export default function ReportForm({ onSuccess }: ReportFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    severity: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    reported_by: '',
    contact_info: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const { error } = await supabase.from('water_reports').insert([
        {
          title: formData.title,
          description: formData.description,
          location: formData.location,
          severity: formData.severity,
          reported_by: formData.reported_by,
          contact_info: formData.contact_info || null,
          status: 'active',
        },
      ]);

      if (error) throw error;

      setSubmitStatus('success');
      setFormData({
        title: '',
        description: '',
        location: '',
        severity: 'medium',
        reported_by: '',
        contact_info: '',
      });

      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (error) {
      console.error('Error submitting report:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Report Water Issue</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Issue Title *
            </label>
            <input
              type="text"
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="Brief title of the water issue"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
              placeholder="Detailed description of the problem"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              id="location"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="Street address or area name"
            />
          </div>

          <div>
            <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-2">
              Severity *
            </label>
            <select
              id="severity"
              value={formData.severity}
              onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            >
              <option value="low">Low - Minor inconvenience</option>
              <option value="medium">Medium - Noticeable impact</option>
              <option value="high">High - Significant disruption</option>
              <option value="critical">Critical - Emergency situation</option>
            </select>
          </div>

          <div>
            <label htmlFor="reported_by" className="block text-sm font-medium text-gray-700 mb-2">
              Your Name *
            </label>
            <input
              type="text"
              id="reported_by"
              required
              value={formData.reported_by}
              onChange={(e) => setFormData({ ...formData, reported_by: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="Full name"
            />
          </div>

          <div>
            <label htmlFor="contact_info" className="block text-sm font-medium text-gray-700 mb-2">
              Contact Information (Optional)
            </label>
            <input
              type="text"
              id="contact_info"
              value={formData.contact_info}
              onChange={(e) => setFormData({ ...formData, contact_info: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="Email or phone number"
            />
          </div>

          {submitStatus === 'error' && (
            <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-md">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">Failed to submit report. Please try again.</span>
            </div>
          )}

          {submitStatus === 'success' && (
            <div className="flex items-center gap-2 p-4 bg-green-50 text-green-700 rounded-md">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm">Report submitted successfully!</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>
      </div>
    </div>
  );
}
