'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface ChatLimitContextType {
  remainingChats: number;
  isLimitReached: boolean;
  incrementChatCount: () => void;
  resetChatCount: () => void;
}

const ChatLimitContext = createContext<ChatLimitContextType | undefined>(undefined);

const CHAT_LIMIT = 20;
const CHAT_COUNT_KEY = 'chatCount';

export function ChatLimitProvider({ children }: { children: React.ReactNode }) {
  const session = useSession();
  const [chatCount, setChatCount] = useState<number>(0);

  useEffect(() => {
    // Only proceed if session status is not loading
    if (session.status === 'loading') return;

    if (!session.data) {
      // Load chat count from localStorage for non-authenticated users
      const storedCount = localStorage.getItem(CHAT_COUNT_KEY);
      setChatCount(storedCount ? parseInt(storedCount, 10) : 0);
    } else {
      // Reset chat count for authenticated users
      setChatCount(0);
      localStorage.removeItem(CHAT_COUNT_KEY);
    }
  }, [session.status, session.data]);

  const incrementChatCount = () => {
    if (!session.data) {
      const newCount = chatCount + 1;
      setChatCount(newCount);
      localStorage.setItem(CHAT_COUNT_KEY, newCount.toString());
    }
  };

  const resetChatCount = () => {
    setChatCount(0);
    localStorage.removeItem(CHAT_COUNT_KEY);
  };

  const value = {
    remainingChats: CHAT_LIMIT - chatCount,
    isLimitReached: !session.data && chatCount >= CHAT_LIMIT,
    incrementChatCount,
    resetChatCount,
  };

  return (
    <ChatLimitContext.Provider value={value}>
      {children}
    </ChatLimitContext.Provider>
  );
}

export function useChatLimit() {
  const context = useContext(ChatLimitContext);
  if (context === undefined) {
    throw new Error('useChatLimit must be used within a ChatLimitProvider');
  }
  return context;
} 