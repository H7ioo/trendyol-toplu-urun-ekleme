import { Client } from "@notionhq/client";
import { z } from "zod";

import dotenv from "dotenv";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

let envSchema = z.object({
  NOTION_TOKEN: z.string().nonempty(),
  TRENDYOL_PRODUCT_DATABASE: z.string().nonempty(),
  TRENDYOL_PHONES_DATABASE: z.string().nonempty(),
  TRENDYOL_MODAL_CODE_DATABASE: z.string().nonempty(),
  TRENDYOL_PRODUCT_BARCODE_DATABASE: z.string().nonempty(),
});

let env = envSchema.parse(process.env);

dotenv.config();

// TODO: Add the desc to the page it self inside a code block

interface TrendyolNotionProps {
  // Product
  title: string;
  // ParseInt()
  price: number;
  piyasa: number;
  mainModalCode: string;
  //
}

export const trendyolNotion = async ({ title }: TrendyolNotionProps) => {
  const response = await notion.pages.create({
    parent: {
      database_id: env.TRENDYOL_PRODUCT_DATABASE,
    },
    icon: {
      type: "emoji",
      emoji: "😳",
    },
    properties: {
      Name: {
        type: "title",
        title: [
          {
            type: "text",
            text: {
              content: "Lazer Panda Stantli Kilif",
            },
          },
        ],
      },
      // TODO: To much pain to do
      "Product Group ID": {
        type: "relation",
        relation: [{ id: "82fb4113ac0c40588a5a356f29f29646" }],
      },
      Fiyat: {
        type: "number",
        number: 100,
      },
      Piyasa: {
        type: "number",
        number: 100,
      },
    },
  });
  console.log(response);
};
