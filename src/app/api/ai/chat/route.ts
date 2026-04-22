import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();
    if (!message) return NextResponse.json({ error: "No message" }, { status: 400 });

    const lower = message.toLowerCase();

    // --- ENGINE 1: LOCAL KNOWLEDGE BRAIN (PROFESSIONAL MODE) ---
    const knowledgeBase: Record<string, string> = {
      "dijkstra": "Dijkstra's Algorithm is a powerful algorithm used for finding the shortest paths between nodes in a weighted graph. It is widely used in network routing and GPS navigation.",
      "binary search": "Binary Search is an efficient algorithm for finding an item from a sorted list of items. It works by repeatedly dividing in half the portion of the list that could contain the item.",
      "data structure": "A data structure is a specialized format for organizing, processing, retrieving and storing data. Common types include Arrays, Stacks, Queues, and Linked Lists.",
      "algorithm": "An algorithm is a finite sequence of well-defined instructions, typically used to solve a class of specific problems or to perform a computation.",
      "arefin": "Arefin Siddiqui is a Computer Science student at IUB and a skilled web developer. He is the creator of the Vireon platform.",
      "hello": "Hello! I am Vireon Bro, your professional AI assistant. How can I assist you today?",
      "hi": "Hello! I am here to help you with your queries. What can I do for you?",
    };

    for (const [key, val] of Object.entries(knowledgeBase)) {
      if (lower.includes(key)) {
        return NextResponse.json({ response: val });
      }
    }

    // --- ENGINE 2: LIVE GEMINI (PROFESSIONAL ChatGPT MODE) ---
    const geminiKey = process.env.GEMINI_API_KEY || "AIzaSyAxMnEzO6ql7oYtUoa54Kbaeq8Y59smVCQ";
    const versions = ["v1", "v1beta"];
    const models = ["gemini-pro", "gemini-1.5-flash"];

    for (const ver of versions) {
      for (const model of models) {
        try {
          const url = `https://generativelanguage.googleapis.com/${ver}/models/${model}:generateContent?key=${geminiKey}`;
          const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: `You are "Vireon Bro", a professional and highly intelligent AI assistant similar to ChatGPT. Provide comprehensive, accurate, and helpful responses to all user queries. \n\nIdentity Info: You were created by Arefin Siddiqui, a CSE student and developer. \n\nUser Message: ${message}`
                }]
              }]
            })
          });

          if (response.ok) {
            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) return NextResponse.json({ response: text });
          }
        } catch (e) {}
      }
    }

    // --- ENGINE 3: PROFESSIONAL FALLBACK ---
    return NextResponse.json({ 
      response: "I am ready to assist you. However, I am currently experiencing high traffic. Please feel free to ask a more specific question regarding Computer Science or any other topic." 
    });

  } catch (error) {
    return NextResponse.json({ response: "Hello! I am here to help. Please let me know how I can assist you." });
  }
}
