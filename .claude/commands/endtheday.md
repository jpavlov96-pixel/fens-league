---
description: End the day - update the notes, commit, push so the other laptop can continue
---

End the working day on this project. Running this command is the user asking for the commit and the push (the push is a public deploy of the site). Do these in order:

1. Run `git status` and `git diff` to see everything that changed today, plus `git log` for today's commits.
2. If the preview shows work in progress, check the pages still load with no console errors or failed files. If something is broken, say so and ask before going on: a push puts it on the live site.
3. Rewrite `HANDOFF.md` for today, keeping its sections: "Done today", "Unfinished / waiting on the user", "Decisions and gotchas", "First task next time". Head it with today's date. Drop items that are finished or no longer true.
4. Update `CLAUDE.md` only where today changed something lasting: where things live, how to run it, or a working rule the user gave. Don't log the day's work there.
5. If feature work is still uncommitted, commit it first on its own with a message saying what changed. Then commit the notes as "End of day: handoff updated for <the day's main change>".
6. Run `git push` and confirm it went through.
7. Stop the server on port 8420 if this session started it.
8. Report briefly: what was committed and pushed, and the first task for next time.
