import { Course } from './types';

export const GEMINI_TEXT_MODEL = 'gemini-2.5-flash';
export const GEMINI_IMAGE_MODEL = 'gemini-2.5-flash-image';

export const COURSES: Course[] = [
  {
    id: 'marketing-ai-101',
    title: 'AI-Powered Scripts, Visuals & SEO',
    description: 'Learn to produce complete ad campaigns using AI tools. Covers video scripting, social copy, and SEO package generation.',
    tags: ['Marketing AI', 'Content Gen', 'SEO'],
    thumbnail: 'https://picsum.photos/400/220?random=1',
    modules: [
      {
        id: 'm1-writing',
        title: 'AI Writing for Campaigns',
        duration: '20 min',
        type: 'reading',
        content: `
### Mastering AI Copywriting
AI models like Gemini and GPT-4 excel at generating high-volume, high-quality text assets. In this module, we explore how to craft prompts that yield:

1.  **Catchy Headlines:** Using psychological triggers in prompts.
2.  **Email Sequences:** Creating drip campaigns that nurture leads.
3.  **Social Content:** Adapting tone for LinkedIn vs. Instagram.

**Key Insight:** The quality of output depends entirely on the specificity of your "System Instruction" or context provided in the prompt.
        `,
        quiz: [
          {
            id: 'q1',
            question: 'What is the most critical factor in getting high-quality text from AI?',
            options: ['Using the most expensive model', 'Providing specific context and instructions', 'Keeping the prompt as short as possible', 'Only using it for headlines'],
            correctAnswer: 1,
            explanation: 'Context and specificity (Prompt Engineering) are the biggest determinants of quality.'
          }
        ]
      },
      {
        id: 'm2-visuals',
        title: 'Visual Asset Creation',
        duration: '30 min',
        type: 'lab',
        content: `
### Stopping the Scroll with AI Visuals
Visual models translate text descriptions into pixels. 

*   **Subjects:** Be specific about the main focal point.
*   **Style:** Define the artistic medium (e.g., "Cyberpunk photorealistic", "Oil painting").
*   **Composition:** Use camera terms (e.g., "Wide angle", "Bokeh", "Macro").

*Interactive Lab available in the Tools section.*
        `
      },
      {
        id: 'm3-seo',
        title: 'AI for SEO & Performance',
        duration: '25 min',
        type: 'reading',
        content: `
### Semantic Keywords & Snippets
AI can analyze your content and suggest:
*   **LSI Keywords:** Latent Semantic Indexing terms to help search engines understand context.
*   **Featured Snippets:** Structuring answers to common questions to appear at position zero.
*   **A/B Testing:** Generating 10 variations of a meta description to test CTR.
        `,
        quiz: [
            {
                id: 'q3',
                question: 'How can AI assist with Featured Snippets?',
                options: ['It hacks Google servers', 'It structures answers concisely to match common query formats', 'It automatically clicks your links', 'It removes all competitors'],
                correctAnswer: 1,
                explanation: 'AI is excellent at summarizing complex topics into concise paragraphs or lists favored by search algorithms.'
            }
        ]
      }
    ]
  },
  {
    id: 'image-gen-fundamentals',
    title: 'Image Generation Fundamentals',
    description: 'Foundational course on diffusion models, text encoders, and the ethics of AI art.',
    tags: ['Diffusion', 'Visual Prompting', 'AI Art'],
    thumbnail: 'https://picsum.photos/400/220?random=2',
    modules: [
      {
        id: 'img-1-diffusion',
        title: 'Diffusion Model Concepts',
        duration: '15 min',
        type: 'video',
        content: `
### From Noise to Art
Diffusion models work by:
1.  **Training:** Adding noise (static) to an image until it is unrecognizable.
2.  **Generation:** The model learns to reverse this process, predicting the "less noisy" version of a random pattern step-by-step, guided by your text prompt.

**The Text Encoder:** Models use transformers (like CLIP or T5) to convert your text into mathematical embeddings that guide the noise removal process.
        `,
        quiz: [
            {
                id: 'diff-1',
                question: 'What is the core process of a diffusion model?',
                options: ['Collaging existing photos', 'Iteratively removing noise from a random pattern', 'Drawing pixel by pixel like a human', 'Searching Google Images'],
                correctAnswer: 1,
                explanation: 'Diffusion models start with random noise and iteratively refine it into a coherent image.'
            }
        ]
      },
      {
        id: 'img-2-prompting',
        title: 'Prompt Crafting for Visuals',
        duration: '45 min',
        type: 'lab',
        content: `
### The Art of the Prompt
*   **Adjectives matter:** "Gloomy" vs "Vibrant" changes the entire color palette.
*   **Negative Prompts:** Telling the model what *not* to include (e.g., "blur", "distortion", "extra fingers").
*   **Weighting:** Some tools allow you to emphasize specific words (e.g., (ocean:1.5)).
        `
      }
    ]
  }
];