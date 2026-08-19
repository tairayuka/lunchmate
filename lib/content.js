// 画面文言をここに集約。ガイドラインの文章は今後変更される可能性があるため、
// 各画面のJSXに直接書かず、必ずここを編集すればよい状態にしておく。

export const WELCOME = {
  heading: 'Hey! Are you ready\nfor match?',
  subtext: 'Get matched with someone from a different country and share lunch together — no chats, no photos, just show up.',
  cta: 'Find a Mate',
};

export const PROFILE = {
  heading: "Who's eating?",
  subtext: "Let's get you set up for lunch!",
  nameLabel: "What's your nickname?",
  namePlaceholder: 'e.g. Sunny',
  nationalityLabel: 'Where are you from?',
  nationalityPlaceholder: 'Select your country',
  hint: 'Knowing your hometown helps us match you with neighbors for the best food crawls!',
  cta: 'Next',
  step: 'Step 1 of 3: Personalized Lunch Matching',
};

export const GUIDELINES = [
  {
    key: 'respectful',
    icon: 'heart',
    iconBg: 'iconTealBg',
    title: 'Be Respectful',
    description: 'Treat every lunch mate like an island guest. Kindness is our primary currency.',
  },
  {
    key: 'show-up',
    icon: 'calendar',
    iconBg: 'iconOrangeBg',
    title: 'Show Up',
    description: "Don't leave people waiting. If you match, be there or cancel with notice.",
  },
  {
    key: 'casual',
    icon: 'mug',
    iconBg: 'iconBlueBg',
    title: 'Keep it Casual',
    description: "Low pressure, high connection. It's just lunch—no stress, just vibes.",
  },
];

export const GUIDELINE_PAGE = {
  agreeLabel: 'I agree to the guidelines',
  cta: 'I Agree, Let’s Eat! \u{1F389}',
  step: 'Step 2 of 3: Personalized Lunch Matching',
};

export const HOME = {
  heading: 'Ready for lunch?',
  subtext: 'Find a companion in seconds.',
  hint: "We'll match you with someone in under 60 seconds.",
  cta: 'Find a Mate',
  step: 'Step 3 of 3: Personalized Lunch Matching',
};

export const SEARCHING = {
  heading: 'Finding your match...',
  subtext: "Grab a coconut, we're searching the island!",
  cancelCta: 'Cancel search',
  footer: 'Searching for other foodies nearby...',
  timeoutHint: "No match in 60 seconds? No worries — you'll be able to try again right away.",
  totalSeconds: 60,
};

export const RESULT = {
  heading: 'Match Found!',
  matchNumberLabel: 'Match Number',
  howToFind: 'Say your name or show this number at the meeting spot — that’s how your Lunch Mate will find you.',
  partnerPrefix: "You're eating with",
  nationalityLabel: 'Nationality',
  locationLabel: 'Meeting spot',
  cta: 'Go Back Home',
  cancelCta: 'Cancel this match',
  partnerCanceledHeading: 'Match Canceled',
  partnerCanceledNotice: 'Your lunch mate canceled this match. No worries, you can find a new one!',
};

export const CANCELED = {
  headingCanceled: 'Search Canceled',
  headingTimeout: 'No Match Found',
  subtextCanceled: "You've stopped the search. No worries, try again whenever you're hungry!",
  subtextTimeout: "We couldn't find a lunch mate in time. Give it another shot!",
  cta: 'Back to Home',
};
