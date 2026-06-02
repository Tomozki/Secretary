export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    try {
      const update = await request.json();
      if (update.message) {
        await handleMessage(update.message, env);
      }
    } catch (err) {
      console.error("Error processing update:", err);
    }

    return new Response("OK", { status: 200 });
  }
};

async function handleMessage(message, env) {
  const chatId = message.chat.id;
  const text = (message.text || "").trim();
  const adminId = parseInt(env.ADMIN_CHAT_ID, 10);

  // Check if the sender is the admin running a command
  if (chatId === adminId && text.startsWith("/")) {
    await handleAdminCommands(chatId, text, env);
    return;
  }

  // Check KV for a matching pre-made reply
  const lookupKey = text.toLowerCase();
  const matchedResponse = await env.MESSAGES_KV.get(lookupKey);

  if (matchedResponse) {
    await sendTelegram(chatId, matchedResponse, env);
  }
}

async function handleAdminCommands(chatId, text, env) {
  // 1. ADD FILTER: /add [keyword] [your pre-made message]
  if (text.startsWith("/add ")) {
    const content = text.slice(5).trim();
    const firstSpaceIndex = content.indexOf(" ");
    
    if (firstSpaceIndex === -1) {
      await sendTelegram(chatId, "❌ Invalid format. Use: /add [keyword] [message]", env);
      return;
    }

    const keyword = content.substring(0, firstSpaceIndex).toLowerCase();
    const replyMessage = content.substring(firstSpaceIndex + 1).trim();

    await env.MESSAGES_KV.put(keyword, replyMessage);
    await sendTelegram(chatId, `✅ Saved filter for keyword: "${keyword}"`, env);
    return;
  }

  // 2. DELETE FILTER: /del [keyword]
  if (text.startsWith("/del ")) {
    const keyword = text.slice(5).trim().toLowerCase();
    
    if (!keyword) {
      await sendTelegram(chatId, "❌ Use: /del [keyword]", env);
      return;
    }

    await env.MESSAGES_KV.delete(keyword);
    await sendTelegram(chatId, `🗑️ Deleted filter for keyword: "${keyword}"`, env);
    return;
  }

  // 3. LIST FILTERS: /list
  if (text === "/list") {
    const list = await env.MESSAGES_KV.list();
    
    if (list.keys.length === 0) {
      await sendTelegram(chatId, "📂 No pre-made messages configured yet.", env);
      return;
    }

    let responseList = "📋 *Current Pre-made Messages:*\n";
    for (const key of list.keys) {
      responseList += `• ${key.name}\n`;
    }
    
    await sendTelegram(chatId, responseList, env);
    return;
  }
}

async function sendTelegram(chatId, text, env) {
  const url = `https://api.telegram.org/bot${env.TELEGRAM_TOKEN}/sendMessage`;
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: "Markdown"
    }),
  });
}
