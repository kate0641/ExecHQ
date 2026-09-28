"use client";

import {
  useId,
  useLayoutEffect,
  useRef,
  type FormEvent,
  type KeyboardEvent,
  type RefObject,
} from "react";
import { MicButton } from "@/components/form/MicButton";
import { Icon } from "@/components/primitives/Icon";

export interface ChatComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (value: string) => void;
  placeholder?: string;
  /** On while ExecHQ is writing, so an answer cannot overtake the question.
   *  The field stays focusable; only sending is held back. */
  disabled?: boolean;
  /** Speak instead of type. */
  voice?: { listening: boolean; onToggle: () => void };
  /** Rests the mic while ExecHQ is writing, without hiding it. */
  micDisabled?: boolean;
  inputRef?: RefObject<HTMLTextAreaElement | null>;
  className?: string;
}

/** Lines the field grows to before it scrolls instead. */
const MAX_LINES = 6;

/**
 * The message field, pinned to the foot of the chat: type, or speak, then
 * send. Sending with nothing typed does nothing, rather than posting an
 * empty message.
 *
 * The field grows with what is typed, a line at a time up to MAX_LINES, so
 * the start of a long answer never scrolls out of sight. Enter sends;
 * Shift+Enter starts a new line.
 */
export function ChatComposer({
  value,
  onChange,
  onSend,
  placeholder,
  disabled = false,
  voice,
  micDisabled = false,
  inputRef,
  className,
}: ChatComposerProps) {
  const id = useId();
  const ownRef = useRef<HTMLTextAreaElement>(null);
  const fieldRef = inputRef ?? ownRef;

  // Fit the field to its text: collapse, then take the height the text needs,
  // capped at MAX_LINES. Runs before paint, so the field never flickers.
  useLayoutEffect(() => {
    const field = fieldRef.current;
    if (!field) return;
    const style = getComputedStyle(field);
    const line = parseFloat(style.lineHeight);
    const padding = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    field.style.height = "auto";
    field.style.height = `${Math.min(field.scrollHeight, line * MAX_LINES + padding)}px`;
  }, [value, fieldRef]);

  function send() {
    if (!value.trim() || disabled) return;
    onSend(value.trim());
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    send();
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    // Mid-composition (an IME choosing characters), Enter belongs to the IME.
    if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) return;
    event.preventDefault();
    send();
  }

  return (
    <form className={["chat-composer", className].filter(Boolean).join(" ")} onSubmit={submit}>
      <textarea
        id={id}
        aria-label="Message"
        ref={fieldRef}
        className="chat-composer__field"
        rows={1}
        autoComplete="off"
        placeholder={placeholder}
        value={value}
        // Read-only rather than disabled while ExecHQ is writing: a disabled
        // field drops focus, and the user would lose their place every turn.
        readOnly={disabled}
        aria-disabled={disabled || undefined}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
      />
      {voice ? (
        <MicButton listening={voice.listening} onToggle={voice.onToggle} disabled={micDisabled} />
      ) : null}
      <button
        type="submit"
        className="chat-composer__send"
        aria-label="Send"
        disabled={disabled || !value.trim()}
      >
        <Icon name="send" size={20} />
      </button>
    </form>
  );
}

export default ChatComposer;
