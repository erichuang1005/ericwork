# Autodesk Panel Deck — Intake Agent
### Principal Experience Designer, Agentic Workflows
**40 min present · 20 min Q&A · ~10 slides · Eric Huang**

> **Gamma tip:** One `---` = one slide. Bold text = headline. Bullets = body. Speaker notes are in `> blockquotes` — don't put these on slides.

---

---

# SLIDE 1 — TITLE
*(~1 min)*

**Intake Agent**
*Designing the interaction model for an AI-powered procurement assistant*

- Workday · Desktop Web · 2024–2026
- Lead UX Designer
- Tags: Agentic workflows · Enterprise SaaS · Responsible AI · Systems thinking

> *Don't read the slide. Say: "I'm going to walk you through a project where I had to define what 'AI assistant' actually means inside a governed enterprise workflow — and why that's a harder design problem than it looks."*

---

---

# SLIDE 2 — WHO I AM
*(~5 min · "Tell us your story")*

**I design the seam between simple surfaces and complex systems**

- I keep ending up in products where what looks like a search box or a chat thread is actually governed by rules, routing logic, and real-world consequences
- Procurement, inventory ops, agentic workflows — the surface always looks easier than the system underneath. I design both.
- What shows up in my partnerships: I don't stop at the user-facing UI. I ask what has to be true on the system side for that UI to be honest and trustworthy
- What attracted me to design: I came from [your background] — I realized design was the discipline where you could make complex systems feel inevitable to the people using them

> *Keep this personal and brief. End with: "That's the lens I brought to Intake Agent — and it's the lens I'd bring to agentic workflows at Autodesk."*

---

---

# SLIDE 3 — THE PROBLEM + RESEARCH
*(~6 min)*

**Employees couldn't answer the simplest question: "Am I allowed to buy this?"**

The situation:
- Answers lived across wikis, Slack threads, emailed PDFs, and forms that assumed you already knew your request category
- Wrong answers weren't just frustrating — they had real compliance and financial consequences

What research showed:

| Signal | Design implication |
|---|---|
| ~50% of support tickets = repeat "how do I?" questions | Scale through the system, not more headcount |
| Written guides go stale; retraining doesn't scale | Assistant needs admin-maintained, live source of truth |
| Wrong buying guidance has compliance cost | Answers must cite sources — users need to verify |

**The insight that changed everything:** *"Procurement isn't a Q&A problem — it's a workflow problem."*

> *Land that last line slowly. It rules out a pure chatbot and sets up every decision that follows.*

---

---

# SLIDE 4 — DESIGN THINKING: WHAT WE EXPLORED & REJECTED
*(~7 min · decision + tradeoffs)*

**Two directions explored. Both ruled out.**

**Form-first** *(rejected)*
- Assumed users already knew their request category — dead end for new hires
- No way to ask "is this even allowed?" before committing to a path

**Pure chatbot** *(rejected)*
- Felt more "AI-native" in demos — PM preferred it initially
- Couldn't keep answers in policy context or route users to the right next step reliably
- Confident-but-wrong answers are a trust liability in compliance contexts

**The tradeoff I named explicitly:** Chat-only was the buzzier option. We picked outcome over optics.

**What we shipped instead:** Hybrid — Quick Links + open search + side assistant. Three ways in for different user types, all grounded in the same policy rules.

📸 *Image: `06-legacy-start-purchase-draft.png` — the form-first exploration*
📸 *Image: `01-landing-quick-links.png` — the hybrid landing page*

> *This is where you show design thinking. Name the stakeholder push (PM wanted pure chat). Name what you did: "I pushed for the hybrid model. Here's why it won."*

---

---

# SLIDE 5 — THE SYSTEM BEHIND THE UI
*(~7 min · your differentiator)*

**The user experience is only as good as the rules behind it**

Most designers show the user-facing surface. I designed the admin loop as a first-class part of v1 — not a follow-on.

```
ADMIN: Upload policy docs → Configure routing → Test in sandbox
                                    ↓
USER:  Ask question → Grounded answer + sources → Take next step
                                    ↓
               Analytics feed back → Admin refines rules
```

**What shipped in v1 alongside the user UI:**

| Admin tool | Why it had to be in v1 |
|---|---|
| Document upload | Grounds answers in real policy, not model guesses |
| Routing table (deterministic) | High-stakes paths need explicit rules, not AI inference |
| Test sandbox | Admins verify behavior before employees see it |
| Analytics dashboard | Shows where answers fail so rules can be improved |

**Stakeholder moment:** Strong pressure to defer admin tooling to a later release. I argued: without it, answer quality degrades the moment policy changes. It shipped with v1.

📸 *Image: `09-admin-routing-table.png`*
📸 *Image: `11-admin-testing-playground.png`*

> *"Agents are only as good as their rules. The admin console is how the system stays honest. Without it, the AI part is theater." — Say this.*

---

---

# SLIDE 6 — SHIPPED SCREENS: PHASE 1 (2024)
*(~4 min)*

**Three entry points. One page. Every user type covered.**

- **Ask anything** in plain language — no form, no category required
- **Side panel opens inline** — landing page context stays visible, no context switch
- **Every reply:** direct answer + source document cited + one logical next step

📸 *Image: `02-search-po-query.png` — typed question*
📸 *Image: `03-agent-thinking.png` — side panel loading*
📸 *Image: `04-agent-po-answer.png` — grounded answer, source, next step*

> *Walk these three images as a flow: "Here's the question → here's the assistant working → here's the answer with the source and one next step. No guessing. No buried links."*

---

---

# SLIDE 7 — CRAFT: THE REPLY PATTERN + PHASE 2
*(~6 min)*

**Every assistant turn does exactly one thing**

The primitive: *direct answer + one constrained action.* Applies at any scale.

Phase 1 — answer + action button:
```
Direct answer ───────────────────────
[ Primary action button ]
```

Phase 2 (2026) — the assistant became the workflow:
- **Catalog request:** quantities → submit → confirmation number, all in-thread
- **Off-catalog form:** structured form embedded inline, no page switch
- **Pricing step:** continues in the same thread

**Source disclosure pattern:** Readable title + excerpt by default. Expand for more. *Skim by default, depth on demand.* This is how trust gets designed in, not bolted on.

> *Pilot participant quote: "I'm not bouncing between three systems — the answer comes with sources, and the next step actually moves things forward."*

📸 *Image: `13-phase2-catalog-requisition.png`*
📸 *Image: `14-phase2-noncatalog-request-form.png`*

---

---

# SLIDE 8 — STAKEHOLDER INFLUENCE
*(~4 min)*

**Three decisions I had to defend without formal authority**

| Decision | The push | What I did | Result |
|---|---|---|---|
| Hybrid shell vs. pure chat | PM wanted chat-only (felt more "AI-native") | Research showed power users needed Quick Links; new hires needed open search. Framed as "outcome over optics." | Hybrid shipped |
| Deterministic routing vs. AI routing | Eng proposed letting the model infer next steps | For compliance paths, inference = audit risk. Advocated for explicit admin-configured routing. | Deterministic routing shipped |
| Admin tooling in v1 vs. later | Pressure to defer — scope/timeline | Without admin tools, quality degrades the moment policy changes. This isn't a follow-on, it's the foundation. | Admin tooling shipped in v1 |

> *Each row is a STAR story compressed. If they ask "tell me about a time you influenced without authority" — pick one row and expand it.*

---

---

# SLIDE 9 — OUTCOMES + METRICS
*(~4 min)*

**Two major releases. Both delivered.**

What shipped:
- ✅ Hybrid landing page with policy-grounded assistant (2024)
- ✅ In-thread catalog, off-catalog forms, pricing — full transaction in chat (2026)
- ✅ Admin tooling (upload, routing, sandbox, analytics) shipped alongside v1
- ✅ Adopted by Workday procurement; reply patterns extended to other assistant surfaces

Impact:
- One entry point replaced scattered wikis, Slack threads, and disconnected forms
- Repeat support tickets for "how do I buy X?" measurably reduced *(add your number here if you have it)*
- Admins could maintain the system themselves from day one — no engineering dependency for rule updates

**The reply pattern became a reusable primitive** adopted beyond the procurement assistant.

> *If you have a hard metric, say it here. If not: "We don't have a public number I can share, but the directional signal was [X]." Specific beats vague every time.*

---

---

# SLIDE 10 — REFLECTION + WHY AUTODESK
*(~3 min)*

**"If the rules don't match real behavior, the 'AI' part doesn't matter — the experience breaks."**

What I'd do differently:
- Push for a **live admin preview** earlier — the sandbox caught routing logic, but not real-world edge cases. I'd want that feedback before launch, not after.
- Build an **evaluation harness** from day one — route real prompts through new rules before flipping them live

**Why this transfers to AEC:**

| Intake Agent pattern | Autodesk equivalent |
|---|---|
| Reply primitive: answer + one action | Agent proposes design change → preview → accept / refine / override |
| Admin routing + sandbox | Designer reviews agent behavior before end-user exposure |
| Source citation | Agent cites the spec, regulation, or standard it drew from |
| Analytics → rule refinement | Usage signal keeps agent behavior accurate over time |

**Why Autodesk, why now:**
AEC is where agentic UX gets genuinely hard — outcomes span months, stakeholders, and disciplines. That's the territory I've been building for.

---

---

# Q&A CHEAT SHEET
*(Keep this on a notes page — not a slide)*

**"When did you override your instinct because of data?"**
→ Hybrid shell felt less elegant than pure chat. Research won. Useful beat elegant.

**"How did you design for when the AI gets it wrong?"**
→ Three layers: source citation (verify), stop rules (hard limits), sandbox (test before go-live).

**"What's your gap vs. Principal scope?"**
→ Pattern leadership at platform level — I've set patterns others adopted, but I want to be defining the interaction model across product lines, not just for one.

**"Tell me about a failure."**
→ No live admin preview before launch. Sandbox caught logic errors but missed real usage edge cases. I'd build the evaluation harness from day one next time.

**"How does this apply to Autodesk?"**
→ Reply primitive + admin loop + trust patterns are surface-agnostic. The specific action changes (chat vs. model manipulation), the interaction model doesn't.

---

**END**
*Eric Huang · eric.chakho.wong@gmail.com · linkedin.com/in/zehao-eric-huang*
