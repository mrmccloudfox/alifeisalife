import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const { feedback } = req.body || {};
  if (!feedback) {
    return res.status(400).json({ error: "Feedback statement is required." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(200).json({
      text: `Thank you for sharing this reflection: "${feedback}". Your support helps keep the focus on courage, family, and practical care for young moms through Hope House Colorado.`
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `The visitor shared this reflection regarding the teenage mother support t-shirt benefit and advocacy line: "${feedback}". Generate a warm, heartfelt, supportive 2-3 sentence response acknowledging their sentiment with gratitude and reflecting on Hope House Colorado's mission. Keep it brief and elegant.`
    });

    return res.status(200).json({ text: response.text });
  } catch (error) {
    return res.status(500).json({
      error: error?.message || "Internal error generating response."
    });
  }
}
