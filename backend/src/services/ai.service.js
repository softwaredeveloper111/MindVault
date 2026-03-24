import mistral from "../config/mistralLLM.js";



export const generateTags = async (title, description) => {
  try {
    const response = await mistral.chat.complete({
      model: "mistral-small-latest",
      messages: [
        {
          role: "system",
          content: "You are a content tagger. Always respond with valid JSON only. No explanation, no markdown, no extra text."
        },
        {
          role: "user",
          content: `Title: ${title}\nDescription: ${description}\n\nReturn this exact JSON:\n{"tags": ["tag1", "tag2", "tag3", "tag4", "tag5"], "topicCluster": "one broad category like Technology/Science/Business/Health/Art/Other"}`
        }
      ]
    });

    const text = response.choices[0].message.content;
    const cleaned = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return {
      tags: parsed.tags || [],
      topicCluster: parsed.topicCluster || "Other"
    };

  } catch (error) {
    console.error("generateTags failed:", error.message);
    return { tags: [], topicCluster: "Other" };  // fail hone pe empty return, crash nahi
  }
};



export const generateEmbedding = async (text) => {
  try {
    const response = await mistral.embeddings.create({
      model: "mistral-embed",
      inputs: [text],
    });

    return response.data[0].embedding;

  } catch (error) {
    console.error("generateEmbedding failed:", error.message);
    return [];
  }
};




/** when worker call 
 const text = `${item.title} ${item.description}`;
 generateEmbedding(text);

*/