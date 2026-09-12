/**
 * Mock Provider Implementation
 * 
 * Implements LLMProvider interface with pre-recorded responses
 * Used for testing and demos without API costs
 */

import { LLMProvider } from './LLMProvider.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class MockProvider extends LLMProvider {
  constructor() {
    super();
    this.mockData = this.loadMockData();
  }

  loadMockData() {
    // Mock data will be loaded from evaluation/expected directory
    // For now, return inline mock data
    return {
      requirementsAnalysis: {
        businessRules: [
          "Mensaje máximo 4096 caracteres",
          "Usuario debe estar autenticado",
          "Encriptación en tránsito obligatoria",
          "Confirmación de entrega debe ser visible",
          "Reintentos: máximo 3 en caso de fallo"
        ],
        actors: [
          "Usuario emisor",
          "Usuario receptor",
          "Sistema de mensajería"
        ],
        preconditions: [
          "Usuario emisor autenticado",
          "Usuario receptor existe en el sistema",
          "Chat abierto o disponible"
        ],
        postconditions: [
          "Mensaje entregado a usuario receptor",
          "Confirmación de entrega visible para usuario emisor",
          "Mensaje almacenado en historial de chat"
        ],
        gaps: [
          "GAP: No se especifica timeout entre reintentos",
          "GAP: No se define comportamiento si los 3 reintentos fallan",
          "GAP: No se especifica comportamiento cuando usuario está offline"
        ],
        ambiguities: [
          "AMBIGUITY: ¿Qué sucede si mensaje >4096 caracteres? ¿Se trunca? ¿Se rechaza? ¿Se muestra error?"
        ],
        risks: [
          "RISK: Encriptación crítica para compliance (GDPR, HIPAA)",
          "RISK: Performance con mensajes grandes (cerca de 4096 chars)",
          "RISK: Manejo de reintentos podría generar mensajes duplicados"
        ]
      }
    };
  }

  async generateJSON({ systemPrompt, userPrompt, temperature = 0.3, maxTokens = 4096 }) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Determine which agent is calling based on system prompt
    let mockResponse;
    
    if (systemPrompt.includes('Requirements Analyzer') || systemPrompt.includes('Senior QA Engineer certificado ISTQB especializado en análisis de requisitos')) {
      mockResponse = this.mockData.requirementsAnalysis;
    } else if (systemPrompt.includes('Test Designer') || systemPrompt.includes('diseño de casos de prueba')) {
      mockResponse = this.getMockTestCases();
    } else if (systemPrompt.includes('Coverage') || systemPrompt.includes('Coverage Analyzer')) {
      mockResponse = this.getMockCoverage();
    } else if (systemPrompt.includes('QA Reviewer') || systemPrompt.includes('AI Quality Auditor')) {
      mockResponse = this.getMockReview();
    } else {
      mockResponse = { testCases: [] };
    }

    return {
      data: mockResponse,
      usage: {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0
      },
      model: 'mock-model',
      provider: 'mock'
    };
  }

  getMockTestCases() {
    return {
      testCases: [
        {
          id: "TC-MSG-001",
          title: "Enviar mensaje de texto exitosamente (happy path)",
          requirement: "REQ-MSG-001",
          type: "Funcional",
          technique: "Happy Path",
          priority: "Alta",
          risk: "Alto",
          preconditions: "Usuario autenticado, chat abierto con otro usuario",
          testData: "Mensaje: 'Hola, ¿cómo estás?'",
          steps: [
            "1. Escribir mensaje 'Hola, ¿cómo estás?' en campo de texto",
            "2. Presionar botón 'Enviar'",
            "3. Verificar mensaje aparece en chat",
            "4. Verificar confirmación de entrega visible"
          ],
          expectedResult: "Mensaje visible en chat del emisor y receptor con estado 'entregado', timestamp correcto, encriptado en tránsito (verificar HTTPS en network inspector)",
          evidenceRequired: true,
          automatable: true
        },
        {
          id: "TC-MSG-002",
          title: "Usuario no autenticado intenta enviar mensaje",
          requirement: "REQ-MSG-001",
          type: "Funcional",
          technique: "Negative Testing",
          priority: "Alta",
          risk: "Alto",
          preconditions: "Usuario NO autenticado",
          testData: "Mensaje: 'Hola'",
          steps: [
            "1. Abrir página de chat sin login",
            "2. Intentar escribir mensaje",
            "3. Verificar comportamiento del sistema"
          ],
          expectedResult: "Sistema redirige a página de login o muestra modal de autenticación con mensaje 'Debe iniciar sesión para enviar mensajes'",
          evidenceRequired: true,
          automatable: true
        },
        {
          id: "TC-MSG-003",
          title: "Mensaje en límite exacto - 4096 caracteres",
          requirement: "REQ-MSG-002",
          type: "Funcional",
          technique: "Boundary Value Analysis",
          priority: "Alta",
          risk: "Alto",
          preconditions: "Usuario autenticado, chat abierto",
          testData: "Mensaje: [string de exactamente 4096 caracteres]",
          steps: [
            "1. Escribir o pegar mensaje de exactamente 4096 caracteres",
            "2. Verificar contador de caracteres muestra '4096/4096'",
            "3. Presionar botón enviar",
            "4. Verificar mensaje enviado exitosamente"
          ],
          expectedResult: "Mensaje enviado exitosamente, visible en chat con todos los 4096 caracteres intactos, confirmación de entrega visible",
          evidenceRequired: true,
          automatable: true
        }
      ]
    };
  }

  getMockCoverage() {
    return {
      traceability: {
        "REQ-MSG-001": ["TC-MSG-001", "TC-MSG-002"],
        "REQ-MSG-002": ["TC-MSG-003"]
      },
      uncoveredRequirements: [],
      orphanTestCases: [],
      coverageByCategory: {
        happyPath: {
          percentage: 100,
          status: "✅",
          details: "Todas las funcionalidades principales tienen happy path"
        },
        negative: {
          percentage: 80,
          status: "⚠️",
          details: "4/5 reglas de negocio tienen negative tests"
        },
        boundary: {
          percentage: 100,
          status: "✅",
          details: "Todos los límites numéricos tienen BVA"
        },
        security: {
          percentage: 100,
          status: "✅",
          details: "Riesgos de seguridad cubiertos"
        },
        performance: {
          percentage: "NOT_AVAILABLE",
          status: "🔴",
          reason: "No se especificaron requisitos de performance"
        }
      },
      coverageGaps: [
        "Falta test de comportamiento offline (gap en requisitos)"
      ],
      potentialDuplicates: [],
      overallCoverageScore: {
        percentage: 85,
        status: "✅ GOOD",
        summary: "Cobertura sólida con gaps menores identificados"
      }
    };
  }

  getMockReview() {
    return {
      overallVerdict: "PASS",
      validations: {
        hallucinationCheck: { status: "PASS", issues: [] },
        expectedResultsQuality: { status: "PASS", issues: [] },
        consistencyCheck: { status: "PASS", issues: [] },
        traceabilityValidation: { status: "PASS", issues: [] },
        techniqueApplication: { status: "PASS", issues: [] },
        duplicateDetection: { status: "PASS", duplicates: [] },
        coverageValidation: { status: "PASS", issues: [] }
      },
      summary: {
        totalTestCases: 3,
        criticalIssues: 0,
        warnings: 1,
        passedValidations: 7,
        qualityScore: "90/100"
      },
      recommendations: [
        "Agregar test case para comportamiento offline (identificado como gap)",
        "Considerar agregar test case para comportamiento cuando >4096 caracteres"
      ],
      readyForHumanReview: true
    };
  }

  getProviderName() {
    return 'Mock';
  }

  getModelName() {
    return 'mock-model-v1.0';
  }

  isConfigured() {
    return true;
  }
}
