import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ComicPanel {
  prompt: string;
  caption: string;
}

interface ComicsResponse {
  comics: ComicPanel[];
}

async function generateComics(userPrompt: string): Promise<ComicsResponse> {
  const systemPrompt = `
    Create a 3-panel comic story about a person's journy to a beach vacation. For each panel, provide:
    1. An image generation prompt that includes 'anuolu' and a realistic style depicting anuolu.
    2. A caption that refers to what 'anuolu' is doing.

    Format the output as JSON with this structure:
    {
        "comics": [
            {
                "prompt": "Image generation prompt here",
                "caption": "Caption text here"
            }
        ]
    }
  `;

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ]
  });

  const storyJson = JSON.parse(response.choices[0].message.content) as ComicsResponse;
  return storyJson;
}

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    const comics = await generateComics(prompt);
    return NextResponse.json(comics);
  } catch (error) {
    console.error('Error generating comics:', error);
    return NextResponse.json(
      { error: 'Failed to generate comics' },
      { status: 500 }
    );
  }
}