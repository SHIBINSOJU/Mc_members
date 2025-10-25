import prompts from 'prompts';
import botManager from './bot-manager.js';
import { log } from './utils/logger.js';
import chalk from 'chalk';

async function mainMenu() {
  const response = await prompts({
    type: 'select',
    name: 'action',
    message: 'What do you want to do?',
    choices: [
      { title: 'Connect all bots', value: 'connect' },
      { title: 'Disconnect all bots', value: 'disconnect' },
      { title: 'List bots', value: 'list' },
      { title: 'Send chat message (all)', value: 'chatAll' },
      { title: 'Send chat message (specific)', value: 'chat' },
      { title: 'Follow player', value: 'follow' },
      { title: 'Random walk', value: 'randomWalk' },
      { title: 'Jump', value: 'jump' },
      { title: 'Look at nearest player', value: 'look' },
      { title: 'View bot positions', value: 'positions' },
      { title: 'Exit', value: 'exit' },
    ],
  });

  switch (response.action) {
    case 'connect':
      botManager.connectAll();
      break;
    case 'disconnect':
      botManager.disconnectAll();
      break;
    case 'list':
      console.table(botManager.listBots());
      break;
    case 'chatAll':
      const { messageAll } = await prompts({ type: 'text', name: 'messageAll', message: 'Enter message:' });
      botManager.chatAll(messageAll);
      break;
    case 'chat':
      const { username, message } = await prompts([
        { type: 'text', name: 'username', message: 'Enter bot username:' },
        { type: 'text', name: 'message', message: 'Enter message:' },
      ]);
      botManager.chat(username, message);
      break;
    case 'follow':
      const { playerName } = await prompts({ type: 'text', name: 'playerName', message: 'Enter player name:' });
      botManager.chatAll(`follow ${playerName}`);
      break;
    case 'randomWalk':
      botManager.chatAll('randomwalk');
      break;
    case 'jump':
      botManager.chatAll('jump');
      break;
    case 'look':
      botManager.chatAll('look');
      break;
    case 'positions':
      botManager.connectedBots.forEach(bot => {
        log.info(`${bot.username}: ${JSON.stringify(bot.bot.entity.position)}`);
      });
      break;
    case 'exit':
      botManager.disconnectAll();
      process.exit(0);
  }

  mainMenu();
}

export function startCli() {
  console.log(chalk.bold.cyan('Minecraft Bot Controller'));
  mainMenu();
}
