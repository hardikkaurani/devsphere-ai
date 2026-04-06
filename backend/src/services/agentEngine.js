const axios = require("axios")
const { getConfig } = require("../utils/environment")

exports.runAgent = async (agentType, messages) => {
  try {
    const config = getConfig()
    
    let systemPrompt = ""

    if (agentType === "coding") {
      systemPrompt = "You are an expert coding assistant."
    } else if (agentType === "resume") {
      systemPrompt = "You are a professional resume reviewer."
    } else {
      systemPrompt = "You are a helpful AI assistant."
    }

    const userMessage = messages[messages.length - 1]?.content || ""

    const fullPrompt = systemPrompt + "\nUser: " + userMessage

    const response = await axios.post(
      `${config.ollamaBaseUrl}/api/generate`,
      {
        model: config.ollamaModel,
        prompt: fullPrompt,
        stream: false
      }
    )

    return response.data.response

  } catch (err) {
    console.log("OLLAMA ERROR FULL:", err.message)
    throw new Error("Ollama failed")
  }
}