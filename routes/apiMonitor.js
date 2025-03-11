import fs from "fs";
import path from "path";
import mongoose from "mongoose";

const logFilePath = path.join(path.resolve(), "server.log");

export const apiMonitor = async (req, res) => {
  const PORT = process.env.PORT || 5000;
  const ENVIRONMENT = process.env.ENVIRONMENT || "Production";
  const VERSION = process.env.VERSION || "1.0.0";
  const LAST_RELEASE_DATE = process.env.LAST_RELEASE_DATE;

  // Get MongoDB connection status
  const dbStatus = mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";

  // Get server uptime in a readable format
  const formatUptime = (uptime) => {
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const serverUptime = formatUptime(process.uptime());

  // Write server and DB statuses to log file
  const logMessage = `
    Server Status: Running
    Environment: ${ENVIRONMENT}
    Port: ${PORT}
    MongoDB Connection: ${dbStatus}
    Uptime: ${serverUptime}
  `;

  fs.appendFileSync(logFilePath, `${logMessage}\n`);

  // Send HTML response
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Server Status</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #4CAF50; }
          .status { margin: 10px 0; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
          .connected { color: green; }
          .disconnected { color: red; }
        </style>
      </head>
      <body>
        <h1>Server ${ENVIRONMENT} Version : ${VERSION}</h1>
        <div class="status">Server status: <strong>Running</strong></div>
        <div class="status">Environment: <strong>${ENVIRONMENT}</strong></div>
        <div class="status">Database connection: 
        <strong class="${dbStatus === 'Connected' ? 'connected' : 'disconnected'}">${dbStatus}</strong>
        </div>
        <div class="status">Uptime: <strong>${serverUptime}</strong></div>
        <div class="status">Last release date: <strong>${LAST_RELEASE_DATE}</strong></div>
      </body>
    </html>
  `);
};
