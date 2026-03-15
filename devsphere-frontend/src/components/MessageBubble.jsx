function MessageBubble({ role, content }) {
  const isUser = role === "user"

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: "10px"
      }}
    >
      <div
        style={{
          background: isUser ? "#4f46e5" : "#1f2937",
          color: "white",
          padding: "10px 14px",
          borderRadius: "12px",
          maxWidth: "60%"
        }}
      >
        {content}
      </div>
    </div>
  )
}

export default MessageBubble
