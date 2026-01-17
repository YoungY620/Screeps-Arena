import sys
import os
import re
from pathlib import Path

class ValidationResult:
    def __init__(self):
        self.errors = []
        self.warnings = []

    def error(self, msg):
        self.errors.append(f"❌ [ERROR] {msg}")

    def warning(self, msg):
        self.warnings.append(f"⚠️ [WARN] {msg}")

    def is_valid(self):
        return len(self.errors) == 0

    def report(self):
        if self.errors:
            print("\n".join(self.errors))
        if self.warnings:
            print("\n".join(self.warnings))
        
        if self.is_valid():
            print("\n✅ Skill validation passed (AgentSkills.io Spec)!")
            return True
        else:
            print(f"\n🚫 Validation failed with {len(self.errors)} errors.")
            return False

def check_structure(skill_dir: Path, result: ValidationResult):
    if not skill_dir.exists():
        result.error(f"Skill directory does not exist: {skill_dir}")
        return

    # 1. Check SKILL.md
    if not (skill_dir / "SKILL.md").exists():
        result.error("Missing SKILL.md file.")

    # 2. Check assets/examples (Standard: assets/ for static resources)
    assets_dir = skill_dir / "assets"
    examples_dir = assets_dir / "examples"
    
    if not assets_dir.exists():
        result.warning("Missing 'assets/' directory.")
    elif not examples_dir.exists():
        result.warning("Missing 'assets/examples/' directory. (Recommended for code patterns)")
    else:
        # Check code isolation in assets/examples
        for f in examples_dir.iterdir():
            if f.is_file() and f.name != ".DS_Store" and f.name != "README.md":
                if not f.name.endswith(".example"):
                    result.error(f"File in assets/examples/ MUST end with .example: {f.name}")

    # 3. Check scripts/ (Standard: scripts/ for executable code)
    # Previously 'helpers', now 'scripts' per spec
    scripts_dir = skill_dir / "scripts"
    if (skill_dir / "helpers").exists():
        result.error("Directory 'helpers/' is deprecated. Rename to 'scripts/'.")
    
    # 4. Check references/
    ref_dir = skill_dir / "references"
    # Optional

def check_skill_md_content(skill_dir: Path, result: ValidationResult):
    skill_md = skill_dir / "SKILL.md"
    if not skill_md.exists():
        return

    try:
        content = skill_md.read_text(encoding="utf-8")
    except Exception as e:
        result.error(f"Failed to read SKILL.md: {e}")
        return

    # 1. Frontmatter Check
    if not content.startswith("---"):
        result.error("SKILL.md must start with YAML frontmatter (---).")
        return

    # Name validation per spec: 1-64 chars, lowercase alnum & hyphen, no start/end hyphen
    name_match = re.search(r"^name:\s+(.+)$", content, re.MULTILINE)
    if not name_match:
        result.error("Frontmatter missing 'name' field.")
    else:
        name = name_match.group(1).strip()
        if not re.match(r"^[a-z0-9]([-a-z0-9]*[a-z0-9])?$", name):
            result.error(f"Invalid name format '{name}'. Must be lowercase a-z, 0-9, hyphens only.")
        if len(name) > 64:
            result.error("Name too long (max 64 chars).")
        if name != skill_dir.name:
            result.error(f"Name '{name}' must match directory name '{skill_dir.name}'.")

    if not re.search(r"^description:\s+.+$", content, re.MULTILINE):
        result.error("Frontmatter missing 'description' field.")

    # 2. Mermaid Check
    if "```mermaid" not in content and "graph TD" not in content and "graph LR" not in content:
        result.error("SKILL.md must include a Mermaid flowchart for decision logic.")

    # 3. Pitfalls Check
    if "## Common Pitfalls" not in content:
        result.error("SKILL.md must include '## Common Pitfalls' section.")

    # 4. Link Check
    if (skill_dir / "references").exists() and "./references/" not in content:
        result.warning("The 'references/' directory exists but is not linked in SKILL.md.")

def validate_skill(path_str):
    path = Path(path_str)
    result = ValidationResult()
    
    print(f"🔍 Validating Skill at: {path}")
    
    check_structure(path, result)
    check_skill_md_content(path, result)
    
    return result.report()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: validate_skill.py <path_to_skill_directory>")
        sys.exit(1)
        
    success = validate_skill(sys.argv[1])
    sys.exit(0 if success else 1)
