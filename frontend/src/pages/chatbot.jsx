import { useState } from "react";
import { SendIcon, BotIcon, UserIcon, Loader2 } from "lucide-react";

// Reusable Input Component
function Input({ type, placeholder, value, onChange, className }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-300 ${className}`}
    />
  );
}

// Reusable Button Component
function Button({ type, size, children }) {
  return (
    <button
      type={type}
      className={`p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-lg hover:opacity-90 transition-opacity duration-300`}
    >
      {children}
    </button>
  );
}

// Scrollable Chat Container
function ScrollArea({ children, className }) {
  return <div className={`overflow-auto h-full ${className}`}>{children}</div>;
}

// Avatar Component
function Avatar({ className, children }) {
  return <div className={`inline-block rounded-full ${className}`}>{children}</div>;
}

// Avatar with Image
function AvatarImage({ src }) {
  return <img src={src} alt="avatar" className="w-full h-full rounded-full" />;
}

// Fallback Avatar Content
function AvatarFallback({ children }) {
  return <div className="w-full h-full flex items-center justify-center">{children}</div>;
}

// Chat Message Component
function ChatMessage({ message, role }) {
  const isBot = role === "assistant";
  
  return (
    <div className={`flex ${isBot ? "justify-start" : "justify-end"} mb-4`}>
      <div className={`flex ${isBot ? "flex-row" : "flex-row-reverse"} items-start max-w-[80%]`}>
        <Avatar className="w-10 h-10 mr-3 shadow-sm">
          <AvatarImage src={isBot ? "https://github.com/polymet-ai.png" : "https://github.com/yusufhilmi.png"} />
          <AvatarFallback>{isBot ? <BotIcon className="w-5 h-5" /> : <UserIcon className="w-5 h-5" />}</AvatarFallback>
        </Avatar>
        <div className={`p-4 rounded-xl shadow-md ${isBot ? "bg-gray-100 text-gray-900" : "bg-blue-500 text-white"}`}>
          {message}
        </div>
      </div>
    </div>
  );
}

// Chat Input Component
function ChatInput({ onSendMessage }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-3 py-2 bg-white border-t border-gray-200">
      <Input
        type="text"
        placeholder="Type your message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="flex-grow rounded-full px-4"
      />
      <Button type="submit" size="icon">
        <SendIcon className="w-5 h-5" />
      </Button>
    </form>
  );
}

// Main ChatBot Component
export default function ChatBot({ chatbot }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! How can I help you today?" },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (message) => {
    const updatedMessages = [...messages, { content: message, role: "user" }];
    setMessages(updatedMessages);

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_VARIABLE_NAME}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages,
          chatbot: "sales",
        }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { content: data.response, role: "assistant" }]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[600px] max-w-2xl mx-auto border rounded-lg overflow-hidden bg-gray-50 shadow-lg">
      <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        <h2 className="text-2xl font-bold">Your {chatbot} Coach</h2>
      </div>
      <ScrollArea className="flex-grow p-4 space-y-4">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message.content} role={message.role} />
        ))}
        {loading && (
          <div className="flex justify-start mb-4">
            <div className="flex items-start max-w-[80%]">
              <Avatar className="w-10 h-10 mr-3 shadow-sm">
                <AvatarImage src="https://github.com/polymet-ai.png" />
                <AvatarFallback><BotIcon className="w-5 h-5" /></AvatarFallback>
              </Avatar>
              <div className="p-4 rounded-lg bg-gray-100 text-gray-900">
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                AI is thinking...
              </div>
            </div>
          </div>
        )}
      </ScrollArea>
      <div className="p-4 border-t bg-white">
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}
