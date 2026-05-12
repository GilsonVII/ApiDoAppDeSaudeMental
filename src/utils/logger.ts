export class Logger {
    
    private static getTimestamp(): string {
        return new Date().toISOString();
    }

    static info(message: string, ...optionalParams: unknown[]) {
        console.log(`\x1b[36m[INFO]\x1b[0m [${this.getTimestamp()}] ${message}`, ...optionalParams);
    }

    static warn(message: string, ...optionalParams: unknown[]) {
        console.warn(`\x1b[33m[WARN]\x1b[0m [${this.getTimestamp()}] ⚠️ ${message}`, ...optionalParams);
    }

    static error(message: string, error?: unknown) {
        console.error(`\x1b[31m[ERROR]\x1b[0m [${this.getTimestamp()}] ❌ ${message}`);
        if (error) {
            console.error(error);
        }
    }
}
