import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/layout/ToastContainer';
import { HomePage } from './pages/HomePage';
import { FindClassroomPage } from './pages/FindClassroomPage';
import { MySearchesPage } from './pages/MySearchesPage';
import { AboutPage } from './pages/AboutPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ClassroomManagement } from './pages/admin/ClassroomManagement';
import { TimetableManagement } from './pages/admin/TimetableManagement';
import { LayoutDashboard, Building2, Calendar, ArrowLeft } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab, currentUser } = useApp();

  const renderView = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'find':
        return <FindClassroomPage />;
      case 'history':
        return <MySearchesPage />;
      case 'about':
        return <AboutPage />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'admin-classrooms':
        return <ClassroomManagement />;
      case 'admin-timetable':
        return <TimetableManagement />;
      default:
        return <HomePage />;
    }
  };

  const isAdminTab = activeTab.startsWith('admin-');

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-teal-500 selection:text-white">
      <Navbar />

      {/* Admin Sub-navigation Header if on Admin tab */}
      {isAdminTab && (
        <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('find')}
                className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Student Portal</span>
              </button>
              <span className="text-slate-700">|</span>
              <span className="text-emerald-400 font-bold">Administrator Workspace</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('admin-dashboard')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  activeTab === 'admin-dashboard'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard Stats</span>
              </button>

              <button
                onClick={() => setActiveTab('admin-classrooms')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  activeTab === 'admin-classrooms'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Classrooms</span>
              </button>

              <button
                onClick={() => setActiveTab('admin-timetable')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  activeTab === 'admin-timetable'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Timetable</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {renderView()}
      </main>

      <Footer />
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
