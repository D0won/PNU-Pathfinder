import { useEffect, useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AdminInfoPage from './pages/AdminInfoPage';
import AdminProgramSearchPage from './pages/AdminProgramSearchPage';
import AuthPage from './pages/AuthPage';
import CalendarPage from './pages/CalendarPage';
import ChatPage from './pages/ChatPage';
import DataPage from './pages/DataPage';
import GrowthPlanPage from './pages/GrowthPlanPage';
import ResumePage from './pages/ResumePage';
import TimetablePage from './pages/TimetablePage';
import type { AuthResult, PageId, UserSession } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('chat');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);

  const isAdmin = currentUser?.role === 'admin';
  const showSidebar = !isAdmin && currentPage === 'chat';

  useEffect(() => {
    const savedUser = window.localStorage.getItem('pnu-pathfinder-user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser) as UserSession;
        setCurrentUser(parsedUser);
        if (parsedUser.role === 'admin') {
          setCurrentPage('admin-program-search');
        }
      } catch {
        window.localStorage.removeItem('pnu-pathfinder-token');
        window.localStorage.removeItem('pnu-pathfinder-user');
      }
    }
  }, []);

  function handleAuthSuccess(authResult: AuthResult) {
    window.localStorage.setItem('pnu-pathfinder-token', authResult.access_token);
    window.localStorage.setItem('pnu-pathfinder-user', JSON.stringify(authResult.user));
    setCurrentUser(authResult.user);
    setCurrentPage(authResult.user.role === 'admin' ? 'admin-program-search' : 'chat');
  }

  function handleLogout() {
    window.localStorage.removeItem('pnu-pathfinder-token');
    window.localStorage.removeItem('pnu-pathfinder-user');
    setCurrentUser(null);
    setCurrentPage('login');
  }

  function handleHome() {
    setCurrentPage(isAdmin ? 'admin-program-search' : 'chat');
  }

  return (
    <div className="h-full w-full flex flex-col">
      <Header
        currentUser={currentUser}
        onLogout={handleLogout}
        onMenu={() => setSidebarOpen((value) => !value)}
        onHome={handleHome}
        onNavigate={setCurrentPage}
      />
      <div className="flex flex-1 overflow-hidden">
        {showSidebar && <Sidebar isOpen={sidebarOpen} />}
        <main className="flex-1 flex flex-col overflow-hidden">
          {!isAdmin && currentPage === 'chat' && <ChatPage />}
          {!isAdmin && currentPage === 'data' && <DataPage />}
          {!isAdmin && currentPage === 'whatif' && <GrowthPlanPage />}
          {!isAdmin && currentPage === 'timetable' && <TimetablePage />}
          {!isAdmin && currentPage === 'resume' && <ResumePage />}
          {!isAdmin && currentPage === 'calendar' && <CalendarPage />}
          {currentPage === 'login' && <AuthPage mode="login" onSwitchMode={setCurrentPage} onAuthSuccess={handleAuthSuccess} />}
          {currentPage === 'signup' && <AuthPage mode="signup" onSwitchMode={setCurrentPage} onAuthSuccess={handleAuthSuccess} />}
          {isAdmin && currentPage === 'admin-info' && <AdminInfoPage />}
          {isAdmin && currentPage === 'admin-program-search' && <AdminProgramSearchPage />}
        </main>
      </div>
    </div>
  );
}
