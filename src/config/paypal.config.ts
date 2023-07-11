import { PayPalConfig } from "src/types/paypal.types";

export const config: PayPalConfig = {
  mode: "sandbox",
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
};
