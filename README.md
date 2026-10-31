# Pour Decisions

A pass-the-phone party card game for 2 to 12 players: dares, truths, rules, showdowns, secret missions, a just-for-fun promille estimate and end-of-night awards.

Everything is in one file, `index.html`. No build step and no server needed.

## Put it online with GitHub Pages

1. On GitHub, create a new **public** repository, for example `pour-decisions`.
2. Click **Add file → Upload files**, drop in `index.html`, and commit.
3. Open **Settings → Pages**. Under **Build and deployment**, set **Source** to *Deploy from a branch*, pick the `main` branch and the `/ (root)` folder, and save.
4. After a minute or two the game is live at `https://<your-username>.github.io/pour-decisions/`.

Anyone with the link can play. No account needed.

## Good to know

- **One phone per game.** Pass it around the table. Each phone saves its own game in the browser, so a reload picks up where you left off.
- **Playing on several phones** only works in the claude.ai version, because the sync runs on Claude's servers.
- **Spicy 18+ and Escalate** contain adult cards. The repository is public, so anyone who finds it can read them.
- **The promille numbers are a rough joke estimate.** Never use them to decide whether someone can drive.

## Files

- `index.html` is the game to upload.
- `pour-decisions.html` is the claude.ai version (no page header, since claude.ai adds one). You don't need it on GitHub.
