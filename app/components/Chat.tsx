'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Menu, Mic, Send, Settings, Grid, User, FileText, UserCircle, Folder, Users, Briefcase, GraduationCap, Home, Plane, Scale, Bell, Shield, History, HelpCircle, ChevronDown, ChevronRight, MessageSquare, Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface ApiResponse {
  role: 'assistant';
  content: string;
}

interface Chat {
  id: string;
  title: string;
  messages: { role: 'user' | 'assistant' | 'system', content: string }[];
  createdAt: Date;
  status?: string;
  category?: string;
}

export default function Chat() {
  const [message, setMessage] = useState('');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [expandedCategories, setExpandedCategories] = useState({
    main: true,
    resources: false,
    settings: false
  });
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant' | 'system', content: string }[]>([
    {
      role: 'system',
      content: `You are an Immigration Agent AI assistant. Your role is to conduct structured interviews and provide guidance on immigration processes.

Key Responsibilities:
1. Start by asking about the user's current immigration status or needs
2. Ask relevant follow-up questions based on their responses
3. Provide accurate information about visa requirements, documentation, and processes
4. Guide users through application procedures step by step
5. Offer resources and recommendations for their specific situation

Interview Structure:
1. Initial Assessment:
   - Current immigration status
   - Country of origin
   - Purpose of immigration (work, study, family, etc.)
   - Timeline and urgency

2. Documentation Review:
   - Required documents for their case
   - Missing documentation
   - Validity and expiration dates

3. Process Guidance:
   - Application procedures
   - Timeline expectations
   - Fees and costs
   - Next steps

Communication Guidelines:
1. Ask one question at a time
2. Use clear, simple language
3. Provide specific document requirements
4. Include relevant deadlines and timelines
5. Offer alternative options when available

Important: Always start new conversations by asking about the user's current immigration status and needs. Maintain a professional yet approachable tone.`
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Load chats from localStorage on component mount
  useEffect(() => {
    const savedChats = localStorage.getItem('chats');
    if (savedChats) {
      const parsedChats = JSON.parse(savedChats).map((chat: Chat) => ({
        ...chat,
        createdAt: new Date(chat.createdAt)
      }));
      setChats(parsedChats);
    }
  }, []);

  // Save chats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chats', JSON.stringify(chats));
  }, [chats]);

  const initialAssessmentQuestions = [
    "What is your current immigration status?",
    "Which country are you from?",
    "What is your primary purpose for immigration (work, study, family, etc.)?",
    "What is your target timeline for this process?"
  ];

  const handleNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'New Immigration Assessment',
      messages: [messages[0]], // Include the system message
      createdAt: new Date(),
      status: 'initial_assessment'
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChat(newChat);
    setMessages([
      messages[0],
      {
        role: 'assistant',
        content: `Welcome to your immigration assessment. Let's start by understanding your situation.

${initialAssessmentQuestions[0]}`
      }
    ]);
  };

  const switchToChat = (chat: Chat) => {
    setActiveChat(chat);
    setMessages(chat.messages);
  };

  const updateChatTitle = (chatId: string, firstUserMessage: string) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          title: firstUserMessage.slice(0, 30) + (firstUserMessage.length > 30 ? '...' : '')
        };
      }
      return chat;
    }));
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { role: 'user' as const, content: message };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setMessage('');
    setIsLoading(true);

    // Create a new chat if there isn't one active
    if (!activeChat) {
      const newChat: Chat = {
        id: Date.now().toString(),
        title: message.slice(0, 30) + (message.length > 30 ? '...' : ''),
        messages: [messages[0], userMessage],
        createdAt: new Date(),
        status: 'initial_assessment'
      };
      setChats(prev => [newChat, ...prev]);
      setActiveChat(newChat);
    } else {
      // Update existing chat
      setChats(prev => prev.map(chat => {
        if (chat.id === activeChat.id) {
          return {
            ...chat,
            messages: updatedMessages,
            title: chat.title === 'New Immigration Assessment' ? message.slice(0, 30) + (message.length > 30 ? '...' : '') : chat.title
          };
        }
        return chat;
      }));
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json() as ApiResponse;
      const newMessages = [...updatedMessages, { 
        role: data.role, 
        content: data.content 
      }];
      setMessages(newMessages);

      // Update chat with new messages
      setChats(prev => prev.map(chat => {
        if (chat.id === (activeChat?.id ?? '')) {
          return {
            ...chat,
            messages: newMessages
          };
        }
        return chat;
      }));

    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { 
        role: 'assistant' as const, 
        content: 'I apologize, but I encountered an error. Please try again.' 
      };
      setMessages(prev => [...prev, errorMessage]);
      
      if (activeChat) {
        setChats(prev => prev.map(chat => {
          if (chat.id === activeChat.id) {
            return {
              ...chat,
              messages: [...chat.messages, errorMessage]
            };
          }
          return chat;
        }));
      }
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = (action: string) => {
    setMessage(action);
    handleSendMessage();
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category as keyof typeof prev]
    }));
  };

  const menuCategories = {
    main: {
      title: 'Main',
      items: [
        { id: 'chat', text: 'Chat', icon: <MessageSquare size={20} /> },
        { id: 'resources', text: 'Resources', icon: <FileText size={20} /> },
        { id: 'profile', text: 'Profile', icon: <UserCircle size={20} /> },
      ]
    },
    resources: {
      title: 'Quick Access',
      items: [
        { id: 'visas', text: 'Visa Applications', icon: <Folder size={20} /> },
        { id: 'citizenship', text: 'Citizenship', icon: <Users size={20} /> },
        { id: 'work', text: 'Work Permits', icon: <Briefcase size={20} /> },
      ]
    },
    settings: {
      title: 'Settings & Support',
      items: [
        { id: 'settings', text: 'Settings', icon: <Settings size={20} /> },
        { id: 'help', text: 'Help & Support', icon: <HelpCircle size={20} /> },
      ]
    }
  };

  const quickActions = [
    { text: 'Tell me what you can do', key: 'capabilities' },
    { text: 'Explain something', key: 'explain' },
    { text: 'Give me study tips', key: 'study' },
    { text: 'Inspire me', key: 'inspire' },
  ];

  const resourceCategories = [
    {
      title: 'Visa Applications',
      description: 'Information about different types of visas and application processes',
      icon: <Folder className="w-6 h-6" />,
      color: 'bg-blue-500',
    },
    {
      title: 'Citizenship',
      description: 'Guide to citizenship application and requirements',
      icon: <Users className="w-6 h-6" />,
      color: 'bg-green-500',
    },
    {
      title: 'Work Permits',
      description: 'Work permit applications and employment-based immigration',
      icon: <Briefcase className="w-6 h-6" />,
      color: 'bg-purple-500',
    },
    {
      title: 'Family Sponsorship',
      description: 'Information about sponsoring family members',
      icon: <Users className="w-6 h-6" />,
      color: 'bg-pink-500',
    },
    {
      title: 'Student Visas',
      description: 'Student visa requirements and application process',
      icon: <GraduationCap className="w-6 h-6" />,
      color: 'bg-yellow-500',
    },
    {
      title: 'Permanent Residency',
      description: 'Permanent residency application and requirements',
      icon: <Home className="w-6 h-6" />,
      color: 'bg-red-500',
    },
    {
      title: 'Travel Documents',
      description: 'Travel document requirements and applications',
      icon: <Plane className="w-6 h-6" />,
      color: 'bg-indigo-500',
    },
    {
      title: 'Legal Assistance',
      description: 'Legal resources and immigration lawyer information',
      icon: <Scale className="w-6 h-6" />,
      color: 'bg-orange-500',
    },
  ];

  const profileSections = [
    {
      title: 'Personal Information',
      icon: <User className="w-6 h-6" />,
      items: [
        'Name and Contact Information',
        'Immigration Status',
        'Document Numbers',
        'Address History',
      ],
    },
    {
      title: 'Preferences',
      icon: <Settings className="w-6 h-6" />,
      items: [
        'Language Settings',
        'Notification Preferences',
        'Theme Settings',
        'Accessibility Options',
      ],
    },
    {
      title: 'Notifications',
      icon: <Bell className="w-6 h-6" />,
      items: [
        'Application Updates',
        'Document Reminders',
        'Important Deadlines',
        'Status Changes',
      ],
    },
    {
      title: 'Privacy & Security',
      icon: <Shield className="w-6 h-6" />,
      items: [
        'Privacy Settings',
        'Data Management',
        'Security Preferences',
        'Two-Factor Authentication',
      ],
    },
    {
      title: 'History',
      icon: <History className="w-6 h-6" />,
      items: [
        'Chat History',
        'Document History',
        'Application History',
        'Search History',
      ],
    },
    {
      title: 'Help & Support',
      icon: <HelpCircle className="w-6 h-6" />,
      items: [
        'FAQ',
        'Contact Support',
        'User Guide',
        'Feedback',
      ],
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-auto">
              {messages.length === 1 ? (
                <>
                  <h1 className="text-4xl font-bold mb-4">
                    <span className="gradient-text">Hello</span>
                  </h1>
                  <p className="text-gray-400 mb-8">How can I assist you with immigration today?</p>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {quickActions.map((action) => (
                      <button
                        key={action.key}
                        className="action-chip"
                        onClick={() => handleQuickAction(action.text)}
                      >
                        {action.text}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  {messages.filter(msg => msg.role !== 'system').map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-[#303134] text-gray-200'
                        }`}
                      >
                        <div className="whitespace-pre-line">{message.content}</div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start mb-4">
                      <div className="bg-[#303134] rounded-lg p-3 text-gray-200">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              )}
            </div>
          </div>
        );
      case 'resources':
        return (
          <>
            <h1 className="text-3xl font-bold mb-2">Immigration Resources</h1>
            <p className="text-gray-400 mb-8">Comprehensive guides and information for your immigration journey</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resourceCategories.map((category) => (
                <div
                  key={category.title}
                  className="bg-[#303134] rounded-xl p-6 hover:bg-[#404144] transition-colors cursor-pointer"
                >
                  <div className={`${category.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-white`}>
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                  <p className="text-gray-400">{category.description}</p>
                </div>
              ))}
            </div>
          </>
        );
      case 'profile':
        return (
          <>
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
                <User size={40} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">User Profile</h1>
                <p className="text-gray-400">Manage your account settings and preferences</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profileSections.map((section) => (
                <div
                  key={section.title}
                  className="bg-[#303134] rounded-xl p-6 hover:bg-[#404144] transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-blue-500 w-10 h-10 rounded-lg flex items-center justify-center">
                      {section.icon}
                    </div>
                    <h2 className="text-xl font-semibold">{section.title}</h2>
                  </div>
                  <ul className="space-y-2">
                    {section.items.map((item) => (
                      <li key={item} className="text-gray-400 hover:text-gray-200">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed left-0 top-0 h-full bg-[#202124] transform transition-all duration-300 ease-in-out z-50 
          ${isSidebarOpen ? 'w-[320px] translate-x-0' : 'w-0 -translate-x-full'}`}
      >
        <div className="h-full flex flex-col overflow-hidden">
          {/* Sidebar Header */}
          <div className="p-4 flex items-center justify-between border-b border-gray-800">
            <h2 className="text-xl font-semibold text-gray-200">Immigration Helper AI</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 hover:bg-[#303134] rounded-lg text-gray-300"
            >
              <Menu size={24} />
            </button>
          </div>

          {/* New Chat Button */}
          <div className="p-4">
            <button 
              onClick={handleNewChat}
              className="flex items-center space-x-2 w-full p-3 text-gray-300 hover:bg-[#303134] rounded-lg border border-gray-700"
            >
              <Plus size={20} />
              <span>New Immigration Assessment</span>
            </button>
          </div>

          {/* Menu Categories */}
          <div className="flex-1 overflow-y-auto px-2">
            {/* Recent Chats Section */}
            <div className="mb-4 px-2">
              <div className="text-sm font-medium text-gray-400 mb-2">Recent</div>
              <nav className="space-y-1">
                {chats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => switchToChat(chat)}
                    className={`flex items-center space-x-3 w-full p-2 rounded-lg ${
                      activeChat?.id === chat.id
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-300 hover:bg-[#303134]'
                    }`}
                  >
                    <MessageSquare size={18} />
                    <span className="truncate">{chat.title}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Categories */}
            {Object.entries(menuCategories).map(([key, category]) => (
              <div key={key} className="mb-4">
                <button
                  onClick={() => toggleCategory(key)}
                  className="flex items-center justify-between w-full p-2 text-gray-300 hover:bg-[#303134] rounded-lg"
                >
                  <span className="font-medium">{category.title}</span>
                  {expandedCategories[key as keyof typeof expandedCategories] ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>
                {expandedCategories[key as keyof typeof expandedCategories] && (
                  <div className="mt-1 ml-2 space-y-1">
                    {category.items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`flex items-center space-x-3 w-full p-2 rounded-lg ${
                          activeTab === item.id
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-300 hover:bg-[#303134]'
                        }`}
                      >
                        {item.icon}
                        <span>{item.text}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom Menu */}
          <div className="p-4 border-t border-gray-800 space-y-2">
            <button className="flex items-center space-x-3 w-full p-2 text-gray-300 hover:bg-[#303134] rounded-lg">
              <Settings size={20} />
              <span>Settings</span>
            </button>
            <button className="flex items-center space-x-3 w-full p-2 text-gray-300 hover:bg-[#303134] rounded-lg">
              <HelpCircle size={20} />
              <span>Help</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-[#202124] border-b border-gray-800">
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-[#303134] rounded-lg text-gray-300"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-gray-200">Immigration Helper AI</span>
            <span className="text-sm text-gray-400">2.0</span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-[#303134] rounded-lg text-gray-300">
              <Grid size={20} />
            </button>
            <button className="p-2 hover:bg-[#303134] rounded-lg text-gray-300">
              <User size={20} />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className={`flex-1 overflow-auto p-4 transition-all duration-300 ${isSidebarOpen ? 'ml-[320px]' : 'ml-0'}`}>
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>

        {/* Input Area (only shown in chat tab) */}
        {activeTab === 'chat' && (
          <div className={`p-4 border-t border-gray-800 bg-[#202124] transition-all duration-300 ${isSidebarOpen ? 'ml-[320px]' : 'ml-0'}`}>
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Message Immigration Helper AI..."
                  className="chat-input w-full py-4 px-6 pr-24 text-gray-200"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                  <button className="p-2 hover:bg-[#303134] rounded-lg text-gray-300">
                    <Mic size={20} />
                  </button>
                  <button 
                    className={`p-2 hover:bg-[#303134] rounded-lg ${
                      message.trim() ? 'text-blue-500' : 'text-gray-500'
                    }`}
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 