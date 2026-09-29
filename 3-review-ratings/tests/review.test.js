import test from "node:test";
import assert from "node:assert/strict";
import { createReviewStore, SEED_REVIEWS } from "../js/review.js";

const good = { name: "Ana", rating: 5, comment: "Great!", branch: "Pandi Bulacan", package: "SOLO 249" };

test("review stats match the seed reviews", () => {
  const s = createReviewStore(SEED_REVIEWS).stats();
  assert.equal(s.count, 6);
  assert.equal(s.average, 4.8);
  assert.deepEqual(s.distribution, [0, 0, 0, 1, 5]);
  assert.deepEqual(s.percent, [0, 0, 0, 17, 83]);
});

test("submitting a review updates stats and lists newest first", () => {
  const store = createReviewStore(SEED_REVIEWS);
  const r = store.submit(good);
  assert.equal(r.ok, true);
  assert.equal(store.stats().count, 7);
  assert.equal(store.list()[0].name, "Ana");
  assert.equal(store.list().at(-1).id, "rev-6"); // oldest seed review (Sep 02) is last
  assert.equal(store.toJSON()[0].name, "Ana");
});

test("review validation and one review per booking reference", () => {
  const store = createReviewStore();
  assert.equal(store.submit({ ...good, name: "  " }).ok, false);
  assert.equal(store.submit({ ...good, comment: "" }).ok, false);
  assert.equal(store.submit({ ...good, rating: 6 }).ok, false);
  assert.equal(store.submit({ ...good, ref: "12345" }).ok, false);
  assert.equal(store.submit({ ...good, ref: "sp-894210" }).ok, true);
  assert.equal(store.submit({ ...good, ref: "SP-894210" }).message, "This booking reference already has a review.");
  assert.equal(store.submit({ ...good, comment: "x".repeat(501) }).ok, false);
});

test("filters by branch and rating, and rebuilds from saved data", () => {
  const store = createReviewStore(SEED_REVIEWS);
  assert.equal(store.list({ branch: "Pandi Bulacan" }).length, 2);
  assert.equal(store.list({ rating: "4" }).length, 1);
  assert.equal(store.list({ branch: "Sta. Maria Bulacan", rating: 5 }).length, 2);
  const again = createReviewStore(store.toJSON());
  assert.deepEqual(again.stats(), store.stats());
  assert.deepEqual(again.list().map((r) => r.id), store.list().map((r) => r.id));
});
