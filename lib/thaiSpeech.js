// Speaks a line of Thai text aloud using the browser's built-in speech
// synthesis, so movement cues during the game are read out, not just
// shown on screen. If the browser/OS has no Thai voice installed this
// silently does nothing rather than erroring out the game.

export function speakThai(text) {
  if (typeof window === "undefined") return;
  if (!("speechSynthesis" in window)) return;

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "th-TH";
    utterance.rate = 0.92;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  } catch {
    // Speech is a nice-to-have; never let it break the game.
  }
}

export function stopSpeaking() {
  if (typeof window === "undefined") return;
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
}
