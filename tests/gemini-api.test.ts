import { describe, it, expect } from "vitest";

describe("Gemini API Key Validation", () => {
  it("should validate the Gemini 2.0 Flash-Lite API key by making a test request", async () => {
    const apiKey = process.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("VITE_GEMINI_API_KEY is not set");
    }

    // Test the API key with a simple request using Gemini 2.0 Flash-Lite
    let response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "Say 'API key is valid' in one sentence.",
                },
              ],
            },
          ],
        }),
      }
    );

    // Handle rate limiting with retry
    if (response.status === 429) {
      console.log("Rate limited, waiting 2 seconds before retry...");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: "Say 'API key is valid' in one sentence.",
                  },
                ],
              },
            ],
          }),
        }
      );
    }

    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.candidates).toBeDefined();
    expect(data.candidates[0].content.parts[0].text).toBeDefined();
    console.log("✓ Gemini 2.0 Flash-Lite API key is valid");
  });
});
