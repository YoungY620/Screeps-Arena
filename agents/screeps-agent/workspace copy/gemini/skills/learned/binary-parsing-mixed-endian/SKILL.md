---
name: binary-parsing-mixed-endian
description: Parsing binary files with mixed endianness and variable-length records in Python.
---

# Binary Parsing (Mixed Endian)

This skill summarizes the pattern for parsing binary files that utilize mixed byte orders (Big Endian and Little Endian) and contain variable-length records. This is common in legacy game saves or custom network protocols.

## Trigger Criteria

Use this pattern when:
- You need to read a binary file format.
- The specification explicitly mixes `Big Endian` (Network Byte Order) and `Little Endian`.
- Records have variable structures based on a type identifier.

## Workflow

```mermaid
graph TD
    A[Start] --> B[Open File 'rb']
    B --> C[Read Magic & Version]
    C --> D{EOF?}
    D -->|No| E[Read Record Type (1B)]
    E --> F[Read Common ID (4B, >I)]
    F --> G{Type == 0x01?}
    G -->|Yes| H[Read Terrain Data (10B)]
    H --> H1[Unpack >HHB (X, Y, Type)]
    H1 --> D
    G -->|No| I{Type == 0x02?}
    I -->|Yes| J[Read Length (2B, <H)]
    J --> K[Read String (Length bytes)]
    K --> D
    D -->|Yes| L[End]
```

## Implementation Guide

### 1. `struct` Module format strings

| Code | Type | Size | Endianness |
| :--- | :--- | :--- | :--- |
| `>I` | Unsigned Int | 4 bytes | Big Endian |
| `<H` | Unsigned Short | 2 bytes | Little Endian |
| `>H` | Unsigned Short | 2 bytes | Big Endian |
| `B` | Unsigned Char | 1 byte | N/A |

### 2. Reading Loop Pattern

```python
with open(filepath, 'rb') as f:
    # Header
    ...
    while True:
        # Check EOF by trying to read 1 byte
        byte = f.read(1)
        if not byte: break
        
        # Dispatch based on type
        ...
```

## Common Pitfalls

1.  **Endianness Mismatch**: Using `>` when `<` is required (or default `@`). This leads to massive integer values.
2.  **Off-by-one Reading**: Forgetting that `read()` advances the pointer.
3.  **Padding**: If the spec says "5 bytes padding", ensure you `read(5)` to skip them, or read a chunk and slice.
4.  **String Decoding**: Binary strings need `.decode('utf-8')` (or 'ascii', 'latin-1') to be usable.

## Examples

See `assets/examples/parse_save.py.example` for a complete working script.
