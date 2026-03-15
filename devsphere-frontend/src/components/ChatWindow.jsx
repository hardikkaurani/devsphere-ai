function ChatWindow({ messages, input, setInput, onSend }) {

  return (
    <div style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      padding: "20px",
      background: "#111827",
      color: "white"
    }}>

      <div style={{
        flex: 1,
        overflowY: "auto",
        marginBottom: "15px"
      }}>

        {messages.map((m, index) => {

          const isUser = m.role === "user"

          return (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: isUser ? "flex-end" : "flex-start",
                marginBottom: "10px"
              }}
            >
              <div style={{
                background: isUser ? "#4f46e5" : "#1f2937",
                padding: "10px 14px",
                borderRadius: "12px",
                maxWidth: "60%"
              }}>
                {m.content}
              </div>
            </div>
          )
        })}

      </div>

      <div style={{ display: "flex" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type message..."
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "8px",
            border: "none",
            outline: "none"
          }}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
        />

        <button
          onClick={onSend}
          style={{
            marginLeft: "10px",
            padding: "10px 16px",
            borderRadius: "8px",
            border: "none",
            background: "#4f46e5",
            color: "white",
            cursor: "pointer"
          }}
        >
          Send
        </button>
      </div>

    </div>
  )
}

export default ChatWindow
