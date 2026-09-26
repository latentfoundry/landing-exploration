---
name: Afterflow
description: White editorial composition, expressive Solare headings, Novela reading text and selective bronze emphasis.
colors:
  paper: "#ffffff"
  paper-deep: "#f5f4f2"
  ink: "#171717"
  body: "#57534e"
  accent: "#946b53"
  accent-deep: "#77523d"
  line: "#e2dfdb"
  audience-paper: "#f8f7f4"
rounded:
  audience-card: "4px"
typography:
  display:
    fontFamily: "var(--font-solare), Georgia, serif"
    fontWeight: 300
    fontVariation: '"SRFF" 620'
  headline:
    fontFamily: "var(--font-solare), Georgia, serif"
    fontWeight: 350
    fontVariation: '"SRFF" 470'
  subhead:
    fontFamily: "var(--font-solare), Georgia, serif"
    fontWeight: 400
    fontVariation: '"SRFF" 300'
  body:
    fontFamily: "var(--font-novela), Georgia, serif"
    fontWeight: 400
    lineHeight: 1.65
---

# Design system

## Direction

An editorial site built around expressive typography, open white space and purposeful vector illustrations. Black carries the story; bronze marks a selected word, route or outcome. Fine rules separate chapters. Avoid decorative hero imagery, ambient glows, shadows and generic card grids. The audience chapter continues this light composition with pale paper cards, fine borders and generous spacing. Casa di Solare's specimen pages inform its expressive typography and restrained proportions.

`app/globals.css` is the source of truth for responsive values. Component stylesheets contain illustration and engine-specific rules.

## Typography and identity

Use Solare for headings, the wordmark and display metrics. Use Novela for prose, labels, controls and articles. Solare upright supports weight 200–900 and serif intensity (`SRFF`) 200–700; its italic supports weight only. Display text uses 300/620, section headings 350/470, subheadings 400/300 and the wordmark 400/450. Novela emphasis uses the supplied 600 weight and italic face; font synthesis is disabled.

The hero and final invitation are deliberately oversized. Body copy is generally 17–21px, with a 17px phone base. Illustration labels scale within their artwork and should remain subordinate to section headings. Keep animated word groups together and expose each heading's complete accessible name once.

Preserve the original mark geometry in `public/brand-mark.svg` and the black-on-white square favicons. The five active font files live in `assets/fonts/`; preserve the supplied formats and follow [font handling notes](assets/README.md).

## Layout and responsive rhythm

The shell is at most 1320px wide, with 64px desktop gutters, 40px below 1100px and 20px below 650px. Navigation becomes a mobile panel at 900px.

On desktop, the masthead stays visible through the opening section, marked with `data-header-stick`. Once that section leaves the viewport, downward scrolling hides it; upward scrolling or approaching the top edge with a mouse reveals it. A 500ms ease-out slide settles gently without a slow wind-up. On mobile layouts and touch devices, the masthead stays visible throughout scrolling, without a slide transition. Keyboard focus and an open menu also keep it visible. The scrolled masthead uses a white frosted-glass layer, with opaque fallbacks for unsupported browsers and reduced transparency.

Hero, introduction, each process step, audience, company vision and team experience are separate chapters. Their minimum height is `calc(100svh - var(--header-height) - 1px)`. Header heights are 96px on desktop, 76px below 900px, 72px below 650px and 56px on short screens. Centre each chapter's related content, but allow natural growth on short or zoomed viewports. Preserve ordinary scrolling without snap points or wheel trapping.

The hero centres its headline and “Book a demo” action as one group, with the arrow independently near the bottom. The introduction gets its own screen. “How it works” is a brief entry before the three process chapters. Process artwork stacks between heading and explanation below 700px and is capped at 480px wide.

The vision groups heading, loop and description. The team chapter groups heading, previous-experience logos and supporting sentence; research and governance follow separately. Phone team text is left-aligned, with two logo cells above three equal-height cells. FAQs show five core questions and a native expander for six more.

The audience chapter centres one card with neighbouring cards peeking into view. Cards are 600px wide with a 32px gap on desktop; below 900px they use the smaller of 560px or the viewport minus 80px, with a 24px gap. Below 650px they use the viewport minus 64px, with a 16px gap. The strip reserves the tallest card's height so cycling does not shift the controls or surrounding chapter.

## Illustrations and controls

- Process plates explain ranked initiatives, software build/deployment and forecast revision. Pale neutral fields support black structure and a bronze selection.
- Model uses a company context graph; Simulate uses many flowing possible futures; Build assembles software; Learn revises a forecast. The context graph belongs to Model alone.
- The company loop uses concentric elliptical paths, four stage labels and a bronze observed-results return around the mark.
- Illustration figures are conceptual examples, not customer outcomes. Use concise accessible names without verbose hover descriptions.
- Primary actions are square outlined “Book a demo” buttons with a black hover fill. Audience previous and next controls are fine outlined circles, with an unboxed pause control; all three have 44px targets. A separate group of five pagination dots has 44px-high targets, narrowed to 28px on phones. Preserve visible focus and meaningful link destinations.
- Audience cards use an opaque pale paper fill, 1px warm neutral borders and 4px corners on a white section. Their flat treatment has no gradient, shadow or blur. Neighbouring cards recede through reduced opacity while retaining the active card's scale. Solare headings use weight 350 and serif intensity 620 at 44px on desktop and 34px on phones, paired with Novela copy at 18px and 17px respectively. The shared ink, body and bronze colours maintain continuity with adjacent chapters.

## Motion and performance

Cascading letters, restrained reveals and diagram drawing support the reading sequence. Keep the existing slow Lenis scrolling. The four-stage engine pins one scene at a time, with labelled progress tied to actual scrolling and keyboard/previous/next controls. Cache geometry, avoid redundant DOM writes and pause frame work offscreen or in hidden tabs. Without JavaScript, all four stages remain readable in document order.

The audience carousel cycles infinitely every six seconds, settling over 650ms into a stable-height reading position. Pointer swipes follow the finger or mouse directly before settling; vertical scrolling and pinch zoom remain available. Previous/next buttons, arrow keys and five pagination buttons provide manual navigation. A persistent pause/resume control keeps automatic cycling stopped until resumed; temporary pauses apply offscreen, in hidden tabs and during hover, focus or touch. Only manual changes are announced. Without JavaScript, all five audience cards appear in document order. Reduced motion disables autoplay, track movement transitions, card opacity transitions and pagination transitions; the pause control is disabled when automatic cycling is unavailable. Across the site, reduced motion also disables drawing and smooth scrolling.

Keep essential copy server-rendered. Home-only illustration CSS should remain scoped to the homepage. Solare is preloaded for the hero; Novela uses normal font discovery. The shared social preview is `app/opengraph-image.png`, described in `lib/site.ts`.

Home, Insights and articles share `SiteHeader` and `SiteFooter`. Navigation labels and the demo CTA live in `lib/navigation.ts`; article closing actions use the same outlined button as the homepage. Research prose stays in Novela, with the shared Solare heading weights.
