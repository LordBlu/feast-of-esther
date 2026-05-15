import { NextRequest, NextResponse } from 'next/server';

const SITE_CONTEXT = `
You are Hadassah, a warm and helpful AI assistant for the Feast of Esther NA ministry website.
Your name Hadassah is the Hebrew name of Queen Esther, meaning "myrtle tree" — a symbol of grace and strength.

About Feast of Esther NA:
- Feast of Esther is an annual gathering of Women in Ministry, organized under the global Feast of Esther ministry founded by Pastor (Mrs.) Folu Adeboye, wife of the General Overseer of the Redeemed Christian Church of God (RCCG).
- The NA chapter serves women in North America.
- The vision is to develop excellent ministry skills in women called to support and impact the church of God for nation building.
- Scripture focus: Esther 4:14b — "for such a time as this"

Feast of Esther NA 2026 Event:
- Date: June 18-20, 2026
- Venue: Dallas/Fort Worth Airport Marriott, 8440 Freeport Parkway, Irving, Texas, USA, 75063
- Registration is open — direct users to the Registration page
- Donation page available for those who want to support the ministry

Pages on this website:
- Home, About Us, The Founder, Leaders, Gallery, Events, Registration ($150 fee via Zeffy), Donate (via Zeffy), Contact

Your personality:
- Warm, encouraging, faith-forward
- Speak like a gracious ministry host, not a robot
- Keep answers concise and helpful
- If asked something you don't know, gracefully direct them to the Contact page
- Never make up event details beyond what's listed above
`;

type ChatRole = 'user' | 'assistant' | 'system';

type ChatMessage = { role: ChatRole; content: string };

function isChatMessage(row: unknown): row is ChatMessage {
  if (!row || typeof row !== 'object') return false;
  const r = row as Record<string, unknown>;
  const role = r.role;
  const content = r.content;
  if (role !== 'user' && role !== 'assistant' && role !== 'system') return false;
  return typeof content === 'string' && content.length > 0;
}

function errMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.OLLAMA_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Chat is not configured (missing OLLAMA_API_KEY on the server).' },
      { status: 503 },
    );
  }

  const model =
    process.env.OLLAMA_CHAT_MODEL?.trim() || 'qwen3-coder:480b-cloud';

  try {
    const body: unknown = await req.json();
    const rawMessages = (body as { messages?: unknown }).messages;
    if (!Array.isArray(rawMessages)) {
      return NextResponse.json({ error: 'Expected { messages: [...] }' }, { status: 400 });
    }

    const messages = rawMessages
      .filter(isChatMessage)
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({
        role: m.role,
        content: m.content,
      }));

    if (!messages.length) {
      return NextResponse.json({ error: 'No valid messages to send.' }, { status: 400 });
    }

    const response = await fetch('https://ollama.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'system' as const, content: SITE_CONTEXT }, ...messages],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const data: unknown = await response.json();

    if (!response.ok) {
      const msg =
        typeof data === 'object' &&
        data !== null &&
        'error' in data &&
        typeof (data as { error?: { message?: string } }).error?.message === 'string'
          ? (data as { error: { message: string } }).error.message
          : `Ollama API error (${response.status})`;
      throw new Error(msg);
    }

    const choices = (data as { choices?: { message?: { content?: string } }[] }).choices;
    const content = choices?.[0]?.message?.content;
    if (typeof content !== 'string' || !content.trim()) {
      throw new Error('Empty response from assistant.');
    }

    return NextResponse.json({ message: content });
  } catch (error: unknown) {
    return NextResponse.json({ error: errMessage(error) || 'Something went wrong' }, { status: 500 });
  }
}
