import { Brain, Heart, Users, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';

type HomePageProps = {
  onGetStarted: () => void;
};

export function HomePage({ onGetStarted }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full font-medium mb-6">
            <Sparkles size={18} />
            <span>Empowering Neurodiverse Children</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Every Mind Deserves to be
            <span className="block bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Nurtured
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            An AI-powered platform supporting children with Autism, Dyslexia, and other learning needs
            through personalized assessments, engaging games, and a caring community.
          </p>

          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-emerald-700 transition-all hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Start Your Journey
            <ArrowRight size={20} />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="bg-emerald-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <Brain className="text-emerald-600" size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Personalized Learning
            </h3>
            <p className="text-gray-600 leading-relaxed">
              AI-powered assessments create customized learning paths tailored to each child's unique needs and abilities.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="bg-teal-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <Heart className="text-teal-600" size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Engaging Activities
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Fun, interactive games designed to build cognitive skills while keeping children motivated and engaged.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <Users className="text-blue-600" size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Community Support
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Connect with other parents and caregivers, share experiences, and access evidence-based guidance.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-3xl p-12 text-white mb-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
              What Makes Nurture Minds Different?
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-3">
                <CheckCircle size={24} className="flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-lg mb-1">AI-Powered Insights</h4>
                  <p className="text-emerald-50">
                    Advanced algorithms analyze progress and adapt learning experiences in real-time.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle size={24} className="flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-lg mb-1">Evidence-Based</h4>
                  <p className="text-emerald-50">
                    All recommendations backed by verified medical and educational research.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle size={24} className="flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-lg mb-1">Privacy First</h4>
                  <p className="text-emerald-50">
                    Your data is secure and private. Full control over what you share.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle size={24} className="flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-lg mb-1">Inclusive Design</h4>
                  <p className="text-emerald-50">
                    Built with accessibility in mind, ensuring everyone can benefit.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Begin?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of families on their journey to empowered learning.
          </p>
          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-emerald-700 transition-all hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Create Free Account
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
