import { exec } from 'child_process';
import util from 'util';
import path from 'path';

const execPromise = util.promisify(exec);

/**
 * Docker Runner for Security Scanning Tools
 * UPDATED: Uses 'csirt-toolbox' (unified Kali container) for most CLI tools.
 */

export class DockerRunner {
    private static getComposePath(): string {
        return path.join(process.cwd(), 'csirt-tools');
    }

    /**
     * Helper to run a tool inside the persistent Toolbox container
     */
    static async runInToolbox(toolCommand: string, timeoutMs: number = 300000): Promise<string> {
        return this.runTool('toolbox', `exec csirt-toolbox ${toolCommand}`, timeoutMs, true);
    }

    /**
     * Run a tool via docker-compose from the csirt-tools directory
     * @param execMode If true, uses 'docker exec' logic (for toolbox), else 'docker-compose run'
     */
    static async runTool(serviceName: string, args: string, timeoutMs: number = 300000, execMode: boolean = false): Promise<string> {
        try {
            console.log(`🚀 Executing ${serviceName}: ${args}`);

            let command;
            if (execMode) {
                // For toolbox, use docker exec directly (container_name in compose is 'csirt-toolbox')
                command = `docker exec csirt-toolbox ${args.replace('exec csirt-toolbox ', '')}`;
            } else {
                command = `docker-compose run --rm ${serviceName} ${args}`;
            }

            const { stdout, stderr } = await execPromise(command, {
                cwd: this.getComposePath(),
                timeout: timeoutMs,
                env: { ...process.env, PATH: process.env.PATH }
            });

            if (stderr) console.warn(`⚠️ stderr (${serviceName}):`, stderr.substring(0, 200));

            return stdout || stderr || 'Execution completed.';
        } catch (error: any) {
            console.error(`❌ Execution error (${serviceName}):`, error.message);
            if (error.stdout) return error.stdout;

            // Check for Docker daemon not running
            if (error.message.includes('docker API') ||
                error.message.includes('daemon') ||
                error.message.includes('pipe/dockerDesktopLinuxEngine') ||
                error.message.includes('Cannot connect to the Docker daemon')) {
                throw new Error('Docker Desktop no está corriendo. Por favor:\n1. Inicia Docker Desktop\n2. Espera a que esté completamente iniciado\n3. Ejecuta: cd csirt-tools && docker-compose up -d\n4. Intenta nuevamente');
            }

            // Provide a helpful message if toolbox is down
            if (serviceName === 'toolbox' && error.message.includes('No such container')) {
                throw new Error("El contenedor 'Kali Toolbox' no está corriendo. Por favor ejecuta:\ncd csirt-tools && docker-compose up -d");
            }

            // Check if container is not running
            if (error.message.includes('is not running') || error.message.includes('No such container')) {
                throw new Error(`El contenedor '${serviceName}' no está disponible. Ejecuta:\ncd csirt-tools && docker-compose up -d`);
            }

            throw new Error(`Error ejecutando ${serviceName}: ${error.message}`);
        }
    }

    // ===== DEDICATED CONTAINERS =====

    /**
     * FIX: target always appended to args, never lost
     */
    static async runNmap(target: string, args: string = ''): Promise<string> {
        const fullArgs = args ? `${args} ${target}` : `-sV -F -T4 ${target}`;
        return this.runTool('nmap', fullArgs);
    }

    static async runNuclei(target: string): Promise<string> {
        return this.runInToolbox(`nuclei -u ${target} -silent -nc`);
    }

    static async runSqlMap(target: string): Promise<string> {
        return this.runInToolbox(`sqlmap -u "${target}" --batch --banner --level=1`);
    }

    static async runYara(target: string): Promise<string> {
        // YARA requires rule files; return version as health check
        return this.runInToolbox(`yara --version`);
    }

    static async runZap(target: string): Promise<string> {
        return this.runTool('zap', `zap-baseline.py -t ${target}`);
    }

    static async runWpscan(target: string): Promise<string> {
        try {
            const { stdout, stderr } = await execPromise(`docker run --rm wpscanteam/wpscan --url ${target} --no-header --no-banner`, {
                timeout: 300000
            });
            return stdout || stderr || 'WPScan Completed';
        } catch (e: any) {
            return e.stdout || e.message;
        }
    }

    static async runSubfinder(target: string): Promise<string> {
        try {
            const { stdout, stderr } = await execPromise(`docker run --rm projectdiscovery/subfinder -d ${target} -silent`, {
                timeout: 300000
            });
            return stdout || stderr || 'Subfinder Completed';
        } catch (e: any) {
            return e.stdout || e.message;
        }
    }

    // ===== TOOLBOX TOOLS (KALI) =====

    // Reconnaissance
    static async runAmass(target: string): Promise<string> {
        return this.runInToolbox(`amass enum -d ${target} -passive`);
    }

    static async runTheHarvester(target: string): Promise<string> {
        return this.runInToolbox(`theHarvester -d ${target} -b google,bing -l 50`);
    }

    static async runSublist3r(target: string): Promise<string> {
        return this.runInToolbox(`sublist3r -d ${target}`);
    }

    static async runDnsRecon(target: string): Promise<string> {
        return this.runInToolbox(`dnsrecon -d ${target}`);
    }

    static async runWhatWeb(target: string): Promise<string> {
        return this.runInToolbox(`whatweb ${target} -v`);
    }

    // Web Security
    static async runGobuster(target: string): Promise<string> {
        return this.runInToolbox(`gobuster dir -u ${target} -w /usr/share/wordlists/dirb/common.txt --no-error -q`);
    }

    static async runNikto(target: string): Promise<string> {
        return this.runInToolbox(`nikto -h ${target} -maxtime 60s`);
    }

    static async runFeroxbuster(target: string): Promise<string> {
        return this.runInToolbox(`feroxbuster -u ${target} --depth 2 --quiet --no-state`);
    }

    static async runWfuzz(target: string): Promise<string> {
        return this.runInToolbox(`wfuzz -c -z file,/usr/share/wordlists/dirb/common.txt --hc 404 ${target}/FUZZ`);
    }

    static async runCommix(target: string): Promise<string> {
        return this.runInToolbox(`commix --url="${target}" --batch`);
    }

    static async runTestSSL(target: string): Promise<string> {
        return this.runInToolbox(`testssl.sh --fast --color 0 ${target}`);
    }

    // Network & Forensics
    static async runMasscan(target: string): Promise<string> {
        // Needs root usually, container runs as root
        return this.runInToolbox(`masscan ${target} -p80,443,8080,8443 --rate=1000`);
    }

    static async runHping3(target: string): Promise<string> {
        return this.runInToolbox(`hping3 -c 3 -S ${target}`);
    }

    static async runRadare2(target: string): Promise<string> {
        // FIX: return version info (r2 is interactive; non-interactive use needs a file)
        return this.runInToolbox(`r2 -v`);
    }

    // Legacy / Others
    static async runMetasploit(): Promise<string> {
        // FIX: added -q flag to suppress banner and avoid timeout
        return this.runTool('metasploit', `msfconsole -q -x "version; exit"`);
    }

    static async runLynis(): Promise<string> {
        // FIX: use 'audit system --quick' instead of broken 'show version'
        return this.runInToolbox(`lynis audit system --quick --no-colors`);
    }
}
