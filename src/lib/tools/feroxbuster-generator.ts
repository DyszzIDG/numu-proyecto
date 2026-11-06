
import { GeneratorResult } from './universal-generator';

export const generateFeroxbusterCommand = async (params: Record<string, any>): Promise<GeneratorResult> => {
    const url = params.url as string;

    if (!url) {
        return { success: false, error: 'Target URL is required' };
    }

    const command = `docker exec csirt-feroxbuster feroxbuster -u ${url} --json --time-limit 5m`;

    return {
        success: true,
        command,
        description: `Running Feroxbuster content discovery on ${url}`
    };
};
