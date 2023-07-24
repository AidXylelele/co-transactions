import { ConfigureOptions } from "paypal-rest-sdk";

export const paypalConfig: ConfigureOptions = {
  mode: "sandbox",
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
};
