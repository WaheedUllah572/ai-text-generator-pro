export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  const { prompt } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o", // or "gpt-4o-2024-08-06"
        messages: [{ role: "user", content: prompt }],
        n: 3,
      }),
    });

    const data = await response.json();
    console.log("✅ API RESPONSE:", JSON.stringify(data, null, 2));

    if (data?.choices) {
      const cleanedResponses = data.choices.map((choice) =>
        choice.message.content.trim()
      );
      res.status(200).json({ responses: cleanedResponses });
    } else {
      res.status(500).json({ message: "No choices returned", raw: data });
    }
  } catch (error) {
    console.error("❌ API Error:", error);
    res.status(500).json({ message: "API Error", error: error.message });
  }
}
