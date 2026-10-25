"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Pricing } from "@/lib/pricing";
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
    [samples, setSamples] = useState("[]"),
    [status, setStatus] = useState("Checking owner access…"),
    [busy, setBusy] = useState(false),
    [token, setToken] = useState("");
  useEffect(() => {
    let alive = true;
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
        const r = await fetch("/api/studio/website", {
            headers: { Authorization: `Bearer ${session.access_token}` },
          }),
          body = await r.json();
        if (!alive) return;
        if (!r.ok) {
          setStatus(body.error || "Owner access required.");
          return;
        }
        setPricing(body.pricing);
        setSamples(JSON.stringify(body.samples, null, 2));
        setToken(session.access_token);
        setStatus(
          "Edit rates in PKR. Save publishes the updated guide prices across the website.",
        );
      })
      .catch(() => {
        if (alive) setStatus("Cannot connect. Reload to try again.");
      });
    return () => {
      alive = false;
    };
  }, []);
  async function save() {
    setBusy(true);
    try {
      const parsed = JSON.parse(samples);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const r = await fetch("/api/studio/website", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token || token}`,
        },
        body: JSON.stringify({ pricing, samples: parsed }),
      });
      const body = await r.json();
      setStatus(
        r.ok
          ? "Saved. Public pages will use these rates and samples."
          : body.error || "Save failed.",
      );
    } catch {
      setStatus("Check the sample JSON and connection, then try again.");
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
        <h1 style={{ marginTop: 25 }}>Website rates & samples.</h1>
        <p>
          Owner settings. Prices update without changing the design. Public
          samples must be approved for sharing.
        </p>
        <p role="status" className="rl-admin-status">
          {status}
        </p>
        {pricing && (
          <>
            <div className="rl-admin-grid">
              {Object.entries(pricing).map(([group, values]) => (
                <fieldset key={group}>
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
                        onChange={(e) =>
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
                          )
                        }
                      />
                    </label>
                  ))}
                </fieldset>
              ))}
            </div>
            <details className="rl-details">
              <summary>Manage published PDF samples & page previews</summary>
              <p>
                Add real approved files only. Each sample has an id, title,
                discipline (working, structure or submission), marla, level,
                description, pdf HTTPS URL and previews array of HTTPS image
                URLs. Use the studio Cloudinary account, existing Supabase
                storage or renderline.pk. Empty list means no documents are
                published.
              </p>
              <textarea
                aria-label="Drawing sample library JSON"
                rows={14}
                value={samples}
                onChange={(e) => setSamples(e.target.value)}
                spellCheck={false}
              />
            </details>
            <div className="rl-actions">
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
