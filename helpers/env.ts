import z from "zod";

import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  NOTION_TOKEN: z.string(),
  TRENDYOL_PRODUCT_DATABASE: z.string(),
  TRENDYOL_PHONES_DATABASE: z.string(),
  TRENDYOL_PRODUCT_MODAL_CODE_DATABASE: z.string(),
  TRENDYOL_PRODUCT_BARCODE_DATABASE: z.string(),
});

export const ENV = envSchema.parse(process.env);
