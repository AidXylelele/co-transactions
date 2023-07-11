export class RedisUtil {
  constructor(public client: any) {
    this.client = client;
  }

  async get(email: string) {
    return await this.client.get(email);
  }

  async save(email: string, data: any) {
    const stringifiedData = this.stringify(data);
    await this.client.set(email, stringifiedData);
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
