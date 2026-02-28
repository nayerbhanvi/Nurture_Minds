import { useEffect, useState } from 'react';
import { TrendingUp, Brain, Target, Heart, Calendar, Award } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export function DashboardPage() {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState<any[]>([]);
  const [gameSessions, setGameSessions] = useState<any[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      const [assessmentsData, gamesData, progressData] = await Promise.all([
        supabase
          .from('assessments')
          .select('*')
          .eq('child_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('game_sessions')
          .select('*')
          .eq('child_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10),
        supabase
          .from('progress_tracking')
          .select('*')
          .eq('child_id', user.id)
          .order('date', { ascending: false })
          .limit(7),
      ]);

      setAssessments(assessmentsData.data || []);
      setGameSessions(gamesData.data || []);
      setProgress(progressData.data || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const latestAssessment = assessments[0];
  const totalGames = gameSessions.length;
  const avgScore = gameSessions.length > 0
    ? Math.round(gameSessions.reduce((sum, g) => sum + g.score, 0) / gameSessions.length)
    : 0;

  const recentProgress = progress[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
          <p className="text-gray-600">Here's your learning progress overview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-emerald-100 p-3 rounded-lg">
                <Brain className="text-emerald-600" size={24} />
              </div>
              <TrendingUp className="text-emerald-600" size={20} />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {latestAssessment?.score || 0}%
            </div>
            <div className="text-sm text-gray-600">Latest Assessment</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Target className="text-blue-600" size={24} />
              </div>
              <Award className="text-blue-600" size={20} />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{totalGames}</div>
            <div className="text-sm text-gray-600">Games Played</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Heart className="text-purple-600" size={24} />
              </div>
              <TrendingUp className="text-purple-600" size={20} />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{avgScore}%</div>
            <div className="text-sm text-gray-600">Average Score</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Calendar className="text-orange-600" size={24} />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {progress.length}
            </div>
            <div className="text-sm text-gray-600">Days Tracked</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Recent Assessment Results
            </h3>
            {latestAssessment ? (
              <div>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Overall Score</span>
                    <span className="text-lg font-bold text-emerald-600">
                      {latestAssessment.score}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                      style={{ width: `${latestAssessment.score}%` }}
                    />
                  </div>
                </div>
                <div className="bg-emerald-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-700 mb-1">
                    Support Level
                  </div>
                  <div className="text-lg font-bold text-emerald-700 capitalize">
                    {latestAssessment.support_level}
                  </div>
                </div>
                {latestAssessment.recommendations && latestAssessment.recommendations.length > 0 && (
                  <div className="mt-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">
                      Top Recommendation
                    </div>
                    <p className="text-gray-600 text-sm">
                      {latestAssessment.recommendations[0]}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Brain className="text-gray-300 mx-auto mb-3" size={48} />
                <p className="text-gray-500">No assessments yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Take your first assessment to get started
                </p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Recent Activity
            </h3>
            {gameSessions.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {gameSessions.slice(0, 5).map((game) => (
                  <div
                    key={game.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-gray-900 capitalize">
                        {game.game_type} Game
                      </div>
                      <div className="text-sm text-gray-500">
                        Level {game.difficulty_level}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-600">{game.score}%</div>
                      <div className="text-xs text-gray-500">
                        {new Date(game.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="text-gray-300 mx-auto mb-3" size={48} />
                <p className="text-gray-500">No games played yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Start playing to track your progress
                </p>
              </div>
            )}
          </div>
        </div>

        {recentProgress && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Today's Progress Snapshot
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {recentProgress.focus_score}%
                </div>
                <div className="text-sm text-gray-600">Focus</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {recentProgress.memory_score}%
                </div>
                <div className="text-sm text-gray-600">Memory</div>
              </div>
              <div className="text-center p-4 bg-emerald-50 rounded-lg">
                <div className="text-2xl font-bold text-emerald-600 mb-1">
                  {recentProgress.reading_score}%
                </div>
                <div className="text-sm text-gray-600">Reading</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  {recentProgress.emotional_stability}%
                </div>
                <div className="text-sm text-gray-600">Emotional</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
