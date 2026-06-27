import {
  BookOpen,
  LayoutDashboard,
  UserCog,
  Calendar,
  FileEdit,
  FileBadge,
  CalendarClock,
  ClipboardCheck,
  Wallet,
} from "lucide-react";
import { MainLayout } from "./MainLayout";
import { SharedSubNav } from "./SharedSubNav";

const TutorLayout = () => {

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

    return <SharedSubNav tabs={tabs} />;
  };

  return (
    <MainLayout
      role="Tutor"
      title="Tutor"
      basePath="/tutor/dashboard"
      navItems={navItems}
      renderSubTabs={renderSubTabs}
      titleIcon={BookOpen}
    />
  );
};

export default TutorLayout;
