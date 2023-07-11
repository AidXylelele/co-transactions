export class RedisUtil {
  stringify(message: any) {
    return JSON.stringify(message);
  }
  parse(message: string) {
    return JSON.parse(message);
  }
}
