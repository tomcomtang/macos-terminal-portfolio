import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    const apiKey =
      import.meta.env.DEEPSEEK_API_KEY ?? import.meta.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error('Missing DEEPSEEK_API_KEY');
    }

    const encoder = new TextEncoder();

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          // DeepSeek chat completions endpoint (OpenAI-compatible, streaming)
          const response = await fetch(
            'https://api.deepseek.com/chat/completions',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
              },
              body: JSON.stringify({
                model: 'deepseek-chat',
                messages: body.messages,
                temperature: 0.7,
                max_tokens: 500,
                stream: true,
              }),
            }
          );

          if (!response.ok || !response.body) {
            const errorText = await response.text();
            throw new Error(
              `DeepSeek API error: ${response.status} ${response.statusText} - ${errorText}`
            );
          }

          const reader = response.body.getReader();
          const decoder = new TextDecoder('utf-8');
          let buffer = '';

          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });

            const lines = buffer.split('\n');
            buffer = lines.pop() ?? '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || trimmed === 'data: [DONE]') continue;
              if (!trimmed.startsWith('data:')) continue;

              const jsonStr = trimmed.slice('data:'.length).trim();
              try {
                const json = JSON.parse(jsonStr);
                const delta = json.choices?.[0]?.delta?.content;
                if (delta) {
                  controller.enqueue(encoder.encode(delta));
                }
              } catch (e) {
                console.error('Failed to parse DeepSeek stream chunk', e, {
                  line: trimmed,
                });
              }
            }
          }

          controller.close();
        } catch (err) {
          console.error('DeepSeek streaming error in /api/chat:', err);
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('DeepSeek API error in /api/chat (setup):', error);

    const message =
      error instanceof Error ? error.message : JSON.stringify(error);

    return new Response(
      JSON.stringify({
        error: message,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
