"use client";

import { useState, type FormEvent } from "react";
import { ChipGroup } from "@/components/form/ChipGroup";
import { Input } from "@/components/form/Input";
import { Sheet } from "@/components/layout/Sheet";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { ADD_COPY as C, PRESENCE_KINDS, PRESENCE_ORDER, type PresenceKind } from "@/mock/accounts-stub";

export interface NewPresence {
  kind: PresenceKind;
  title: string;
  where: string;
  link?: string;
}

/** Catalogue only: fills the form and shows its errors, which a static page can't reach. */
export interface AddPresenceDemo {
  kind?: PresenceKind;
  title?: string;
  where?: string;
  link?: string;
  showErrors?: boolean;
}

export interface AddPresenceSheetProps {
  open: boolean;
  onClose: () => void;
  onAdd: (entry: NewPresence) => void;
  /** Render in place instead of over the device screen. For the catalogue. */
  inline?: boolean;
  demo?: AddPresenceDemo;
}

/**
 * The sheet she adds a podcast, a press mention, a talk or a piece with. She
 * says what it is, gives a title or a note, says where it ran, and adds a
 * link if she has one. Nothing is searched for, so nothing is guessed: what
 * she types is what is kept, and it stays on her device.
 *
 * It is opened fresh each time, so it never remembers the last thing added.
 */
export function AddPresenceSheet({ open, onClose, onAdd, inline, demo }: AddPresenceSheetProps) {
  return (
    <Sheet open={open} onClose={onClose} label={C.title} inline={inline}>
      <AddForm onClose={onClose} onAdd={onAdd} demo={demo} />
    </Sheet>
  );
}

function AddForm({ onClose, onAdd, demo }: Pick<AddPresenceSheetProps, "onClose" | "onAdd" | "demo">) {
  const [kind, setKind] = useState<PresenceKind | null>(demo?.kind ?? null);
  const [title, setTitle] = useState(demo?.title ?? "");
  const [where, setWhere] = useState(demo?.where ?? "");
  const [link, setLink] = useState(demo?.link ?? "");
  const [tried, setTried] = useState(Boolean(demo?.showErrors));

  const errors = {
    kind: kind ? undefined : C.errorKind,
    title: title.trim() ? undefined : C.errorNote,
    where: where.trim() ? undefined : C.errorWhere,
  };

  function submit(event: FormEvent) {
    event.preventDefault();
    setTried(true);
    if (!kind || errors.title || errors.where) return;
    onAdd({ kind, title: title.trim(), where: where.trim(), link: link.trim() || undefined });
  }

  return (
    <form className="add-presence" onSubmit={submit} noValidate>
      <h2 className="add-presence__title">{C.title}</h2>
      <div>
        <ChipGroup
          label={C.kindLabel}
          options={PRESENCE_ORDER.map((k) => PRESENCE_KINDS[k].chip)}
          value={kind ? [PRESENCE_KINDS[kind].chip] : []}
          onChange={([chip]) => setKind(PRESENCE_ORDER.find((k) => PRESENCE_KINDS[k].chip === chip) ?? null)}
        />
        {tried && errors.kind ? (
          <p className="add-presence__error" role="alert">
            {errors.kind}
          </p>
        ) : null}
      </div>
      <Input
        label={C.noteLabel}
        hint={C.noteHint}
        value={title}
        error={tried ? errors.title : undefined}
        onChange={(event) => setTitle(event.target.value)}
      />
      <Input
        label={kind ? PRESENCE_KINDS[kind].whereLabel : "Where did it run?"}
        placeholder={kind ? PRESENCE_KINDS[kind].wherePlaceholder : undefined}
        value={where}
        error={tried ? errors.where : undefined}
        onChange={(event) => setWhere(event.target.value)}
      />
      <Input
        label={C.linkLabel}
        type="url"
        placeholder={C.linkPlaceholder}
        value={link}
        onChange={(event) => setLink(event.target.value)}
      />
      <div className="add-presence__actions">
        <Button type="submit" variant="primary" fullWidth>
          {C.submit}
        </Button>
        <Button type="button" variant="ghost" fullWidth onClick={onClose}>
          {C.cancel}
        </Button>
      </div>
      <p className="signal-privacy">
        <Icon name="lock" size={16} />
        {C.privacy}
      </p>
    </form>
  );
}

export default AddPresenceSheet;
