import { Collection } from "./common.types";

export type RedisConnection = {
  port: number;
  host: string;
  username: string;
  password: string;
  db: number;
};

export type ChannelsCollection = {
  [key: string]: Collection<string>;
};

export type RedisChannels = {
  requests: ChannelsCollection;
  response: ChannelsCollection;
};

export type Injection<T> = {
  [key: string]: T[];
};

export type Update<T> = {
  [key: string]: T;
};
