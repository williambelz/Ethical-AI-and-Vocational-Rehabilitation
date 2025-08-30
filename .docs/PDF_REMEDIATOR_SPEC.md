# Specification: PDF A11y Remediator

Spec-Version: 1.0.0
Last-Updated: 2025-08-30
Owner: William Belz (VR A11y Ops)
Repo: TBD

> SLUG: **PDF_REMEDIATOR** (used for IDs)

---

## 1. Intent & Values

**Problem:** Staff publish PDFs that are not consistently **WCAG 2.1 AA / Section 508 / Texas TAC 206–213** conformant. Manual remediation is slow and inconsistent, and many source files are unavailable. A deterministic pipeline is needed to **analyze, (re)tag, and validate** PDFs with strong auditability and minimal human effort, while preserving original content fidelity.

**Primary Users & Contexts:**

* VR staff and program teams preparing public-facing PDFs.
* Accessibility reviewers performing pre-publication audits.
* Records/compliance staff tracking conformance over time.

**Values to Preserve:**

* Accessibility (WCAG 2.1 AA; PDF/UA where feasible).
* Accuracy & Fidelity (no unintended text/content changes).
* Privacy & Security (PII minimization; approved storage; audit trail).
* Efficiency (low friction; predictable SLAs).
* Traceability (machine-readable reports; reproducible runs).
* Cost awareness (bounded runtime/compute).

**Non-Goals:**

* Redesigning layout or changing policy content (beyond structure/metadata/artifacts).
* Authoring net-new content except alt text/captions/labels.
* Guaranteeing color-contrast fixes in embedded images (flag only).

---

## 2. Scope

**In Scope:**

* Ingest existing PDFs (born-digital and scanned).
* Detect/repair **tag tree**: headings, lists, tables, figures, captions, artifacts.
* Set **reading order**, document language, title, bookmarks, and metadata.
* Generate/validate **alt text**; identify decorative images.
* Parse/label **forms** (field labels, tooltips, required flags, tab order).
* Normalize **links** (descriptive link text; no bare URLs where text is editable) and ensure annotation roles.
* Optional **OCR** for scanned PDFs with language selection.
* Produce **Compliance Report (JSON)** and optional **redline tag-diff**.
* Export **tagged PDF** (primary) and **remediation package** (JSON + assets).

**Out of Scope:**

* Content translation/localization.
* Full visual redesign for color contrast (flag; provide remediation guidance).
* Execution of embedded JavaScript/actions except to **flatten or remove** unsafe actions.

---

## 3. Functional Requirements

* [PDF_REMEDIATOR-REQ-001] The system **SHALL** analyze an input PDF and construct/repair a valid **tag tree** including H1–H6 headings, paragraphs, lists, tables, figures, captions, and artifacts.
  **Rationale:** Screen reader navigation and structural semantics.

* [PDF_REMEDIATOR-REQ-002] The system **SHALL** establish a **logical reading order** consistent with visual layout, with explicit page-level order objects.
  **Rationale:** Required for robust assistive tech reading.

* [PDF_REMEDIATOR-REQ-003] The system **SHALL** set document **language**, **title**, **bookmarks**, and other accessibility-relevant metadata; per-span language where detectable.
  **Rationale:** Multilingual support and proper parsing.

* [PDF_REMEDIATOR-REQ-004] The system **SHALL** detect images and **generate or validate alt text**; images marked decorative SHALL be tagged as artifacts. Missing/low-confidence alt SHALL be **blocking** unless overridden with justification.
  **Rationale:** WCAG non-text content.

* [PDF_REMEDIATOR-REQ-005] The system **SHALL** detect and tag **tables** with header cells (TH), proper scope (row/column), and captions.
  **Rationale:** Table comprehension for AT.

* [PDF_REMEDIATOR-REQ-006] The system **SHALL** detect and tag **lists** (OL/UL) with correct nesting depth and list markers.
  **Rationale:** Preserve semantics and navigation.

* [PDF_REMEDIATOR-REQ-007] The system **SHALL** detect and label **form fields** with programmatic labels, tooltips, required/optional states, error text, and **tab order**; ensure field groups/legends where applicable.
  **Rationale:** Accessible forms.

* [PDF_REMEDIATOR-REQ-008] The system **SHALL** normalize **links** to have descriptive text; bare URLs SHALL be replaced with descriptive anchors when a surrounding text run exists.
  **Rationale:** Link purpose.

* [PDF_REMEDIATOR-REQ-009] The system **SHALL** support **OCR** for scanned PDFs, preserving reading order, artifacts, and image/figure tagging; original images remain embedded.
  **Rationale:** Make scanned content accessible.

* [PDF_REMEDIATOR-REQ-010] The system **SHALL** detect **color-contrast** issues and flag them with bounding boxes and guidance; automatic fixes MAY be suggested for text objects but SHALL NOT alter bitmap images.
  **Rationale:** WCAG contrast compliance.

* [PDF_REMEDIATOR-REQ-011] The system **SHALL** remove or **flatten embedded JavaScript/actions** except for trusted whitelisted actions; any removal SHALL be logged.
  **Rationale:** Security and predictability.

* [PDF_REMEDIATOR-REQ-012] The system **SHALL** output a **Compliance Report (JSON)** summarizing rule pass/fail counts, alt-text coverage, headings outline, list/table checks, link checks, form labels, language coverage, and contrast findings.
  **Rationale:** Audits, CI gates, and traceability.

* [PDF_REMEDIATOR-REQ-013] The system **SHALL NOT** persist PII outside approved locations and **SHALL** provide a **PII surface summary** where text extraction occurs.
  **Rationale:** Privacy & compliance.

---

## 4. Non-Functional Requirements (NFR)

* [PDF_REMEDIATOR-NFR-001] **Latency:** p95 end-to-end ≤ **180s** for PDFs ≤ 200 pages or ≤ 15k words OCR.
* [PDF_REMEDIATOR-NFR-002] **Reliability:** ≥ **99.5%** successful remediation for valid inputs (30-day rolling).
* [PDF_REMEDIATOR-NFR-003] **A11y Audit:** Automated PDF/UA checker pass rate ≥ **95%**; manual spot-check **100%** on headings, lists, tables, alt, language, reading order.
* [PDF_REMEDIATOR-NFR-004] **Fidelity:** Visual layout deltas SHALL be **zero** except for artifact tagging overlays in debug renders.
* [PDF_REMEDIATOR-NFR-005] **Cost Ceiling:** ≤ **$0.35** per average run (configurable).
* [PDF_REMEDIATOR-NFR-006] **Observability:** Structured logs/metrics with run IDs; attach reports to artifact store.

---

## 5. Safety, Privacy, & Compliance

* **Accessibility:** Conform to **WCAG 2.1 AA** and target **PDF/UA** where feasible. Enforce heading hierarchy, alt text, table/list semantics, link purpose, language tags, bookmarks, and reading order.
* **Privacy:** Data minimization; redact PII on request; configurable retention (**default ≤ 7 days**) and hard deletion.
* **Security:** OAuth/OIDC; RBAC; secrets in KMS; integrity hashes; signed outputs; JS/action flattening.
* **Content Safety:** Flag sensitive categories; optional HIPAA mode blocks PHI processing unless authorized.
* **Jurisdictional Constraints:** Section 508; **Texas TAC 206–213**; records retention.

---

## 6. Interfaces & Data Contracts

**Inputs**

* `pdf_file` (binary): single or batch; max 300 MB per file.
* `run_config` (JSON): `{ ocr:"auto|on|off", ocr_lang:["en","es",...], generate_alt:true, contrast_check:true, js_policy:"flatten|remove|allowlist", pii_mode:"warn|block", export_debug:false }`

**Outputs**

* `tagged_pdf` (binary): remediated PDF preserving visuals and tag tree.
* `compliance_report.json`: rule results, coverage metrics, findings with page/obj refs.
* `tag_diff.json` (optional): before/after structure and reading order deltas.
* `debug_render.zip` (optional): per-page PNGs with overlays (reading order, contrast boxes).

**External Systems**

* SharePoint/Google Drive connectors for input/output.
* OCR engine (e.g., pluggable).
* PDF accessibility checker (CLI) for automated validation.

**Error Taxonomy**

* `E-INPUT-BADPDF` — Corrupt/unsupported PDF features.
* `E-OCR-FAIL` — OCR failure beyond threshold; return partial + guidance.
* `E-TAG-TREE` — Tag tree could not be validated; report minimal viable output.
* `E-JS-POLICY` — Disallowed actions detected; run blocked per policy.
* `E-PRIV-PII` — PII policy violation.
* `E-SVC-UNAVAILABLE` — Upstream connector/checker outage; retry guidance.

---

## 7. Test Plan (Challenge Cases & Success Criteria)

> Each test declares a binary oracle and links to REQs/NFRs.

* [PDF_REMEDIATOR-TST-001] **Scenario:** 50-page born-digital PDF with proper headings but broken tag tree. **Validates:** REQ-001, REQ-002, NFR-003. **Expected:** Valid tag tree; H1–H3 preserved; reading order fixed; checker pass ≥95%. **Oracle:** Checker + structural diff.

* [PDF_REMEDIATOR-TST-002] **Scenario:** PDF with 10 images, none with alt text. **Validates:** REQ-004. **Expected:** 10 blocking findings; suggested alt text placeholders. **Oracle:** JSON report counts.

* [PDF_REMEDIATOR-TST-003] **Scenario:** Complex table (header row + column; merged cells). **Validates:** REQ-005. **Expected:** TH scope set; caption present; reading order correct. **Oracle:** Tag inspection.

* [PDF_REMEDIATOR-TST-004] **Scenario:** Deeply nested lists (3 levels). **Validates:** REQ-006. **Expected:** Correct nesting; list markers mapped. **Oracle:** Tag inspection.

* [PDF_REMEDIATOR-TST-005] **Scenario:** Interactive form (text, checkbox, radio, dropdown). **Validates:** REQ-007. **Expected:** Labels/tooltips present; tab order logical; required fields indicated; error text example present. **Oracle:** Field map.

* [PDF_REMEDIATOR-TST-006] **Scenario:** Scanned PDF (100 pages). **Validates:** REQ-009, NFR-001. **Expected:** OCR performed; language `en-US`; reading order set; p95 ≤ 180s on standard hardware. **Oracle:** Timers + output audit.

* [PDF_REMEDIATOR-TST-007] **Scenario:** Color text over imagery. **Validates:** REQ-010. **Expected:** Contrast issues flagged with bounding boxes; remediation guidance attached. **Oracle:** Report entries.

* [PDF_REMEDIATOR-TST-008] **Scenario (Red-Team):** Embedded JavaScript actions triggering modal dialogs. **Validates:** REQ-011. **Expected:** Actions flattened/removed per policy; log entries recorded. **Oracle:** Action enumeration before/after.

* [PDF_REMEDIATOR-TST-009] **Scenario (Red-Team):** PDF contains emails/SSNs. **Validates:** REQ-013. **Expected:** PII surface summary; mode=block prevents export without approval. **Oracle:** Detector unit tests.

* [PDF_REMEDIATOR-TST-010] **Scenario:** Mixed-language spans. **Validates:** REQ-003. **Expected:** Per-span language tags applied for ≥90% of non-English spans. **Oracle:** Span sampling.

---

## 8. Metrics & Observability

**KPIs:** A11y pass rate; alt-text coverage; table/list correctness rate; OCR accuracy; p50/p95 latency; PII incidents; rework rate after manual review.
**Dashboards:** `A11y pass trends`, `Latency by pages`, `PII incidents`, `Top failure codes`, `OCR quality`.
**Alerting:** p95 latency > 180s (5m); pass rate < 95% (daily); error rate > 2% (15m).

---

## 9. Translation Notes (Target Architectures)

* **CLI/Batch:** Accept folder or manifest; emit artifacts to output dir; exit codes for CI gates.
* **Web App:** Drag-drop; progress indicator; preview with overlays (reading order, contrast); keyboard-first UI; ARIA landmarks.
* **SharePoint/Drive:** Connector to pick/save; preserve version history; write compliance report adjacent to PDF.
* **Service/Agent:** Idempotent run IDs; rate limits; caching of page analyses; pluggable OCR and checker.

---

## 10. Risks & Assumptions

* [PDF_REMEDIATOR-RSK-001] Automated tagging can misclassify structures (e.g., tables vs. layout grids). **Mitigation:** confidence scores; human-in-the-loop correction UI.
* [PDF_REMEDIATOR-RSK-002] PDF/UA conformance varies by reader/checker. **Mitigation:** test against multiple validators; maintain allowlist of acceptable diffs.
* [PDF_REMEDIATOR-RSK-003] OCR quality for low-res scans. **Mitigation:** DPI thresholds; deskew/denoise; fallback to manual.
* [PDF_REMEDIATOR-ASM-001] Original visual fidelity must be preserved. **Validation:** pixel-diff guardrails in debug.

---

## 11. Open Questions

* [PDF_REMEDIATOR-OPN-001] Minimum acceptable automated pass threshold (95% vs 98%)? **Owner:** A11y Ops. **Due:** 2025-09-10.
* [PDF_REMEDIATOR-OPN-002] Which checker(s) become the CI gate source of truth? **Owner:** A11y Ops. **Due:** 2025-09-10.
* [PDF_REMEDIATOR-OPN-003] HIPAA mode default off vs on for VR contexts? **Owner:** Compliance. **Due:** 2025-09-20.
* [PDF_REMEDIATOR-OPN-004] Language models approved for alt-text generation (on-prem vs cloud)? **Owner:** Eng/Sec. **Due:** 2025-09-25.

---

## 12. Traceability Matrix

| Requirement ID          | Linked Tests     | Metric(s)              | Status |
| ----------------------- | ---------------- | ---------------------- | ------ |
| PDF_REMEDIATOR-REQ-001 | TST-001          | A11y pass              | Draft  |
| PDF_REMEDIATOR-REQ-002 | TST-001, TST-006 | Reading order; latency | Draft  |
| PDF_REMEDIATOR-REQ-003 | TST-010          | Language coverage      | Draft  |
| PDF_REMEDIATOR-REQ-004 | TST-002          | Alt-text coverage      | Draft  |
| PDF_REMEDIATOR-REQ-005 | TST-003          | Table checks           | Draft  |
| PDF_REMEDIATOR-REQ-006 | TST-004          | List checks            | Draft  |
| PDF_REMEDIATOR-REQ-007 | TST-005          | Forms accessibility    | Draft  |
| PDF_REMEDIATOR-REQ-008 | —                | Link semantics         | Draft  |
| PDF_REMEDIATOR-REQ-009 | TST-006          | OCR success            | Draft  |
| PDF_REMEDIATOR-REQ-010 | TST-007          | Contrast findings      | Draft  |
| PDF_REMEDIATOR-REQ-011 | TST-008          | JS flatten/remove      | Draft  |
| PDF_REMEDIATOR-REQ-013 | TST-009          | PII summary/incidents  | Draft  |

---

## 13. Acceptance Checklist (Go/No-Go)

* [ ] All REQs mapped to ≥1 tests (traceability complete)
* [ ] Automated checker pass ≥ **95%** across seed set; manual spot-check 100% on key items
* [ ] p95 latency ≤ **180s** on reference hardware
* [ ] PII policy documented; retention configured; HIPAA mode validated (if needed)
* [ ] Runbooks, rollback, and version pinning documented
* [ ] Cost within ceiling

---

## 14. Changelog

* **1.0.0** — Initial specification
