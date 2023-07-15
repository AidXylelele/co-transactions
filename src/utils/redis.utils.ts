export class RedisUtil {
  private pattern: string;

  constructor(public client: any) {
    this.client = client;
    this.pattern = "*";
  }

  async get(email: string) {
    return await this.client.get(email).then(this.parse);
  }

  async getAll() {
    const data: any = {};
    const keys = await this.client.keys(this.pattern);
    const pipeline = this.client.pipeline();

    keys.forEach((key: string) => {
      pipeline.get(key);
    });

    const values = await pipeline.exec();

    values.forEach((result: any, index: number) => {
      const key = keys[index];
      const value = result[1];
      data[key] = this.parse(value);
    });

    return data;
  }

  async set(email: string, input: any) {
    const stringifiedInput = this.stringify(input);
    return await this.client.set(email, stringifiedInput);
  }

  async update(email: string, update: any) {
    const userData = await this.get(email);
    Object.keys(update).forEach((key) => {
      if (userData.hasOwnProperty(key)) {
        if (Array.isArray(userData[key])) {
          userData[key] = userData[key].concat(update[key]);
        } else {
          userData[key] = update[key];
        }
      }
    });
    return await this.set(email, userData);
  }

  stringify(message: any) {
    return JSON.stringify(message);
  }

  parse(message: string): any {
    return JSON.parse(message);
  }

  publish(channel: string, response: any) {
    const stringifiedResponse = this.stringify(response);
    return this.client.publish(channel, stringifiedResponse);
  }
}
