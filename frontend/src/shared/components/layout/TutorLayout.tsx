import { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import {
  BookOpen,
  LayoutDashboard,
  UserCog,
  Calendar,
  FileEdit,
  LogOut,
  Menu,
  X,
  Bell,
  Globe,
  FileBadge,
  CalendarClock,
  ClipboardCheck,
  Wallet,
} from "lucide-react";

const TutorLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "staff",
      title: "Schedule Updated",
      message: "Your teaching schedule for next week has been confirmed.",
      time: "10 mins ago",
      unread: true,
    },
    {
      id: 2,
      type: "system",
      title: "System Update",
      message:
        "ICMS platform will have a scheduled maintenance this Sunday at 2 AM.",
      time: "1 day ago",
      unread: false,
    },
    {
      id: 3,
      type: "admin",
      title: "Salary Disbursed",
      message: "Your salary for last month has been transferred.",
      time: "3 days ago",
      unread: false,
    },
  ]);

  const getTagColor = (type: string) => {
    switch (type) {
      case "staff":
        return "bg-[#fff4ce] text-[#855e00]";
      case "system":
        return "bg-[#d2e4ff] text-[#001d37]";
      case "tutor":
        return "bg-[#c2f0ce] text-[#00210a]";
      default:
        return "bg-[#e0e3e5] text-[#43474e]";
    }
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  const isActivePath = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  // Flat Sidebar Links
  const navItems = [
    { name: "Dashboard", path: "/tutor/dashboard", icon: LayoutDashboard },
    {
      name: "Profile & Certificates",
      path: "/tutor/profile",
      icon: UserCog,
      activePaths: ["/tutor/profile", "/tutor/certificates"],
    },
    {
      name: "Teaching & Schedule",
      path: "/tutor/schedule",
      icon: Calendar,
      activePaths: ["/tutor/schedule", "/tutor/availability"],
    },
    {
      name: "Class Management",
      path: "/tutor/classes",
      icon: ClipboardCheck,
      activePaths: ["/tutor/classes"],
    },
    {
      name: "Requests",
      path: "/tutor/change-requests",
      icon: FileEdit,
      activePaths: ["/tutor/change-requests", "/tutor/support-tickets"],
    },
    { name: "Finance", path: "/tutor/salary", icon: Wallet },
  ];

  const isGroupActive = (item: { path: string; activePaths?: string[] }) => {
    if (item.activePaths)
      return item.activePaths.some((p: string) => isActivePath(p));
    return isActivePath(item.path);
  };

  // Sub-navigation Tabs based on the current active group
  const renderSubTabs = () => {
    const path = location.pathname;
    let tabs: { name: string; path: string; icon: React.ElementType }[] = [];

    if (
      path.startsWith("/tutor/profile") ||
      path.startsWith("/tutor/certificates")
    ) {
      tabs = [
        { name: "My Profile", path: "/tutor/profile", icon: UserCog },
        {
          name: "My Certificates",
          path: "/tutor/certificates",
          icon: FileBadge,
        },
      ];
    } else if (
      path.startsWith("/tutor/schedule") ||
      path.startsWith("/tutor/availability")
    ) {
      tabs = [
        { name: "Teaching Schedule", path: "/tutor/schedule", icon: Calendar },
        {
          name: "Availability Registration",
          path: "/tutor/availability",
          icon: CalendarClock,
        },
      ];
    } else if (
      path.startsWith("/tutor/change-requests") ||
      path.startsWith("/tutor/support-tickets")
    ) {
      tabs = [
        {
          name: "Schedule Changes",
          path: "/tutor/change-requests",
          icon: FileEdit,
        },
        {
          name: "Support Tickets",
          path: "/tutor/support-tickets",
          icon: FileEdit,
        },
      ];
    }

    if (tabs.length === 0) return null;

    return (
      <div className="bg-white border-b border-[#e0e3e5] px-6 flex items-center gap-6 overflow-x-auto scrollbar-none sticky top-18 z-30">
        {tabs.map((tab) => {
          const active = isActivePath(tab.path);
          return (
            <Link
              key={tab.name}
              to={tab.path}
              className={`flex items-center gap-2 py-3.5 border-b-2 font-bold text-sm whitespace-nowrap transition-colors ${active ? "border-[#0061a5] text-[#0061a5]" : "border-transparent text-[#74777f] hover:text-[#002045]"}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </Link>
          );
        })}
      </div>
    );
  };

  const [userInfo, setUserInfo] = useState(() => {
    const userInfoStr = Cookies.get("user_info");
    return userInfoStr ? JSON.parse(userInfoStr) : null;
  });

  useEffect(() => {
    const handleProfileUpdate = () => {
      const str = Cookies.get("user_info");
      if (str) {
        setUserInfo(JSON.parse(str));
      }
    };
    window.addEventListener("profileUpdated", handleProfileUpdate);
    return () =>
      window.removeEventListener("profileUpdated", handleProfileUpdate);
  }, []);
  const fullName = userInfo?.full_name || "Tutor User";
  const roleText = userInfo?.role;
  const initials = fullName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
  const avatarUrl = userInfo?.avatar_url;

  return (
    <div className="min-h-screen bg-[#f7fafc] flex font-sans text-[#181c1e]">
      {/* Sidebar Desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-65 bg-white border-r border-[#e0e3e5] transition-transform transform ${sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"} md:sticky md:top-0 md:h-screen md:translate-x-0 flex flex-col`}
      >
        <div className="flex items-center justify-between h-18 px-6 border-b border-[#e0e3e5] shrink-0">
          <Link
            to="/tutor/dashboard"
            className="text-2xl font-extrabold text-[#002045] flex items-center gap-2"
          >
            <BookOpen className="w-7 h-7 text-[#0061a5]" />
            ICMS{" "}
            <span className="text-[#0061a5] font-semibold text-lg">
              Tutor
            </span>
          </Link>
          <button
            className="md:hidden text-[#74777f] hover:text-[#002045]"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 scrollbar-thin scrollbar-thumb-[#c4c6cf] scrollbar-track-transparent">
          <ul className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = isGroupActive(item);
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${isActive ? "bg-[#e6f0fa] text-[#0061a5]" : "text-[#43474e] hover:bg-[#f8f9fa] hover:text-[#002045]"}`}
                  >
                    <item.icon
                      className={`w-5 h-5 shrink-0 ${isActive ? "text-[#0061a5]" : "text-[#74777f]"}`}
                    />
                    <span className="truncate">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-[#e0e3e5] shrink-0 bg-[#f8f9fa] space-y-1.5">
          <Link
            to="/homepage"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#43474e] font-bold hover:bg-[#e0e3e5]/50 transition-colors"
          >
            <Globe className="w-5 h-5" />
            <span className="text-sm">Back to Homepage</span>
          </Link>
          <button
            onClick={() => {
              Cookies.remove("access_token", { path: "/" });
              Cookies.remove("refresh_token", { path: "/" });
              Cookies.remove("user_info", { path: "/" });
              window.location.href = "/homepage";
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#ba1a1a] font-bold hover:bg-[#ffdad6]/50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 h-18 bg-white/80 backdrop-blur-md border-b border-[#e0e3e5] flex items-center justify-between px-6 shrink-0 z-40">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 -ml-2 text-[#43474e] hover:bg-[#f1f4f6] rounded-xl transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden md:flex flex-col">
              <span className="text-lg font-bold text-[#002045]">
                Welcome back, {fullName}!
              </span>
              <span className="text-xs text-[#74777f]">
                Ready for your classes today?
              </span>
            </div>
          </div>

          <div className="flex items-center gap-5">
            {/* Notifications */}
            <div className="relative">
              <button
                className={`p-2 rounded-full transition-colors ${showNotifications ? "bg-[#e6f0fa] text-[#0061a5]" : "text-[#43474e] hover:bg-[#f1f4f6]"}`}
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#ba1a1a] rounded-full border-2 border-white"></span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowNotifications(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-80 md:w-95 bg-white rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.12)] border border-[#e0e3e5] z-50 overflow-hidden animate-fade-in-down origin-top-right">
                    <div className="p-4 border-b border-[#e0e3e5] flex justify-between items-center bg-[#f7fafc]">
                      <h3 className="font-bold text-[#181c1e]">
                        Notifications
                      </h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs font-semibold text-[#0061a5] hover:text-[#002045]"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="max-h-100 overflow-y-auto scrollbar-none">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-[#e0e3e5] hover:bg-[#f7fafc] transition-colors cursor-pointer ${notification.unread ? "bg-white" : "bg-[#f7fafc]/50 opacity-70"}`}
                        >
                          <div className="flex gap-3">
                            <div
                              className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notification.unread ? "bg-[#0061a5]" : "bg-transparent"}`}
                            ></div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span
                                  className={`px-2 py-0.5 rounded text-xs font-extrabold tracking-wider uppercase ${getTagColor(notification.type)}`}
                                >
                                  {notification.type}
                                </span>
                                <h4
                                  className={`text-sm ${notification.unread ? "font-bold text-[#181c1e]" : "font-medium text-[#43474e]"}`}
                                >
                                  {notification.title}
                                </h4>
                              </div>
                              <p className="text-xs text-[#43474e] mt-1 leading-relaxed">
                                {notification.message}
                              </p>
                              <span className="text-xs font-medium text-[#74777f] mt-2 block">
                                {notification.time}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 text-center border-t border-[#e0e3e5] bg-[#f8f9fa]">
                      <Link
                        to="/tutor/notifications"
                        onClick={() => setShowNotifications(false)}
                        className="text-xs font-bold text-[#0061a5] hover:underline block w-full"
                      >
                        View All Notifications
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile Dropdown */}
            <Link
              to="/tutor/profile"
              className="flex items-center gap-3 pl-5 border-l border-[#e0e3e5] cursor-pointer group"
            >
              <div className="hidden md:flex flex-col text-right">
                <span className="text-sm font-bold text-[#002045] leading-tight group-hover:text-[#0061a5] transition-colors">
                  {fullName}
                </span>
                <span className="text-xs text-[#74777f] leading-tight uppercase">
                  {roleText ? roleText.toUpperCase() : ""}
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#0061a5] flex items-center justify-center text-white font-bold text-sm shadow-sm border-2 border-white group-hover:shadow-md transition-all overflow-hidden">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>
            </Link>
          </div>
        </header>

        {/* Sub Navigation (Sticky below header) */}
        {renderSubTabs()}

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto scrollbar-none bg-[#f7fafc] relative">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-[#002045]/20 backdrop-blur-sm z-40 md:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default TutorLayout;
