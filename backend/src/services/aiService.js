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
    this.timeout = 30000;
  }

  /**
   * Get system prompt for different agent types
   */
  getSystemPrompt(agentType) {
    const prompts = {
      coding: `You are an expert coding assistant with deep knowledge of software development.
You help write clean, efficient, and well-documented code.
You follow best practices and design patterns.
Keep responses concise but thorough.`,

      resume: `You are a professional resume reviewer and career advisor.
You provide constructive feedback on resumes and help optimize them for ATS systems.
You suggest improvements for structure, content, and formatting.
Keep responses professional and actionable.`,

      general: `You are a helpful and knowledgeable AI assistant.
You provide accurate, clear, and concise answers to user questions.
You ask clarifying questions when needed.
You maintain context across conversations.`
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
   * Send request to Ollama
   */
  async callOllama(prompt) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/api/generate`,
        {
          model: this.model,
          prompt,
          stream: false
        },
        { timeout: this.timeout }
      );

      return response.data.response;
    } catch (error) {
      logger.error('Ollama API error:', error.message);
      throw new ExternalServiceError(error.message, 'Ollama');
    }
  }

  /**
   * Run agent with conversation history
   */
  async runAgent(agentType, messages) {
    try {
      const systemPrompt = this.getSystemPrompt(agentType);
      const messageHistory = this.formatMessages(messages);
      
      const fullPrompt = `${systemPrompt}\n\n${messageHistory}`;

      logger.info(`Running ${agentType} agent with ${messages.length} messages`);
      
      const response = await this.callOllama(fullPrompt);
      
      logger.info('Agent response generated successfully');
      return response.trim();
    } catch (error) {
      logger.error(`Agent error (${agentType}):`, error.message);
      throw error;
    }
  }

  /**
   * Generate a quick response
   */
  async generateResponse(prompt, agentType = 'general') {
    try {
      const systemPrompt = this.getSystemPrompt(agentType);
      const fullPrompt = `${systemPrompt}\n\nUser: ${prompt}`;

      return await this.callOllama(fullPrompt);
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
