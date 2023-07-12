import { Transaction, WithdrawTransaction } from "src/types/paypal.types";

export class RedisUtil {
  constructor(public client: any) {
    this.client = client;
  }

  async get(email: string) {
    return await this.client.get(email);
  }

  async set(email: string, input: string) {
    return await this.client.set(email, input);
  }

  async update(email: string, input: Transaction[] | WithdrawTransaction[]) {
    const data = await this.get(email).then(this.parse);
    data.transactions = data.transactions.concat(input);
    const updatedData = this.stringify(data);
    return await this.set(email, updatedData);
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
