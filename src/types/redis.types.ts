export type RedisConfig = {
  port: number;
  host: string;
  username: string;
  password: string;
  db: number;
};

export type Channels = {
  [key: string]: string;
};
