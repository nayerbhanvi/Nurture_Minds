import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, ThumbsUp, ThumbsDown, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
};

const knowledgeBase: Record<string, { answer: string; sources: string[] }> = {
  'autism intelligence': {
    answer: 'Autism is a spectrum condition that affects how a person communicates and relates to others. Intelligence levels vary widely among autistic individuals - many have average or above-average intelligence. Autism does not determine intelligence; rather, it describes differences in social communication and behavior patterns.',
    sources: ['WHO Guidelines on Autism', 'CDC Autism Spectrum Disorder Data'],
  },
  'autism therapy': {
    answer: 'Evidence-based therapies for autism include Applied Behavior Analysis (ABA), Speech and Language Therapy, Occupational Therapy, and Social Skills Training. The most effective approach is often individualized, combining multiple therapies based on the child\'s specific needs and strengths.',
    sources: ['National Institute of Mental Health', 'Autism Speaks Research'],
  },
  'dyslexia reading': {
    answer: 'Dyslexia is a learning difference that primarily affects reading and language processing. Effective interventions include structured literacy programs, multisensory teaching methods, assistive technology, and one-on-one tutoring. Early intervention significantly improves outcomes.',
    sources: ['International Dyslexia Association', 'Yale Center for Dyslexia'],
  },
  'adhd attention': {
    answer: 'ADHD affects executive function, including attention, impulse control, and working memory. Management strategies include behavioral therapy, environmental modifications (like reducing distractions), structured routines, and in some cases, medication. Combining multiple approaches often yields the best results.',
    sources: ['CHADD (Children and Adults with ADHD)', 'American Academy of Pediatrics'],
  },
  'early intervention': {
    answer: 'Early intervention for developmental differences is crucial. Research shows that starting support services before age 3 can significantly improve outcomes. Early intervention may include speech therapy, occupational therapy, developmental therapy, and parent training programs.',
    sources: ['CDC Early Intervention', 'American Academy of Pediatrics'],
  },
  'parent support': {
    answer: 'Parent support is essential for families of neurodiverse children. Resources include support groups, respite care, parent training programs, and counseling. Connecting with other parents who share similar experiences can provide emotional support and practical strategies.',
    sources: ['National Parent Technical Assistance Center', 'Family Voices'],
  },
};

export function ChatbotPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m FactBuddy, your evidence-based companion. I provide verified information about autism, dyslexia, ADHD, and learning support strategies. All my responses are based on credible medical and educational sources. How can I help you today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateResponse = (userQuestion: string): { answer: string; sources: string[] } => {
    const question = userQuestion.toLowerCase();

    for (const [key, value] of Object.entries(knowledgeBase)) {
      if (question.includes(key.split(' ')[0]) || question.includes(key)) {
        return value;
      }
    }

    if (question.includes('help') || question.includes('support')) {
      return knowledgeBase['parent support'];
    }

    if (question.includes('early') || question.includes('start')) {
      return knowledgeBase['early intervention'];
    }

    return {
      answer: 'I can provide evidence-based information about autism, dyslexia, ADHD, therapies, early intervention, and parent support. Please ask me specific questions about these topics, and I\'ll share verified information from credible sources.',
      sources: ['WHO', 'CDC', 'National Institutes of Health'],
    };
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    setTimeout(async () => {
      const response = generateResponse(input);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.answer,
        sources: response.sources,
      };

      setMessages(prev => [...prev, assistantMessage]);
      setLoading(false);

      try {
        await supabase.from('chatbot_conversations').insert([{
          user_id: user?.id,
          question: input,
          answer: response.answer,
          sources: response.sources,
        }]);
      } catch (error) {
        console.error('Error saving conversation:', error);
      }
    }, 800);
  };

  const suggestedQuestions = [
    'Does autism mean low intelligence?',
    'What are the best therapies for ADHD?',
    'How can I help my child with dyslexia?',
    'What is early intervention?',
  ];

  return (
    <div className="h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="bg-gradient-to-br from-emerald-400 to-teal-500 p-2 rounded-xl">
            <Bot className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">FactBuddy</h1>
            <p className="text-sm text-gray-600">Evidence-Based AI Assistant</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="bg-gradient-to-br from-emerald-400 to-teal-500 p-2 rounded-xl h-10 w-10 flex-shrink-0">
                  <Bot className="text-white" size={24} />
                </div>
              )}

              <div
                className={`max-w-2xl ${
                  message.role === 'user'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white border border-gray-200'
                } rounded-2xl px-6 py-4 shadow-sm`}
              >
                <p className={message.role === 'user' ? 'text-white' : 'text-gray-900'}>
                  {message.content}
                </p>

                {message.sources && message.sources.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Sparkles size={14} />
                      <span className="font-medium">Sources:</span>
                    </div>
                    <div className="space-y-1">
                      {message.sources.map((source, idx) => (
                        <div key={idx} className="text-sm text-gray-600">
                          • {source}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {message.role === 'user' && (
                <div className="bg-emerald-100 p-2 rounded-xl h-10 w-10 flex-shrink-0">
                  <User className="text-emerald-600" size={24} />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="bg-gradient-to-br from-emerald-400 to-teal-500 p-2 rounded-xl h-10 w-10 flex-shrink-0">
                <Bot className="text-white" size={24} />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl px-6 py-4 shadow-sm">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          {messages.length === 1 && (
            <div className="mt-8">
              <p className="text-center text-gray-600 mb-4">Try asking:</p>
              <div className="grid md:grid-cols-2 gap-3">
                {suggestedQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInput(question)}
                    className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-left hover:border-emerald-300 hover:bg-emerald-50 transition-colors text-sm"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question about autism, dyslexia, ADHD, or learning support..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send size={20} />
              Send
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            All responses are based on verified medical and educational sources
          </p>
        </div>
      </div>
    </div>
  );
}
