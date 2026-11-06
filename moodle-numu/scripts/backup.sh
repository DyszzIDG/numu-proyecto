#!/bin/bash
# NUMU Moodle - Backup Script
# Automated daily backups

BACKUP_DIR="/var/www/moodledata/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="moodle_backup_$DATE"

echo "Starting backup: $BACKUP_NAME"

# Backup database
echo "Backing up database..."
docker exec numu_moodle_db pg_dump -U moodle_user moodle_numu | gzip > "$BACKUP_DIR/${BACKUP_NAME}_db.sql.gz"

# Backup moodledata
echo "Backing up moodledata..."
tar -czf "$BACKUP_DIR/${BACKUP_NAME}_data.tar.gz" -C /var/www moodledata

# Delete backups older than 30 days
echo "Cleaning old backups..."
find "$BACKUP_DIR" -name "moodle_backup_*" -mtime +30 -delete

echo "Backup completed: $BACKUP_NAME"
