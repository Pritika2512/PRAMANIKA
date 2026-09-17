import { paths } from "./navigationConfig.js";
export const dashboardStats = [
  {
    id: "total",
    title: "Total instruments",
    icon: "Scale",
    link: paths.instruments,
    tone: "primary",
    note: "Registered in this workspace",
  },
  {
    id: "verified",
    title: "Verified instruments",
    icon: "CheckCircle2",
    link: paths.instruments + "?status=VERIFIED",
    tone: "success",
    note: "Current registry status",
  },
  {
    id: "pending",
    title: "Pending instruments",
    icon: "Clock3",
    link: paths.instruments + "?status=PENDING",
    tone: "warning",
    note: "Awaiting status update",
  },
  {
    id: "attention",
    title: "Need attention",
    icon: "AlertTriangle",
    link: paths.instruments + "?attention=true",
    tone: "danger",
    note: "Expired or failed records",
  },
];
export const adminStats = [
  {
    id: "totalUsers",
    title: "Total users",
    icon: "Users",
    link: paths.users,
    tone: "primary",
  },
  {
    id: "activeUsers",
    title: "Active accounts",
    icon: "UserCheck",
    link: paths.users + "?status=ACTIVE",
    tone: "success",
  },
  {
    id: "pendingUsers",
    title: "Pending accounts",
    icon: "Clock3",
    link: paths.users + "?status=PENDING",
    tone: "warning",
  },
  {
    id: "admins",
    title: "Administrators",
    icon: "ShieldCheck",
    link: paths.users + "?role=ADMIN",
    tone: "primary",
  },
];
export const activityColumns = [
  { key: "action", label: "Activity" },
  { key: "actor", label: "By" },
  { key: "target", label: "Record" },
  { key: "date", label: "Date", kind: "date" },
];
export const chartColors = {
  VERIFIED: "#23856b",
  PENDING: "#d79620",
  EXPIRED: "#c45050",
  FAILED: "#8b647d",
};
