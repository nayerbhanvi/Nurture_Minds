import { useState } from 'react';
import { Brain, Target, Clock, Star, ArrowRight, Trophy } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

type GameType = 'memory' | 'focus' | 'pattern' | 'language';

type Game = {
  id: GameType;
  name: string;
  description: string;
  icon: any;
  color: string;
};

const games: Game[] = [
  {
    id: 'memory',
    name: 'Memory Match',
    description: 'Match pairs of cards to improve memory and recognition',
    icon: Brain,
    color: 'emerald',
  },
  {
    id: 'focus',
    name: 'Focus Challenge',
    description: 'Click the target as it appears to enhance concentration',
    icon: Target,
    color: 'blue',
  },
  {
    id: 'pattern',
    name: 'Pattern Recognition',
    description: 'Identify patterns and sequences to boost cognitive skills',
    icon: Star,
    color: 'purple',
  },
  {
    id: 'language',
    name: 'Word Builder',
    description: 'Create words from letters to develop language abilities',
    icon: Trophy,
    color: 'orange',
  },
];

export function GamesPage() {
  const { user } = useAuth();
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState(1);

  const startGame = () => {
    setGameStarted(true);
  };

  if (selectedGame && gameStarted) {
    return <GamePlay game={selectedGame} difficulty={difficulty} onExit={() => {
      setSelectedGame(null);
      setGameStarted(false);
    }} />;
  }

  if (selectedGame) {
    const game = games.find(g => g.id === selectedGame)!;
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="max-w-2xl mx-auto px-4">
          <button
            onClick={() => setSelectedGame(null)}
            className="text-gray-600 hover:text-gray-900 mb-6"
          >
            ← Back to Games
          </button>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className={`bg-${game.color}-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-4`}>
              <game.icon className={`text-${game.color}-600`} size={32} />
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-3">{game.name}</h2>
            <p className="text-gray-600 mb-6">{game.description}</p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Difficulty
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`py-3 rounded-lg font-semibold transition-colors ${
                      difficulty === level
                        ? `bg-${game.color}-600 text-white`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Level {level}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={startGame}
              className={`w-full bg-${game.color}-600 text-white py-4 rounded-xl font-semibold hover:bg-${game.color}-700 transition-colors flex items-center justify-center gap-2`}
            >
              Start Game
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Cognitive Development Games
          </h1>
          <p className="text-xl text-gray-600">
            Fun, interactive activities designed to enhance learning and cognitive skills
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {games.map((game) => {
            const colorClasses = {
              emerald: 'bg-emerald-100 text-emerald-600 hover:bg-emerald-50',
              blue: 'bg-blue-100 text-blue-600 hover:bg-blue-50',
              purple: 'bg-purple-100 text-purple-600 hover:bg-purple-50',
              orange: 'bg-orange-100 text-orange-600 hover:bg-orange-50',
            };

            return (
              <div
                key={game.id}
                onClick={() => setSelectedGame(game.id)}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100 p-6"
              >
                <div className={`${colorClasses[game.color as keyof typeof colorClasses].split(' ')[0]} w-14 h-14 rounded-xl flex items-center justify-center mb-4`}>
                  <game.icon className={colorClasses[game.color as keyof typeof colorClasses].split(' ')[1]} size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{game.name}</h3>
                <p className="text-gray-600 mb-4">{game.description}</p>
                <div className="flex items-center text-sm font-medium text-gray-500">
                  Play Now
                  <ArrowRight size={16} className="ml-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function GamePlay({ game, difficulty, onExit }: { game: GameType; difficulty: number; onExit: () => void }) {
  const { user } = useAuth();
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [clicks, setClicks] = useState(0);

  const endGame = async () => {
    const finalScore = Math.round((clicks / (60 - timeLeft + 1)) * 100);

    try {
      await supabase.from('game_sessions').insert([{
        child_id: user?.id,
        game_type: game,
        difficulty_level: difficulty,
        score: Math.min(100, finalScore),
        time_spent_seconds: 60 - timeLeft,
        completed: true,
        performance_data: { clicks, timeLeft },
      }]);
    } catch (error) {
      console.error('Error saving game session:', error);
    }

    setGameCompleted(true);
  };

  if (gameCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center py-12">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="text-emerald-600" size={40} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Great Job!</h2>
            <p className="text-gray-600 mb-6">You completed the game</p>

            <div className="bg-emerald-50 rounded-xl p-6 mb-6">
              <div className="text-4xl font-bold text-emerald-600 mb-2">
                {score} Points
              </div>
              <div className="text-sm text-gray-600">Total Score</div>
            </div>

            <button
              onClick={onExit}
              className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
            >
              Back to Games
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onExit}
            className="px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            Exit Game
          </button>
          <div className="flex gap-4">
            <div className="bg-white px-6 py-3 rounded-lg shadow-sm">
              <div className="flex items-center gap-2">
                <Clock size={20} className="text-blue-600" />
                <span className="font-bold text-gray-900">{timeLeft}s</span>
              </div>
            </div>
            <div className="bg-white px-6 py-3 rounded-lg shadow-sm">
              <div className="flex items-center gap-2">
                <Star size={20} className="text-yellow-600" />
                <span className="font-bold text-gray-900">{score}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-12 min-h-[500px] flex items-center justify-center">
          <div className="text-center">
            <button
              onClick={() => {
                setClicks(clicks + 1);
                setScore(score + 10);
              }}
              className="bg-emerald-600 text-white px-12 py-8 rounded-2xl font-bold text-2xl hover:bg-emerald-700 transition-all hover:scale-105"
            >
              Click Me!
            </button>
            <p className="text-gray-600 mt-6">
              Click as many times as you can to score points
            </p>
            <button
              onClick={endGame}
              className="mt-8 px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
            >
              End Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
