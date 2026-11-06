import Queue from 'bull';
import redis from '../config/redis';

// Create queues
export const scanQueue = new Queue('scan-jobs', {
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
    },
});

export const reportQueue = new Queue('report-jobs', {
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_HOST || '6379'),
        password: process.env.REDIS_PASSWORD,
    },
});

// Queue event handlers
scanQueue.on('completed', (job, result) => {
    console.log(`✅ Scan job ${job.id} completed`);
});

scanQueue.on('failed', (job, err) => {
    console.error(`❌ Scan job ${job?.id} failed:`, err.message);
});

reportQueue.on('completed', (job, result) => {
    console.log(`✅ Report job ${job.id} completed`);
});

reportQueue.on('failed', (job, err) => {
    console.error(`❌ Report job ${job?.id} failed:`, err.message);
});

export class QueueService {
    static async addScanJob(data: any) {
        return await scanQueue.add(data, {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 2000,
            },
            timeout: 3600000, // 1 hour
        });
    }

    static async addReportJob(data: any) {
        return await reportQueue.add(data, {
            attempts: 2,
            timeout: 600000, // 10 minutes
        });
    }

    static async getScanJobStatus(jobId: string) {
        const job = await scanQueue.getJob(jobId);
        if (!job) return null;

        return {
            id: job.id,
            data: job.data,
            progress: await job.progress(),
            state: await job.getState(),
            result: job.returnvalue,
            failedReason: job.failedReason,
        };
    }
}
