---
name: Afterflow
description: Orbital operations cinema for consequential organisational simulation.
colors:
  ground-deep: "#070809"
  page-ground: "#0a0a0a"
  world-surface: "#11141a"
  world-surface-soft: "rgba(17, 20, 26, 0.78)"
  brand-tile: "#e8f2f3"
  evidence-white: "#f0f2f5"
  model-grey: "#a5a8ae"
  quiet-grey: "#858a92"
  diagram-text: "#dce3e5"
  diagram-muted: "#aab7ba"
  diagram-quiet: "#89979a"
  diagram-accent: "#91d8cc"
  diagram-warm: "#bca98f"
  signal-cyan: "#0bd3b6"
  signal-cyan-bright: "#35ead0"
  signal-ink: "#031a17"
  structural-line: "rgba(240, 244, 248, 0.14)"
  structural-line-strong: "rgba(240, 244, 248, 0.23)"
typography:
  display:
    fontFamily: "var(--font-strawford), sans-serif"
    fontSize: "clamp(3rem, 3.9vw, 3.5rem)"
    fontWeight: 300
    lineHeight: 1
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "var(--font-strawford), sans-serif"
    fontSize: "clamp(2rem, 2.5vw, 2.25rem)"
    fontWeight: 300
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  editorial-title:
    fontFamily: "var(--font-strawford), sans-serif"
    fontSize: "clamp(1.5rem, 2.3vw, 2.1rem)"
    fontWeight: 300
    lineHeight: 1.15
    letterSpacing: "-0.026em"
  component-title:
    fontFamily: "var(--font-strawford), sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    letterSpacing: "-0.016em"
  body:
    fontFamily: "var(--font-strawford), sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  body-reading:
    fontFamily: "var(--font-strawford), sans-serif"
    fontSize: "1.04rem"
    fontWeight: 400
    lineHeight: 1.78
    letterSpacing: "normal"
  label:
    fontFamily: "var(--font-strawford), sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    letterSpacing: "normal"
  compact-data:
    fontFamily: "var(--font-strawford), sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "normal"
  action:
    fontFamily: "var(--font-strawford), sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    letterSpacing: "normal"
rounded:
  frame: "0px"
  brand-mark: "7px"
  utility: "8px"
  pill: "999px"
  circle: "50%"
spacing:
  inline-tight: "7px"
  micro: "8px"
  compact: "14px"
  control: "18px"
  panel: "20px"
  gutter: "24px"
  panel-large: "30px"
  layout-gap: "48px"
  heading-gap: "72px"
components:
  button-primary:
    backgroundColor: "{colors.signal-cyan}"
    textColor: "{colors.signal-ink}"
    typography: "{typography.action}"
    rounded: "{rounded.pill}"
    padding: "0 21px"
    height: "50px"
  button-primary-hover:
    backgroundColor: "{colors.signal-cyan-bright}"
    textColor: "{colors.signal-ink}"
    typography: "{typography.action}"
    rounded: "{rounded.pill}"
    padding: "0 21px"
    height: "50px"
  button-primary-large:
    backgroundColor: "{colors.signal-cyan}"
    textColor: "{colors.signal-ink}"
    typography: "{typography.action}"
    rounded: "{rounded.pill}"
    padding: "0 25px"
    height: "56px"
  button-header:
    backgroundColor: "{colors.signal-cyan}"
    textColor: "{colors.signal-ink}"
    rounded: "{rounded.pill}"
    padding: "0 17px"
    height: "44px"
  button-text:
    backgroundColor: "transparent"
    textColor: "#c4c8cc"
    rounded: "{rounded.frame}"
    padding: "0"
    height: "48px"
  tab-structural:
    backgroundColor: "rgba(12, 15, 20, 0.36)"
    textColor: "#9fa3a9"
    rounded: "{rounded.frame}"
    padding: "0 18px"
    height: "72px"
  tab-structural-active:
    backgroundColor: "rgba(24, 37, 39, 0.52)"
    textColor: "{colors.evidence-white}"
    rounded: "{rounded.frame}"
    padding: "20px 18px"
  world-frame:
    backgroundColor: "{colors.ground-deep}"
    textColor: "{colors.evidence-white}"
    rounded: "{rounded.frame}"
    padding: "0"
---

# Design System: Afterflow

## Overview

**Creative North Star: "Operational Futures Cinema."**

Operational Futures Cinema makes Afterflow feel like an entire institution made testable before commitment. A full-bleed, film-grained decision landscape turns one deliberate approach into three visible futures across monumental terrain; sparse Strawford copy keeps the experience precise and high-trust.

The system is structurally layered and nearly shadowless. Image planes, translucent graphite fields, cool hairlines, clipping, atmospheric overlays, and restrained cyan glow create depth. Components are severe and framed; pill geometry belongs only to actions and status nodes.

This is the project-wide marketing and editorial visual system. The landing page's current narrative sequence is one surface expression, not a reusable site-wide template.

**Key Characteristics:**

- Consequential, cinematic, precise, sparse, and operational rather than dashboard-like.
- One dominant world image or model plate per major moment.
- Evidence White and Model Grey type over Operational Black and Graphite fields.
- Signal Cyan reserved for actions, status, causality, and focus.
- Strawford light display typography balanced by compact medium labels.
- Concept imagery and marks are identified through context rather than defensive microcopy.

## Colors

The palette is a narrow operational spectrum: deep blue-black and graphite carry the world, cool whites and greys carry evidence, and cyan identifies consequential state.

### Primary

- **Signal Cyan** (`#0bd3b6`): Primary actions, selected rails, causal paths, active nodes, and rare live status.
- **Signal Cyan Bright** (`#35ead0`): Hover, keyboard focus, and compact high-clarity accents.
- **Signal Ink** (`#031a17`): Dark text placed on filled cyan actions.

### Neutral

- **Ground Deep / Operational Black** (`#070809`): The deepest reusable scene shade, full-bleed scene ground, and clipped world frames.
- **Page Ground** (`#0a0a0a`): The neutral off-black default page field.
- **World Surface / Graphite** (`#11141a`): Raised structural fields and operational modules.
- **World Surface Soft** (`rgba(17, 20, 26, 0.78)`): Translucent graphite over image planes.
- **Brand Tile** (`#e8f2f3`): The compact light field behind the supplied mark in footer and embedded-product lockups; the over-image header mark is unframed white.
- **Evidence White** (`#f0f2f5`): Headings, primary copy, and high-confidence interface text.
- **Model Grey** (`#a5a8ae`): Explanations, supporting evidence, and descriptive copy.
- **Quiet Grey** (`#858a92`): Metadata, dates, disclosures, and low-priority navigation.
- **Diagram Text** (`#dce3e5`), **Diagram Muted** (`#aab7ba`), and **Diagram Quiet** (`#89979a`): A three-step accessible text ramp for operational illustrations; even the quiet step remains above 4.5:1 on diagram surfaces.
- **Diagram Accent** (`#91d8cc`): Readable cyan-adjacent illustration copy where Signal Cyan would be too emissive.
- **Diagram Warm** (`#bca98f`): Guardrail and variance evidence; reserved for measured divergence rather than general decoration.
- **Structural Line** (`rgba(240, 244, 248, 0.14)`): Default dividers and grid boundaries.
- **Structural Line Strong** (`rgba(240, 244, 248, 0.23)`): Outer frames, tab rails, and important boundaries.

**The Signal Rarity Rule.** Cyan identifies action, status, causality, or focus; it never becomes ambient decoration or a broad surface fill.

**The Dark Field Rule.** Operational Black and Graphite remain visibly distinct; depth is built from their tonal steps rather than generic elevated cards.

## Typography

**Display Font:** Strawford (with sans-serif fallback)
**Body Font:** Strawford (with sans-serif fallback)
**Label Font:** Strawford (with sans-serif fallback)

**Character:** One self-hosted humanist family moves between cinematic scale and operational precision. Light weight creates consequence without spectacle; regular and medium weights make evidence, controls, and disclosures direct.

### Hierarchy

- **Display** (300, `clamp(3rem, 3.9vw, 3.5rem)`, 1): Hero promises. Compact viewports use `2.5rem` at 1.2 line-height.
- **Headline** (300, `clamp(2rem, 2.5vw, 2.25rem)`, 1.1): Major marketing statements. Compact viewports use `2rem`; editorial route titles retain their larger reading scale.
- **Outcome** (300–400, `1.5rem`, 1–1.2): Comparison shifts, resolved metrics, and other singular outcomes. It is deliberately smaller than a major heading.
- **Narrative Step** (400, `1.25rem`, 1.2): Model / Simulate / Calibrate chapter titles and comparison leads at both wide and compact sizes.
- **Editorial Title** (300, `clamp(1.5rem, 2.3vw, 2.1rem)`, 1.15): Insight and article-row titles.
- **Component Title** (400, `1.04rem`): Feature, step, and structural module titles.
- **Body** (400, `1rem`, 1.6): Section introductions and explanatory marketing copy.
- **Reading Body** (400, `1.04rem`, 1.78): Long-form editorial copy constrained to 70ch.
- **Support** (400–500, `0.875rem`): Comparison detail, provenance, component copy, and secondary values.
- **Compact Data** (400–500, `0.8125rem`): Dense illustration values, legends, and progress states on compact screens. It is never used for narrative copy.
- **Label** (500, `0.75rem`): Status labels and compact metadata. Twelve pixels is the absolute visible floor; labels are not shrunk to make a dense composition fit.
- **Action** (500, `0.875rem`): Primary action and interactive illustration copy. Interactive targets stay at least 44px high.

Illustrations use the same roles as the page: labels are at least 12px, readable copy and controls are 14px, and resolved outcomes are 24px. Containers grow to preserve internal clearance before type is reduced. When the available illustration width cannot preserve that floor, the composition switches to its compact information hierarchy, uses shorter equivalent operational labels, and removes non-essential relationship or role text rather than scaling the interface down.

**The Strawford Authority Rule.** Strawford 300 carries scale, Strawford 400 carries explanation, and Strawford 500 carries action or certainty; do not introduce a decorative display face or a technical mono wall.

## Layout

The shared shell is capped at 1128px. Its side gutters are 24px on wide screens, 18px at 900px and below, and 16px at 640px and below. The transparent 64px header is positioned over the opening image plane and scrolls away with the hero; below 900px it becomes a 68px compact navigation whose open state expands into one full-viewport decision field behind the unchanged brand and close control.

Marketing sections use long vertical intervals: the primary mechanism and feature fields run from 180px top padding to 210px bottom padding, while the comparison field uses 170px/190px and the insights field uses 155px/175px. Below 900px, primary sections contract to roughly 130px/145–150px; below 640px, they settle near 108px/118–122px. Most section headings use a wide statement/support split, then collapse to one column before content grids reflow. The How it works introduction keeps its explanation directly beneath the heading as one reading unit before the transformation story begins.

The principal patterns are full-bleed image planes, a 1280px transformation story with a pinned chapter rail, severe attached grids, and hairline-separated editorial rows. Model, Simulate, and Calibrate remain complete chapters in normal page flow; only their compact left rail stays visible while the right-hand copy and concept frames scroll. Below 1024px the rail disappears and its labels move into the stacked chapters. Feature fields move from three to two columns, while the comparison table becomes three attached criterion bands with the two approaches paired inside each band. At 640px, each comparison pair stacks vertically without becoming detached cards. Editorial reading stays within 70ch.

**The Surface-Bound Story Rule.** Reuse the shell, image-plane hierarchy, structural rails, and spacing rhythm across marketing and editorial surfaces; do not copy the landing page's narrative order into unrelated routes.

## Elevation & Depth

The system is structurally layered and nearly shadowless. Full-bleed raster atmosphere, dark tonal fields, translucent washes, hairlines, clipping, saturation shifts, and parallax establish depth. Shadows appear only as localized cyan energy around an action, status point, orbit, or active path.

### Shadow Vocabulary

- **Primary Action Glow** (`0 15px 38px -22px rgba(14, 226, 193, 0.72), inset 0 1px 0 rgba(230, 255, 252, 0.34)`): The filled signal action's restrained light pool and top highlight.
- **Status Spark** (`0 0 9px rgba(11, 211, 182, 0.6)`): A five-pixel illustrative or live-status node.
- **Orbit Signal** (`0 12px 42px -22px rgba(11, 211, 182, 0.8)`): The innermost world-model ring only.
- **Active Path Glow** (`drop-shadow(0 5px 8px rgba(11, 211, 182, 0.3))`): A restrained filter on a selected path inside an illustration.

**The Structural Depth Rule.** Image planes, tonal fields, transparency, clipping, and hairlines do the structural work; cyan glows communicate state and never make containers float.

## Shapes

The default structural silhouette is square and severe (0px): frames, feature cells, comparison bands, editorial rails, and mobile menus meet at hard edges. Footer and embedded-product brand tiles alone use a compact 7px radius; the header mark is unframed. The skip utility uses 8px. A normative 999px capsule is reserved for actions and status controls; true circles belong to nodes, step indices, rings, and status points.

**The Severe Frame Rule.** Keep information architecture rectilinear and attached; never soften world frames, grids, or editorial rows into rounded card stacks.

## Components

### Buttons

- **Primary signal action:** A 50px cyan capsule with 21px inline padding, dark Signal Ink copy, a fine pale-cyan border, and the Primary Action Glow. The large closing action is 56px tall with 25px inline padding.
- **Header action:** A compact 44px cyan capsule with 17px inline padding.
- **Text action:** A 48px transparent action with pale grey text, a low hairline, and a directional arrow.
- **Hover / focus / active:** Cyan brightens on hover and the control moves up 1px; active moves down 1px. Keyboard focus is a 2px Signal Cyan Bright outline with a 4px offset. The animated gloss and transforms disappear when reduced motion is requested.
- **Directional feedback:** Action arrows travel two pixels toward their destination while the Vengeance gloss crosses the primary capsule. This is reserved for real actions, not decorative labels.

### Cards / Containers

- **Corner Style:** Square (0px) for all structural frames and cells.
- **Background:** Operational Black for image frames; translucent Graphite for modules over the field.
- **Shadow Strategy:** No generic card shadow; use the localized signal vocabulary only.
- **Border:** One-pixel Structural Line or Structural Line Strong.
- **Internal Padding:** 20–30px in operational modules; attached rows keep padding inside one shared frame.

### Navigation

The navigation is a transparent, borderless 64px overlay that belongs to the opening image and leaves the viewport after the hero on wide screens. The supplied mark renders white without a tile so it belongs to the image plane; 16px links use compact spacing and reveal a one-pixel cyan underline on hover or focus. Below 900px, the compact header stays available on the long page and gains a near-black blurred field after scrolling only while the menu is closed. Its 44px circular trigger opens a square-edged, full-viewport decision field that continues behind the header, pairs a darkened incumbent world image with grain, and presents four large hairline-separated links plus the signal action. The field resolves in one top-down structural sweep, followed by a restrained blur-and-rise link sequence; closing reverses more quickly, and reduced-motion users receive the complete open or closed state immediately.

### Transformation Scroll Story

The landing-page mechanism follows a three-state sequence: Model, Simulate, Calibrate. On wide screens only the compact left rail is sticky; every right-hand chapter, explanation, and concept frame remains in normal document flow. The active rail state follows the chapter crossing the reading band, and rail controls move directly to the corresponding chapter. The surface is a disclosed product concept, not a screenshot or customer result, and keeps observed, modelled, and unknown evidence visually distinct. On narrow screens the rail is removed and every chapter carries its own visible label.

The Simulate plate reads left to right from the organisation as it works today to a proposed decision, then shows the knock-on effects before branching into three equally presented, unranked possible futures. An attached impact rail keeps teams, operations, customers, and outcomes visible. The interface deliberately hides the simulation machinery: marketing explains what the visitor can see and decide, not which methods run underneath. Below 640px, the four stages become a two-by-two sequence without dropping effect or future labels.

The calibration story closes with a retrospective incident replay. Three attached steps establish the same evidence, the same test, and the check against reality; attached score rows then show the supplied 93% Afterflow and 36% GPT-5.5 baseline results. The illustrated operational values remain explicitly labelled as examples.

The story's motion comes from ordinary page movement rather than repeated content replacement. The rail marker uses scale rather than width animation; reduced motion makes chapter navigation immediate while preserving the same content order.

### World-Model Frame

The reusable signature is a clipped decision-landscape image plane with a dark atmospheric wash, thin cool frame, one incoming path, and three physically embedded future routes. Route light stays embedded in the photographed terrain rather than becoming a HUD. Its imagery moves more slowly than the page when motion is allowed; the frame remains fully legible when static.

### Social Preview

The shipping root Open Graph image (`app/opengraph-image.png`) is a static 1200×630 composite of the existing decision-ridge asset, not a separate campaign world. The exact white Afterflow lockup sits in the upper-left safe zone; the Evidence White Strawford Light promise “Your sandbox for / operational decisions.” is centered across the lower third. A near-black atmospheric wash, edge vignette, and restrained film grain preserve legibility while the central figure and all branching paths remain visible. Keep the established 52px top and 60px side clearance, omit support copy, actions, generic SaaS chrome, and unverified proof, and use this same PNG for large Twitter/X previews. Its embedded `impeccable:prompt` text chunk records the source image, supplied mark, font files, crop, composite treatment, and absence of new generated imagery or invented claims.

### Consulting Comparison

The landing comparison is one semantic table inside a severe shared frame. Speed, portfolio cost, and retained ownership each contrast a consulting engagement with Afterflow; the Afterflow column carries one continuous cyan signal rail, while the closing row compresses the story from months to days. Column headers use the Component Title role. Each Afterflow value has a meaning-specific line symbol: time for speed, layered evidence for portfolio reuse, and a key for retained ownership. The table reveals once in reading order and resolves in roughly the same time as the transformation illustrations. Below 900px, each criterion becomes an attached band with both approaches visible together; below 640px the pair stacks vertically with explicit Support Copy column labels and no horizontal scrolling. Reduced-motion users receive the complete final state immediately.

### Feature and Editorial Rails

Capabilities live in attached three-column framed cells with line glyphs and a short cyan hover edge, collapsing to two and then one column. Insights remain hairline-separated rows with metadata, title, read time, and a small directional arrow; they never become detached cards.

### Experience Evidence

Five contributor-experience marks sit in a structural rail labelled “Experience behind Afterflow.” They represent prior experience, never customers, clients, partners, or endorsements. Each approved lockup remains intact and receives the same one-shot surface reveal as its cell; trademark artwork is never split into characters or given a competing animation. Product surfaces and generated operational imagery retain their provenance in source metadata while illustrative values receive one clear contextual label.

### Text Motion and Counters

The opening image pulls from 1.05 scale to rest over two seconds while the promise and supporting sentence remain immediately visible; above-the-fold meaning never waits for hydration or an entrance delay. Below the fold, major headings and explanatory lines resolve as single semantic spans from restrained blur and opacity; image frames, structural cells, and rows reveal once as grouped surfaces. Content remains visible when JavaScript is unavailable, and animation filters are cleared after each reveal settles. Reduced-motion users receive every final text, surface, image, and trace immediately.

**The Embedded Evidence Rule.** Controls, status, labels, and paths belong to the world model or a shared structural rail; do not assemble a floating widget library over the scene.

**The Provenance Rule.** Generated operational imagery retains provenance in its source asset; contextual framing should do the work without repetitive interface disclaimers.

## Do's and Don'ts

### Do:

- Do let one consequential world image or model plate dominate each major visual moment.
- Do use Evidence White for primary meaning, Model Grey for explanation, and Quiet Grey for metadata.
- Do reserve Signal Cyan for actions, status, causality, selected state, and visible focus.
- Do preserve square frames, one-pixel hairlines, and attached rails as the default component grammar.
- Do retain keyboard access, readable static states, and reduced-motion fallbacks for every causal or parallax interaction.
- Do keep contributor-experience marks distinct from customer proof and preserve generated-image provenance in source metadata.

### Don't:

- Don't lead a marketing surface with a dashboard, stacked product screenshots, or a wall of floating SaaS cards.
- Don't use 999px pills for containers, feature cells, tabs, or editorial rows; pills are for actions and status nodes.
- Don't add generic drop shadows, broad cyan surface fills, or decorative glow without operational meaning.
- Don't fabricate customer marks, testimonials, benchmarks, or validated outcomes.
- Don't strip provenance from generated operational imagery or compensate for weak context with repetitive disclaimer copy.
- Don't universalize the landing page's see-world-to-book sequence; compose each route for its own job.
