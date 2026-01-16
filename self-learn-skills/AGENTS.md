# Self-Learning Skills Project

## Overview
This project aims to build a self-evolving agent system where the agent can "learn" from its own trial-and-error experiences. The core capability is encapsulated in the `experience-crystallizer` skill, which analyzes session logs and generates reusable skills.

## Skills

### Experience Crystallizer (`experience-crystallizer`)
- **Path**: `skills/experience-crystallizer/`
- **Goal**: Turn temporary context/history into permanent `SKILL.md` files.
- **Trigger**: "Summarize the experience of fixing this bug into a skill."
- **Mechanism**:
  1. **Locate**: Finds the physical `context.jsonl` file of the current session using a fingerprinting technique.
  2. **Analyze**: Parses the log to identify User Intent, Errors, and the Final Working Solution.
  3. **Crystallize**: Generates a new skill in `skills/learned/` with:
     - `examples/*.py.example` (Safe, read-only code)
     - `helpers/*.py` (Executable tools, if needed)
     - `references/*.md` (Detailed docs)
     - `SKILL.md` (Mermaid flowcharts & pitfalls)

## Workflow for Contributors
1. **Develop**: Work on a task as usual.
2. **Success**: Once the task is completed successfully after some struggle.
3. **Crystallize**: Ask the agent to run the `experience-crystallizer` skill.
4. **Review**: Check the generated skill in `skills/learned/`.
5. **Refine**: Manually polish the generated skill if necessary.
