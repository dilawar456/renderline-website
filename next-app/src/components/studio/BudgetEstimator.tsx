"use client";
import { useState } from "react";
import {
  money,
  residentialBookletPrice,
  commercialRate,
  interiorPrice,
  type Pricing,
} from "@/lib/pricing";
import EnquiryLink from "./EnquiryLink";
export default function BudgetEstimator({
  pricing: p,
  number,
}: {
  pricing: Pricing;
  number: string;
}) {
  const [service, setService] = useState("booklet"),
    [marla, setMarla] = useState("5"),
    [area, setArea] = useState("250"),
    [storeys, setStoreys] = useState("1");
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
      "Dimensioned floor plans · up to 2 storeys; furniture layouts and other architectural details excluded.";
  }
  if (service === "booklet") {
    amount = residentialBookletPrice(p, size);
    basis =
      "Architectural booklet including a 3D front elevation. Structure, submission and interiors separate.";
  }
  if (service === "interior") {
    amount = interiorPrice(p, sqft, 1);
    basis = `One interior space · ${money(p.interior.perSqFt)}/sq ft, minimum ${money(p.interior.minimumPerSpace)}.`;
  }
  if (service === "commercial-package") {
    amount = floors <= 2 ? commercialRate(p.commercialPackage, size) : null;
    basis =
      "Commercial interior/exterior + working · up to 2 storeys; no basement or architectural drawings.";
  }
  if (service === "commercial-visual" || service === "commercial-working") {
    const base = commercialRate(p.commercialInteriorPerStorey, size);
    amount = base === null ? null : base * floors;
    basis = `Commercial interior ${service === "commercial-working" ? "working drawings" : "visualization"} only · ${floors} storey${floors === 1 ? "" : "s"}.`;
  }
  if (service === "structure-r" || service === "structure-c") {
    amount =
      sqft > 0
        ? sqft *
          (service === "structure-r"
            ? p.structure.residentialPerSqFt
            : p.structure.commercialPerSqFt)
        : null;
    basis = "Structure based on the total covered square feet you enter.";
  }
  const byArea = service === "interior" || service.startsWith("structure"),
    byStorey = service.startsWith("commercial") || service === "floor-plan";
  return (
    <section
      className="premium-estimator"
      id="budget-estimator"
      aria-labelledby="estimator-heading"
    >
      <div className="premium-estimator-form">
        <p className="premium-intro-label">A useful starting point</p>
        <h2 id="estimator-heading">Estimate your budget.</h2>
        <p>
          Choose the service and size. We confirm the final scope and quotation
          after reviewing your project.
        </p>
        <div className="rl-form-grid">
          <label className="rl-full">
            Service
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
            >
              <option value="floor-plan">
                Standalone dimensioned floor plans
              </option>
              <option value="booklet">Residential architectural booklet</option>
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
          {byArea ? (
            <label className="rl-full">
              {service === "interior"
                ? "Area of this space"
                : "Total covered area"}{" "}
              (sq ft)
              <input
                type="number"
                min="1"
                value={area}
                onChange={(e) => setArea(e.target.value)}
              />
            </label>
          ) : (
            <label>
              Plot size (marla)
              <select value={marla} onChange={(e) => setMarla(e.target.value)}>
                {[
                  ...(service.startsWith("commercial") ||
                  service === "floor-plan"
                    ? [2]
                    : []),
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
                  30,
                ].map((n) => (
                  <option key={n} value={n}>
                    {n === 20 ? "20 marla / 1 kanal" : n + " marla"}
                  </option>
                ))}
              </select>
            </label>
          )}
          {byStorey && (
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
      </div>
      <div className="premium-estimate-result" aria-live="polite">
        <span>Indicative guide price</span>
        <strong>{amount === null ? "Custom quotation" : money(amount)}</strong>
        <p>{basis}</p>
        <EnquiryLink
          className="rl-button"
          number={number}
          message={`Hello RenderLine Studio, please quote my project. Service: ${basis} ${byArea ? `Area: ${area} sq ft.` : `Plot: ${marla} marla.`} ${byStorey ? `Storeys: ${storeys}.` : ""} Website guide: ${amount === null ? "Custom quote required" : money(amount)}. Please confirm the scope.`}
        >
          Request my exact quote
        </EnquiryLink>
        <small>
          Guide price only. Drawings, revisions, file formats and delivery are
          agreed before work starts.
        </small>
      </div>
    </section>
  );
}
