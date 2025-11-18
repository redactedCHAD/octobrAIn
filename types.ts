export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number; // Index
    explanation: string;
}

export interface Module {
    id: string;
    title: string;
    duration: string; // e.g. "15 min"
    content: string; // Markdown-like or text
    type: 'video' | 'reading' | 'lab';
    quiz?: QuizQuestion[];
}

export interface Course {
    id: string;
    title: string;
    description: string;
    tags: string[];
    thumbnail: string;
    modules: Module[];
}

export interface GeneratedCampaign {
    script: string;
    socialPosts: {
        platform: string;
        content: string;
    }[];
    seoKeywords: string[];
}
