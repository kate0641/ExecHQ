"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { VOICE_SAMPLE } from "@/mock/onboarding";

/** Gap between "heard" words. Slow enough to read as speech arriving. */
const WORD_MS = 180;

/**
 * Simulated speech-to-text for the mic button.
 *
 * The prototype talks to nothing, so there is no real speech input: pressing
 * the mic "hears" a sample answer and types it in word by word, which is
 * enough to review what listening looks like. An empty field gets the whole
 * sample; a field with something in it — a prompt, say — gets the addition,
 * after a comma. Reduced motion types it all at once.
 */
export interface DictationSample {
  /** What is "heard" into an empty field. */
  full: string;
  /** What is "heard" after something already typed. Omit to replace it. */
  addition?: string;
}

export function useDictation(
  value: string,
  setValue: (next: string) => void,
  sample: DictationSample = VOICE_SAMPLE
) {
  const [listening, setListening] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  // The words go in through the latest value, not the one the timer started
  // with, so it never overwrites anything typed or chosen meanwhile.
  const valueRef = useRef(value);
  const sampleRef = useRef(sample);
  useEffect(() => {
    valueRef.current = value;
    sampleRef.current = sample;
  });

  const stop = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setListening(false);
  }, []);

  useEffect(() => stop, [stop]);

  const start = useCallback(() => {
    const { full, addition } = sampleRef.current;
    const current = addition ? valueRef.current.trim() : "";
    const words = (current ? addition! : full).split(" ");
    let text = current ? `${current.replace(/[.,]$/, "")},` : "";
    let index = 0;

    const addWord = () => {
      text = text ? `${text} ${words[index]}` : words[index];
      valueRef.current = text;
      setValue(text);
      index += 1;
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      while (index < words.length) addWord();
      return;
    }

    setListening(true);
    timer.current = setInterval(() => {
      addWord();
      if (index >= words.length) stop();
    }, WORD_MS);
  }, [setValue, stop]);

  const toggle = useCallback(() => {
    if (timer.current) stop();
    else start();
  }, [start, stop]);

  return { listening, toggle, stop };
}
