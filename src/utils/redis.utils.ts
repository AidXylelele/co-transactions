import { Redis } from "ioredis";
import { ParseUtil } from "./parse.util";
import {
  Injection,
  RedisChannels,
  RedisCollection,
  Update,
} from "src/types/redis.types";
import { Collection } from "src/types/common.types";

export class RedisUtil extends ParseUtil {
  private sub: Redis;
  private pub: Redis;
  private pool: Redis;
  public channels: RedisChannels;
  constructor(sub: Redis, pub: Redis, pool: Redis, templates: RedisCollection) {
    super();
    this.sub = sub;
    this.pub = pub;
    this.pool = pool;
    this._init(templates);
  }

  generateChannels(pattern: string, templates: RedisCollection) {
    const result: RedisCollection = {};
    const entries = Object.entries(templates);
    for (const [key, value] of entries) {
      const filled: Collection<string> = {};
      for (const item in value) {
        const template = value[item];
        filled[item] = pattern + template;
      }
      result[key] = filled;
    }
    return result;
  }

  setChannels(templates: RedisCollection) {
    const requests = this.generateChannels("req", templates);
    const responses = this.generateChannels("res", templates);
    this.channels = { requests, responses };
  }

  private async _init(templates: RedisCollection) {
    const subscriptions = [];
    this.setChannels(templates);
    const allChannelTypes = Object.values(this.channels);
    for (const channelType of allChannelTypes) {
      for (const channels in channelType) {
        const values = Object.values(channelType[channels]);
        for (const value of values) {
          const subscription = this.subscribe(value);
          subscriptions.push(subscription);
        }
      }
    }
    await Promise.all(subscriptions);
  }

  async subscribe(channel: string) {
    await this.sub.subscribe(channel);
  }

  async publish(channel: string, input: any) {
    const stringified = this.stringify(input);
    await this.pub.publish(channel, stringified);
  }

  async keys(pattern: string) {
    const result = await this.pool.keys(pattern);
    return result;
  }

  async get(email: string) {
    const data = await this.pool.get(email);
    return this.parse(data);
  }

  async getAll() {
    const result: any = {};
    const pattern = "*";
    const keys = await this.keys(pattern);
    const pipeline = this.pool.pipeline();
    keys.forEach((key: string) => {
      pipeline.get(key);
    });
    const values = await pipeline.exec();
    values.forEach((item: any, idx: number) => {
      const key = keys[idx];
      const value = item[1];
      result[key] = value;
    });
    return result;
  }

  async set(email: string, input: any) {
    const stringified = this.stringify(input);
    await this.set(email, stringified);
  }

  async inject<T>(email: string, input: Injection<T>) {
    const user = await this.get(email);
    for (const key in input) {
      if (!user.hasOwnProperty(key)) continue;
      user[key] = user[key].concat(input[key]);
    }
  }

  async update<T>(email: string, input: Update<T>) {
    const user = await this.get(email);
    for (const key in input) {
      if (!user.hasOwnProperty(key)) continue;
      user[key] = input[key];
    }
  }
}
