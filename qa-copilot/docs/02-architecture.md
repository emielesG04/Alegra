# AI QA COPILOT - ARCHITECTURE DOCUMENTATION

**Version**: 1.0.0  
**Date**: 2026-09-10  
**Status**: Phase 1 Complete - Ready for Implementation

---

## PROJECT STRUCTURE

```
qa-copilot/
├── src/
│   ├── agents/                    # AI Agent implementations
│   │   ├── RequirementsAnalyzer.js
│   │   ├── TestDesigner.js
│   │   ├── CoverageAnalyzer.js
│   │   └── QAReviewer.js
│   ├── providers/                 # LLM Provider abstraction
│   │   ├── LLMProvider.js        # ✅ CREATED
│   │   ├── OpenAIProvider.js     # ✅ CREATED
│   │   └── MockProvider.js       # ✅ CREATED
│   ├── validators/                # JSON schema validation
│   │   └── schemaValidator.js    # ✅ CREATED
│   ├── exporters/                 # Output formatters
│   │   ├── JSONExporter.js
│   │   ├── CSVExporter.js
│   │   └── MarkdownExporter.js
│   ├── utils/                     # Utilities
│   │   └── logger.js             # ✅ CREATED
│   ├── orchestrator.js            # Main workflow coordinator
│   └── index.js                   # CLI entry point
├── prompts/                       # Versioned agent prompts
│   ├── requirements-analyzer.md  # ✅ CREATED
│   ├── test-designer.md          # ✅ CREATED
│   ├── coverage-analyzer.md      # ✅ CREATED
│   └── qa-reviewer.md            # ✅ CREATED
├── schemas/                       # JSON schemas for validation
│   ├── requirements-analysis-schema.json  # ✅ CREATED
│   ├── test-case-schema.json              # ✅ CREATED
│   └── test-cases-array-schema.json       # ✅ CREATED
├── evaluation/                    # Evaluation dataset
│   ├── cases/                     # Test user stories
│   │   ├── case-001-complete.txt # ✅ CREATED
│   │   ├── case-002-ambiguous.txt
│   │   └── case-003-bva.txt
│   └── expected/                  # Expected outputs
├── tests/                         # Unit and evaluation tests
│   ├── run-tests.js
│   └── evaluate-ai.js
├── output/                        # Generated artifacts
│   └── .gitkeep                  # ✅ CREATED
├── docs/                          # Documentation
│   ├── 01-analysis.md            # ✅ CREATED
│   ├── 02-architecture.md        # ✅ THIS FILE
│   ├── ai-governance.md
│   ├── prompt-strategy.md
│   └── ai-challenge-evidence.md
├── package.json                   # ✅ CREATED
├── .env.example                   # ✅ CREATED
├── .gitignore                     # ✅ CREATED
└── README.md
```

---

## ARCHITECTURE DIAGRAM

```
┌─────────────────────────────────────────────┐
│          CLI Interface (index.js)           │
│  Commands:                                  │
│  - npm run demo         (AI mode)           │
│  - npm run demo:mock    (Mock mode)         │
│  - npm run evaluate     (Run evaluations)   │
└───────────────────┬─────────────────────────┘
                    │
┌───────────────────▼─────────────────────────┐
│      Orchestrator (orchestrator.js)         │
│  Responsibilities:                          │
│  - Load user story                          │
│  - Coordinate agent execution               │
│  - Handle errors and retries                │
│  - Log execution                            │
│  - Generate outputs                         │
└───────────────────┬─────────────────────────┘
                    │
         ┌──────────┴──────────┐
         │                     │
┌────────▼────────┐   ┌────────▼────────┐
│  Schema         │   │  Logger         │
│  Validator      │   │  (utils)        │
│  ✅ CREATED     │   │  ✅ CREATED     │
└─────────────────┘   └─────────────────┘
                    │
    ┌───────────────┼───────────────┬───────────────┐
    │               │               │               │
┌───▼────┐    ┌────▼─────┐   ┌────▼──────┐  ┌─────▼─────┐
│Agent 1 │    │ Agent 2  │   │ Agent 3   │  │ Agent 4   │
│Req.    │    │ Test     │   │ Coverage  │  │ QA        │
│Analyzer│    │ Designer │   │ Analyzer  │  │ Reviewer  │
└───┬────┘    └────┬─────┘   └────┬──────┘  └─────┬─────┘
    │              │              │              │
    └──────────────┴──────────────┴──────────────┘
                    │
        ┌───────────▼───────────┐
        │   LLM Provider        │
        │   Abstraction         │
        │   ✅ CREATED          │
        └───────────┬───────────┘
                    │
     ┌──────────────┼──────────────┐
     │              │              │
┌────▼─────┐  ┌────▼──────┐  ┌────▼─────┐
│ OpenAI   │  │  Mock     │  │Anthropic │
│ Provider │  │  Provider │  │(future)  │
│✅CREATED │  │✅CREATED  │  │          │
└──────────┘  └───────────┘  └──────────┘
                    │
        ┌───────────▼───────────┐
        │   Exporters           │
        │   - JSON              │
        │   - CSV               │
        │   - Markdown          │
        └───────────┬───────────┘
                    │
        ┌───────────▼───────────┐
        │   output/             │
        │   - analysis.json     │
        │   - test-cases.json   │
        │   - traceability.json │
        │   - coverage.json     │
        │   - test-cases.csv    │
        └───────────────────────┘
```

---

## COMPONENT DESCRIPTIONS

### 1. Orchestrator
**File**: `src/orchestrator.js`  
**Status**: ⚠️ TO BE CREATED

**Responsibilities**:
- Load and parse user story input
- Execute agents in sequence
- Pass outputs between agents
- Handle validation errors
- Retry logic for API failures
- Generate final artifacts

**Workflow**:
```javascript
1. Load user story
2. Execute Agent 1 (Requirements Analyzer)
3. Validate output with schema
4. Execute Agent 2 (Test Designer)
5. Validate output with schema
6. Execute Agent 3 (Coverage Analyzer)
7. Validate output with schema
8. Execute Agent 4 (QA Reviewer)
9. Export all artifacts (JSON, CSV, Markdown)
10. Return execution summary
```

### 2. Agents
**Directory**: `src/agents/`  
**Status**: ⚠️ TO BE CREATED

Each agent:
- Loads its prompt from `prompts/` directory
- Calls LLM Provider with system + user prompts
- Returns structured JSON output
- Handles temperature configuration

### 3. LLM Provider Abstraction
**Directory**: `src/providers/`  
**Status**: ✅ CREATED

**Interface**: `LLMProvider.js` defines contract  
**Implementations**:
- `OpenAIProvider.js`: GPT-4 Turbo implementation
- `MockProvider.js`: Pre-recorded responses (no API cost)
- Future: `AnthropicProvider.js` (Claude)

### 4. Schema Validator
**File**: `src/validators/schemaValidator.js`  
**Status**: ✅ CREATED

**Features**:
- Validates requirements analysis JSON
- Validates test cases array JSON
- Attempts JSON repair for common issues
- Provides human-readable error messages

### 5. Logger
**File**: `src/utils/logger.js`  
**Status**: ✅ CREATED

**Features**:
- Execution ID tracking
- Timestamp logging
- Agent-specific logging
- Token usage tracking
- Secret sanitization
- Execution summary

### 6. Exporters
**Directory**: `src/exporters/`  
**Status**: ⚠️ TO BE CREATED

**Components**:
- `JSONExporter.js`: Pretty-printed JSON
- `CSVExporter.js`: Test cases to CSV
- `MarkdownExporter.js`: Human-readable report

---

## DATA FLOW

```
┌─────────────────────────┐
│  User Story (input.txt) │
└────────────┬────────────┘
             │
┌────────────▼────────────┐
│  Agent 1:               │
│  Requirements Analyzer  │
│  ├─ businessRules       │
│  ├─ actors              │
│  ├─ preconditions       │
│  ├─ postconditions      │
│  ├─ gaps                │
│  ├─ ambiguities         │
│  └─ risks               │
└────────────┬────────────┘
             │
┌────────────▼────────────┐
│  Agent 2:               │
│  Test Designer          │
│  └─ testCases[]         │
│     ├─ id               │
│     ├─ title            │
│     ├─ requirement      │
│     ├─ technique        │
│     ├─ expectedResult   │
│     └─ ...              │
└────────────┬────────────┘
             │
┌────────────▼────────────┐
│  Agent 3:               │
│  Coverage Analyzer      │
│  ├─ traceability        │
│  ├─ uncovered           │
│  ├─ coverageByCategory  │
│  └─ coverageGaps        │
└────────────┬────────────┘
             │
┌────────────▼────────────┐
│  Agent 4:               │
│  QA Reviewer            │
│  ├─ overallVerdict      │
│  ├─ validations         │
│  ├─ summary             │
│  └─ recommendations     │
└────────────┬────────────┘
             │
     ┌───────┴───────┐
     │               │
┌────▼──┐   ┌───────▼────┐
│  JSON │   │  CSV       │
│  Files│   │  Files     │
└───────┘   └────────────┘
```

---

## CONFIGURATION

### Environment Variables (.env)

```bash
# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4-turbo

# Anthropic (optional)
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022

# Configuration
LOG_LEVEL=info
TEMPERATURE_ANALYSIS=0.3
TEMPERATURE_GENERATION=0.5
MAX_TOKENS=4096
ENABLE_TOKEN_LOGGING=true
```

### CLI Usage

```bash
# AI Mode (uses OpenAI API)
npm run demo

# Mock Mode (no API, uses pre-recorded responses)
npm run demo:mock

# Specific input file
npm run demo -- --input=evaluation/cases/case-001-complete.txt

# Run evaluation suite
npm run evaluate
```

---

## PROMPT STRATEGY

### Version Control
- All prompts stored in `prompts/` directory
- Markdown format for readability
- Version number in header
- Can be updated without code changes

### Structure
Each prompt contains:
1. **ROLE**: Who the AI should act as
2. **CONTEXT**: Background information
3. **TASK**: What to do
4. **RULES**: Critical constraints (NO HALLUCINATION)
5. **OUTPUT SCHEMA**: Expected JSON structure
6. **QUALITY CRITERIA**: How output will be evaluated
7. **EXAMPLES**: Input/output examples

### Temperature Settings
- **Requirements Analysis**: 0.3 (deterministic)
- **Test Generation**: 0.5 (creative but controlled)
- **Coverage Analysis**: 0.3 (deterministic)
- **QA Review**: 0.2 (very deterministic)

---

## ERROR HANDLING

### Retry Strategy
```javascript
1. API call fails (timeout, rate limit)
2. Wait with exponential backoff (1s, 2s, 4s)
3. Retry up to 3 times
4. If all retries fail, switch to mock mode or abort
```

### Validation Failures
```javascript
1. LLM returns invalid JSON
2. Attempt JSON repair (remove markdown, extract JSON)
3. If repair succeeds, validate with schema
4. If validation fails, log error and retry with clearer instructions
5. Max 2 retries per agent
6. If still fails, abort with clear error message
```

### Hallucination Detection
```javascript
1. QA Reviewer agent checks for hallucinations
2. If FAIL verdict, log detailed issues
3. Option to regenerate or continue with warning
4. Human review always required for production use
```

---

## NEXT STEPS (PHASE 2 - IMPLEMENTATION)

### High Priority
1. ✅ Create Agent 1: Requirements Analyzer
2. ✅ Create Agent 2: Test Designer
3. ✅ Create Agent 3: Coverage Analyzer
4. ✅ Create Agent 4: QA Reviewer
5. ✅ Create Orchestrator
6. ✅ Create Exporters (JSON, CSV, Markdown)
7. ✅ Create CLI entry point (index.js)
8. ✅ Test with case-001-complete.txt
9. ✅ Verify mock mode works
10. ✅ Verify AI mode works

### Medium Priority
11. Create case-002-ambiguous.txt
12. Create case-003-bva.txt
13. Create evaluation tests
14. Create README.md
15. Create ai-governance.md
16. Create ai-challenge-evidence.md

### Low Priority
17. Add Anthropic provider
18. Create demo video
19. Performance optimization
20. Enhanced error messages

---

## TECHNICAL DECISIONS LOG

### DECISION-001: Local Script Architecture
**Chosen**: Local Node.js CLI script  
**Rejected**: AWS Lambda + API Gateway  
**Reason**: Faster MVP, lower cost, meets demo requirements  
**Status**: ✅ Implemented

### DECISION-002: 4 Agents
**Chosen**: Requirements Analyzer, Test Designer, Coverage Analyzer, QA Reviewer  
**Rejected**: 2 agents (insufficient), 5 agents (Automation Advisor deferred)  
**Reason**: Balance functionality with timeline  
**Status**: ✅ Approved

### DECISION-003: LLM Provider Abstraction
**Chosen**: Abstract interface with OpenAI and Mock implementations  
**Rejected**: Direct coupling to OpenAI SDK  
**Reason**: Master prompt requirement, future flexibility  
**Status**: ✅ Implemented

### DECISION-004: Mock Mode Required
**Chosen**: MockProvider with pre-recorded responses  
**Rejected**: Always require API calls  
**Reason**: Demo without cost, testing, reliability  
**Status**: ✅ Implemented

### DECISION-005: Schema Validation
**Chosen**: AJV-based validation with repair attempts  
**Rejected**: No validation (risky), manual validation  
**Reason**: Prevent crashes, improve reliability  
**Status**: ✅ Implemented

---

**END OF ARCHITECTURE DOCUMENTATION**

**Next**: Proceed to Phase 2 (Core Implementation)
