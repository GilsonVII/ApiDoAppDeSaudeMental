export class Logger {
    
    private static getTimestamp(): string {
        return new Date().toISOString();
    }

    static info(message: string, ...optionalParams: any[]) {
        console.log(`[INFO] [${this.getTimestamp()}] ${message}`, ...optionalParams);
    }

    static warn(message: string, ...optionalParams: any[]) {
        console.warn(`[WARN] [${this.getTimestamp()}] ⚠️ ${message}`, ...optionalParams);
    }

    static error(message: string, error?: any) {
        console.error(`[ERROR] [${this.getTimestamp()}] ❌ ${message}`);
        if (error) {
            console.error(error);
        }
    }
}