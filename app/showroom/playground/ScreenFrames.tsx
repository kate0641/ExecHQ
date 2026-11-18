"use client";

import { useEffect, useRef } from "react";
import type { FlowScreens } from "./flow-screens";

/**
 * One flow's screens side by side, each the real page in its own frame at
 * true phone size, sized to its content so nothing inside is cut off. Each
 * is numbered above its frame, so a review can name a screen by number
 * (designer, 2026-10-21).
 */
export function ScreenFrames({ flow, concept, title, screens }: FlowScreens) {
  return (
    <ul className="screen-frames">
      {screens.map((screen, i) => {
        const query = ["frame=1", screen.query, screen.full ? "full=1" : null].filter(Boolean).join("&");
        return (
          <li key={screen.id} className="screen-frames__item">
            <figure className="screen-frames__figure">
              <span className="screen-frames__number">{i + 1}</span>
              <Frame src={`/${flow}/${concept}?${query}`} title={`${title}, screen ${i + 1}: ${screen.label}`} />
              <figcaption className="screen-frames__caption">
                <span className="screen-frames__label">
                  {i + 1} · {screen.label}
                </span>
                {screen.note ? <span className="screen-frames__note">{screen.note}</span> : null}
              </figcaption>
            </figure>
          </li>
        );
      })}
    </ul>
  );
}

function Frame({ src, title }: { src: string; title: string }) {
  const ref = useRef<HTMLIFrameElement>(null);

  // The frame is the prototype's own page, so its height can be read and
  // followed as it renders.
  useEffect(() => {
    const frame = ref.current;
    if (!frame) return;
    let observer: ResizeObserver | null = null;
    function fit() {
      const doc = frame?.contentDocument;
      if (!frame || !doc?.body) return;
      frame.style.height = `${doc.documentElement.scrollHeight}px`;
      observer?.disconnect();
      observer = new ResizeObserver(() => {
        frame.style.height = `${doc.documentElement.scrollHeight}px`;
      });
      observer.observe(doc.body);
    }
    frame.addEventListener("load", fit);
    fit();
    return () => {
      frame.removeEventListener("load", fit);
      observer?.disconnect();
    };
  }, []);

  return <iframe ref={ref} className="screen-frames__frame" src={src} title={title} loading="lazy" />;
}

export default ScreenFrames;
