# HeatShield India

## Government-Maintainable, Citizen-Facing Urban Human Heat-Risk Intelligence & Early Warning System

**Problem statement:** SIH26083 --- Extreme Heatwave Early Warning and
Human Thermal Stress Index\
**Scope:** India, with a practical city-scale pilot for hackathon
demonstration\
**Historical window:** Most recent 15 years of data wherever the source
supports it\
**Forecast horizon:** 3--5 days\
**Primary users:** Municipal corporations, district/state
disaster-management authorities, public-health departments, outdoor
workers, and citizens

------------------------------------------------------------------------

## 1. Executive Solution

**HeatShield India** is a government-operable platform that converts
official weather forecasts and environmental observations into
**area-wise human heat-risk intelligence**.

Instead of only asking:

> "Will the temperature cross a heatwave threshold?"

the system answers:

> **"Which areas are likely to experience dangerous human heat stress
> over the next 3--5 days, why are those areas at risk, who is exposed,
> and what immediate action should the local authority take?"**

The platform has two interfaces:

1.  **Government Heat Command Dashboard** --- heatmaps, forecasts,
    hotspot ranking, explanations, action plans, alerts and resource
    prioritization.
2.  **Citizen Heat Portal** --- simple risk status, detailed
    explanation, precautions, safer-time suggestions and location-aware
    guidance.

Official IMD warnings remain the authoritative meteorological warning
layer; HeatShield India acts as an **impact-based urban intelligence and
action-planning layer** on top of official forecasts.

------------------------------------------------------------------------

## 2. Key Drawbacks of Existing Approaches and Our Response

  -----------------------------------------------------------------------
  Existing limitation                 HeatShield India response
  ----------------------------------- -----------------------------------
  Temperature-only interpretation     UTCI + WBGT + meteorological
                                      variables

  Coarse administrative warning       Grid/ward-level heat-risk maps

  Humidity, wind and radiation are    Multivariable thermal-stress engine
  not sufficiently integrated         

  Urban greenery is ignored or        NDVI/tree-cover/green-space
  underused                           features

  Built environment is insufficiently Building density, land cover, road
  represented                         and urban morphology features

  Historical heat exposure is not     15-year heatwave/thermal-stress
  fully used in local prediction      history

  Warning is separated from action    Automated municipal action-plan
                                      recommendations

  Citizen warnings can be missed on a SMS/WhatsApp alerts
  website                             

  Risk can be a black box             Explainable AI using SHAP

  One warning for everyone            Separate public, occupational and
                                      authority-oriented guidance

  Current conditions are emphasized   Heat-Stress Exposure hours
  over exposure duration              

  Forecast uncertainty is hidden      Probability + confidence level
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 3. System Architecture

``` text
                 OFFICIAL / OPEN DATA
                         |
        +----------------+----------------+
        |                |                |
       IMD            ERA5/NWP         Satellites
        |                |                |
        +----------------+----------------+
                         |
                         v
              DATA INGESTION PIPELINE
                         |
                         v
              SPATIAL FEATURE ENGINE
        +----------------+----------------+
        |                |                |
   Meteorology       Environment       Urban Form
        |                |                |
   Temp/RH/Wind      LST/NDVI          Buildings
   Radiation         Green cover       Roads
   Dew point         Land cover       Density
        |                |                |
        +----------------+----------------+
                         |
                         v
               THERMAL-STRESS ENGINE
                  /              \
               UTCI             WBGT
                  \              /
                   \            /
                    v          v
                 HEAT EXPOSURE
                + HISTORICAL DATA
                         |
                         v
             INDIA-CALIBRATED ML MODEL
                         |
                  3–5 DAY RISK
                         |
          +--------------+--------------+
          |              |              |
          v              v              v
     GOVERNMENT       CITIZENS       WORKERS
      DASHBOARD         SMS/WA         ALERTS
          |
          v
  ACTION PLAN + RESOURCE PRIORITY
```

------------------------------------------------------------------------

## 4. Data Layer --- What the System Collects

The system should combine four categories of data.

### Meteorological

-   Air temperature
-   Relative humidity
-   Dew point
-   Wind speed/direction
-   Solar radiation
-   Pressure
-   Rainfall
-   Day/night temperature

### Historical

-   Daily/hourly heat conditions
-   Heatwave occurrence
-   Heatwave duration
-   Maximum and minimum temperature
-   UTCI/WBGT-derived stress
-   Heat-stress exposure hours

### Environmental

-   Land Surface Temperature (LST)
-   NDVI/EVI
-   Tree/green cover
-   Land-use/land-cover
-   Elevation

### Urban

-   Building density
-   Building/structure characteristics where available
-   Road density
-   Impervious surface
-   Parks/open spaces
-   Population density
-   Administrative boundaries

The objective is to describe both the **atmospheric heat** and the
**local urban amplification of heat**.

------------------------------------------------------------------------

## 5. Fifteen-Year Historical Intelligence

To keep the system feasible, use approximately **2011--present** for the
historical training window rather than attempting to build a
century-scale climate model.

For every spatial grid cell, calculate:

``` text
Historical heatwave frequency
Historical heatwave duration
Maximum temperature anomaly
Average summer temperature
Nighttime heat
UTCI stress hours
WBGT stress periods
LST anomaly
Vegetation condition
Urbanization indicators
```

Derived features can include:

### Heatwave Duration

``` text
HWD = consecutive hot/stressful days
```

### Heat-Stress Exposure

``` text
HSE = number of hours where UTCI exceeds the selected
      heat-stress threshold
```

### Cumulative Heat Load

``` text
CHL = sum(max(UTCI - threshold, 0))
```

This prevents the model from treating a one-hour extreme and a ten-hour
exposure as equivalent.

A 2025 India-wide study found that heat-stress exposure duration can
rise faster than average UTCI, demonstrating why duration should be
represented explicitly. \[1\]

------------------------------------------------------------------------

## 6. Layer 1 --- Meteorological Heat Model

The first layer describes the atmospheric state.

### Inputs

``` text
Temperature
Relative humidity
Wind speed
Dew point
Solar radiation
Pressure
Rainfall
Forecast variables
```

### Outputs

``` text
Current atmospheric heat
Forecast atmospheric heat
Anomalies relative to local historical baseline
```

The system should use official IMD information wherever operational
access is available. IMD already provides district-wise heatwave
warnings and forecast products, so HeatShield India should augment
rather than replace the official warning system. \[2\]

------------------------------------------------------------------------

## 7. Layer 2 --- Urban & Environmental Heat Model

This layer explains why two nearby areas with similar air temperatures
can have different thermal conditions.

### Vegetation

Calculate:

-   NDVI
-   percentage green cover
-   tree/vegetation density
-   distance to green spaces
-   park/open-space density

### Surface

Calculate:

-   Land Surface Temperature
-   LST anomaly
-   impervious surface fraction

### Urban morphology

Calculate:

-   building density
-   road density
-   land-use class
-   built-up fraction
-   elevation
-   available urban morphology proxies

### Concept

``` text
Less vegetation + more impervious/built surface
                    |
                    v
             Greater heat storage
             + weaker shading
             + higher radiant load
                    |
                    v
              Higher heat risk
```

This is an important differentiator because the system maps **local heat
conditions**, not just city-average temperature.

------------------------------------------------------------------------

## 8. Layer 3 --- Thermal-Stress Calculation Engine

Do not invent an unvalidated physiological equation.

Instead, use established indices as scientifically grounded components.

### UTCI --- Primary public/outdoor index

UTCI integrates air temperature, humidity, wind and radiation into a
thermophysiological equivalent temperature.

Use it for:

-   general population
-   pedestrians
-   outdoor exposure
-   city heat-risk mapping
-   human thermal stress

### WBGT --- Occupational/exertional index

WBGT is especially useful for:

-   construction workers
-   traffic personnel
-   sanitation workers
-   farmers
-   outdoor government staff
-   athletes

### Heat-Stress Exposure

Add the duration dimension:

``` text
UTCI severity
+
number of stressful hours
+
consecutive stressful days
```

The 2025 India-wide UTCI research provides strong support for using
exposure duration rather than only a single thermal index value. \[1\]

------------------------------------------------------------------------

## 9. Layer 4 --- India-Calibrated ML Risk Engine

The innovation should **not** be an arbitrary new heat-index formula.

Instead, create an **India-Calibrated Human Heat Risk Model**.

### Input

``` text
Temperature
Humidity
Wind
Radiation
UTCI
WBGT
LST
NDVI
Green cover
Building density
Road density
Historical heatwave frequency
Heatwave duration
Nighttime heat
Heat-stress exposure hours
Population/exposure indicators
```

### Output

``` text
Risk probability
Risk category
Forecast confidence
Top contributing factors
```

Example:

``` text
Ward 18

Probability of High/Extreme Heat Risk: 84%
Confidence: High

Main drivers:
1. High UTCI
2. High LST
3. Low vegetation
4. Dense built-up area
5. Low wind
```

### Recommended model

Start with:

-   XGBoost
-   LightGBM as an alternative
-   Random Forest as baseline
-   SHAP for explainability

Do not start with an unnecessarily complex deep-learning architecture.

------------------------------------------------------------------------

## 10. 3--5 Day Forecasting System

The forecast pipeline should **augment numerical weather prediction**,
not attempt to replace it.

``` text
Official/open weather forecast
          |
          v
Bias correction / local feature adjustment
          |
          +---- Historical baseline
          |
          +---- LST
          |
          +---- NDVI
          |
          +---- Urban morphology
          |
          +---- UTCI/WBGT
          |
          v
India-calibrated ML model
          |
          v
Day 1 → Day 5 risk probability
```

Example:

  Area     Today       Day 2       Day 3       Day 4       Day 5
  -------- ----------- ----------- ----------- ----------- ----------
  Ward A   High        Very High   Very High   High        Moderate
  Ward B   Moderate    High        High        Moderate    Low
  Ward C   Very High   Very High   Extreme     Very High   High

The system should display both **risk probability** and **confidence**,
rather than presenting a deterministic prediction as certain.

------------------------------------------------------------------------

## 11. Government Heat Command Dashboard

This is the core administrative interface.

### Main screen

``` text
HEATSHIELD INDIA — CITY COMMAND

Current hotspots:       18
High-risk wards:        42
Very-high/extreme:      11

Next 5-day outlook:
Today       HIGH
Day +1      VERY HIGH
Day +2      VERY HIGH
Day +3      HIGH
Day +4      MODERATE
```

### Map layers

1.  Air temperature
2.  UTCI
3.  WBGT
4.  LST
5.  NDVI/green cover
6.  Heat-stress exposure
7.  Forecast risk
8.  Vulnerability/exposure
9.  Priority action areas

Clicking a ward should show:

``` text
Ward 18

UTCI: 42.3°C
WBGT: 31.7°C
Risk: VERY HIGH
Risk probability: 84%

Stress exposure today: 7.1 hours

Main contributors:
- High radiation
- High surface temperature
- Dense built environment
- Low vegetation
```

------------------------------------------------------------------------

## 12. Immediate Municipal Action-Plan Engine

This should be one of the project's strongest innovations.

The system should not stop at:

> "This ward is red."

It should translate the risk into **operational actions**.

### Example

``` text
WARD 18 — VERY HIGH RISK

Recommended immediate actions:

PRIORITY 1 — PUBLIC HEALTH
✓ Activate heat-health response
✓ Notify nearby health centres
✓ Increase heat-illness preparedness

PRIORITY 2 — WATER
✓ Verify public drinking-water points
✓ Increase water availability in high-exposure areas

PRIORITY 3 — OUTDOOR WORK
✓ Issue worker heat-safety advisory
✓ Shift heavy outdoor activity away from peak heat

PRIORITY 4 — COOLING
✓ Open/extend designated cooling shelters where available
✓ Prioritize high-risk population areas

PRIORITY 5 — COMMUNICATION
✓ Send citizen alerts
✓ Notify ward officers
✓ Publish localized precautions
```

The action engine can be rule-based initially:

``` text
Risk level + exposure + forecast duration
                     |
                     v
             Action rule engine
                     |
                     v
        Municipal action checklist
```

Later, actions can be prioritized using historical effectiveness.

This is more feasible and defensible than trying to train an AI to
invent government policies.

------------------------------------------------------------------------

## 13. Resource Prioritization

Municipal authorities often have limited resources.

The system should therefore rank locations:

``` text
Priority Score =
Heat Hazard
× Population Exposure
× Vulnerability
× Duration
```

Example:

  Ward   Risk        Exposure    Duration   Priority
  ------ ----------- ----------- ---------- ----------
  A      Extreme     High        Long       1
  B      Very High   Very High   Long       2
  C      Extreme     Low         Short      3
  D      High        High        Medium     4

This lets authorities decide where to send:

-   water tankers
-   temporary water stations
-   cooling resources
-   health teams
-   public announcements
-   field personnel

first.

------------------------------------------------------------------------

## 14. Citizen Warning System --- SMS & WhatsApp First

The citizen should **not have to constantly check a website**.

### Alert channels

-   SMS
-   WhatsApp
-   Optional web push notification

### Example SMS

``` text
HEATSHIELD ALERT — HIGH HEAT RISK

Your area is expected to experience VERY HIGH
heat stress tomorrow from 12 PM–4 PM.

Avoid prolonged outdoor activity.
Stay hydrated and prefer shaded/cool locations.

More details: HeatShield portal
```

### WhatsApp

The WhatsApp message can contain:

-   risk level
-   expected time window
-   3 immediate precautions
-   link to detailed web guidance

The website then provides the detailed information.

This creates a simple principle:

> **Alert through the channel people notice; explain through the channel
> that can provide detail.**

Production implementation should use approved government/enterprise SMS
and WhatsApp Business providers and comply with applicable
messaging/privacy rules.

------------------------------------------------------------------------

## 15. Citizen Web Portal

The website should remain simple.

### Home

``` text
YOUR AREA

Current Risk:
🔴 VERY HIGH

Temperature: 39.4°C
UTCI: 42.1°C
WBGT: 31.6°C

Peak risk:
12 PM – 4 PM
```

### Detailed guidance

``` text
WHY IS RISK HIGH?

• High thermal stress
• Strong solar radiation
• Low vegetation
• High surface temperature

WHAT TO DO

✓ Drink water regularly
✓ Prefer shaded areas
✓ Reduce prolonged outdoor exposure

AVOID

✗ Heavy outdoor activity during peak heat
✗ Long exposure to direct sun
```

The public interface should avoid overwhelming users with scientific
numbers.

------------------------------------------------------------------------

## 16. Standout Feature --- Explainable Heat Risk

Every red/orange region should answer:

> **"Why is this area high-risk?"**

Use SHAP or feature-contribution analysis.

Example:

``` text
VERY HIGH RISK

Contribution to risk

UTCI                  ██████████
LST                   ████████
Building density      ██████
Low vegetation        █████
Humidity              ████
Low wind              ███
```

This improves:

-   government trust
-   debugging
-   scientific interpretation
-   model transparency

It also helps officers understand whether an alert is driven primarily
by atmospheric heat or urban conditions.

------------------------------------------------------------------------

## 17. Standout Feature --- Heat-Safe Route / Safer Location Recommendation

Retain one action-oriented feature rather than the rejected "What-if"
simulator.

For walking or outdoor travel, the system can score road/path segments
using estimated heat risk.

``` text
                 Destination
                      ^
                     /
        Route B ----/
       LOW RISK
          /
         /
Start --+---------------- Route A
             HIGH RISK
```

Example:

  Route            Distance Estimated heat risk
  -------------- ---------- ---------------------
  Fastest            2.0 km High
  Safer              2.3 km Moderate
  Shaded/green       2.5 km Lower

The platform can recommend:

> **"The safer route is 300 m longer but passes through
> lower-risk/shaded areas."**

This can be implemented using OpenStreetMap road data plus spatial
heat-risk layers.

------------------------------------------------------------------------

## 18. Standout Feature --- Heat Exposure Timeline & "Action Window"

Instead of giving only a daily red/orange status, show **when action
matters most**.

``` text
06 AM   09 AM   12 PM   03 PM   06 PM   09 PM

LOW      MOD.     HIGH   VERY HIGH  HIGH    MOD.
                    <---->
                 ACTION WINDOW
```

For municipal officers:

> **"Highest operational risk expected 12:00--16:00 for the next three
> days."**

For citizens:

> **"If outdoor work is unavoidable, 6:00--9:00 AM has lower predicted
> thermal stress than 12:00--4:00 PM."**

This makes the system actionable rather than simply descriptive.

------------------------------------------------------------------------

## 19. Technology Stack & Implementation Plan

### Frontend

  Component              Technology
  ---------------------- ---------------------------
  Web UI                 React + TypeScript
  Mapping                MapLibre GL JS / Leaflet
  Charts                 Recharts / Apache ECharts
  Government dashboard   React
  Public portal          React/PWA

### Backend

  Component               Technology
  ----------------------- -----------------------------
  API                     Python + FastAPI
  ML                      XGBoost + Scikit-learn
  Explainability          SHAP
  Geospatial processing   GeoPandas + Rasterio + GDAL
  Numerical data          NumPy + Xarray
  Task scheduling         Celery/APScheduler
  Cache                   Redis

### Database

``` text
PostgreSQL
    +
PostGIS
```

Use PostGIS for:

-   ward polygons
-   grid cells
-   roads
-   spatial queries
-   risk layers

### Data pipeline

``` text
Python ETL
   ↓
Raw data storage
   ↓
Cleaning
   ↓
Spatial alignment
   ↓
Feature generation
   ↓
UTCI/WBGT
   ↓
ML inference
   ↓
PostGIS
   ↓
Map API
```

### Deployment

For the hackathon:

-   Docker
-   GitHub/GitLab
-   cloud VM/container deployment

For production:

-   government-approved cloud/NIC/MeghRaj or equivalent environment
-   automated backups
-   RBAC
-   audit logging
-   model versioning

------------------------------------------------------------------------

## 20. Datasets, References, Validation and Final Recommendation

### Recommended datasets

  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  Dataset             Purpose             Resolution/coverage   Link
  ------------------- ------------------- --------------------- --------------------------------------------------------------------------------------------------------------------------------
  **IMD**             Official warnings,  Operational India     https://mausam.imd.gov.in/
                      forecasts,                                
                      observations                              

  **ERA5**            Historical          Hourly; 1940--present https://cds.climate.copernicus.eu/datasets/reanalysis-era5-single-levels
                      meteorology and                           
                      derived UTCI                              

  **ERA5-Land**       Land/near-surface   Higher-resolution     https://cds.climate.copernicus.eu/datasets/reanalysis-era5-land
                      historical          land reanalysis       
                      variables                                 

  **INSAT-3DR LST     Indian satellite    Half-hourly           https://mosdac.gov.in/doi/190/
  (MOSDAC)**          LST                 operational product   

  **Sentinel-2**      NDVI, vegetation,   10 m optical bands;   https://developers.google.com/earth-engine/datasets/catalog/COPERNICUS_S2_HARMONIZED
                      land cover          \~5-day revisit       

  **Landsat**         Long-term land      Historical satellite  https://developers.google.com/earth-engine/datasets/catalog/landsat
                      surface/urban       archive               
                      analysis                                  

  **Bhuvan/NRSC**     Indian LULC and     Multiple scales       https://bhuvan-app1.nrsc.gov.in/2dresources/bhuvanstore.php
                      thematic layers                           

  **Copernicus DEM**  Elevation/surface   30 m GLO-30           https://dataspace.copernicus.eu/explore-data/data-collections/copernicus-contributing-missions/collections-description/COP-DEM
                      structure                                 

  **OpenStreetMap**   Roads, buildings,   Global                https://www.openstreetmap.org/
                      parks and routing                         
  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

### Important research references

**\[1\] Shah et al. (2025), Nature Communications --- "Spatiotemporal
changes in heat stress exposure in India, 1981--2023."**

This study used UTCI to examine Indian heat-stress exposure and
demonstrated the importance of **heat-stress exposure duration**, not
just average thermal conditions.

https://www.nature.com/articles/s41467-025-64840-x

**\[2\] India Meteorological Department --- District-wise Heatwave
Warnings.**

IMD provides operational district-wise heatwave warning categories
including Watch, Alert and Warning.

https://mausam.imd.gov.in/responsive/districtWiseHeatwaveWarnings.php

**\[3\] Kacker, Srivastava & Mukherjee (2025), Environment International
--- "Personalized heat stress early warning system for an urban area."**

A Delhi prototype used UTCI, WRF-UCM, vulnerability and exposure to
produce a 5-day personalized heat-stress risk forecast. This is
important prior art: HeatShield India should therefore differentiate
itself through **municipal action planning, India-calibrated multi-layer
risk modelling, historical exposure intelligence, explainability,
SMS/WhatsApp delivery and operational prioritization**, rather than
claiming that 5-day UTCI warnings alone are novel.

https://www.sciencedirect.com/science/article/pii/S0160412025002582

**\[4\] MOSDAC/ISRO --- INSAT-3DR LST.**

The operational LST product is derived from INSAT-3DR thermal infrared
observations and is updated half-hourly.

https://mosdac.gov.in/doi/190/

**\[5\] Bhuvan/NRSC --- Thematic Services.**

Provides Indian land-use/land-cover and other geospatial layers,
including datasets at multiple spatial scales.

https://bhuvan-app1.nrsc.gov.in/2dresources/bhuvanstore.php

**\[6\] Ahmedabad Heat Action Plan research.**

The Ahmedabad experience demonstrates how early warning, public-health
response and coordinated government action can be connected in a
practical heat-health system.

https://pmc.ncbi.nlm.nih.gov/articles/PMC4024996/

------------------------------------------------------------------------

# Final Recommended Product

``` text
                    HEATSHIELD INDIA
       Government Heat-Risk Intelligence Platform
                         |
       +-----------------+------------------+
       |                                    |
 GOVERNMENT                              CITIZEN
 COMMAND CENTER                           PORTAL
       |                                    |
       v                                    v
Heatmaps + Forecasts                 SMS / WhatsApp
       |                              Detailed Web Info
       v                                    |
Hotspot Ranking                             v
       |                              Personal Guidance
       v
Municipal Action Plan
       |
       v
Resource Prioritization
```

## Core innovation

HeatShield India should be positioned as:

> **An India-calibrated, urban-scale, impact-based heat-risk
> intelligence system that converts official weather forecasts and
> environmental data into 3--5 day human heat-risk maps and directly
> translates those risks into municipal action plans and citizen
> alerts.**

### The project has five major intelligence layers:

``` text
1. WEATHER
   ↓
2. URBAN + VEGETATION
   ↓
3. UTCI + WBGT + EXPOSURE
   ↓
4. INDIA-CALIBRATED ML
   ↓
5. ACTION & COMMUNICATION
```

The most important design decision is that **the AI does not replace
IMD**. It takes official forecasts and combines them with local
environmental, historical and urban information to answer the
operational question that conventional forecasts do not fully answer:

> **"What does the forecasted heat mean for this specific area, its
> people, and the actions the local authority should take?"**

## Feasible Hackathon MVP

Build one city end-to-end:

1.  15 years of historical weather/heatwave data
2.  Current + 3--5 day forecast
3.  NDVI + LST + land-use
4.  Building/road density
5.  UTCI + WBGT
6.  XGBoost heat-risk model
7.  1 km grid heatmap
8.  Ward-level government dashboard
9.  Automated municipal action checklist
10. SMS/WhatsApp alert prototype
11. SHAP explanation
12. Heat-safe route
13. Heat-exposure timeline

Then demonstrate how the same architecture can scale from:

**one city → multiple cities → districts → nationwide deployment.**

## Why this version is stronger

The project is no longer merely a **heatwave prediction application**.

It becomes a complete chain:

> **Detect → Predict → Localize → Explain → Prioritize → Alert → Act**

That is the version I recommend presenting to the SIH judges.
