
import { GeneratorResult } from './universal-generator';

export const generateTestSSLCommand = async (params: Record<string, any>): Promise<GeneratorResult> => {
    const target = params.target as string;

    if (!target) {
        return { success: false, error: 'Target is required' };
    }

    // Output to stdout for now to catch it in execution log, or we could redirect to file
    // For universal generator flow, we often want the output in stdout to be captured by the runner
    const command = `docker exec csirt-testssl testssl.sh --jsonfile /dev/stdout ${target}`;

    return {
        success: true,
        command,
        description: `Running testssl.sh analysis on ${target}`
    };
};
