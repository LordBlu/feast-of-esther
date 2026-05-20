import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

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

const MAX_MESSAGES = 24;
const MAX_CONTENT_LEN = 2000;

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

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limited = checkRateLimit(`hadassah:${ip}`, 30, 60 * 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: 'Too many messages. Please wait a moment and try again.' },
      { status: 429, headers: { 'Retry-After': String(limited.retryAfterSec) } },
    );
  }

  const apiKey = process.env.OLLAMA_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          'Hadassah is temporarily unavailable. Please use our contact page or call (832) 372-0860.',
      },
      { status: 503 },
    );
  }

  const model =
    process.env.OLLAMA_CHAT_MODEL?.trim() || 'qwen3-coder:480b-cloud';

  try {
    const body: unknown = await req.json();
    const rawMessages = (body as { messages?: unknown }).messages;
    if (!Array.isArray(rawMessages)) {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
    }

    const messages = rawMessages
      .filter(isChatMessage)
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .slice(-MAX_MESSAGES)
      .map((m) => ({
        role: m.role,
        content: m.content.slice(0, MAX_CONTENT_LEN),
      }));

    if (!messages.length) {
      return NextResponse.json({ error: 'Please enter a message.' }, { status: 400 });
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
      throw new Error('upstream');
    }

    const choices = (data as { choices?: { message?: { content?: string } }[] }).choices;
    const content = choices?.[0]?.message?.content;
    if (typeof content !== 'string' || !content.trim()) {
      throw new Error('empty');
    }

    return NextResponse.json({ message: content });
  } catch {
    return NextResponse.json(
      { error: 'Hadassah could not respond right now. Please try again in a moment.' },
      { status: 500 },
    );
  }
}
