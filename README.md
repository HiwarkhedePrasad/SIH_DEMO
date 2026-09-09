# HCLTech GET Prep Agent — Nagpur 3.75 LPA

Evidence-based preparation site for the HCLTech Graduate Engineer Trainee (GET) first filter — Nagpur Ascend track (₹3.75 LPA, 2027 batch, Python).

Researched Sep 2026. Covers Research → Verify → Analyze → Prioritize → Prepare → Test → Adapt.

## What's inside

- **Research + Roadmap (`index.html`)** — What the process actually is (CONFIRMED / HIGHLY LIKELY / UNCERTAIN), opportunity analysis for Python + PL/SQL + AWS/Azure, most-likely assessment structure, P0→P3 roadmap, difficulty estimate, adaptive profile dashboard.
- **MCQ Bank (`mcq.html`, 130 Qs)** — Python 25 · SQL 20 · Quant 20 · Logic 20 · Verbal 15 · Pseudocode 10 · CS 10 · Cloud 10. Click-to-answer with explanations, filters by topic / priority / difficulty, search + shuffle.
- **Coding Bank (`coding.html`, 35 Qs)** — Easy (~60%) / Easy-Medium (~30%) / Medium (~10%) with Python solutions. Each Q: understanding → thinking → brute force → optimized → dry run → solution → complexity → mistakes → pattern.
- **Mock Tests (`mocks.html`, 3 × 90 min)** — 27 MCQ (60 min) + 2 coding (30 min). Timed, submit-to-evaluate with score, accuracy, topic + difficulty breakdown, strengths/weaknesses, next-study plan, readiness verdict. History saved.
- **Guide + Cheat Sheet (`guide.html`)** — 8-step coding framework, anti-stuck protocol, Top-25 final revision list, 1-day cheat sheet, exam-day checklist.
- **Adaptive profile** — All attempts tracked in `localStorage` (`hcl_profile`, `hcl_coding_done`, `hcl_mock_hist`). Readiness meter on home page: Not assessed / Low / Moderate / Good / Strong.

## Project structure

```
.
├── vercel.json             # Vercel: / -> /hcltech/
├── hcltech/
│   ├── index.html          # Research + Roadmap + dashboard
│   ├── mcq.html            # MCQ Bank (130)
│   ├── coding.html         # Coding Bank (35)
│   ├── mocks.html          # 3 Mock Assessments
│   ├── guide.html          # Guide + Cheat Sheet
│   └── assets/
│       ├── css/style.css   # Dark theme, signal-yellow accent
│       └── js/
│           ├── app.js          # store, adaptive profile, readiness, nav, PDF button
│           ├── mcq-data-a.js   # Python / SQL / Pseudo / CS (65 Qs)
│           ├── mcq-data-b.js   # Quant / Logic / Verbal / Cloud (65 Qs)
│           ├── coding-data.js  # 35 coding Qs + solutions
│           └── mock-data.js    # 3 mock definitions (indices into banks)
└── README.md
```

No build step. Vanilla HTML/CSS/JS only.

## Run locally

Option 1 — just open:
```bash
# double-click hcltech/index.html, or
start hcltech/index.html
```

Option 2 — local server (recommended, avoids `file://` quirks):
```bash
# from repo root
# Python
python -m http.server 8000
# then open http://localhost:8000/hcltech/

# Node
npx serve .
# then open /hcltech/
```

> Note: pages currently reference absolute paths like `/hcltech/assets/...`.
> For local root serve or GitHub Pages, either:
> - serve from a `/hcltech/` base, or
> - replace `/hcltech/` with `./` / relative paths.

## Deploy

- **Vercel:** already configured via `vercel.json` (`/` → `/hcltech/`). Just `vercel --prod` or connect the repo in Vercel dashboard.
- **GitHub Pages:** Repo Settings → Pages → Deploy from branch → `main` / `/ (root)`, then open `https://<user>.github.io/placement_prep/hcltech/`.
  Note: pages currently use absolute paths like `/hcltech/assets/...`, which work on Vercel and on Pages only under a `/hcltech/`-based URL scheme. For a plain root deploy, switch links to relative paths.

## Most-likely first filter (summary)

| Section | Likely Qs | Time | Weight |
|---|---|---|---|
| Quant | 12–15 | ~18–20 min | Qualifying |
| Logical + Analytical + Critical | 30–45 | ~35–50 min | Qualifying |
| Verbal / English | 10–15 | ~15–18 min | Qualifying + Versant preview |
| Pseudocode + CS fundamentals | 20–30 | ~20–30 min | HIGH |
| Coding (Python) | 1–2 | ~20–30 min | HIGHEST — must solve ≥1 |

No negative marking (reported). Attempt all. ~1 min/MCQ, save 25 min for coding. Never leave coding blank.

## Roadmap (P0 → P3)

- **P0 Critical:** Python basics, SQL/DBMS, pseudocode/output prediction, Quant speed + Logical, easy coding patterns.
- **P1 High:** OOP, OS + Networking basics, Verbal + Versant speaking, basic cloud concepts (IaaS/PaaS/SaaS, EC2/S3, Azure VMs/Blob).
- **P2 Medium:** Stack/queue/linked-list concepts, recursion traces, sorting complexity, HR + GD prep.
- **P3 Low:** Advanced DSA, system design, hands-on AWS labs, deep PL/SQL. No competitive programming needed for Ascend filter.

7-day plan in `index.html`: Day 1–2 Python+SQL · Day 3 Quant+Logical · Day 4 Pseudo+OOP/OS · Day 5 Cloud+Verbal+HR · Day 6 Mocks 1+2 · Day 7 Mock 3 + cheat-sheet.

## Sources

HCLTech official campus-hiring page (AMP FAQ) + GeeksforGeeks 2024/2025 GET experiences + knoffcampusjobs / alljobresults 2025 patterns + LinkedIn 2025 experiences + Parul 2025 drive report. Labels A/B/C applied in-page.

## Disclaimer

Mocks and banks are **HCLTech GET-Oriented (not official)**. Patterns are inferred from 2024–2026 candidate reports and may vary by drive/platform (CoCubes / AMCAT / HackerRank).

## License

For personal interview preparation use.
