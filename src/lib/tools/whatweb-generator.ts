
import { GeneratorResult } from './universal-generator';

export const generateWhatWebCommand = async (params: Record<string, any>): Promise<GeneratorResult> => {
    const target = params.target as string;

    if (!target) {
        return { success: false, error: 'Target is required' };
    }

    const command = `docker exec csirt-whatweb ./whatweb ${target} --log-json=-`;

    return {
        success: true,
        command,
        description: `Running WhatWeb identification on ${target}`
    };
};
