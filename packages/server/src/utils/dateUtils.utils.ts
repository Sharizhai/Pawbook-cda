export class DateHelper {
    static daysAgo(days: number): Date {
        return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    }

    static hoursAgo(hours: number): Date {
        return new Date(Date.now() - hours * 60 * 60 * 1000);
    }

    static minutesAgo(minutes: number): Date {
        return new Date(Date.now() - minutes * 60 * 1000);
    }

    static daysFromNow(days: number): Date {
        return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    }

    static hoursFromNow(hours: number): Date {
        return new Date(Date.now() + hours * 60 * 60 * 1000);
    }

    static toISOString(date: Date): string {
        return date.toISOString();
    }

    static fixedDate(dateString: string): Date {
        return new Date(dateString);
    }

    static isRecent(date: Date, minutesThreshold: number = 5): boolean {
        const threshold = Date.now() - (minutesThreshold * 60 * 1000);
        return date.getTime() > threshold;
    }
}