import config from '../utils/config.js';
import { pathfinder, Movements, goals } from 'mineflayer-pathfinder';
import mcData from 'minecraft-data';

const { GoalFollow, GoalBlock } = goals;
let antiAfkInterval = null;

function stopMovement(bot) {
  bot.pathfinder.stop();
  if (antiAfkInterval) {
    clearInterval(antiAfkInterval);
    antiAfkInterval = null;
  }
}

function randomWalk(bot) {
  stopMovement(bot);
  const defaultMove = new Movements(bot, mcData(bot.version));
  bot.pathfinder.setMovements(defaultMove);
  const x = bot.entity.position.x + (Math.random() * 10 - 5);
  const z = bot.entity.position.z + (Math.random() * 10 - 5);
  bot.pathfinder.setGoal(new GoalBlock(x, bot.entity.position.y, z));
}

function followPlayer(bot, playerName) {
  stopMovement(bot);
  const player = bot.players[playerName]?.entity;
  if (!player) {
    bot.chat(`I can't see ${playerName}.`);
    return;
  }
  const defaultMove = new Movements(bot, mcData(bot.version));
  const goal = new GoalFollow(player, 1);
  bot.pathfinder.setMovements(defaultMove);
  bot.pathfinder.setGoal(goal);
}

function jump(bot) {
  bot.setControlState('jump', true);
  bot.setControlState('jump', false);
}

function antiAfk(bot) {
  stopMovement(bot);
  antiAfkInterval = setInterval(() => {
    jump(bot);
  }, 10000);
}

function lookAtNearestPlayer(bot) {
  const player = bot.nearestEntity(entity => entity.type === 'player');
  if (player) {
    bot.lookAt(player.position.offset(0, player.height, 0));
  }
}

export function initMovementBehavior(bot) {
  bot.loadPlugin(pathfinder);

  if (config.behaviors.anti_afk) {
    antiAfk(bot);
  }

  bot.on('chat', (username, message) => {
    if (username === bot.username) return;

    const [command, ...args] = message.split(' ');
    if (command === 'follow') {
      followPlayer(bot, args[0] || username);
    } else if (command === 'stop') {
      stopMovement(bot);
    } else if (command === 'randomwalk') {
      randomWalk(bot);
    } else if (command === 'jump') {
      jump(bot);
    } else if (command === 'look') {
      lookAtNearestPlayer(bot);
    }
  });
}
