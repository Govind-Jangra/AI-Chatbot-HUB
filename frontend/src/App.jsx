import React, { useState } from "react";
import { Button } from "./components/index";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/index";
import { MessageSquare, ArrowRight } from "lucide-react";
import ChatBot from './pages/chatbot';  // Assuming you have ChatBot component for each chatbot

function ChatbotCard({ title, description, onClick }) {
  return (
    <Card className="w-full max-w-sm bg-white shadow-lg hover:shadow-2xl transition-all duration-300 rounded-lg overflow-hidden">
      <CardHeader className="p-6">
        <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-800">
          <MessageSquare className="h-6 w-6 text-indigo-600" />
          {title}
        </CardTitle>
        <CardDescription className="mt-2 text-gray-600">{description}</CardDescription>
      </CardHeader>
      <CardFooter className="p-6">
        <Button 
          className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold flex justify-center items-center gap-2 rounded-md hover:from-purple-600 hover:to-indigo-500 transition-all duration-200" 
          onClick={onClick}
        >
          Start Chatting
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </CardFooter>
    </Card>
  );
}

function HomePage() {
  const [activeChatbot, setActiveChatbot] = useState(null);  // State to track active chatbot

  const chatbots = [
    {
      title: "Real Estate Coach",
      description: "Helps with all your Real Estate inquiries.",
      component: <ChatBot chatbot="realestate" />
    },
    {
      title: "Sales Coach",
      description: "Helps with all your sales inquiries.",
      component: <ChatBot chatbot="sales" />
    },
    {
      title: "Motivation Coach",
      description: "Provides motivational quotes and advice.",
      component: <ChatBot chatbot="motivation" />
    },
    {
      title: "Negotiation Coach",
      description: "Assists with negotiation strategies.",
      component: <ChatBot chatbot="negotiation" />
    },
  ];

  // Function to render the home page with all chatbot options
  const renderHomePage = () => (
    <>
      <section className="mb-12 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">Welcome to AI Chatbot Hub</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore our range of AI-powered chatbots designed to assist you with various tasks.
          Choose a chatbot to get started!
        </p>
      </section>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
        {chatbots.map((chatbot, index) => (
          <ChatbotCard
            key={index}
            title={chatbot.title}
            description={chatbot.description}
            onClick={() => setActiveChatbot(chatbot)}  // Set the active chatbot when clicked
          />
        ))}
      </section>
    </>
  );

  // Function to render the active chatbot with full-screen mode
  const renderChatbot = () => (
    <div className="flex flex-col h-screen">
    <Button 
        className="mb-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-200 w-1/4 ml-6 mt-6"
        onClick={() => setActiveChatbot(null)}
      >
        Go Back to Home
      </Button>
      <div className="flex-grow flex items-center justify-center bg-gray-50">
        <div className="w-full h-full max-w-4xl bg-white shadow-xl rounded-lg overflow-hidden">
          {activeChatbot.component}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="py-6 bg-white border-b shadow-sm">
        <h1 className="text-4xl font-extrabold text-center text-gray-800">AI Chatbot Hub</h1>
      </header>
      <main className="flex-grow container mx-auto px-4 py-12">
        {/* Conditionally render based on whether a chatbot is active */}
        {activeChatbot ? renderChatbot() : renderHomePage()}
      </main>
      <footer className="py-6 bg-white border-t shadow-sm text-center text-sm text-gray-500">
        © 2024 AI Chatbot Hub. All rights reserved.
      </footer>
    </div>
  );
}

export default HomePage;
