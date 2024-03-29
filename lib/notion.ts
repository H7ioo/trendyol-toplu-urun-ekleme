import { Client } from "@notionhq/client";

import { WithAuth } from "@notionhq/client/build/src/Client";
import {
  CreatePageParameters,
  QueryDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { ENV } from "../helpers/env";
import { CompanyType } from "../types/types";
import { lengthValidator } from "../helpers/utils";

// const notion = new Client({
//   auth: ENV.NOTION_TOKEN,
// });

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
  const notion = new Client({
    auth: ENV.NOTION_TOKEN,
  });

  // TODO: Create ENV variables or something similar for the properties names etc.
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
  const notion = new Client({
    auth: ENV.NOTION_TOKEN,
  });

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
  const notion = new Client({
    auth: ENV.NOTION_TOKEN,
  });

  const barcodeObj: WithAuth<CreatePageParameters> = {
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
  const barcodeRes = await notion.pages.create(barcodeObj);

  const barcodeId = barcodeRes.id;
  return barcodeId;
};

interface HepsiburadaNotionProps {
  createProduct: {
    // Product
    title: string;
    // ParseFloat() ! Trendyol uses . | Hepsiburada uses , .replace(/,/gi, ".")
    price: number;
    mainModalCode: string;
    // Page Content
    description: string;
  };
  createStockCode: {
    stockCode: string;
    relationId: string;
  };
  createBarcode: {
    barcode: string;
    relationId: string;
  };
}

export const hepsiburadaNotionCreateProduct = async ({
  title,
  price,
  mainModalCode,
  description,
}: HepsiburadaNotionProps["createProduct"]) => {
  const notion = new Client({
    auth: ENV.NOTION_TOKEN,
  });

  const productObj: WithAuth<CreatePageParameters> = {
    parent: {
      database_id: ENV.HEPSIBURADA_PRODUCT_DATABASE,
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
    properties: {
      "Ürün adı": {
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
      Fiyat: {
        type: "number",
        number: price,
      },
      "Satıcı kodu": {
        type: "rich_text",
        rich_text: [{ type: "text", text: { content: mainModalCode } }],
      },
    },
  };
  const productRes = await notion.pages.create(productObj);

  const productId = productRes.id;
  return productId;
};

export const hepsiburadaNotionCreateStockCode = async ({
  stockCode,
  relationId,
}: HepsiburadaNotionProps["createStockCode"]) => {
  const notion = new Client({
    auth: ENV.NOTION_TOKEN,
  });

  const modelObj: WithAuth<CreatePageParameters> = {
    parent: {
      database_id: ENV.HEPSIBURADA_PRODUCT_MODAL_CODE_DATABASE,
    },
    properties: {
      "Stok Kodu": {
        type: "title",
        title: [
          {
            type: "text",
            text: {
              content: stockCode,
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

export const hepsiburadaNotionCreateBarcode = async ({
  barcode,
  relationId,
}: HepsiburadaNotionProps["createBarcode"]) => {
  const notion = new Client({
    auth: ENV.NOTION_TOKEN,
  });

  const barcodeObj: WithAuth<CreatePageParameters> = {
    parent: {
      database_id: ENV.HEPSIBURADA_PRODUCT_BARCODE_DATABASE,
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
      Ürün: {
        type: "relation",
        relation: [{ id: relationId }],
      },
    },
  };
  const barcodeRes = await notion.pages.create(barcodeObj);

  const barcodeId = barcodeRes.id;
  return barcodeId;
};

export const NotionProductCodeExists = async (
  productCode: string,
  company: CompanyType
) => {
  const notion = new Client({ auth: ENV.NOTION_TOKEN });
  let result: QueryDatabaseResponse;
  switch (company) {
    case "hepsiburada":
      result = await notion.databases.query({
        database_id: ENV.HEPSIBURADA_PRODUCT_DATABASE,
        filter: {
          property: "Satıcı kodu",
          rich_text: { equals: productCode },
        },
      });

      break;
    case "trendyol":
      result = await notion.databases.query({
        database_id: ENV.TRENDYOL_PRODUCT_DATABASE,
        filter: {
          property: "Ana Model Kodu",
          rich_text: { equals: productCode },
        },
      });

      break;
  }

  return lengthValidator(result.results);
};
