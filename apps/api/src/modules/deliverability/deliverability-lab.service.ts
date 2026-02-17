
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DeliverabilityTest } from '@shared/types';
import { InboxesService } from '../inboxes/inboxes.service';
import { GoogleGenAI } from "@google/genai";

@Injectable()
export class DeliverabilityLabService {
  private readonly logger = new Logger(DeliverabilityLabService.name);
  private tests: DeliverabilityTest[] = []; // Mock DB
  private ai: GoogleGenAI;

  constructor(private readonly inboxesService: InboxesService) {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async getHistory(workspaceId: string) {
    return this.tests.filter(t => t.workspaceId === workspaceId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getTest(workspaceId: string, id: string) {
    const test = this.tests.find(t => t.id === id && t.workspaceId === workspaceId);
    if (!test) throw new NotFoundException('Test not found');
    return test;
  }

  async runTest(workspaceId: string, inboxId: string, subject: string, body: string) {
    this.logger.log(`Running Deliverability Lab test for inbox ${inboxId}`);

    // 1. Simulate sending to seed list (Gmail, Outlook, etc.)
    // 2. Perform DNS checks
    // 3. Analyze content with AI for spam triggers

    const analysis = await this.analyzeContentWithAI(subject, body);

    const test: DeliverabilityTest = {
      id: `test_${Date.now()}`,
      workspaceId,
      inboxId,
      status: 'completed',
      score: this.calculateMockScore(analysis),
      placement: {
        gmail: Math.random() > 0.8 ? 'promotions' : 'primary',
        outlook: Math.random() > 0.9 ? 'spam' : 'primary',
        yahoo: 'primary',
        icloud: 'primary'
      },
      dnsHealth: {
        spf: true,
        dkim: true,
        dmarc: Math.random() > 0.2
      },
      recommendations: analysis.recommendations,
      createdAt: new Date()
    };

    this.tests.push(test);
    return test;
  }

  private async analyzeContentWithAI(subject: string, body: string) {
    try {
      this.logger.debug('Analyzing email content for spam triggers...');
      const prompt = `Act as a Deliverability Expert. Analyze the following cold email for spam triggers, blacklisted keywords, and formatting issues.
      Subject: ${subject}
      Body: ${body}
      
      Return JSON with: { "spamScore": 0-100, "recommendations": ["string"] }`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      return JSON.parse(response.text || '{}');
    } catch (err) {
      this.logger.error('AI analysis failed', err);
      return { spamScore: 10, recommendations: ["Check for missing unsubscribe links", "Avoid excessive capitalization"] };
    }
  }

  private calculateMockScore(analysis: any): number {
    // Basic scoring logic: starts at 100, deducts based on spam triggers and placement
    let score = 100 - (analysis.spamScore || 0);
    return Math.max(0, Math.min(100, score));
  }
}
