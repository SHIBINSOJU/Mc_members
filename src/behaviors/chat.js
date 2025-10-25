import config from '../utils/config.js';

const responses = {
  hello: 'Hello there!',
  bots: 'We are bots!',
  help: 'I am a bot, I cannot help you.',
};

function handleChatMessage(bot, username, message) {
  if (username === bot.username) return;

  const lowerMessage = message.toLowerCase();
  for (const keyword in responses) {
    if (lowerMessage.includes(keyword)) {
      bot.chat(responses[keyword]);
      break;
    }
  }
}

export function initChatBehavior(bot) {
  if (config.behaviors.auto_respond) {
    bot.on('chat', (username, message) => {
      handleChatMessage(bot, username, message);
    });
  }
}
