# BMB Workflows

## Available Workflows in bmb

**convert-legacy**
- Path: `bmad/bmb/workflows/convert-legacy/workflow.yaml`
- Converts legacy BMAD v4 or similar items (agents, workflows, modules) to BMad Core compliant format with proper structure and conventions

**create-agent**
- Path: `bmad/bmb/workflows/create-agent/workflow.yaml`
- Interactive workflow to build BMAD Core compliant agents (YAML source compiled to .md during install) with optional brainstorming, persona development, and command structure

**create-module**
- Path: `bmad/bmb/workflows/create-module/workflow.yaml`
- Interactive workflow to build complete BMAD modules with agents, workflows, tasks, and installation infrastructure

**create-workflow**
- Path: `bmad/bmb/workflows/create-workflow/workflow.yaml`
- Interactive workflow builder that guides creation of new BMAD workflows with proper structure and validation for optimal human-AI collaboration. Includes optional brainstorming phase for workflow ideas and design.

**edit-workflow**
- Path: `bmad/bmb/workflows/edit-workflow/workflow.yaml`
- Edit existing BMAD workflows while following all best practices and conventions

**module-brief**
- Path: `bmad/bmb/workflows/module-brief/workflow.yaml`
- Create a comprehensive Module Brief that serves as the blueprint for building new BMAD modules using strategic analysis and creative vision

**redoc**
- Path: `bmad/bmb/workflows/redoc/workflow.yaml`
- Autonomous documentation system that maintains module, workflow, and agent documentation using a reverse-tree approach (leaf folders first, then parents). Understands BMAD conventions and produces technical writer quality output.


## Execution

When running any workflow:
1. LOAD {project-root}/bmad/core/tasks/workflow.xml
2. Pass the workflow path as 'workflow-config' parameter
3. Follow workflow.xml instructions EXACTLY
4. Save outputs after EACH section

## Modes
- Normal: Full interaction
- #yolo: Skip optional steps
