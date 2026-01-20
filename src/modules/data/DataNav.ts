import {
  IconUsers,
  IconClock,
  IconPackage,
  IconCash,
  IconLayoutDashboard,
  IconReportAnalytics,
  IconSettings,
} from "@tabler/icons-react";

export const dataNav = [
  {
    link: "/admin",
    label: "Dashboard",
    icon: IconLayoutDashboard,
  },
  {
    link: "/admin/users",
    label: "Nhân viên",
    icon: IconUsers,
  },
  {
    link: "/admin/attendance",
    label: "Chấm công",
    icon: IconClock,
  },
  {
    link: "/admin/products",
    label: "Sản phẩm",
    icon: IconPackage,
  },
  {
    link: "/admin/commissions",
    label: "Hoa hồng",
    icon: IconCash,
  },
  {
    link: "/admin/reports",
    label: "Báo cáo",
    icon: IconReportAnalytics,
  },
  {
    link: "/admin/settings",
    label: "Cài đặt",
    icon: IconSettings,
  },
];
