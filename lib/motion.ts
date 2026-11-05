/**
 * Entrance motion, browser only. Two ideas run through the whole site:
 *
 * - Stickers: things are slapped onto the page. They come in a little too big and tilted,
 *   land with an overshoot, and their hard shadow only drops once they have landed.
 * - The credit check machine: the headline decodes from noise, report slips feed out of a
 *   printer line by line, numbers roll up, the hash decodes and the verdict is stamped on.
 *
 * Markup opts in with data attributes, so server components stay server components:
 *   data-anim="scramble | words | rise | slap | pop | pop-children | rows | drop | count | grow-children | print"
 *   data-shadow   the hard shadow on this element drops in after it lands
 * Inside a slip: data-count, data-bar, data-stamp, data-hex.
 *
 * Everything marked is hidden by CSS only while <html> has the `motion` class, which an
 * inline script sets before first paint (and removes again if this code never boots).
 */
import { gsap } from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin, SplitText);

const NOISE = "AGENTBOND0123456789#%&$@*+=?";
const HEX = "0123456789abcdef";
const START = "top 90%";

const random = gsap.utils.random;
const tilt = (index: number, min: number, max: number) => (index % 2 ? 1 : -1) * random(min, max);

function onView(trigger: Element, start = START): ScrollTrigger.Vars {
  return { trigger, start, once: true };
}

/** The real shadow an element ends up with, so it can drop in from nothing. */
function dropShadow(timeline: gsap.core.Timeline, el: Element | null, at: number | string) {
  if (!el) return;
  const shadow = getComputedStyle(el).boxShadow;
  if (!shadow || shadow === "none") return;
  timeline.fromTo(
    el,
    { boxShadow: "0px 0px 0px 0px rgba(0,0,0,0)" },
    { boxShadow: shadow, duration: 0.18, ease: "power1.out", clearProps: "boxShadow" },
    at,
  );
}

/**
 * Headline decodes out of noise, word by word from the left. Words keep their own boxes,
 * so line breaks never jump while the letters are still noise.
 */
export function scramble(el: HTMLElement, delay = 0) {
  const split = SplitText.create(el, { type: "words", wordsClass: "inline-block" });
  const tl = gsap.timeline({ delay });
  tl.set(el, { autoAlpha: 1 });
  split.words.forEach((word, index) => {
    const text = word.textContent ?? "";
    // Lock the width so a wide glyph like W or @ cannot push the next word to a new line.
    tl.set(word, { width: (word as HTMLElement).offsetWidth, textAlign: "left" }, 0);
    tl.to(
      word,
      {
        duration: 0.5 + text.length * 0.07,
        ease: "none",
        scrambleText: { text, chars: NOISE, revealDelay: 0.25, speed: 0.6 },
        onComplete: () => void gsap.set(word, { clearProps: "width,textAlign" }),
      },
      index * 0.16,
    );
  });
  return tl;
}

/** Each word of a heading lands like a separate letter sticker. */
export function words(el: HTMLElement) {
  const split = SplitText.create(el, { type: "words", wordsClass: "inline-block" });
  const tl = gsap.timeline({ scrollTrigger: onView(el) });
  tl.set(el, { autoAlpha: 1 });
  tl.fromTo(
    split.words,
    { autoAlpha: 0, scale: 1.7, rotation: (i) => tilt(i, 6, 14), y: -10 },
    {
      autoAlpha: 1,
      scale: 1,
      rotation: 0,
      y: 0,
      duration: 0.5,
      ease: "back.out(3)",
      stagger: 0.07,
      clearProps: "transform",
    },
  );
  return tl;
}

/** Plain text eases up. Kept quiet so the stickers stand out. */
export function rise(el: Element, delay = 0) {
  return gsap.fromTo(
    el,
    { autoAlpha: 0, y: 22 },
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.7,
      delay,
      ease: "power3.out",
      clearProps: "transform",
      scrollTrigger: onView(el),
    },
  );
}

/** A big card slapped onto the page: a touch too big and tilted, then it lands. */
export function slap(el: Element, index = 0) {
  const tl = gsap.timeline({ scrollTrigger: onView(el) });
  tl.fromTo(
    el,
    { autoAlpha: 0, scale: 1.07, rotation: tilt(index, 1.5, 3), y: 36, transformOrigin: "50% 70%" },
    { autoAlpha: 1, scale: 1, rotation: 0, y: 0, duration: 0.6, ease: "back.out(1.6)", clearProps: "transform" },
  );
  // Shadows of props inside the card drop in once it lands, unless they animate on their own.
  el.querySelectorAll("[data-shadow]").forEach((child) => {
    if (child.hasAttribute("data-anim") || child.querySelector('[data-anim="print"]')) return;
    if (child.parentElement?.closest("[data-anim]") !== el) return;
    dropShadow(tl, child, 0.5);
  });
  if (el.matches("[data-shadow]")) dropShadow(tl, el, 0.5);
  return tl;
}

/** Small things (buttons, stickers, tiles, chips) pop on with more spring. */
function popVars(index: number): [gsap.TweenVars, gsap.TweenVars] {
  return [
    { autoAlpha: 0, scale: 0.4, rotation: tilt(index, 8, 18) },
    { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.55, ease: "back.out(2.6)", clearProps: "transform" },
  ];
}

export function pop(el: Element, index = 0, delay = 0) {
  const [from, to] = popVars(index);
  const tl = gsap.timeline({ scrollTrigger: onView(el), delay });
  tl.fromTo(el, from, to);
  dropShadow(tl, el.matches("[data-shadow]") ? el : null, 0.45);
  return tl;
}

export function popChildren(el: Element, delay = 0) {
  const children = [...el.children];
  return gsap.fromTo(
    children,
    { autoAlpha: 0, scale: 0.4, rotation: (i) => tilt(i, 8, 18) },
    {
      autoAlpha: 1,
      scale: 1,
      rotation: 0,
      duration: 0.5,
      ease: "back.out(2.6)",
      stagger: { each: 0.05, from: "random" },
      delay,
      clearProps: "transform",
      scrollTrigger: onView(el),
    },
  );
}

/** Long lists: rows are dealt in from the left in batches as they scroll into view. */
export function rows(el: Element) {
  return ScrollTrigger.batch([...el.children], {
    start: START,
    once: true,
    onEnter: (batch) =>
      gsap.fromTo(
        batch,
        { autoAlpha: 0, x: -28, rotation: -1.2 },
        {
          autoAlpha: 1,
          x: 0,
          rotation: 0,
          duration: 0.5,
          ease: "back.out(1.8)",
          stagger: 0.06,
          clearProps: "transform",
        },
      ),
  });
}

/** Coins fall in from above the screen, bounce, then their CSS float takes over. */
export function drop(targets: Element[]) {
  return gsap.fromTo(
    targets,
    {
      autoAlpha: 1,
      y: (_, el: Element) => -(el.getBoundingClientRect().bottom + 120),
      rotation: (i) => tilt(i, 40, 110),
    },
    {
      y: 0,
      rotation: 0,
      duration: () => random(1, 1.5),
      ease: "bounce.out",
      stagger: 0.12,
      delay: 0.15,
      clearProps: "transform",
    },
  );
}

/** A number rolls up from zero to what the markup says. */
export function count(el: HTMLElement, from = 0) {
  const target = Number((el.dataset.value ?? el.textContent ?? "0").replace(/[^\d.]/g, ""));
  const counter = { value: from };
  const format = (value: number) => Math.round(value).toLocaleString("en-US");
  return gsap
    .timeline({ scrollTrigger: onView(el) })
    .set(el, { autoAlpha: 1 })
    .fromTo(
      counter,
      { value: from },
      {
        value: target,
        duration: 1.4,
        ease: "power3.out",
        onUpdate: () => void (el.textContent = format(counter.value)),
      },
    );
}

/** Children grow out from the left, like segments of a bar filling up. */
export function growChildren(el: Element) {
  const tl = gsap.timeline({ scrollTrigger: onView(el) });
  tl.set(el, { autoAlpha: 1 });
  tl.fromTo(
    el.children,
    { scaleX: 0, transformOrigin: "0% 50%" },
    { scaleX: 1, duration: 0.55, ease: "expo.out", stagger: 0.12, clearProps: "transform" },
  );
  return tl;
}

/**
 * A report slip feeds out of a printer: it is revealed top to bottom in mechanical steps,
 * the score rolls up, bars fill, the hash decodes and the verdict is stamped on with a jolt.
 */
export function printSlip(slip: HTMLElement, { onScroll = true }: { onScroll?: boolean } = {}) {
  const tl = gsap.timeline(onScroll ? { scrollTrigger: onView(slip, "top 85%") } : {});
  const frame = slip.closest<HTMLElement>("[data-shadow]");

  tl.fromTo(
    slip,
    { autoAlpha: 1, clipPath: "inset(0% 0% 100% 0%)", y: -28 },
    { clipPath: "inset(0% 0% 0% 0%)", y: 0, duration: 1.15, ease: "steps(18)", clearProps: "clipPath,transform" },
  );
  if (frame) {
    tl.fromTo(
      frame,
      { boxShadow: "0px 0px 0px 0px rgba(0,0,0,0)" },
      { boxShadow: getComputedStyle(frame).boxShadow, duration: 1.15, ease: "steps(18)", clearProps: "boxShadow" },
      0,
    );
  }

  slip.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
    const target = Number(el.dataset.count);
    const counter = { value: 0 };
    tl.fromTo(
      counter,
      { value: 0 },
      {
        value: target,
        duration: 1.1,
        ease: "power3.out",
        onUpdate: () => void (el.textContent = String(Math.round(counter.value)).padStart(2, "0")),
        onComplete: () => void (el.textContent = String(target)),
      },
      0.25,
    );
  });

  tl.fromTo(
    slip.querySelectorAll("[data-bar]"),
    { scaleX: 0, transformOrigin: "0% 50%" },
    { scaleX: 1, duration: 0.7, ease: "expo.out", stagger: 0.09, clearProps: "transform" },
    0.45,
  );

  slip.querySelectorAll<HTMLElement>("[data-hex]").forEach((el) => {
    tl.to(el, { duration: 0.9, scrambleText: { text: el.textContent ?? "", chars: HEX, speed: 0.6 } }, 0.6);
  });

  const stamp = slip.querySelector("[data-stamp]");
  if (stamp) {
    tl.fromTo(
      stamp,
      { autoAlpha: 0, scale: 2.8, rotation: -22 },
      { autoAlpha: 1, scale: 1, rotation: -4, duration: 0.26, ease: "power4.in" },
      1.05,
    );
    // The jolt of the stamp hitting the paper.
    tl.to(slip, { x: 3, y: 2, duration: 0.04, ease: "none", yoyo: true, repeat: 5, clearProps: "transform" }, ">");
  }
  return tl;
}

/** Wire up every marked element under `root`, in page order. */
export function animateAll(root: ParentNode = document) {
  const all = <T extends Element = HTMLElement>(selector: string) => [...root.querySelectorAll<T>(selector)];

  all('[data-anim="scramble"]').forEach((el, i) => scramble(el, 0.1 + i * 0.2));
  drop(all('[data-anim="drop"]'));
  all('[data-anim="words"]').forEach((el) => words(el));
  all('[data-anim="rise"]').forEach((el) => rise(el, Number(el.dataset.delay ?? 0)));
  all('[data-anim="slap"]').forEach((el, i) => slap(el, i));
  all('[data-anim="pop"]').forEach((el, i) => pop(el, i, Number(el.dataset.delay ?? 0)));
  all('[data-anim="pop-children"]').forEach((el) => popChildren(el, Number(el.dataset.delay ?? 0)));
  all('[data-anim="rows"]').forEach((el) => rows(el));
  all('[data-anim="count"]').forEach((el) => count(el));
  all('[data-anim="grow-children"]').forEach((el) => growChildren(el));
  all('[data-anim="print"]').forEach((el) => printSlip(el));
}

export { gsap };
