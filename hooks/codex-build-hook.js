#!/usr/bin/env node

/**
 * Codex Build Hook for Claude Code
 * Triggers when user explicitly requests large task execution using Codex Protocol
 * Enforces 6-phase structured approach for complex projects
 */

const fs = require('fs');
const path = require('path');

class CodexBuildHook {
  constructor() {
    this.logFile = path.join(__dirname, '../logs/codex-build.log');
    // Create logs directory if it doesn't exist
    const logsDir = path.dirname(this.logFile);
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}\n`;
    fs.appendFileSync(this.logFile, logEntry);
    console.error(logEntry.trim());
  }

  detectCodexRequest(userMessage) {
    // Detect when user explicitly requests large task execution
    const codexTriggers = [
      /run.*codex.*protocol/i,
      /use.*codex.*protocol/i,
      /start.*codex.*protocol/i,
      /codex.*build/i,
      /large.*task/i,
      /comprehensive.*implementation/i,
      /full.*system.*build/i,
      /enterprise.*implementation/i
    ];

    const isCodexRequest = codexTriggers.some(pattern => 
      pattern.test(userMessage)
    );

    if (isCodexRequest) {
      this.log(`🏗️  CODEX PROTOCOL REQUEST DETECTED: "${userMessage.substring(0, 100)}..."`);
      
      return {
        codexRequired: true,
        message: `🏗️  CODEX PROTOCOL ACTIVATION REQUIRED:

User has requested a large-scope implementation that requires the Codex Protocol.

MANDATORY CODEX PROTOCOL STEPS:

📖 STEP 1: Load Target User Context
□ Read target_buyer.md file completely
□ Confirm understanding of Series A founder profile ($2M→$10M ARR scaling)
□ Understand systematic approach preferences and technical credibility requirements

🔍 STEP 2: Comprehensive Compatibility Analysis  
□ TARGET USER VALUE VALIDATION
□ H&S PLATFORM INTEGRATION verification
□ TECHNICAL FEASIBILITY assessment
□ Deliver GREEN/YELLOW/RED compatibility verdict

📋 STEP 3: Business-First Project Planning
□ Business problem identification (one sentence)
□ User success metrics definition
□ 4-Phase breakdown: CORE → ESSENTIAL → NICE-TO-HAVE → POLISH
□ AI over-engineering prevention constraints

🎯 STEP 4: Phase Execution with AI Constraints
□ Pre-build value validation for each feature
□ Phase-specific AI management rules
□ Build only what's specified for current phase

🚪 STEP 5: Phase Transition Gates
□ Value delivery confirmation
□ Founder impact assessment
□ Integration integrity validation
□ AI constraint compliance check

✅ STEP 6: Final Integration Validation
□ Complete business value confirmation
□ Platform integration verification
□ Production readiness assessment

ACTIVATION: Claude must execute ALL 6 phases systematically. No shortcuts allowed.

Use: ExitPlanMode tool after presenting complete 6-phase build plan to user.`
      };
    }

    return { codexRequired: false };
  }

  checkForCodexSkipping(userMessage) {
    // Detect when Claude tries to skip Codex Protocol phases
    const skipIndicators = [
      /skip.*compatibility/i,
      /skip.*phase/i,
      /already.*know/i,
      /simple.*enough/i,
      /straightforward.*implementation/i,
      /don't.*need.*protocol/i
    ];

    const hasSkipping = skipIndicators.some(pattern => 
      pattern.test(userMessage)
    );

    if (hasSkipping) {
      this.log(`⚠️  CODEX PROTOCOL SKIPPING DETECTED`);
      return {
        violation: true,
        message: `⚠️  CODEX PROTOCOL VIOLATION:

Detected attempt to skip Codex Protocol phases. For large-scope implementations, ALL 6 phases are mandatory:

REQUIRED PHASES:
1. Target User Context Loading (read target_buyer.md)
2. Comprehensive Compatibility Analysis 
3. Business-First Project Planning
4. Phase Execution with AI Constraints
5. Phase Transition Gates
6. Final Integration Validation

NO SHORTCUTS ALLOWED. Execute complete protocol systematically.

BUSINESS JUSTIFICATION: Series A founders ($2M→$10M ARR) require systematic, professional execution. Shortcuts damage technical credibility and systematic scaling value.`
      };
    }

    return { valid: true };
  }

  validatePhaseCompletion(phaseNumber, phaseContent) {
    const phaseRequirements = {
      1: ['target_buyer.md', 'Series A founder', 'technical credibility'],
      2: ['compatibility analysis', 'GREEN/YELLOW/RED verdict', 'platform integration'],
      3: ['business problem', 'success metrics', '4-phase breakdown'],
      4: ['value validation', 'AI constraints', 'phase-specific rules'],
      5: ['transition gate', 'founder impact', 'integration verification'],
      6: ['final validation', 'production readiness', 'business value confirmation']
    };

    const requirements = phaseRequirements[phaseNumber] || [];
    const missingRequirements = requirements.filter(req => 
      !phaseContent.toLowerCase().includes(req.toLowerCase())
    );

    if (missingRequirements.length > 0) {
      this.log(`❌ PHASE ${phaseNumber} INCOMPLETE: Missing ${missingRequirements.join(', ')}`);
      return {
        complete: false,
        message: `❌ CODEX PROTOCOL PHASE ${phaseNumber} INCOMPLETE:

Missing required elements: ${missingRequirements.join(', ')}

Phase ${phaseNumber} must include ALL required components before proceeding to next phase.

CORRECTIVE ACTION: Complete missing elements before marking phase as done.`
      };
    }

    this.log(`✅ PHASE ${phaseNumber} VALIDATION PASSED`);
    return { complete: true };
  }
}

// Main execution
function main() {
  const hook = new CodexBuildHook();
  const userMessage = process.argv.slice(2).join(' ') || process.env.USER_MESSAGE || '';
  
  // Check if user is requesting Codex Protocol
  const codexCheck = hook.detectCodexRequest(userMessage);
  if (codexCheck.codexRequired) {
    console.error(codexCheck.message);
    return;
  }

  // Check for protocol skipping attempts
  const skipCheck = hook.checkForCodexSkipping(userMessage);
  if (skipCheck.violation) {
    console.error(skipCheck.message);
    return;
  }

  hook.log(`Codex build hook executed for message: "${userMessage.substring(0, 100)}..."`);
}

if (require.main === module) {
  main();
}

module.exports = { CodexBuildHook };