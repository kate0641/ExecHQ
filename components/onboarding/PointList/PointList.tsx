export interface PointListItem {
  title: string;
  detail: string;
  /** What it does for the user, said after the detail. */
  helps?: string;
}

export interface PointListProps {
  items: readonly PointListItem[];
  /** Numbered for things that have an order or a count; bullets otherwise. */
  numbered?: boolean;
  /** A heading for the list, shown boxed. Omitted: the list sits on the page. */
  label?: string;
  helpsLabel?: string;
  className?: string;
}

/**
 * A short list of explained points: what ExecHQ is, how it is built, the
 * parts of a plan. Each point is a title and a line; a plan part also says how
 * it helps, because the guided concept explains what things are for, not just
 * what they are.
 */
export function PointList({ items, numbered = false, label, helpsLabel = "How it helps:", className }: PointListProps) {
  const List = numbered ? "ol" : "ul";
  const list = (
    <List className={["point-list", numbered ? "point-list--numbered" : null].filter(Boolean).join(" ")}>
      {items.map((item) => (
        <li key={item.title}>
          <p className="point-list__title">{item.title}</p>
          <p className="point-list__detail">{item.detail}</p>
          {item.helps ? (
            <p className="point-list__helps">
              <b>{helpsLabel}</b> {item.helps}
            </p>
          ) : null}
        </li>
      ))}
    </List>
  );
  if (!label) return <div className={className}>{list}</div>;
  return (
    <section className={["point-box", className].filter(Boolean).join(" ")} aria-label={label}>
      <p className="point-box__label">{label}</p>
      {list}
    </section>
  );
}

export default PointList;
