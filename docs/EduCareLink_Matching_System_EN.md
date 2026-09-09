# EduCareLink — Parent ↔ CarePartner Matching System

**Complete Product & Technical Specification · English Edition**

| Field | Value |
|---|---|
| **Document** | Matching System — Full Specification (English edition) |
| **Companion document** | `docs/EduCareLink_HeThongGhepNoi.docx` (Vietnamese, Word format) |
| **Version** | 1.0 |
| **Audience** | Students & team members · developers · QA testers · customers & competition judges |
| **Feature scope** | Flow 1 — Parent ↔ CarePartner matching (Tutoring / Childcare / Pickup) |
| **Repository** | `huyhandsome6996/educarelink-backend-4-12-2026` |
| **Implementation branch** | `feature/ghep-cap-flow1-implementation` |
| **Source of truth** | `docs/agent-spec/*.md` on the implementation branch + the configuration tables in the database |
| **Platform target** | Android (mobile) · Web (Django prototype) · Web admin (Next.js) |

> ⚠️ **Read this first, engineers and QA.**
> Every number in this document is a **reference for human reading only**. The authoritative values live in the spec files under `docs/agent-spec/` and in the database configuration tables (`EloBand`, `MatchingWeight`, `CancelPolicy`, `MatchingConfig`). **Never hardcode a number copied from this document.** The admin team can change thresholds and weights at runtime without a redeploy, so any hardcoded copy will silently drift out of sync.

---

## Table of Contents

1. [Executive Overview](#1-executive-overview)
2. [Architecture & Non-Negotiable Rules](#2-architecture--non-negotiable-rules)
3. [The Parent Journey](#3-the-parent-journey)
4. [The CarePartner Journey](#4-the-carepartner-journey)
5. [The Matching Engine](#5-the-matching-engine)
6. [Failure Handling, Penalties & Compensation](#6-failure-handling-penalties--compensation)
7. [Notifications & Sound](#7-notifications--sound)
8. [User-Facing Surfaces](#8-user-facing-surfaces)
9. [MVP Limitations & Roadmap](#9-mvp-limitations--roadmap)
10. [QA Test Checklist](#10-qa-test-checklist)
- [Appendix A — State Machines](#appendix-a--state-machines)
- [Appendix B — The 17 Business-Rule Assertions](#appendix-b--the-17-business-rule-assertions)
- [Appendix C — Key Numbers & Glossary](#appendix-c--key-numbers--glossary)

---

## 1. Executive Overview

### 1.1 The problem, from both sides

EduCareLink solves a **two-sided problem**.

On the **parent side**, people are busy. They do not have time to flip through dozens of student profiles to find someone to tutor, babysit or pick up their child. They want to state their need **once** and have the system bring the most suitable people to them.

On the **student side**, CarePartners need part-time income but do not know where help is wanted. Equally importantly, they do not want to accept a job and only then discover they cannot actually do it or cannot get there in time.

### 1.2 The solution: an intelligent broker

The system acts as an **intelligent broker** standing between the two sides. It does three jobs.

| # | Job | What it means in practice |
|---|---|---|
| 1 | **Understand** | Read what the parent wrote — even if vague or misspelled — and turn it into a structured requirement |
| 2 | **Select** | Scan every registered student, reject those who cannot do the job, score the rest on seven criteria, and return exactly **eight** best matches, ranked |
| 3 | **Discipline** | Reward good behaviour silently with more exposure; penalise last-minute cancellations and no-shows by quietly lowering trust — but always leave a way back |

### 1.3 The core difference from ordinary job apps

| Ordinary job marketplace | EduCareLink |
|---|---|
| Student browses listings and **applies** | Student declares free time **up front** |
| Employer reviews applications and **decides** | Parent sees a pre-ranked shortlist of 8 |
| Worker must **accept** each job | Booking is **auto-committed** the moment the parent picks |
| No accountability for backing out | Backing out costs hidden trust score, with a path to recover |

Because the student has already declared "I am free Monday/Wednesday/Friday evening", a parent booking exactly that slot produces a **confirmed job instantly**. There is no "waiting for the worker to say yes" step. The student can still get out — but only through the official cancel button, within the allowed window, and that exit is recorded against their trust score.

### 1.4 Why the trust score is hidden

All reward and punishment happens through a number the user **never sees**. Users only feel its consequences: how often they get recommended, and how high they appear in the list. This is a deliberate design choice, to avoid psychological pressure, to stop score-gaming, and to prevent arguments every time a number changes.

### 1.5 Design philosophy

> **The trustworthy are promoted. The flaky are filtered out. But there is always a way back.**
> The system is strict, not cruel — and that is what keeps both sides on the platform long term.

---

## 2. Architecture & Non-Negotiable Rules

### 2.1 Technology stack

| Layer | Technology |
|---|---|
| Backend API | Django 5.2 + Django REST Framework, Python 3.11 |
| Authentication | SimpleJWT (access 60 min / refresh 30 days) |
| Database | SQLite (development) · PostgreSQL (production) |
| Mobile app | React Native + Expo SDK 54 (Android priority) |
| Web prototype | Django templates + Tailwind CSS (`frontend/` app) |
| Admin console | Next.js + TypeScript (`admin-web/`) |
| AI service | Google Gemini (`gemini-2.5-flash` / `-lite`) |
| Push notifications | Expo Push Service |
| Background jobs | Custom thread scheduler started in `Apps.ready()` — **no Celery** |
| Timezone | `Asia/Ho_Chi_Minh` everywhere, without exception |
| Deployment | Render (3 services: backend, tracking scheduler, admin-web) |

### 2.2 The twelve non-negotiable business rules

| # | Rule | Summary |
|---|---|---|
| 1 | **Auto-commit booking** | Parent selects → booking is created instantly in `awaiting_commitment`. The CarePartner never presses "accept". |
| 2 | **Hidden ELO** | Trust score is never exposed to any client. Default 1200, clamped to [400, 2000]. Thresholds live in the DB. |
| 3 | **90-minute buffer** | Two consecutive jobs for the same CarePartner on the same day must be ≥ 90 minutes apart. |
| 4 | **Max 8 candidates** | The matching engine returns at most eight CarePartners, never hundreds. |
| 5 | **Only 3 job types** | `tutoring`, `childcare`, `pickup`. No fourth type exists anywhere. |
| 6 | **Credit compensation** | Parents are compensated in virtual credit, not real money (MVP scope). |
| 7 | **Commitment window** | 60 / 30 / 15 / 5 minutes depending on lead time, always ending ≥ 5 min before job start. |
| 8 | **Force majeure** | 8 cancellation reason codes; 5 of them halve the ELO penalty and require a note ≥ 20 characters. Max 2 per rolling 30 days. |
| 9 | **Schedule locking** | 5-minute soft hold → hard lock with row-level locking. All-or-nothing for recurring jobs. |
| 10 | **Blackout dates** | One-off unavailability days. Cannot silently delete availability that already carries a booking. |
| 11 | **Critical sound** | Android notifications of class `critical` must play a loud custom alarm; channel importance MAX. |
| 12 | **Auto-replacement** | On cancel or no-show, re-run matching immediately and notify the parent with the outcome. |

### 2.3 The three golden numbers

Memorise these three. Everything else is detail.

| Number | Meaning |
|---|---|
| **8** | Hard cap on candidates shown to a parent |
| **90** | Minimum rest gap (minutes) between two consecutive jobs for one CarePartner |
| **1200** | Starting hidden trust score for every new CarePartner |

---

## 3. The Parent Journey

### 3.1 Step one — choose a job type

The first screen shows **exactly three buttons and nothing else**.

| Button | Vietnamese label | Purpose |
|---|---|---|
| 👨‍🏫 Tutoring | *Gia sư* | Teaching a subject or a skill |
| 👶 Childcare | *Trông trẻ* | Looking after children at home |
| 🚗 Pickup | *Đón trẻ* | Collecting a child from school and delivering them somewhere |

**Why only three?** Each type has completely different selection criteria, and offering more choices paralyses the parent while making matching less accurate.

> **QA note:** verify that no path exists to create a fourth job type, and that an API call with any `job_type` outside the three valid values is rejected with HTTP 400.

### 3.2 Tutoring form

| Field | Type | Required | Notes |
|---|---|---|---|
| Subject / Skill | Free text | ✅ | **Not limited to school subjects.** "Maths grade 5" is fine, but so are "MC", "life skills", "piano", "drawing", "chess", "swimming". |
| Specific requirements | Textarea | ✅ | E.g. "needs to be patient, my child is shy", "prefer education majors" |
| Dates | Calendar picker | ✅ | Multi-select. **Never a free-text date field.** Past dates must be blocked. |
| Start time | Time picker | ✅ | |
| End time | Time picker | ✅ | Must be **after** start time |
| Location | Map picker | ✅ | See 3.5 below |
| Location note | Text | ❌ | E.g. "Apartment X, lobby B, floor 12" |
| Hourly rate (VND) | Number | ✅ | Must be > 0 |

> **QA note:** the free-text subject is a deliberate product decision. Test explicitly with "MC" and "Kỹ năng sống" (life skills) and confirm both are accepted **and** that the AI extracts a matching skill tag.

### 3.3 Childcare form

Shares the date/time/location/rate frame with Tutoring, plus **four extra fields** because of the sensitivity of caring for a small child.

| Extra field | Type | Required | Options / constraints |
|---|---|---|---|
| Child age group | Dropdown | ✅ | 0–12 months · 1–3 years · 3–6 years · 6–10 years · 10+ years |
| Number of children | Number | ✅ | Minimum 1 |
| Care duties | Multi-select | ✅ | **At least one required.** General care · Feeding · Bathing · Nap supervision · Play & activities · Homework support · Light child-related chores |
| Health / allergy notes | Textarea | ❌ | E.g. "allergic to shrimp", "asthma, inhaler in the bag" |

An empty care-duties list must be rejected with a clear Vietnamese error message. The health notes are later read by the AI and may raise the job's sensitivity flag.

### 3.4 Pickup form

The most complex form, because a pickup is a **journey with two endpoints**.

| Field | Type | Required | Notes |
|---|---|---|---|
| School / pickup place name | Text | ✅ | E.g. "Primary School A", "Ms B's extra class" |
| Child age group | Dropdown | ✅ | Same five options as Childcare |
| Number of children | Number | ✅ | Minimum 1 |
| Pickup dates | Calendar picker | ✅ | Multi-select |
| Earliest pickup time | Time picker | ✅ | Flexible window, because school dismissal times drift |
| Expected end time | Time picker | ✅ | Must be after start |
| Pickup location | Map picker | ✅ | The school / class |
| Pickup location note | Text | ❌ | "Main gate", "side gate on Y street", "room 3A floor 2" — many schools have several gates |
| **Destination type** | Radio | ✅ | `parent_home` (default) or `other_address` |
| Destination location | Map picker | Conditional | **Required** when `other_address`; when `parent_home`, uses the saved home address (and forces a map pick if none is saved) |
| Destination note | Text | ❌ | |
| Transport method | Select | ❌ | On foot · CarePartner has own vehicle · Parent arranges vehicle |
| Specific requirements | Textarea | ✅ | |
| Hourly rate (VND) | Number | ✅ | Must be > 0 |

### 3.5 The map picker (shared by all three forms)

The location field must support **three input methods**, because parents behave differently:

1. **Type an address** → the map jumps to it automatically
2. **Press "use my current location"** → coordinates come from the device
3. **Drag a pin** on the map manually

Plus one optional free-text note for the fine detail that no geocoder can capture.

### 3.6 What the AI does with the post

As soon as the parent submits, the post is **not** treated as raw text. It goes to Gemini, whose job is to convert natural language into a structured requirement the matcher can consume.

**Worked example.** Parent writes:

> *"Cần bạn nữ đưa đón bé gái lớp 1 từ trường về nhà vào 16h30 hằng ngày."*
> ("Need a female student to pick up my grade-1 daughter from school at 4:30pm daily.")

The AI must extract:

| Extracted item | Value |
|---|---|
| Job type | Pickup |
| Subject | Female child, grade 1 → primary level |
| Time | 16:30, recurring daily |
| Gender preference | Female |
| Implicit requirements | Punctuality, reliability |
| Sensitivity level | Medium (involves a child) |

**Basic layer extracted:** title, description, category, required skills, who is being supported, timing, weekdays, pay, location, special requirements.

**Advanced layer inferred:** urgency (same-day rush vs. booked a week ahead), whether a brand-new student could handle it, whether specific experience is demanded, safety risks to flag, and whether extra verification is needed.

#### The gender-preference policy

This is a sensitive area handled by a firm rule:

| Job type | Gender preference honoured? | Reason |
|---|---|---|
| Childcare | ✅ Yes | Directly involves a child's bodily privacy and safety |
| Pickup | ✅ Yes | Same rationale |
| **Tutoring** | ❌ **No — silently ignored** | Avoids discrimination. The parent receives a polite notice that the platform does not filter tutors by gender. |

> **QA note:** both branches must be tested — a childcare job with a gender preference must filter, and a tutoring job with one must **not** filter and must show the explanatory notice.

**Skill tagging.** The AI attaches skill tags, e.g. a grade-5 Maths tutoring post yields tags for `maths`, `primary level`, and possibly `patience` if the description mentions it. These tags are what get compared against CarePartner skill tags during scoring.

**Confidence and clarification.** The AI scores its own confidence. When confidence is low the system does **not** silently guess; it asks the parent back, e.g. *"Do you mean Maths grade 5 on Monday, Wednesday and Friday evenings?"* Only after confirmation does the post move to `parsed` and enter matching.

**Fallback.** If the AI service is unreachable or returns malformed output, a rule-based fallback must still produce a usable parse so the post is never stuck. QA must test this branch by simulating an AI failure.

### 3.7 The candidate list

Once parsing finishes, the matcher runs and returns **at most eight** CarePartners, ranked best-first. This is a hard cap, not a suggestion. If 47 students qualify, eight are returned and the parent is told the total:

> *"Có 47 CarePartner phù hợp với công việc của bạn. Dưới đây là 8 người phù hợp nhất."*
> ("47 CarePartners match your job. Here are the 8 best fits.")

Each candidate card shows everything a parent needs to decide **without opening a detail page**:

| Card element | Example |
|---|---|
| Avatar (or default placeholder) | — |
| Display name | Nguyễn Văn A |
| University & major | Hanoi National University of Education — Primary Education |
| Average star rating | ★ 4.9 |
| Completed jobs | 34 |
| Distance from the job | 1.5 km |
| **Match level (Vietnamese label)** | Rất phù hợp / Phù hợp cao / Phù hợp / Có thể cân nhắc |
| Highlighted skill tags | `maths` `primary` `patient` |
| Most recent parent review | "Very enthusiastic teacher, my child improved clearly" |
| Behaviour tag | ⚡ "Replies fast" or ✅ "Always on time" |

**Match-level label mapping — exact strings:**

| Score range | Level code | Vietnamese label |
|---|---|---|
| ≥ 90 | `very_high` | Rất phù hợp |
| 75 – 89 | `high` | Phù hợp cao |
| 60 – 74 | `medium` | Phù hợp |
| < 60 | `low` | Có thể cân nhắc |

> **QA note:** these four strings have previously drifted between spec and code. Test the **actual rendered string**, not just the bucketing logic.

**Empty state.** If nobody qualifies, the screen must not be blank and must not throw. It shows a friendly Vietnamese empty state plus a suggestion to relax requirements or wait for a notification.

**Pull to refresh** must re-call the matching API, not just re-render cached data.

**Absolute security rule:** the hidden trust score must never appear in any client-facing screen or API response. QA must audit every serializer and confirm no field name hinting at it is present.

### 3.8 Selecting a candidate — atomic auto-commit

When the parent taps "Choose this CarePartner", the following happens as **one atomic transaction** — all of it or none of it, never a half state:

1. **Re-validate** that every slot of the job is still free for this CarePartner. Mandatory, because another parent may have been faster between list-load and tap.
2. **Create the booking** with status `awaiting_commitment`.
3. **Hard-lock all slots** of the job on that CarePartner's calendar. For recurring jobs the rule is **all-or-nothing**: either every session locks, or nothing locks and an error is returned. Never a partially locked job.
4. **Mark all other proposed candidates** for this job as `not_selected`, so they are not re-proposed for the same post.
5. **Transition the job post** to `carepartner_selected`.
6. **Send a critical-class push notification** with the loud alarm sound to the chosen CarePartner.
7. **Write a state-transition log** row for auditability and dispute resolution.
8. **Navigate the parent** to the booking detail screen, which shows a live countdown to the commitment deadline.

**Again, to be explicit:** there is no step where the student agrees. The booking is live from the moment the parent taps. The student's only exit is the formal cancel button inside the commitment window, and that exit is scored.

**Idempotency.** To protect against double-taps and flaky networks sending the request twice, the endpoint must accept an idempotency key. Replaying the same key returns the **existing** booking, never a second one.

**Lost race.** If the chosen CarePartner was already taken, the parent receives a clear Vietnamese error ("This CarePartner was just booked for another job, please choose someone else") and the candidate list should refresh to drop that person.

---

## 4. The CarePartner Journey

### 4.1 Declaring availability — mandatory, not optional

Immediately after creating a CarePartner account, the student **must** declare availability. An account with zero declared windows is never proposed by the matcher, and the UI must say so plainly, so the student does not wonder why no jobs arrive.

Declaration works by picking the days of the week (Monday through Sunday) and, for each chosen day, one or more time windows. A single day may hold several disjoint windows, e.g. 08:00–11:00 and 18:00–21:00. The student may edit this schedule at any time.

Example of a typical declared week:

| Day | Free windows |
|---|---|
| Monday | 18:00 – 21:00 |
| Tuesday | 08:00 – 11:00 |
| Wednesday | 18:00 – 21:00 |
| Thursday | *(not available)* |
| Friday | 18:00 – 21:00 |
| Saturday | All day |
| Sunday | Afternoon |

**The implicit contract:** declaring free time is a **potential commitment**. If a parent books exactly that slot, the job is auto-committed and the student is expected to show up.

### 4.2 The three rules for editing availability

This is the most dispute-prone area of the product, so the rules are stated explicitly.

| Rule | Situation | Behaviour |
|---|---|---|
| **1. Free editing** | No booking falls in that window | Edit, delete, add windows freely, no restriction. Declaring Saturday free today and busy tomorrow is perfectly fine. |
| **2. Locked editing** | A booking already falls in that window | The student **may not** silently shrink or delete the window to dodge the job. The system blocks it with a Vietnamese 409 explaining the window carries a booked job. The only exit is the formal cancel flow, with its penalty and compensation consequences. |
| **3. Reschedule request** | Sudden conflict, but the student wants to keep the job | The student sends a reschedule request to the parent (e.g. propose moving 19:00 → 20:00). If the parent agrees, the booking and the calendar both update, both sides are notified, and the cooperative behaviour earns a small ELO bonus. If the parent refuses, the student faces exactly two options: keep the original time, or cancel and take the penalty. **There is no third option.** |

### 4.3 Blackout dates

On top of the repeating weekly schedule, a student can declare **one-off unavailable dates** — an exam day, a trip home, a family event. When declaring a blackout date the system checks whether a booking already sits on it. If yes → blocked with a clear error, forcing the formal cancel path. If no → recorded, and the matcher automatically subtracts that date from the available set.

The availability screen must visually show **which windows are locked because of a booking**, so the student understands why editing is refused instead of receiving a baffling error.

---

### 4.4 The hidden trust score (ELO)

Every student starts at **1200**. The value is always clamped to **[400, 2000]** — no punishment can push below 400 and no amount of good work can exceed 2000.

It is called *hidden* because the user never sees the number. No screen, no client API response may contain it. The only thing a student sees is a qualitative status label, e.g. "Account in good standing", "Replies quickly", "Always on time", "Trusted CarePartner", "Response time needs improvement", or "Currently receiving fewer proposals". At the simplest extreme the system may show nothing at all and simply coordinate silently.

**The score controls four things:** whether the student is proposed at all, how high they rank, whether they get priority for new jobs, and whether they are throttled or blocked entirely.

#### The six trust bands

| Band | Score range | Rank multiplier | Proposal cap | Extra behaviour |
|---|---|---|---|---|
| 🏆 **Trusted** | ≥ 1450 | ×1.15 | — | Almost always at the top of lists |
| ✅ **Good** | 1250 – 1449 | ×1.05 | — | Slight boost |
| 🙂 **Normal** | 1050 – 1249 | ×1.00 | — | Where every newcomer starts |
| ⚠️ **Watch** | 850 – 1049 | ×0.85 | 4 proposals / day | Reduced visibility |
| 🚫 **Restricted** | 650 – 849 | ×0.60 | 1 proposal / day | Only surfaced when the qualified pool is **below 8** — a last-resort option |
| ⛔ **Blocked** | < 650 | — | 0 | **Removed entirely** from every proposal list |

> Band thresholds, multipliers and proposal caps must all live in the `EloBand` database table so admins can tune them without a redeploy. QA should confirm by editing a threshold in the DB and observing the band change with no service restart.

#### The ELO ledger

Every score change — up or down — writes one row to an append-only ledger recording: whose score, by how much, under which standard reason code, which booking it relates to (if any), the score before and after, the timestamp at which a penalty begins to fade (for penalties only), and who performed it when an admin makes a manual adjustment.

The ledger carries a **uniqueness constraint** so the same event on the same booking can never be recorded twice. This makes every background job safely re-runnable without double-crediting or double-penalising.

Band assignment is recomputed on **every** ledger write, and the result is cached on the CarePartner profile so the matcher can read it without recomputing from scratch each time.

#### Earning points

| Good behaviour | Points |
|---|---|
| Completing a job on time | **+12** |
| Receiving a 5-star review | **+10** |
| Receiving a 4-star review | **+6** |
| Receiving a 3-star review | **+1** |
| Written positive review (AI sentiment > 0.6) | **+4** |
| Streak of 3 jobs with no cancellation | **+8** |
| Streak of 5 jobs | **+15** |
| Streak of 10 jobs | **+30** |
| 30 clean days (no cancellation) | **+10** |
| Completing the profile (one-time) | **+5** |
| Replying within 5 minutes (max once/day) | **+2** |
| Proposing a reschedule that the parent accepts | **+1** |
| Parent cancels and it costs the student the job | **+5 or +10** depending on severity |

#### Losing points

| Bad behaviour | Points |
|---|---|
| Cancelling inside the commitment window (T0) | **−5** |
| Cancelling > 24 h before start (T1) | **−15** |
| Cancelling 6–24 h before (T2) | **−30** |
| Cancelling 1–6 h before (T3) | **−50** |
| Cancelling < 1 h before (T4) | **−80** |
| **No-show** — did not arrive, did not notify (T5) | **−150** |
| Serious violation, admin-decided (T6) | **−250** |
| Receiving a bad review (1–2 stars) | **−8** |
| Slow reply 3 times within 7 days | **−6** |
| A parent report verified as legitimate | **−25** (+ possible account suspension review) |
| 3 rejected appeals within 30 days | **−10** (anti-abuse) |

### 4.5 Old mistakes fade

The system is designed **not to punish forever**. Penalties decay; rewards do not.

| Penalty age | Remaining influence |
|---|---|
| 0 – 30 days | **100%** |
| 31 – 90 days | **60%** |
| 91 – 180 days | **25%** |
| Over 180 days | **0%** — ignored entirely |

The experiential consequence matters: one no-show haunts a student heavily for the first month, but if they work well for the following six months the stain effectively disappears. **This is the promised way back.**

Effective score = 1200 + Σ(rewards at full value) + Σ(penalties × decay factor for their age).

> **QA note:** test the exact boundaries. A penalty aged exactly 91 days must use 0.25, not 0.60. A penalty aged exactly 181 days must be ignored completely.

### 4.6 Probation after a serious offence

Separately from decay, a harsher mechanism applies to the two worst violations — **no-show (T5)** and **serious violation (T6)**. After either one, the student enters a **7-day probation period** during which **every reward counts at only 50%**.

Concrete example: yesterday the student no-showed and lost 150 points. Today they complete a job well, nominally worth +12 — but because of probation they actually receive **+6**.

The purpose is to forbid speed-running redemption. Someone who just caused a parent serious harm cannot do one good job the next day and be instantly restored. It takes several good jobs in a row for the system to trust again.

> **QA subtlety:** the **nominal** value written to the ledger is still the full +12. The 50% reduction happens at the *effective score* computation step. This keeps the ledger a faithful record of what happened, and lets the system re-decide later if needed.

---

### 4.7 Force majeure

The system accepts that life happens, and refuses to treat a student in a traffic accident the same as one who works only when they feel like it. When cancelling, the student must pick one of **eight reason codes**.

| # | Reason code | Class | Effect on penalty |
|---|---|---|---|
| 1 | School schedule changed at short notice | **Force majeure** | Penalty × 0.5 |
| 2 | Health problem | **Force majeure** | Penalty × 0.5 |
| 3 | Family emergency | **Force majeure** | Penalty × 0.5 |
| 4 | Accident / transport incident | **Force majeure** | Penalty × 0.5 |
| 5 | Job information was posted incorrectly | **Force majeure** | Penalty × 0.5 |
| 6 | Cannot travel (not an incident) | Ordinary | Full penalty |
| 7 | Personal reason | Ordinary | Full penalty |
| 8 | Other | Ordinary | Full penalty |

**Two anti-abuse layers:**

1. **Minimum explanation length.** Choosing a force-majeure code requires a written note of at least **20 characters**. Writing just "sick" must be rejected and the student asked to describe the situation properly.
2. **Frequency cap.** At most **2 force-majeure reductions per rolling 30 days**. The third one in that window takes the full penalty no matter how legitimate the reason.

> **QA note — a real bug that once existed:** the counter must read from the **cancellation reason code stored on the booking record**, not from the ELO ledger. The ledger stores only the penalty tier (T0…T6), not the force-majeure code, so counting from the ledger always returned zero and the anti-abuse cap never fired. There must be a specific test for "third force majeure within 30 days".

### 4.8 The right to appeal

If a student believes a penalty is unjust, they may appeal **within 7 days** of the penalty being applied. After 7 days the system refuses to accept it.

An appeal contains: a reason, a written explanation, and up to **3 evidence files of max 5 MB each** — e.g. a photo of a medical certificate, a screenshot of the school's schedule-change notice, or a photo of the incident scene.

Appeals are reviewed **manually by an admin** in the web console. AI is deliberately not used to auto-adjudicate at this stage: the decision needs human judgement, and appeal volume in the early phase is low.

| Outcome | Effect |
|---|---|
| **Approved** | A ledger row credits back exactly the amount previously deducted, with a note that this came from a successful appeal; the band is recomputed immediately |
| **Rejected** | A ledger row records the rejection for audit |
| **3rd rejection within 30 days** | Automatic extra −10 for appeal abuse |

**Important:** while an appeal is pending, the penalty **remains in force**. It is not suspended. This blocks the tactic of appealing every penalty purely to buy time.

---

## 5. The Matching Engine

Matching runs in two clearly separated stages: **hard filtering**, then **soft scoring**.

### 5.1 Stage one — hard filters

The system scans all CarePartners and eliminates the ineligible **before scoring anyone**. There are seven elimination reasons.

| # | Elimination reason | Detail |
|---|---|---|
| 1 | Account not in normal standing | Suspended, banned, or identity verification incomplete |
| 2 | No availability overlap | Must be free for the required slot(s). For recurring jobs the student must be free for **all** sessions, not just some — a half-fulfilled job harms both sides |
| 3 | Conflicting existing booking | Already booked in an overlapping slot |
| 4 | Beyond the radius | Outside the student's self-set working radius (default 20 km if unset) |
| 5 | Missing an explicitly required skill | E.g. the parent demanded a specific skill or gender (see 3.6) |
| 6 | Band = `blocked` | Vanishes from every proposal list |
| 7 | Band = `restricted` and the pool is already ≥ 8 | Restricted-band students appear **only** when fewer than 8 qualified candidates exist — strictly a last resort |

**Recurring jobs** are expanded into individual sessions, and availability is checked per session. One conflicting or uncovered session eliminates the student from the entire job. **No partial acceptance.**

### 5.2 Stage two — soft scoring

Survivors are scored 0–100 across seven weighted criteria. The weights must total exactly 100%.

| # | Criterion | Weight | How it is computed |
|---|---|---|---|
| 1 | 📅 **Availability fit** | **25%** | Ratio of required sessions the student covers. Full coverage = full marks; two of three = proportionally lower |
| 2 | 🎓 **Skill / expertise match** | **20%** | Overlap between the student's skill tags (built from major, self-declared skills and job history) and the tags the AI extracted from the post. A primary-education major who has taught primary Maths scores very high for a grade-5 Maths job; a languages major scores much lower for the same job |
| 3 | 📍 **Distance** | **15%** | Linear decay: 0 km = 100 points, at the radius limit = 0, everything between decreasing evenly. Measured from the pinned job location to the student's home or campus, whichever is available and more sensible |
| 4 | ⭐ **Star rating** | **15%** | Linear mapping from the 5-star scale to 0–100. **Brand-new students with no reviews get a neutral 60** — deliberately not penalised, but not artificially boosted above people with real track records |
| 5 | ✔️ **Completion rate** | **10%** | Completed jobs ÷ jobs ever accepted. **New students with zero jobs default to 100%**, same newcomer-friendly spirit |
| 6 | 🛡️ **Hidden trust score** | **10%** | Normalised from the hidden scale onto 0–100. This is the *only* direct channel through which the reward/punishment mechanism affects ranking |
| 7 | ⚡ **Response speed** | **5%** | Share of contacts answered within the SLA |

**Final score** = weighted sum × the multiplier of the student's current trust band.

So the trust score influences ranking through **two parallel channels**: a direct 10% component inside the formula, and an indirect multiplier applied to the whole score. This is intentional and worth explaining to the team, because it makes band demotion significantly more powerful than the 10% alone would suggest.

### 5.3 Deterministic tie-breaking

When two students end up with the same final score, order is decided by three tie-breakers **in this exact sequence**:

1. Higher hidden trust score wins
2. If still tied, closer distance wins
3. If still tied, higher completion rate wins

Ordering must be **stable and reproducible** between runs. Never random.

### 5.4 Configurability and performance

All seven weights, plus every threshold and multiplier, must live in database configuration tables — never in source code. Admins adjust them through the web console and the change takes effect immediately, without a developer redeploying.

> **QA note:** verify this by changing one weight in the DB, re-running the matcher, and observing a different result with no service restart.

**Performance target:** the whole journey from request to ranked list must complete in **under 2 seconds**.

---

## 6. Failure Handling, Penalties & Compensation

### 6.1 The commitment window

After receiving the "you have been assigned a job" notification, the student gets a window to withdraw if they genuinely cannot do it. The window is **not fixed** — it shrinks as the job gets more urgent, because the system needs to reserve the remaining time for finding a replacement.

| Job starts… | Window granted |
|---|---|
| more than 24 h away | **60 minutes** |
| in 6 – 24 h | **30 minutes** |
| in 1 – 6 h | **15 minutes** |
| in under 1 h | **5 minutes** |

**Absolute safety constraint:** the window must always end **at least 5 minutes before the actual job start**. The system never lets a booking become `committed` when only a few minutes remain, because finding a replacement by then is impossible. If the job starts so soon that the computed window is zero or negative, the booking moves **straight to `committed`**.

**Two parallel transition mechanisms** guarantee reliability:

| Mechanism | How it works | Why it exists |
|---|---|---|
| **Scheduled tick** | A background thread runs every minute and sweeps bookings whose deadline has passed | Normal path |
| **Lazy check on read** | Any time anyone reads a booking, the system compares now against the deadline and flips the status on the spot | Safety net if the scheduler dies or lags |

> **QA note:** test both paths. Especially the lazy one — kill the scheduler, then read the booking and confirm the status still updates correctly.

**Timezone discipline:** every time computation in the whole system uses the Vietnam timezone. Mixing timezones between server, database and client produces bugs that are extremely hard to spot, because the system keeps running normally while timestamps drift by hours.

When a booking becomes `committed`, both sides are notified. The student receives: *"The booking is confirmed. You need to be there on time."*

### 6.2 Penalty tiers

The guiding principle: **severity scales with the harm inflicted on the parent**, and harm rises very fast as the cancellation gets closer to the start time. Cancelling early leaves the parent room to manoeuvre; cancelling last minute leaves them stranded.

| Tier | Trigger | ELO delta | Parent compensation |
|---|---|---|---|
| **T0** | Cancels inside the commitment window (before `committed`) | **−5** | None — this is a designed right |
| **T1** | Cancels more than 24 h before start | **−15** | Low % |
| **T2** | Cancels 6 – 24 h before | **−30** | Low % |
| **T3** | Cancels 1 – 6 h before | **−50** | **20%** (confirmed) |
| **T4** | Cancels less than 1 h before | **−80** | Higher % |
| **T5** | **No-show** — did not arrive, did not notify | **−150** | **50%, with a 50,000 VND floor** (confirmed) · also triggers the 7-day probation |
| **T6** | Serious violation, admin-decided (inappropriate conduct with a child, fraud, property damage) | **−250** | **100%** · may include temporary or permanent account suspension |

> **Two values are firmly confirmed** and have been the subject of past confusion: **T3 compensates 20%**, and **T5 compensates 50% with a 50,000 VND floor** — meaning if 50% computes to less than 50,000 VND, the full 50,000 is still credited so the compensation has real meaning.
>
> The complete percentage table for all seven tiers lives in `docs/agent-spec/flow1-step7-cancellation-compensation.md` §7.1 and in the `CancelPolicy` DB table. **QA must read values from the config table or that spec file, never from this document**, because admins can adjust them without a code change.

### 6.3 The nature of compensation

At this MVP stage compensation is **virtual credit in the parent's wallet**, not real money.

| Property | Value |
|---|---|
| Currency | Virtual credit (VND-denominated, non-withdrawable) |
| Use | Offsets the platform service fee on future jobs |
| Withdrawal | **Impossible** — no withdraw endpoint or UI may exist |
| Real money charged to the student? | **No** |
| What the student actually loses | Trust score — the punishment with real long-term weight, because it governs their ability to earn |

> **QA note:** confirm no endpoint and no UI allow credit to leave the system.

**Ledger discipline:** every credit movement — credited as compensation, or spent — writes a transaction row with amount, resulting balance, transaction type, related booking if any, and timestamp. The wallet balance **may never go negative**.

**Atomicity:** applying the penalty tier, deducting ELO, crediting the parent and sending notifications all happen inside **one database transaction**. There must never be a state where points were deducted but the parent was not compensated, or vice versa.

**Value freezing:** the job's monetary value is frozen at the moment the parent selects. If the parent later edits the hourly rate, compensation is still computed on the originally agreed figure.

### 6.4 Automatic no-show detection

The system cannot rely on a student self-reporting that they flaked, so it detects the case itself. A background thread runs **every minute**, scanning bookings in `in_progress` that have not been marked started, and compares the current time against the session's scheduled start. If **15 minutes** have passed with no start action, it concludes a no-show.

The conclusion triggers an automatic chain: status → `no_show`; −150 ELO applied; 7-day probation activated; the highest-tier credit compensation moved into the parent's wallet; both parties notified; and the replacement engine started.

The parent also has a manual **"Report no-show"** button on the booking detail screen, useful if the scheduler fails or in edge cases the system cannot recognise on its own.

> **Scope note:** presence is currently established via the start action plus parent confirmation. **GPS check-in is not implemented.** Adding it would require new location permissions and a privacy-policy update, which could affect app-store review, so it is deferred.

### 6.5 Automatic replacement

When a booking is cancelled or flaked, the system must **not** merely apologise and stand still — the parent is still stranded. Replacement starts immediately.

1. **Re-run the matcher** on the same job, with two exclusions: the student who just cancelled cannot reappear, and anyone in the `blocked` band is excluded. Everything else in filtering and scoring is unchanged.
2. **If candidates are found**, the parent is notified at once: *"We found N other suitable CarePartners for your job. Would you like to view their profiles?"* — with the fresh shortlist attached so they can pick immediately instead of starting over.
3. **If nobody is found**, the parent receives an honest message: *"No suitable CarePartner is available right now. We will notify you when someone new appears."* The post moves to `needs_replacement` and a background job retries **every 30 minutes for 6 hours**. If still nothing after 6 hours, the system **alerts the admin team** for human intervention — proactively contacting students or phoning the parent to discuss options.

Every retry writes a `ReplacementAttempt` record with the run time, how many candidates were found, and the final status. This lets admins see which jobs are stuck and need priority handling.

### 6.6 When the parent is the one who cancels

Fairness requires acknowledging that parents also cause disruption. A student may have rearranged their schedule, or turned down another opportunity. If the parent cancels late, the student is the one who loses.

| Parent cancels… | Consequence |
|---|---|
| More than 24 h before | Nothing — a normal right |
| Within 24 h | Student credited **+5** ELO compensation |
| Within 3 h | Student credited **+10** ELO, **and** a warning flag is recorded on the parent's account |

At this stage there is **no full trust-score system for parents** — only warning flags that admins monitor. A parent accumulating too many late-cancellation flags may face measures such as a cap on simultaneous posts or additional verification. A full parent scoring system is deferred until real behavioural data exists.

When a parent cancels, the student must be notified **immediately at critical class**, stating clearly that the job was cancelled, that their trust score is unaffected, and that they in fact receive a compensation bonus. This transparency matters enormously for retention: a student who feels treated unfairly leaves the platform.

### 6.7 Preventing double-booking and enforcing the rest gap

This is arguably the most technically important section, because getting it wrong collapses the experience for both sides.

**The dangerous scenario.** Student A declares Friday evening free. Two different parents both see A in their shortlists and both tap "select" at nearly the same moment. A naive implementation creates both bookings; A cannot possibly fulfil both, is forced to cancel one, and unfairly eats a penalty. **This is the worst possible experience and must be prevented absolutely.**

**Two-layer defence:**

| Layer | Mechanism | Purpose |
|---|---|---|
| **Soft hold** | When a student opens a job's detail view, the involved slots are marked held for **5 minutes**; if no further action occurs, the hold auto-releases | Reduces the chance of collision in that exact instant |
| **Hard lock** | At the moment the parent taps select, the system re-checks inside a transaction **with row-level locking**, and only then hard-locks and creates the booking | The decisive layer |

Row-level locking at the database layer is **mandatory**. A check-then-write without locking still lets two parallel requests both pass the check.

**Required outcome:** if 50 concurrent requests select the same student for the same slot, **exactly one succeeds** and the other 49 receive a conflict error with a clear code.

> **QA note:** this must be tested with genuinely concurrent threads. A sequential test will never expose a race condition.

**Recurring jobs follow all-or-nothing.** If a job spans Monday, Wednesday and Friday and Wednesday is already taken, the system must not lock the other two and create a crippled booking. It must reject the whole thing and tell the parent specifically which dates conflict, so they can change the schedule or pick someone else.

**Lock release.** Hard locks are released when a booking reaches a terminal state — completed, cancelled, or replaced. Forgetting to release silently strips the student of that window forever with no explanation. This is a dangerous quiet bug and must be tested explicitly.

#### The 90-minute rest gap

Beyond overlap prevention there is a more humane rule: a student may not hold two back-to-back jobs. Between two consecutive jobs on the same day there must be **at least 90 minutes**.

| Existing job | New job | Result |
|---|---|---|
| 18:00 – 19:00 | 19:30 – 20:30 | ❌ **Rejected** — only 30 min gap |
| 18:00 – 19:00 | 20:00 – 21:00 | ❌ **Rejected** — only 60 min gap |
| 18:00 – 19:00 | 20:30 – 21:30 | ✅ **Accepted** — exactly 90 min |

**Rationale:** students need time to travel between two locations and to eat or rest briefly. Forcing back-to-back jobs sharply raises the probability of lateness or exhaustion-driven no-shows — and the ones who ultimately suffer are the parents.

The check happens **at selection time**: if accepting this job would violate the gap against an existing one, the system refuses up front rather than creating the booking and discovering the conflict later.

> Exactly 90 minutes must be **accepted**. Test the boundary. The 90-minute value itself is a DB config, not a hardcoded constant, so it can be tuned once real travel-time data exists.

---

## 7. Notifications & Sound

### 7.1 The three notification classes

| Class | Events | Sound |
|---|---|---|
| **Critical** | New job assigned · job cancelled by parent (student loses work) · recorded as no-show | **Loud custom alarm — mandatory** |
| **Important** | Commitment window about to expire · job starting in 1 hour · parent sent a message | Standard notification sound |
| **Normal** | Job completed · new review received · trust band changed | Silent |

### 7.2 Android implementation

Critical-class notifications must be delivered through a **dedicated notification channel** set to the highest importance the OS allows, declared with a **custom alarm sound file** roughly 30 seconds long and loud enough to wake a sleeping person or cut through ambient noise. It carries a distinctive vibration pattern stronger than the default, permits full content on the lock screen, and enables the notification light.

The sound file must be **packaged into the installed build** through a config plugin — merely existing in the project's assets folder is not enough.

> ⚠️ **Two severe bugs of exactly this kind have already occurred in this project, and both passed unit tests while the real product was broken.** Understanding them is essential for anyone testing this feature.
>
> **Bug A — the sound file was never packaged.** The WAV existed in the project, and the packaging plugin had been written, but the plugin was **never declared in the Expo config file**. Consequently `expo prebuild` never ran it, the WAV never landed in Android's raw resources folder, and on a real device the notification played only the default system tone. The unit test passed because it merely asserted the file existed **on disk**, not that it was **bundled**.
>
> **Bug B — the channel never existed on the device.** The channel was defined inside a component's code, but that component was **never mounted** in the app's root tree. The app registered six other channels at startup but not this one. Android, unable to find the specified channel, silently ignores the sound. Meanwhile the server was sending exactly that channel id in the push payload.
>
> **Lesson:** a channel identifier that mismatches between server and client by even a single character causes total, silent failure of the whole sound mechanism. **QA must build a real Android artefact and inspect the raw resources folder**, and must verify the listening component is actually mounted at startup. Runtime proof, not source-code reading.

### 7.3 Web implementation

Web notifications must also carry sound, using the browser Notification API combined with an audio element, and must fall back to an **in-page banner** when the user has blocked browser notification permission.

### 7.4 An honest platform limitation

On **iPhone**, when the user flips the hardware silent switch, iOS does **not** allow third-party apps to force sound playback — unless the app has been granted a special Critical Alerts entitlement by Apple, and that approval process is difficult. This is an **operating-system limitation, not a product defect**. It must be documented explicitly so the team does not misunderstand it or over-promise to the judges. **The project currently targets Android only.**

### 7.5 Key notification copy (Vietnamese, as specified)

| Event | Message |
|---|---|
| Job assigned to student | "Bạn được giao đơn này vì bạn đã khai rảnh vào khung giờ đó. Vui lòng xem chi tiết. Nếu không thể thực hiện, hãy hủy trong thời gian cho phép." |
| Booking committed | "Đơn đã được xác nhận. Bạn cần có mặt đúng giờ." |
| Student cancelled → parent | "CarePartner {name} vừa hủy công việc. Hệ thống đang tìm người thay thế phù hợp cho bạn." |
| Last-minute cancellation → parent | "CarePartner {name} vừa hủy lịch. Bạn có muốn xem danh sách CarePartner thay thế không?" |
| No replacement found | "Hiện tại chưa có CarePartner phù hợp ngay. Hệ thống sẽ thông báo khi có người mới." |
| Replacement found | "Chúng tôi tìm thấy CarePartner {name} phù hợp với công việc của bạn. Bạn có muốn xem hồ sơ không?" |

---

## 8. User-Facing Surfaces

### 8.1 Mobile — parent screens

All screens must be reachable via clearly labelled Vietnamese buttons on the main screens. **No orphan screens are permitted.**

| Screen | Content |
|---|---|
| Job type select | Exactly 3 buttons |
| Tutoring / Childcare / Pickup forms | One per job type, fields per §3 |
| Candidate list | Max 8 cards, pull-to-refresh, Vietnamese empty state |
| Candidate profile | Full detail of one applicant |
| Booking detail | Live countdown, Vietnamese status label, cancel flow with 8 reason codes, "Report no-show" button |
| Credit wallet | Balance + transaction history |

The parent home screen must carry a **dedicated matching section with four buttons**: *Register a new job* · *View suitable candidates* · *Current bookings* · *My credit wallet*.

### 8.2 Mobile — CarePartner screens

| Screen | Content |
|---|---|
| Weekly availability | 7 days, multiple windows per day, editable any time, locked windows visibly marked |
| Blackout dates | One-off unavailable days |
| My bookings | List of the student's jobs |
| Booking detail | Shared with the parent flow |
| Appeal | Submit an appeal with evidence |

The student profile screen must carry a **matching section with four buttons**: *Availability* · *Blackout dates* · *My bookings* · *Appeal*.

> ⚠️ **A severe bug of this exact kind already happened here.** At one point all twelve new screens of this flow had been fully written, yet **none was registered in the navigator**, and **no button on any main screen led to them**. The source code existed but a real user had absolutely no way to reach the feature. Unit tests stayed green because they tested each screen in isolation.
>
> **Lesson:** there must be a test asserting that every screen appears in the navigator **and** has at least one real inbound navigation call. A render smoke test for every screen is also required — one screen once crashed instantly on mount because a React hook was used but never imported, which no static wiring test could catch.

### 8.3 Universal UI requirements

Every screen must implement **three auxiliary states**:

| State | Requirement |
|---|---|
| Loading | A visible loading indicator |
| Empty | Friendly Vietnamese copy **plus a suggested next action** |
| Error | Vietnamese copy plus a retry button |

No screen may display mock or hardcoded data. Everything comes from real endpoints. Every fetch URL in the mobile API layer must correspond to an actually existing backend route — mismatches must be reported.

### 8.4 Web (Django prototype frontend)

Eleven pages with memorable unaccented Vietnamese paths:

| Path | Page |
|---|---|
| `/dang-viec/` | Job type selection (3 buttons) |
| `/dang-viec/gia-su/` | Tutoring form |
| `/dang-viec/trong-tre/` | Childcare form |
| `/dang-viec/don-tre/` | Pickup form |
| `/ung-vien/<job_id>/` | Candidate list (max 8) |
| `/don/<booking_id>/` | Booking detail with countdown |
| `/vi-credit/` | Credit wallet |
| `/lich-ranh/` | CarePartner weekly availability |
| `/ngay-ban/` | Blackout dates |
| `/don-cua-toi/` | CarePartner's own bookings |
| `/khang-cao/<booking_id>/` | Appeal form |

These pages must **reuse the existing base layout and Tailwind stylesheet** so the product looks unified rather than like two apps stitched together. They call the existing `/api/matching/*` endpoints and **must not duplicate business logic** into the view layer — doing so creates two competing sources of truth that inevitably diverge.

### 8.5 Web admin console

| Screen | Function |
|---|---|
| Trust bands | Edit the six band thresholds, multipliers and proposal caps |
| Matching weights | Edit the seven scoring weights (must total 100%) |
| Appeals | Approve / reject CarePartner appeals |
| State transition logs | Audit trail by booking or by user |
| Bookings | List and filter by status |
| Jobs | List posts with their AI parse results |

Configuration changes here take effect **immediately without redeployment**. The admin console must be **actually deployed to production**, not merely runnable on a dev machine — it is the operations team's daily tool.

---

## 9. MVP Limitations & Roadmap

This is a minimum viable product built for a startup competition. Several things are **deliberately not done**. State them proactively to the judges together with the roadmap — that demonstrates scope awareness rather than revealing a gap.

| # | Not implemented | Current state | What Phase 2 requires |
|---|---|---|---|
| 1 | **Real-money payments** | All compensation is virtual credit; no real money flows; no escrow or pre-authorization of parent funds | A full e-wallet layer plus escrow — substantial work, not a config change |
| 2 | **Full iOS support** | Android only | Even with full iOS work, the silent-switch limitation persists (§7.4). Plus the Apple Developer annual fee, which the project cannot yet afford |
| 3 | **Parent trust score** | Only warning flags recorded; no full scoring, no automatic restrictions | Build a parent scoring ladder once real behavioural data exists |
| 4 | **GPS presence verification** | No-show detection relies on the start action + parent confirmation | Requires new location permissions and a privacy-policy update, which may affect store review |
| 5 | **AI self-learning loop** | Weights are human-set and manually tuned via the admin console | Feed real match outcomes back to auto-tune weights |

---

## 10. QA Test Checklist

Every item below must be proven by an **executable test**, not by reading source code.

### 10.1 Job posting

- [ ] Only the three valid `job_type` values are accepted; anything else returns 400
- [ ] Tutoring subject accepts non-school values such as "MC" and "life skills"
- [ ] Past dates are rejected
- [ ] End time earlier than start time is rejected
- [ ] Childcare with an empty care-duties list is rejected
- [ ] Pickup with `destination_type = other_address` requires a destination map point
- [ ] Map picker supports address search, current-location button, and manual pin drag
- [ ] Hourly rate must be greater than zero

### 10.2 AI parsing

- [ ] A natural-language post yields the correct structured fields
- [ ] Gender preference is honoured for childcare/pickup
- [ ] Gender preference is **ignored** for tutoring, with a polite notice shown
- [ ] Low AI confidence triggers a clarification question to the parent
- [ ] AI service failure falls back to rule-based parsing without hanging

### 10.3 Matching

- [ ] Candidate count never exceeds 8 regardless of pool size; `total_matched` reports the true total
- [ ] The four Vietnamese match-level labels match the spec strings **exactly**
- [ ] All seven hard filters eliminate correctly
- [ ] `blocked` band never appears; `restricted` appears only when pool < 8
- [ ] New students (no rating, no jobs) receive neutral defaults, not zero
- [ ] Recurring job: a student missing one session is eliminated from the whole job
- [ ] Tie-break order is deterministic: ELO → distance → completion rate
- [ ] Changing a weight in the DB alters results **without a service restart**
- [ ] Response time under 2 seconds

### 10.4 Booking & commitment

- [ ] Selecting a candidate creates `awaiting_commitment` with **no** student action
- [ ] All slots are hard-locked atomically; recurring jobs are all-or-nothing
- [ ] **50 concurrent threads** on the same slot produce exactly 1 success and 49 conflict errors
- [ ] Commitment window computes correctly at all four lead-time boundaries
- [ ] Window is capped to end ≥ 5 min before start; ≤ 0 yields immediate `committed`
- [ ] Status flips to `committed` on expiry **via the scheduler**
- [ ] Status flips to `committed` on expiry **via lazy read with the scheduler disabled**
- [ ] Replaying the same idempotency key returns the original booking, never a duplicate
- [ ] Locks are released when a booking reaches a terminal state

### 10.5 Buffer rule

- [ ] 18:00–19:00 followed by 19:30–20:30 → **rejected** (30 min)
- [ ] 18:00–19:00 followed by 20:00–21:00 → **rejected** (60 min)
- [ ] 18:00–19:00 followed by 20:30–21:30 → **accepted** (exactly 90 min)
- [ ] Jobs on different days → no buffer applied

### 10.6 ELO & decay

- [ ] New CarePartner starts at 1200, band `normal`
- [ ] Score clamps at 400 and 2000
- [ ] Decay boundary at exactly 91 days uses 0.25, not 0.60
- [ ] Decay boundary at exactly 181 days is ignored completely
- [ ] Reward during the 7-day probation counts at 50%
- [ ] The ledger stores the **nominal** value; the reduction happens at effective-score computation
- [ ] The same event cannot be recorded twice (uniqueness constraint)
- [ ] **No serializer exposes the hidden or effective score to any client**

### 10.7 Cancellation, force majeure & appeals

- [ ] Each tier T0–T6 applies the correct ELO delta
- [ ] T3 compensates the parent 20%; T5 compensates 50% with the 50,000 VND floor
- [ ] No-show is detected automatically at start + 15 min and applies T5 plus probation
- [ ] Force-majeure note shorter than 20 characters → rejected
- [ ] Force-majeure note ≥ 20 characters → penalty halved
- [ ] **Third** force majeure within rolling 30 days → full penalty
- [ ] Appeal after 7 days → rejected
- [ ] Approved appeal credits back exactly the deducted amount and recomputes the band
- [ ] Third rejected appeal in 30 days → automatic −10
- [ ] Wallet balance never goes negative; every movement is logged
- [ ] **No withdraw endpoint or UI exists**

### 10.8 Availability & blackout

- [ ] Blackout date conflicting with an existing booking → rejected
- [ ] Deleting or shrinking an availability window that carries a booking → rejected with a Vietnamese message
- [ ] Locked windows are visibly marked in the UI
- [ ] Reschedule request requires parent approval; acceptance updates both booking and calendar

### 10.9 Replacement

- [ ] Replacement re-run excludes the cancelling student and the `blocked` band
- [ ] Candidates found → parent notified with the new shortlist
- [ ] No candidates → honest message, post moves to `needs_replacement`, retries every 30 min for 6 h, then alerts admins
- [ ] Every retry writes a `ReplacementAttempt` row

### 10.10 Notifications & sound

- [ ] **Build a real Android artefact** and confirm the alarm WAV is present in the raw resources folder
- [ ] The listening component is actually mounted at app startup
- [ ] The channel id in the server push payload matches the client-side channel id **character for character**
- [ ] Critical class plays the custom sound; important class plays the standard tone; normal class is silent
- [ ] Web notification plays sound and falls back to an in-page banner when permission is blocked

### 10.11 Navigation & UI completeness

- [ ] All 12 mobile screens are registered in the navigator
- [ ] All 12 screens have at least one real inbound navigation call from a visible Vietnamese button
- [ ] **Render smoke test for every Flow-1 screen** — mounts without throwing
- [ ] Every screen implements loading, empty (Vietnamese + suggested action) and error (Vietnamese + retry) states
- [ ] No screen contains mock or hardcoded data
- [ ] Every fetch URL in the mobile API layer exists in the backend routes
- [ ] All 11 web pages resolve and render with the shared layout

### 10.12 Configuration & hygiene

- [ ] Editing a band threshold or a scoring weight in the admin console takes effect without redeployment
- [ ] No absolute personal/dev machine path anywhere in tracked source
- [ ] No secret file (service-account JSON, private key, `.env`) is tracked in git
- [ ] All time computations use the Vietnam timezone

---

## Appendix A — State Machines

### A.1 Job post states (13)

| State | Vietnamese label | Meaning |
|---|---|---|
| `draft` | Bản nháp | Parent is composing, not yet submitted |
| `published` | Đã đăng | Submitted |
| `ai_parsing` | AI đang phân tích | Gemini is reading it |
| `parsed` | Đã phân tích xong | Structured requirement ready |
| `matching` | Đang tìm CarePartner | Matcher running |
| `carepartner_selected` | Đã chọn CarePartner | Parent picked someone |
| `awaiting_commitment` | Đang chờ cam kết | Inside the commitment window |
| `confirmed` | Đã xác nhận | Committed |
| `in_progress` | Đang thực hiện | Job under way |
| `completed` | Hoàn thành | Finished successfully |
| `cancelled` | Đã hủy | Cancelled |
| `needs_replacement` | Cần người thay thế | Waiting for a substitute |
| `disputed` / `expired` / `archived` | Có tranh chấp / Hết hạn / Đã lưu trữ | Terminal branches |

### A.2 Booking states (16)

| State | Vietnamese label |
|---|---|
| `proposed` | Được đề xuất |
| `parent_selected` | Phụ huynh đã chọn |
| `request_sent` | Đã gửi yêu cầu cho CarePartner |
| `awaiting_commitment` | Đang chờ cam kết |
| `committed` | Đã cam kết |
| `in_progress` | Đang thực hiện |
| `awaiting_review` | Chờ đánh giá |
| `completed` | Hoàn thành |
| `declined_in_window` | Từ chối trong thời gian cho phép |
| `cancelled_by_carepartner` | CarePartner hủy |
| `cancelled_by_parent` | Phụ huynh hủy |
| `no_response` | Không phản hồi |
| `no_show` | Không đến làm |
| `disputed` | Có tranh chấp |
| `replacement_needed` | Cần thay thế |
| `replaced` / `refunded` | Đã thay thế / Đã hoàn credit |

### A.3 Transition discipline

The system must **reject any transition not on the allowed list** — e.g. jumping from `draft` straight to `completed`, or reverting `committed` back to `proposed`. Every legal transition writes a log row containing entity type, entity id, previous state, new state, who triggered it (or whether a background job did), the reason if any, and the exact timestamp.

This log is invaluable for resolving complaints, because it reconstructs precisely what happened. The admin console must expose it, searchable by booking or by user.

Every state has a **Vietnamese display label** so users never see raw technical strings like `awaiting_commitment`.

---

## Appendix B — The 17 Business-Rule Assertions

The repository ships an executable assertion script (`scripts/g13_business_rules.py`, also runnable as `python manage.py run_g13_checks`). Every release must report **17/17 PASS**. These are the assertions:

1. Buffer: 18:00–19:00 then 19:30–20:30 for the same student same day → violation; 20:30–21:30 → OK
2. Max 8: seed 20 eligible students → `len(candidates) == 8` and `total_matched == 20`
3. Auto-commit: selecting creates `awaiting_commitment` with **no** student action and hard-locks **all** slots atomically
4. Concurrency: 50 threads on the same student+slot → exactly 1 created, 49 rejected `slot_taken`
5. Commitment window: 30 h→60 min, 10 h→30 min, 3 h→15 min, 30 min→5 min, 4 min→0 (immediate)
6. Cancel T3 → ELO −50 **and** parent credit == 20% of the frozen job value
7. No-show (start + 15 min, never started) → `no_show`, ELO −150, parent credit 50% with 50,000 VND floor
8. Force majeure `health` with note < 20 chars → 400; with ≥ 20 chars → penalty × 0.5
9. Third force majeure within rolling 30 days → **full** penalty
10. Decay: penalty backdated 100 days → effective × 0.25; 200 days → ignored
11. Probation: reward applied 3 days after a T5 → counts at 50%
12. Blackout conflicting with an existing booking → 409
13. Deleting an availability window that carries a booking → 409 `availability_locked_by_booking`
14. Replacement re-run excludes the cancelling student **and** the `blocked` band
15. **No serializer exposes the hidden or effective trust score**
16. Lock-conflict scoping: a booking of student A on job X must **not** block A's other free windows, and must **not** block other students on unrelated jobs
17. Force-majeure anti-abuse counter reads the booking's cancellation reason code (not the ledger's tier codes), so it actually fires on the third occurrence

---

## Appendix C — Key Numbers & Glossary

### C.1 Quick-reference numbers

| Value | Where it applies | Configurable? |
|---|---|---|
| 3 | Job types | No — fixed product decision |
| 8 | Maximum candidates returned | Yes (`MatchingConfig`) |
| 90 min | Rest gap between consecutive jobs | Yes (`MatchingConfig`) |
| 1200 | Starting trust score | Yes (`MatchingConfig`) |
| 400 – 2000 | Trust score clamp range | Yes |
| 6 | Number of trust bands | Yes (`EloBand` table) |
| 7 | Scoring factors | Yes (`MatchingWeight`) |
| 25 / 20 / 15 / 15 / 10 / 10 / 5 | Default weight distribution (sums to 100) | Yes |
| 60 / 30 / 15 / 5 min | Commitment windows by lead time | Yes |
| 5 min | Minimum safety margin before job start | Yes |
| 7 | Penalty tiers (T0–T6) | Yes (`CancelPolicy`) |
| −5 / −15 / −30 / −50 / −80 / −150 / −250 | ELO deltas per tier | Yes |
| 20 | Minimum force-majeure note length (chars) | Yes |
| 2 per 30 days | Force-majeure reduction cap | Yes |
| 7 days | Probation after T5/T6 · appeal deadline | Yes |
| 50% | Reward multiplier during probation | Yes |
| 1.00 / 0.60 / 0.25 / 0.00 | Decay factors at 0–30 / 31–90 / 91–180 / 180+ days | Yes |
| 15 min | No-show detection threshold after scheduled start | Yes |
| 30 min × 6 h | Replacement retry cadence and duration | Yes |
| 20 km | Default working radius | Yes (per-student override) |
| 60 | Neutral rating score for students with no reviews | Yes |
| < 2 s | Matching response-time target | — |
| 3 files × 5 MB | Appeal evidence limits | Yes |

### C.2 Glossary

| Term | Meaning |
|---|---|
| **CarePartner** | A student providing tutoring, childcare or pickup services |
| **Parent** | The customer posting a job |
| **Job post** | A parent's listing, expanded into one or more sessions |
| **Session / Slot** | A single date + time window within a job post |
| **Booking** | The link between one job post and one CarePartner, with its own lifecycle |
| **Auto-commit** | A booking becomes live on parent selection, with no worker acceptance step |
| **Commitment window** | The period during which the CarePartner may withdraw at the lowest penalty tier |
| **Hidden ELO** | The invisible trust score governing ranking and proposal frequency |
| **Band** | One of six trust tiers, each with a rank multiplier and optional proposal cap |
| **Effective score** | Hidden score after applying decay factors to aged penalties |
| **Probation** | 7-day period after T5/T6 during which rewards count at half value |
| **Force majeure** | Cancellation reasons that halve the ELO penalty, subject to a note and a frequency cap |
| **T0 – T6** | The seven cancellation penalty tiers |
| **Credit** | Virtual, non-withdrawable compensation currency in the parent's wallet |
| **Blackout date** | A one-off day a CarePartner marks unavailable |
| **Soft hold / Hard lock** | Two-layer schedule protection against double-booking |
| **Buffer** | The mandatory 90-minute rest gap between consecutive jobs |
| **Replacement** | Automatic re-matching triggered by a cancellation or no-show |
| **State transition log** | The audit trail of every legal status change |

---

*End of document · English edition · Companion to `docs/EduCareLink_HeThongGhepNoi.docx`*
