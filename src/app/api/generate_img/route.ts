import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

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

    return NextResponse.json({ imgURL: String(output[0]) });

  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}
