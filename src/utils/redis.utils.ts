export class RedisUtil {
  constructor(public client: any) {
    this.client = client;
  }

  stringify(message: any) {
    return JSON.stringify(message);
  }

  parse(message: string) {
    return JSON.parse(message);
  }

  publish(channel: string, response: any) {
    const stringifiedResponse = this.stringify(response);
    return this.client.publish(channel, stringifiedResponse);
  }
}
