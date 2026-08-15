import type { ReactNode } from "react";

interface LearningContentProps {
  readonly content: string;
}

export function LearningContent({ content }: LearningContentProps): React.JSX.Element {
  return <div className="learning-copy">{renderBlocks(content)}</div>;
}

function renderBlocks(content: string): readonly ReactNode[] {
  const lines = content.split("\n");
  const blocks: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index]?.trim() ?? "";

    if (line.length === 0) {
      index += 1;
      continue;
    }

    if (line.startsWith("```")) {
      const language = line.slice(3).trim();
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !(lines[index] ?? "").trim().startsWith("```")) {
        code.push(lines[index] ?? "");
        index += 1;
      }
      index += 1;
      blocks.push(
        <figure className="learning-code" key={`code-${index}`}>
          {language.length === 0 ? null : <figcaption>{language}</figcaption>}
          <pre tabIndex={0}><code>{code.join("\n")}</code></pre>
        </figure>
      );
      continue;
    }

    if (line.startsWith("|")) {
      const tableLines: string[] = [];
      while (index < lines.length && (lines[index] ?? "").trim().startsWith("|")) {
        tableLines.push((lines[index] ?? "").trim());
        index += 1;
      }
      blocks.push(renderTable(tableLines, index));
      continue;
    }

    if (/^[-*] /u.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^[-*] /u.test((lines[index] ?? "").trim())) {
        items.push((lines[index] ?? "").trim().slice(2));
        index += 1;
      }
      blocks.push(<ul key={`list-${index}`}>{items.map((item) => <li key={item}>{item}</li>)}</ul>);
      continue;
    }

    if (/^\d+\. /u.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\d+\. /u.test((lines[index] ?? "").trim())) {
        items.push((lines[index] ?? "").trim().replace(/^\d+\. /u, ""));
        index += 1;
      }
      blocks.push(<ol key={`steps-${index}`}>{items.map((item) => <li key={item}>{item}</li>)}</ol>);
      continue;
    }

    if (/^(Mental model|Problem|Why|Worked example|Checkpoint|Success criteria|What you should remember|Professional transfer|Interview transfer|Duration architecture|Activity plan|Core model):?$/iu.test(line)) {
      blocks.push(<h3 key={`heading-${index}`}>{line.replace(/:$/u, "")}</h3>);
      index += 1;
      continue;
    }

    const paragraph: string[] = [line];
    index += 1;
    while (index < lines.length && (lines[index] ?? "").trim().length > 0) {
      const next = (lines[index] ?? "").trim();
      if (next.startsWith("```") || next.startsWith("|") || /^[-*] |^\d+\. /u.test(next)) break;
      paragraph.push(next);
      index += 1;
    }
    blocks.push(<p key={`paragraph-${index}`}>{paragraph.join(" ")}</p>);
  }

  return blocks;
}

function renderTable(lines: readonly string[], key: number): ReactNode {
  const rows = lines
    .filter((line) => !/^\|?[\s:-]+(?:\|[\s:-]+)+\|?$/u.test(line))
    .map((line) => line.split("|").slice(1, -1).map((cell) => cell.trim()));
  const [headings = [], ...body] = rows;

  return (
    <div className="learning-table-scroll" key={`table-${key}`} tabIndex={0} aria-label="Scrollable learning table">
      <table>
        <thead><tr>{headings.map((heading) => <th key={heading} scope="col">{heading}</th>)}</tr></thead>
        <tbody>{body.map((row) => <tr key={row.join("|")}>{row.map((cell, cellIndex) => <td key={`${cellIndex}-${cell}`}>{cell}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}
