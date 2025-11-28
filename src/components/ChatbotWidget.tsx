import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldWiggle, setShouldWiggle] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Chat URL zum N Jackpot Workflow
  const WEBHOOK_URL = "https://n8n-n8n.v7jz86.easypanel.host/webhook/7d6db2fe-9b59-43d6-85ea-46807fdcda1f/chat";

  useEffect(() => {
    const wiggleInterval = setInterval(() => {
      if (!isOpen) {
        setShouldWiggle(true);
        setTimeout(() => setShouldWiggle(false), 500);
      }
    }, 10000);

    return () => clearInterval(wiggleInterval);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Zeige Willkommensnachricht beim ersten Öffnen
      const welcomeMessage: Message = {
        id: crypto.randomUUID(),
        text: "Hallo, wie kann ich dir heute helfen? 😊",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    // Scrolle zum Ende wenn neue Nachrichten hinzugefügt werden
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.text,
          sessionId: crypto.randomUUID(),
        }),
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        throw new Error(`Netzwerkfehler: ${response.status}`);
      }

      const data = await response.json();
      console.log("Received data:", data);
      console.log("Data type:", typeof data);
      console.log("Is array:", Array.isArray(data));
      
      // n8n gibt ein Array zurück mit einem "output" Feld
      let botText = "Entschuldigung, ich konnte keine Antwort generieren.";
      
      if (Array.isArray(data) && data.length > 0) {
        console.log("First item:", data[0]);
        if (data[0].output) {
          botText = data[0].output;
          console.log("Using output field:", botText);
        } else if (data[0].message) {
          botText = data[0].message;
          console.log("Using message field:", botText);
        }
      } else if (typeof data === 'object' && data !== null) {
        if (data.output) {
          botText = data.output;
          console.log("Using direct output:", botText);
        } else if (data.response) {
          botText = data.response;
          console.log("Using response field:", botText);
        } else if (data.message) {
          botText = data.message;
          console.log("Using message field:", botText);
        }
      }
      
      console.log("Final bot text:", botText);
      
      const botMessage: Message = {
        id: crypto.randomUUID(),
        text: botText,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Fehler beim Senden der Nachricht:", error);
      console.error("Error details:", error instanceof Error ? error.message : error);
      
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        text: "Entschuldigung, es gab ein Problem. Bitte versuche es später erneut.",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] max-w-[calc(100vw-3rem)] max-h-[calc(100vh-8rem)] bg-background rounded-2xl shadow-2xl border border-border flex flex-col z-50 animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-chatbot-primary to-chatbot-secondary p-4 rounded-t-2xl flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-chatbot-primary-foreground/20 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-chatbot-primary-foreground" />
              </div>
              <div>
                <h3 className="text-chatbot-primary-foreground font-semibold">ANNA - Virtueller ChatBot</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                  <p className="text-success text-xs font-medium">Online</p>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-chatbot-primary-foreground hover:bg-chatbot-primary-foreground/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Chat Messages */}
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      message.sender === "user"
                        ? "bg-chatbot-primary text-chatbot-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {message.timestamp.toLocaleTimeString("de-DE", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted text-foreground rounded-2xl px-4 py-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Nachricht schreiben..."
                className="flex-1"
                disabled={isLoading}
                maxLength={1000}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="bg-chatbot-primary hover:bg-chatbot-secondary text-chatbot-primary-foreground"
                size="icon"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className={`fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-2xl bg-gradient-to-br from-chatbot-primary to-chatbot-secondary hover:from-chatbot-secondary hover:to-chatbot-primary transition-all duration-300 z-50 ${
            shouldWiggle ? "animate-wiggle" : ""
          }`}
          size="icon"
        >
          <MessageCircle className="w-7 h-7 text-chatbot-primary-foreground" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-pulse" />
        </Button>
      )}
    </>
  );
};

export default ChatbotWidget;
