"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpamChecker = void 0;
class SpamChecker {
    static startDecreasingAndRemovingLogs() {
        if (this.intervalTimer) {
            clearInterval(this.intervalTimer);
            this.intervalTimer = null;
        }
        this.intervalTimer = setInterval(() => {
            this.logs.forEach((ipLog, index) => {
                if (ipLog.timer <= 0) {
                    this.logs.splice(index, 1);
                }
                else {
                    ipLog.timer--;
                }
            });
        }, 1000);
    }
    static isSpam(ip) {
        if (this.intervalTimer == null) {
            this.startDecreasingAndRemovingLogs();
        }
        let inLog = false;
        for (let i = 0; i < this.logs.length; i++) {
            const ipLog = this.logs[i];
            if (ip == ipLog.ip) {
                inLog = true;
                ipLog.attempts++;
            }
            if (ipLog.attempts > 2) {
                ipLog.timer = this.TIMER_IN_SECONDS;
                return true;
            }
        }
        if (!inLog) {
            this.logs.push({
                ip: ip,
                attempts: 1,
                timer: this.TIMER_IN_SECONDS
            });
        }
        return false;
    }
}
exports.SpamChecker = SpamChecker;
SpamChecker.TIMER_IN_SECONDS = 60;
SpamChecker.intervalTimer = null;
SpamChecker.logs = [];
//# sourceMappingURL=spam-checker.js.map