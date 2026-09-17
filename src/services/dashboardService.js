import { mockDashboard } from "../data/mockDashboard.js";
import { instrumentStatuses } from "../config/instrumentConfig.js";
import { roles } from "../config/userConfig.js";
import { copy, store, wait } from "./mockStore.js";
import { requireUser } from "./authService.js";
export async function getDashboardStats() {
  await wait();
  const user = requireUser();
  const count = (status) =>
    store.instruments.filter((item) => item.status === status).length;
  const stats = {
    total: store.instruments.length,
    verified: count("VERIFIED"),
    pending: count("PENDING"),
    attention: count("EXPIRED") + count("FAILED"),
  };
  if (user.role === roles.ADMIN)
    Object.assign(stats, {
      totalUsers: store.users.length,
      activeUsers: store.users.filter((u) => u.status === "ACTIVE").length,
      pendingUsers: store.users.filter((u) => u.status === "PENDING").length,
      admins: store.users.filter((u) => u.role === roles.ADMIN).length,
    });
  const months = [
    ...new Set([
      ...mockDashboard.monthKeys,
      ...store.instruments.map((i) => i.createdAt.slice(0, 7)),
    ]),
  ]
    .sort()
    .slice(-6);
  return {
    stats,
    statuses: instrumentStatuses.map((name) => ({ name, value: count(name) })),
    trend: months.map((month) => ({
      month,
      count: store.instruments.filter((i) => i.createdAt.startsWith(month))
        .length,
    })),
    activities: copy(
      [...store.activities].sort((a, b) => b.date.localeCompare(a.date)),
    ),
    recent: copy(store.instruments.slice(0, 5)),
  };
}
