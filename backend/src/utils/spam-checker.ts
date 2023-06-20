interface IpLog {
  ip: string;
  attempts: number;
  timer: number;
}

/*
  Essa classe foi feita com intuito de prevenir que o mesmo cliente faça
  muitas requisições em curto espaço de tempo (essa classe, por exemplo,
  é utilizada no UserController para prevenir spam de cadastros).
  Há várias maneiras do usuário burlar esta checagem, portanto, essa
  classe serve apenas para prevenir que usuários comuns spamem.
*/
export abstract class SpamChecker {

  private static readonly TIMER_IN_SECONDS = 60; 
  private static intervalTimer: NodeJS.Timer = null;
  private static logs: IpLog[] = [];

  /*
    Essa função itera sobre o array "this.logs" a cada 1 segundo,
    diminuindo o "timer" de cada IpLog em um segundo, quando o
    mesmo chega à 0, ele é retirado dos logs.
  */
  private static startDecreasingAndRemovingLogs(): void {
    if (this.intervalTimer) {
      clearInterval(this.intervalTimer);
      this.intervalTimer = null;
    }

    this.intervalTimer = setInterval(() => {
      this.logs.forEach((ipLog: IpLog, index: number) => {
        // Se o timer for <= 0, ele é removido do array
        if (ipLog.timer <= 0) {
          this.logs.splice(index, 1);
        // Caso contrário, apenas decrementa o timer
        } else { 
          ipLog.timer--;
        }
      });
    // Este interval roda a cada 1 segundo
    }, 1000);
  }

  // Checa se o ip fornecido apareceu muitas vezes em um curto espaço de tempo nos logs
  public static isSpam(ip: string): boolean {
    if (this.intervalTimer == null) {
      this.startDecreasingAndRemovingLogs();
    }

    let inLog = false;

    for (let i = 0; i < this.logs.length; i++) {
      const ipLog = this.logs[i];

      // Se o ip está presente nos logs, incrementa os attempts
      if (ip == ipLog.ip) {
        inLog = true;
        ipLog.attempts++;
      }

      // Se as tentativas passaram de duas, volta o timer e retorna true
      if (ipLog.attempts > 2) {
        ipLog.timer = this.TIMER_IN_SECONDS;
        return true;
      }
    }

    // Se o ip não está nos logs, cria um novo log para ele
    if (!inLog) {
      this.logs.push({
        ip: ip,
        attempts: 1,
        timer: this.TIMER_IN_SECONDS
      })
    }

    return false;
  }
}