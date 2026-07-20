---
name: doc
description: Write educational markdown docs in docs/ that distill key concepts learned during a chat session. Use when the user asks to document, recap, summarize, or write up what was learned or discussed.
---

# Doc: distill chat learnings into educational docs

Create concise markdown docs in `docs/` that capture what the user learned in
the current conversation, so they can revisit concepts without rereading chats.

## Audience and voice

The reader is a junior engineer (see `CLAUDE.md`). Write to teach, not to
impress. Plain language, complete sentences, no filler.

## Rules

1. **Only document what was actually discussed**, at the depth it was
   discussed. Do not introduce new or more advanced material — if a topic was
   deliberately skipped in chat, skip it in the doc.
2. **Brief and dense.** Prefer one doc under ~100 lines. Cut anything that
   doesn't help future-you recall or re-derive the concept.
3. **Anchor claims to real code.** When a concept is visible in this repo,
   link to it with a standard markdown link using a path relative to the doc
   plus a `#L<line>` anchor, and show the excerpt in a normal fenced code
   block with a language tag:

   ```markdown
   See [src/main.tsx](../src/main.tsx#L4):
   ```

   Do NOT use the chat-only citation format (```startLine:endLine:path``` code
   fences) — it does not render as a link inside markdown files. Verify line
   numbers by reading the file first — never cite from memory. Stale line
   numbers after future edits are acceptable.
4. **Organize by concept, not chronology.** Group related ideas even if they
   came up at different points in the chat.
5. **Explain the why.** Each tool or pattern gets one sentence on the problem
   it solves, not just what it is.
6. **Don't add 'check yourself' questions at the end.** 

## Workflow

1. List the key concepts covered in the chat; drop tangents.
2. Read any repo files you plan to cite to confirm current line numbers.
3. Write to `docs/<topic>.md` (lowercase, hyphens). One topic per file.
4. If the doc would exceed ~150 lines, verify with the user before writing large docs
