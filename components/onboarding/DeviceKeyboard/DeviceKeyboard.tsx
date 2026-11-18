const ROWS = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];

export interface DeviceKeyboardProps {
  /** The return key's label, e.g. "Next" or "Done". */
  returnLabel?: string;
  /** What the return key does when pressed. Omitted, it is only drawn. */
  onReturn?: () => void;
  className?: string;
}

/**
 * A phone keyboard, drawn: the space a real one takes, so the screens above
 * it are designed against the room that is actually left. It is a picture:
 * hidden from assistive technology, and typing happens on the reviewer's own
 * keyboard. The one exception is the return key, which a reviewer on a mouse
 * will press as they would on a phone. It does what Return on the real
 * keyboard does, takes no focus, and stays out of the tab order. No web
 * keyboard is drawn.
 */
export function DeviceKeyboard({ returnLabel = "Done", onReturn, className }: DeviceKeyboardProps) {
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
        {onReturn ? (
          <button
            type="button"
            tabIndex={-1}
            className="device-keyboard__key is-return"
            onMouseDown={(event) => event.preventDefault()}
            onClick={onReturn}
          >
            {returnLabel}
          </button>
        ) : (
          <span className="device-keyboard__key is-return">{returnLabel}</span>
        )}
      </div>
    </div>
  );
}

export default DeviceKeyboard;
