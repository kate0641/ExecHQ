const ROWS = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];

export interface DeviceKeyboardProps {
  /** The return key's label, e.g. "Next" or "Done". */
  returnLabel?: string;
  className?: string;
}

/**
 * A phone keyboard, drawn: the space a real one takes, so the screens above
 * it are designed against the room that is actually left. It is a picture,
 * not a control: hidden from assistive technology, and typing happens on the
 * reviewer's own keyboard. No web keyboard is drawn.
 */
export function DeviceKeyboard({ returnLabel = "Done", className }: DeviceKeyboardProps) {
  return (
    <div className={["device-keyboard", className].filter(Boolean).join(" ")} aria-hidden="true">
      {ROWS.map((row, index) => (
        <div className="device-keyboard__row" key={row}>
          {index === 2 ? <span className="device-keyboard__key is-wide">⇧</span> : null}
          {[...row].map((key) => (
            <span className="device-keyboard__key" key={key}>
              {key}
            </span>
          ))}
          {index === 2 ? <span className="device-keyboard__key is-wide">⌫</span> : null}
        </div>
      ))}
      <div className="device-keyboard__row">
        <span className="device-keyboard__key is-wide">123</span>
        <span className="device-keyboard__key is-space">space</span>
        <span className="device-keyboard__key is-return">{returnLabel}</span>
      </div>
    </div>
  );
}

export default DeviceKeyboard;
