# PS 26083 — Strategic Decision Document

## Extreme Heatwave Early Warning \& Human Thermal Stress Index

### A Mentor Review of "AeroTherma AI" vs "HeatShield India"

\---

## 0\. Bottom Line (Read This First)

|||
|-|-|
|**Better raw foundation**|**Approach 2 — HeatShield India**|
|**Better pitch narrative**|Approach 1 — AeroTherma AI|
|**Recommended path**|**Merge, but let HeatShield's architecture and intellectual honesty lead. Borrow AeroTherma's storytelling, judge-defense prep, and closed-loop dispatch depth. Cut both documents down to a buildable MVP.**|
|**Single biggest risk if you pick Approach 1 as-is**|Fabricated-looking precision numbers ("87.4% correlation," 187-tissue-node simulation) in front of actual NCMRWF/MoES scientists. This is the kind of claim that gets a team eliminated in Q\&A, not selected.|
|**Single biggest risk if you pick Approach 2 as-is**|Scope creep. 13 MVP features across 4+ satellite/geospatial datasets is more than most teams finish in a hackathon window — a half-built ambitious system loses to a fully-working modest one.|

Think of this like a durbar: Approach 1 is the general who promises to conquer five kingdoms and might deliver one, loudly. Approach 2 is the general with a real supply chain who promises two kingdoms and delivers both. **Judges remember what worked on stage, not what was promised in the deck.**

\---

## 1\. What Each Approach Actually Is

### Approach 1 — "AeroTherma AI" (from `PS\_26083\_HEATWAVE\_UTCI\_BLUEPRINT.md`)

A **biology-forward narrative document**, explicitly written for a "Bio/Biotech + CSE" hybrid team. Its center of gravity is the *physiological science* — deriving Mean Radiant Temperature, presenting UTCI as a full multi-node human heat-exchange simulation, and building a demographic-weighted "Ward Risk" formula that feeds a mortality/hospitalization spike predictor. It closes with cost tables, an ROI pitch, a rehearsed judges' Q\&A script, and a 36-hour hour-by-hour build plan.

### Approach 2 — "HeatShield India" (from `HeatShield\_India\_Solution\_Plan.md`)

A **systems/data-engineering document**. It explicitly declines to invent new physiological formulas ("*do not invent an unvalidated physiological equation... use established indices*"), and instead builds a layered pipeline: meteorology → urban/vegetation features (NDVI, LST, building density) → UTCI/WBGT (via standard formulas) → an India-calibrated ML model (XGBoost + SHAP) → risk-to-action translation. It's citation-backed (real papers, real datasets with links), includes a government dashboard *and* a citizen-facing portal, and ends with a concrete tech stack and a scoped hackathon MVP list.

\---

## 2\. Key Differences

|Dimension|Approach 1 (AeroTherma AI)|Approach 2 (HeatShield India)|
|-|-|-|
|**Core intellectual claim**|"We compute the *true* physiology" — deep biological modeling is the moat|"We don't reinvent the science — we operationalize it well" — engineering + data is the moat|
|**UTCI/WBGT computation**|Frames it as a 12-compartment, 187-tissue-node Fanger simulation with Stefan-Boltzmann radiant exchange derived in-house|Uses the standard, published UTCI/WBGT approximations as inputs to a downstream ML model — realistic for a hackathon|
|**Mortality/risk output**|A bespoke epidemiological "Ward Risk" multiplication formula + a DLNM-validated mortality predictor, with a specific claimed accuracy (87.4% correlation)|A risk **probability + confidence + top contributing factors** (SHAP), explicitly avoiding a fabricated single "mortality number"|
|**Environmental/urban data**|Minimal — mentions land cover/albedo only to estimate T\_mrt|Extensive — NDVI, LST, green cover, building density, road density, impervious surface, elevation|
|**Historical data use**|Referenced for backtesting/validation claims only|A full 15-year (2011–present) historical feature layer: heatwave frequency, duration, nighttime heat, cumulative heat load — used as model *inputs*, not just validation|
|**Explainability**|Not addressed|Explicit SHAP-based "why is this ward red?" feature — a genuine standout for judges|
|**Action layer**|"Closed-loop" automated dispatch (webhook + Celery queue that *assigns* tasks to municipal officers)|Rule-based action-plan engine (risk → checklist), explicitly deferred to ML-based prioritization *later* — more honest about what's buildable now|
|**Citizen-facing side**|Not really present — system speaks to the Municipal Commissioner only|A full citizen web portal + heat-safe route + heat-exposure "action window" — two audiences served|
|**Evidence base**|General claims, no inline citations for the specific accuracy figures|Explicit references (Shah et al. 2025 *Nature Communications*, a 2025 Delhi UTCI prototype in *Environment International*, IMD, MOSDAC, Bhuvan) — and it explicitly positions itself *against* that Delhi prior-art paper rather than pretending the idea is unprecedented|
|**Team assumption**|Assumes a genuine Bio/Biotech member who can defend clinical physiology under questioning|Assumes a CS/data-science-heavy team; no biology background required|
|**Pitch craft**|Strong — cost/ROI table, rehearsed Q\&A, "3 unbeatable moats" framing|Weaker — informative but not written as a pitch|
|**Realistic build load**|Lower data burden, higher *credibility* burden|Higher data-engineering burden (4+ satellite sources), lower credibility risk|

\---

## 3\. Key Similarities

Both documents converge on the actual right answer to the problem statement in several places — which is reassuring, because it tells you what the "correct" core of any winning solution looks like:

* **Same core indices:** Both use **UTCI** (general public) and **WBGT** (occupational/outdoor workers) rather than raw temperature or the saturating NOAA Heat Index.
* **Same forecast horizon:** Both target the mandated **3–5 day lead time**.
* **Same spatial ambition:** Both move from district-level IMD alerts to **ward/grid-level** localized risk.
* **Same tech backbone:** Both independently land on **Python + FastAPI, PostgreSQL/PostGIS for geospatial storage, and open-source mapping (Leaflet/Mapbox/MapLibre)**.
* **Same data sources:** Both plan to pull from **IMD AWS, ERA5/ECMWF reanalysis, and Bhuvan/NRSC** land-cover data.
* **Same communication channel:** Both prioritize **SMS/WhatsApp push alerts** over "check a dashboard," recognizing that citizens and ward officers won't open a website in a crisis.
* **Same closing move:** Both explicitly refuse to let the system stop at "here's a red zone" — both insist the output must be an **actionable municipal directive** (water tankers, cooling centers, labor curfews), not a passive advisory.
* **Same positioning relative to IMD:** Both correctly frame the system as an **impact-based layer on top of IMD**, not a replacement for it — this is the right political and technical answer for a MoES-sponsored problem statement.

\---

## 4\. Which Approach Is Actually Better — and Why (the Judges' Lens)

SIH judges for a MoES/NCMRWF problem statement will very likely include a domain scientist, not just a generalist hackathon judge. That changes the calculus:

**Where Approach 1 will get hurt:**

1. **The 187-tissue-node claim is a credibility trap.** The real, operational UTCI is computed via a published polynomial regression approximation (a 6th-order polynomial fit to the underlying Fanger multi-node model) — no hackathon team simulates 187 tissue nodes live. If a domain judge asks "walk me through your 187-node solver," and the honest answer is "we call a UTCI approximation library," that gap between claim and reality is worse than never having made the claim.
2. **"87.4% correlation" and the specific "₹54,000 vs ₹5 crore" ROI figures read as invented precision.** Precise-sounding numbers without a shown methodology are a classic red flag reviewers are trained to probe. Fabricating this kind of statistic — even for a hackathon pitch — is also just bad practice to build a habit around.
3. **It assumes a real Bio/Biotech teammate.** If your actual team doesn't have someone who can defend clinical heat-stroke pathology and thermoregulation under cross-questioning, this whole "unfair advantage" becomes a liability the moment Q\&A starts.

**Where Approach 2 will get hurt:**

1. **Scope.** 15 years of historical data across 4+ satellite/geospatial sources (INSAT-3DR, Sentinel-2, Landsat, Bhuvan, Copernicus DEM, OSM), plus an ML model, plus SHAP, plus a route engine, plus a citizen portal — this is a full production platform's worth of work compressed into a hackathon. Teams that try to build everything usually demo a broken "everything" instead of a working "enough."
2. It's a little dry as a *pitch* — strong as an engineering document, but it doesn't hand you the "unbeatable moat" framing or the rehearsed judge Q\&A that actually helps in the room.

**Net assessment:** Approach 2's foundation is more defensible, more honest, and more aligned with what real domain reviewers reward (correct use of established science, sound engineering, explainability). Approach 1's *packaging* — the "what will judges ask" prep, the plain-language translation of why humidity matters, the closed-loop dispatch mechanics — is genuinely better and worth keeping. **You want HeatShield's skeleton with AeroTherma's skin.**

\---

## 5\. Claude's Recommendation: A Merged, Scoped Approach

Don't build either document as written. Build this:

### 5.1 Positioning statement (borrow AeroTherma's clarity, HeatShield's honesty)

> \*"\[Your project name] converts the question 'what will the weather be' into 'what will the weather do to people in this specific ward, and what should the administration do about it in the next 3–5 days' — using established physiological indices (UTCI, WBGT), local urban/environmental amplification data, and an India-calibrated, explainable ML risk model, closing the loop with automated municipal action dispatch and citizen alerts."\*

### 5.2 What to take from each document

**Take from HeatShield India (Approach 2) — this is your engineering backbone:**

* The layered architecture: Meteorology → Urban/Environmental features → UTCI/WBGT → ML risk model → Action layer.
* Using **established UTCI/WBGT formulas/libraries**, not reinventing physiology.
* The **India-calibrated ML risk model** (XGBoost, with SHAP explainability) as the actual innovation surface — this is genuinely defensible and demoable.
* The **explainability feature** ("why is this ward red?") — one of the strongest, cheapest-to-build differentiators in either document.
* The **rule-based action-plan engine** first, ML-prioritized later — the right build order.
* The **resource prioritization score** (hazard × exposure × vulnerability × duration) for ranking wards.
* The **heat-exposure timeline / "action window"** feature — cheap, visual, very demoable.
* The citizen portal, kept simple (risk today + 3 precautions + peak window).
* The tech stack: FastAPI + PostGIS + React/Leaflet + Celery/Redis + XGBoost/SHAP.
* The honest framing against prior art (cite the Delhi UTCI prototype paper yourselves, before a judge brings it up — this builds credibility, it doesn't hurt you).

**Take from AeroTherma AI (Approach 1) — this is your narrative and dispatch depth:**

* The plain-language physiological explanation (sweat/evaporation, why 40°C at 70% RH is more dangerous than 40°C at 20% RH) — use this in your pitch intro, it's genuinely well written and makes the problem viscerally clear to non-technical judges.
* The **"Fatal Flaw in Existing Systems" framing** (district-level coarseness, ignoring radiation/wind, passive vs. active advisories) — a strong 60-second problem statement.
* The **closed-loop dispatch mechanics**: don't just show a checklist to a human officer — actually build (even as a working prototype) an automated webhook/API that pushes a structured "task ticket" (e.g., "route 3 tankers to Ward 12") via WhatsApp/SMS to a simulated officer endpoint. This is a genuinely better demo moment than a static checklist.
* The **judges' Q\&A defense sheet structure** (not the fabricated numbers inside it) — prepare this format, but fill it with real, defensible answers.
* The **cost/feasibility table format** — useful for judges, but only fill in numbers you can actually justify (open-data sources are genuinely free; don't invent ROI crore-figures).

**Drop entirely:**

* The 187-tissue-node/12-compartment simulation claim. Say instead: *"we use the WMO-endorsed UTCI polynomial approximation, driven by a physically estimated Mean Radiant Temperature."* True, still technical, still impressive, not fabricated.
* The specific fabricated accuracy statistic (87.4% correlation) and the specific ROI crore-figure, unless you actually backtest and can show the number and the method live.
* Attempting all 13 of HeatShield's MVP items and all of AeroTherma's satellite/urban layers simultaneously. Pick a tight MVP (below).

\---

## 6\. Scoped Hackathon MVP (What You Actually Build)

**Tier 1 — Must have (the demo depends on these):**

1. One pilot city with ward/GeoJSON boundaries.
2. Ingest IMD/ERA5 weather data (temp, RH, wind, solar radiation) for that city.
3. Compute **UTCI + WBGT** using an established formula/library (not derived from scratch).
4. One environmental amplification layer: **NDVI or LST** (pick one, not both, to control scope) to explain why two wards at the same air temp differ.
5. A basic **XGBoost risk model** trained on whatever historical heat + (proxy) health/hospitalization data you can source, outputting risk category + probability + top 3 SHAP contributing factors.
6. **Ward-level GIS dashboard** (Leaflet/MapLibre) with color-coded risk, click-to-drill-down.
7. Rule-based **action-plan engine**: risk level → checklist of specific actions (water points, cooling centers, labor advisory).
8. **Simulated SMS/WhatsApp dispatch** (Twilio sandbox or similar) — both citizen alert and municipal officer task-ticket versions.
9. 3–5 day forecast view (even if it's the same model run on forecast inputs rather than a fully separate forecasting model).

**Tier 2 — Should have (adds real differentiation, build if time allows):**
10. Heat-stress **exposure duration / cumulative heat load** feature (not just instantaneous UTCI) — this is a genuinely research-backed differentiator (cite Shah et al. 2025).
11. Heat-exposure timeline / "action window" chart.
12. Simple citizen web view (today's risk + 3 precautions + safest hours).

**Tier 3 — Nice to have, cut first if behind schedule:**
13. Heat-safe walking route recommender.
14. Second environmental layer (add LST if you started with NDVI, or vice versa).
15. Building/road density urban morphology features.

**Explicitly out of scope for a hackathon (mention only as future roadmap):**

* True mortality prediction validated against real district-level death registries (data access alone takes weeks; don't promise a number here you can't source).
* Multi-city / nationwide deployment (mention it as the scaling story, don't try to demo it).
* Government-cloud (MeghRaj/NIC) deployment — mention as the production path, deploy on a normal VM/Docker for the demo.

\---

## 7\. Step-by-Step Execution Plan

### Phase 0 — Before you write a line of code (Day -2 to Day -1)

1. **Pick the pilot city.** Choose one with decent open data coverage (a Tier-1/Tier-2 city IMD covers well, ideally one your team can source a ward GeoJSON for — check Bhuvan/OSM/municipal open-data portals first).
2. **Assign roles**, not by "who's the biology person" but by actual task ownership:

   * Data/ETL owner (IMD/ERA5 ingestion + cleaning)
   * Geospatial owner (PostGIS, ward boundaries, spatial joins)
   * ML/data-science owner (UTCI/WBGT computation + XGBoost + SHAP)
   * Backend/API owner (FastAPI, action-engine, dispatch webhook)
   * Frontend owner (dashboard + citizen portal)
   * Pitch/narrative owner (deck, Q\&A prep, demo script) — this person should start immediately, in parallel, not at the end.
3. **Freeze the data contract**: exact fields, units, and update frequency for every dataset you'll pull, so nobody blocks on "what does this field mean" mid-build.

### Phase 1 — Core pipeline (first \~30–40% of build time)

4. Ingest weather data for the pilot city (historical + current/forecast).
5. Implement UTCI and WBGT calculation using an existing, cited formula/library.
6. Stand up PostGIS with ward polygons; join weather + UTCI/WBGT to ward grid cells.
7. Pull one environmental layer (NDVI *or* LST) and join it spatially.

### Phase 2 — Intelligence layer (next \~25–30%)

8. Assemble the historical feature set (heatwave frequency/duration if feasible, or a simplified proxy) and train the XGBoost risk model.
9. Add SHAP explainability output per ward.
10. Build the rule-based action-plan engine (risk category + duration → checklist).
11. Build the resource-prioritization ranking across wards.

### Phase 3 — Action \& interface layer (next \~20–25%)

12. Build the government dashboard: map layers, ward drill-down, 5-day outlook.
13. Build the citizen-facing simple view.
14. Wire up the simulated SMS/WhatsApp dispatch — both citizen and municipal-officer versions — this is your best live-demo moment, prioritize it over polish elsewhere.

### Phase 4 — Pitch and rehearsal (final \~10–15%, but running in parallel from Day 1)

15. Build the "Fatal Flaw in Existing Systems" problem framing slide (borrow AeroTherma's structure).
16. Build the honest technical differentiation slide — established UTCI/WBGT + India-calibrated ML + explainability + closed-loop dispatch, explicitly citing prior art (the Delhi 2025 prototype) and explaining *how you differ from it*, rather than claiming false novelty.
17. Prepare a **real** judges' Q\&A defense sheet: "Why not just use IMD's Heat Index?", "How do you validate your risk model without real mortality data?" (answer honestly: backtest against historical heatwave-day proxies, be upfront about what's simulated vs. production-ready), "How does this align with Mission Mausam / NDMA Heat Action Plan guidelines?"
18. Full dry-run demo: live ward alert → dashboard update → simulated dispatch received on a phone. Practice this exact sequence until it's boring to run.

### Phase 5 — Submission polish

19. Cut anything from Tier 3 that isn't stable.
20. Make sure every number in your deck is either (a) sourced from a real dataset/paper you can point to, or (b) explicitly labeled as a target/estimate — never presented as a measured result you didn't measure.

\---

## 8\. One-Line Summary for Your Team

**Build HeatShield India's brain (honest science, ML, explainability, layered architecture) wearing AeroTherma AI's face (clear storytelling, sharp problem framing, closed-loop dispatch demo) — scoped to a Tier-1 MVP you can actually finish and defend under questioning.**

