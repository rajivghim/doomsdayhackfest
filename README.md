# SewaSathi
doomsday hackfest
🔥 SewaSathi (सेवासाथी) — Citizen Grievance & Public Redressal Platform
"Where your complaint finally gets seen and solved."
SewaSathi connects citizens across Nepal with the municipal authorities and government bodies responsible for fixing civic infrastructure, managing solid waste, and enforcing billing compliance.
📌 Overview
SewaSathi (meaning "Service Companion" in Nepali) is a modern, high-transparency civic grievance redressal portal built for Nepal. It bridges the critical accountability gap between citizens and local ward offices, municipal corporations (like KMC/LMC), and national enforcement departments (like the Inland Revenue Department).
From uncollected municipal garbage dumps and dangerous road hazards to tax evasion and fake VAT receipts under the government's "Bill Jitnuhos" (बिल माग्नुहोस् / लिनुहोस्) initiative, SewaSathi provides end-to-end auditability from citizen submission to field resolution.
💡 Tech Stack & Architecture
Frontend & UI: React 19 + TypeScript + Vite + Tailwind CSS v4 + Lucide Icons + Motion
Geospatial & Mapping: Leaflet & OpenStreetMap (Precision GPS Geocoding & Ward Boundary Pinpointing)
AI Verification & Analysis: Google Gemini API (@google/genai) for automated grievance categorization, urgency prioritization, and receipt/photo verification
Persistence & State: Modular Persistent Local Storage Engine & Audit Event Stream
Backend / Integration Ready: REST API proxy endpoints for municipality dispatch and authority sync
✨ Core Pillars & Features
1. 🗂️ Multi-Domain Citizen Grievance Reporting
Solid Waste & Sanitation: Report overflowing community dumpsters, hazardous waste dumping, or missed garbage routes directly to municipal sanitation crews.
IRD VAT & Tax Billing Compliance: Report unissued receipts, forged bills, or VAT evasion, directly aligned with Nepal Inland Revenue Department (IRD) standards.
Municipal & Public Infrastructure: File tickets for dangerous potholes, damaged streetlights, fractured water supply lines (KUKL), or encroached public footpaths.
2. 📍 Interactive Ward-Level Geolocation
Integrated OpenStreetMap & Leaflet interactive map picker with GPS geocoding.
Pinpoint precision across municipalities, wards, and landmarks across Kathmandu Valley, Pokhara, Lalitpur, and across all 7 provinces.
3. 🔍 Live Audit & Citizen Tracking Board
Generates unique ticket tracking IDs (e.g., #KMC-W4-8921).
Public transparency board displaying status lifecycles:
Submitted ➔ Under Review ➔ Dispatched ➔ In Progress ➔ Resolved
Real-time community engagement: upvoting, citizen endorsements, and official resolution timeline logs.
4. 🛡️ Authority & Ward Officer Dashboard
Secured portal for municipal ward officers, KMC/sanitation engineers, and IRD auditors.
Filter and prioritize grievances by urgency, jurisdiction, and category.
Update ticket status, assign field response teams, and upload resolution proof.
5. 📞 Emergency Civic Helplines Directory
Instant one-tap access to national and municipal hotlines:
Hello Sarkar: 1111
KMC Municipal Hotline: 1184 / 1660-01-05511
Nepal Police Hotline: 100 / 103 (Traffic)
Inland Revenue Department (IRD): 01-4410340
Kathmandu Upatyaka Khanepani Limited (KUKL): 1137
🚀 Getting Started
Prerequisites
Node.js (v18 or higher)
npm or yarn
Installation
code
Bash
# Clone the repository
git clone https://github.com/rajivghim/doomsdayhackfest.git
cd doomsdayhackfest

# Install dependencies
npm install

# (Optional) Set up environment variables
cp .env.example .env
# Add your GEMINI_API_KEY if using AI verification features

# Start development server
npm run dev
The application will run locally on http://localhost:3000.
👥 Built For
Developed for civic impact at Doomsday Hackfest, empowering citizens and municipalities across Nepal with transparent, technology-driven public governance.
The following action was requested:
Building applet...The action produced the following result:
Build succeeded - the applet is compiled
