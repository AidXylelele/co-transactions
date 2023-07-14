export class RedisUtil {
  private pattern: string;

  constructor(public client: any) {
    this.client = client;
    this.pattern = "*";
  }

  async get(email: string) {
    return await this.client.get(email).then(this.parse);
  }

  async set(email: string, input: any) {
    const stringifiedInput = this.stringify(input);
    return await this.client.set(email, stringifiedInput);
  }

  async getAll() {
    const allData: Promise<any>[] = [];
    await this.client.keys(this.pattern, (error: Error, keys: string[]) => {
      if (error) return console.log(error);

      keys.forEach((key: string) => {
        allData.push(this.get(key));
      });
    });
    return await Promise.all(allData);
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
