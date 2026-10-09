import AuthModal from "../components/AuthModal";
import BottomNav from "../components/BottomNav";
import Sidebar from "../components/Sidebar";
import AuthProvider from "../context/AuthProvider";
import { useAuth } from "../context/useAuth";

function AppContent({ children }) {
  const { authModalOpen, closeAuth, completeAuth } = useAuth();

  return (
    <div className="h-dvh overflow-hidden bg-[#0D0E12] text-white">
      <div className="flex h-full min-h-0 w-full overflow-hidden">
        <Sidebar />

        <main className="relative min-h-0 min-w-0 flex-1 overflow-hidden">
          {children}
        </main>
      </div>

      <BottomNav />

      {authModalOpen && (
        <AuthModal onClose={closeAuth} onAuthenticated={completeAuth} />
      )}
    </div>
  );
}

function AppShell({ children }) {
  return (
    <AuthProvider>
      <AppContent>{children}</AppContent>
    </AuthProvider>
  );
}

export default AppShell;
