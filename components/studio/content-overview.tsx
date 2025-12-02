'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  BookmarkIcon,
  CopyIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  MessageSquareIcon,
} from 'lucide-react';
import { extractChatContext } from '@/lib/studio/utils/chat-context-extractor';
import type { UIMessage } from 'ai';

interface ContentOverviewProps {
  title: string;
  messages: UIMessage[];
  sourceCount: number;
  onSuggestionClick?: (suggestion: string) => void;
}

export function ContentOverview({
  title,
  messages,
  sourceCount,
  onSuggestionClick,
}: ContentOverviewProps) {
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  // Extract content from messages
  const extracted = extractChatContext(messages);
  const summaryText = extracted.text || 'No content available';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  const suggestedQuestions = [
    'How does Ubambano balance strict governance requirements with operational risks in a volatile informal settlement?',
    'What are the key components of the governance framework?',
    'How does the project ensure child safety and protection?',
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquareIcon className="h-5 w-5" />
          <h2 className="font-semibold">Chat</h2>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Title */}
          <div>
            <h1 className="text-2xl font-bold mb-2">{title}</h1>
            <p className="text-sm text-muted-foreground">{sourceCount} source{sourceCount !== 1 ? 's' : ''}</p>
          </div>

          {/* Summary Text */}
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">
              {summaryText}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-4 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBookmark}
              className={bookmarked ? 'bg-primary/10' : ''}
            >
              <BookmarkIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
            >
              <CopyIcon className="h-4 w-4" />
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            <Button variant="ghost" size="sm">
              <ThumbsUpIcon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <ThumbsDownIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Suggested Questions */}
      {suggestedQuestions.length > 0 && (
        <div className="border-t p-4">
          <div className="max-w-3xl mx-auto space-y-2">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => onSuggestionClick?.(question)}
                className="w-full text-left p-3 rounded-lg border hover:bg-muted transition-colors text-sm"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

