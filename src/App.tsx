import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Modules from './pages/Modules';
import Lesson from './pages/Lesson';
import ExtraRecipes from './pages/ExtraRecipes';
import Support from './pages/Support';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';

type Page = 'dashboard' | 'modules' | 'lesson' | 'recipes' | 'support' | 'profile';

interface NavigationData {
  lessonId?: string;
  moduleId?: string;
}

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [navigationData, setNavigationData] = useState<NavigationData>({});

  const handleNavigate = (page: string, data?: NavigationData) => {
    setCurrentPage(page as Page);
    if (data) {
      setNavigationData(data);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
      <main>
        {currentPage === 'dashboard' && <Dashboard onNavigate={handleNavigate} />}
        {currentPage === 'modules' && <Modules onNavigate={handleNavigate} />}
        {currentPage === 'lesson' && navigationData.lessonId && navigationData.moduleId && (
          <Lesson
            lessonId={navigationData.lessonId}
            moduleId={navigationData.moduleId}
            onNavigate={handleNavigate}
          />
        )}
        {currentPage === 'recipes' && <ExtraRecipes />}
        {currentPage === 'support' && <Support />}
        {currentPage === 'profile' && <Profile />}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
