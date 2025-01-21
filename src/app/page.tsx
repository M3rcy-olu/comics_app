"use client";
import { useState } from "react";

export default function Home() {
  const [showTiles, setShowTiles] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState("");

  const handleSubmit = async () => {
    if (!prompt) return;

    try {
      setIsLoading(true);
      const response = await fetch("/api/generate_plot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      const prompts = data.comics.map(comic => comic.prompt);
      const captions = data.comics.map(comic => comic.caption);

      // console.log("Generated prompts:", prompts);
      // console.log("Generated captions:", captions);
      
      // Generate images one at a time
      const imageUrls = [];
      for (const prompt of prompts) {
        const imgResponse = await fetch("/api/generate_img", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        });
        const imgData = await imgResponse.json();
        imageUrls.push(imgData.imgURL);
      }

      setGeneratedImage(imageUrls);
      setShowTiles(true);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-4">Comic Generator</h1>

        <div className="w-full max-w-2xl">
          <textarea
            className="w-full p-4 rounded-lg border border-black/[.08] dark:border-white/[.145] bg-background min-h-[120px] resize-none focus:outline-none focus:ring-2 focus:ring-foreground/20"
            placeholder="Describe your comic story here..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <button
            className="mt-4 w-full rounded-full border border-solid border-transparent transition-all duration-500 ease-in-out flex items-center justify-center bg-foreground text-background gap-2 hover:bg-red-600 hover:scale-105 text-sm sm:text-base h-12 px-5 disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !prompt}
          >
            {isLoading ? "Generating..." : "Generate Comic"}
          </button>
        </div>

        {showTiles && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mt-8">
            {[1, 2, 3].map((index) => (
              <div
                key={index}
                className="aspect-square rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center bg-gray-50 dark:bg-gray-900 overflow-hidden"
              >
                {generatedImage ? (
                  <img
                    src={generatedImage[index - 1]}
                    alt={`Generated comic panel ${index}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400">Image {index}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="row-start-3 text-sm text-center text-gray-500">
        Create amazing comics with AI
      </footer>
    </div>
  );
}
