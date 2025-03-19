'use client';

import { useRouter } from 'next/navigation';
import { useChatLimit } from '../contexts/ChatLimitContext';

export default function ChatLimitWarning() {
  const { remainingChats, isLimitReached } = useChatLimit();
  const router = useRouter();

  const handleCreateAccount = () => {
    router.push('/auth/signin');
  };

  if (isLimitReached) {
    return (
      <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Chat Limit Reached
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          You've reached the limit of 20 free chats. Create an account to continue using
          our immigration assistance service with unlimited access.
        </p>
        <div className="space-y-4">
          <button
            onClick={handleCreateAccount}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            Create Account
          </button>
        </div>
      </div>
    );
  }

  if (remainingChats <= 5) {
    return (
      <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
        <p className="text-yellow-800 dark:text-yellow-200">
          You have {remainingChats} free {remainingChats === 1 ? 'chat' : 'chats'} remaining.{' '}
          <button
            onClick={handleCreateAccount}
            className="text-yellow-600 dark:text-yellow-400 underline hover:text-yellow-800 dark:hover:text-yellow-300"
          >
            Create an account
          </button>{' '}
          for unlimited access.
        </p>
      </div>
    );
  }

  return null;
} 