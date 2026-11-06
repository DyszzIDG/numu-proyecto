
import { GeneratorResult } from './universal-generator';

export const generateNucleiCommand = async (params: Record<string, any>): Promise<GeneratorResult> => {
    const target = params.target as string;

    if (!target) {
        return { success: false, error: 'Target is required' };
    }

    // Using the docker container name from docker-compose
    const command = `docker exec csirt-nuclei nuclei -u ${target} -json`;

    return {
        success: true,
        command,
        description: `Running Nuclei scan on ${target}`
    };
};
