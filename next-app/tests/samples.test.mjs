import { test } from "node:test";
import assert from "node:assert/strict";
import { safeSampleUrl, validSamples } from "../src/lib/drawing-samples.ts";
test("sample library accepts only approved studio hosts and public HTTPS URLs", () => {
  assert.equal(safeSampleUrl("javascript:alert(1)"), false);
  assert.equal(safeSampleUrl("https://example.com/private.pdf"), false);
  assert.equal(
    safeSampleUrl("https://user:password@renderline.pk/sample.pdf"),
    false,
  );
  assert.equal(safeSampleUrl("https://renderline.pk/sample.pdf"), true);
});
test("published samples require a PDF link and genuine preview links", () => {
  const good = {
    id: "sample-1",
    title: "Sample",
    discipline: "working",
    marla: 3,
    level: "Ground floor",
    description: "An approved sample",
    pdf: "https://renderline.pk/sample.pdf",
    previews: ["https://renderline.pk/page1.png"],
  };
  assert.equal(validSamples([good]), true);
  assert.equal(validSamples([{ ...good, previews: [] }]), false);
  assert.equal(validSamples([{ ...good, discipline: "unknown" }]), false);
  assert.equal(
    validSamples([{ ...good, pdf: "http://renderline.pk/sample.pdf" }]),
    false,
  );
});
