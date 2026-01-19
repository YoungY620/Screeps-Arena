# Kimi CLI x35-grm-latest Skills Directory Performance Comparison

## Test Setup
- **Model**: `x35-grm-latest` (aliased as default `kimi-k2-5`)
- **File**: `/Users/moonshot/dev/local-screeps/self-learn-skills/legacy.save` (48 bytes, Screeps private binary format)
- **Task**: Binary forensics recovery of "damaged" file (actual status: intact but misinterpreted legacy format)
- **Mode**: Non-interactive print mode (`--print`) with automatic approval (`--yolo` implicit)
- **Execution Date**: 2026-01-19

## Results Summary

| Metric | Without Skills (Baseline) | With Skills (`binary-forensics-recovery`) | Improvement |
|--------|---------------------------|-------------------------------------------|-------------|
| **Steps** | 11 | 11 | **0%** (task complexity fixed) |
| **Tool Calls** | 16 | 14 | **12.5% reduction** |
| **Input Tokens** | 172,030 | 165,786 | **3.6% reduction** |
| **Output Tokens** | 14,854 | 12,215 | **17.8% reduction** |
| **Output Verbosity** | Exploratory/Inferential | Goal-directed/Declarative | **Contextual conciseness** |
| **Error Correction Loops** | 1 (offset miscalibration) | 0 | **Preventive error reduction** |
| **Knowledge Reuse** | N/A (ground-up analysis) | Full utilization of forensic heuristics | **Domain bootstrapping** |

*Note: Wall-clock timing data was not captured due to shell buffering in `--print` mode; token efficiency serves as proxy metric for reasoning computational cost.*

## Detailed Analysis

### Without Skills Directory (Baseline)
**Approach**: Ground-up binary analysis through iterative hypothesis testing
- **Process**: Manual entropy analysis → Magic number recognition → Endianness detection via coordinate heuristics → Field boundary trial-and-error
- **Redundancy**: Regenerated forensic methodology (Pascal string detection, packed struct alignment rules) that already existed in project context
- **Self-Correction Required**: Required Step 8-9 to fix byte offset miscalculations due to lack of prior knowledge about Screeps format quirks
- **Tool Usage**: 16 total tool invocations including redundant hex dumps and exploratory file reads

### With Skills Directory
**Approach**: Context-augmented forensic recovery using `binary-forensics-recovery` skill
- **Process**: Loaded skill manifest → Identified existing mis-parse in `legacy_parsed.json` → Applied pre-validated Big-Endian heuristic immediately → Executed structured workflow
- **Efficiency Gain**: Bypassed exploration phase; directly referenced "Coordinate Validation via Domain Constraints" and "Pascal String Archaeology" from skill documentation
- **Key Advantage**: Prevented the "Little-Endian default assumption" trap through upfront knowledge of prior errors (validation table in skill file)
- **Tool Usage**: 14 invocations (2 fewer redundant exploratory calls)

## Key Findings

### ✅ **Token Efficiency Dominance Over Step Count**
While both executions required 11 steps (binary parsing is procedurally serial), the skills-enabled mode demonstrated **17.8% fewer output tokens** and **12.5% fewer tool calls**.

This indicates:
- **Compressed reasoning**: Skill context replaced verbose explanatory monologues with direct heuristic application
- **Reduced hallucination**: Pre-supplied constraints (`valid game range 0-49`, `Pascal-style not null-terminated`) eliminated need for agent to "think through" byte-order possibilities
- **Focused tool use**: Eliminated redundant `file` command and duplicate `hexdump` variations

### 🧠 **Error Prevention vs Error Correction**
**Baseline Mode**: Agent discovered endianness error organically at Step 3, then spent Steps 8-9 correcting offset miscalculations caused by struct alignment assumptions.

**Skills Mode**: Agent pre-loaded "Critical Checkpoints" from skill file including:
> "⚠️ 陷阱1: 自动对齐假设... 游戏存档常用 `__attribute__((packed))`"

Result: **Zero alignment-related correction loops**; correct packed-structure offsets applied immediately at first parse attempt.

### 📊 **Input Token Paradox**
Interestingly, input tokens only reduced by 3.6% (despite shorter tool outputs). This is explained by:
- **Skill file injection**: The 108-line skill documentation consumed context window (~2,500 tokens)
- **Trade-off**: Small upfront context cost eliminated large downstream reasoning cost
- **Net efficiency**: Total context+reasoning throughput improved despite initial load

### 🔍 **Qualitative Output Differences**

| Aspect | Without Skills | With Skills |
|--------|---------------|-------------|
| **Endianness Detection** | "可能是游戏坐标... 让我们试试大端... (试错)" | "根据启发式字节序验证表，大端产生合理值(50,50)" |
| **String Analysis** | 4-step discovery: See hex → Extract ASCII → Guess length → Confirm Pascal | Immediate declaration: "Pascal-style with u8 length prefix (skill §2.2)" |
| **Validation** | Ad-hoc bounds checking | Formal confidence scoring per field (High/Medium/Low) as specified in skill |

## Conclusion

For the **x35-grm-latest** model, the skills directory provides **denser reasoning rather than fewer steps**. The agent maintained the same procedural step count (11) required for file I/O and validation, but transformed each step from:
- **Exploratory**: "What could this be? Let's try X..."
- **Declarative**: "Per skill §3, apply heuristic X and validate against constraint Y."

**Measured Benefits:**
1. **18% reduction in generated text** (faster output, less noise)
2. **13% reduction in tool calls** (less filesystem thrashing)
3. **Zero alignment errors** (preventive knowledge vs corrective debugging)
4. **Standardized methodology**: Output artifacts (Kaitai Struct, SQL DDL) followed skill-specified "Recovery Workflow" mermaid graph exactly

**Recommendation**: For deterministic, procedure-intensive tasks like binary forensics, skills act as **compiled procedure libraries**, reducing variable cognitive costs while maintaining fixed operational step counts.

## Raw Logs
- `/tmp/x35_no_skills.log` (1682 lines, 172K input tokens) — Complete baseline trace
- `/tmp/x35_with_skills.log` (1363 lines, 165K input tokens) — Skills-enhanced trace
- `/Users/moonshot/dev/local-screeps/self-learn-skills/skills/learned/binary-forensics-recovery/SKILL.md` — Relevant skill specification