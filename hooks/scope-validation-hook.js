#!/usr/bin/env node

/**
 * Scope Validation Hook for Claude Code
 * Triggers when todos are marked as completed to ensure thoroughness
 * Prevents incomplete work and scope shortcuts
 */

const fs = require('fs');
const path = require('path');

class ScopeValidationHook {
  constructor() {
    this.logFile = path.join(__dirname, '../logs/scope-validation.log');
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

  validateCompletionClaim(todoContent, userMessage) {
    this.log(`🔍 SCOPE VALIDATION: Checking completion of "${todoContent}"`);
    
    // High-risk completion patterns that often indicate shortcuts
    const highRiskPatterns = [
      /migrat/i,
      /comprehensive/i,
      /all.*component/i,
      /revolutionary/i,
      /complete.*system/i,
      /full.*implementation/i
    ];

    const isHighRisk = highRiskPatterns.some(pattern => 
      pattern.test(todoContent) || pattern.test(userMessage)
    );

    if (isHighRisk) {
      this.log(`⚠️  HIGH-RISK COMPLETION DETECTED: "${todoContent}"`);
      
      return {
        valid: false,
        message: `🚨 SCOPE VALIDATION FAILURE: 

"${todoContent}" appears to be a large-scope task that requires evidence of completion.

REQUIRED BEFORE MARKING COMPLETE:
□ Provide specific file counts (e.g., "Migrated 47 of 47 components")
□ List actual deliverables created (e.g., "Created services: X.ts, Y.ts, Z.ts")
□ Show measurable progress (e.g., "750+ lines of webResearchService.js migrated")
□ Confirm 100% completion vs partial completion

PREVENTION: Use more granular todos. Break "${todoContent}" into 5-10 specific, measurable subtasks.

Example:
❌ "Migrate revolutionary features"
✅ "Migrate webResearchService.js (750+ lines)"
✅ "Migrate Triple MCP Components (3 files)" 
✅ "Migrate Market-Intelligent Gamification system (8 components)"

Please provide completion evidence or break into smaller todos.`
      };
    }

    return { valid: true };
  }

  checkForScopeShortcuts(userMessage) {
    // Detect when Claude tries to take shortcuts
    const shortcutIndicators = [
      /basic.*shell/i,
      /simple.*version/i,
      /minimal.*implementation/i,
      /quick.*fix/i,
      /for now/i,
      /placeholder/i
    ];

    const hasShortcuts = shortcutIndicators.some(pattern => 
      pattern.test(userMessage)
    );

    if (hasShortcuts) {
      this.log(`⚠️  SCOPE SHORTCUT DETECTED in user message`);
      return {
        warning: true,
        message: `⚠️  SCOPE SHORTCUT WARNING:

Detected potential scope reduction language. If you explicitly requested comprehensive work, Claude should deliver comprehensive work, not shortcuts.

WATCH FOR: "basic shell", "simple version", "minimal implementation"
EXPECT: Complete execution of explicitly requested scope`
      };
    }

    return { valid: true };
  }
}

// Main execution
function main() {
  const hook = new ScopeValidationHook();
  const userMessage = process.argv.slice(2).join(' ') || process.env.USER_MESSAGE || '';
  
  // Check for scope shortcuts in Claude's responses
  const shortcutCheck = hook.checkForScopeShortcuts(userMessage);
  if (shortcutCheck.warning) {
    console.error(shortcutCheck.message);
  }

  hook.log(`Scope validation hook executed for message: "${userMessage.substring(0, 100)}..."`);
}

if (require.main === module) {
  main();
}

module.exports = { ScopeValidationHook };