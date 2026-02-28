import { useState } from 'react';
import { Brain, Check, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

type Question = {
  id: number;
  question: string;
  options: string[];
  type: 'memory' | 'focus' | 'reading' | 'visual';
};

const assessmentQuestions: Question[] = [
  {
    id: 1,
    type: 'memory',
    question: 'How well can you remember a sequence of 5 items after seeing them once?',
    options: ['Very difficult', 'Somewhat difficult', 'Moderate', 'Easy', 'Very easy'],
  },
  {
    id: 2,
    type: 'focus',
    question: 'How long can you focus on a single task without getting distracted?',
    options: ['Less than 5 minutes', '5-10 minutes', '10-20 minutes', '20-30 minutes', 'More than 30 minutes'],
  },
  {
    id: 3,
    type: 'reading',
    question: 'When reading a paragraph, how often do you need to re-read to understand?',
    options: ['Always', 'Often', 'Sometimes', 'Rarely', 'Never'],
  },
  {
    id: 4,
    type: 'visual',
    question: 'How easy is it to identify patterns or differences in images?',
    options: ['Very difficult', 'Difficult', 'Moderate', 'Easy', 'Very easy'],
  },
  {
    id: 5,
    type: 'memory',
    question: 'Can you recall details from a story you heard yesterday?',
    options: ['Not at all', 'A few details', 'Some details', 'Most details', 'All details'],
  },
  {
    id: 6,
    type: 'focus',
    question: 'How well can you filter out background noise while concentrating?',
    options: ['Very difficult', 'Difficult', 'Moderate', 'Easy', 'Very easy'],
  },
];

export function AssessmentPage() {
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [completed, setCompleted] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = async () => {
    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      await completeAssessment();
    }
  };

  const completeAssessment = async () => {
    setLoading(true);
    const totalScore = answers.reduce((sum, answer) => sum + answer, 0);
    const maxScore = assessmentQuestions.length * 4;
    const percentage = (totalScore / maxScore) * 100;

    let supportLevel = 'mild';
    let recommendations = [];

    if (percentage < 40) {
      supportLevel = 'high';
      recommendations = [
        'One-on-one tutoring sessions recommended',
        'Consider structured learning environment',
        'Break tasks into smaller, manageable steps',
        'Use visual aids and hands-on learning',
      ];
    } else if (percentage < 65) {
      supportLevel = 'moderate';
      recommendations = [
        'Regular practice with interactive games',
        'Establish consistent daily routine',
        'Use multisensory learning techniques',
        'Encourage breaks during learning sessions',
      ];
    } else {
      supportLevel = 'mild';
      recommendations = [
        'Continue with engaging activities',
        'Gradually increase task complexity',
        'Explore advanced learning materials',
        'Foster independence in learning',
      ];
    }

    const assessmentData = {
      child_id: user?.id,
      assessment_type: 'comprehensive',
      questions: assessmentQuestions.map((q, i) => ({
        question: q.question,
        answer: q.options[answers[i]],
      })),
      score: Math.round(percentage),
      support_level: supportLevel,
      recommendations,
    };

    try {
      const { error } = await supabase
        .from('assessments')
        .insert([assessmentData]);

      if (error) throw error;

      setResults({
        score: Math.round(percentage),
        supportLevel,
        recommendations,
      });
      setCompleted(true);
    } catch (error) {
      console.error('Error saving assessment:', error);
    } finally {
      setLoading(false);
    }
  };

  if (completed && results) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="text-emerald-600" size={40} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Assessment Complete!
              </h2>
              <p className="text-gray-600">
                Here are your personalized results and recommendations
              </p>
            </div>

            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 mb-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-emerald-600 mb-2">
                  {results.score}%
                </div>
                <div className="text-lg text-gray-700">
                  Support Level:{' '}
                  <span className="font-semibold capitalize">{results.supportLevel}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Personalized Recommendations
              </h3>
              <div className="space-y-3">
                {results.recommendations.map((rec: string, index: number) => (
                  <div
                    key={index}
                    className="flex gap-3 items-start bg-white border border-emerald-100 rounded-lg p-4"
                  >
                    <div className="bg-emerald-100 rounded-full p-1 mt-0.5">
                      <Check className="text-emerald-600" size={16} />
                    </div>
                    <p className="text-gray-700">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
              >
                View Dashboard
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / assessmentQuestions.length) * 100;
  const question = assessmentQuestions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Question {currentQuestion + 1} of {assessmentQuestions.length}
            </span>
            <span className="text-sm font-medium text-emerald-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-emerald-600 mb-4">
              <Brain size={20} />
              <span className="text-sm font-medium uppercase tracking-wide">
                {question.type} Assessment
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
              {question.question}
            </h2>
          </div>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  answers[currentQuestion] === index
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      answers[currentQuestion] === index
                        ? 'border-emerald-500 bg-emerald-500'
                        : 'border-gray-300'
                    }`}
                  >
                    {answers[currentQuestion] === index && (
                      <Check className="text-white" size={16} />
                    )}
                  </div>
                  <span className="text-gray-900 font-medium">{option}</span>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={answers[currentQuestion] === undefined || loading}
            className="w-full mt-8 bg-emerald-600 text-white py-4 rounded-xl font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading
              ? 'Saving...'
              : currentQuestion < assessmentQuestions.length - 1
              ? 'Next Question'
              : 'Complete Assessment'}
            {!loading && <ArrowRight size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}
