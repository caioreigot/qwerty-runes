export declare abstract class SpamChecker {
    private static readonly TIMER_IN_SECONDS;
    private static intervalTimer;
    private static logs;
    private static startDecreasingAndRemovingLogs;
    static isSpam(ip: string): boolean;
}
