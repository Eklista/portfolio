import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User, Copy, Heart, ThumbsUp } from 'lucide-react';

const ChatMessage = ({ 
  message, 
  onCopy, 
  onReaction, 
  showReactions = true 
}) => {
  const isUser = message.type === 'user';
  const isSystem = message.type === 'system';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    onCopy && onCopy(message.id);
  };

  return (
    <motion.div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} group`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`flex items-start space-x-3 max-w-[85%] ${
        isUser ? 'flex-row-reverse space-x-reverse' : ''
      }`}>
        {/* Avatar */}
        {!isSystem && (
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            isUser 
              ? 'bg-accent-primary' 
              : 'bg-gradient-to-br from-purple-500 to-pink-500'
          }`}>
            {isUser ? (
              <User size={14} className="text-primary" />
            ) : (
              <Bot size={14} className="text-white" />
            )}
          </div>
        )}

        <div className="flex-1">
          {/* Message Bubble */}
          <div className={`relative rounded-2xl px-4 py-3 ${
            isSystem
              ? 'bg-accent-surface/20 border border-accent-primary/30 text-accent-light text-center'
              : isUser
              ? 'bg-accent-primary text-primary'
              : 'bg-primary border border-secondary text-secondary'
          }`}>
            {/* Message Content */}
            <div className="space-y-2">
              {message.content.split('\n').map((line, index) => (
                <p key={index} className="text-sm leading-relaxed">
                  {line}
                </p>
              ))}
            </div>

            {/* Message Actions */}
            {!isSystem && showReactions && (
              <div className={`flex items-center justify-between mt-2 pt-2 border-t ${
                isUser 
                  ? 'border-primary/20' 
                  : 'border-secondary/20'
              } opacity-0 group-hover:opacity-100 transition-opacity`}>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={copyToClipboard}
                    className={`p-1 rounded hover:bg-black/10 transition-colors ${
                      isUser ? 'text-primary/70 hover:text-primary' : 'text-muted hover:text-secondary'
                    }`}
                    title="Copiar mensaje"
                  >
                    <Copy size={12} />
                  </button>
                  
                  {!isUser && (
                    <>
                      <button
                        onClick={() => onReaction && onReaction(message.id, 'like')}
                        className="p-1 rounded hover:bg-black/10 transition-colors text-muted hover:text-green-400"
                        title="Me gusta"
                      >
                        <ThumbsUp size={12} />
                      </button>
                      <button
                        onClick={() => onReaction && onReaction(message.id, 'love')}
                        className="p-1 rounded hover:bg-black/10 transition-colors text-muted hover:text-red-400"
                        title="Me encanta"
                      >
                        <Heart size={12} />
                      </button>
                    </>
                  )}
                </div>

                {/* Timestamp */}
                <span className={`text-xs opacity-70 ${
                  isUser ? 'text-primary/70' : 'text-muted'
                }`}>
                  {message.timestamp.toLocaleTimeString('es-GT', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            )}
          </div>

          {/* System message styling */}
          {isSystem && (
            <div className="text-center mt-1">
              <span className="text-xs text-muted">
                {message.timestamp.toLocaleTimeString('es-GT', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
          )}

          {/* Reactions Display */}
          {message.reactions && message.reactions.length > 0 && (
            <div className="flex items-center space-x-1 mt-2">
              {message.reactions.map((reaction, index) => (
                <span 
                  key={index}
                  className="text-xs bg-surface px-2 py-1 rounded-full border border-primary"
                >
                  {reaction.type === 'like' ? '👍' : '❤️'} {reaction.count}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;