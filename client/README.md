Absolutely. Save this as your **`README.md`**. I’ve written it as a project progress record, so tomorrow we can continue from the exact point we stopped without restarting anything.

```md
# Reely

Reely is a short-form video social platform inspired by the core experience of TikTok, but designed specifically around the Reely product vision.

The project is being built in stages:

1. Frontend website
2. Backend/API
3. Database
4. Video storage/processing
5. Authentication
6. Social interactions
7. Creator/monetization systems
8. React Native mobile app using the same backend

---

# Current Development Status

## Frontend

**Status: Foundation + main UI implemented**

The frontend is being built with:

- React
- Vite
- Tailwind CSS
- React Router
- Lucide React

Current frontend project:

```text
Reely/
└── client/
```

## Backend

**Status: Not connected yet**

Planned stack:

- Node.js
- Express
- MongoDB
- Mongoose
- JWT authentication
- bcrypt password hashing

Backend work is the next major phase.

---

# Tech Stack

## Frontend

- React `19.2.8`
- React DOM `19.2.8`
- Vite `8.3.3`
- Tailwind CSS `4.3.3`
- `@tailwindcss/vite`
- React Router DOM `7.18.4`
- Lucide React `1.52.0`

## Backend

Planned:

- Node.js
- Express
- MongoDB
- Mongoose
- bcryptjs
- JSON Web Tokens
- CORS
- dotenv

## Future

- Managed video storage/processing
- React Native mobile application
- Push notifications
- Creator monetization
- Nigerian bank payouts

---

# Reely Product Vision

Reely is a vertical short-video platform.

The main experience is:

> Open Reely → immediately watch videos → swipe through content → interact → discover creators.

Users should not be forced to log in before watching public content.

Authentication is required for identity-based actions such as:

- Like
- Comment
- Follow
- Save
- Upload
- Wallet
- Notifications
- Profile

Reporting remains available without authentication.

---

# V1 Product Scope

## Feed

The main feed is a TikTok-style vertical video experience.

Features planned:

- One video at a time
- Vertical swipe navigation
- Autoplay
- Looping
- Play/pause
- Global sound preference
- Double-tap like
- Like
- Comment
- Share
- Save
- Follow
- Report
- Not interested
- Video progress
- Current + next video preloading
- Remember playback position

Only the currently visible video should play.

---

# Video Orientation

Creators can upload:

- Vertical videos
- Square videos
- Landscape videos

The feed remains full-screen.

Vertical videos fill the screen.

Square and landscape videos preserve their aspect ratio while the surrounding area uses a blurred/darkened version of the same video as ambient background.

The goal is to avoid unnecessary cropping and black bars.

---

# Feed Ranking

V1 uses basic personalization rather than advanced AI.

Ranking signals include:

- Watch time
- Likes
- Saves
- Follows
- Skips
- Not interested

Other ranking rules:

- Mostly recent + popular content
- New public videos receive a discovery boost for approximately 48 hours
- Followed creators receive some priority
- Blocked/private content is excluded
- No guaranteed views
- No advanced AI recommendation system in V1

---

# Video Actions

The right-side action stack contains:

1. Like
2. Comment
3. Share
4. Save
5. More

The More menu contains:

- Report
- Not interested

Like:

- Double-tap to like
- Already-liked videos should not be unliked by another double tap
- Count updates immediately
- Only total count is visible
- Creator receives a like notification

Save:

- Private to the user
- Creator can see total save count
- Creator cannot see who saved

Share:

- Share count is visible to the creator
- Identities of people sharing are not exposed
- External sharing supports:
  - WhatsApp
  - Facebook
  - X
  - Copy link
  - More

---

# Comments

Comments appear in a bottom sheet over the video.

The sheet is approximately 70–80% of the screen height.

Features planned:

- Scroll comments independently
- Fixed comment input
- Like comments
- Reply
- Delete own comment
- Report comment
- Creator can delete comments on their own videos
- One-level replies
- Creator can disable comments per video
- Comments are enabled by default

The comment sheet must remain above the mobile bottom navigation.

Scrollbars are hidden where appropriate.

---

# Authentication UX

Reely allows public browsing without authentication.

Authentication is required for:

- Like
- Comment
- Follow
- Save
- Upload
- Wallet
- Notifications
- Profile

If an unauthenticated user attempts a protected action:

1. Current action is intercepted
2. Auth modal opens
3. Current feed position remains intact
4. User can login/signup
5. User can continue the original action afterward

The authentication modal supports:

- Login
- Sign Up

Both are handled inside the same modal.

---

# Current Frontend Authentication

The frontend currently uses a temporary local authentication system.

Files:

```text
client/
└── src/
    └── context/
        ├── auth-context.js
        ├── AuthProvider.jsx
        └── useAuth.js
```

The temporary user is stored in:

```text
localStorage
```

using:

```text
reely-user
```

The current system supports:

- Authentication state
- Login/signup demo flow
- Opening auth modal
- Closing auth modal
- Completing authentication
- Logout
- Updating profile information
- Persisting user information after refresh
- Protected navigation

This will later be replaced/connected to the real Express/MongoDB backend.

---

# Current Auth Provider

The provider exposes:

```text
user
isAuthenticated
authModalOpen
requireAuth()
closeAuth()
completeAuth()
updateUser()
logout()
```

`updateUser()` currently allows profile changes to persist through localStorage.

---

# Signup Requirements

Planned signup fields:

- Display name
- Username
- Email
- Password
- Date of birth

Rules:

### Username

- Unique
- Case-insensitive
- Lowercase internally
- `a-z`
- `0-9`
- `_`
- No spaces
- No periods
- Maximum 30 characters
- Displayed as `@username`

Username availability should eventually be checked through the backend with debounce.

### Display name

Maximum:

```text
50 characters
```

### Bio

Maximum:

```text
160 characters
```

### Password

Minimum:

```text
10 characters
```

### Age

Users must be:

```text
16+
```

Date of birth remains private.

---

# Login

Login will eventually support:

- Email + password
- Google authentication

Password recovery will eventually use email-based reset.

Google authentication is not yet connected to a real provider.

---

# Current Profile

Profile page is implemented.

The profile currently supports:

- Profile photo
- Display name
- Username
- Bio
- Followers
- Following
- Total videos
- Follow / Following
- Video grid
- Pinned videos UI
- Profile menu
- Edit Profile
- Logout

The profile uses the current authenticated user when available.

---

# Edit Profile

Edit Profile is currently implemented on the frontend.

Users can edit:

- Avatar URL
- Display name
- Username
- Bio

Validation includes:

- Username normalization
- Username allowed characters
- Display name required
- Display name maximum 50
- Username maximum 30
- Bio maximum 160

Changes persist locally.

Real image upload will be implemented later when the backend/storage system is built.

---

# Navigation

Reely has responsive navigation.

## Desktop / Tablet

Left sidebar:

```text
Feed
Search
Upload
Wallet
Notifications
Profile
```

## Mobile

Bottom navigation:

```text
Feed
Upload
Wallet
Notifications
Profile
```

The navigation is intentionally neutral.

There is NO red active navigation state.

---

# Navigation Styling

Active:

```text
white
```

Inactive:

```text
white/40
```

Hover:

```text
white/70
```

No active pill.

No active background card.

No red active navigation.

Notification badges use the Reely brand red.

---

# Brand

## Primary Brand Color

```text
#FF3B5C
```

Coral-red.

Hover:

```text
#FF5270
```

The brand red is used selectively.

It is used for things such as:

- Primary CTA
- Follow
- Post
- Like
- Notification badge
- Important interaction states

Not every button should be red.

---

# Other Core Colors

Background:

```text
#0D0E12
```

Current app surfaces often use:

```text
#050607
```

Secondary:

```text
#16171D
```

Surface:

```text
#1F2026
```

White:

```text
#FFFFFF
```

Secondary text:

```text
#99A1B3
```

Muted:

```text
#525866
```

Success:

```text
#10B981
```

Warning:

```text
#FBBF24
```

Danger:

```text
#EF4444
```

Border:

```text
#262833
```

Input:

```text
#12131A
```

Blue can still be used for things such as verification.

Purple is no longer the primary brand color.

---

# Design System

Typography:

```text
Inter
```

General hierarchy:

```text
H1       24px / 700
Section  18px / 600
Title    16px / 600
Body     14–15px / 400
Button   14px / 600
Caption  13px
Metadata 11–12px
```

Spacing:

```text
4px system
```

Radius:

```text
Inputs/buttons   12px
Cards            16px
Bottom sheets    20px
Large panels     24px
Pills            Full
```

Icons:

```text
Lucide
```

---

# Current Frontend Pages

Implemented pages/components include:

```text
Feed
Upload
Profile
Notifications
Search
Auth Modal
Sidebar
Bottom Navigation
Protected Routes
App Shell
Video Card
Video Actions
Authentication Context
```

---

# Feed UI

The feed is designed as a dark, full-bleed, video-first experience.

Important design principles:

- Video is the main focus
- No unnecessary floating dashboard cards
- Full-screen experience
- Minimal UI
- Right-side action controls
- Creator information near the bottom
- Responsive mobile/desktop behavior
- Hidden scrollbars where appropriate

---

# Upload UI

Upload page has been designed as a creator workspace.

Current direction:

- Dark indigo/blue atmospheric background
- Content-first layout
- Not overloaded with cards
- Mobile preview
- Video selection
- Caption
- Hashtags
- Cover selection
- Public/private setting
- Comments toggle
- Post button

The Post button uses the Reely coral brand color.

Current upload UI is frontend-only.

Actual video upload/storage/processing will be implemented later.

---

# Notifications

Notifications page is implemented.

Notification types currently represented include:

- Likes
- Comments
- Replies
- Follows

Notification icon colors:

```text
Like     → Reely coral #FF3B5C
Comment  → Blue #60A5FA
Reply    → Amber #FBBF24
Follow   → Green #34D399
```

Unread indicators use Reely coral.

Notifications are intended to be:

- Newest first
- Retained for approximately 90 days
- Marked read when opened

No notifications for:

- Shares
- Saves
- Milestones

---

# Search

V1 search focuses on:

- `@username`
- `#hashtag`

Search results can lead to:

- People → profile
- Hashtags → video grid

There are no advanced search filters in V1.

There is no trending search system in V1.

The search input uses a custom neutral clear button.

The browser's default search cancel button was removed.

---

# Hashtags

Hashtags are manually created by users.

Hashtag pages use:

```text
3-column video grid
```

with vertical 9:16 thumbnails.

---

# Mentions

Mentions use:

```text
@username
```

They should eventually be:

- Clickable
- Linked to profiles
- Capable of generating notifications

---

# Responsive Design

## Mobile

Uses:

```text
Bottom navigation
```

with:

```text
Feed
Upload
Wallet
Notifications
Profile
```

## Tablet/Desktop

Uses:

```text
Left sidebar
```

with:

```text
Feed
Search
Upload
Wallet
Notifications
Profile
```

The core feed experience remains the same.

---

# Protected Routes

The following routes require authentication:

```text
/upload
/wallet
/notifications
/profile
```

Public:

```text
/
/search
```

Unauthenticated users attempting to access protected routes are shown the authentication modal instead of being allowed into the page.

---

# Current Route Structure

The frontend routes are conceptually:

```text
/
├── Feed
│
├── /search
│   └── Search
│
├── /upload
│   └── Upload
│
├── /wallet
│   └── Wallet
│
├── /notifications
│   └── Notifications
│
└── /profile
    └── Profile
```

Wallet UI is part of the planned navigation/product structure, while the backend monetization system is not yet implemented.

---

# Important Frontend Decisions

These decisions should NOT be casually changed later.

## 1. Reely is not dashboard-style

The consumer app should feel like a social/video product.

It should not become a collection of floating cards.

## 2. Video comes first

Visual hierarchy:

```text
Video
↓
Creator/content
↓
Actions
↓
Navigation
↓
Everything else
```

## 3. Navigation is neutral

No red active navigation.

## 4. Coral is the Reely brand

```text
#FF3B5C
```

But it must be used selectively.

## 5. Purple is no longer primary

Old purple styles should gradually be replaced as screens are refined.

## 6. Existing good UI should not be redesigned unnecessarily

The goal is iterative refinement, not constantly restarting screens.

---

# Current File Structure

Frontend currently follows approximately:

```text
client/
└── src/
    ├── components/
    │   ├── AppShell.jsx
    │   ├── BottomNav.jsx
    │   ├── Sidebar.jsx
    │   ├── VideoCard.jsx
    │   ├── VideoAction.jsx
    │   └── ProtectedRoute.jsx
    │
    ├── context/
    │   ├── auth-context.js
    │   ├── AuthProvider.jsx
    │   └── useAuth.js
    │
    ├── pages/
    │   ├── Feed.jsx
    │   ├── Upload.jsx
    │   ├── Profile.jsx
    │   ├── Notifications.jsx
    │   └── Search.jsx
    │
    ├── App.jsx
    └── main.jsx
```

Exact organization may vary slightly as the project grows.

---

# Frontend Problems Already Solved

Several issues were encountered and fixed during development.

## Vite setup

Initial project setup problems were resolved by creating the working client project correctly.

## AppShell / BottomNav

Fixed default export/import issue.

## Feed

Fixed missing imports involving:

- MessageCircle
- Pause

## VideoAction

Removed unused imports/warnings.

## VideoCard

Fixed hook/set-state-in-effect issues.

## Global mute

Implemented global sound preference behavior.

## Video playback

Fixed repeated playback behavior so videos do not unnecessarily show a loading spinner when replaying.

## Mobile feed

Fixed feed positioning so it sits correctly above the mobile bottom navigation.

## Comments

Comments are above the bottom navigation and independently scrollable.

Scrollbars are hidden where appropriate.

## Desktop feed

Fixed the desktop feed bottom layout issue.

## Authentication modal

Refactored authentication into:

```text
auth-context.js
AuthProvider.jsx
useAuth.js
```

This removed unnecessary hook/lint issues and gave authentication a proper context structure.

## Upload

Created the Upload page and refined its visual design several times.

## Upload scrolling

Fixed the Upload page scrolling behavior using a full-height scrollable layout with hidden scrollbar.

## Upload comments toggle

Fixed the comments toggle positioning and accessibility state.

## Profile

Created the Profile page and fixed imports/play icon issues.

## Notifications

Created the Notifications page.

## Search

Created and refined Search.

Removed the browser's default search cancel button so Reely can use its own clear button.

## Brand color

Migrated the main CTA/action styling away from purple toward:

```text
#FF3B5C
```

## Navigation

Implemented authentication gating on protected navigation items.

---

# Current Authentication Flow

Current frontend flow:

```text
User opens Reely
        ↓
Can watch public feed
        ↓
User attempts protected action
        ↓
Auth modal opens
        ↓
Login / Signup
        ↓
Temporary frontend auth completes
        ↓
User stored in localStorage
        ↓
Protected action/page becomes available
```

This is temporary.

---

# What Is NOT Real Yet

The frontend currently contains demo/local behavior.

The following still need backend implementation:

- Real user accounts
- MongoDB users
- Real password hashing
- Real login
- JWT/session authentication
- Username availability from database
- Real profile persistence
- Real profile photo upload
- Google OAuth
- Password recovery
- Video uploads
- Video storage
- Video transcoding
- Feed API
- Likes database
- Comments database
- Saves
- Follows
- Notifications
- Search database
- Hashtag database
- Reports
- Moderation
- Wallet
- Monetization
- Creator earnings
- Payouts

---

# Next Development Phase

## Backend Authentication

The next step is NOT more frontend redesign.

We are moving to:

```text
Express
    ↓
MongoDB
    ↓
User Model
    ↓
Signup API
    ↓
Login API
    ↓
bcrypt password hashing
    ↓
JWT authentication
    ↓
Username availability API
    ↓
Connect AuthModal to backend
    ↓
Replace localStorage demo authentication
```

Backend folder:

```text
Reely/
├── client/
└── server/
```

Planned server structure:

```text
server/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── authController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── authRoutes.js
│   └── server.js
├── .env
├── .gitignore
└── package.json
```

---

# Development Rule

Do not restart the project from scratch.

Continue from the existing implementation.

The frontend is already established.

When refining the UI:

- Preserve what already works
- Make targeted improvements
- Don't redesign screens unnecessarily
- Keep the Reely brand consistent
- Keep navigation neutral
- Use coral selectively
- Avoid returning to purple as the primary color

---

# V1 Explicitly Excluded

The following are NOT part of Reely V1:

- Crypto
- Mining
- Coins
- Points
- Viewer cash rewards
- DMs
- Advanced AI recommendations
- Trending
- Advanced search filters
- Public follower/following lists
- Public saved tab
- Nested replies
- Playback speed
- Offline downloads
- Manual video quality
- Paid verification
- Achievement badges
- Dedicated Following feed
- Excessive onboarding
- Login wall before watching

---

# Pilot

Initial pilot:

```text
~50 users
```

Target:

- ESUT students
- TECHSPACE/community users
- Early creators

Pilot rules:

- Invite-only
- No ads
- No cash payouts
- Creators are told upfront that earnings begin after monetization/ads are approved
- Early creators receive Founding Creator status
- Early creators receive initial feed exposure

The pilot's primary purpose is validating:

```text
Watch
Upload
Follow
Interact
Return
```

---

# Long-Term Architecture

Eventually:

```text
                  ┌─────────────────┐
                  │   React Website │
                  └────────┬────────┘
                           │
                           │ REST API
                           ↓
                  ┌─────────────────┐
                  │  Node + Express │
                  └────────┬────────┘
                           │
             ┌─────────────┼─────────────┐
             ↓             ↓             ↓
        MongoDB       Video Service   Auth System
             │             │             │
             └─────────────┼─────────────┘
                           │
                           ↓
                  ┌─────────────────┐
                  │ React Native App│
                  └─────────────────┘
```

The website and future mobile app will use the same backend/API.

---

# Current Position

## Completed

- React/Vite setup
- Tailwind setup
- Routing
- App shell
- Responsive navigation
- Feed UI
- Video card UI
- Video actions UI
- Comments UI
- Upload UI
- Profile UI
- Edit Profile
- Notifications UI
- Search UI
- Protected navigation
- Frontend authentication context
- Demo authentication
- Local profile persistence
- Reely brand system
- Responsive mobile/desktop foundation

## Current

```text
Frontend foundation complete.
```

## Next

```text
Build the real backend.
```

## Immediate next task

```text
Express server
        ↓
MongoDB connection
        ↓
User model
        ↓
Signup
        ↓
Login
        ↓
JWT
        ↓
Connect frontend authentication
```

---

# Reely Status

**Frontend:** 🟢 Foundation complete

**Authentication UI:** 🟢 Complete

**Backend:** 🟡 Starting

**Database:** 🔴 Not connected

**Video system:** 🔴 Not started

**Social system:** 🔴 Not connected to backend

**Monetization:** 🔴 Not started

**Mobile app:** 🔴 Later

---
```

**Save that as `README.md`.** Tomorrow, we can literally start from the **“Next Development Phase → Backend Authentication”** section and continue without re-planning Reely.