# Project Rules

These rules apply to every task in this project.

1. **Read and maintain project memory**
   - At the start of meaningful work, read `rules.md`, `project_context.md`, and `chat.md` in that order.
   - If any file does not exist, create it from the project template without overwriting existing content.
   - Before finishing each meaningful task, update both `chat.md` and `project_context.md` with relevant requirements, decisions, work status, client communication, and validation results.
   - Keep `chat.md` to durable information only; do not copy the full chat transcript.

2. **Client-facing messages**
   - When drafting a message, question, or update for the client, provide it in one clean plain-text copy box.
   - Use short, human language with clear spacing and line breaks so it can be pasted into WhatsApp without breaking the formatting.
   - Mention only what the client needs to know. Do not include internal development details, commands, implementation debate, or unnecessary technical terms.

3. **Efficient project reading**
   - Do not repeatedly scan generated or dependency folders unless the task directly requires them. Normally exclude: `node_modules/`, `vendor/`, `.git/`, `.next/`, `dist/`, `build/`, `coverage/`, `.cache/`, `tmp/`, and virtual-environment folders.
   - Read targeted source, configuration, documentation, test, and log files instead of repeatedly reading the entire project.

4. **Git handoff after every change**
   - After every local code or theme-file change, provide exact PowerShell Git commands for the changed paths: status review, staging, commit, and push to the current working branch when appropriate.
   - Do not run `git add`, `git commit`, or `git push` automatically unless the client explicitly asks; the client runs the supplied commands.
   - Keep the commands scoped to the files changed in that task and clearly state when a push is not needed.



5. **Requirement and task tracking**
   - Add each new requirement to `project_context.md` as soon as it is understood.
   - Mark work as `In progress`, `Pending`, `Blocked`, or `Completed`; do not silently lose unfinished work.
   - Record each client query/update in the client communication log and move it from waiting to answered when resolved.

6. **Clear scope and concise answers**
   - Answer the client directly and to the point. Explain technical detail only when it affects their decision, timeline, cost, or required action.
   - Do not make irreversible, out-of-scope, or access-sensitive changes without clear approval.



