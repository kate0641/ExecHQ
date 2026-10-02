import { Fragment, type ReactNode } from "react";

export interface SpecDocumentProps {
  /** The spec's markdown source. */
  source: string;
}

/**
 * Renders an interaction spec. A small markdown reader written for the specs
 * and nothing else, so the prototype needs no markdown package: headings,
 * paragraphs, bullet and numbered lists, tables, rules, fenced blocks for
 * diagrams, and bold, italic and code inside a line. Anything else shows as plain text.
 */
export function SpecDocument({ source }: SpecDocumentProps) {
  // The page already carries the spec's title, so a leading "# Title" is dropped.
  const lines = source.split("\n");
  const start = /^#\s/.test(lines[0] ?? "") ? 1 : 0;
  return <div className="spec-doc">{renderBlocks(lines.slice(start))}</div>;
}

/* -----------------------------------------------------------------------------
   Inline: **bold**, *italic*, `code`
   -------------------------------------------------------------------------- */

const INLINE = /(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|`[^`]+`)/g;

function renderInline(text: string): ReactNode {
  return text.split(INLINE).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return <code key={i}>{part.slice(1, -1)}</code>;
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

/* -----------------------------------------------------------------------------
   Blocks
   -------------------------------------------------------------------------- */

const isBlank = (line: string) => line.trim() === "";
const isRule = (line: string) => /^-{3,}\s*$/.test(line.trim());
const heading = (line: string) => /^(#{1,4})\s+(.*)$/.exec(line);
const bullet = (line: string) => /^[-*]\s+(.*)$/.exec(line);
const numbered = (line: string) => /^\d+\.\s+(.*)$/.exec(line);
const isTableRow = (line: string) => line.trim().startsWith("|");

function cells(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

const isTableDivider = (line: string) => isTableRow(line) && cells(line).every((c) => /^:?-{2,}:?$/.test(c));

function renderBlocks(lines: string[]): ReactNode[] {
  const out: ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (isBlank(line)) {
      i += 1;
      continue;
    }

    // A fenced block: shown exactly as written, for diagrams.
    if (line.trim().startsWith("```")) {
      const code: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        code.push(lines[i]);
        i += 1;
      }
      i += 1;
      out.push(
        <pre className="spec-doc__code" key={key++}>
          <code>{code.join("\n")}</code>
        </pre>
      );
      continue;
    }

    if (isRule(line)) {
      out.push(<hr key={key++} className="spec-doc__rule" />);
      i += 1;
      continue;
    }

    const h = heading(line);
    if (h) {
      const level = h[1].length;
      const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4";
      out.push(<Tag key={key++}>{renderInline(h[2])}</Tag>);
      i += 1;
      continue;
    }

    if (isTableRow(line) && lines[i + 1] !== undefined && isTableDivider(lines[i + 1])) {
      const head = cells(line);
      const body: string[][] = [];
      i += 2;
      while (i < lines.length && isTableRow(lines[i])) {
        body.push(cells(lines[i]));
        i += 1;
      }
      out.push(
        <section className="spec-doc__table" key={key++} aria-label={`Table: ${head.join(", ")}`}>
          <table>
            <thead>
              <tr>
                {head.map((cell, c) => (
                  <th scope="col" key={c}>
                    {renderInline(cell)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((row, r) => (
                <tr key={r}>
                  {head.map((_, c) => (
                    <td key={c}>{renderInline(row[c] ?? "")}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      );
      continue;
    }

    if (bullet(line) || numbered(line)) {
      const ordered = Boolean(numbered(line));
      const items: string[] = [];
      while (i < lines.length) {
        const match = ordered ? numbered(lines[i]) : bullet(lines[i]);
        if (match) {
          items.push(match[1]);
          i += 1;
        } else if (/^\s+\S/.test(lines[i]) && items.length) {
          // A wrapped continuation of the previous item.
          items[items.length - 1] += ` ${lines[i].trim()}`;
          i += 1;
        } else {
          break;
        }
      }
      const List = ordered ? "ol" : "ul";
      out.push(
        <List key={key++}>
          {items.map((item, n) => (
            <li key={n}>{renderInline(item)}</li>
          ))}
        </List>
      );
      continue;
    }

    // A paragraph: lines up to the next blank line or other block.
    const para: string[] = [];
    while (
      i < lines.length &&
      !isBlank(lines[i]) &&
      !isRule(lines[i]) &&
      !heading(lines[i]) &&
      !bullet(lines[i]) &&
      !numbered(lines[i]) &&
      !isTableRow(lines[i]) &&
      !lines[i].trim().startsWith("```")
    ) {
      para.push(lines[i].trim());
      i += 1;
    }
    out.push(<p key={key++}>{renderInline(para.join(" "))}</p>);
  }

  return out;
}

export default SpecDocument;
