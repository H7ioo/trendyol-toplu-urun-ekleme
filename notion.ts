import { Client } from "@notionhq/client";

import { WithAuth } from "@notionhq/client/build/src/Client";
import { CreatePageParameters } from "@notionhq/client/build/src/api-endpoints";
import { ENV } from "./env";

const notion = new Client({
  auth: ENV.NOTION_TOKEN,
});

interface TrendyolNotionProps {
  createProduct: {
    // Product
    title: string;
    // ParseFloat() ! Trendyol uses . | Hepsiburada uses , .replace(/,/gi, ".")
    price: number;
    piyasa: number;
    mainModalCode: string;
    // Page Content
    description: string;
  };
  createModelCode: {
    modelCode: string;
    relationId: string;
  };
  createBarcode: {
    barcode: string;
    relationId: string;
  };
}

export const trendyolNotionCreateProduct = async ({
  title,
  price,
  piyasa,
  mainModalCode,
  description,
}: TrendyolNotionProps["createProduct"]) => {
  const productObj: WithAuth<CreatePageParameters> = {
    parent: {
      database_id: ENV.TRENDYOL_PRODUCT_DATABASE,
    },
    children: [
      {
        type: "heading_3",
        heading_3: {
          rich_text: [{ type: "text", text: { content: "Açıklama" } }],
        },
      },
      {
        type: "code",
        code: {
          rich_text: [{ type: "text", text: { content: description } }],
          language: "html",
        },
      },
    ],
    // icon: {
    //   type: "emoji",
    //   emoji: "",
    // },
    properties: {
      Name: {
        type: "title",
        title: [
          {
            type: "text",
            text: {
              content: title,
            },
          },
        ],
      },
      // "Product Group ID": {
      //   type: "relation",
      //   relation: [{ id: "82fb4113ac0c40588a5a356f29f29646" }],
      // },
      Piyasa: {
        type: "number",
        number: piyasa,
      },
      Fiyat: {
        type: "number",
        number: price,
      },
      "Ana Model Kodu": {
        type: "rich_text",
        rich_text: [{ type: "text", text: { content: mainModalCode } }],
      },
    },
  };
  const productRes = await notion.pages.create(productObj);

  const productId = productRes.id;
  return productId;
};

export const trendyolNotionCreateModelCode = async ({
  modelCode,
  relationId,
}: TrendyolNotionProps["createModelCode"]) => {
  const modelObj: WithAuth<CreatePageParameters> = {
    parent: {
      database_id: ENV.TRENDYOL_PRODUCT_MODAL_CODE_DATABASE,
    },
    properties: {
      "Model Kodu": {
        type: "title",
        title: [
          {
            type: "text",
            text: {
              content: modelCode,
            },
          },
        ],
      },
      Ürün: {
        type: "relation",
        relation: [{ id: relationId }],
      },
    },
  };
  const modelRes = await notion.pages.create(modelObj);

  const modelId = modelRes.id;
  return modelId;
};

export const trendyolNotionCreateBarcode = async ({
  barcode,
  relationId,
}: TrendyolNotionProps["createBarcode"]) => {
  const modelObj: WithAuth<CreatePageParameters> = {
    parent: {
      database_id: ENV.TRENDYOL_PRODUCT_BARCODE_DATABASE,
    },
    properties: {
      Barkod: {
        type: "title",
        title: [
          {
            type: "text",
            text: {
              content: barcode,
            },
          },
        ],
      },
      "Model Kodu": {
        type: "relation",
        relation: [{ id: relationId }],
      },
    },
  };
  const modelRes = await notion.pages.create(modelObj);

  const modelId = modelRes.id;
  return modelId;
};
