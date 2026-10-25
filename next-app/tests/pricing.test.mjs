import { test } from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_PRICING as p,
  residentialBookletPrice,
  commercialRate,
  interiorPrice,
  validatePricing,
} from "../src/lib/pricing.ts";
test("residential band boundaries and additional marla avoid unexpected price jumps", () => {
  assert.equal(residentialBookletPrice(p, 3), 10000);
  assert.equal(residentialBookletPrice(p, 10), 25000);
  assert.equal(residentialBookletPrice(p, 11), 30000);
  assert.equal(residentialBookletPrice(p, 20), 30000);
  assert.equal(residentialBookletPrice(p, 22), 37000);
  assert.equal(residentialBookletPrice(p, 2), null);
  assert.equal(residentialBookletPrice(p, NaN), null);
});
test("commercial scopes require custom quote beyond the published size range", () => {
  assert.equal(commercialRate(p.commercialPackage, 2), 35000);
  assert.equal(commercialRate(p.commercialPackage, 10), 100000);
  assert.equal(commercialRate(p.commercialPackage, 11), null);
  assert.equal(commercialRate(p.commercialInteriorPerStorey, 4), 15000);
});
test("interior minimum is applied per actual space, not to combined room area", () => {
  assert.equal(interiorPrice(p, 100, 1), 10000);
  assert.equal(interiorPrice(p, 400, 1), 16000);
  assert.equal(interiorPrice(p, 100, 2), 20000);
  assert.equal(interiorPrice(p, -1, 1), null);
});
test("owner pricing validation rejects missing keys, strings and unsafe numeric values", () => {
  assert.equal(validatePricing(p), true);
  assert.equal(validatePricing({}), false);
  const bad = structuredClone(p);
  bad.elevation.working = -1;
  assert.equal(validatePricing(bad), false);
  bad.elevation.working = Infinity;
  assert.equal(validatePricing(bad), false);
});
