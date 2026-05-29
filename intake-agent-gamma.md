<!--
Gamma: "---" = new slide. Visual-first, few words. Big screenshot per slide; speaker line in ">".
3 parts: Phase 1 (text + CAT) · Phase 2 (catalog + non-catalog) · Compliance Console (controls catalog order in Intake).
-->

# Intake Agent

**A connected procurement loop, in three parts**

Eric Huang · Lead UX, Workday · 2024–2026

- Part 1 · Phase 1 — answer + one action
- Part 2 · Phase 2 — richer content in-thread
- Part 3 · Compliance Console — controls catalog order in Intake

> One thread, three parts. Keep it short and let them ask.

---

# The problem: buying at work is confusing

- **"Where do I start?"** — no clear path; people guess, ask around, or give up.
- **"Is this allowed?"** — policy is buried; easy to buy off-contract by mistake.
- **"This takes forever."** — slow and manual; hunting across portals and people.

> Plain-language framing before any UI. The cost: stalled requests, off-contract spend, wasted time. Everything after solves one of these three.

---

# Three parts, one thread

- **Phase 1** · text answer, and text + CAT
- **Phase 2** · catalog items + non-catalog forms
- **Compliance Console** · rules set how catalog ranks in Intake

> 30-second map, then straight into screens.

---

# Phase 1 · Ask once → text answer, or text + CAT

An employee asks a buying question; the assistant replies in a side panel and cites its source. The reply comes in two shapes — plain text, or text + one action (CAT) that moves work forward.

![Ask in plain language](images/intake-agent/02-search-po-query.png)

![Text answer + source](images/intake-agent/04-agent-po-answer.png)

![Text + CAT](images/intake-agent/05-agent-catalog-action.png)

> Walk it: ask, a grounded text answer with its source, then the same answer plus one action (CAT).

---

# Phase 1 · Admin console — a wizard to a trusted agent

A step-by-step wizard walks admins from ingesting policy to testing before launch, so they build with confidence.

![01 Ingest policy](images/intake-agent/07-admin-upload-document.png)

![02 Define routes & output](images/intake-agent/10-admin-routing-rules-editor.png)

![03 Test before launch](images/intake-agent/11-admin-testing-playground.png)

---

# Phase 2 · Catalog items in-thread

Catalog browsing comes into the conversation — select lines and submit without switching tools.

![Catalog in the assistant](images/intake-agent/13-phase2-catalog-requisition.png)

> Pick and submit without leaving the conversation.

---

# Phase 2 · Non-catalog forms in-thread

For off-catalog buys, the structured request form renders right inside the assistant.

![Non-catalog form in the assistant](images/intake-agent/14-phase2-noncatalog-request-form.png)

> Real fields inline — no jump to another screen.

---

# Compliance Console · Set the rule → Intake shows the order

Admins configure catalog ranking in the console; Intake Agent displays results in exactly that order.

![Console display rules](images/purchase-compliance/console-display-rules.png)

![Catalog order in Intake](images/purchase-compliance/catalog-search-compliance-ranking.png)

> Cause and effect: admin sets ranking in the console; Intake renders that order.

---

# Recap

- **Phase 1** · answer + one action
- **Phase 2** · catalog and non-catalog, in-thread
- **Compliance Console** · controls the catalog order Intake shows

**Eric Huang** · eric.chakho.wong@gmail.com · linkedin.com/in/zehao-eric-huang

> Answer → action → governed order. Invite questions.

---

# Appendix · How we kept it honest (trust & evals)

An unguided LLM drifts. We grounded every answer in ingested policy, then made admins verify in a playground before launch.

![Grounded on policy](images/intake-agent/08-admin-policy-processing.png)

![Tested before launch](images/intake-agent/11-admin-testing-playground.png)

> Pull up if asked about hallucination: grounding + a test gate before shipping.

---

# Appendix · A path we rejected (wizard vs. config)

Exposing every rule at once was powerful but overwhelming — it eroded admin trust. We chose guided steps that build confidence incrementally.

![Rejected: everything at once](images/intake-agent/09-admin-routing-table.png)

![Shipped: guided wizard](images/intake-agent/07-admin-upload-document.png)

> Frame it as a trust tradeoff, not a feature cut.

---

# Appendix · Did it work? (impact)

The admin analytics view was designed in, not bolted on — so impact stays visible. (Figures directional; swap in live numbers.)

- ↑ Adoption — more requests start in the agent
- ↓ Off-catalog — fewer non-compliant buys
- ↓ Time-to-answer — no hunting through portals

![Admin analytics dashboard](images/intake-agent/12-admin-analytics-dashboard.png)

---

# Appendix · The before (problem framing)

Buying used to mean navigating a manual draft flow and knowing where to go. The agent turns that into one question.

![Before: manual draft](images/intake-agent/06-legacy-start-purchase-draft.png)

![After: ask once](images/intake-agent/05-agent-catalog-action.png)

---

# Appendix · When rules get complex (compliance depth)

The console gives admins control over context and display rules — so ranking holds up when policies overlap or compete.

![Overview](images/purchase-compliance/console-overview.png)

![Display rules](images/purchase-compliance/console-display-rules.png)

![Context resolution](images/purchase-compliance/console-maintain-context-modal.png)

> Demonstrates systems thinking beyond the happy path.
