import test from "node:test";
import assert from "node:assert/strict";
import { appConfig } from "../src/config/appConfig.js";
import * as auth from "../src/services/authService.js";
import * as instruments from "../src/services/instrumentService.js";
import * as users from "../src/services/userService.js";
import { getDashboardStats } from "../src/services/dashboardService.js";
import { mockInstruments } from "../src/data/mockInstruments.js";
import { mockUsers } from "../src/data/mockUsers.js";

appConfig.serviceDelay = 0;
const apiInstruments = structuredClone(mockInstruments);

globalThis.fetch = async (input, options = {}) => {
  const path = new URL(input).pathname;
  const method = options.method || "GET";

  if (path === "/instruments" && method === "GET") {
    return Response.json(apiInstruments);
  }
  if (path === "/instruments" && method === "POST") {
    const values = JSON.parse(options.body);
    if (apiInstruments.some((item) => item.serialNumber === values.serialNumber)) {
      return Response.json(
        { detail: "This serial number is already registered." },
        { status: 409 },
      );
    }
    const created = {
      ...values,
      id: "INS-TEST-00001",
      status: values.status || "PENDING",
    };
    apiInstruments.unshift(created);
    return Response.json(created);
  }
  if (path.startsWith("/instruments/")) {
    const id = decodeURIComponent(path.split("/").at(-1));
    const index = apiInstruments.findIndex((item) => item.id === id);
    if (index < 0) {
      return Response.json({ detail: "Instrument not found." }, { status: 404 });
    }
    if (method === "PUT") {
      apiInstruments[index] = {
        ...apiInstruments[index],
        ...JSON.parse(options.body),
      };
    }
    return Response.json(apiInstruments[index]);
  }
  if (path === "/dashboard") {
    const count = (status) =>
      apiInstruments.filter((item) => item.status === status).length;
    return Response.json({
      stats: {
        total: apiInstruments.length,
        verified: count("VERIFIED"),
        pending: count("PENDING"),
        attention: count("EXPIRED") + count("FAILED"),
      },
      statuses: [],
      trend: [],
      activities: [],
      recent: apiInstruments.slice(0, 5),
    });
  }
  return Response.json({ detail: "Not found." }, { status: 404 });
};

test("frontend service boundaries stay consistent", async (t) => {
  await t.test("mock authentication and user permissions work", async () => {
    auth.logout();
    await assert.rejects(
      () => auth.login({ email: "admin@example.com", password: "wrong" }),
      /incorrect/,
    );
    await assert.rejects(
      () =>
        auth.login({ email: "vikram@example.com", password: "password123" }),
      /inactive/,
    );
    await auth.login({
      email: "inspector@example.com",
      password: "password123",
    });
    await assert.rejects(users.getUsers, /Administrator/);
    await auth.login({ email: "admin@example.com", password: "password123" });
    assert.equal((await users.getUsers()).length, mockUsers.length);
  });

  await t.test("instrument API mapping, validation, and updates work", async () => {
    const original = mockInstruments[0];
    await assert.rejects(
      () => instruments.createInstrument(original),
      /already registered/,
    );
    const created = await instruments.createInstrument({
      ...original,
      serialNumber: "TEST-UNIQUE-001",
      status: "PENDING",
    });
    assert.equal(created.id, "INS-TEST-00001");
    await instruments.updateInstrument(created.id, {
      ...created,
      model: "Updated model",
    });
    assert.equal(
      (await instruments.getInstrumentById(created.id)).model,
      "Updated model",
    );
    assert.equal((await getDashboardStats()).stats.total, mockInstruments.length + 1);
  });

  await t.test("self-registration creates an inspector account", async () => {
    auth.logout();
    const values = {
      ...mockUsers[1],
      name: "New Inspector",
      email: "new@example.com",
      password: "Student123!",
      confirmPassword: "Student123!",
      role: "ADMIN",
    };
    const created = await auth.register(values);
    assert.equal(created.role, "INSPECTOR");
    assert.equal("password" in created, false);
    assert.equal((await auth.login(values)).id, created.id);
    auth.logout();
  });
});
