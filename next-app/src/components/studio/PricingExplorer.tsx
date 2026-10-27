"use client";
import { useState } from "react";
import Link from "next/link";
import {
  money,
  residentialBookletPrice,
  commercialRate,
  type Pricing,
} from "@/lib/pricing";
import EnquiryLink from "./EnquiryLink";
import BudgetEstimator from "./BudgetEstimator";
function RateTable({
  rows,
  title,
}: {
  rows: [string, string][];
  title: string;
}) {
  return (
    <div className="premium-rate-group">
      <h3>{title}</h3>
      <dl>
        {rows.map(([label, price]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{price}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
function Package({
  title,
  price,
  unit,
  features,
  note,
  number,
  service,
  featured = false,
}: {
  title: string;
  price: number | null;
  unit: string;
  features: string[];
  note: string;
  number: string;
  service: string;
  featured?: boolean;
}) {
  return (
    <article
      className={
        "premium-package" + (featured ? " premium-package-featured" : "")
      }
    >
      <p className="premium-intro-label">{unit}</p>
      <h3>{title}</h3>
      <div className="premium-package-price">
        {price === null ? "Custom quote" : money(price)}
      </div>
      <ul>
        {features.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      <p className="premium-package-note">{note}</p>
      <EnquiryLink
        number={number}
        className={featured ? "rl-button" : "rl-button rl-button-quiet"}
        message={`Hello RenderLine Studio, I would like a quote for ${service}. Website guide: ${price === null ? "Custom quote" : money(price)}. Please confirm the scope.`}
      >
        Discuss this package
      </EnquiryLink>
    </article>
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
    ),
    [marla, setMarla] = useState("5");
  const size = Number(marla);
  if (compact)
    return (
      <div className="premium-price-overview">
        <div className="rl-section-head">
          <div>
            <h2>
              Your project. Your scope.
              <br />A clear starting price.
            </h2>
            <p>Studio partner guide rates, available to direct clients too.</p>
          </div>
          <Link href="/pricing" className="rl-text-link">
            Compare every rate & package
          </Link>
        </div>
        <div className="premium-price-starts">
          {[
            [
              "House plans",
              money(p.floorPlan.upTo10),
              "Up to 10 marla · 2 storeys total",
              "Dimensions included. Furniture layouts and other working details separate.",
              "/services/house-plans",
            ],
            [
              "Architectural booklet",
              money(p.residentialBooklet["3"]),
              "Starting at 3 marla",
              "Architectural drawing scope with a 3D front elevation included.",
              "/services/drawing-booklets",
            ],
            [
              "Interior design",
              money(p.interior.perSqFt) + "/sq ft",
              "Minimum " + money(p.interior.minimumPerSpace) + " per space",
              "Commercial packages and individual working drawings also available.",
              "/services/interior-design",
            ],
          ].map(([title, price, unit, description, href]) => (
            <article key={title}>
              <h3>{title}</h3>
              <strong>{price}</strong>
              <span>{unit}</span>
              <p>{description}</p>
              <Link href={href} className="rl-text-link">
                Explore the service
              </Link>
            </article>
          ))}
        </div>
        <Link
          className="premium-calculator-link"
          href="/pricing#budget-estimator"
        >
          Need a more specific starting point? Use the budget estimator.
        </Link>
      </div>
    );
  const tabs = ["residential", "commercial", "specialist"] as const;
  return (
    <div className="premium-pricing">
      <div className="premium-pricing-toolbar">
        <div
          role="tablist"
          aria-label="Pricing category"
          className="rl-price-tabs"
        >
          {tabs.map((t, i) => (
            <button
              type="button"
              role="tab"
              id={"price-tab-" + t}
              aria-selected={tab === t}
              aria-controls="price-panel"
              tabIndex={tab === t ? 0 : -1}
              key={t}
              onClick={() => setTab(t)}
              onKeyDown={(e) => {
                let next = i;
                if (e.key === "ArrowRight") next = (i + 1) % 3;
                else if (e.key === "ArrowLeft") next = (i + 2) % 3;
                else if (e.key === "Home") next = 0;
                else if (e.key === "End") next = 2;
                else return;
                e.preventDefault();
                setTab(tabs[next]);
                (
                  e.currentTarget.parentElement?.querySelectorAll("button")[
                    next
                  ] as HTMLButtonElement
                )?.focus();
              }}
            >
              {t === "residential"
                ? "Residential"
                : t === "commercial"
                  ? "Commercial"
                  : "Individual services"}
            </button>
          ))}
        </div>
        <a href="#budget-estimator" className="rl-text-link">
          Estimate my budget
        </a>
      </div>
      <div
        role="tabpanel"
        id="price-panel"
        aria-labelledby={"price-tab-" + tab}
        className="premium-pricing-panel"
      >
        {tab !== "specialist" && (
          <div className="premium-package-selector">
            <div>
              <h2>
                {tab === "residential"
                  ? "Choose the drawings you need."
                  : "A coordinated commercial package."}
              </h2>
              <p>
                {tab === "residential"
                  ? "Compare a standalone dimensioned plan with the architectural booklet."
                  : "Interior and exterior visualization with their working drawings, for up to two storeys."}
              </p>
            </div>
            <label>
              Choose plot size
              <select value={marla} onChange={(e) => setMarla(e.target.value)}>
                {[
                  ...(tab === "commercial" ? [2] : []),
                  3,
                  4,
                  5,
                  6,
                  7,
                  8,
                  9,
                  10,
                  20,
                  22,
                  25,
                ].map((n) => (
                  <option key={n} value={n}>
                    {n === 20 ? "20 marla / 1 kanal" : n + " marla"}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
        {tab === "residential" && (
          <>
            <div className="premium-package-grid">
              <Package
                title="Dimensioned floor plans"
                price={
                  size <= 20
                    ? size <= 10
                      ? p.floorPlan.upTo10
                      : p.floorPlan.upTo20
                    : null
                }
                unit={`${marla} marla · up to 2 storeys total`}
                features={[
                  "Room and circulation planning",
                  "Dimensioned floor plans",
                  "For up to two storeys within the selected size band",
                ]}
                note="Furniture layouts, elevations and other architectural working details are excluded. Extra storeys or more than 1 kanal need a custom quote."
                number={number}
                service={`${marla} marla standalone dimensioned floor plans`}
              />
              <Package
                featured
                title="Architectural booklet"
                price={residentialBookletPrice(p, size)}
                unit={`${marla} marla · architectural drawing package`}
                features={[
                  "Architectural plans, elevations and sections as agreed",
                  "Project-specific drawing index and details",
                  "3D front elevation included",
                ]}
                note="Structure, submission and interiors are separate. Drawing sheets and number of floors are confirmed in your quotation."
                number={number}
                service={`${marla} marla architectural booklet including front elevation`}
              />
            </div>
            <details className="premium-rate-details">
              <summary>
                See the complete residential booklet rate schedule
              </summary>
              <RateTable
                title="Booklet + 3D front elevation"
                rows={[
                  ...[3, 4, 5, 6, 7, 8, 9, 10].map(
                    (n) =>
                      [n + " marla", money(residentialBookletPrice(p, n)!)] as [
                        string,
                        string,
                      ],
                  ),
                  ["Above 10 to 20 marla", money(p.residentialBooklet.upTo20)],
                  [
                    "Above 1 kanal",
                    money(p.residentialBooklet.upTo20) +
                      " + " +
                      money(p.residentialBooklet.extraMarla) +
                      " per additional marla",
                  ],
                ]}
              />
            </details>
          </>
        )}
        {tab === "commercial" && (
          <>
            <div className="premium-package-grid">
              <Package
                featured
                title="Complete commercial package"
                price={commercialRate(p.commercialPackage, size)}
                unit={`${marla} marla · up to 2 storeys`}
                features={[
                  "Interior visualization + interior working",
                  "Exterior visualization + exterior working",
                  "One coordinated interior/exterior scope",
                ]}
                note="Basement and architectural drawings are excluded. More than two storeys or more than 10 marla require a custom quote."
                number={number}
                service={`${marla} marla complete commercial interior/exterior package, without basement`}
              />
              <div className="premium-commercial-separates">
                <h3>Only need one service?</h3>
                <p>
                  Interior visualization and interior working are separate
                  services at the same per-storey rate.
                </p>
                <RateTable
                  title={`${marla} marla · per storey`}
                  rows={[
                    [
                      "Interior visualization only",
                      commercialRate(p.commercialInteriorPerStorey, size) ===
                      null
                        ? "Custom quote"
                        : money(
                            commercialRate(
                              p.commercialInteriorPerStorey,
                              size,
                            )!,
                          ),
                    ],
                    [
                      "Interior working only",
                      commercialRate(p.commercialInteriorPerStorey, size) ===
                      null
                        ? "Custom quote"
                        : money(
                            commercialRate(
                              p.commercialInteriorPerStorey,
                              size,
                            )!,
                          ),
                    ],
                    [
                      "Exterior visualization",
                      size <= 10
                        ? money(
                            size <= 5
                              ? p.commercialExterior.upTo5
                              : p.commercialExterior.upTo10,
                          )
                        : "Custom quote",
                    ],
                  ]}
                />
                <p className="rl-note">
                  Multiply each selected interior service by its storeys.
                  Exterior working alone is quoted after drawing review.
                </p>
              </div>
            </div>
            <details className="premium-rate-details">
              <summary>See every commercial size and rate</summary>
              <div className="premium-rates-grid">
                <RateTable
                  title="Complete package · up to two storeys"
                  rows={Object.entries(p.commercialPackage).map(([n, r]) => [
                    (n === "2" ? "Up to 2" : n) + " marla",
                    money(r),
                  ])}
                />
                <RateTable
                  title="Interior visualization OR working · per storey"
                  rows={Object.entries(p.commercialInteriorPerStorey).map(
                    ([n, r]) => [
                      (n === "2" ? "Up to 2" : n) + " marla",
                      money(r),
                    ],
                  )}
                />
              </div>
            </details>
          </>
        )}
        {tab === "specialist" && (
          <>
            <div className="premium-single-intro">
              <h2>Only the service you need.</h2>
              <p>Clear individual rates. No full package required.</p>
            </div>
            <div className="premium-rates-grid">
              <RateTable
                title="Front elevation"
                rows={[
                  ["3D front elevation only", money(p.elevation.visualization)],
                  [
                    "Working from an existing elevation",
                    money(p.elevation.working),
                  ],
                  ["3D elevation + working", money(p.elevation.combined)],
                ]}
              />
              <RateTable
                title="Interior design & visualization"
                rows={[
                  ["Per square foot", money(p.interior.perSqFt)],
                  [
                    "Minimum per individual space",
                    money(p.interior.minimumPerSpace),
                  ],
                  ["Complex / non-marla projects", "Scope-based quote"],
                ]}
              />
              <RateTable
                title="Structural drawings / design"
                rows={[
                  [
                    "Residential · per covered sq ft",
                    money(p.structure.residentialPerSqFt),
                  ],
                  [
                    "Commercial · per covered sq ft",
                    money(p.structure.commercialPerSqFt),
                  ],
                ]}
              />
              <RateTable
                title="Submission drawing preparation"
                rows={[
                  ["Below 10 marla", money(p.submission.below10)],
                  ["10 marla", money(p.submission.at10)],
                  ["Above 10 to 20 marla", money(p.submission.upTo20)],
                  ["Above 1 kanal", "Custom quote"],
                ]}
              />
            </div>
            <div className="premium-bespoke">
              <div>
                <h3>3D modeling, films & larger projects.</h3>
                <p>
                  Quoted to model complexity, views, animation duration and the
                  files you need.
                </p>
              </div>
              <EnquiryLink
                number={number}
                className="rl-text-link"
                message="Hello RenderLine Studio, I would like a scope-based quote for modeling, animation or a complex project."
              >
                Request a tailored quote
              </EnquiryLink>
            </div>
          </>
        )}
      </div>
      <div className="premium-scope-note">
        <strong>Know what’s included.</strong>
        <p>
          All prices are PKR guide rates. We confirm the scope, revisions, file
          formats and delivery in writing. Authority fees, professional stamping
          and approval are not included or guaranteed.
        </p>
      </div>
      <BudgetEstimator pricing={p} number={number} />
      <div className="premium-volume-note">
        <h3>Studio partner rates. Open to direct clients.</h3>
        <p>
          Architects, developers and firms can share a recurring workload for a
          tailored volume package. Individual homeowners can use the same
          published guide rates.
        </p>
      </div>
    </div>
  );
}
