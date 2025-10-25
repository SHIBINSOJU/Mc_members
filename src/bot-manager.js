import BotController from './bot-controller.js';
import config from './utils/config.js';
import { log } from './utils/logger.js';

/**
 * Manages all bot instances.
 */
class BotManager {
  constructor() {
    /** @type {BotController[]} */
    this.bots = [];
    /** @type {Set<BotController>} */
    this.connectedBots = new Set();
  }

  /**
   * Connects all bots to the server.
   */
  connectAll() {
    for (let i = 0; i < config.bots.count; i++) {
      const username = `${config.bots.prefix}${i + 1}`;
      const botController = new BotController(username);

      botController.on('connected', (bot) => this.connectedBots.add(bot));
      botController.on('disconnected', (bot) => this.connectedBots.delete(bot));

      this.bots.push(botController);

      setTimeout(() => {
        botController.connect();
      }, i * config.bots.connection_delay);
    }
  }

  /**
   * Disconnects all bots from the server.
   */
  disconnectAll() {
    this.bots.forEach((bot) => bot.disconnect());
  }

  /**
   * Gets a bot by its username.
   * @param {string} username - The username of the bot.
   * @returns {BotController|undefined} The bot controller instance.
   */
  getBot(username) {
    return this.bots.find((bot) => bot.username === username);
  }

  /**
   * Lists all bots and their connection status.
   * @returns {{username: string, connected: boolean}[]} A list of bots.
   */
  listBots() {
    return this.bots.map((bot) => ({
      username: bot.username,
      connected: this.connectedBots.has(bot),
    }));
  }

  /**
   * Sends a chat message from all connected bots.
   * @param {string} message - The message to send.
   */
  chatAll(message) {
    this.connectedBots.forEach((bot) => bot.chat(message));
  }

  /**
   * Sends a chat message from a specific bot.
   * @param {string} username - The username of the bot.
   * @param {string} message - The message to send.
   */
  chat(username, message) {
    const bot = this.getBot(username);
    if (bot && this.connectedBots.has(bot)) {
      bot.chat(message);
    } else {
      log.warn(`Bot ${username} not found or not connected.`);
    }
  }
}

export default new BotManager();
