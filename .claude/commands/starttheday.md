---
description: Start the day - pull, read the notes, start the server, open the preview
---

Start the working day on this project. Do these in order:

1. Run `git status`. If there are uncommitted changes, say what they are and stop before pulling so nothing gets tangled; otherwise run `git pull` and summarise what came in (pages, components, assets, notes).
2. Read `CLAUDE.md` and `HANDOFF.md` in full, even if nothing was pulled: the rules and the stopping point may have changed on the other laptop.
3. Start the server if port 8420 isn't already listening: `python3 serve.py` with Bash in the background (never through `.claude/launch.json`).
4. Open the preview at http://localhost:8420/ and check it: no console errors, no failed files.
5. Report briefly: what was pulled, that the server and preview are up, the "Unfinished / waiting on the user" list from `HANDOFF.md`, and its "First task next time". Then ask what to build.

Don't change any project file, commit or push during this command.
