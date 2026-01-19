---
name: experience-crystallizer
description: Analyze current session history to learn from mistakes and crystallize a new skill. Use this when you successfully solved a hard problem after trial and error, and want to save the solution for future use.
tools:
  - name: find_current_session_context
    description: Locate the physical path of the current session's log file (context.jsonl). MUST be called with a unique fingerprint string.
    parameters:
      properties:
        fingerprint:
          description: A unique random string (e.g. UUID) that you MUST generate and include in this tool call.
          type: string
      required:
        - fingerprint
    command: /Users/moonshot/.local/share/uv/tools/kimi-cli/bin/python3 skills/experience-crystallizer/scripts/locate_context.py {fingerprint}

  - name: analyze_session_log
    description: Read and summarize the session log to extract user intent, errors, and successful actions.
    parameters:
      properties:
        path:
          description: The absolute path to the context.jsonl file.
          type: string
      required:
        - path
    command: /Users/moonshot/.local/share/uv/tools/kimi-cli/bin/python3 skills/experience-crystallizer/scripts/analyze_log.py {path}

  - name: validate_generated_skill
    description: Check if the generated skill complies with the Agent Skills specification.
    parameters:
      properties:
        path:
          description: The absolute path to the directory of the newly created skill.
          type: string
      required:
        - path
    command: /Users/moonshot/.local/share/uv/tools/kimi-cli/bin/python3 skills/experience-crystallizer/scripts/validate_skill.py {path}
---

# Experience Crystallizer

This skill enables you to perform **Self-Learning** by creating standardized skills compliant with the **Agent Skills Specification**.

## Trigger Criteria (WHEN TO USE)

**CRITICAL: Do NOT use this skill for trivial tasks.**

You should ONLY use this skill if the current session meets at least one of these criteria:
1.  **Trial & Error**: You failed at least once (e.g., SyntaxError, logic error, wrong API usage) and had to fix it.
2.  **Discovery**: You had to read external documentation or search the web to find a non-obvious solution.
3.  **Complexity**: The solution required multiple steps or specific configurations that are hard to remember.

*If the task was completed successfully on the first try with common knowledge, DO NOT create a skill.*

## Workflow (Decision Flow)

```mermaid
graph TD
    A[Start] --> B[Generate Fingerprint]
    B --> C[Locate Context]
    C --> D[Analyze Log]
    D --> E[Identify Solution]
    E --> F[Generate Skill Files]
    F --> G[Validate Skill]
    G -->|Pass| H[Done]
    G -->|Fail| I[Fix & Retry]
    I --> G
```

## Output Specification (Agent Skills Standard)

You must create the new skill in `skills/learned/<skill-name>/` with the following structure.

### 1. Directory Structure
```text
skills/learned/<skill-name>/
  ├── SKILL.md            # [Required] Entry point
  ├── scripts/            # [Optional] Executable tools (was helpers/)
  ├── references/         # [Optional] Detailed docs
  └── assets/             # [Optional] Static resources
      └── examples/       # [Recommended] Read-only code (.example)
```

### 2. Validation Rules (Strict)

-   **Name**: `SKILL.md` frontmatter `name` must match the directory name. Lowercase, hyphens only.
-   **Code Isolation**: Files in `assets/examples/` MUST end with `.example`.
-   **Executable**: Place agent tools in `scripts/`.
-   **Documentation**:
    -   Keep `SKILL.md` concise (< 500 lines).
    -   Use Mermaid flowcharts for logic.
    -   Include `## Common Pitfalls`.

## Step-by-Step Implementation

1.  Read log analysis.
2.  Determine Root Cause & Solution.
3.  Write `SKILL.md` and auxiliary files.
4.  **RUN `validate_generated_skill`**. Fix any errors reported.
