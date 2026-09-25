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
typography:
  display:
    fontFamily: "var(--font-solare), Georgia, serif"
    fontWeight: 260
    fontVariation: '"SRFF" 620'
  headline:
    fontFamily: "var(--font-solare), Georgia, serif"
    fontWeight: 300
    fontVariation: '"SRFF" 470'
  subhead:
    fontFamily: "var(--font-solare), Georgia, serif"
    fontWeight: 350
    fontVariation: '"SRFF" 300'
  body:
    fontFamily: "var(--font-novela), Georgia, serif"
    fontWeight: 400
    lineHeight: 1.65
---

# Design system

## Direction

An editorial site built around expressive typography, open white space and purposeful vector illustrations. Black carries the story; bronze marks a selected word, route or outcome. Fine rules separate chapters. Avoid decorative hero imagery, ambient glows, shadows and generic card grids.

`app/globals.css` is the source of truth for responsive values. Component stylesheets contain illustration and engine-specific rules.

## Typography and identity

Use Solare for headings, the wordmark and display metrics. Use Novela for prose, labels, controls and articles. Solare upright supports weight 200–900 and serif intensity (`SRFF`) 200–700; its italic supports weight only. Display text uses 260/620, section headings 300/470, subheadings 350/300 and the wordmark 400/450. Novela emphasis uses the supplied 600 weight and italic face; font synthesis is disabled.

The hero and final invitation are deliberately oversized. Body copy is generally 17–21px, with a 17px phone base. Illustration labels scale within their artwork and should remain subordinate to section headings. Keep animated word groups together and expose each heading's complete accessible name once.

Preserve the original mark geometry in `public/brand-mark.svg` and the black-on-white square favicons. The five active font files live in `assets/fonts/`; preserve the supplied formats and follow [font handling notes](assets/README.md).

## Layout and responsive rhythm

The shell is at most 1320px wide, with 64px desktop gutters, 40px below 1100px and 20px below 650px. Navigation becomes a mobile panel at 900px.

The masthead stays visible through the opening section, marked with `data-header-stick`. Once that section leaves the viewport, downward scrolling hides it; upward scrolling or approaching the top edge with a mouse reveals it. A 500ms ease-out slide settles gently without a slow wind-up. Keyboard focus and an open menu keep it visible. The scrolled masthead uses a white frosted-glass layer, with opaque fallbacks for unsupported browsers and reduced transparency.

Hero, introduction, each process step, audience, company vision and team experience are separate chapters. Their minimum height is `calc(100svh - var(--header-height) - 1px)`. Header heights are 96px on desktop, 76px below 900px, 72px below 650px and 56px on short screens. Centre each chapter's related content, but allow natural growth on short or zoomed viewports. Preserve ordinary scrolling without snap points or wheel trapping.

The hero centres its headline and “Book a demo” action as one group, with the arrow independently near the bottom. The introduction gets its own screen. “How it works” is a brief entry before the three process chapters. Process artwork stacks between heading and explanation below 700px and is capped at 480px wide.

The vision groups heading, loop and description. The team chapter groups heading, previous-experience logos and supporting sentence; research and governance follow separately. Phone team text is left-aligned, with two logo cells above three equal-height cells. FAQs show five core questions and a native expander for six more.

## Illustrations and controls

- Process plates explain ranked initiatives, software build/deployment and forecast revision. Pale neutral fields support black structure and a bronze selection.
- Model uses a company context graph; Simulate uses many flowing possible futures; Build assembles software; Learn revises a forecast. The context graph belongs to Model alone.
- The company loop uses concentric elliptical paths, four stage labels and a bronze observed-results return around the mark.
- Illustration figures are conceptual examples, not customer outcomes. Use concise accessible names without verbose hover descriptions.
- Primary actions are square outlined “Book a demo” buttons with a black hover fill. Audience controls are 48px outlined circles. Preserve visible focus and meaningful link destinations.

## Motion and performance

Cascading letters, restrained reveals and diagram drawing support the reading sequence. Keep the existing slow Lenis scrolling. The four-stage engine pins one scene at a time, with labelled progress tied to actual scrolling and keyboard/previous/next controls. Cache geometry, avoid redundant DOM writes and pause frame work offscreen or in hidden tabs. Without JavaScript, all four stages remain readable in document order.

The audience carousel cycles every six seconds with a stable-height sliding transition. It pauses offscreen, in hidden tabs and during hover, focus or touch; manual controls support keyboard and swipe. Only manual changes are announced. Reduced motion disables autoplay, drawing, spatial transitions and smooth scrolling.

Keep essential copy server-rendered. Home-only illustration CSS should remain scoped to the homepage. Solare is preloaded for the hero; Novela uses normal font discovery. The shared social preview is `app/opengraph-image.png`, described in `lib/site.ts`.
