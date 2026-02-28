# Nurture Minds

**Empowering neurodiverse children to grow, learn, and connect — with AI that understands, not judges.**

![Nurture Minds](https://images.ctfassets.net/zvaujq68yh0h/2satZZJSTGQqwAWeYQkqWa/752d2626b93ffddc21a4f4ff9d90a351/151101-child-tablet-mn-1315_d45dd49e8a7b69a0b4b9b0d51e5b9773.nbcnews-ux-2880-1000.jpg)

## About

Nurture Minds is an AI-powered web platform designed to support children with Autism, Dyslexia, ADHD, and other neurodiverse learning needs, while also creating a supportive ecosystem for parents and caregivers.

### Key Features

- **Cognitive Assessments**: Adaptive, personalized assessments that evaluate memory, focus, reading, and visual processing skills
- **Interactive Games**: Engaging cognitive development games that adapt to the child's skill level
- **Progress Dashboard**: Visual tracking of learning progress with detailed metrics and insights
- **Parent Forum**: Safe community space for parents to connect, share experiences, and support each other
- **FactBuddy AI Chatbot**: Evidence-based AI assistant providing verified information from credible medical and educational sources
- **Beautiful, Accessible UI**: Designed with WCAG accessibility standards in mind

## Technology Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React

## Project Structure

```
nurture-minds/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AuthModal.tsx   # Authentication modal
│   │   └── Navigation.tsx  # Main navigation
│   ├── contexts/
│   │   └── AuthContext.tsx # Authentication context
│   ├── lib/
│   │   └── supabase.ts     # Supabase client & types
│   ├── pages/              # Application pages
│   │   ├── HomePage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── AssessmentPage.tsx
│   │   ├── GamesPage.tsx
│   │   ├── ForumPage.tsx
│   │   └── ChatbotPage.tsx
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
└── supabase/               # Database migrations
```

## Database Schema

The application uses the following tables:

- **profiles**: User profiles (parents and children)
- **assessments**: Cognitive assessment results
- **game_sessions**: Game play history and scores
- **progress_tracking**: Daily progress metrics
- **forum_posts**: Community forum posts
- **forum_comments**: Comments on forum posts
- **chatbot_conversations**: AI chatbot conversation history

All tables are protected with Row Level Security (RLS) policies.

## Features in Detail

### 1. Cognitive Assessment

- 6 adaptive questions covering memory, focus, reading, and visual skills
- AI-powered scoring system that determines support level (mild, moderate, high)
- Personalized recommendations based on assessment results
- Progress tracking over time

### 2. Interactive Games

Four types of cognitive development games:
- **Memory Match**: Improve memory and pattern recognition
- **Focus Challenge**: Enhance concentration skills
- **Pattern Recognition**: Boost cognitive pattern detection
- **Word Builder**: Develop language abilities

Each game features:
- Three difficulty levels
- Real-time scoring
- Progress tracking
- Performance analytics

### 3. Parent Dashboard

- Overview of latest assessment scores
- Game play statistics and trends
- Progress visualization charts
- Recent activity feed
- Daily progress snapshots with focus, memory, reading, and emotional stability metrics

### 4. Community Forum

- Category-based discussions (Autism, Dyslexia, ADHD, General)
- Anonymous posting option
- Upvoting system
- Comment threads
- Safe, moderated environment

### 5. FactBuddy AI Chatbot

Evidence-based chatbot that provides:
- Verified information from WHO, CDC, and NIH
- Answers about autism, dyslexia, ADHD, therapies, and interventions
- Source attribution for all responses
- Conversation history tracking

Topics covered:
- Understanding neurodiversity
- Effective therapy approaches
- Early intervention strategies
- Parent support resources

## Design Philosophy

### Accessibility First

- WCAG 2.1 AA compliance
- Keyboard navigation support
- High contrast ratios for readability
- Clear focus indicators
- Semantic HTML
- Screen reader friendly

### Inclusive Design

- Non-stigmatizing language
- Positive, empowering messaging
- Multi-sensory learning approaches
- Flexible interface that adapts to user needs

### Privacy & Security

- End-to-end encryption for sensitive data
- Row Level Security (RLS) on all database tables
- No data sharing with third parties
- User-controlled data deletion
- HIPAA-aware design principles

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# .env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Run development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Future Enhancements

### Planned Features

- **Video Analysis**: OpenCV-based behavioral recognition from uploaded videos
- **Multi-language Support**: Interface localization for global accessibility
- **Voice Navigation**: Speech-based interaction for children with reading difficulties
- **Progress Reports**: Downloadable PDF reports for sharing with educators and therapists
- **Parent Resources**: Curated library of articles, videos, and educational materials
- **Therapist Portal**: Dedicated interface for professional care providers
- **Mobile Apps**: Native iOS and Android applications

### Advanced AI Features

- Emotion detection from facial expressions during game play
- Personalized learning path recommendations
- Predictive analytics for identifying areas needing attention
- Natural language processing for better chatbot interactions

## Contributing

This project was built for the hackathon with a focus on social impact and accessibility. Contributions are welcome!

## License

MIT License - Feel free to use this project for educational and non-commercial purposes.

## Acknowledgments

- Built with love for neurodiverse children and their families
- Inspired by research from WHO, CDC, NIH, and leading autism/dyslexia organizations
- Designed following WCAG accessibility guidelines
- Icons by Lucide React

---

## Impact Statement

Nurture Minds is more than a web application — it's a commitment to inclusive education and empowering every child to reach their full potential, regardless of their learning differences.

**Every mind deserves to be nurtured.**

---

## Contact

For questions, feedback, or collaboration opportunities, please reach out through the forum or create an issue in the repository.

---

Built with React, TypeScript, Supabase, and Tailwind CSS.
