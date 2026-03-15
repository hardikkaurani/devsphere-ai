const axios = require("axios")

exports.runAgent = async (agentType, messages) => {
  try {
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
      "http://localhost:11434/api/generate",
      {
        model: "gemma:2b",
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