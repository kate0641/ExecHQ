"use client";

import Link from "next/link";
import { useId } from "react";
import { Switch } from "@/components/form/Switch";
import { Icon, type IconName } from "@/components/primitives/Icon";

interface RowBase {
  /** Optional: the You group has none. */
  icon?: IconName;
  label: string;
  /** A line under the label, e.g. what a switch does right now. */
  description?: string;
  /** `danger` for deleting the account. */
  tone?: "default" | "danger";
  /** Catalogue only: `is-hover`, `is-focus`, `is-active`. */
  className?: string;
}

/** Opens a detail: a sheet on mobile and tablet, the detail pane on web. */
export interface OpenRowProps extends RowBase {
  kind?: "open";
  /** The current value, at the end of the row. */
  value?: string;
  onOpen?: () => void;
  /** Goes to another page instead of opening a detail. */
  href?: string;
  /** Its detail is the one showing in the web pane. */
  current?: boolean;
  disabled?: boolean;
}

/** Does something at once, with no detail to open: a download, say. The value
 *  at the end says what it does, or that it is working. */
export interface ActionRowProps extends RowBase {
  kind: "action";
  value?: string;
  onAction: () => void;
  /** It is working: the button says so to assistive technology. */
  busy?: boolean;
}

/** A value that can be read here but is changed nowhere, e.g. the email. */
export interface StaticRowProps extends RowBase {
  kind: "static";
  value: string;
}

/** A setting that takes effect at once. */
export interface SwitchRowProps extends RowBase {
  kind: "switch";
  checked: boolean;
  onChange: (checked: boolean) => void;
}

/** A setting a later sprint designs, shown so the group's place is settled. */
export interface LaterRowProps extends RowBase {
  kind: "later";
  /** Says when it arrives, e.g. "With the Briefing". */
  tag: string;
}

export type SettingsRowProps = OpenRowProps | ActionRowProps | StaticRowProps | SwitchRowProps | LaterRowProps;

/**
 * One row of a SettingsGroup: an optional icon, a label, and whatever the row does
 * at its end — a value and a chevron, a switch, a value for an action that
 * happens at once, or a note that the setting comes later.
 */
export function SettingsRow(props: SettingsRowProps) {
  const labelId = useId();
  const descriptionId = useId();
  const { icon, label, description, tone = "default", className } = props;
  const kind = props.kind ?? "open";
  const classes = [
    "settings-row",
    `settings-row--${kind}`,
    tone === "danger" ? "settings-row--danger" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const text = (
    <span className="settings-row__text">
      <span className="settings-row__label" id={labelId}>
        {label}
      </span>
      {description ? (
        <span className="settings-row__description" id={descriptionId}>
          {description}
        </span>
      ) : null}
    </span>
  );
  const mark = icon ? (
    <span className="settings-row__icon">
      <Icon name={icon} size={20} />
    </span>
  ) : null;

  if (props.kind === "switch") {
    return (
      <div className={classes}>
        {mark}
        {text}
        <Switch
          checked={props.checked}
          onChange={props.onChange}
          aria-labelledby={labelId}
          aria-describedby={description ? descriptionId : undefined}
        />
      </div>
    );
  }

  if (props.kind === "static") {
    return (
      <div className={classes}>
        {mark}
        {text}
        <span className="settings-row__value">{props.value}</span>
      </div>
    );
  }

  if (props.kind === "action") {
    return (
      <button
        type="button"
        className={classes.replace("settings-row--action", "settings-row--open settings-row--action")}
        onClick={props.onAction}
        aria-busy={props.busy ? "true" : undefined}
      >
        {mark}
        {text}
        {props.value ? <span className="settings-row__value">{props.value}</span> : null}
      </button>
    );
  }

  if (props.kind === "later") {
    return (
      <div className={classes}>
        {mark}
        {text}
        <span className="settings-row__later">{props.tag}</span>
      </div>
    );
  }

  const { value, onOpen, href, current, disabled } = props;
  const inner = (
    <>
      {mark}
      {text}
      {value ? <span className="settings-row__value">{value}</span> : null}
      <span className="settings-row__chevron">
        <Icon name="chevron" size={16} />
      </span>
    </>
  );

  if (href && !disabled) {
    return (
      <Link className={classes} href={href}>
        {inner}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      onClick={onOpen}
      disabled={disabled}
      aria-current={current ? "true" : undefined}
      data-detail-row
    >
      {inner}
    </button>
  );
}

export default SettingsRow;
