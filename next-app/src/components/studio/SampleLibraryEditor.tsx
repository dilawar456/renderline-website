"use client";
import { useState } from "react";
import type { DrawingSample } from "@/lib/drawing-samples";

type Props = {
  samples: DrawingSample[];
  onChange: (samples: DrawingSample[]) => void;
  disabled: boolean;
};
export default function SampleLibraryEditor({
  samples,
  onChange,
  disabled,
}: Props) {
  const [removed, setRemoved] = useState<DrawingSample[]>([]);
  function update(id: string, patch: Partial<DrawingSample>) {
    onChange(
      samples.map((sample) =>
        sample.id === id ? { ...sample, ...patch } : sample,
      ),
    );
  }
  return (
    <section className="rl-sample-editor" aria-labelledby="sample-editor-title">
      <h2 id="sample-editor-title">Drawing sample library</h2>
      <p>
        Add approved public PDFs and their page previews. Choose the plot size
        and floor/option that clients should see. Private client files do not
        belong in this library.
      </p>
      {samples.length === 0 && (
        <p className="rl-admin-status">
          No sample documents are published. The public page currently offers a
          sample-request action.
        </p>
      )}
      {samples.map((sample, index) => (
        <fieldset
          className="rl-sample-fields"
          key={sample.id}
          disabled={disabled}
        >
          <legend>
            Sample {index + 1}
            {sample.title ? ` — ${sample.title}` : ""}
          </legend>
          <div className="rl-form-grid">
            <label className="rl-full">
              Sample title
              <input
                value={sample.title}
                maxLength={200}
                onChange={(e) => update(sample.id, { title: e.target.value })}
                placeholder="3 marla architectural working sample"
              />
            </label>
            <label>
              Drawing type
              <select
                value={sample.discipline}
                onChange={(e) =>
                  update(sample.id, {
                    discipline: e.target.value as DrawingSample["discipline"],
                  })
                }
              >
                <option value="working">Architectural working</option>
                <option value="structure">Structure</option>
                <option value="submission">Submission</option>
              </select>
            </label>
            <label>
              Plot size (marla)
              <input
                type="number"
                min="1"
                max="1000"
                value={sample.marla || ""}
                onChange={(e) =>
                  update(sample.id, { marla: Number(e.target.value) })
                }
              />
            </label>
            <label className="rl-full">
              Floor / layout option
              <input
                value={sample.level}
                maxLength={150}
                onChange={(e) => update(sample.id, { level: e.target.value })}
                placeholder="Ground + first floor / Apartment option A"
              />
            </label>
            <label className="rl-full">
              What this sample contains
              <textarea
                rows={3}
                value={sample.description}
                maxLength={3000}
                onChange={(e) =>
                  update(sample.id, { description: e.target.value })
                }
                placeholder="Describe the actual included sheets and layout option."
              />
            </label>
            <label className="rl-full">
              Complete sample PDF link
              <input
                type="url"
                value={sample.pdf}
                maxLength={2048}
                onChange={(e) =>
                  update(sample.id, { pdf: e.target.value.trim() })
                }
                placeholder="https://renderline.pk/…/sample.pdf"
              />
            </label>
            <label className="rl-full">
              Page preview image links — one per line
              <textarea
                rows={4}
                value={sample.previews.join("\n")}
                onChange={(e) =>
                  update(sample.id, { previews: e.target.value.split(/\r?\n/) })
                }
                placeholder="https://renderline.pk/…/page-1.png"
              />
            </label>
          </div>
          <button
            type="button"
            className="rl-text-link"
            onClick={() => {
              setRemoved((previous) => [...previous, sample]);
              onChange(samples.filter((item) => item.id !== sample.id));
            }}
          >
            Remove this library entry
          </button>
          <p className="rl-note">
            Removing an entry does not delete its PDF or image files. Use Save
            below to publish library changes.
          </p>
        </fieldset>
      ))}
      <div className="rl-actions">
        <button
          type="button"
          className="rl-button rl-button-quiet"
          disabled={disabled || samples.length >= 100}
          onClick={() =>
            onChange([
              ...samples,
              {
                id: crypto.randomUUID(),
                title: "",
                discipline: "working",
                marla: 3,
                level: "Ground + first floor",
                description: "",
                pdf: "",
                previews: [],
              },
            ])
          }
        >
          Add sample document
        </button>
        {removed.length > 0 && (
          <button
            type="button"
            className="rl-text-link"
            disabled={disabled}
            onClick={() => {
              const last = removed[removed.length - 1];
              onChange([...samples, last]);
              setRemoved((previous) => previous.slice(0, -1));
            }}
          >
            Undo last removal
          </button>
        )}
      </div>
      <p className="rl-note">
        Use public files on RenderLine’s website, its Cloudinary account or its
        Supabase public storage. Each document needs a complete PDF link and at
        least one PNG/JPEG preview. Files are prepared and uploaded separately.
      </p>
    </section>
  );
}
