export type Collection<T> = {
  [key: string]: T;
};

export type Initializable<Instance, Item> = new (arg: Item) => Instance;
