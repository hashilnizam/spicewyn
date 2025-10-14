import { google } from 'googleapis';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import BackupLog from '../models/BackupLog.js';
import logger from './logger.js';

const execAsync = promisify(exec);

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_DRIVE_CLIENT_ID,
  process.env.GOOGLE_DRIVE_CLIENT_SECRET,
  process.env.GOOGLE_DRIVE_REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_DRIVE_REFRESH_TOKEN
});

const drive = google.drive({ version: 'v3', auth: oauth2Client });

export const createBackup = async (triggeredBy = null) => {
  const backupLog = new BackupLog({
    fileName: `backup-${Date.now()}.gz`,
    status: 'in_progress',
    type: triggeredBy ? 'manual' : 'automatic',
    triggeredBy,
    startedAt: new Date()
  });

  await backupLog.save();

  try {
    // Create backup directory if it doesn't exist
    const backupDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const backupPath = path.join(backupDir, backupLog.fileName);
    
    // Extract MongoDB URI parts
    const uri = new URL(process.env.MONGO_URI);
    const dbName = uri.pathname.slice(1).split('?')[0];
    
    // Create mongodump command
    const dumpCommand = `mongodump --uri="${process.env.MONGO_URI}" --archive="${backupPath}" --gzip`;
    
    logger.info('Starting database backup...');
    await execAsync(dumpCommand);
    
    const stats = fs.statSync(backupPath);
    backupLog.fileSize = stats.size;

    // Upload to Google Drive
    const fileMetadata = {
      name: backupLog.fileName,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID]
    };

    const media = {
      mimeType: 'application/gzip',
      body: fs.createReadStream(backupPath)
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, webViewLink'
    });

    backupLog.fileUrl = response.data.webViewLink;
    backupLog.status = 'completed';
    backupLog.completedAt = new Date();
    
    await backupLog.save();

    // Clean up local file
    fs.unlinkSync(backupPath);

    logger.info(`Backup completed: ${backupLog.fileName}`);
    return backupLog;

  } catch (error) {
    backupLog.status = 'failed';
    backupLog.error = error.message;
    backupLog.completedAt = new Date();
    await backupLog.save();
    
    logger.error('Backup failed:', error);
    throw error;
  }
};

export const scheduleBackup = async (interval) => {
  // This would integrate with node-cron in the main server file
  const cronSchedule = interval === 'hourly' ? '0 * * * *' : '0 0 * * *';
  return cronSchedule;
};
