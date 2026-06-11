/**
 * AI Agent Engine Service
 * Handles all LLM and agent-related operations
 * Abstracts Ollama integration for easy provider switching
 */

const axios = require('axios');
const logger = require('../utils/logger');
const { ExternalServiceError } = require('../utils/errors');
const { getConfig } = require('../utils/environment');

class AgentEngine {
  constructor() {
    const config = getConfig();
    this.baseUrl = config.ollamaBaseUrl;
    this.model = config.ollamaModel;
    this.timeout = 45000; // Increase timeout for slower models/systems
  }

  /**
   * Get system prompt for different agent types
   */
  getSystemPrompt(agentType) {
    const prompts = {
      coding: `You are an expert coding assistant with deep knowledge of software development.
You help write clean, efficient, and well-documented code.
You follow best practices and design patterns.
Provide clear code snippets, explanations, and follow-up advice if necessary.
Include copy-friendly code blocks using markdown formatting.`,

      resume: `You are a professional resume reviewer and career advisor.
You provide constructive feedback on resumes and help optimize them for ATS systems.
You suggest improvements for structure, content, and formatting.
Keep responses professional, actionable, and formatted nicely in markdown.`,

      general: `You are a helpful and knowledgeable AI assistant.
You provide accurate, clear, and concise answers to user questions.
You ask clarifying questions when needed.
You maintain context across conversations.
Format your responses beautifully with markdown.`
    };

    return prompts[agentType] || prompts.general;
  }

  /**
   * Format message history for the model
   */
  formatMessages(messages) {
    return messages
      .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n');
  }

  /**
   * Send request to Ollama with timing metrics
   */
  async callOllama(prompt, model = this.model) {
    const startTime = Date.now();
    const selectedModel = model || this.model;
    try {
      logger.debug(`Ollama request initiated. Model: ${selectedModel}`);
      const response = await axios.post(
        `${this.baseUrl}/api/generate`,
        {
          model: selectedModel,
          prompt,
          stream: false
        },
        { timeout: this.timeout }
      );

      const duration = Date.now() - startTime;
      logger.info(`Ollama request completed in ${duration}ms`);
      return response.data.response;
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error(`Ollama API error after ${duration}ms:`, error.message);
      throw new ExternalServiceError(error.message, 'Ollama');
    }
  }

  /**
   * Run agent with conversation history
   */
  async runAgent(agentType, messages, model = this.model) {
    try {
      const systemPrompt = this.getSystemPrompt(agentType);
      const messageHistory = this.formatMessages(messages);

      const fullPrompt = `${systemPrompt}\n\n${messageHistory}`;

      logger.info(`Running ${agentType} agent with ${messages.length} messages using model ${model || this.model}`);

      const response = await this.callOllama(fullPrompt, model);

      logger.info('Agent response generated successfully');
      return response.trim();
    } catch (error) {
      logger.error(`Agent error (${agentType}):`, error.message);
      throw error;
    }
  }

  /**
   * Run agent with streaming support
   */
  async runAgentStream(agentType, messages, model = this.model, onChunk) {
    try {
      const systemPrompt = this.getSystemPrompt(agentType);
      const messageHistory = this.formatMessages(messages);
      const fullPrompt = `${systemPrompt}\n\n${messageHistory}`;
      const selectedModel = model || this.model;

      logger.info(`Running ${agentType} agent in streaming mode with model ${selectedModel}`);

      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: selectedModel,
          prompt: fullPrompt,
          stream: true
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama stream error: ${response.statusText}`);
      }

      const decoder = new TextDecoder();
      let fullText = '';

      for await (const chunk of response.body) {
        const text = decoder.decode(chunk, { stream: true });
        const lines = text.split('\n');
        for (const line of lines) {
          if (!line.trim()) {
            continue;
          }
          try {
            const parsed = JSON.parse(line);
            if (parsed.response) {
              fullText += parsed.response;
              onChunk(parsed.response);
            }
          } catch {
            // Ignore parse errors on incomplete JSON lines
          }
        }
      }

      return fullText.trim();
    } catch (error) {
      logger.error(`Stream error (${agentType}):`, error.message);
      throw error;
    }
  }

  /**
   * Generate a quick response
   */
  async generateResponse(prompt, agentType = 'general', model = this.model) {
    try {
      const systemPrompt = this.getSystemPrompt(agentType);
      const fullPrompt = `${systemPrompt}\n\nUser: ${prompt}`;

      return await this.callOllama(fullPrompt, model);
    } catch (error) {
      logger.error('Error generating response:', error.message);
      throw error;
    }
  }

  /**
   * Check if Ollama is available
   */
  async isHealthy() {
    try {
      const response = await axios.get(`${this.baseUrl}/api/tags`, {
        timeout: 5000
      });
      return response.status === 200;
    } catch (error) {
      logger.warn('Ollama health check failed:', error.message);
      return false;
    }
  }
}

module.exports = new AgentEngine();
