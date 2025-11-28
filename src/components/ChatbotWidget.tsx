import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "./ui/button";

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldWiggle, setShouldWiggle] = useState(false);

  // Chat URL zum N Jackpot Workflow - bitte durch die tatsächliche URL ersetzen
  const CHAT_URL = "https://your-chat-url.com/n-jackpot-workflow";

  useEffect(() => {
    const wiggleInterval = setInterval(() => {
      if (!isOpen) {
        setShouldWiggle(true);
        setTimeout(() => setShouldWiggle(false), 500);
      }
    }, 10000);

    return () => clearInterval(wiggleInterval);
  }, [isOpen]);

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] max-w-[calc(100vw-3rem)] max-h-[calc(100vh-8rem)] bg-background rounded-2xl shadow-2xl border border-border flex flex-col z-50 animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-gradient-to-r from-chatbot-primary to-chatbot-secondary p-4 rounded-t-2xl flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-chatbot-primary-foreground/20 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-chatbot-primary-foreground" />
              </div>
              <div>
                <h3 className="text-chatbot-primary-foreground font-semibold">N Jackpot Assistent</h3>
                <p className="text-chatbot-primary-foreground/80 text-xs">Wie kann ich dir helfen?</p>
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
          
          <div className="flex-1 overflow-hidden">
            <iframe
              src={CHAT_URL}
              className="w-full h-full border-0"
              title="N Jackpot Chat"
              allow="microphone; camera"
            />
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
