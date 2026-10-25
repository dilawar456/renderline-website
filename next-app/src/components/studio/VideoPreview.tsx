"use client";
import { useState } from "react";
export default function VideoPreview({
  url,
  title,
}: {
  url: string;
  title?: string;
}) {
  const [play, setPlay] = useState(false);
  const id = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&\s?]+)/,
  )?.[1];
  if (!id || !/^[\w-]{11}$/.test(id))
    return (
      <a
        className="rl-text-link"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      >
        Watch walkthrough video
      </a>
    );
  return (
    <div className="rl-video-preview">
      {play ? (
        <iframe
          title={title || "RenderLine architectural walkthrough"}
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ width: "100%", aspectRatio: "16/9", border: 0 }}
        />
      ) : (
        <button
          type="button"
          className="rl-video-play"
          onClick={() => setPlay(true)}
          aria-label={`Play ${title || "RenderLine walkthrough"}`}
        >
          <span aria-hidden="true">▶</span>
          <strong>{title || "Architectural walkthrough"}</strong>
          <small>Play pre-rendered video</small>
        </button>
      )}
      <p className="rl-note">
        Video loads from YouTube only when you choose Play.
      </p>
    </div>
  );
}
