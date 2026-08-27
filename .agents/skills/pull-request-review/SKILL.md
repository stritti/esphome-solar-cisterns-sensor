---
name: pull-request-review
description: Address GitHub pull-request review feedback in this repository, including implementation, validation, commit, push, thread reply, resolution, and final verification.
---

# Pull Request Review

Use this skill whenever the user asks to inspect, address, answer, or resolve pull-request review comments.

## Complete each review thread

1. Fetch all review threads and identify every unresolved thread before editing.
2. Check each comment against the current branch. If it is actionable, update the source and all affected links, translations, tests, workflows, or documentation. If it is not actionable, prepare a concrete evidence-based explanation.
3. Run the validation relevant to the changed area and treat failures as blockers.
4. Commit the complete fix with a focused message and push it to the pull-request branch.
5. Verify that the remote pull-request head contains the commit and that the pull request remains mergeable.
6. Reply inside the original review thread. Reference the commit, summarize the implemented change, and state the validation performed. For rejected feedback, explain the reason and evidence instead.
7. Resolve the thread only after the fix or explanation has been pushed and the reply has been posted.
8. Fetch the review threads again. Do not report completion while an actionable unresolved thread remains.

Do not resolve a thread silently, reply before pushing the fix, or describe local-only work as completed.
