export const articles = {
  popular: [
    { id: 1, title: "Quick Tips for Maintaining a Positive Attitude", excerpt: "A positive attitude doesn't just make you feel better. It can strengthen your relationships and build resilience in tough times.", category: "Health", emoji: "🌱", color: "#E8F5E9", accent: "#43A047", read: "4 min read" },
    { id: 2, title: "Managing Exam Anxiety: A Student's Guide", excerpt: "Feeling overwhelmed before exams is normal. Here are evidence-based strategies to calm your nerves and perform at your best.", category: "Student Life", emoji: "📚", color: "#FFF3E0", accent: "#FB8C00", read: "6 min read" },
    { id: 3, title: "Building Meaningful Connections Abroad", excerpt: "Moving to a new country can feel isolating. Discover how to build genuine friendships and feel at home anywhere.", category: "Living Abroad", emoji: "🌍", color: "#E3F2FD", accent: "#1E88E5", read: "5 min read" },
  ],
  studentLife: [
    { id: 4, title: "How to Balance Studies and Self-Care", excerpt: "You don't have to choose between academic success and your wellbeing. Learn how to do both effectively.", category: "Student Life", emoji: "⚖️", color: "#F3E5F5", accent: "#8E24AA", read: "5 min read" },
    { id: 5, title: "Overcoming Imposter Syndrome at University", excerpt: "Feeling like you don't belong is more common than you think. Here's how to silence the inner critic.", category: "Student Life", emoji: "🎓", color: "#FFF3E0", accent: "#FB8C00", read: "7 min read" },
  ],
  health: [
    { id: 6, title: "Sleep Hygiene: The Mental Health Foundation", excerpt: "Poor sleep is linked to anxiety and depression. These practical habits can transform your sleep and mood.", category: "Health", emoji: "🌙", color: "#E8EAF6", accent: "#3949AB", read: "4 min read" },
    { id: 7, title: "Mindfulness in 5 Minutes a Day", excerpt: "You don't need hours of meditation. Just five focused minutes can rewire your stress response over time.", category: "Health", emoji: "🧘", color: "#E0F7F4", accent: "#00897B", read: "3 min read" },
  ],
  livingAbroad: [
    { id: 8, title: "Navigating Culture Shock as an International Student", excerpt: "Feeling disoriented in a new culture is normal. Understanding the stages helps you move through it.", category: "Living Abroad", emoji: "✈️", color: "#E3F2FD", accent: "#1E88E5", read: "6 min read" },
    { id: 9, title: "Staying Connected with Family Back Home", excerpt: "Distance doesn't have to mean disconnection. These strategies help maintain strong bonds.", category: "Living Abroad", emoji: "📞", color: "#FCE4EC", accent: "#E91E63", read: "4 min read" },
  ],
  relationships: [
    { id: 10, title: "Setting Healthy Boundaries in Friendships", excerpt: "Boundaries aren't walls — they're bridges to more authentic relationships. Learn to set them with kindness.", category: "Relationships", emoji: "💛", color: "#FFFDE7", accent: "#F9A825", read: "5 min read" },
    { id: 11, title: "When to Seek Help: Talking to a Counsellor", excerpt: "Asking for help is a sign of strength. Know when and how to take that first step toward professional support.", category: "Relationships", emoji: "🤝", color: "#E8F5E9", accent: "#43A047", read: "4 min read" },
  ],
};

export const exploreCategories = [
  { key: 'popular', label: 'Popular' },
  { key: 'studentLife', label: 'Student Life' },
  { key: 'health', label: 'Health' },
  { key: 'livingAbroad', label: 'Living Abroad' },
  { key: 'relationships', label: 'Relationships' },
];

export const moods = [
  { emoji: '😄', label: 'Great', value: 5, color: '#43A047' },
  { emoji: '🙂', label: 'Good', value: 4, color: '#00BFA6' },
  { emoji: '😐', label: 'Okay', value: 3, color: '#FB8C00' },
  { emoji: '😔', label: 'Low', value: 2, color: '#F4511E' },
  { emoji: '😢', label: 'Bad', value: 1, color: '#E53935' },
];

export const breathingExercises = [
  { id: 'box', name: 'Box Breathing', emoji: '⬜', desc: 'Equal counts for a calm, focused mind', color: '#E3F2FD', accent: '#1E88E5', pattern: [4,4,4,4], labels: ['Inhale','Hold','Exhale','Hold'], cycles: 4 },
  { id: '478', name: '4-7-8 Breathing', emoji: '🌊', desc: 'Deep relaxation & sleep aid', color: '#F3E5F5', accent: '#8E24AA', pattern: [4,7,8,0], labels: ['Inhale','Hold','Exhale',''], cycles: 4 },
  { id: 'calm', name: 'Calm Breathing', emoji: '🍃', desc: 'Simple slow breathing to ease anxiety', color: '#E8F5E9', accent: '#43A047', pattern: [4,0,6,0], labels: ['Inhale','','Exhale',''], cycles: 5 },
  { id: 'energize', name: 'Energising Breath', emoji: '⚡', desc: 'Quick reset when you feel low energy', color: '#FFF3E0', accent: '#FB8C00', pattern: [3,0,3,0], labels: ['Inhale','','Exhale',''], cycles: 6 },
];

export const meditationTracks = [
  {
    id: 'morning', name: 'Morning Reset', emoji: '🌅', desc: 'Start your day with calm intention',
    duration: '5 min', color: '#FFF3E0', accent: '#FB8C00', seconds: 300,
    script: ['Find a comfortable seat and gently close your eyes.','Take three deep breaths, letting go of any tension.','Set an intention for today — just one word that guides you.','Breathe naturally. Notice the rise and fall of your chest.','You are present. You are enough. Begin your day with peace.'],
  },
  {
    id: 'stress', name: 'Exam Stress Relief', emoji: '📖', desc: 'Release study tension in minutes',
    duration: '7 min', color: '#F3E5F5', accent: '#8E24AA', seconds: 420,
    script: ['Close your eyes and acknowledge the pressure you\'re feeling.','Breathe in for 4 counts, hold for 2, out for 6.','Imagine your stress as a colour, slowly fading with each exhale.','You have prepared. You are capable. Trust yourself.','Return when you\'re ready, carrying this calm with you.'],
  },
  {
    id: 'sleep', name: 'Wind Down for Sleep', emoji: '🌙', desc: 'Gentle guide into restful sleep',
    duration: '10 min', color: '#E8EAF6', accent: '#3949AB', seconds: 600,
    script: ['Lie down and let your body sink into stillness.','Scan your body from toes to head, releasing each muscle.','With every exhale, let the day drift further away.','There is nothing to do. Nowhere to be. Just rest.','Sleep is healing. You are safe. Drift gently now.'],
  },
  {
    id: 'homesick', name: 'Comfort for Homesickness', emoji: '🏡', desc: 'A gentle embrace when far from home',
    duration: '6 min', color: '#FCE4EC', accent: '#E91E63', seconds: 360,
    script: ['Close your eyes and picture a place that feels like home.','Breathe in the warmth of that memory.','You carry love with you wherever you go.','Distance is temporary. Connection is eternal.','You are loved. You belong. You are home within yourself.'],
  },
];

export const journalPrompts = [
  'What am I grateful for today?',
  'What\'s been on my mind lately?',
  'What\'s one thing I want to let go of?',
  'Describe a moment today that made you smile.',
  'What would my future self say to me right now?',
  'What do I need more of in my life?',
];

export const counsellorTopics = ['Anxiety','Depression','Relationships','Academic stress','Loneliness','Culture shock','Grief','Family issues','Identity','Sleep','Other'];
