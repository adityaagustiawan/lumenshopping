import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Send, Sparkles, Image, Mic, Paperclip } from "lucide-react";
import { listThreads, createThread, deleteThread } from "@/lib/threads.functions";
import { Button } from "@/components/ui/button";
import { processMultimodalInput } from "@/lib/multimodal/multimodal-handler";
import { processProductQuery, detectIntent } from "@/lib/smart-product-matcher";
import logoImage from "/lumen-logo.png";

export const Route = createFileRoute("/_authenticated/chat/$threadId")({
  component: ChatPage,
  head: () => ({
    meta: [
      { title: "Lumen AI Assistant - Chat" },
      { name: "description", content: "Chat with Lumen AI Assistant" },
    ],
  }),
});

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  attachments?: string[];
};

function ChatPage() {
  const { threadId } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const threadsQ = useQuery({ queryKey: ["threads"], queryFn: () => listThreads() });
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [isRecording, setIsRecording] = useState(false);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  // Auto-focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Smart AI with Product Recommendations
  const sendMessageToCoze = async (text: string) => {
    setIsTyping(true);
    setError(null);

    // Add user message immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      // First, check if this is a product-related query
      const intent = detectIntent(text);
      
      if (intent.type === 'product_search' || intent.type === 'price_inquiry' || intent.type === 'comparison') {
        // Use smart product matcher for e-commerce queries
        console.log("Using Smart Product Matcher for query:", text);
        const productResponse = processProductQuery(text);
        
        const aiMessage: Message = {
          id: Date.now().toString() + "-ai",
          role: "assistant",
          content: productResponse,
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, aiMessage]);
        return;
      }
      
      // For general queries, use Coze API
      console.log("Calling Coze API with query:", text);
      
      const response = await fetch(
        "https://api.coze.com/open_api/v2/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer pat_3CaXfkjyolIFkWAKOPbiyC9xqdKKc9kcws1XrVWpQxQus4aWiRoxqczGGkq8JupU",
          },
          body: JSON.stringify({
            bot_id: "7649776912948330549",
            user: "lumen-user-" + Math.random().toString(36).substr(2, 9),
            query: text,
            stream: false,
          }),
        }
      );

      console.log("Coze API response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Coze API error response:", errorText);
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("Coze API full response:", data);
      
      // Get AI response from Coze's v2 API response format
      let aiContent = "Sorry, I couldn't get a response.";
      
      if (data.messages && Array.isArray(data.messages)) {
        const assistantMessage = data.messages.find((msg: any) => msg.type === "answer" || msg.role === "assistant");
        if (assistantMessage) {
          aiContent = assistantMessage.content || assistantMessage.text || aiContent;
        }
      } else if (data.data && data.data.answers) {
        aiContent = data.data.answers[0] || aiContent;
      } else if (data.answer) {
        aiContent = data.answer;
      }
      
      // Add AI message
      const aiMessage: Message = {
        id: Date.now().toString() + "-ai",
        role: "assistant",
        content: aiContent,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      console.error("Coze API error details:", err);
      const errorMessage: Message = {
        id: Date.now().toString() + "-error",
        role: "assistant",
        content: `Sorry, there was an error: ${err.message}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setError(err.message);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    setIsTyping(true);
    setError(null);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: `📄 Uploaded file: ${file.name}`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const result = await processMultimodalInput({
        type: 'file',
        data: file,
        metadata: {
          fileName: file.name,
          mimeType: file.type,
        }
      });

      const aiMessage: Message = {
        id: Date.now().toString() + "-ai",
        role: "assistant",
        content: result.content,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      console.error("File processing error:", err);
      const errorMessage: Message = {
        id: Date.now().toString() + "-error",
        role: "assistant",
        content: `Sorry, there was an error processing the file: ${err.message}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setError(err.message);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    setIsTyping(true);
    setError(null);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: `📸 Uploaded image: ${file.name}`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const result = await processMultimodalInput({
        type: 'image',
        data: file,
        metadata: {
          fileName: file.name,
          mimeType: file.type,
        }
      });

      const aiMessage: Message = {
        id: Date.now().toString() + "-ai",
        role: "assistant",
        content: result.content,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      console.error("Image processing error:", err);
      const errorMessage: Message = {
        id: Date.now().toString() + "-error",
        role: "assistant",
        content: `Sorry, there was an error processing the image: ${err.message}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setError(err.message);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle voice recording
  const handleVoiceRecording = async () => {
    if (isRecording) {
      // Stop recording logic would go here
      setIsRecording(false);
      return;
    }

    setIsRecording(true);
    setError(null);

    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        stream.getTracks().forEach(track => track.stop());

        setIsTyping(true);
        const userMessage: Message = {
          id: Date.now().toString(),
          role: "user",
          content: `🎤 Voice message recorded`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);

        try {
          const result = await processMultimodalInput({
            type: 'voice',
            data: audioBlob,
            metadata: {
              mimeType: 'audio/webm',
            }
          });

          const aiMessage: Message = {
            id: Date.now().toString() + "-ai",
            role: "assistant",
            content: result.content,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, aiMessage]);
        } catch (err: any) {
          console.error("Voice processing error:", err);
          const errorMessage: Message = {
            id: Date.now().toString() + "-error",
            role: "assistant",
            content: `Sorry, there was an error processing the voice: ${err.message}`,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, errorMessage]);
          setError(err.message);
        } finally {
          setIsTyping(false);
        }
      };

      mediaRecorder.start();

      // Auto-stop after 60 seconds
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
          setIsRecording(false);
        }
      }, 60000);

      // Stop recording after 5 seconds for demo
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
          setIsRecording(false);
        }
      }, 5000);

    } catch (err: any) {
      console.error("Microphone access error:", err);
      setError("Could not access microphone. Please grant permission.");
      setIsRecording(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isTyping) return;
    
    setInput("");
    await sendMessageToCoze(text);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 grid lg:grid-cols-[260px_1fr] gap-6 h-[calc(100vh-4rem-3rem)]">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col bg-card border border-border/60 rounded-2xl p-3 overflow-hidden">
        <Button
          onClick={async () => {
            try {
              const { id } = await createThread();
              qc.invalidateQueries({ queryKey: ["threads"] });
              navigate({ to: "/chat/$threadId", params: { threadId: id } });
            } catch (err: any) {
              console.error("Create thread error:", err);
            }
          }}
          className="rounded-full mb-3"
        >
          <Plus className="w-4 h-4 mr-1" /> New chat
        </Button>
        <div className="flex-1 overflow-y-auto space-y-1">
          {threadsQ.data?.threads.map((t: any) => (
            <div key={t.id} className={`group flex items-center gap-1 rounded-lg pr-1 ${t.id === threadId ? "bg-secondary" : "hover:bg-secondary/60"}`}>
              <Link
                to="/chat/$threadId" params={{ threadId: t.id }}
                className="flex-1 min-w-0 px-2.5 py-2 text-sm truncate"
              >
                {t.title}
              </Link>
              <button
                onClick={async () => {
                  try {
                    await deleteThread({ data: { id: t.id } });
                    qc.invalidateQueries({ queryKey: ["threads"] });
                    if (t.id === threadId) navigate({ to: "/chat" });
                  } catch (err: any) {
                    console.error("Delete thread error:", err);
                  }
                }}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground hover:text-destructive"
                aria-label="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </aside>

      {/* Custom Coze AI Chat */}
      <section className="flex flex-col bg-card border border-border/60 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="font-display text-xl flex items-center gap-2">
            <img src={logoImage} alt="Lumen" className="w-8 h-8 object-contain" />
            Lumen AI Assistant
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Your AI marketplace assistant
          </p>
          {error && (
            <p className="text-xs text-red-500 mt-1">
              Error: {error}
            </p>
          )}
        </div>

        {/* Messages container */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-5">
          {messages.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="inline-flex w-20 h-20 rounded-full bg-gradient-to-br from-accent/10 to-accent/5 items-center justify-center p-3">
                <img src={logoImage} alt="Lumen AI" className="w-full h-full object-contain" />
              </div>
              <h3 className="font-display text-2xl">Hi, I'm Lumen AI</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                I'm your smart shopping assistant! I can help you find products with direct links to buy them.
              </p>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {["Show me running shoes", "Find cheap laptops", "Best deals on headphones"].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setInput(s);
                    }}
                    className="text-xs px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/70 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="mt-6 text-xs text-muted-foreground">
                <p>💡 Try asking about specific products, categories, or deals!</p>
              </div>
            </div>
          ) : (
            messages.map((m) => (
              <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                {m.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center shrink-0 p-1.5">
                    <img src={logoImage} alt="Lumen" className="w-full h-full object-contain" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap transform transition-all hover:scale-[1.02] ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
                  {m.content}
                </div>
              </div>
            ))
          )}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center p-1.5">
                <img src={logoImage} alt="Lumen" className="w-full h-full object-contain animate-pulse" />
              </div>
              <div className="bg-secondary rounded-2xl px-4 py-3 flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:0.3s]" />
              </div>
            </div>
          )}
        </div>

        {/* Chat input */}
        <form onSubmit={handleSend} className="border-t border-border p-3 flex gap-2 items-end">
          {/* Hidden file inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls,.pdf,.txt,.json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
              e.target.value = '';
            }}
          />
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file);
              e.target.value = '';
            }}
          />
          
          <div className="flex gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full"
              onClick={() => fileInputRef.current?.click()}
              title="Upload file (CSV, Excel, PDF)"
            >
              <Paperclip className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full"
              onClick={() => imageInputRef.current?.click()}
              title="Upload image"
            >
              <Image className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={`h-10 w-10 rounded-full ${isRecording ? 'bg-red-500 text-white hover:bg-red-600' : ''}`}
              onClick={handleVoiceRecording}
              title={isRecording ? "Recording... (click to stop)" : "Record voice message"}
            >
              <Mic className="w-4 h-4" />
            </Button>
          </div>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Lumen AI anything..."
            className="flex-1 bg-secondary rounded-full px-4 h-11 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
          <Button 
            type="submit" 
            disabled={isTyping || !input.trim()} 
            className="rounded-full h-11 px-5"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </section>
    </div>
  );
}
