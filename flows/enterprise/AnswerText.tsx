/** An answer's paragraphs: the assistant writes them with a blank line
 *  between. */
export function AnswerText({ text }: { text: string }) {
  return (
    <>
      {text.split("\n\n").map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </>
  );
}

export default AnswerText;
