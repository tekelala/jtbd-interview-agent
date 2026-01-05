#!/usr/bin/env node
/**
 * CLI for JTBD Interview Agent
 *
 * Run interviews from the command line.
 */

import * as readline from 'readline';
import { JTBDInterviewer } from './interviewer.js';
import type { InterviewConfig } from './types/interview.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function prompt(question: string): Promise<string> {
  return new Promise(resolve => {
    rl.question(question, answer => {
      resolve(answer.trim());
    });
  });
}

function printSection(title: string): void {
  console.log('\n' + '='.repeat(60));
  console.log(title);
  console.log('='.repeat(60) + '\n');
}

function printMessage(role: string, content: string): void {
  const prefix = role === 'user' ? '👤 You: ' : '🎙️ Interviewer: ';
  console.log(`\n${prefix}${content}\n`);
}

async function main(): Promise<void> {
  printSection('JTBD Interview Agent - Bob Moesta Style');
  console.log('This tool conducts Jobs to Be Done interviews to uncover:');
  console.log('- The struggling moment that triggers change');
  console.log('- Forces of progress (push, pull, anxiety, habit)');
  console.log('- Information diet (how to reach similar customers)\n');

  // Get configuration
  const productContext = await prompt('Product/service context (optional, press Enter to skip): ');
  const intervieweeName = await prompt('Interviewee name (optional, press Enter to skip): ');

  const config: InterviewConfig = {
    productContext: productContext || undefined,
    intervieweeName: intervieweeName || undefined
  };

  printSection('Starting Interview...');
  console.log('Type "quit" to end the interview and see the summary.');
  console.log('Type "data" to see current captured data.');
  console.log('Type "export" to save the interview to a file.\n');

  const interviewer = new JTBDInterviewer();

  try {
    const opening = await interviewer.startInterview(config);
    printMessage('interviewer', opening);

    // Main interview loop
    while (true) {
      const userInput = await prompt('Your response: ');

      if (userInput.toLowerCase() === 'quit') {
        break;
      }

      if (userInput.toLowerCase() === 'data') {
        const data = interviewer.getInterviewData();
        console.log('\n--- Current Interview Data ---');
        console.log(`Timeline events: ${data.timeline.length}`);
        console.log(`Forces captured: ${Object.values(data.forces).flat().length}`);
        console.log(`Insights: ${data.insights.length}`);
        console.log(`Verbatim quotes: ${data.verbatimQuotes.length}`);
        console.log('-----------------------------\n');
        continue;
      }

      if (userInput.toLowerCase() === 'export') {
        const json = interviewer.exportToJSON();
        const filename = `interview-${Date.now()}.json`;
        const fs = await import('fs');
        fs.writeFileSync(filename, json);
        console.log(`\nExported to ${filename}\n`);
        continue;
      }

      if (!userInput) {
        console.log('Please enter a response.\n');
        continue;
      }

      printMessage('user', userInput);

      const response = await interviewer.sendMessage(userInput);
      printMessage('interviewer', response);
    }

    // End interview and show summary
    printSection('Generating Interview Summary...');
    const summary = await interviewer.endInterview();

    printSection('Interview Summary');

    console.log('📋 JOB STATEMENT:');
    console.log(`   ${summary.jobStatement}\n`);

    console.log('💥 STRUGGLING MOMENT:');
    console.log(`   ${summary.strugglingMoment}\n`);

    if (summary.timeline.length > 0) {
      console.log('📅 DECISION TIMELINE:');
      for (const event of summary.timeline) {
        console.log(`   ${event.phase}: ${event.details}`);
      }
      console.log('');
    }

    console.log('⚡ FORCES OF PROGRESS:');
    if (summary.forces.push.length > 0) {
      console.log('   PUSH (away from current):');
      for (const f of summary.forces.push) {
        console.log(`     - ${f.description} (${f.intensity}/10)`);
      }
    }
    if (summary.forces.pull.length > 0) {
      console.log('   PULL (toward new):');
      for (const f of summary.forces.pull) {
        console.log(`     - ${f.description} (${f.intensity}/10)`);
      }
    }
    if (summary.forces.anxiety.length > 0) {
      console.log('   ANXIETY (barriers):');
      for (const f of summary.forces.anxiety) {
        console.log(`     - ${f.description} (${f.intensity}/10)`);
      }
    }
    if (summary.forces.habit.length > 0) {
      console.log('   HABIT (comfort):');
      for (const f of summary.forces.habit) {
        console.log(`     - ${f.description} (${f.intensity}/10)`);
      }
    }
    console.log('');

    if (summary.topVerbatimQuotes.length > 0) {
      console.log('💬 TOP QUOTES:');
      for (const q of summary.topVerbatimQuotes) {
        console.log(`   "${q.quote}"`);
      }
      console.log('');
    }

    if (summary.keyInsights.length > 0) {
      console.log('🎯 KEY INSIGHTS:');
      for (const insight of summary.keyInsights) {
        console.log(`   - ${insight}`);
      }
      console.log('');
    }

    if (summary.recommendations.length > 0) {
      console.log('💡 RECOMMENDATIONS:');
      for (const rec of summary.recommendations) {
        console.log(`   - ${rec}`);
      }
    }

    // Export final summary
    const json = interviewer.exportToJSON();
    const filename = `interview-summary-${Date.now()}.json`;
    const fs = await import('fs');
    fs.writeFileSync(filename, json);
    console.log(`\n📁 Full data exported to ${filename}`);

  } catch (error) {
    console.error('Error during interview:', error);
  } finally {
    rl.close();
  }
}

main().catch(console.error);
