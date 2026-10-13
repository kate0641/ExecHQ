"use client";

import { useState } from "react";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { TOOLBOX_PAGE } from "@/mock/toolbox";

const C = TOOLBOX_PAGE.mind;

export interface MindStartProps {
  /** Hands what she said to the advisor, who suggests the tool. */
  onAsk: (text: string) => void;
  /** Opens with this typed (catalogue). */
  initial?: string;
  className?: string;
}

/**
 * Concept 1's way in when she isn't sure which tool: "What's on your mind?",
 * under the tools. It doesn't pick a tool on the page. Her words open the
 * advisor as her first message, and he names the tool with a Start, or asks
 * one question when he can't tell (Kate, 13 Oct). Concept 3's "What's coming
 * up?" is the version that picks on the page.
 *
 * One field with the send arrow inside, the advisor's own box, so the page
 * carries no second black button (option A, 13 Oct). The hint is the
 * placeholder. Sending with nothing typed does nothing, as in the chat.
 */
export function MindStart({ onAsk, initial, className }: MindStartProps) {
  const [text, setText] = useState(initial ?? "");

  return (
    <div className={["mind-start", className].filter(Boolean).join(" ")}>
      <p className="mind-start__label" aria-hidden="true">
        {C.label}
      </p>
      <ChatComposer
        value={text}
        onChange={setText}
        onSend={(said) => {
          onAsk(said);
          setText("");
        }}
        placeholder={C.hint}
        fieldLabel={C.label}
        sendLabel={C.go}
        className="mind-start__field"
      />
    </div>
  );
}

export default MindStart;
