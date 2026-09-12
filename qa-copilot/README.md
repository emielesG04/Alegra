# 🤖 AI QA COPILOT

**AI-Powered Quality Engineering Assistant for ACME Corp**

Automated test case generation using ISTQB techniques, powered by GPT-4.

---

## 🎯 WHAT IT DOES

Takes a **User Story** as input and generates:

1. ✅ **Requirements Analysis** - Business rules, gaps, ambiguities, risks
2. ✅ **Test Cases** - ISTQB techniques (BVA, Negative Testing, Happy Path, etc.)
3. ✅ **Traceability Matrix** - Requirements → Test Cases mapping
4. ✅ **Coverage Analysis** - Metrics by category, gap detection
5. ✅ **QA Review** - Validates outputs, detects hallucinations
6. ✅ **Exports** - JSON, CSV, Markdown

---

## 🚀 QUICK START

### 1. Install Dependencies

```bash
cd qa-copilot
npm install
```

### 2. Configure API Key (for AI mode)

```bash
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
```

### 3. Run Demo

```bash
# Mock Mode (NO API COST - uses pre-recorded responses)
npm run demo:mock

# AI Mode (uses OpenAI API)
npm run demo
```

### 4. Check Results

```bash
ls -la output/
# You'll see:
# - analysis.json
# - test-cases.json
# - coverage.json
# - qa-review.json
# - traceability.json
# - test-cases.csv
# - qa-copilot-report.md
```

---

## 📖 USAGE

### Run with Custom User Story

```bash
npm run demo -- --input=path/to/your-story.txt
```

### Run in Mock Mode (No API Cost)

```bash
npm run demo:mock
```

---

## 🏗️ ARCHITECTURE

```
User Story
    ↓
Agent 1: Requirements Analyzer
    ↓
Agent 2: Test Designer (ISTQB)
    ↓
Agent 3: Coverage Analyzer
    ↓
Agent 4: QA Reviewer
    ↓
Exports (JSON, CSV, Markdown)
```

### 4 AI Agents

1. **Requirements Analyzer**: Extracts business rules, identifies gaps/ambiguities/risks
2. **Test Designer**: Generates test cases using ISTQB techniques
3. **Coverage Analyzer**: Builds traceability, calculates coverage metrics
4. **QA Reviewer**: Validates outputs, detects hallucinations

### LLM Provider Abstraction

- **OpenAIProvider**: GPT-4 Turbo
- **MockProvider**: Pre-recorded responses (for demos/testing)
- Extensible to Anthropic Claude

---

## 📂 PROJECT STRUCTURE

```
qa-copilot/
├── src/
│   ├── agents/           # 4 AI agents
│   ├── providers/        # LLM abstraction
│   ├── validators/       # JSON schema validation
│   ├── exporters/        # JSON, CSV, Markdown
│   ├── utils/            # Logger
│   ├── orchestrator.js   # Workflow coordinator
│   └── index.js          # CLI entry point
├── prompts/              # Versioned agent prompts
├── schemas/              # JSON validation schemas
├── evaluation/cases/     # Test user stories
├── output/               # Generated artifacts
└── docs/                 # Documentation
```

---

## 🎨 ISTQB TECHNIQUES APPLIED

- ✅ Happy Path Testing
- ✅ Negative Testing
- ✅ Boundary Value Analysis (BVA)
- ✅ Equivalence Partitioning
- ✅ Decision Tables
- ✅ State Transition Testing
- ✅ Error Guessing (Risk-based)

---

## 🛡️ AI GOVERNANCE

### No Hallucination Policy

All agents are prompted to:
- **NEVER invent** behaviors not in requirements
- **Mark gaps** explicitly when information is missing
- **Use verifiable** expected results (no "works correctly")

### QA Reviewer Agent

Validates:
- No hallucinations
- Expected results are specific and verifiable
- Consistency across outputs
- Complete traceability
- Proper ISTQB technique application

Verdict: **PASS / WARN / FAIL**

### Human-in-the-Loop

AI generates → AI validates → **Human reviews** → Human approves

---

## 📊 EXAMPLE OUTPUT

### Input (User Story)

```
Como usuario de la plataforma de mensajería
Quiero enviar mensajes de texto a otros usuarios
Para comunicarme en tiempo real

Criterios de Aceptación:
- El mensaje debe tener máximo 4096 caracteres
- El usuario debe estar autenticado
- El mensaje debe encriptarse en tránsito
```

### Output

- **10-15 test cases** with ISTQB techniques
- **Traceability matrix** (requirements → tests)
- **Coverage analysis** by category (Happy Path: 100%, Negative: 80%, BVA: 100%)
- **QA Review verdict** (PASS/WARN/FAIL)
- **Gaps detected** ("What happens if message >4096 chars?")

---

## 🔒 SECURITY

- ✅ API keys in `.env` (never committed)
- ✅ Secrets sanitized in logs
- ✅ No sensitive data in outputs

---

## 💰 COST CONTROL

- ✅ Mock mode available (zero cost)
- ✅ Temperature optimized (0.2-0.5)
- ✅ Token usage logged
- ✅ Estimated cost: <$2 per execution

---

## 📚 DOCUMENTATION

- `docs/01-analysis.md` - Requirements analysis (30+ pages)
- `docs/02-architecture.md` - Architecture design
- `prompts/` - Agent prompts with examples

---

## 🧪 FOR EVALUATORS

### What Makes This Different?

1. **4-Agent Architecture**: Specialized agents with clear responsibilities
2. **Anti-Hallucination**: Explicit gap detection instead of inventing behavior
3. **QA Reviewer**: AI validates AI (meta-validation)
4. **ISTQB Techniques**: Applied appropriately, not artificially
5. **Verifiable Results**: "System shows error X" not "works correctly"
6. **LLM Abstraction**: Not coupled to OpenAI
7. **Mock Mode**: Demostrable without API cost

### Why AI for QA?

**Problem**: 2 QA engineers, 60 developers, 9 teams = bottleneck

**Solution**: AI multiplies QA capacity by:
- Automating repetitive test design (75% time savings)
- Identifying gaps humans might miss
- Applying ISTQB techniques consistently
- Generating traceability automatically

**Impact**: 2 QA engineers can now support 9 teams effectively

---

## 🚧 KNOWN LIMITATIONS

1. **Not Production-Ready**: This is an MVP/prototype
2. **Requires Human Review**: AI outputs must be validated
3. **Limited to Text Analysis**: No code analysis (yet)
4. **English/Spanish Only**: Prompts are bilingual
5. **No Integration**: Doesn't connect to Jira/TestRail (yet)

---

## 🔮 FUTURE EVOLUTION

### Phase 2 (Production)
- Jira/TestRail integration
- Automated test code generation (Playwright)
- Multi-language support
- Team collaboration features
- API for CI/CD integration

### Phase 3 (Scale)
- Learning from past test executions
- Defect prediction
- Auto-healing tests
- Performance test generation

---

## 📞 TECHNICAL CHALLENGE EVIDENCE

This project demonstrates:

✅ **Real AI application** (not just calling ChatGPT)  
✅ **Architectural thinking** (4 agents, abstraction layers)  
✅ **Quality focus** (validation, review, anti-hallucination)  
✅ **ISTQB knowledge** (proper technique application)  
✅ **Deliverable** (working, demonstrable prototype)

**Demo ready**: `npm run demo:mock` works without API key

---

## 👤 AUTHOR

**Elvis Mieles** - QA Lead  
Technical Challenge for ACME Corp  
Date: 2026-09-10

---

## 📄 LICENSE

MIT
