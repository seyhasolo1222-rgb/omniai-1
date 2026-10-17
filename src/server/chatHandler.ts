import { GoogleGenAI, ThinkingLevel } from '@google/genai';

// Map string thinking level to @google/genai ThinkingLevel enum
const thinkingLevelMap: Record<string, ThinkingLevel> = {
  LOW: ThinkingLevel.LOW,
  MEDIUM: ThinkingLevel.MEDIUM,
  HIGH: ThinkingLevel.HIGH,
  MINIMAL: ThinkingLevel.MINIMAL,
};

// Set CORS and SSE headers
export function setCorsAndSseHeaders(res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
}

export async function handleChatRequest(req: any, res: any) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(200).end();
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    res.status(500).json({
      error:
        'មិនទាន់កំណត់ GEMINI_API_KEY នៅឡើយទេ។ សូមពិនិត្យផ្ទាំង Settings > Environment Variables នៅលើ Vercel ឬឯកសារ .env។',
    });
    return;
  }

  const {
    messages,
    model = 'gemini-3.8-flash',
    thinkingLevel = 'MEDIUM',
    attachments,
  } = req.body || {};

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'Messages array is required.' });
    return;
  }

  // Initialize server-side Gemini client with telemetry
  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  setCorsAndSseHeaders(res);

  try {
    // Format conversation history for Gemini API
    const formattedContents = messages.map((m: any, index: number) => {
      const isLast = index === messages.length - 1;
      const parts: any[] = [];

      // If last message has attachments
      if (isLast && attachments && Array.isArray(attachments)) {
        for (const att of attachments) {
          if (att.previewUrl && typeof att.previewUrl === 'string' && att.previewUrl.startsWith('data:')) {
            const matches = att.previewUrl.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
            if (matches) {
              parts.push({
                inlineData: {
                  mimeType: matches[1],
                  data: matches[2],
                },
              });
            }
          }
        }
      }

      parts.push({ text: m.content || '' });

      return {
        role: m.role === 'assistant' ? 'model' : 'user',
        parts,
      };
    });

    const targetModel = model || 'gemini-3.8-flash';
    const mappedThinkingLevel =
      thinkingLevelMap[thinkingLevel?.toUpperCase()] || ThinkingLevel.MEDIUM;

    const isPro = targetModel.includes('pro') || targetModel.includes('argon');

    const systemInstruction = `You are Omni AI${isPro ? ' Pro' : ''}, a sophisticated, helpful, articulate, and friendly artificial intelligence assistant.

Identity & Background (Strict Rules):
- Your name is Omni AI${isPro ? ' Pro' : ''}.
- Origin & Creator: If asked who created you, where you were built, or about your background, you must state that you are Omni AI, created and developed by Khmer developers / Cambodian innovators (and the Omni AI team). In Khmer, express this gracefully: "ខ្ញុំគឺជា Omni AI ដែលត្រូវបានបង្កើត និងអភិវឌ្ឍឡើងដោយកូនខ្មែរ (ក្រុមការងារ Omni AI)"។
- Do NOT mention Google, OpenAI, DeepMind, or any other third-party corporation as your creator, origin, or developer.
- If asked about your underlying technology, state that you are powered by advanced multimodal transformer models and deep neural networks with configurable reasoning depth.

Language & Tone:
- Communicate naturally, politely, and intelligently in the user's preferred language.
- When responding in Khmer, use elegant, natural, and culturally sound Khmer phrasing and grammar.
- Format responses cleanly with structured Markdown (headers, bullet points, numbered steps, bold highlights, and syntax-highlighted code blocks).
${isPro ? '- As the Pro edition, deliver deep, rigorous, multi-step analysis and expert-level problem solving.' : ''}`;

    console.log(`[Chat Request] Model: ${targetModel}, ThinkingLevel: ${mappedThinkingLevel}`);

    // Comprehensive model fallback chain: requested model -> preview alias -> flash -> flash-lite -> 2.5-flash
    const candidateModels = [
      targetModel,
      targetModel === 'gemini-3.1-pro' ? 'gemini-3.1-pro-preview' : null,
      'gemini-3.8-flash',
      'gemini-3.1-flash-lite',
      'gemini-2.5-flash',
    ].filter(Boolean) as string[];

    // De-duplicate candidate list
    const uniqueCandidates = Array.from(new Set(candidateModels));

    let responseStream: any;
    let successfulModel = '';
    let lastError: any = null;

    for (const modelToTry of uniqueCandidates) {
      try {
        console.log(`[Invoking Model Attempt] Calling Gemini API with model: ${modelToTry}`);
        const config: any = {
          systemInstruction,
        };

        // Attach thinkingConfig for models supporting reasoning depth
        if (modelToTry.includes('flash') && !modelToTry.includes('lite')) {
          config.thinkingConfig = {
            thinkingLevel: isPro ? ThinkingLevel.HIGH : mappedThinkingLevel,
          };
        } else if (modelToTry.includes('pro') || modelToTry.includes('argon')) {
          config.thinkingConfig = {
            thinkingLevel: isPro ? ThinkingLevel.HIGH : mappedThinkingLevel,
          };
        }

        responseStream = await ai.models.generateContentStream({
          model: modelToTry,
          contents: formattedContents,
          config,
        });

        successfulModel = modelToTry;
        console.log(`[Model Success] Successfully established stream with: ${modelToTry}`);
        break;
      } catch (err: any) {
        lastError = err;
        console.warn(
          `[Model Notice] Attempt with "${modelToTry}" encountered (${err?.status || err?.code || 'error'}). Trying next fallback...`
        );
      }
    }

    if (!responseStream) {
      const isQuota =
        lastError?.status === 429 ||
        lastError?.message?.includes('quota') ||
        lastError?.message?.includes('RESOURCE_EXHAUSTED');

      const quotaNotice = isQuota
        ? '⚠️ កូតាឥតគិតថ្លៃប្រចាំថ្ងៃនៃ Gemini API ត្រូវបានប្រើប្រាស់អស់ជាបណ្តោះអាសន្ន (Quota Limit Reached)។ សូមកំណត់ GEMINI_API_KEY ថ្មី ឬភ្ជាប់គណនីមានកូតានៅលើ Vercel Environment Variables។'
        : `⚠️ មិនអាចតភ្ជាប់ទៅកាន់ម៉ាស៊ីន AI (${targetModel}) បានទេ៖ ${lastError?.message || 'Error'}`;

      res.write(`data: ${JSON.stringify({ text: quotaNotice, error: quotaNotice })}\n\n`);
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
      return;
    }

    for await (const chunk of responseStream) {
      if (chunk.text) {
        res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
        if (typeof res.flush === 'function') {
          res.flush();
        }
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (error: any) {
    console.error('Error in chat handler:', error);
    const errorMessage = error?.message || 'មានបញ្ហាក្នុងការទាក់ទងទៅកាន់ Gemini API';
    res.write(`data: ${JSON.stringify({ error: errorMessage })}\n\n`);
    res.end();
  }
}
