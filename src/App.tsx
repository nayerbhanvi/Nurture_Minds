import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navigation } from './components/Navigation';
import { AuthModal } from './components/AuthModal';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { AssessmentPage } from './pages/AssessmentPage';
import { GamesPage } from './pages/GamesPage';
import { ForumPage } from './pages/ForumPage';
import { ChatbotPage } from './pages/ChatbotPage';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('home');
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleNavigate = (view: string) => {
    if (!user && view !== 'home') {
      setShowAuthModal(true);
      return;
    }
    setCurrentView(view);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Nurture Minds...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation
        currentView={currentView}
        onNavigate={handleNavigate}
        onAuthClick={() => setShowAuthModal(true)}
      />

      {currentView === 'home' && <HomePage onGetStarted={() => setShowAuthModal(true)} />}
      {currentView === 'dashboard' && user && <DashboardPage />}
      {currentView === 'assessment' && user && <AssessmentPage />}
      {currentView === 'games' && user && <GamesPage />}
      {currentView === 'forum' && user && <ForumPage />}
      {currentView === 'chatbot' && user && <ChatbotPage />}

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
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
