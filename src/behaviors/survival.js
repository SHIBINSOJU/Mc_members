import config from '../utils/config.js';

function autoEat(bot) {
  if (bot.food === 20) return;
  const food = bot.inventory.items().find(item => bot.foodList.includes(item.type));
  if (food) {
    bot.equip(food, 'hand', () => {
      bot.consume();
    });
  }
}

function autoRespawn(bot) {
  bot.on('death', () => {
    bot.respawn();
  });
}

export function initSurvivalBehavior(bot) {
  if (config.behaviors.auto_eat) {
    bot.on('health', () => {
      autoEat(bot);
    });
  }

  if (config.behaviors.auto_respawn) {
    autoRespawn(bot);
  }
}
