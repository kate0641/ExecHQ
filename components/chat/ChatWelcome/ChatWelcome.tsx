import { AdvisorMark } from "@/components/chat/AdvisorMark";
import { Wordmark } from "@/components/primitives/Wordmark";

export interface ChatWelcomeProps {
  title: string;
  quote: string;
  lede: string;
  ask: string;
  /** Id for the heading, so focus can be sent to it. */
  headingId?: string;
  className?: string;
}

/**
 * The open door: an empty chat that is itself the welcome. Centred, calm, and
 * over a composer that is already asking for the email, so the first thing
 * anyone can do is answer. Once they do, it folds into IntroCard at the top
 * of the thread.
 */
export function ChatWelcome({ title, quote, lede, ask, headingId, className }: ChatWelcomeProps) {
  return (
    <div className={["chat-welcome", className].filter(Boolean).join(" ")}>
      <AdvisorMark size={56} className="chat-welcome__mark" />
      <h1 className="chat-welcome__title" id={headingId} tabIndex={-1}>
        {title}
      </h1>
      <p className="chat-welcome__quote">{quote}</p>
      <p className="chat-welcome__lede">{lede}</p>
      <p className="chat-welcome__ask">{ask}</p>
    </div>
  );
}

export interface IntroCardProps {
  quote: string;
  className?: string;
}

/**
 * What the welcome folds into: a dark card at the top of the thread, the
 * lasting record of who the user is talking to.
 */
export function IntroCard({ quote, className }: IntroCardProps) {
  return (
    <div className={["intro-card", className].filter(Boolean).join(" ")}>
      <Wordmark size="xl" />
      <p className="intro-card__quote">{quote}</p>
    </div>
  );
}

export default ChatWelcome;
