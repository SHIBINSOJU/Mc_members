import mineflayer from 'mineflayer';
import { EventEmitter } from 'events';
import { log } from './utils/logger.js';
import config from './utils/config.js';
import { initChatBehavior } from './behaviors/chat.js';
import { initMovementBehavior } from './behaviors/movement.js';
import { initSurvivalBehavior } from './behaviors/survival.js';

/**
 * Manages a single bot instance.
 * @extends EventEmitter
 */
class BotController extends EventEmitter {
  /**
   * @param {string} username - The username of the bot.
   */
  constructor(username) {
    super();
    /** @type {string} */
    this.username = username;
    /** @type {mineflayer.Bot|null} */
    this.bot = null;
    /** @type {number} */
    this.retries = 0;
  }

  /**
   * Connects the bot to the server.
   */
  async connect() {
    try {
      const options = {
        host: config.server.host,
        port: config.server.port,
        username: this.username,
        version: config.server.version,
        auth: config.server.online_mode ? 'microsoft' : 'offline',
      };

      if (config.server.online_mode) {
        options.username = config.auth.email;
        options.password = config.auth.password;
      }

      this.bot = mineflayer.createBot(options);

      this.bot.on('login', () => {
        log.info(`Bot ${this.username} connected.`);
        this.emit('connected', this);
        initChatBehavior(this.bot);
        initMovementBehavior(this.bot);
        initSurvivalBehavior(this.bot);
      });

      this.bot.on('spawn', () => {
        log.info(`Bot ${this.username} spawned.`);
      });

      this.bot.on('kicked', (reason) => {
        log.warn(`Bot ${this.username} was kicked for: ${reason}`);
        this.handleDisconnect();
      });

      this.bot.on('error', (err) => {
        log.error(`Bot ${this.username} encountered an error: ${err.message}`);
      });

      this.bot.on('end', (reason) => {
        log.info(`Bot ${this.username} disconnected. Reason: ${reason}`);
        this.handleDisconnect();
      });
    } catch (error) {
      log.error(`Failed to connect bot ${this.username}: ${error.message}`);
      this.handleDisconnect();
    }
  }

  /**
   * Disconnects the bot from the server.
   */
  disconnect() {
    if (this.bot) {
      this.bot.quit();
    }
  }

  /**
   * Handles the bot's disconnection and auto-reconnect.
   */
  handleDisconnect() {
    this.emit('disconnected', this);
    if (config.bots.auto_reconnect && this.retries < config.bots.max_retries) {
      this.retries++;
      setTimeout(() => {
        log.info(`Reconnecting ${this.username}, attempt ${this.retries}...`);
        this.connect();
      }, config.bots.connection_delay);
    }
  }

  /**
   * Sends a chat message from the bot.
   * @param {string} message - The message to send.
   */
  chat(message) {
    if (this.bot && this.bot.entity) {
      this.bot.chat(message);
    }
  }
}

export default BotController;
