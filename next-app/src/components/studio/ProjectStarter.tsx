"use client";
import { useEffect, useRef, useState } from "react";
import { SERVICES } from "@/lib/services";
import type { Pricing } from "@/lib/pricing";
import { money, residentialBookletPrice, interiorPrice } from "@/lib/pricing";
import EnquiryLink from "./EnquiryLink";
export default function ProjectStarter({
  number,
  pricing,
  initial = "house-plans",
}: {
  number: string;
  pricing: Pricing;
  initial?: string;
}) {
  const [service, setService] = useState(initial),
    [step, setStep] = useState(1);
  const [furthestStep, setFurthestStep] = useState(1);
  const panel = useRef<HTMLDivElement>(null);
  const moveFocus = useRef(false);
  const goToStep = (next: number) => {
    moveFocus.current = true;
    setFurthestStep(current => Math.max(current, next));
    setStep(next);
  };
  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    panel.current?.scrollIntoView({ block: "start", behavior: "instant" });
    panel.current?.querySelector<HTMLHeadingElement>("h2")?.focus({ preventScroll: true });
  }, [step]);
  const [form, setForm] = useState({
    size: "",
    dimensions: "",
    location: "",
    floors: "",
    rooms: "",
    drawings: "",
    views: "",
    deadline: "",
    notes: "",
    area: "",
  });
  const chosen = SERVICES.find((s) => s.slug === service) || SERVICES[0];
  const planning = ["house-plans", "drawing-booklets"].includes(service),
    interior = service === "interior-design",
    drawings = service === "drawing-booklets";
  const update = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));
  const fields = planning
    ? [
        ["size", "Plot size (marla)"],
        ["dimensions", "Plot length × width, if known"],
        ["location", "City / housing society"],
        ["floors", "Required floors"],
        ["rooms", "Bedrooms & other rooms"],
      ]
    : interior
      ? [
          ["area", "Area of one space (sq ft)"],
          ["rooms", "Space type (bedroom, kitchen, shop…)"],
          ["drawings", "Available plans / dimensions"],
          ["views", "Required views"],
        ]
      : [
          ["drawings", "Available plans or model"],
          [
            "views",
            service === "walkthrough-animation"
              ? "Video duration & camera route"
              : "Required views / modeling scope",
          ],
          ["location", "Project location"],
        ];
  const amount =
    service === "house-plans" &&
    form.size &&
    Number(form.size) > 0 &&
    Number(form.size) <= 20 &&
    (!form.floors || Number(form.floors) <= 2)
      ? Number(form.size) <= 10
        ? pricing.floorPlan.upTo10
        : pricing.floorPlan.upTo20
      : service === "drawing-booklets" && form.size
        ? residentialBookletPrice(pricing, Number(form.size))
        : interior && form.area
          ? interiorPrice(pricing, Number(form.area), 1)
          : service === "front-elevation"
            ? pricing.elevation.visualization
            : null;
  const brief = [
    `Hello RenderLine Studio, I need ${chosen.title}.`,
    ...Object.entries(form)
      .filter(([, v]) => v.trim())
      .map(
        ([k, v]) =>
          `${({ size: "Plot size (marla)", dimensions: "Plot dimensions", location: "Location", floors: "Floors", rooms: "Spaces / rooms", drawings: "Available files", views: "Views / scope", deadline: "Preferred deadline", notes: "Requirements", area: "Space area (sq ft)" } as Record<string, string>)[k]}: ${v.trim()}`,
      ),
    amount !== null
      ? `Indicative website budget: ${money(amount)}; please confirm final scope.`
      : "Please review my brief and share a quotation.",
  ].join("\n");
  return (
    <div className="rl-starter" ref={panel}>
      <div className="rl-starter-progress" aria-label={`Step ${step} of 3`}>
        <ol>
          {["Service", "Details", "Your brief"].map((label, index) => (
            <li key={label} aria-current={step === index + 1 ? "step" : undefined}>
              <button type="button" disabled={index + 1 > furthestStep} onClick={() => goToStep(index + 1)} aria-label={`Step ${index + 1}: ${label}`}>
                <span aria-hidden="true">{index + 1 < step ? "✓" : index + 1}</span>
                {label}
              </button>
            </li>
          ))}
        </ol>
      </div>
      {step === 1 && (
        <>
          <h2 tabIndex={-1}>What are you looking for?</h2>
          <p>
            Start with only the service you need. No account or long form
            required.
          </p>
          <div className="rl-choice-grid">
            {SERVICES.map((s) => (
              <button
                type="button"
                aria-pressed={service === s.slug}
                key={s.slug}
                onClick={() => setService(s.slug)}
              >
                <strong>{s.title}</strong>
                <span>{s.short}</span>
              </button>
            ))}
          </div>
          <button className="rl-button" onClick={() => goToStep(2)}>
            Continue with {chosen.title.toLowerCase()}
          </button>
        </>
      )}
      {step === 2 && (
        <>
          <h2 tabIndex={-1}>A few details help us quote accurately.</h2>
          <p>
            Everything here is optional. Share what you know; skip the rest.
          </p>
          <div className="rl-form-grid">
            {fields.map(([key, label]) => (
              <label key={key}>
                {label}
                <input
                  value={form[key as keyof typeof form]}
                  onChange={(e) =>
                    update(key as keyof typeof form, e.target.value)
                  }
                  inputMode={key === "size" || key === "area" ? "decimal" : key === "floors" ? "numeric" : undefined}
                  maxLength={300}
                />
              </label>
            ))}
            {drawings && (
              <label>
                Available drawings / required disciplines
                <input
                  value={form.drawings}
                  onChange={(e) => update("drawings", e.target.value)}
                  placeholder="Approved plan, architecture, electrical…"
                />
              </label>
            )}
            <label>
              Preferred deadline
              <input
                value={form.deadline}
                onChange={(e) => update("deadline", e.target.value)}
                placeholder="Optional; confirmed after scope review"
              />
            </label>
            <label className="rl-full">
              Anything else?
              <textarea
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                rows={3}
                maxLength={2500}
              />
            </label>
          </div>
          <div className="rl-actions">
            <button
              className="rl-button rl-button-quiet"
              onClick={() => goToStep(1)}
            >
              Back
            </button>
            <button className="rl-button" onClick={() => goToStep(3)}>
              Review my brief
            </button>
          </div>
        </>
      )}
      {step === 3 && (
        <>
          <h2 tabIndex={-1}>Your project, clearly briefed.</h2>
          <p>
            Recommended service: <strong>{chosen.title}</strong>.{" "}
            {amount !== null
              ? `Indicative budget: ${money(amount)}.`
              : "A custom quotation follows a review of your files."}
          </p>
          <pre className="rl-brief">{brief}</pre>
          <div className="rl-actions">
            <button
              className="rl-button rl-button-quiet"
              onClick={() => goToStep(2)}
            >
              Edit details
            </button>
            <EnquiryLink className="rl-button" number={number} message={brief}>
              Continue on WhatsApp
            </EnquiryLink>
          </div>
          <p className="rl-note">
            Your message opens in WhatsApp; tap Send there. Attach your CAD/PDF
            files, photographs or references in that conversation.
          </p>
        </>
      )}
      <EnquiryLink
        className="rl-text-link rl-direct"
        number={number}
        message="Hello RenderLine Studio, I would like to discuss my project."
      >
        Prefer to talk first? Chat directly
      </EnquiryLink>
    </div>
  );
}
