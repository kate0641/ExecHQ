"use client";

import { useState, type FormEvent } from "react";
import { ChipGroup } from "@/components/form/ChipGroup";
import { Input } from "@/components/form/Input";
import { Drawer } from "@/components/layout/Drawer";
import type { EntryValues } from "@/components/plan/SignalEntrySheet";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { shortDate, type LoopDate } from "@/lib/loop";
import { likelyDuplicates, type PictureItem } from "@/lib/signal-picture";
import { ENTRY_COPY as E, ENTRY_DRAWER_COPY as B, ENTRY_TYPES, FOLLOWERS_CHOICE, type EntryChoice } from "@/mock/plan";

export interface EntryDrawerProps {
  open: boolean;
  onClose: () => void;
  /** Every row she filled in, to add at once. */
  onSave: (rows: EntryValues[]) => void;
  /** Today, which is also the latest date she can give. */
  today: LoopDate;
  /** What is already in her picture, so a row can say "is it this one?". */
  existing?: readonly PictureItem[];
  /** Fills the first row: when it was offered after a piece was published. */
  initial?: Partial<EntryValues>;
  /** Render in place instead of over the device screen. For the catalogue. */
  inline?: boolean;
  /** Catalogue only: rows already filled in, to show what a static page cannot reach. */
  demoRows?: { type: EntryChoice | null; on: string; text?: string; followers?: string; impact?: string }[];
  /** Catalogue only: shows the errors. */
  demoErrors?: boolean;
}

interface Draft {
  key: number;
  type: EntryChoice | null;
  on: string;
  followers: string;
  text: string;
  impact: string;
}

const CHOICES = [...ENTRY_TYPES, FOLLOWERS_CHOICE];

/**
 * How she tells ExecHQ about what she did outside it: one row for each thing,
 * what it was, when, an optional link or note and what came of it, or her
 * LinkedIn followers as of a day. It opens with one row and grows when she
 * wants to add more, so one thing is as quick as it always was and several
 * need no other route. Rows she leaves empty are ignored, and each is checked
 * against her picture so she is not asked to add what is already there. It
 * comes up as a drawer she can leave open and read her picture beside while she fills it
 * in. Nothing is looked up and nothing leaves the browser.
 */
export function EntryDrawer({ open, onClose, onSave, today, existing, initial, inline, demoRows, demoErrors }: EntryDrawerProps) {
  return (
    <Drawer open={open} onClose={onClose} label={B.title} inline={inline}>
      <EntryForm onClose={onClose} onSave={onSave} today={today} existing={existing} initial={initial} demoRows={demoRows} demoErrors={demoErrors} />
    </Drawer>
  );
}

let nextKey = 0;
const blank = (): Draft => ({ key: nextKey++, type: null, on: "", followers: "", text: "", impact: "" });

function EntryForm({ onClose, onSave, today, existing, initial, demoRows, demoErrors }: Omit<EntryDrawerProps, "open" | "inline">) {
  const [rows, setRows] = useState<Draft[]>(() =>
    demoRows
      ? demoRows.map((r) => ({ ...blank(), type: r.type, on: r.on, followers: r.followers ?? "", text: r.text ?? "", impact: r.impact ?? "" }))
      : [
          {
            ...blank(),
            type: initial?.type ?? null,
            on: initial?.on ?? "",
            followers: initial?.followers !== undefined ? initial.followers.toLocaleString("en-US") : "",
            text: initial?.text ?? "",
            impact: initial?.impact ?? "",
          },
        ]
  );
  const [tried, setTried] = useState(Boolean(demoErrors));

  const change = (key: number, patch: Partial<Draft>) => setRows((all) => all.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  const remove = (key: number) => setRows((all) => (all.length > 1 ? all.filter((r) => r.key !== key) : [blank()]));
  const isEmpty = (r: Draft) => !r.type && !r.on && !r.text.trim() && !r.followers.trim() && !r.impact.trim();
  const followersOf = (r: Draft) => (/^\d[\d,]*$/.test(r.followers.trim()) ? Number(r.followers.replace(/,/g, "")) : null);
  const problem = (r: Draft) =>
    !r.type || !r.on || r.on > today
      ? B.rowError
      : r.type === FOLLOWERS_CHOICE.id && followersOf(r) === null
        ? E.errorFollowers
        : undefined;
  const filled = rows.filter((r) => !isEmpty(r));
  const valid = filled.filter((r) => !problem(r));

  function submit(event: FormEvent) {
    event.preventDefault();
    setTried(true);
    if (filled.length === 0 || valid.length !== filled.length) return;
    onSave(
      filled.map((r) =>
        r.type === FOLLOWERS_CHOICE.id
          ? { type: r.type, on: r.on, followers: followersOf(r) ?? 0 }
          : { type: r.type as EntryChoice, on: r.on, text: r.text.trim() || undefined, impact: r.impact.trim() || undefined }
      )
    );
  }

  return (
    <form className="entry-drawer" onSubmit={submit} noValidate>
      <h2 className="entry-drawer__title">{B.title}</h2>
      <ol className="entry-drawer__rows">
        {rows.map((row, i) => {
          const isFollowers = row.type === FOLLOWERS_CHOICE.id;
          const kind = ENTRY_TYPES.find((t) => t.id === row.type)?.kind;
          const same = kind && row.on ? likelyDuplicates(existing ?? [], kind, row.on) : [];
          const error = tried && !isEmpty(row) ? problem(row) : undefined;
          const name = B.rowName(i + 1);
          return (
            <li key={row.key} className="entry-drawer__row">
              {rows.length > 1 ? <p className="entry-drawer__row-name">{name}</p> : null}
              <ChipGroup
                label={rows.length > 1 ? `${name}: ${E.typeLabel}` : E.typeLabel}
                labelHidden={rows.length > 1}
                options={CHOICES.map((t) => t.label)}
                value={row.type ? [CHOICES.find((t) => t.id === row.type)!.label] : []}
                onChange={([label]) => change(row.key, { type: CHOICES.find((t) => t.label === label)?.id ?? null })}
              />
              {isFollowers ? (
                <Input
                  label={E.followersLabel}
                  hint={E.followersHint}
                  inputMode="numeric"
                  placeholder={E.followersPlaceholder}
                  value={row.followers}
                  onChange={(event) => change(row.key, { followers: event.target.value })}
                />
              ) : null}
              <Input
                label={isFollowers ? E.followersDateLabel : E.dateLabel}
                type="date"
                max={today}
                value={row.on}
                onChange={(event) => change(row.key, { on: event.target.value })}
              />
              {isFollowers ? null : (
                <>
                  <Input label={E.noteLabel} hint={E.noteHint} placeholder={E.notePlaceholder} value={row.text} onChange={(event) => change(row.key, { text: event.target.value })} />
                  <Input label={E.impactLabel} hint={E.impactHint} value={row.impact} onChange={(event) => change(row.key, { impact: event.target.value })} />
                </>
              )}
              {error ? (
                <p className="entry-form__error" role="alert">
                  <Icon name="flag" size={14} /> {error}
                </p>
              ) : null}
              {same.length ? (
                <div className="entry-form__same" aria-live="polite">
                  {same.map((item) => (
                    <p key={item.id}>{(item.source === "recorded" ? E.sameRecorded : E.sameAdded)(item.text, shortDate(item.on))}</p>
                  ))}
                  <p className="entry-form__same-hint">{E.sameNot}</p>
                  <Button variant="secondary" size="sm" onClick={() => remove(row.key)}>
                    {B.leaveOut}
                  </Button>
                </div>
              ) : null}
              {rows.length > 1 ? (
                <Button variant="ghost" size="sm" onClick={() => remove(row.key)}>
                  {B.remove}
                </Button>
              ) : null}
            </li>
          );
        })}
      </ol>
      <button type="button" className="link link--standalone entry-drawer__more" onClick={() => setRows((all) => [...all, blank()])}>
        {B.addRow}
      </button>
      {tried && filled.length === 0 ? (
        <p className="entry-form__error" role="alert">
          <Icon name="flag" size={14} /> {B.errorNone}
        </p>
      ) : null}
      <p className="entry-form__privacy">{E.privacy}</p>
      <div className="entry-form__actions">
        <Button type="submit" variant="primary">
          {B.save(valid.length)}
        </Button>
        <Button variant="ghost" onClick={onClose}>
          {B.cancel}
        </Button>
      </div>
    </form>
  );
}

export default EntryDrawer;
