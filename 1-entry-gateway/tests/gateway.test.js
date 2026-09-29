import test from "node:test";
import assert from "node:assert/strict";
import { resolveEntry, studioStatus, routes } from "../js/gateway.js";

test("gateway resolves each entry point from the routing table", () => {
  assert.equal(resolveEntry("book").url, "../2-digital-receipt/receipt.html");
  assert.equal(resolveEntry("explore").url, "../index.html");
  assert.equal(resolveEntry("staff").url, "../index.html");
  assert.equal(resolveEntry("staff", { adminLoggedIn: true }).url, "../index.html");
  assert.equal(resolveEntry("nope").ok, false);
  assert.equal(resolveEntry("toString").ok, false);
  assert.ok(routes.has("reviews"));
});

test("studio status follows 10 AM to 7 PM Philippine time", () => {
  assert.equal(studioStatus(new Date("2026-09-30T14:00:00+08:00")).open, true);
  assert.equal(studioStatus(new Date("2026-09-30T10:00:00+08:00")).open, true);
  assert.equal(studioStatus(new Date("2026-09-30T19:00:00+08:00")).open, false);
  assert.match(studioStatus(new Date("2026-09-30T09:00:00+08:00")).message, /today/);
  assert.match(studioStatus(new Date("2026-09-30T20:00:00+08:00")).message, /tomorrow/);
});
