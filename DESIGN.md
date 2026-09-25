# Designing ExecHQ: laptop setup

This gets the ExecHQ prototype running on your laptop so you can work in the
**showroom** — the design system, every component in every state, and a
playground for stepping through flows. Everything you see there is the real
thing from this repo, not a copy.

It needs no login, no database and no keys. Nothing you do in the showroom is
saved or sent anywhere, and the showroom is never part of the public site.

## One-time setup

About twenty minutes, most of it downloads.

1. **Accept the GitHub invitation.** Kate adds you to the `kate0641/ExecHQ`
   repository. Accept the email invitation before going on.

2. **Install Node.js 24.** Download the 24.x installer from
   [nodejs.org](https://nodejs.org) and run it. It includes npm, which is the
   only package manager this project uses — not yarn, pnpm or bun. Check it
   worked:

   ```bash
   node -v
   ```

   It should print a version starting `v24`.

3. **Install Git.** On a Mac, this installs it if it is missing and does
   nothing if it is already there:

   ```bash
   xcode-select --install
   ```

   On Windows, use the installer from [git-scm.com](https://git-scm.com).

4. **Install the GitHub CLI and sign in.** Install it from
   [cli.github.com](https://cli.github.com), then:

   ```bash
   gh auth login
   ```

   Choose GitHub.com, HTTPS, and sign in with a browser. Then let Git use the
   same sign-in:

   ```bash
   gh auth setup-git
   ```

5. **Install Claude Code** from [claude.com/claude-code](https://claude.com/claude-code).

6. **Get the code.** This makes an `ExecHQ` folder wherever you run it:

   ```bash
   gh repo clone kate0641/ExecHQ
   ```

   ```bash
   cd ExecHQ
   ```

7. **Copy the settings file.** It has nothing secret in it; it only turns the
   showroom on.

   ```bash
   cp .env.example .env.local
   ```

8. **Start it.**

   ```bash
   npm run showroom
   ```

   The first run installs packages, which takes a minute or two. When it says
   **Ready**, open the address it printed — normally
   [localhost:3000/showroom](http://localhost:3000/showroom).

## Every day after that

From the `ExecHQ` folder:

```bash
npm run showroom
```

Press **Ctrl+C** in that window to stop it. Changes you save show up in the
browser straight away; there is no need to restart.

## If something goes wrong

| What you see | What to do |
| --- | --- |
| "this needs Node 24" | Install Node 24 (step 2), close the terminal window, open a new one and try again. |
| "running on Node 26" (or another version) | It will still run. If something looks different from a preview link, install Node 24. |
| ".env.local exists but does not turn the showroom on" | Open `.env.local` and add the line `SHOWROOM=on`. |
| The showroom says "This page could not be found" | The same fix: check `.env.local` has `SHOWROOM=on`, then stop and restart. |
| It opened on port 3001 instead of 3000 | Something else is already using 3000, often another copy of the showroom. Use the address it printed. |
| "installing packages failed" | Check you are online, then run `npm run showroom` again. |
