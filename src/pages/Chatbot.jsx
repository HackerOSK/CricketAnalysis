import { useState, useRef, useEffect } from 'react';
import { BsSend, BsRobot, BsThreeDotsVertical, BsEmojiSmile, BsPaperclip } from 'react-icons/bs';
import { FaUser } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { MdOutlineAnalytics } from 'react-icons/md';
import axios from 'axios';

function Chatbot() {
    const [messages, setMessages] = useState([
        { text: "Hello! I'm your Cricket Analysis Assistant. How can I help you today?", sender: 'bot' },
        { text: "I can provide insights on player statistics, match analysis, tournament data, and predictive analytics for upcoming matches.", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    // Add overflow prevention
    useEffect(() => {
        document.body.style.height = '100vh';
        
        return () => {
            document.body.style.height = '';
            document.body.style.overflow = '';
        };
    }, []);

    const handleSend = async () => {
        if (input.trim() === '') return;
        
        // Add user message
        setMessages(prev => [...prev, { text: input, sender: 'user' }]);
        const userQuery = input;
        setInput('');
        
        // Show typing indicator
        setIsTyping(true);
        
        try {
            // Get response from API
            const response = await generateResponse(userQuery);
            
            // Add bot response
            setIsTyping(false);
            setMessages(prev => [...prev, { 
                text: response, 
                sender: 'bot' 
            }]);
        } catch (error) {
            console.error("Error getting response:", error);
            setIsTyping(false);
            setMessages(prev => [...prev, { 
                text: "Sorry, I encountered an error processing your request. Please try again.", 
                sender: 'bot' 
            }]);
        }
    };

    const generateResponse = async (query) => {
        try {
            // Make API call to backend
            const response = await axios.post('http://localhost:5000/sql', {
                query: query
            });
            
            return response.data.response || "I couldn't find information related to your query.";
        } catch (error) {
            console.error("API call error:", error);
            throw error;
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    // Suggested queries
    const suggestedQueries = [
        "Player statistics for Virat Kohli",
        "Analyze the last IPL final",
        "Predict the winner of the next match",
        "Tournament overview for World Cup"
    ];

    return (
        <div className="chatbot-container bg-gray-900 overflow-auto">
            {/* Header with professional styling */}
            <div className="bg-gray-800 p-4 border-b border-gray-700 flex items-center justify-between">
                <div className="flex items-center">
                    <div className="bg-blue-600 p-2 rounded-lg mr-3">
                        <MdOutlineAnalytics className="text-white" size={22} />
                    </div>
                    <div>
                        <h1 className="text-white text-lg font-semibold">Cricket Analysis Assistant</h1>
                        <p className="text-gray-400 text-xs">Powered by advanced analytics</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button className="p-2 rounded-full hover:bg-gray-700 text-gray-400">
                        <BsThreeDotsVertical size={18} />
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-700 text-gray-400">
                        <IoMdClose size={20} />
                    </button>
                </div>
            </div>
            
            {/* Chat messages container */}
            <div className="chatbot-messages bg-gray-900">
                <div className="max-w-4xl mx-auto p-4 space-y-4">
                    {/* Welcome card */}
                    <div className="bg-gray-800 rounded-lg p-4 mb-6 border-l-4 border-blue-500">
                        <h3 className="text-white font-medium mb-2">Welcome to Cricket Analysis</h3>
                        <p className="text-gray-300 text-sm mb-3">
                            Get insights on player performance, match analysis, and predictive forecasts.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {suggestedQueries.map((query, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => {
                                        setInput(query);
                                        setTimeout(() => handleSend(), 100);
                                    }}
                                    className="bg-gray-700 hover:bg-gray-600 text-blue-300 text-xs py-1 px-3 rounded-full transition-colors"
                                >
                                    {query}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    {/* Message bubbles */}
                    {messages.map((message, index) => (
                        <div 
                            key={index} 
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full ${
                                    message.sender === 'user' ? 'bg-blue-600 ml-2' : 'bg-gray-600 mr-2'
                                }`}>
                                    {message.sender === 'user' ? 
                                        <FaUser size={14} className="text-white" /> : 
                                        <BsRobot size={14} className="text-white" />
                                    }
                                </div>
                                <div className={`p-3 rounded-lg shadow-md ${
                                    message.sender === 'user' 
                                        ? 'bg-blue-600 text-white rounded-tr-none' 
                                        : 'bg-gray-700 text-white rounded-tl-none'
                                }`}>
                                    {message.text}
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {/* Typing indicator */}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="flex flex-row">
                                <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-gray-600 mr-2">
                                    <BsRobot size={14} className="text-white" />
                                </div>
                                <div className="p-3 rounded-lg bg-gray-700 text-white rounded-tl-none">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                </div>
            </div>
            
            {/* Input area with enhanced styling */}
            <div className="bg-gray-800 p-4 border-t border-gray-700">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center bg-gray-700 rounded-lg px-3 py-2">
                        <button className="p-2 text-gray-400 hover:text-gray-300">
                            <BsEmojiSmile size={18} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-300">
                            <BsPaperclip size={18} />
                        </button>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask about cricket stats, players, or predictions..."
                            className="flex-grow mx-2 bg-transparent text-white outline-none"
                        />
                        <button 
                            onClick={handleSend}
                            className={`p-2 rounded-full ${
                                input.trim() 
                                    ? 'bg-blue-600 hover:bg-blue-700' 
                                    : 'bg-gray-600 cursor-not-allowed'
                            } transition-colors`}
                            disabled={!input.trim()}
                        >
                            <BsSend size={16} className="text-white" />
                        </button>
                    </div>
                    <div className="text-xs text-gray-500 mt-2 text-center">
                        Powered by Cricket Analytics Engine • Data updated 2 hours ago
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chatbot;
