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

function Sidebar() {
  const { isAuthenticated, requireAuth } = useAuth();

  const handleProtectedClick = (event, item) => {
    if (!item.requiresAuth || isAuthenticated) return;

    event.preventDefault();
    requireAuth();
  };

  return (
    <aside className="hidden h-dvh w-[72px] shrink-0 flex-col border-r border-white/[0.06] bg-[#050607] md:flex lg:w-[250px]">
      <div className="flex h-[76px] shrink-0 items-center justify-center px-4 md:justify-center lg:justify-start lg:px-6">
        <span className="text-[25px] font-semibold tracking-[-0.04em] text-white">
          Reely
        </span>
      </div>

      <nav aria-label="Main navigation" className="flex-1 px-2.5 lg:px-4">
        <div className="space-y-1">
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
                  `group flex h-12 items-center justify-center gap-3.5 rounded-xl px-3 transition-colors duration-200 lg:justify-start lg:px-4 ${
                    isActive
                      ? "bg-white/[0.07] text-white"
                      : "text-white/40 hover:bg-white/[0.04] hover:text-white/70"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="relative flex shrink-0">
                      <Icon size={20} strokeWidth={isActive ? 2 : 1.75} />

                      {item.badge > 0 && (
                        <span className="absolute -right-2 -top-2 flex min-w-4 items-center justify-center rounded-full bg-[#FF3B5C] px-1 text-[9px] font-bold leading-4 text-white">
                          {item.badge > 9 ? "9+" : item.badge}
                        </span>
                      )}
                    </span>

                    <span className="hidden min-w-0 truncate text-base font-medium lg:inline">
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;
