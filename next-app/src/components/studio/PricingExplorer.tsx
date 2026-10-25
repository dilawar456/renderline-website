"use client";
import { useState } from "react";
import Link from "next/link";
import {
  money,
  residentialBookletPrice,
  commercialRate,
  interiorPrice,
  type Pricing,
} from "@/lib/pricing";
import EnquiryLink from "./EnquiryLink";
const scopes = {
  residential:
    "Architectural booklet with 3D front elevation. Structural work, submission drawings, interiors, authority fees and stamping are separate. The drawing index and number of floors are confirmed before work starts.",
  commercial:
    "Complete interior + exterior visualization and their working drawings, up to two storeys. Basement and architectural drawings are excluded. More than two storeys or more than 10 marla: project review and custom quote.",
  specialist:
    "Rates apply to the stated service only. Covered area for structure and actual room area for interiors are measured in square feet; we do not assume a marla-to-square-foot conversion.",
};
function RateTable({
  rows,
  heading = "Service",
  unit = "Guide price",
}: {
  rows: [string, string][];
  heading?: string;
  unit?: string;
}) {
  return (
    <div className="rl-table-wrap">
      <table className="rl-table">
        <thead>
          <tr>
            <th scope="col">{heading}</th>
            <th scope="col">{unit}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label}>
              <th scope="row">{label}</th>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default function PricingExplorer({
  pricing: p,
  number,
  compact = false,
}: {
  pricing: Pricing;
  number: string;
  compact?: boolean;
}) {
  const [tab, setTab] = useState<"residential" | "commercial" | "specialist">(
    "residential",
  );
  const [service, setService] = useState("booklet");
  const [marla, setMarla] = useState("5");
  const [area, setArea] = useState("250");
  const [storeys, setStoreys] = useState("1");
  const size = Number(marla),
    sqft = Number(area),
    floors = Number(storeys);
  let amount: number | null = null,
    basis = "";
  if (service === "floor-plan") {
    amount =
      size > 0 && size <= 20 && floors <= 2
        ? size <= 10
          ? p.floorPlan.upTo10
          : p.floorPlan.upTo20
        : null;
    basis =
      "Dimensioned house floor plans; up to 2 storeys; furniture layouts and other architectural details excluded";
  }
  if (service === "booklet") {
    amount = residentialBookletPrice(p, size);
    basis = "Residential architectural booklet, including 3D front elevation";
  }
  if (service === "interior") {
    amount = interiorPrice(p, sqft, 1);
    basis =
      "One interior space: " +
      money(p.interior.perSqFt) +
      "/sq ft; minimum " +
      money(p.interior.minimumPerSpace);
  }
  if (service === "commercial-package") {
    amount = floors <= 2 ? commercialRate(p.commercialPackage, size) : null;
    basis =
      "Commercial interior/exterior + working; up to 2 storeys; no basement or architectural drawings";
  }
  if (service === "commercial-visual" || service === "commercial-working") {
    const base = commercialRate(p.commercialInteriorPerStorey, size);
    amount = base === null ? null : base * floors;
    basis = `Commercial interior ${service === "commercial-working" ? "working drawings" : "visualization"} only; ${floors} storey${floors === 1 ? "" : "s"}`;
  }
  if (service === "structure-r" || service === "structure-c") {
    amount =
      sqft > 0
        ? sqft *
          (service === "structure-r"
            ? p.structure.residentialPerSqFt
            : p.structure.commercialPerSqFt)
        : null;
    basis = "Structure: total covered area supplied by you; separate service";
  }
  const sizeOptions = [
    ...Array.from({ length: 8 }, (_, i) => i + 3),
    20,
    22,
    25,
    30,
  ];
  return (
    <div className="rl-pricing-explorer">
      <div className="rl-pricing-intro">
        <div>
          <h2>Clear pricing. No guesswork.</h2>
          <p>
            Studio partner rates, available to direct clients too. All prices
            are in Pakistani rupees.
          </p>
        </div>
        <Link
          className="rl-text-link"
          href={compact ? "/pricing" : "/start-project"}
        >
          {compact ? "See every rate & package" : "Request a scope review"}
        </Link>
      </div>
      <div
        className="rl-price-tabs"
        role="tablist"
        aria-label="Pricing category"
      >
        {(["residential", "commercial", "specialist"] as const).map((t) => (
          <button
            key={t}
            id={"price-tab-" + t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            aria-controls="price-panel"
            onClick={() => setTab(t)}
          >
            {t === "specialist"
              ? "Individual services"
              : t === "residential"
                ? "Residential"
                : "Commercial"}
          </button>
        ))}
      </div>
      <div
        id="price-panel"
        role="tabpanel"
        aria-labelledby={"price-tab-" + tab}
        className="rl-price-panel"
      >
        <div className="rl-price-summary">
          <h3>
            {tab === "residential"
              ? "A complete architectural booklet"
              : tab === "commercial"
                ? "Interior + exterior. Visuals + working."
                : "Choose only what you need."}
          </h3>
          <p>{scopes[tab]}</p>
        </div>
        {tab === "residential" && (
          <>
            <RateTable
              heading="Residential plot size"
              unit="Booklet + 3D front elevation"
              rows={[
                ...(compact ? [3, 5, 10] : [3, 4, 5, 6, 7, 8, 9, 10]).map(
                  (n) =>
                    [n + " marla", money(residentialBookletPrice(p, n)!)] as [
                      string,
                      string,
                    ],
                ),
                [
                  "Above 10 to 20 marla (1 kanal)",
                  money(p.residentialBooklet.upTo20),
                ],
                [
                  "Above 1 kanal",
                  money(p.residentialBooklet.upTo20) +
                    " + " +
                    money(p.residentialBooklet.extraMarla) +
                    " per additional marla",
                ],
              ]}
            />
            <p className="rl-note">
              Standalone dimensioned floor plans: up to 10 marla{" "}
              {money(p.floorPlan.upTo10)}, above 10 to 20 marla{" "}
              {money(p.floorPlan.upTo20)} total for up to 2 storeys. Furniture
              layouts and other architectural details are excluded. Larger plots
              or more storeys need a custom quote. A booklet price is for the
              agreed architectural drawing package; it does not include every
              engineering discipline.
            </p>
          </>
        )}
        {tab === "commercial" && (
          <>
            <RateTable
              heading="Commercial plot size"
              unit="Complete package · up to 2 storeys"
              rows={Object.entries(p.commercialPackage).map(([size, rate]) => [
                size === "2" ? "Up to 2 marla" : size + " marla",
                money(rate),
              ])}
            />
            <details className="rl-details" open={!compact}>
              <summary>Individual commercial services</summary>
              <p>
                Interior visualization and interior working are separate
                services at the same per-storey rate. Multiply the selected rate
                by the number of storeys. Ordering both individually means
                paying for both; the complete package above has its own scope
                and pricing.
              </p>
              <RateTable
                heading="Commercial plot size"
                unit="Interior visualization OR working · per storey"
                rows={Object.entries(p.commercialInteriorPerStorey).map(
                  ([size, rate]) => [
                    size === "2" ? "Up to 2 marla" : size + " marla",
                    money(rate),
                  ],
                )}
              />
              <RateTable
                rows={[
                  [
                    "Commercial exterior visualization · up to 5 marla",
                    money(p.commercialExterior.upTo5),
                  ],
                  [
                    "Commercial exterior visualization · above 5 to 10 marla",
                    money(p.commercialExterior.upTo10),
                  ],
                  [
                    "Commercial exterior · above 10 marla",
                    "Custom quote after drawing review",
                  ],
                ]}
              />
              <p>
                Basements, unusual heights, large sites and non-marla projects
                require a custom scope. Commercial exterior working alone is
                quoted after reviewing the drawings.
              </p>
            </details>
          </>
        )}
        {tab === "specialist" && (
          <>
            <RateTable
              rows={[
                [
                  "Dimensioned floor plans · up to 10 marla / 2 storeys",
                  money(p.floorPlan.upTo10),
                ],
                [
                  "Dimensioned floor plans · above 10 to 20 marla / 2 storeys",
                  money(p.floorPlan.upTo20),
                ],
                ["3D front elevation only", money(p.elevation.visualization)],
                [
                  "Elevation working from an existing design",
                  money(p.elevation.working),
                ],
                [
                  "3D elevation + its working drawings",
                  money(p.elevation.combined),
                ],
                [
                  "Interior design / visualization",
                  money(p.interior.perSqFt) + " / sq ft",
                ],
                [
                  "Minimum per interior space",
                  money(p.interior.minimumPerSpace),
                ],
                [
                  "Residential structure",
                  money(p.structure.residentialPerSqFt) +
                    " / sq ft of covered area",
                ],
                [
                  "Commercial structure",
                  money(p.structure.commercialPerSqFt) +
                    " / sq ft of covered area",
                ],
                [
                  "Submission drawings · below 10 marla",
                  money(p.submission.below10),
                ],
                ["Submission drawings · 10 marla", money(p.submission.at10)],
                [
                  "Submission drawings · above 10 to 20 marla",
                  money(p.submission.upTo20),
                ],
                ["Submission drawings · above 1 kanal", "Custom quote"],
                [
                  "3D modeling, walkthrough animation & complex projects",
                  "Custom quote based on scope",
                ],
              ]}
            />
            <p className="rl-note">
              Standalone floor-plan prices cover dimensioned plans for up to two
              storeys; furniture layouts and other architectural details are
              excluded. Larger plots and extra storeys require a custom quote.
              Submission drawing preparation is separate from authority charges,
              approval and professional stamping. Revision rounds, delivery date
              and final file formats are agreed in your written quotation.
            </p>
          </>
        )}
      </div>
      <details className="rl-details" open={!compact}>
        <summary>Calculate a project budget</summary>
        <div className="rl-calculator">
          <div>
            <h3>Find your starting budget</h3>
            <p>
              Select the service and its actual pricing unit. This is a guide,
              with the final scope confirmed before work starts.
            </p>
          </div>
          <div className="rl-calc-inputs">
            <label>
              Service
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
              >
                <option value="floor-plan">
                  Standalone dimensioned floor plans
                </option>
                <option value="booklet">
                  Residential architectural booklet
                </option>
                <option value="interior">One interior space</option>
                <option value="commercial-package">
                  Commercial complete package
                </option>
                <option value="commercial-visual">
                  Commercial interior visualization only
                </option>
                <option value="commercial-working">
                  Commercial interior working only
                </option>
                <option value="structure-r">Residential structure</option>
                <option value="structure-c">Commercial structure</option>
              </select>
            </label>
            {service === "interior" || service.startsWith("structure") ? (
              <label>
                {service === "interior"
                  ? "Area of this space"
                  : "Total covered area"}{" "}
                (sq ft)
                <input
                  type="number"
                  min="1"
                  max="1000000"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                />
              </label>
            ) : (
              <label>
                Plot size (marla)
                <select
                  value={marla}
                  onChange={(e) => setMarla(e.target.value)}
                >
                  {sizeOptions.map((n) => (
                    <option key={n} value={n}>
                      {n} marla{n === 20 ? " / 1 kanal" : ""}
                    </option>
                  ))}
                  {(service.startsWith("commercial") ||
                    service === "floor-plan") && (
                    <option value="2">Up to 2 marla</option>
                  )}
                </select>
              </label>
            )}
            {(service.startsWith("commercial") || service === "floor-plan") && (
              <label>
                Storeys
                <select
                  value={storeys}
                  onChange={(e) => setStoreys(e.target.value)}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>
          <div className="rl-estimate" aria-live="polite">
            <span>Indicative guide price</span>
            <strong>
              {amount !== null ? money(amount) : "Let’s review your project"}
            </strong>
            <p>{basis}</p>
            <EnquiryLink
              className="rl-button"
              number={number}
              message={`Hello RenderLine Studio, I would like a quotation. Service: ${basis}. ${service === "interior" || service.startsWith("structure") ? `Area: ${area} sq ft.` : `Plot: ${marla} marla.`} ${service.startsWith("commercial") || service === "floor-plan" ? `Storeys: ${storeys}.` : ""} Website guide: ${amount === null ? "Custom quote required" : money(amount)}. Please confirm the scope and final quote.`}
            >
              Request my exact quote
            </EnquiryLink>
          </div>
        </div>
      </details>
      <div className="rl-price-foot">
        <p>
          <strong>Working with a studio or developer?</strong> Share your
          recurring workload or project batch for a tailored volume package.
          These guide rates are also available to individual homeowners.
        </p>
        <p>
          Prices are indicative. Scope, complexity, revisions, final formats and
          delivery are confirmed in writing. Please attach drawings inside
          WhatsApp; the website does not attach files automatically.
        </p>
      </div>
    </div>
  );
}
