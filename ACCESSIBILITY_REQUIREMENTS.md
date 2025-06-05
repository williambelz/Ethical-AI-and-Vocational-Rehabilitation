# Accessibility Requirements (WCAG 2.2) for “Ethical AI in Vocational Rehabilitation” Website

> **Filename:** `ACCESSIBILITY_REQUIREMENTS.md`  
> **Location:** Project root (or under `docs/accessibility/` so that Codex and CI pipelines can index it).

---

## Table of Contents

1. [Scope & Purpose](#scope--purpose)  
2. [Target WCAG Level](#target-wcag-level)  
3. [WCAG 2.2 Success Criteria & Implementation Notes](#wcag 22-success-criteria--implementation-notes)  
   - [1. Perceivable](#1-perceivable)  
     - [1.1 Text Alternatives (1.1.1)](#11-text-alternatives-111)  
     - [1.2 Time-based Media (1.2.x)](#12-time-based-media-12x)  
     - [1.3 Adaptable (1.3.x)](#13-adaptable-13x)  
     - [1.4 Distinguishable (1.4.x)](#14-distinguishable-14x)  
   - [2. Operable](#2-operable)  
     - [2.1 Keyboard Accessible (2.1.x)](#21-keyboard-accessible-21x)  
     - [2.2 Enough Time (2.2.x)](#22-enough-time-22x)  
     - [2.3 Seizures & Physical Reactions (2.3.1)](#23-seizures--physical-reactions-231)  
     - [2.4 Navigable (2.4.x)](#24-navigable-24x)  
   - [3. Understandable](#3-understandable)  
     - [3.1 Readable (3.1.x)](#31-readable-31x)  
     - [3.2 Predictable (3.2.x)](#32-predictable-32x)  
     - [3.3 Input Assistance (3.3.x)](#33-input-assistance-33x)  
   - [4. Robust](#4-robust)  
     - [4.1 Compatible (4.1.x)](#41-compatible-41x)  
4. [General Implementation Guidelines](#general-implementation-guidelines)  
   - [Color Contrast & Visual Design](#color-contrast--visual-design)  
   - [Semantic HTML & Landmark Roles](#semantic-html--landmark-roles)  
   - [Keyboard Focus & Navigation Order](#keyboard-focus--navigation-order)  
   - [ARIA & Accessible Rich Internet Applications](#aria--accessible-rich-internet-applications)  
   - [Forms, Labels & Error Handling](#forms-labels--error-handling)  
   - [Media (Audio/Video) & Transcripts/Captions](#media-audiovideo--transcriptscaptions)  
   - [PDF/Downloadable Resources](#pdfdownloadable-resources)  
   - [Internationalization & Language Tags](#internationalization--language-tags)  
5. [Automated Testing & CI Integration](#automated-testing--ci-integration)  
6. [Manual Testing & Validation](#manual-testing--validation)  
7. [Coding Conventions & Linting](#coding-conventions--linting)  
8. [Browser & Assistive Technology Support Matrix](#browser--assistive-technology-support-matrix)  
9. [References & Further Reading](#references--further-reading)  

---

## Scope & Purpose

This document enumerates all accessibility requirements needed to ensure full compliance with **WCAG 2.2**, targeting at least **Level AA**, for every page and component in the “Ethical AI in Vocational Rehabilitation” website. Codex (GPT-powered code assistant) and any automated tools (e.g., linters, CI scripts) should index these requirements, and developers must reference them when:
- Writing or editing Markdown/MDX content.  
- Creating React components, custom UI widgets, or dynamic content.  
- Adding new pages, diagrams, or media assets.  

All new code—HTML, CSS, JavaScript/React—must satisfy the relevant success criteria listed below. If any criterion is not applicable, document the rationale in a `WCAG_EXCEPTIONS.md` file.

---

## Target WCAG Level

- **Minimum Compliance Level:** Level AA (per WCAG 2.2).  
- **Aspirational Compliance Level:** Level AAA for select pages (e.g., “About,” “Community Standards,” “Case Studies”), where feasible.  
- **Documentation:** Every SC (Success Criterion) below is annotated with its WCAG 2.2 reference number, level (A/AA/AAA), and a note about how to implement or test it.  

---

## WCAG 2.2 Success Criteria & Implementation Notes

### 1. Perceivable

#### 1.1 Text Alternatives (1.1.1) – Level A
- **Requirement:** Provide a meaningful `alt` attribute for every `<img>`, `<svg>`, or decorative image.  
  - **Codex Note:**  
    - If an image is decorative (no semantic value), use `alt=""`.  
    - If an image conveys content (e.g., a diagram of an AI-powered vocational assessment dashboard), write a concise but descriptive `alt` (e.g., `alt="Diagram of AI-driven vocational assessment flowchart showing intake, matching, and feedback loops"`).  
    - For complex images (charts, infographics), provide a longer textual description in:
      1. A `<figcaption>` element.  
      2. Or a linked “long description” page (e.g., `<a href="/descriptions/vr-dashboard-longdesc.html">Long description</a>`).  
- **WCAG 2.2 Reference:** 1.1.1 (Text Alternatives) :contentReference[oaicite:0]{index=0}

#### 1.2 Time-based Media (1.2.x)

##### 1.2.2 Captions (Pre-recorded) – Level A
- **Requirement:** Every pre-recorded video must have synchronized captions.  
  - **Codex Note:**  
    - Use standard WebVTT (`.vtt`) or SRT captions.  
    - Reference the captions via `<track kind="captions" src="/media/captions/video-name-en.vtt" srclang="en" label="English" />`.  
- **WCAG 2.2 Reference:** 1.2.2 :contentReference[oaicite:1]{index=1}

##### 1.2.4 Audio Description or Media Alternative (Pre-recorded) – Level AA
- **Requirement:** Provide audio descriptions (or text alternatives) for essential visual information in pre-recorded videos.  
  - **Codex Note:**  
    - If a video has critical on-screen text or visual demonstration (e.g., “AI-based assistive robot demo”), either embed audio description track or supply a full-text transcript with descriptive cues.  
- **WCAG 2.2 Reference:** 1.2.4 :contentReference[oaicite:2]{index=2}

##### 1.2.5 Audio Description (Pre-recorded) – Level AA
- **Requirement:** Alternate audio track with audio description synchronized with the video if providing within the same media.  
  - **Codex Note:**  
    - If using YouTube embed, enable “audio description” track if available or upload an AD track in VTT.  
- **WCAG 2.2 Reference:** 1.2.5 :contentReference[oaicite:3]{index=3}

#### 1.3 Adaptable (1.3.x)

##### 1.3.1 Info and Relationships – Level A
- **Requirement:** Use proper HTML markup so that relationships (e.g., headings, lists, tables) are programmatically determinable.  
  - **Codex Note:**  
    - Always use `<h1>`–`<h6>` in correct hierarchical order; do not skip levels.  
    - Use `<ul>`/`<ol>` for lists; use `<th>` for table headings; use `<section>`, `<article>`, `<nav>`, `<aside>`, `<main>` to define landmark regions.  
- **WCAG 2.2 Reference:** 1.3.1 :contentReference[oaicite:4]{index=4}

##### 1.3.2 Meaningful Sequence – Level A
- **Requirement:** Ensure that content order in DOM matches reading order.  
  - **Codex Note:**  
    - Do not rely on CSS `position:absolute` to reorder content; maintain logical HTML structure (source order).  
    - For complex layouts (e.g., sidebar + main content), use CSS Grid/Flexbox without altering source order—use CSS only for visual arrangement.  
- **WCAG 2.2 Reference:** 1.3.2 :contentReference[oaicite:5]{index=5}

##### 1.3.3 Sensory Characteristics – Level A
- **Requirement:** Do not rely on shape, size, visual location, orientation, or sound alone to convey meaning.  
  - **Codex Note:**  
    - If an error state is indicated by red text only, also include an icon or ARIA role (e.g., `<span role="alert">`).  
    - If instructional content says “click the red button,” also include the button’s name or role (e.g., “click the ‘Submit Application’ button”).  
- **WCAG 2.2 Reference:** 1.3.3 :contentReference[oaicite:6]{index=6}

#### 1.4 Distinguishable (1.4.x)

##### 1.4.1 Use of Color – Level A
- **Requirement:** Do not use color as the only visual means to convey information.  
  - **Codex Note:**  
    - If required fields are shown in red, also append an asterisk (`*`) or text label (“Required”).  
    - Ensure links have either underlines or distinct styling beyond color.  
- **WCAG 2.2 Reference:** 1.4.1 :contentReference[oaicite:7]{index=7}

##### 1.4.3 Contrast (Minimum) – Level AA
- **Requirement:** Text (including images of text) must have contrast ratio ≥ 4.5:1 (normal) or ≥ 3:1 (large text ≥ 18 pt or 14 pt bold).  
  - **Codex Note:**  
    - Use automated color-contrast tools (e.g., axe-core, pa11y, Chrome DevTools LightHouse).  
    - Update Tailwind theme or custom CSS variables to ensure all primary text and background combinations meet ratio.  
    - Include tests in CI: e.g., `axe-core` accessibility assertion for “contrast.”  
      - The current site uses a dark theme (black background with white text) providing 21:1 contrast.
- **WCAG 2.2 Reference:** 1.4.3 :contentReference[oaicite:8]{index=8}

##### 1.4.4 Resize Text – Level AA
- **Requirement:** Text can be resized up to 200% without loss of content or functionality.  
  - **Codex Note:**  
    - Avoid fixed pixel (`px`) font sizes; use `rem`/`em`.  
    - Do not disable browser zoom or pinch-to-zoom.  
- **WCAG 2.2 Reference:** 1.4.4 :contentReference[oaicite:9]{index=9}

##### 1.4.5 Images of Text – Level AA
- **Requirement:** Use text rather than images of text, except where essential (e.g., brand logos).  
  - **Codex Note:**  
    - If using a logo with text, ensure high-resolution SVG and provide `alt` text.  
- **WCAG 2.2 Reference:** 1.4.5 :contentReference[oaicite:10]{index=10}

##### 1.4.10 Reflow – Level AA (New in WCAG 2.2)
- **Requirement:** Content must reflow (no horizontal scrolling) in two scenarios:  
  1. Viewport width ≤ 640 CSS px.  
  2. Viewport width ≤ 400 CSS px.  
  - **Codex Note:**  
    - Use responsive layouts: CSS Grid/Flexbox with `flex-wrap: wrap;`.  
    - Avoid fixed-width containers; use `max-width: 100%`.  
    - Test with Chrome DevTools in device emulation for widths at 320px, 375px, 414px, 767px.  
- **WCAG 2.2 Reference:** 1.4.10 :contentReference[oaicite:11]{index=11}

##### 1.4.11 Non-text Contrast – Level AA (New in WCAG 2.2)
- **Requirement:** Visual presentation of user interface components and graphical objects must have contrast ratio ≥ 3:1 against adjacent colors.  
  - **Codex Note:**  
    - Buttons, form controls, focus indicators, icons (non-text elements) must have sufficient contrast.  
    - Example: A “Submit” button’s border against its background must meet 3:1.  
- **WCAG 2.2 Reference:** 1.4.11 :contentReference[oaicite:12]{index=12}

##### 1.4.12 Text Spacing – Level AA (New in WCAG 2.2)
- **Requirement:** The user must be able to override line height (≥ 1.5), paragraph spacing (≥ 2 em), letter spacing (≥ 0.12 em), and word spacing (≥ 0.16 em) without loss of content or functionality.  
  - **Codex Note:**  
    - Do not set properties such that they cannot be overridden by user agent or custom CSS (e.g., avoid `!important`).  
    - Use relative units (`em`, `rem`).  
    - Test by injecting custom CSS in browser dev tools to confirm spacing adjustments.  
- **WCAG 2.2 Reference:** 1.4.12 :contentReference[oaicite:13]{index=13}

##### 1.4.13 Content on Hover or Focus – Level AA (New in WCAG 2.2)
- **Requirement:** Additional content that appears on hover or focus can be dismissed, remains visible until dismissed, does not obscure other content, and is positioned adjacent to the trigger.  
  - **Codex Note:**  
    - For tooltips/popovers:  
      - Ensure they’re accessible by keyboard (focusable trigger).  
      - Use `aria-describedby` to associate tooltip content.  
      - Provide a clos
