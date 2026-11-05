/**
 * Entrance motion, browser only. Two ideas run through the whole site:
 *
 * - Stickers: things are slapped onto the page. They come in a little too big and tilted
 *   and settle with a soft overshoot. Heading words land one by one.
 * - The credit check machine: titles decode out of noise, report slips slide out of a
 *   printer slot, the score rolls up, bars fill, the hash decodes and the verdict is stamped.
 *
 * Markup opts in with data attributes, so server components stay server components:
 *   data-anim="scramble | words | rise | slap | pop | pop-children | rows | drop | count | grow-children | print"
 *   data-delay="0.4"  optional extra delay in seconds
 * Inside a slip: data-count, data-bar, data-stamp, data-hex.
 *
 * Smoothness rules, learned the hard way on a throttled phone:
 * - Nothing is built up front. One IntersectionObserver builds each animation only when its
 *   element is about to enter the screen, so there is no long task at load and no scroll
 *   listener at all.
 * - Only transform and opacity move. No box-shadow, clip-path or stepped easing.
 * - CSS transitions on a target are switched off while GSAP drives it, so they cannot lag
 *   behind every frame.
 *
 * Everything marked is hidden by CSS only while <html> has the `motion` class, which an
 * inline script sets before first paint (and removes again if this code never boots).
 */
import { gsap } from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrambleTextPlugin, SplitText);
gsap.defaults({ overwrite: "auto" });

const NOISE = "AGENTBOND0123456789#%&$@*+=?";
const HEX = "0123456789abcdef";

const random = gsap.utils.random;
const tilt = (index: number, min: number, max: number) => (index % 2 ? 1 : -1) * random(min, max);
type Target = HTMLElement;

/** Common end state: settled, visible, and inline styles handed back to CSS. */
const settle = { autoAlpha: 1, x: 0, y: 0, scale: 1, rotation: 0, clearProps: "transform,transition,willChange" };
const prep = { transition: "none", willChange: "transform, opacity" };

/** Headline decodes out of noise, word by word from the left, without reflowing. */
export function scramble(el: Target, delay = 0) {
  const split = SplitText.create(el, { type: "words", wordsClass: "inline-block" });
  // Read every width first, then write, so the browser lays out once.
  const widths = split.words.map((word) => (word as HTMLElement).offsetWidth);
  const tl = gsap.timeline({ delay });
  tl.set(el, { autoAlpha: 1 });
  split.words.forEach((word, index) => {
    const text = word.textContent ?? "";
    tl.set(word, { width: widths[index], textAlign: "left" }, 0);
    tl.to(
      word,
      {
        duration: 0.35 + text.length * 0.06,
        ease: "none",
        scrambleText: { text, chars: NOISE, revealDelay: 0.2, speed: 0.35 },
        onComplete: () => void gsap.set(word, { clearProps: "width,textAlign" }),
      },
      index * 0.14,
    );
  });
  return tl;
}

/** Each word of a heading lands like a separate letter sticker. */
export function words(el: Target, delay = 0) {
  const split = SplitText.create(el, { type: "words", wordsClass: "inline-block" });
  const tl = gsap.timeline({ delay });
  tl.set(el, { autoAlpha: 1 });
  tl.fromTo(
    split.words,
    { autoAlpha: 0, scale: 1.35, rotation: (i) => tilt(i, 4, 9), y: -8, ...prep },
    { ...settle, duration: 0.7, ease: "back.out(1.6)", stagger: 0.055 },
  );
  return tl;
}

/** Plain text eases up. Kept quiet so the stickers stand out. */
export function rise(el: Target, delay = 0) {
  return gsap.fromTo(el, { autoAlpha: 0, y: 24, ...prep }, { ...settle, duration: 0.9, delay, ease: "expo.out" });
}

/** A big card slapped onto the page: a touch too big and tilted, then it settles. */
export function slap(el: Target, delay = 0, index = 0) {
  return gsap.fromTo(
    el,
    { autoAlpha: 0, scale: 1.06, rotation: tilt(index, 1.2, 2.4), y: 40, transformOrigin: "50% 80%", ...prep },
    { ...settle, duration: 0.95, delay, ease: "back.out(1.25)" },
  );
}

/** Small things (buttons, stickers, tiles, chips) pop on with more spring. */
const popFrom = (index: number) => ({ autoAlpha: 0, scale: 0.55, rotation: tilt(index, 6, 14), ...prep });

export function pop(el: Target, delay = 0, index = 0) {
  return gsap.fromTo(el, popFrom(index), { ...settle, duration: 0.75, delay, ease: "back.out(1.9)" });
}

export function popChildren(el: Target, delay = 0) {
  const children = [...el.children];
  return gsap.fromTo(
    children,
    { autoAlpha: 0, scale: 0.55, rotation: (i) => tilt(i, 6, 14), ...prep },
    { ...settle, duration: 0.7, delay, ease: "back.out(1.9)", stagger: { each: 0.045, from: "random" } },
  );
}

/** One row of a long list, dealt in from the left. */
export function row(el: Target, delay = 0) {
  return gsap.fromTo(
    el,
    { autoAlpha: 0, x: -32, rotation: -1, ...prep },
    { ...settle, duration: 0.7, delay, ease: "back.out(1.4)" },
  );
}

/** Coins are tossed in from above the screen and settle, then their CSS float takes over. */
export function drop(targets: Target[]) {
  if (!targets.length) return;
  const distances = targets.map((el) => el.getBoundingClientRect().bottom + 80);
  return gsap.fromTo(
    targets,
    { autoAlpha: 1, y: (i) => -distances[i], rotation: (i) => tilt(i, 50, 120), ...prep },
    { ...settle, duration: () => random(1.3, 1.7), ease: "back.out(1.15)", stagger: 0.1, delay: 0.1 },
  );
}

/** A number rolls up from zero to what the markup says. */
export function count(el: Target, delay = 0) {
  const target = Number((el.dataset.value ?? el.textContent ?? "0").replace(/[^\d.]/g, ""));
  const counter = { value: 0 };
  return gsap
    .timeline({ delay })
    .set(el, { autoAlpha: 1 })
    .fromTo(
      counter,
      { value: 0 },
      {
        value: target,
        duration: 1.6,
        ease: "expo.out",
        onUpdate: () => void (el.textContent = Math.round(counter.value).toLocaleString("en-US")),
      },
    );
}

/** Children grow out from the left, like segments of a bar filling up. */
export function growChildren(el: Target, delay = 0) {
  return gsap
    .timeline({ delay })
    .set(el, { autoAlpha: 1 })
    .fromTo(
      el.children,
      { scaleX: 0, transformOrigin: "0% 50%", willChange: "transform" },
      { scaleX: 1, duration: 0.9, ease: "expo.out", stagger: 0.12, clearProps: "transform,willChange" },
    );
}

/**
 * A report slip slides out of a printer slot (the wrapper clips it), the score rolls up,
 * bars fill, the hash decodes and the verdict is stamped on, which nudges the paper.
 */
export function printSlip(slot: Target, delay = 0) {
  const slip = slot.firstElementChild as Target | null;
  const tl = gsap.timeline({ delay });
  tl.set(slot, { autoAlpha: 1 });
  if (!slip) return tl;

  tl.fromTo(
    slip,
    { yPercent: -100, ...prep },
    { yPercent: 0, duration: 1.25, ease: "power3.out", clearProps: "transform,transition,willChange" },
  );

  slip.querySelectorAll<Target>("[data-count]").forEach((el) => {
    const target = Number(el.dataset.count);
    const counter = { value: 0 };
    tl.fromTo(
      counter,
      { value: 0 },
      {
        value: target,
        duration: 1.3,
        ease: "expo.out",
        onUpdate: () => void (el.textContent = String(Math.round(counter.value)).padStart(2, "0")),
        onComplete: () => void (el.textContent = String(target)),
      },
      0.35,
    );
  });

  tl.fromTo(
    slip.querySelectorAll("[data-bar]"),
    { scaleX: 0, transformOrigin: "0% 50%" },
    { scaleX: 1, duration: 1, ease: "expo.out", stagger: 0.08, clearProps: "transform" },
    0.55,
  );

  slip.querySelectorAll<Target>("[data-hex]").forEach((el) => {
    tl.to(el, { duration: 0.9, scrambleText: { text: el.textContent ?? "", chars: HEX, speed: 0.35 } }, 0.7);
  });

  const stamp = slip.querySelector("[data-stamp]");
  if (stamp) {
    tl.fromTo(
      stamp,
      { autoAlpha: 0, scale: 2.4, rotation: -20, willChange: "transform, opacity" },
      { autoAlpha: 1, scale: 1, rotation: -4, duration: 0.32, ease: "power3.in", clearProps: "willChange" },
      1.05,
    );
    // The paper gives under the stamp and springs back.
    tl.fromTo(slip, { y: 6 }, { y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)", clearProps: "transform" }, ">");
  }
  return tl;
}

const players: Record<string, (el: Target, delay: number, index: number) => unknown> = {
  scramble,
  words,
  rise,
  slap,
  pop,
  "pop-children": popChildren,
  row,
  count,
  "grow-children": growChildren,
  print: printSlip,
};

/**
 * Watch every marked element under `root` and play each one as it comes into view. Elements
 * that enter together cascade in page order. `wrap` lets React's GSAP context own the
 * animations created later. Returns a function that stops watching.
 */
export function animateAll(
  root: ParentNode,
  wrap: (fn: (entries: IntersectionObserverEntry[]) => void) => (entries: IntersectionObserverEntry[]) => void,
) {
  drop([...root.querySelectorAll<Target>('[data-anim="drop"]')]);

  const targets: Target[] = [];
  root.querySelectorAll<Target>("[data-anim]").forEach((el) => {
    const kind = el.dataset.anim;
    if (kind === "drop") return;
    if (kind === "rows") {
      for (const child of el.children) {
        (child as Target).dataset.animRow = "";
        targets.push(child as Target);
      }
    } else targets.push(el);
  });

  const play = wrap((entries) => {
    const entering = entries
      .filter((entry) => entry.isIntersecting)
      .map((entry) => entry.target as Target)
      .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
    let cascade = 0;
    entering.forEach((el, index) => {
      observer.unobserve(el);
      const kind = "animRow" in el.dataset ? "row" : (el.dataset.anim ?? "");
      const own = el.dataset.delay;
      const delay = own !== undefined ? Number(own) : cascade;
      if (own === undefined) cascade += kind === "row" ? 0.05 : 0.08;
      players[kind]?.(el, delay, index);
    });
  });

  // Play a little after the top edge clears the bottom of the screen, so it is seen.
  const observer = new IntersectionObserver(play, { rootMargin: "0px 0px -6% 0px" });
  targets.forEach((el) => observer.observe(el));
  return () => observer.disconnect();
}

export { gsap };
