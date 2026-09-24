"use client";

import { useRef, useState } from "react";
import { Input } from "@/components/form/Input";
import { Sheet } from "@/components/layout/Sheet";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { SIGNALS_C1 } from "@/mock/onboarding";

type Source = (typeof SIGNALS_C1.sources)[number];

export interface SignalSourcesProps {
  /** Connection state by source id. */
  connections: Record<string, string>;
  /** A pasted link by source id. */
  signalLinks: Record<string, string>;
  /** Connected by import, once the simulated connection finishes. */
  onConnect: (id: string) => void;
  /** Added by link instead. */
  onAddLink: (id: string, link: string) => void;
  onDisconnect: (id: string) => void;
  className?: string;
}

/**
 * The signal sources as rows, each with its status. Tapping one opens a sheet
 * to connect it or add it by link. What is brought in, and what it is used
 * for, is said in the sheet: that is the permission scope.
 *
 * Connecting is simulated. Nothing leaves the browser. Shared by Concept 1,
 * where signals come after the ending, and Concept 3, where they come right
 * after the privacy promise.
 */
export function SignalSources({
  connections,
  signalLinks,
  onConnect,
  onAddLink,
  onDisconnect,
  className,
}: SignalSourcesProps) {
  const copy = SIGNALS_C1;
  const [open, setOpen] = useState<string | null>(null);
  const lastOpened = useRef<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [pasting, setPasting] = useState(false);
  const [link, setLink] = useState("");
  const [linkError, setLinkError] = useState<string | undefined>();

  const isOn = (id: string) => connections[id] === "connected" || Boolean(signalLinks[id]);
  const source = copy.sources.find((item) => item.id === open);

  function openSheet(id: string) {
    lastOpened.current = id;
    setOpen(id);
    setPasting(false);
    setLink(signalLinks[id] ?? "");
    setLinkError(undefined);
  }

  function close() {
    setOpen(null);
    setConnecting(false);
  }

  function importSource(item: Source) {
    setConnecting(true);
    window.setTimeout(() => {
      setConnecting(false);
      onConnect(item.id);
    }, 1100);
  }

  function addLink(item: Source) {
    if (!link.trim()) {
      setLinkError("Add a link, or close this to leave it for now.");
      return;
    }
    onAddLink(item.id, link.trim());
    setPasting(false);
  }

  function sheetBody(item: Source) {
    if (isOn(item.id)) {
      const pasted = signalLinks[item.id];
      return (
        <div className="signal-imported">
          <p className="signal-imported__how">{pasted ? `From ${pasted}` : copy.connected}</p>
          <p>Brought in: {item.imported}.</p>
          <p>{item.use}</p>
          <button type="button" className="signal-link" onClick={() => onDisconnect(item.id)}>
            {copy.disconnect}
          </button>
        </div>
      );
    }
    if (connecting) {
      return <output className="signal-working">{item.connecting}</output>;
    }
    if (item.canImport && !pasting) {
      return (
        <div className="signal-actions">
          <Button variant="primary" fullWidth onClick={() => importSource(item)}>
            {item.connectLabel}
          </Button>
          <button type="button" className="signal-link" onClick={() => setPasting(true)}>
            {item.pasteLabel}
          </button>
        </div>
      );
    }
    return (
      <div className="signal-actions">
        <Input
          label={item.linkLabel}
          type="url"
          placeholder={item.placeholder}
          value={link}
          error={linkError}
          onChange={(event) => {
            setLink(event.target.value);
            setLinkError(undefined);
          }}
        />
        <Button variant="primary" fullWidth onClick={() => addLink(item)}>
          {copy.add}
        </Button>
      </div>
    );
  }

  return (
    <div className={["signal-sources", className].filter(Boolean).join(" ")}>
      <ul className="signal-list">
        {copy.sources.map((item) => {
          const on = isOn(item.id);
          return (
            <li key={item.id}>
              <span className="signal-list__mark" aria-hidden="true">
                {item.mark}
              </span>
              <div className="signal-list__text">
                <p className="signal-list__title">{item.title}</p>
                <p className="signal-list__detail">{on ? item.imported : item.why}</p>
              </div>
              {on ? (
                <button
                  type="button"
                  className="signal-list__status"
                  data-source={item.id}
                  onClick={() => openSheet(item.id)}
                  aria-label={`${item.title}: ${copy.connected}. Manage`}
                >
                  {copy.connected}
                </button>
              ) : (
                <Button
                  variant="secondary"
                  size="sm"
                  data-source={item.id}
                  onClick={() => openSheet(item.id)}
                  aria-label={`${copy.connect} ${item.title}`}
                >
                  {copy.connect}
                </Button>
              )}
            </li>
          );
        })}
      </ul>

      <p className="signal-privacy">
        <Icon name="lock" size={16} />
        {copy.privacy}
      </p>

      <Sheet
        open={Boolean(source)}
        onClose={close}
        label={source?.title ?? ""}
        // Connecting swaps the row's button, so focus returns to its successor.
        returnFocusTo={() =>
          document.querySelector<HTMLElement>(`[data-source="${lastOpened.current}"]`)
        }
      >
        {source ? (
          <div className="signal-sheet">
            <div className="signal-sheet__head">
              <span className="signal-list__mark" aria-hidden="true">
                {source.mark}
              </span>
              <div>
                <p className="signal-list__title">{source.title}</p>
                <p className="signal-list__detail">{source.why}</p>
              </div>
            </div>
            {sheetBody(source)}
            <p className="signal-privacy">
              <Icon name="lock" size={16} />
              {copy.privacy}
            </p>
            <button type="button" className="signal-link" onClick={close}>
              {copy.close}
            </button>
          </div>
        ) : null}
      </Sheet>
    </div>
  );
}

export default SignalSources;
