# Design Document: Experience Crystallization Skill (Self-Learning)

## 1. Overview
Targeting the **Agent Skills Specification** (agentskills.io), this skill automates the creation of high-quality, standardized skills from session logs.

## 2. Core Workflow
1.  **Locate**: Fingerprint matching to find `context.jsonl`.
2.  **Analyze**: Extract Intent -> Error -> Solution chain.
3.  **Crystallize**: Generate skill files following the strict specification below.

## 3. Output Specification (Agent Skills Standard)

The generated skill MUST adhere to the following structure:

### 3.1 Directory Structure
```text
skills/learned/<skill-name>/
  ├── SKILL.md            # [Required] Entry point
  ├── scripts/            # [Optional] Executable code (was helpers/)
  ├── references/         # [Optional] Detailed docs
  └── assets/             # [Optional] Static resources
      └── examples/       # [Recommended] Code patterns (.example)
```

### 3.2 File Requirements

#### `SKILL.md`
-   **Frontmatter**:
    -   `name`: Lowercase, hyphens only. Must match directory name.
    -   `description`: What and when to use.
-   **Content**:
    -   **Mermaid Flowchart**: Visual decision tree.
    -   **Common Pitfalls**: "Anti-patterns" learned from failures.
    -   **Progressive Disclosure**: Keep file < 500 lines. Move details to `references/`.

#### `assets/examples/` (Code Patterns)
-   Files must end in `.example` to prevent accidental execution.
-   Referenced in `SKILL.md` as: `[Example](./assets/examples/demo.py.example)`

#### `scripts/` (Executable)
-   Contains Python/Shell scripts that the Agent can invoke via Tool definitions.

## 4. Trigger Scenarios
-   "Summarize this session into a skill."
-   "Create a skill for fixing Error X."
