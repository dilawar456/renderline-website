"use client";
import { useState } from "react";
import Image from "next/image";
import type { DrawingSample } from "@/lib/drawing-samples";
import EnquiryLink from "./EnquiryLink";
export default function DrawingSamples({
  samples,
  number,
}: {
  samples: DrawingSample[];
  number: string;
}) {
  const [discipline, setDiscipline] = useState("working"),
    [size, setSize] = useState("3");
  const shown = samples.filter(
    (s) =>
      s.discipline === discipline &&
      (size === "all" || s.marla === Number(size)),
  );
  return (
    <>
      <div className="rl-filter-row" aria-label="Drawing discipline">
        {[
          ["working", "Architectural working"],
          ["structure", "Structure"],
          ["submission", "Submission"],
        ].map(([k, t]) => (
          <button
            type="button"
            key={k}
            aria-pressed={discipline === k}
            onClick={() => setDiscipline(k)}
          >
            {t}
          </button>
        ))}
      </div>
      <label style={{ maxWidth: 300, marginBottom: 25 }}>
        Standard plot size
        <select value={size} onChange={(e) => setSize(e.target.value)}>
          <option value="all">All plot sizes</option>
          {[3, 4, 5, 6, 7, 8, 9, 10, 20].map((n) => (
            <option key={n} value={n}>
              {n === 20 ? "1 kanal" : n + " marla"}
            </option>
          ))}
        </select>
      </label>
      {shown.length ? (
        shown.map((s) => (
          <article className="rl-sample-document" key={s.id}>
            <h2>{s.title}</h2>
            <p>
              {s.marla} marla · {s.level}
            </p>
            <p>{s.description}</p>
            <div className="rl-work-grid">
              {s.previews.map((url, i) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${s.title}, page ${i + 1}`}
                >
                  <Image
                    src={url}
                    alt={`${s.title} drawing sample page ${i + 1}`}
                    fill
                    sizes="(max-width:600px) 45vw, 30vw"
                    style={{ objectFit: "contain" }}
                  />
                </a>
              ))}
            </div>
            <a
              className="rl-button"
              style={{ marginTop: 20 }}
              href={s.pdf}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open complete sample PDF
            </a>
          </article>
        ))
      ) : (
        <div className="rl-empty">
          <h2>A sample matched to your plot.</h2>
          <p>
            No public PDF has been published for this selection yet. Ask for a{" "}
            {size === "all" ? "standard-plot" : size + " marla"} {discipline}{" "}
            sample and share whether you need ground floor, first floor or an
            apartment layout option.
          </p>
          <EnquiryLink
            className="rl-button"
            number={number}
            message={`Hello RenderLine Studio, please share a ${size === "all" ? "standard plot" : size + " marla"} ${discipline} drawing sample. I would like to review ground/first-floor or apartment layout options and the complete sample PDF.`}
          >
            Request this drawing sample
          </EnquiryLink>
        </div>
      )}
      <p className="rl-note">
        Samples explain the drawing output; each client’s layout is checked
        against actual dimensions, requirements and applicable submission
        conditions. A sample is not a site-ready construction or approval
        document for another plot.
      </p>
    </>
  );
}
