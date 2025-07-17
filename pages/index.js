import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ResponseCard from "../components/ResponseCard";
import Link from "next/link";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [savedResponses, setSavedResponses] = useState([]);

  // ✅ Load saved responses from localStorage on page load
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("savedResponses") || "[]");
    setSavedResponses(stored);
  }, []);

  // ✅ Save to localStorage (helper)
  const updateLocalStorage = (updated) => {
    localStorage.setItem("savedResponses", JSON.stringify(updated));
    setSavedResponses(updated);
  };

  // ✅ Handle Generate
  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResponses([]);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      const newResponses = (data.responses || []).map((text, i) => ({
        id: Date.now() + i,
        text,
        liked: false,
        tag: "",
      }));
      setResponses(newResponses);
    } catch (error) {
      console.error("Error generating response:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Copy to Clipboard
  const handleCopy = async (text) => {
    await navigator.clipboard.writeText(text);
    alert("✅ Copied to clipboard!");
  };

  // ✅ Like/Unlike + Auto Save
  const handleLike = (id) => {
    setResponses((prev) =>
      prev.map((res) => {
        if (res.id === id) {
          const updated = { ...res, liked: !res.liked };
          saveOrUpdateResponse(updated);
          return updated;
        }
        return res;
      })
    );
  };

  // ✅ Save to LocalStorage (manual Save button)
  const handleSave = (id) => {
    const response = responses.find((r) => r.id === id);
    if (response) {
      saveOrUpdateResponse(response);
      alert("💾 Response saved! Check Saved Responses page.");
    }
  };

  // ✅ Regen + Keep Tag & Like + Auto Save
  const handleRegen = async (id) => {
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (data.responses?.length) {
        setResponses((prev) =>
          prev.map((r) => {
            if (r.id === id) {
              const updated = {
                ...r,
                text: data.responses[0],
              };
              saveOrUpdateResponse(updated);
              return updated;
            }
            return r;
          })
        );
      }
    } catch (error) {
      console.error("Error regenerating:", error);
    }
  };

  // ✅ Tag Change + Auto Save
  const handleTagChange = (id, tag) => {
    setResponses((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const updated = { ...r, tag };
          saveOrUpdateResponse(updated);
          return updated;
        }
        return r;
      })
    );
  };

  // ✅ Save or Update in LocalStorage
  const saveOrUpdateResponse = (response) => {
    const existing = JSON.parse(localStorage.getItem("savedResponses") || "[]");
    const updated = existing.some((r) => r.id === response.id)
      ? existing.map((r) => (r.id === response.id ? response : r))
      : [...existing, response];

    updateLocalStorage(updated);
  };

  return (
    <div
      className={`${
        darkMode ? "dark bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      } min-h-screen transition-colors duration-500`}
    >
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">
            AI Text Generator Pro
          </h1>
          <div className="flex items-center gap-3">
            <Link
              href="/saved"
              className="text-blue-400 underline hover:text-blue-300"
            >
              📌 Saved
            </Link>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:scale-105 transition-transform"
            >
              {darkMode ? "☀ Light" : "🌙 Dark"}
            </button>
          </div>
        </div>

        {/* Textarea */}
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:border-gray-700"
          rows={4}
          placeholder="Type your prompt here..."
        ></textarea>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="mt-4 w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg hover:opacity-90 transition"
        >
          {loading ? "Generating..." : "Generate"}
        </button>

        {/* Responses */}
        <div className="mt-6 space-y-4">
          {responses.map((response, i) => (
            <motion.div
              key={response.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            >
              <ResponseCard
                response={response}
                onCopy={handleCopy}
                onLike={handleLike}
                onSave={handleSave}
                onRegen={handleRegen}
                onTagChange={handleTagChange}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
