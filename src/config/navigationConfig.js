import { roles } from "./userConfig.js";
export const paths = {
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  instruments: "/instruments",
  instrumentRegister: "/instruments/register",
  instrumentDetail: "/instruments/:id",
  admin: "/admin",
  users: "/admin/users",
  inspections: "/inspections",
  inspectionNew: "/inspections/new",
  inspectionDetail: "/inspections/:id",
  certificates: "/certificates",
  certificateDetail: "/certificates/:id",
  certificateByInspection: "/certificates/by-inspection/:id",
  verificationHistory: "/verification-history",
};
export const instrumentPath = (id) =>
  paths.instrumentDetail.replace(":id", encodeURIComponent(id));
export const pageConfig = {
  login: {
    title: "Welcome back",
    subtitle: "Sign in to your instrument management workspace.",
  },
  register: {
    title: "Create your account",
    subtitle: "Join the workspace as an inspector.",
  },
  dashboard: {
    title: "Verification Hub",
    subtitle: "A clear overview of your instrument registry.",
  },
  instruments: {
    title: "Instrument registry",
    subtitle: "Find, review and maintain registered instruments.",
  },
  instrumentRegister: {
    title: "Register an instrument",
    subtitle: "Add instrument specifications and registered owner details.",
  },
  instrumentDetail: {
    title: "Instrument details",
    subtitle: "Specifications, ownership and registration record.",
  },
  admin: {
    title: "Administration",
    subtitle: "Oversee workspace access and registry activity.",
  },
  users: {
    title: "User management",
    subtitle: "Manage accounts, roles and access to this workspace.",
  },
  inspections: { title: "Inspections", subtitle: "Review and complete instrument verification inspections." },
  inspectionNew: { title: "Perform inspection", subtitle: "Record the prescribed checks for a registered instrument." },
  inspectionDetail: { title: "Inspection details", subtitle: "Review the checks and outcome recorded during inspection." },
  certificates: { title: "Certificates", subtitle: "Review digital verification certificates issued for compliant instruments." },
  certificateDetail: { title: "Certificate details", subtitle: "Digital certificate of verification." },
  verificationHistory: {
  title: "Verification History",
  subtitle: "Review previous certificate verification activity and integrity records.",
},
};
export const navigation = [
  {
    key: "dashboard",
    label: pageConfig.dashboard.title,
    path: paths.dashboard,
    icon: "LayoutDashboard",
    roles: [roles.ADMIN, roles.INSPECTOR],
    group: "Workspace",
  },
  {
    key: "instruments",
    label: "Instruments",
    path: paths.instruments,
    icon: "Scale",
    roles: [roles.ADMIN, roles.INSPECTOR],
    group: "Workspace",
  },
  {
    key: "inspections",
    label: "Inspections",
    path: paths.inspections,
    icon: "ClipboardCheck",
    roles: [roles.ADMIN, roles.INSPECTOR],
    group: "Workspace",
  },
  {
    key: "certificates",
    label: "Certificates",
    path: paths.certificates,
    icon: "BadgeCheck",
    roles: [roles.ADMIN, roles.INSPECTOR],
    group: "Workspace",
  },
  {
    key: "instrumentRegister",
    label: "Register instrument",
    path: paths.instrumentRegister,
    icon: "PlusCircle",
    roles: [roles.ADMIN, roles.INSPECTOR],
    group: "Workspace",
  },
  {
  key: "verificationHistory",
  label: pageConfig.verificationHistory.title,
  path: paths.verificationHistory,
  icon: "History",
  roles: [roles.ADMIN, roles.INSPECTOR],
  group: "Workspace",
},
  {
    key: "admin",
    label: "Admin overview",
    path: paths.admin,
    icon: "ShieldCheck",
    roles: [roles.ADMIN],
    group: "Administration",
  },
  {
    key: "users",
    label: "User management",
    path: paths.users,
    icon: "Users",
    roles: [roles.ADMIN],
    group: "Administration",
  },
];
