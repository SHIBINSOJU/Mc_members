# Minecraft Bot Controller Instructions

## Prerequisites

- Node.js (v16 or higher)
- A Minecraft server (online or offline mode)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/SHIBINSOJU/Mc_members.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Mc_members
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

## Configuration

1. **Server Configuration:**
   - Open the `config/server.json` file.
   - Configure the server details:
     - `host`: The server IP address.
     - `port`: The server port.
     - `version`: The Minecraft version of the server.
     - `online_mode`: Set to `true` for online-mode servers, `false` for offline-mode servers.
   - Configure the bot details:
     - `count`: The number of bots to connect.
     - `prefix`: The prefix for the bot names.
     - `connection_delay`: The delay between each bot connection in milliseconds.
     - `auto_reconnect`: Set to `true` to enable auto-reconnect.
     - `max_retries`: The maximum number of reconnect attempts.

2. **Authentication (for online-mode servers):**
   - Create a `.env` file in the root of the project.
   - Add your Microsoft account credentials to the `.env` file:
     ```
     MICROSOFT_EMAIL=your_email@example.com
     MICROSOFT_PASSWORD=your_password
     ```

## Running the Application

To start the bot controller, run the following command:

```bash
node index.js
```

This will start the interactive CLI, where you can connect, disconnect, and control the bots.
