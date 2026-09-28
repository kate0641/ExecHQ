"use client";

import { useId, type FormEvent, type RefObject } from "react";
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
  /** Attach a file. Only offered while a file is what is being asked for, so
   *  it appears and goes with that question rather than resting disabled. */
  attach?: { label: string; onAttach: () => void };
  inputRef?: RefObject<HTMLInputElement | null>;
  className?: string;
}

/**
 * The message field, pinned to the foot of the chat: type, or speak, then
 * send. Sending with nothing typed does nothing, rather than posting an
 * empty message.
 */
export function ChatComposer({
  value,
  onChange,
  onSend,
  placeholder,
  disabled = false,
  voice,
  micDisabled = false,
  attach,
  inputRef,
  className,
}: ChatComposerProps) {
  const id = useId();

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!value.trim() || disabled) return;
    onSend(value.trim());
  }

  return (
    <form className={["chat-composer", className].filter(Boolean).join(" ")} onSubmit={submit}>
      {attach ? (
        <button
          type="button"
          className="chat-composer__attach"
          aria-label={attach.label}
          onClick={attach.onAttach}
          disabled={disabled}
        >
          <Icon name="attach" size={20} />
        </button>
      ) : null}
      <input
        id={id}
        aria-label="Message"
        ref={inputRef}
        className="chat-composer__field"
        autoComplete="off"
        placeholder={placeholder}
        value={value}
        // Read-only rather than disabled while ExecHQ is writing: a disabled
        // field drops focus, and the user would lose their place every turn.
        readOnly={disabled}
        aria-disabled={disabled || undefined}
        onChange={(event) => onChange(event.target.value)}
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
