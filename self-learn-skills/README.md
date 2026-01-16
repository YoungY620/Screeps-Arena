# Self-Learning Skills: Design Philosophy

## 1. State Machine Perspective of Agentic Bots

Agentic exploration can be fundamentally modeled as a **state machine traversal** problem. When an agent operates in an unknown environment, every tool invocation functions as a **policy-based action** in reinforcement learning, yielding new observations (context updates).

```
┌─────────────────────────────────────────────────────────────┐
│                      Agent State Space                       │
│                                                             │
│    [Initial State]                                          │
│         │                                                   │
│         ├─► Tool Call A (Action) ──► Reward/Observation    │
│         │            ▲                      │                │
│         │            │                      ▼                │
│         │      [New State S1] ◄─── Policy Decision          │
│         │            │                      │                │
│         └─► Tool Call B (Action) ──► Reward/Observation    │
│                      ▲                      │                │
│                      │                      ▼                │
│                [New State S2] ◄─── Policy Decision          │
│                      .                      .                │
│                      .                      .                │
│                      .                      .                │
│                [Goal State] ────────► Task Complete          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

In this framework:
- **States** represent the agent's current context (file system state, memory, tool outputs)
- **Actions** are tool invocations (shell commands, file operations, API calls)
- **Transitions** update the context based on action outcomes
- **Rewards** are implicit in task progression or error reduction

## 2. Modeling Complex Problems

The practical challenge emerges from **finite exploration budgets** and **cognitive limitations**:

### 2.1 Inherent Difficulties
- **Non-deterministic outcomes**: Each action may succeed or fail unpredictably
- **Context decay**: Limited context windows lead to intermediate forgetting
- **Exploration fatigue**: Agents lack the "patience" for exhaustive search
- **Credit assignment**: Difficulty identifying which actions contributed to success

### 2.2 The Complexity Bottleneck
Complex problems manifest as **inefficient traversal** in the state space:

```
┌─────────────────────────────────────────────────────────────┐
│              Exploration Cost in Complex Tasks               │
│                                                             │
│    Without Skill:                                          │
│    ──────────────────────────────────────────────────      │
│    Start ──► F ──► F ──► F ──► B ──► B ──► F ──► ...      │
│     │        ▲            ▲            ▲            ▲      │
│     └────────┴────────────┴────────────┴────────────┘      │
│         Many failed attempts before reaching Goal          │
│                                                             │
│    With Skill:                                             │
│    ──────────────────────────────────────────────────      │
│    Start ───────────────────────────────► Goal             │
│                 Direct, learned transition                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
Legend: F = Failed path, B = Backtrack, ... = Long exploration
```

The **trial-and-error cost** becomes prohibitive when:
- The solution requires deep, non-obvious inference chains
- Similar sub-problems recur across sessions
- The state space contains many local minima (deceptive "almost solutions")

## 3. Skill and Self-Generated Skill Modeling

### 3.1 Human-Written Skills as God-View Shortcuts
A manually crafted skill represents **transcendent knowledge**: an edge drawn directly from start to goal state, bypassing the entire exploration subgraph.

```
┌─────────────────────────────────────────────────────────────┐
│                 Skill as a Shortcut Edge                     │
│                                                             │
│    State Space Graph                                       │
│                                                             │
│        [S0] ──────► [S1] ──────► [S2] ──────► [S3]        │
│          │           │           │           │              │
│          │   [Exploration Path]  │           │              │
│          └───────────────────────┴───────────┘              │
│                    ▲   ▲   ▲   ▲   ▲                       │
│                    │   │   │   │   │                       │
│                  [Failures & Backtracks]                    │
│                                                             │
│          ┌────────────────────────────────────────┐         │
│          │  Direct Skill Edge (Human Knowledge)  │         │
│          └────────────────────────────────────────┘         │
│                              │                              │
│                              ▼                              │
│                            [Goal]                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Agent-Generated Skills: Crystallized Experience
When an agent autonomously synthesizes a skill, it performs **exploration subgraph compression**:

1. **Locate** a valuable multi-trial exploration trace
2. **Identify** the problem definition (initial state characteristics)
3. **Extract** the verified solution (action sequence that reliably reaches goal)
4. **Generalize** by removing session-specific details while preserving reusable logic

### 3.3 Skill Structure as Knowledge Decomposition
A well-formed skill decomposes experience into:

- **`examples/*.example`**: **Read-only reference patterns** - Safe, documented solutions
- **`scripts/*`**: **Executable transformations** - Reusable tool chains
- **`references/*.md`**: **Deep documentation** - Rationale, edge cases, alternatives
- **`SKILL.md`**: **Operational manual** - Mermaid flowcharts, common pitfalls

This structure supports **progressive disclosure**: simple cases use the shortcut, complex cases drill into references.

## 4. Meta-Skill: Teaching Models to Write Skills

The `experience-crystallizer` meta-skill encodes the **crystallization protocol**:

### 4.1 Critical Design Principles

**Principle 1: No Crystallization Without Struggle**
> *"If the task succeeded on first try with common knowledge, DO NOT create a skill."*

Rationale from experiments: Premature skill generation **increases cognitive load** by adding reading overhead without compensatory savings. The agent must first "pay" exploration cost to justify skill creation.

**Principle 2: Fingerprint-Based Session Localization**
The agent must locate its own session log (`context.jsonl`) using a unique fingerprint:

```
┌─────────────────────────────────────────────────────────────┐
│              Session Localization Process                    │
│                                                             │
│    Agent ──► Generates UUID Fingerprint ──► Registers       │
│      │                                       │               │
│      │                                       ▼               │
│      │                               Writes Fingerprint      │
│      │                               to Log File            │
│      │                                       │               │
│      │                                       ▼               │
│      ◄───────────────────────────────────────┤               │
│              Search for file containing fingerprint         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

This solves the **self-identification problem**: the agent doesn't inherently know which session it belongs to.

**Principle 3: Skill Validation as Final Gate**
The meta-skill enforces structural compliance:
- Directory naming matches skill name
- `.example` extension for read-only code
- Flowchart documentation requirement
- Pitfall enumeration

### 4.2 The Crystallization Workflow

```
┌─────────────────────────────────────────────────────────────┐
│              Experience Crystallization Pipeline             │
│                                                             │
│    [Successful Session]                                     │
│           │                                                 │
│           ├─► 1. Locate Session Log (Fingerprint)          │
│           │                                                 │
│           ├─► 2. Analyze Log                               │
│           │    └─► Extract: Intent → Errors → Solution     │
│           │                                                 │
│           ├─► 3. Generate Skill Structure                  │
│           │    ├─► SKILL.md (flowcharts + pitfalls)        │
│           │    ├─► examples/ (read-only patterns)          │
│           │    └─► scripts/ (executable helpers)           │
│           │                                                 │
│           └─► 4. Validate & Refine                         │
│                └─► Structural compliance check             │
│                                                             │
│    [New Reusable Skill in skills/learned/]                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4.3 Experimental Validation

**Test Scenario**: Recover structured data from a damaged binary file (Screeps save format)

**Results**:
- **33% step reduction** (15 → 10 steps)
- **36% fewer tool calls** (14 → 9 calls)
- **75% less file clutter** (4 → 1 temporary files)
- **Identical output quality** (11 fields extracted correctly)

The mechanism is **contextual enhancement** rather than direct skill invocation: the agent discovers existing capabilities (`parse_legacy.py`) and avoids redundant development.

## 5. Open Challenges (Legacy Issues)

### 5.1 Session Localization Fragility
Current approach requires fingerprinting because agents lack **introspective awareness** of their session context. A more robust solution might involve:
- Embedding session metadata in the agent's initial state
- Maintaining a symbolic link to the active session log

### 5.2 Static Skill Format vs. Dynamic Experience
The file-based skill structure is **optimized for human authoring**, not dynamic agent updates:
- Difficult to incrementally extend with new edge cases
- No built-in versioning or deprecation mechanism
- Hard to quantify skill utility for garbage collection

Potential direction: **Experience database** with structured logging of:
- Invocation frequency and success rate
- Context similarity metrics
- Automatic skill recommendation based on current state

### 5.3 Integration with Active Context Compression
The goal of skill crystallization aligns with **context compression training**:
- Both aim to preserve relevant information while discarding noise
- Skills provide **interpretable, reusable** compressed knowledge
- Could inform reward functions: "Does this action lead to skill-eligible experience?"

Synergistic approach: Use skill generation as a **weak supervision signal** for context compression models.

### 5.4 Deployment in Unknown Environments (Screeps Integration)
Embedding the crystallizer in a game agent (Screeps) reveals:
- **Cognitive overhead**: Skill processing competes with real-time decision cycles
- **Reward sparsity**: Game rewards don't align with skill-generation worthiness
- **Unknown effectiveness**: Requires long-term A/B testing across many missions

## Conclusion

The self-learning skills architecture reframes agent improvement as **state space graph optimization**:

1. **Complex problems** are expensive explorations in high-dimensional state spaces
2. **Skills** are shortcut edges that amortize exploration cost across sessions
3. **Experience crystallization** is autonomous subgraph compression
4. **Meta-skills** encode the crystallization protocol itself

The key insight: **Learning is not about parameter updates, but about acquiring reusable state transitions** that bypass the need for repeated trial-and-error. The `experience-crystallizer` demonstrates that agents can learn not just *what to do*, but *what to remember*.

---

*This document articulates the foundational design philosophy. For implementation details, see `/skills/experience-crystallizer/SKILL.md`.*
