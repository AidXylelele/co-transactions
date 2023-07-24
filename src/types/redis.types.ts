import { Collection } from "./common.types";

export type RedisConnection = {
  port: number;
  host: string;
  username: string;
  password: string;
  db: number;
};

export type RedisCollection = {
  [key: string]: Collection<string>;
};

export type RedisChannels = {
  requests: RedisCollection;
  responses: RedisCollection;
};

export type Injection<T> = {
  [key: string]: T[];
};

export type Update<T> = {
  [key: string]: T;
};
