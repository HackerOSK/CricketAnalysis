import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Search, 
    ChevronDown, 
    ChevronRight, 
    MessageCircle, 
    Mail, 
    FileText, 
    Video, 
    Book, 
    HelpCircle,
    ArrowRight
} from 'lucide-react';

function Help() {
    const [activeCategory, setActiveCategory] = useState('getting-started');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedFaqs, setExpandedFaqs] = useState([]);

    // Toggle FAQ expansion
    const toggleFaq = (id) => {
        if (expandedFaqs.includes(id)) {
            setExpandedFaqs(expandedFaqs.filter(faqId => faqId !== id));
        } else {
            setExpandedFaqs([...expandedFaqs, id]);
        }
    };

    // Categories for the sidebar
    const categories = [
        { id: 'getting-started', name: 'Getting Started', icon: <Book size={18} /> },
        { id: 'features', name: 'Features & Tools', icon: <FileText size={18} /> },
        { id: 'account', name: 'Account Settings', icon: <HelpCircle size={18} /> },
        { id: 'api', name: 'API Documentation', icon: <FileText size={18} /> },
        { id: 'troubleshooting', name: 'Troubleshooting', icon: <HelpCircle size={18} /> },
    ];

    // FAQs data
    const faqs = [
        {
            id: 1,
            question: 'How do I interpret the match prediction results?',
            answer: 'Our match prediction system uses machine learning algorithms trained on historical data. The percentage indicates the probability of a team winning based on current match conditions, historical performance, and player statistics. A higher percentage indicates a stronger likelihood of winning, but cricket is unpredictable, so use these insights as guidance rather than certainty.',
            category: 'features'
        },
        {
            id: 2,
            question: 'Can I export analytics data to other formats?',
            answer: 'Yes, all analytics data can be exported in multiple formats including CSV, PDF, and JSON. To export data, navigate to any analytics page, look for the export icon in the top-right corner of the data visualization, and select your preferred format.',
            category: 'features'
        },
        {
            id: 3,
            question: 'How do I create a new account?',
            answer: 'To create a new account, click on the "Sign Up" button in the top-right corner of the homepage. Fill in your details including email, password, and user information. Verify your email address through the confirmation link we send, and you\'ll be ready to use all features of the Cricket Analytics platform.',
            category: 'getting-started'
        },
        {
            id: 4,
            question: 'What data sources do you use for cricket statistics?',
            answer: 'We aggregate data from multiple official cricket boards, tournament organizers, and verified statistical sources. Our data includes international matches, domestic leagues, and T20 tournaments worldwide. All data is verified and updated in real-time during matches.',
            category: 'getting-started'
        },
        {
            id: 5,
            question: 'How accurate are the predictive analytics?',
            answer: 'Our predictive models achieve approximately 70-75% accuracy for match outcomes, which is industry-leading for cricket predictions. The accuracy varies based on the format (Test, ODI, T20) and the amount of historical data available for the teams and players involved.',
            category: 'features'
        },
        {
            id: 6,
            question: 'How do I reset my password?',
            answer: 'To reset your password, click on the "Login" button, then select "Forgot Password". Enter your registered email address, and we\'ll send you a password reset link. Follow the instructions in the email to create a new password.',
            category: 'account'
        },
        {
            id: 7,
            question: 'How can I access the API for my own applications?',
            answer: 'API access is available on Premium and Enterprise plans. Once subscribed, navigate to Account Settings > API Access to generate your API keys. Our comprehensive API documentation provides endpoints for all cricket data, analytics, and predictions.',
            category: 'api'
        },
        {
            id: 8,
            question: 'Why are some features not loading properly?',
            answer: 'If you\'re experiencing loading issues, first check your internet connection. Clear your browser cache and cookies, or try using a different browser. If problems persist, it might be due to temporary server maintenance. Check our status page or contact support for real-time updates.',
            category: 'troubleshooting'
        },
    ];

    // Filter FAQs based on active category and search query
    const filteredFaqs = faqs.filter(faq => 
        (activeCategory === 'all' || faq.category === activeCategory) && 
        (searchQuery === '' || 
         faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
         faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="bg-gray-900 min-h-screen text-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 py-12">
                <div className="container mx-auto px-6">
                    <h1 className="text-3xl font-bold mb-4">Help & Support Center</h1>
                    <p className="text-blue-100 max-w-2xl">
                        Find answers to common questions, learn how to use our features, and get the support you need.
                    </p>
                    
                    {/* Search Bar */}
                    <div className="mt-8 max-w-2xl relative">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input 
                                type="text" 
                                placeholder="Search for help topics..." 
                                className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Main Content */}
            <div className="container mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="w-full md:w-64 shrink-0">
                        <div className="bg-gray-800 rounded-lg p-4">
                            <h3 className="font-semibold text-lg mb-4">Help Categories</h3>
                            <ul className="space-y-1">
                                <li>
                                    <button 
                                        className={`w-full text-left px-3 py-2 rounded-md flex items-center ${activeCategory === 'all' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                                        onClick={() => setActiveCategory('all')}
                                    >
                                        <FileText size={18} className="mr-2" />
                                        All Topics
                                    </button>
                                </li>
                                {categories.map(category => (
                                    <li key={category.id}>
                                        <button 
                                            className={`w-full text-left px-3 py-2 rounded-md flex items-center ${activeCategory === category.id ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                                            onClick={() => setActiveCategory(category.id)}
                                        >
                                            {category.icon}
                                            <span className="ml-2">{category.name}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            
                            {/* Contact Support */}
                            <div className="mt-8 p-4 bg-gradient-to-r from-blue-900 to-indigo-800 rounded-lg">
                                <h4 className="font-semibold mb-2">Need more help?</h4>
                                <p className="text-sm text-blue-100 mb-4">Our support team is ready to assist you with any questions.</p>
                                <div className="space-y-2">
                                    <a href="#" className="flex items-center text-sm text-white hover:text-blue-200 transition-colors">
                                        <MessageCircle size={16} className="mr-2" />
                                        Live Chat
                                    </a>
                                    <a href="#" className="flex items-center text-sm text-white hover:text-blue-200 transition-colors">
                                        <Mail size={16} className="mr-2" />
                                        Email Support
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="bg-gray-800 rounded-lg p-6">
                            <h2 className="text-2xl font-bold mb-6">
                                {activeCategory === 'all' ? 'All Help Topics' : 
                                 categories.find(c => c.id === activeCategory)?.name || 'Help Topics'}
                            </h2>
                            
                            {/* FAQs */}
                            {filteredFaqs.length > 0 ? (
                                <div className="space-y-4">
                                    {filteredFaqs.map(faq => (
                                        <motion.div 
                                            key={faq.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                            className="border border-gray-700 rounded-lg overflow-hidden"
                                        >
                                            <button 
                                                className="w-full flex justify-between items-center p-4 text-left bg-gray-700 hover:bg-gray-600 transition-colors"
                                                onClick={() => toggleFaq(faq.id)}
                                            >
                                                <span className="font-medium">{faq.question}</span>
                                                {expandedFaqs.includes(faq.id) ? 
                                                    <ChevronDown size={20} /> : 
                                                    <ChevronRight size={20} />
                                                }
                                            </button>
                                            {expandedFaqs.includes(faq.id) && (
                                                <motion.div 
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    transition={{ duration: 0.3 }}
                                                    className="p-4 bg-gray-800 text-gray-300"
                                                >
                                                    <p>{faq.answer}</p>
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <HelpCircle size={48} className="mx-auto text-gray-600 mb-4" />
                                    <h3 className="text-xl font-semibold mb-2">No results found</h3>
                                    <p className="text-gray-400 mb-6">
                                        We couldn't find any help articles matching your criteria.
                                    </p>
                                    <button 
                                        onClick={() => {setSearchQuery(''); setActiveCategory('all');}}
                                        className="text-blue-400 hover:text-blue-300 flex items-center mx-auto"
                                    >
                                        View all help topics <ArrowRight size={16} className="ml-1" />
                                    </button>
                                </div>
                            )}
                        </div>
                        
                        {/* Video Tutorials */}
                        <div className="mt-8 bg-gray-800 rounded-lg p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">Video Tutorials</h3>
                                <a href="#" className="text-blue-400 hover:text-blue-300 text-sm flex items-center">
                                    View all <ChevronRight size={16} className="ml-1" />
                                </a>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    {
                                        title: "Getting Started with Cricket Analytics",
                                        duration: "5:32",
                                        thumbnail: "https://via.placeholder.com/300x180/1e293b/ffffff?text=Tutorial+1"
                                    },
                                    {
                                        title: "How to Use Predictive Analysis",
                                        duration: "8:15",
                                        thumbnail: "https://via.placeholder.com/300x180/1e293b/ffffff?text=Tutorial+2"
                                    },
                                    {
                                        title: "Advanced Player Statistics",
                                        duration: "6:47",
                                        thumbnail: "https://via.placeholder.com/300x180/1e293b/ffffff?text=Tutorial+3"
                                    }
                                ].map((video, index) => (
                                    <div key={index} className="bg-gray-700 rounded-lg overflow-hidden group">
                                        <div className="relative">
                                            <img src={video.thumbnail} alt={video.title} className="w-full h-40 object-cover" />
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                                                    <Video className="text-white" size={20} />
                                                </div>
                                            </div>
                                            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                                {video.duration}
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h4 className="font-medium mb-1">{video.title}</h4>
                                            <p className="text-gray-400 text-sm">Learn the basics of this feature</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Help;
