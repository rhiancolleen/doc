import test from "node:test";
import assert from "node:assert/strict";
import { CODE39, encodeCode39, barcodeSVG, buildReceipt, sampleBooking, PACKAGES, createBooking, normalizePhone, formatTime } from "../js/receipt.js";

test("every Code 39 pattern has 9 elements with exactly 3 wide", () => {
  for (const [char, p] of CODE39) {
    assert.equal(p.length, 9, char);
    assert.equal([...p].filter((c) => c === "w").length, 3, char);
  }
});

test("Code 39 encoding adds start/stop and gaps", () => {
  // "SP-894210" = 9 chars + 2 stars = 11 chars * 9 elements + 10 gaps
  assert.equal(encodeCode39("SP-894210").length, 11 * 9 + 10);
  assert.throws(() => encodeCode39("sp_1"));
  assert.throws(() => encodeCode39("A*B"));
  assert.ok(barcodeSVG("SP-894210").startsWith("<svg"));
  assert.equal(barcodeSVG("sp-894210"), barcodeSVG("SP-894210"));
});

test("receipt for the sample booking matches the studio's 50% downpayment rule", () => {
  const r = buildReceipt(sampleBooking());
  assert.equal(r.total, 249);
  assert.equal(r.amountPaid, 125);
  assert.equal(r.balanceDue, 124);
  assert.match(r.ref, /^SP-\d{6}$/);
  assert.equal(r.package.inclusions, PACKAGES.get("SOLO 249").inclusions);
  assert.equal(r.durationText, "20 mins (20m shoot + 0m extra)");
});

test("receipt keeps a booking's own reference, extras and full payment", () => {
  const r = buildReceipt({
    referenceCode: "sp-123456", package: "DUO 399", extraTimeMinutes: 10, extraTimeCost: 100,
    extraBackdrops: ["Storm"], backdropCost: 100, spotlight: true, paymentOption: "Full Payment",
    total: 799, includedBackdrops: ["Cloud"],
  });
  assert.equal(r.ref, "SP-123456");
  assert.equal(r.amountPaid, 799);
  assert.equal(r.balanceDue, 0);
  assert.equal(r.backdrops, "Cloud, Storm (Extra)");
  assert.equal(r.spotlight.cost, 200);
});

test("receipt falls back to summing the lines when total is missing", () => {
  const r = buildReceipt({ package: "SOLO 199", extraPaxCount: 1, extraPaxCost: 50 });
  assert.equal(r.total, 249);
});

/* ---------- creating a reservation ---------- */
const NOW = new Date("2026-09-30T10:00:00+08:00");
const form = {
  package: "SOLO 249", branch: "Pandi Bulacan", date: "2026-10-05", time: "14:00",
  name: "Maria Santos", email: "maria@gmail.com", phone: "0917 555 0199", payment: "half",
  extraTimeUnits: "0", extraPax: "0", backdrops: "Storm, Cloud", extraBackdrops: "", spotlight: false, notes: "",
};

test("createBooking prices the session and splits the 50% downpayment", () => {
  const r = createBooking(form, NOW);
  assert.equal(r.ok, true);
  assert.equal(r.booking.total, 249);
  assert.equal(r.booking.amountPaid, 125);
  assert.equal(r.booking.balanceDue, 124);
  assert.equal(r.booking.bookingTime, "02:00 PM");
  assert.equal(r.booking.bookingDate, "October 5, 2026");
  assert.equal(r.booking.customerPhone, "+63 917 555 0199");
  assert.match(r.booking.referenceCode, /^SP-\d{6}$/);
  // the receipt module can render what the booking module produced
  assert.equal(buildReceipt(r.booking).total, 249);
});

test("createBooking adds extras and full payment", () => {
  const r = createBooking({ ...form, extraTimeUnits: "2", extraPax: "1", extraBackdrops: "Red, Blue", spotlight: true, payment: "full" }, NOW);
  // 249 + 200 (time) + 50 (pax) + 200 (backdrops) + 200 (spotlight)
  assert.equal(r.booking.total, 899);
  assert.equal(r.booking.amountPaid, 899);
  assert.equal(r.booking.balanceDue, 0);
  assert.equal(r.booking.totalDuration, 40);
});

test("createBooking rejects bad input", () => {
  const bad = (patch) => createBooking({ ...form, ...patch }, NOW);
  assert.equal(bad({ package: "NOPE" }).ok, false);
  assert.equal(bad({ name: " " }).ok, false);
  assert.equal(bad({ email: "maria@" }).ok, false);
  assert.equal(bad({ phone: "12345" }).ok, false);
  assert.equal(bad({ date: "2026-09-29" }).message, "The shoot date cannot be in the past.");
  assert.equal(bad({ date: "2027-09-02" }).ok, false);
  assert.equal(bad({ time: "09:00" }).message, "The studio opens at 10:00 AM.");
  assert.match(bad({ time: "18:50" }).message, /after closing time/);
  assert.match(bad({ package: "RENT DUO 799", time: "18:30" }).message, /after closing time/);
  assert.equal(bad({ extraPax: "9" }).ok, false);
});

test("createBooking rejects a time that already passed today", () => {
  const afternoon = new Date("2026-09-30T15:00:00+08:00");
  assert.equal(createBooking({ ...form, date: "2026-09-30", time: "14:00" }, afternoon).message, "That time has already passed today.");
  assert.equal(createBooking({ ...form, date: "2026-09-30", time: "16:00" }, afternoon).ok, true);
});

test("phone and time helpers", () => {
  assert.equal(normalizePhone("+63 917 555 0199"), "+63 917 555 0199");
  assert.equal(normalizePhone("9175550199"), "+63 917 555 0199");
  assert.equal(normalizePhone("8175550199"), null);
  assert.equal(formatTime(0), "12:00 AM");
  assert.equal(formatTime(13 * 60 + 5), "01:05 PM");
});
