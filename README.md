# Universal Health Care AI
> **Tagline:** Healthcare for Everyone, Everywhere.

Universal Health Care AI is a modern full-stack web application designed to connect patients with council-verified healthcare specialists and multispecialty hospitals across India (launching in Andhra Pradesh, Telangana, Karnataka, and expanding globally).

---

## 🚀 Key Modules & Architecture

1. **Verified Provider Directory**
   - Verified medical registration numbers audited against State Medical Councils (APMC, TSMC, KMC, MMC).
   - Strict status indicators: `VERIFIED`, `PENDING_VERIFICATION`, `NOT_VERIFIED`, and `INFORMATION_OUTDATED`.
   - Comprehensive provider attributes: clinic addresses, operating hours, consultation fees, experience, languages spoken, and council credentials.
   - Zero-fake-data policy: only displays verified providers or clear empty state notice.

2. **OpenStreetMap Interactive Geo-Location**
   - Interactive Leaflet-powered OpenStreetMap integration with custom color-coded pins for doctor clinics and multispecialty hospitals.
   - One-click navigation and directions.

3. **Atomic Appointment Booking Engine**
   - Guarantees zero double-booking through atomic slot reservation and conflict checks.
   - Reschedule and cancel workflows with cancellation audit logging.
   - Support for booking consultations on behalf of family members (dependents, children, elderly parents).

4. **Universal Health AI Voice Assistant**
   - Multilingual voice recognition & synthesis in **Telugu (తెలుగు)**, **Hindi (हिंदी)**, and **English**.
   - Powered by Gemini (`gemini-3.8-flash` via `@google/genai`) on secure server routes.
   - Grounded responses querying only verified providers.
   - Strict medical boundaries: general health guidance only, no unverified diagnoses or drug prescriptions. Prominent emergency 108/112 helplines.

5. **Smart Hospital OPD Queue Management**
   - Live digital token display showing currently serving token and waiting queue length.
   - Calculated estimated wait times (~12 mins/patient).
   - Provider desk controller to call next token or update OPD status.

6. **Digital Health Records & DPDP Compliance**
   - Encrypted document storage for lab reports, doctor prescriptions, and discharge summaries.
   - DPDP (Digital Personal Data Protection) Act compliant consent logging.
   - Family member profile segregation.

7. **Business & Revenue Analytics**
   - Transparent software subscription tiers for patients, independent doctors, and hospital networks.
   - Financial breakdown: Gross revenue, operating expenses, and net operating profit.
   - **0% Doctor Fee Cut Policy**: Consultation fees belong 100% to medical practitioners.

8. **Platform Administration & Credential Audits**
   - Administrative review queue to approve, reject, or mark provider registrations outdated.
   - Audit logging for all registrar actions.

9. **Progressive Web App (PWA)**
   - Compliant Web App Manifest (`manifest.webmanifest`) with standalone display mode.
   - Service worker precaching via `vite-plugin-pwa`.
   - In-app install button with guided instructions for iOS Safari.
   - Offline connectivity status indicator.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Leaflet (OpenStreetMap)
- **Backend**: Node.js, Express, tsx
- **AI**: Gemini API (`@google/genai` with `gemini-3.8-flash` on server)
- **Speech**: Web Speech API (`SpeechRecognition` & `SpeechSynthesis`)
- **Database / Auth**: Supabase PostgreSQL schemas, RLS policies, migrations in `supabase/migrations/`
- **PWA**: `vite-plugin-pwa`

---

## 📦 Setup & Local Development

1. **Clone repository and install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file based on `.env.example`:
   ```env
   GEMINI_API_KEY="your-gemini-api-key"
   APP_URL="http://localhost:3000"
   # Optional cloud Supabase:
   VITE_SUPABASE_URL="https://your-project.supabase.co"
   VITE_SUPABASE_ANON_KEY="your-anon-key"
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   The app will run at `http://localhost:3000`.

4. **Production Build**:
   ```bash
   npm run build
   npm start
   ```

---

## 🗄️ Database Migrations

SQL migrations with complete tables, foreign keys, indexes, and Row Level Security (RLS) policies are located at:
- `supabase/migrations/001_initial_schema.sql`
- `supabase/seed-demo-data.sql`
