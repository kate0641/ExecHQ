import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { DropdownMenu, type MenuEntry } from "./DropdownMenu";

const noop = () => {};

/** Every kind of entry: items with icons and hints, a disabled item, a
 *  checkbox, a radio group, separators and a nested submenu. */
const everything: MenuEntry[] = [
  { type: "item", id: "open", label: "Open", icon: "draft", onSelect: noop },
  { type: "item", id: "copy", label: "Use as a starting point", icon: "copy", onSelect: noop },
  { type: "item", id: "export", label: "Download as PDF", icon: "download", hint: "Not for posts", disabled: true, onSelect: noop },
  { type: "separator", id: "s1" },
  { type: "checkbox", id: "closed", label: "Show closed", checked: true, onCheckedChange: noop },
  {
    type: "radio-group",
    id: "sort",
    label: "Sort by",
    value: "recent",
    onValueChange: noop,
    options: [
      { value: "recent", label: "Most recent" },
      { value: "title", label: "Title" },
      { value: "status", label: "Status", disabled: true },
    ],
  },
  { type: "separator", id: "s2" },
  {
    type: "submenu",
    id: "status",
    label: "Status",
    hint: "All",
    items: [
      {
        type: "radio-group",
        id: "status-options",
        label: "Status",
        labelHidden: true,
        value: "all",
        onValueChange: noop,
        options: [
          { value: "all", label: "All", hint: "9" },
          { value: "draft", label: "Draft", hint: "3" },
          { value: "ready", label: "Ready to use", hint: "3" },
          { value: "used", label: "Used, sent or published", hint: "0", disabled: true },
        ],
      },
    ],
  },
  { type: "item", id: "delete", label: "Delete", icon: "trash", onSelect: noop },
];

const base = { label: "Filter", icon: "filter" as const, entries: everything };

export const dropdownMenuStates = defineComponentStates({
  name: "DropdownMenu",
  group: "form controls",
  status: "draft",
  flows: ["playbook"],
  description:
    "A menu button and its floating panel, written from scratch to the ARIA menu-button pattern: items, separators, disabled items, checkboxes, radio groups and nested submenus. Keyboard: Enter, Space or Down opens on the first item, Up on the last; Up and Down move, Home and End jump, a letter jumps to an item; Enter or Space chooses; Right opens a submenu and Left closes it; Escape closes and returns focus to the button; Tab leaves. It flips to stay on the screen it opens in, and on a phone lays a submenu over its parent. Colours, hover, shadow and spacing come from the MENUS tokens.",
  component: DropdownMenu,
  notApplicable: {
    loading: "Its choices are given to it: there is nothing to wait for.",
    error: "Choosing only reports the choice: nothing can fail.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Closed — default", props: base },
    { label: "Open, every kind of item", description: "Press the button, or Down, to try the keyboard.", props: { ...base, defaultOpen: true, inline: true } },
    { label: "Two filters on", props: { ...base, badge: "2", srSuffix: ", 2 filters on" } },
    { label: "Hover", props: { ...base, demo: "hover" } },
    { label: "Focus", props: { ...base, demo: "focus" } },
    { label: "Pressed", props: { ...base, demo: "active" } },
    { label: "Disabled", props: { ...base, disabled: true } },
    { label: "Nothing to choose — empty", props: { ...base, entries: [] } },
    { label: "A long label wraps", props: { ...base, label: "Filter your library by tool, status and plan area" } },
    {
      label: "Initials, open with a heading",
      description: "An account menu: initials in a round button, and who is signed in above the choices (AccountMenu).",
      props: {
        label: "Your account, Dana Okafor",
        avatar: "DO",
        defaultOpen: true,
        inline: true,
        entries: [
          { type: "heading", id: "who", title: "Dana Okafor", detail: "Head of Leadership Development, Northgate" },
          { type: "item", id: "profile", label: "Your profile", icon: "person", onSelect: noop },
          { type: "separator", id: "s1" },
          { type: "item", id: "sign-out", label: "Sign out", icon: "sign-out", onSelect: noop },
        ],
      },
    },
  ],
});
