import { Bell, Home, Search, Upload, Wallet, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const navItems = [
  { label: "Feed", path: "/", icon: Home },
  { label: "Search", path: "/search", icon: Search },
  { label: "Upload", path: "/upload", icon: Upload, requiresAuth: true },
  { label: "Wallet", path: "/wallet", icon: Wallet, requiresAuth: true },
  {
    label: "Notifications",
    path: "/notifications",
    icon: Bell,
    badge: 3,
    requiresAuth: true,
  },
  { label: "Profile", path: "/profile", icon: User, requiresAuth: true },
];

function BottomNav() {
  const { isAuthenticated, requireAuth } = useAuth();

  const handleProtectedClick = (event, item) => {
    if (!item.requiresAuth || isAuthenticated) return;

    event.preventDefault();
    requireAuth();
  };

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/[0.06] bg-[#050607]/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-2xl md:hidden"
    >
      <div className="mx-auto flex h-14 max-w-lg items-center justify-around px-1">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              onClick={(event) => handleProtectedClick(event, item)}
              aria-label={item.label}
              title={item.label}
              className={({ isActive }) =>
                `group flex h-full min-w-0 flex-1 flex-col items-center justify-center gap-1 transition-colors duration-200 ${
                  isActive ? "text-white" : "text-white/40"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="relative flex">
                    <Icon size={20} strokeWidth={isActive ? 2 : 1.75} />

                    {item.badge > 0 && (
                      <span className="absolute -right-2 -top-2 flex min-w-4 items-center justify-center rounded-full bg-[#FF3B5C] px-1 text-[9px] font-bold leading-4 text-white">
                        {item.badge > 9 ? "9+" : item.badge}
                      </span>
                    )}
                  </span>

                  <span className="max-w-full truncate text-[11px] font-medium leading-none">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNav;
