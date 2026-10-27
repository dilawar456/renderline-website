"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { validatePricing, type Pricing } from "@/lib/pricing";
import { validSamples, type DrawingSample } from "@/lib/drawing-samples";
import SampleLibraryEditor from "@/components/studio/SampleLibraryEditor";
const labels: Record<string, string> = {
  floorPlan: "Standalone plans · up to 2 storeys",
  residentialBooklet: "Residential booklet + 3D elevation",
  elevation: "Front elevation",
  interior: "Interior design / visualization",
  commercialInteriorPerStorey:
    "Commercial interior · visualization OR working / storey",
  commercialExterior: "Commercial exterior visualization",
  commercialPackage: "Commercial complete package · up to 2 storeys",
  structure: "Structure · per sq ft",
  submission: "Submission drawings",
  upTo10: "Up to 10 marla",
  upTo20: "Up to 20 marla / 1 kanal",
  upTo5: "Up to 5 marla",
  extraMarla: "Per marla above 20 (added to 1-kanal base)",
  visualization: "3D visualization only",
  working: "Working only",
  combined: "Visualization + working",
  perSqFt: "Per sq ft",
  minimumPerSpace: "Minimum per space",
  residentialPerSqFt: "Residential / covered sq ft",
  commercialPerSqFt: "Commercial / covered sq ft",
  below10: "Below 10 marla",
  at10: "Exactly 10 marla",
};
export default function WebsiteEditor() {
  const [pricing, setPricing] = useState<Pricing | null>(null),
    [samples, setSamples] = useState<DrawingSample[]>([]),
    [status, setStatus] = useState("Checking owner access…"),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    let alive = true;
    let revision = 0;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        revision++;
        setPricing(null);
        setSamples([]);
        setStatus(
          "Your session ended. Sign in to the client portal with your owner account to edit website settings.",
        );
      }
    });
    supabase.auth
      .getSession()
      .then(async ({ data: { session } }) => {
        if (!session) {
          if (alive)
            setStatus(
              "Sign in to the client portal with your owner account, then return here.",
            );
          return;
        }
        const requestRevision = revision;
        const r = await fetch("/api/studio/website", {
            headers: { Authorization: `Bearer ${session.access_token}` },
          }),
          body = await r.json();
        if (!alive || requestRevision !== revision) return;
        if (!r.ok) {
          setStatus(body.error || "Owner access required.");
          return;
        }
        setPricing(body.pricing);
        setSamples(body.samples);
        setStatus(
          "Edit rates in PKR. Save publishes the updated guide prices across the website.",
        );
      })
      .catch(() => {
        if (alive) setStatus("Cannot connect. Reload to try again.");
      });
    return () => {
      alive = false;
      subscription.unsubscribe();
    };
  }, []);
  async function save() {
    setBusy(true);
    try {
      if (!validatePricing(pricing)) {
        setStatus(
          "Enter a positive rate in every pricing field before saving.",
        );
        return;
      }
      const preparedSamples = samples.map((sample) => ({
        ...sample,
        title: sample.title.trim(),
        level: sample.level.trim(),
        pdf: sample.pdf.trim(),
        previews: sample.previews.map((url) => url.trim()).filter(Boolean),
      }));
      if (!validSamples(preparedSamples)) {
        setStatus(
          "Complete each sample’s title, floor/option, public PDF link and at least one valid preview image link. Remove unfinished entries before saving.",
        );
        return;
      }
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setPricing(null);
        setStatus(
          "Your session ended. Sign in to the client portal before saving.",
        );
        return;
      }
      const r = await fetch("/api/studio/website", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ pricing, samples: preparedSamples }),
      });
      const body = await r.json();
      if (r.ok) setSamples(preparedSamples);
      if (r.status === 401 || r.status === 403) setPricing(null);
      setStatus(
        r.ok
          ? "Saved. Public pages will use these rates and samples."
          : body.error || "Save failed.",
      );
    } catch {
      setStatus(
        "Could not connect to the website. Your changes have not been confirmed saved; please try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="rl-site">
      <div className="rl-shell rl-editor-page">
        <Link className="rl-text-link" href="/portal">
          Back to client portal
        </Link>
        <header className="edition-owner-heading"><h1>Your studio.<br />Kept up to date.</h1><p>Manage published guide rates and approved drawing samples from one place.</p></header>
        <p>
          Owner settings. Prices update without changing the design. Public
          samples must be approved for sharing.
        </p>
        <p role="status" className="rl-admin-status">
          {status}
        </p>
        {pricing && (
          <>
            <nav className="edition-detail-nav" aria-label="Website settings sections"><a href="#owner-rates">Guide rates</a><a href="#owner-samples">Drawing samples</a><Link href="/pricing">Preview public pricing ↗</Link></nav>
            <div className="rl-admin-grid" id="owner-rates">
              {Object.entries(pricing).map(([group, values]) => (
                <fieldset key={group} disabled={busy}>
                  <legend>{labels[group] || group}</legend>
                  {Object.entries(values).map(([key, value]) => (
                    <label key={key}>
                      {labels[key] || `${key} marla`}
                      <input
                        aria-label={`${labels[group]}: ${labels[key] || key + " marla"}`}
                        type="number"
                        min="1"
                        max="10000000"
                        value={value}
                        onChange={(e) => {
                          setStatus(
                            "Unsaved changes. Choose Save below to publish them.",
                          );
                          setPricing((previous) =>
                            previous
                              ? {
                                  ...previous,
                                  [group]: {
                                    ...previous[group as keyof Pricing],
                                    [key]: Number(e.target.value),
                                  },
                                }
                              : previous,
                          );
                        }}
                      />
                    </label>
                  ))}
                </fieldset>
              ))}
            </div>
            <div id="owner-samples"><SampleLibraryEditor
              samples={samples}
              disabled={busy}
              onChange={(next) => {
                setSamples(next);
                setStatus(
                  "Unsaved changes. Choose Save below to publish them.",
                );
              }}
            /></div>
            <div className="rl-actions edition-editor-save">
              <button
                type="button"
                className="rl-button"
                disabled={busy}
                onClick={save}
              >
                {busy ? "Saving…" : "Save website rates & samples"}
              </button>
              <Link className="rl-text-link" href="/pricing">
                View public pricing
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
