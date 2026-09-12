import { apiRequest } from "./api.js";
export async function getDashboardStats() { return apiRequest("/dashboard"); }
