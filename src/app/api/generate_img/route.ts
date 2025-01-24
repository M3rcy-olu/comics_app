import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const BACKEND_URL = 'https://sundai-backend-103058721915.us-east4.run.app';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    console.log("prompt", prompt);

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const output = await replicate.run(
      "sundai-club/flux_anurag:48670f1ffda03884b09ac40eb9ef302f2366811d9e20005724d69365708be598",
      {
        input: {
          prompt: prompt,
          num_inference_steps: 8,
          model: "schnell",
        },
      }
    );

    if (!Array.isArray(output)) {
      throw new Error("Expected array output from Replicate");
    }

    const imageUrl = String(output[0]);  // Ensure it's a string
    console.log("Generated image URL:", imageUrl);  // Debug log

    // Save image to backend
    const saveResponse = await fetch(`${BACKEND_URL}/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        image_url: imageUrl
      }),
    });

    if (!saveResponse.ok) {
      const errorData = await saveResponse.text();
      console.error('Backend response:', {
        status: saveResponse.status,
        statusText: saveResponse.statusText,
        body: errorData
      });
      throw new Error(`Failed to save image: ${saveResponse.status} ${errorData}`);
    }

    const savedData = await saveResponse.json();
    return NextResponse.json({ imgURL: savedData.image_url });

  } catch (error) {
    console.error("Error generating/saving image:", error);
    return NextResponse.json(
      { error: "Failed to generate/save image" },
      { status: 500 }
    );
  }
}

