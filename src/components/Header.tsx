import { Droplet } from 'lucide-react';

type HeaderProps = {
  currentView: 'home' | 'report' | 'map';
  onNavigate: (view: 'home' | 'report' | 'map') => void;
};

export default function Header({ currentView, onNavigate }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
            <Droplet className="w-8 h-8 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-900">Clean Water Alert</h1>
          </div>

          <nav className="flex gap-6">
            <button
              onClick={() => onNavigate('home')}
              className={`text-sm font-medium transition-colors ${
                currentView === 'home'
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('map')}
              className={`text-sm font-medium transition-colors ${
                currentView === 'map'
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Map View
            </button>
            <button
              onClick={() => onNavigate('report')}
              className={`text-sm font-medium px-4 py-1.5 rounded-md transition-colors ${
                currentView === 'report'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Report Issue
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
