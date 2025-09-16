"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Clock,
  Edit,
  Send,
  Bot,
  RefreshCw,
  Car,
  Download,
  Sparkles,
  Navigation,
} from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

// --- IMPORTANT ---
// Initialize the Google Generative AI client with your API key.
// Replace "YOUR_API_KEY" with your actual API key.
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

// Enhanced Gemini AI service with better context management
const geminiService = {
  async generateResponse(userMessage, conversationContext) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Create a comprehensive context summary
      const currentTripDetails = {
        destination: conversationContext.slots.destination || "Not specified",
        startDate: conversationContext.slots.startDate || "Not specified",
        endDate: conversationContext.slots.endDate || "Not specified",
        travelers: conversationContext.slots.travelers || 1,
        budgetAmount: conversationContext.slots.budgetAmount || "Not specified",
        transportation:
          conversationContext.slots.transportation || "Not specified",
        interests: conversationContext.slots.interests || [],
      };

      const prompt = `You are a friendly and expert travel planning assistant for Jharkhand, India.

**IMPORTANT - CURRENT TRIP DETAILS ALREADY CONFIRMED:**
${JSON.stringify(currentTripDetails, null, 2)}

**CRITICAL RULE: NEVER ask for information that is already specified above. Only ask for missing details.**

Recent Conversation: ${JSON.stringify(
        conversationContext.recentMessages
          .slice(-8)
          .map((m) => `${m.type}: ${m.text}`)
      )}

User's Latest Message: "${userMessage}"

Your Task:
1. Review the CURRENT TRIP DETAILS above - these are CONFIRMED and should NOT be re-asked.
2. Only ask for information that shows "Not specified".
3. If all essential details (destination, startDate, endDate) are confirmed, offer to generate the itinerary.
4. Provide natural, helpful responses without repeating questions about confirmed details.
5. Return JSON with "responseText" and "updatedSlots" (only for genuinely new information).

Essential fields needed: destination, startDate, endDate, budgetAmount`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const cleanedJsonString = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      return JSON.parse(cleanedJsonString);
    } catch (error) {
      console.error("Gemini API Error:", error);
      return {
        responseText:
          "I apologize, but I'm having trouble connecting right now. Please try again.",
        updatedSlots: {},
      };
    }
  },

  async generateStructuredItinerary(slots) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const itineraryPrompt = `
You are an expert travel planner. Create a comprehensive itinerary for Jharkhand based on these details:

CONFIRMED TRIP DETAILS:
${JSON.stringify(slots, null, 2)}

Create a JSON itinerary that includes:
- Mix of temples, natural attractions, culture, and local experiences
- Realistic timing and budget-appropriate activities
- Multiple locations with proper coordinates for mapping

**JSON Schema:**
{
  "title": "A X-Day [Destination] Journey",
  "totalBudget": "₹[Amount]",
  "travelers": [number],
  "locations": [{"name": "Location Name", "coords": [lat, lng]}],
  "days": [{
    "dayNumber": 1,
    "title": "Day Title",
    "activities": [
      {"time": "Time", "description": "Activity description"}
    ]
  }]
}

Include 4+ locations with correct Jharkhand coordinates. Make it comprehensive with temples, waterfalls, culture, food, and local experiences. Return ONLY valid JSON.`;

      const result = await model.generateContent(itineraryPrompt);
      const response = await result.response;
      const text = response.text();
      const cleanedJsonString = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      return JSON.parse(cleanedJsonString);
    } catch (error) {
      console.error("Gemini Itinerary Generation Error:", error);
      return null;
    }
  },
};

// PDF Generation Function
const generatePDF = (itinerary) => {
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${itinerary.title}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 20px; }
        .title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        .summary { display: flex; justify-content: space-around; margin: 20px 0; background: #f5f5f5; padding: 15px; }
        .day { margin: 30px 0; }
        .day-title { font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #000; }
        .activity { margin: 10px 0; padding: 10px; border-left: 3px solid #000; }
        .time { font-weight: bold; }
        .description { margin-top: 5px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">${itinerary.title}</div>
        <div>Budget: ${itinerary.totalBudget} | Travelers: ${
    itinerary.travelers
  }</div>
      </div>
      ${itinerary.days
        .map(
          (day) => `
        <div class="day">
          <div class="day-title">Day ${day.dayNumber}: ${day.title}</div>
          ${day.activities
            .map(
              (activity) => `
            <div class="activity">
              <div class="time">${activity.time}</div>
              <div class="description">${activity.description}</div>
            </div>
          `
            )
            .join("")}
        </div>
      `
        )
        .join("")}
    </body>
    </html>
  `;

  const printWindow = window.open("", "_blank");
  printWindow.document.write(printContent);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};

// Map Component (Simplified for demo)
const RouteMap = ({ locations }) => {
  if (!locations || locations.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center bg-gray-900 rounded-xl text-gray-400 border border-gray-700">
        <Navigation className="mr-2" size={20} />
        Interactive map will appear here
      </div>
    );
  }

  return (
    <div className="my-6 h-80 w-full rounded-xl bg-gray-900 border border-gray-700 flex items-center justify-center text-gray-400">
      <div className="text-center">
        <Navigation size={40} className="mx-auto mb-2" />
        <p>Interactive Route Map</p>
        <p className="text-sm">{locations.length} destinations mapped</p>
      </div>
    </div>
  );
};

// Premium Itinerary Card
const ItineraryCard = ({ itinerary }) => {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 max-w-4xl border border-gray-700 shadow-2xl">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Sparkles className="text-yellow-400" />
            {itinerary.title}
          </h2>
          <div className="flex flex-wrap items-center gap-6 text-gray-300">
            <span className="flex items-center gap-2">
              {itinerary.totalBudget}
            </span>
            <span className="flex items-center gap-2">
              <Users size={18} className="text-blue-400" />
              {itinerary.travelers} Traveler(s)
            </span>
          </div>
        </div>
        <button
          onClick={() => generatePDF(itinerary)}
          className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg"
        >
          <Download size={18} />
          Download PDF
        </button>
      </div>

      {itinerary.locations && <RouteMap locations={itinerary.locations} />}

      <div className="space-y-8 mt-8">
        {itinerary.days.map((day) => (
          <div
            key={day.dayNumber}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center font-bold">
                {day.dayNumber}
              </div>
              {day.title}
            </h3>
            <div className="space-y-4">
              {day.activities.map((activity, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-4 bg-gray-900 rounded-lg border border-gray-700"
                >
                  <Clock
                    size={18}
                    className="mt-1 text-gray-400 flex-shrink-0"
                  />
                  <div>
                    <p className="font-semibold text-white mb-1">
                      {activity.time}
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                      {activity.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DatePicker = ({ onDateSelect, label, minDate }) => {
  const today = new Date().toISOString().split("T")[0];
  const minimumDate = minDate || today;

  const handleDateChange = (e) => {
    const date = e.target.value;
    if (date) {
      onDateSelect(date);
    }
  };

  return (
    <div className="relative">
      <label className="block w-full">
        <span className="sr-only">{label}</span>
        <input
          type="date"
          min={minimumDate}
          onChange={handleDateChange}
          className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-white focus:border-transparent text-white"
          aria-label={label}
        />
      </label>
    </div>
  );
};

const quickStarts = [
  { label: "Weekend Getaway", slot: { duration: 2 }, icon: "🏃‍♂️" },
  { label: "Short Trip (3-4 Days)", slot: { duration: 4 }, icon: "🎒" },
  { label: "Week-long Trip", slot: { duration: 7 }, icon: "🗺️" },
  { label: "Budget Friendly", slot: { budget: "budget" }, icon: "💰" },
  { label: "Luxury Experience", slot: { budget: "luxury" }, icon: "✨" },
  {
    label: "Adventure Focus",
    slot: { interests: ["adventure", "trekking"] },
    icon: "🏔️",
  },
];

const initialBotMessages = [
  {
    type: "bot",
    text: "🙏 Welcome to your premium AI travel concierge for Jharkhand! \n\nI'm here to craft the perfect journey tailored just for you. Share your travel dreams, or choose a quick start option below.",
    timestamp: new Date(),
  },
];

// Main Component
const Home = () => {
  const [messages, setMessages] = useState(initialBotMessages);
  const [input, setInput] = useState("");
  const [slots, setSlots] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    travelers: 1,
    budgetAmount: "",
    interests: [],
    transportation: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const hasEnoughInfoForItinerary = () => {
    return slots.destination && slots.startDate && slots.endDate;
  };

  const generateItinerary = async () => {
    setIsGenerating(true);
    const structuredItinerary = await geminiService.generateStructuredItinerary(
      slots
    );
    setIsGenerating(false);

    if (structuredItinerary) {
      setMessages((prev) => [
        ...prev,
        { type: "bot", itinerary: structuredItinerary, timestamp: new Date() },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "I apologize, but I couldn't generate the itinerary right now. Please try again.",
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleSend = async (text) => {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    const userMessage = {
      type: "user",
      text: trimmedText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsGenerating(true);

    try {
      const conversationContext = { slots, recentMessages: messages.slice(-5) };
      const geminiResponse = await geminiService.generateResponse(
        trimmedText,
        conversationContext
      );

      if (geminiResponse.updatedSlots) {
        setSlots((prevSlots) => ({
          ...prevSlots,
          ...geminiResponse.updatedSlots,
        }));
      }

      const botMessage = {
        type: "bot",
        text: geminiResponse.responseText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);

      const hadEnoughInfo = hasEnoughInfoForItinerary();
      const nowHasEnoughInfo =
        (slots.destination || geminiResponse.updatedSlots.destination) &&
        (slots.startDate || geminiResponse.updatedSlots.startDate) &&
        (slots.endDate || geminiResponse.updatedSlots.endDate);

      if (!hadEnoughInfo && nowHasEnoughInfo) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              type: "bot",
              text: "Perfect! I have all the essential details. Shall I create your personalized premium itinerary now? ✨",
              timestamp: new Date(),
            },
          ]);
        }, 500);
      }
    } catch (error) {
      console.error("Error in conversation:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "An error occurred. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDateSelect = (type, date) => {
    setSlots((prev) => ({ ...prev, [type]: date }));
  };

  const handleQuickStart = (quickStart) => {
    setSlots((prev) => ({ ...prev, ...quickStart.slot }));
    const botText = `Excellent choice! I've noted your interest in "${quickStart.label}". Which destination in Jharkhand captures your imagination?`;
    setMessages((prev) => [
      ...prev,
      { type: "user", text: quickStart.label, timestamp: new Date() },
      { type: "bot", text: botText, timestamp: new Date() },
    ]);
  };

  const editLastAnswer = () => {
    const lastUserIdx = messages.map((m) => m.type).lastIndexOf("user");
    if (lastUserIdx === -1) return;
    const lastUserMsg = messages[lastUserIdx].text;
    setInput(lastUserMsg);
    setMessages(messages.slice(0, lastUserIdx));
  };

  const restartConversation = () => {
    setMessages(initialBotMessages);
    setInput("");
    setSlots({
      destination: "",
      startDate: "",
      endDate: "",
      travelers: 1,
      budgetAmount: "",
      interests: [],
      transportation: "",
    });
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Premium Header */}
      <header className="bg-gradient-to-r from-gray-900 to-black border-b border-gray-700 sticky top-0 z-20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <MapPin className="text-black" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Jharkhand Elite Travel
              </h1>
              <p className="text-gray-400 text-sm">
                Premium AI Travel Concierge
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Sparkles className="text-yellow-400" size={24} />
            <Bot className="text-white" size={24} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid xl:grid-cols-4 gap-8">
          {/* Chat Interface - Now takes more space */}
          <div className="xl:col-span-3 bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-2xl border border-gray-700 flex flex-col">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <Bot className="w-6 h-6 text-white" />
                AI Travel Concierge
                <span className="px-3 py-1 bg-yellow-400 text-black text-xs font-bold rounded-full">
                  PREMIUM
                </span>
              </h2>
            </div>

            <div className="flex-1 h-[65vh] overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex items-end gap-3 ${
                    msg.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.type === "bot" && !msg.itinerary && (
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                      <Bot size={20} className="text-black" />
                    </div>
                  )}
                  <div
                    className={`max-w-4xl w-full ${
                      msg.type === "user" ? "w-auto max-w-md" : ""
                    }`}
                  >
                    {msg.itinerary ? (
                      <ItineraryCard itinerary={msg.itinerary} />
                    ) : (
                      <div
                        className={
                          msg.type === "user"
                            ? "px-6 py-4 rounded-2xl bg-white text-black rounded-br-md shadow-lg"
                            : "bg-gray-800 text-white rounded-2xl rounded-bl-md p-6 border border-gray-700"
                        }
                        dangerouslySetInnerHTML={{
                          __html: msg.text
                            ? msg.text.replace(/\n/g, "<br />")
                            : "",
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
              {isGenerating && (
                <div className="flex items-end gap-3 justify-start">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <Bot size={20} className="text-black" />
                  </div>
                  <div className="bg-gray-800 px-6 py-4 rounded-2xl rounded-bl-md shadow-lg border border-gray-700">
                    <div className="flex items-center gap-3 text-gray-300">
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                      Crafting your perfect journey...
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-gray-700 bg-gray-900">
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {quickStarts.map((q) => (
                    <button
                      key={q.label}
                      onClick={() => handleQuickStart(q)}
                      className="px-4 py-2 text-sm bg-gray-700 border border-gray-600 rounded-xl hover:bg-gray-600 transition-colors flex items-center gap-2 text-white"
                    >
                      <span>{q.icon}</span> {q.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe your dream vacation..."
                  className="flex-1 px-6 py-4 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-white focus:border-transparent text-white placeholder-gray-400"
                  onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
                />
                <button
                  onClick={() => handleSend(input)}
                  className="p-4 bg-white hover:bg-gray-100 text-black rounded-xl transition-colors disabled:bg-gray-600 disabled:text-gray-400"
                  disabled={isGenerating || !input.trim()}
                >
                  <Send size={20} />
                </button>
                <button
                  onClick={editLastAnswer}
                  className="p-4 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors"
                  title="Edit Last Message"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={restartConversation}
                  className="p-4 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors"
                  title="Start Over"
                >
                  <RefreshCw size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar - Trip Details */}
          <div className="xl:col-span-1 space-y-6">
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-2xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                <Calendar className="text-white" />
                Trip Overview
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-2">
                    Travel Dates
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    <DatePicker
                      label="Start Date"
                      onDateSelect={(date) =>
                        handleDateSelect("startDate", date)
                      }
                    />
                    <DatePicker
                      label="End Date"
                      onDateSelect={(date) => handleDateSelect("endDate", date)}
                      minDate={slots.startDate}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-800 rounded-xl border border-gray-700">
                    <span className="text-gray-400 flex items-center gap-2">
                      <MapPin size={16} /> Destination
                    </span>
                    <span className="font-semibold text-white">
                      {slots.destination || "Not selected"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-gray-800 rounded-xl border border-gray-700">
                    <span className="text-gray-400 flex items-center gap-2">
                      <Calendar size={16} /> Duration
                    </span>
                    <span className="font-semibold text-white">
                      {slots.startDate && slots.endDate
                        ? `${
                            Math.ceil(
                              (new Date(slots.endDate) -
                                new Date(slots.startDate)) /
                                (1000 * 60 * 60 * 24)
                            ) + 1
                          } days`
                        : "Not set"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-gray-800 rounded-xl border border-gray-700">
                    <span className="text-gray-400 flex items-center gap-2">
                      <Car size={16} /> Transport
                    </span>
                    <span className="font-semibold text-white">
                      {slots.transportation || "Not decided"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-gray-800 rounded-xl border border-gray-700">
                    <span className="text-gray-400 flex items-center gap-2">
                      <Users size={16} /> Travelers
                    </span>
                    <span className="font-semibold text-white">
                      {slots.travelers}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-gray-800 rounded-xl border border-gray-700">
                    <span className="text-gray-400 flex items-center gap-2">
                      <DollarSign size={16} /> Budget
                    </span>
                    <span className="font-semibold text-white">
                      {slots.budgetAmount
                        ? `₹${slots.budgetAmount}`
                        : "Flexible"}
                    </span>
                  </div>
                </div>

                {hasEnoughInfoForItinerary() && (
                  <button
                    onClick={generateItinerary}
                    disabled={isGenerating}
                    className="w-full py-4 bg-gradient-to-r from-white to-gray-200 text-black rounded-xl font-bold hover:from-gray-100 hover:to-gray-300 transition-all disabled:opacity-50 shadow-lg"
                  >
                    <Sparkles className="inline mr-2" size={18} />
                    Create Premium Itinerary
                  </button>
                )}
              </div>
            </div>

            {/* Status Indicator */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-4 border border-gray-700">
              <div className="text-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mx-auto mb-2 animate-pulse"></div>
                <p className="text-gray-400 text-sm">AI Concierge Online</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
