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

  async update(email: string, data: any) {
    const user = await this.get(email);
    Object.keys(data).forEach((key) => {
      if (user.hasOwnProperty(key)) {
        if (Array.isArray(user[key])) {
          user[key] = user[key].concat(data[key]);
        } else {
          user[key] = data[key];
        }
      }
    });
    return await this.set(email, user);
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
