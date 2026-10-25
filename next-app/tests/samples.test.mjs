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

test("private signed storage links and other Cloudinary accounts cannot be published as samples", () => {
  assert.equal(
    safeSampleUrl(
      "https://ywqtjgtqwbylkgofogxe.supabase.co/storage/v1/object/sign/private/file.pdf?token=secret",
    ),
    false,
  );
  assert.equal(
    safeSampleUrl(
      "https://ywqtjgtqwbylkgofogxe.supabase.co/storage/v1/object/public/samples/file.pdf",
    ),
    true,
  );
  assert.equal(
    safeSampleUrl(
      "https://res.cloudinary.com/some-other-account/image/upload/sample.png",
    ),
    false,
  );
  assert.equal(
    safeSampleUrl(
      "https://res.cloudinary.com/dzp70azv3/image/upload/sample.png",
    ),
    true,
  );
});
test("a sample cannot be published without a real label or with duplicate identifiers", () => {
  const good = {
    id: "one",
    title: "3 marla working sample",
    discipline: "working",
    marla: 3,
    level: "Ground floor",
    description: "Approved sheets",
    pdf: "https://renderline.pk/sample.pdf",
    previews: ["https://renderline.pk/page.png"],
  };
  assert.equal(validSamples([{ ...good, title: "   " }]), false);
  assert.equal(validSamples([{ ...good, level: "" }]), false);
  assert.equal(validSamples([good, { ...good }]), false);
  assert.equal(validSamples([good, { ...good, id: "two" }]), true);
});
