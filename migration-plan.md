# Strive Website — Migration to Org GitHub & Vercel

**Goal:** Move the live Strive website from Tamryn's personal accounts to the organisation's GitHub and Vercel, with no downtime and no impact on Google Analytics.

**Time required:** ~30 minutes. Tamryn and the Vercel account owner should be on a call together.

**Google Analytics:** Not affected at any point. GA tracks by domain URL, which never changes throughout this process.

---

## Before the call — prep steps (Tamryn)

### 1. Note down the environment variable from personal Vercel

Log into personal Vercel → open the Strive project → Settings → Environment Variables → copy the value for `NEXT_PUBLIC_TRIAL_URL`.

> **Why:** The new Vercel project starts blank. This variable controls the "Book a Free Trial" link across the whole site — it must be copied across or the CTA will be broken on launch.

---

## On the call — Phase 1: Move the code (Tamryn, ~2 minutes)

### 2. Transfer the GitHub repo to the org

Go to `github.com/tamaroolaz-me/strive-site` → Settings → scroll to Danger Zone → Transfer → enter the org name → confirm.

> **Why:** This moves the source code to the organisation's ownership. GitHub instantly creates a redirect from the old personal URL, so nothing breaks immediately.

---

## On the call — Phase 2: Set up new deployment (Vercel account owner, ~10 minutes)

### 3. Authorize GitHub org access on the company Vercel account

In Vercel → Settings → Git Integrations → ensure the GitHub org is listed and authorized. If not, approve the Vercel GitHub App. Tamryn may need to approve this on the GitHub org side simultaneously (as org owner).

> **Why:** Vercel needs permission to read the org's repositories before it can import the project. This is a one-time authorization step.

### 4. Import the repo and deploy

Vercel → Add New → Project → select the transferred repo from the org → click Deploy. Wait for the build to complete. Vercel will generate a temporary staging URL (e.g. `strive-site-xyz.vercel.app`).

> **Why:** This creates a fully working copy of the site on the company account without touching the live site at all.

### 5. Add the environment variable

In the new Vercel project → Settings → Environment Variables → add `NEXT_PUBLIC_TRIAL_URL` with the value copied in Step 1.

> **Why:** Without this, the "Book a Free Trial" buttons across the site will not work correctly.

### 6. Test the staging URL

Both people open the staging URL and check: pages load, nav links work, "Book a Free Trial" CTA goes to the right place.

> **Why:** This is the safety check before touching the live domain. Any issues are caught here, not in production.

---

## On the call — Phase 3: The domain swap (both people ready, ~2 minutes)

> **Important:** Do steps 7 and 8 back-to-back with no delay.

### 7. Remove domain from personal Vercel (Tamryn)

Personal Vercel → Strive project → Settings → Domains → Remove the production domain (e.g. `strivemath.com`).

> **Why:** Vercel won't allow two projects to hold the same domain simultaneously. This frees it up. Vercel's global edge cache keeps the site serving during the brief handoff window.

### 8. Add domain to company Vercel (Vercel account owner)

Company Vercel → new Strive project → Settings → Domains → type in the production domain → Add. Vercel will provision the SSL certificate and begin routing traffic within seconds.

> **Why:** This is the actual cutover. Live traffic is now served from the company account.

### 9. Verify the live site

Both people open the real domain in a fresh browser tab and confirm everything looks correct.

---

## After the call — cleanup (5 minutes)

### 10. Update Tamryn's local Git remote

In terminal, inside the project folder:

```bash
git remote set-url origin https://github.com/YOUR-ORG-NAME/strive-site.git
```

> **Why:** The local copy still points to the old personal repo address. This fixes it so future pushes go to the right place.

### 11. Delete the old personal Vercel project

Only once the live site is confirmed working on the company account: Personal Vercel → old Strive project → Settings → Delete Project.

> **Why:** Avoids confusion and cleans up the personal account. Do not do this before the domain is verified live on the company account.

### 12. Add Tamryn as a team member on company Vercel

Company Vercel → Team Settings → Members → Invite Tamryn's email.

> **Why:** Gives Tamryn visibility into deployments and build logs when pushing code in future — without needing a paid personal Vercel account. Pushing code to GitHub will continue to trigger automatic deploys regardless, but team membership lets Tamryn see build status and errors.
