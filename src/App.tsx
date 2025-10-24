import { useState } from 'react';
import Header from './components/Header';
import AlertList from './components/AlertList';
import ReportForm from './components/ReportForm';
import MapView from './components/MapView';

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'report' | 'map'>('home');

  const handleReportSuccess = () => {
    setTimeout(() => {
      setCurrentView('home');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentView={currentView} onNavigate={setCurrentView} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'home' && <AlertList />}
        {currentView === 'report' && <ReportForm onSuccess={handleReportSuccess} />}
        {currentView === 'map' && <MapView />}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-600">
            Clean Water Alert System - Report and track water supply issues in your community
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
