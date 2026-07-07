const ollamaUrl = import.meta.env.VITE_OLLAMA_URL || "http://127.0.0.1:11434";
const ollamaModel = import.meta.env.VITE_OLLAMA_MODEL || "llama2";

async function fetchOllama(payload) {
  const response = await fetch(`${ollamaUrl}/v1/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    return response.json();
  }

  if (response.status === 404) {
    const fallback = await fetch(`${ollamaUrl}/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!fallback.ok) {
      const text = await fallback.text();
      throw new Error(`Ollama fallback error ${fallback.status}: ${text}`);
    }

    return fallback.json();
  }

  const message = await response.text();
  throw new Error(`Ollama error ${response.status}: ${message}`);
}

export async function getOllamaCompletion(prompt) {
  const payload = {
    model: ollamaModel,
    prompt,
    max_tokens: 512,
    temperature: 0.2,
  };

  const data = await fetchOllama(payload);
  return (
    data?.choices?.[0]?.message?.content ||
    data?.choices?.[0]?.text ||
    data?.output?.[0]?.content ||
    ""
  );
}
