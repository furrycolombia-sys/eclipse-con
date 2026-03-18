# PostHog Insights for Moonfest

## Purpose

This site is optimized for a narrow set of product goals:

- move visitors from discovery to room reservation
- reduce confusion around the two-step booking model
- use FAQ and tutorial behavior to identify blockers
- keep returning community members informed through news and updates

The recommendations below map directly to the current event schema and UI instrumentation already present in the app.

## Dashboard 1: Reservation Conversion

### Insight 1: Hero to reserve funnel

- Type: Funnel
- Events:
  1. `funnel_step` where `step = view_pricing`
  2. `cta_interaction` where `ctaId = registration_reserve`
  3. `funnel_step` where `step = click_reserve`
- Breakdown:
  - `locale`
  - `viewport`
  - `ctaVariant`
- Interval: 7 days
- Question answered:
  - Are visitors reaching the pricing section and then actually attempting reservation?

### Insight 2: CTA performance by surface

- Type: Trends
- Event: `cta_interaction`
- Filter:
  - `ctaId in [hero_primary_cta, registration_reserve, registration_tutorial_interest, faq_registration_tutorial_interest]`
- Breakdown:
  - `ctaId`
  - `sectionId`
  - `locale`
- Visualization: bar chart
- Question answered:
  - Which surface creates the most useful intent: direct reserve or learn-more/tutorial paths?

### Insight 3: Reservation handoff sources

- Type: Trends
- Event: `reserve_ticket_handoff`
- Breakdown:
  - `sourceSurface`
  - `targetAction`
- Visualization: stacked bar
- Question answered:
  - Where does reservation intent originate: registration section, FAQ, tutorial, or nav?

## Dashboard 2: Tutorial Friction

### Insight 4: Tutorial progression

- Type: Funnel
- Events:
  1. `registration_tutorial_step_selected`
  2. `registration_tutorial_progress_bucket` where `bucket = 33`
  3. `registration_tutorial_progress_bucket` where `bucket = 66`
  4. `registration_tutorial_progress_bucket` where `bucket = 100`
- Breakdown:
  - `activeStep`
  - `origin`
- Question answered:
  - Are people advancing through the tutorial or just sampling one step and leaving?

### Insight 5: Step-level confusion

- Type: Trends
- Events:
  - `registration_tutorial_step_selected`
  - `registration_tutorial_step_toggled`
- Breakdown:
  - `stepNumber`
  - `origin` for selected
  - `nextState` for toggled
- Visualization: line or grouped bar
- Question answered:
  - Which tutorial step gets attention but low completion, indicating unclear instructions?

### Insight 6: Backtracking rate

- Type: Trends
- Event: `registration_tutorial_step_selected`
- Breakdown:
  - `origin`
- Filter:
  - `origin in [prev_button, next_button, step_card]`
- Question answered:
  - Are users moving forward normally, or repeatedly going backward because the flow is unclear?

## Dashboard 3: FAQ and Blockers

### Insight 7: FAQ blocker themes

- Type: Trends
- Event: `faq_blocker_theme`
- Breakdown:
  - `theme`
  - `faqId`
- Visualization: horizontal bar
- Question answered:
  - What is blocking conversion most often: pricing, rooming, payment timing, or ticket eligibility?

### Insight 8: FAQ to tutorial intent

- Type: Funnel
- Events:
  1. `faq_interaction`
  2. `cta_interaction` where `ctaId = faq_registration_tutorial_interest`
- Breakdown:
  - `faqId`
- Question answered:
  - Which FAQ entries create enough uncertainty that users ask for more guidance?

## Dashboard 4: Content and Trust Signals

### Insight 9: Dwell by section

- Type: Trends
- Event: `dwell_time_per_section`
- Breakdown:
  - `sectionId`
  - `durationBucket`
- Visualization: stacked bar
- Question answered:
  - Which sections actually hold attention: venue, travel, FAQ, registration, or news?

### Insight 10: News usefulness

- Type: Trends
- Event: `news_engagement`
- Breakdown:
  - `action`
  - `layoutMode`
- Filter:
  - `itemId is set` for per-post reads
- Question answered:
  - Are returning users consuming updates, and does the chosen layout help or hinder that?

### Insight 11: High-engagement audience segments

- Type: Trends
- Event: `engagement_score_bucket`
- Breakdown:
  - `bucket`
  - `locale`
  - `viewport`
- Question answered:
  - Which audience segments are most engaged, and which need a better path to reservation confidence?

## Dashboard 5: Experience Quality

### Insight 12: Conversion vs performance

- Type: Funnel with breakdown or correlated trends
- Events:
  - `funnel_step` where `step = click_reserve`
  - `performance_snapshot`
  - `network_quality_impact`
- Breakdown:
  - `interactionToNextPaintBucket`
  - `largestContentfulPaintBucket`
  - `connectionType`
- Question answered:
  - Are slower devices or weaker networks suppressing reservation attempts?

### Insight 13: Errors affecting intent

- Type: Trends
- Events:
  - `js_error`
  - `page_load_failure`
  - `error_recovery`
- Breakdown:
  - `source`
  - `resourceType`
  - `status`
- Question answered:
  - Are technical failures correlated with failed handoff to reservation or ticket actions?

## Recommended Core Dashboard

If you only build one dashboard first, use these six panels:

1. Hero to reserve funnel
2. CTA performance by surface
3. Reservation handoff sources
4. Tutorial progression
5. FAQ blocker themes
6. Conversion vs performance

This covers the main business question: are visitors convinced, and if not, what is stopping them?

## Analysis Patterns To Use Weekly

### 1. Find the biggest leak in the path

- Compare `view_pricing` to `registration_reserve`
- If pricing views are high and reserve clicks are low, the issue is trust or offer clarity
- If tutorial interest is high, the issue is comprehension rather than demand

### 2. Separate demand from confusion

- High `faq_blocker_theme` and tutorial activity means users are interested but uncertain
- Low section dwell and low CTA interaction means top-of-page messaging is not earning attention

### 3. Treat locale as a first-class dimension

- Break down all conversion panels by `locale`
- If Spanish and English behave differently, fix copy order and reassurance for the weaker locale before changing layout

### 4. Watch mobile separately

- Break down by `viewport`
- If mobile users reach pricing but underperform on reserve clicks, review CTA placement and scroll load on smaller screens

## Notes on Current Instrumentation

- `view_pricing` is fired from the hero CTA
- `click_reserve` is fired from the registration reservation link
- tutorial progress is bucketed at `33`, `66`, and `100`
- FAQ interactions can emit blocker themes
- news usage, section dwell, engagement score, and performance buckets are already tracked

## Gaps Worth Fixing Later

The current schema is already strong, but two missing signals would make the dashboard much better:

- a true `registration_tutorial_page_view` or `tutorial_started` event
- a confirmed `external_reservation_completed` event if the hotel provider can return a callback or redirect

Without those, PostHog can measure intent and tutorial progress well, but not final booking completion.
