/* eslint-disable @typescript-eslint/no-var-requires */
import { QuestionCollection, prompt, registerPrompt } from "inquirer";
registerPrompt("search-list", require("inquirer-search-list"));
registerPrompt("search-checkbox", require("inquirer-search-checkbox"));

// prompt([
//   {
//     type: "search-list",
//     message: "Select topping",
//     name: "topping",
//     choices: [
//       "Pepperoni",
//       "Ham",
//       "Ground Meat",
//       "Bacon",
//       "Mozzarella",
//       "Bottle",
//     ],
//     validate: function (answer) {
//       if (answer === "Bottle") {
//         return `Whoops, ${answer} is not a real topping.`;
//       }
//       return true;
//     },
//   },
// ]);

// Phone Case Category
const category = "766" as const;

// Turkey Money Currency
const currency = "TRY" as const;

const KDV = ["0", "1", "8", "18"] as const;

// Available Material Types
const materials = [
  "Hakiki Deri",
  "Mantar Derisi",
  "Plastik",
  "Polyester",
  "Silikon",
  "Suni Deri",
] as const;

// Available Types of Phone Cases
const casesTypes = ["Arka Kapak", "Cüzdan Kılıf", "Çerçeve"] as const;

// Garanti for The Phone Case
const guaranteesPeriod = [
  "1 Yıl",
  "2 Yıl",
  "3 Yıl",
  "4 Yıl",
  "5 Yıl",
  "6 Ay",
  "Belirtilmemiş",
] as const;

const phones = [
  "A5s",
  "A7x",
  "Alcatel 1S 2019",
  "Alcatel 1S 2020",
  "Alcatel 1S 2021",
  "Alcatel 3",
  "Alcatel 3V",
  "Alcatel 3X 2019",
  "Alcatel 5",
  "Alcatel A3 XL",
  "Alcatel A7",
  "Alcatel U5",
  "Asus Zenfone 2",
  "Asus Zenfone 2 Laser 5.0 inç",
  "Asus Zenfone 2 Laser 5.5 inç",
  "Asus Zenfone 3",
  "Asus Zenfone 3 Delux 5.5 inç",
  "Asus Zenfone 3 Delux 5.7 inç",
  "Asus Zenfone 3 Laser",
  "Asus Zenfone 3 Max 5.2 inç",
  "Asus Zenfone 3 Max 5.5 inç",
  "Asus Zenfone 4",
  "Asus Zenfone 4 Max 5.2 inç",
  "Asus Zenfone 4 Max 5.5 inç",
  "Asus Zenfone 4 Selfie",
  "Asus Zenfone 5",
  "Asus Zenfone GO 5.0 inç",
  "Asus Zenfone GO 5.2 inç",
  "Asus ZenFone Live 5.0 inç",
  "Asus ZenFone Live 5.5 inç",
  "Asus Zenfone Max",
  "Asus ZenFone Max Plus",
  "Asus ZenFone Max Pro M1",
  "Asus Zenfone Selfie",
  "Avea inTouch 4",
  "Casper Via A1",
  "Casper Via A1 Plus",
  "Casper Via A2",
  "Casper Via A3",
  "Casper Via A3 Plus",
  "Casper Via E1",
  "Casper Via E1c",
  "Casper Via E2",
  "Casper Via F1",
  "Casper Via F2",
  "Casper Via G1",
  "Casper Via G1 Plus",
  "Casper Via G3",
  "Casper Via G4",
  "Casper Via M1",
  "Casper Via M2",
  "Casper Via M3",
  "Casper Via M4",
  "Casper Via P1",
  "Casper Via S",
  "Casper Via V10",
  "Casper Via V6",
  "Casper Via V6X",
  "Casper Via V8",
  "Casper Via V8c",
  "Galaxy A01",
  "Galaxy A02",
  "Galaxy A02s",
  "Galaxy A10",
  "Galaxy A10s",
  "Galaxy A11",
  "Galaxy A12",
  "Galaxy A13",
  "Galaxy A20",
  "Galaxy A20e",
  "Galaxy A20S",
  "Galaxy A21",
  "Galaxy A21S",
  "Galaxy A22 4G",
  "Galaxy A23",
  "Galaxy A2 Core",
  "Galaxy A3",
  "Galaxy A3 (2016)",
  "Galaxy A3 (2017)",
  "Galaxy A30",
  "Galaxy A30S",
  "Galaxy A31",
  "Galaxy A32 4G",
  "Galaxy A33",
  "Galaxy A40",
  "Galaxy A41",
  "Galaxy A5",
  "Galaxy A5 (2016)",
  "Galaxy A5 (2017)",
  "Galaxy A5 (2018)",
  "Galaxy A50",
  "Galaxy A50s",
  "Galaxy A51",
  "Galaxy A53",
  "Galaxy A6",
  "Galaxy A6 (2018)",
  "Galaxy A6+ Plus",
  "Galaxy A60",
  "Galaxy A6 Plus (2018)",
  "Galaxy A7",
  "Galaxy A7 (2016)",
  "Galaxy A7 (2017)",
  "Galaxy A70",
  "Galaxy A70S",
  "Galaxy A71",
  "Galaxy A7 2018",
  "Galaxy A73",
  "Galaxy A8",
  "Galaxy A80",
  "Galaxy A81",
  "Galaxy A8 2016",
  "Galaxy A8 2018",
  "Galaxy A8 Plus 2018",
  "Galaxy A91",
  "Galaxy A9 2016",
  "Galaxy A9 2018",
  "Galaxy Alpha",
  "Galaxy C5",
  "Galaxy C5 Pro",
  "Galaxy C7",
  "Galaxy C7 Pro",
  "Galaxy C8",
  "Galaxy C9 Pro",
  "Galaxy Core 2",
  "Galaxy Core Prime",
  "Galaxy E5",
  "Galaxy E7",
  "Galaxy Grand 2",
  "Galaxy Grand Duos",
  "Galaxy Grand Max",
  "Galaxy Grand Neo",
  "Galaxy Grand Prime",
  "Galaxy Grand Prime Plus",
  "Galaxy Grand Prime Pro",
  "Galaxy J1",
  "Galaxy J1 2016",
  "Galaxy J1 Ace",
  "Galaxy J1 Mini",
  "Galaxy J1 Mini Prime",
  "Galaxy J2",
  "Galaxy J2 Core",
  "Galaxy J2 Prime",
  "Galaxy J2 Pro 2018",
  "Galaxy J3 (2016)",
  "Galaxy J3 Pro",
  "Galaxy J3 Pro 2016",
  "Galaxy J4",
  "Galaxy J4+ Plus",
  "Galaxy J4 Core",
  "Galaxy J5",
  "Galaxy J5 2016",
  "Galaxy J5 Prime",
  "Galaxy J5 Pro",
  "Galaxy J6",
  "Galaxy J6+ Plus",
  "Galaxy J6 Prime",
  "Galaxy J7",
  "Galaxy J7 2015",
  "Galaxy J7 2016",
  "Galaxy J7 Core",
  "Galaxy J7 Duo",
  "Galaxy J7 Max",
  "Galaxy J7 Prime",
  "Galaxy J7 Prime 2",
  "Galaxy J7 Pro",
  "Galaxy J8",
  "Galaxy M10",
  "Galaxy M10S",
  "Galaxy M11",
  "Galaxy M12",
  "Galaxy M20",
  "Galaxy M21",
  "Galaxy M30",
  "Galaxy M30S",
  "Galaxy M31",
  "Galaxy M31s",
  "Galaxy M40",
  "Galaxy M51",
  "Galaxy Note 10",
  "Galaxy Note 10 Lite",
  "Galaxy Note 10 Plus",
  "Galaxy Note 2",
  "Galaxy Note 20",
  "Galaxy Note 20 Ultra",
  "Galaxy Note 3",
  "Galaxy Note 4",
  "Galaxy Note 5",
  "Galaxy Note 8",
  "Galaxy Note 9",
  "Galaxy Note FE",
  "Galaxy ON5",
  "Galaxy ON7",
  "Galaxy S10",
  "Galaxy S10e",
  "Galaxy S10 Lite",
  "Galaxy S10 Plus",
  "Galaxy S20",
  "Galaxy S20 FE",
  "Galaxy S20 Plus",
  "Galaxy S20 Ultra",
  "Galaxy S21",
  "Galaxy S21 FE",
  "Galaxy S21 Plus",
  "Galaxy S21 Ultra",
  "Galaxy S22",
  "Galaxy S22 Plus",
  "Galaxy S22 Ultra",
  "Galaxy S23",
  "Galaxy S23 Plus",
  "Galaxy S23 Ultra",
  "Galaxy S3",
  "Galaxy S3 Mini",
  "Galaxy S4",
  "Galaxy S4 Mini",
  "Galaxy S5",
  "Galaxy S5 Mini",
  "Galaxy S6",
  "Galaxy S6 Edge",
  "Galaxy S6 Edge Plus",
  "Galaxy S7",
  "Galaxy S7 Edge",
  "Galaxy S8",
  "Galaxy S8 Plus",
  "Galaxy S9",
  "Galaxy S9 Plus",
  "General Mobile Android One",
  "General Mobile Discovery",
  "General Mobile Discovery 2",
  "General Mobile Discovery 2 Mini",
  "General Mobile Discovery Air",
  "General Mobile Discovery Elite",
  "General Mobile Discovery Elite Plus",
  "General Mobile GM 20",
  "General Mobile GM 20 Pro",
  "General Mobile GM 21",
  "General Mobile GM 21 Plus",
  "General Mobile GM 21 Pro",
  "General Mobile GM22",
  "General Mobile GM22 Plus",
  "General Mobile GM22 Pro",
  "General Mobile GM5",
  "General Mobile GM5 Plus",
  "General Mobile GM6",
  "General Mobile GM8",
  "General Mobile GM8 GO",
  "General Mobile GM9 Pro",
  "GM 10",
  "GM20",
  "GM20 Pro",
  "Honor 10",
  "Honor 10 Lite",
  "Honor 20",
  "Honor 20 Lite",
  "Honor 7",
  "Honor 7C",
  "Honor 7S",
  "Honor 7X",
  "Honor 8",
  "Honor 8A",
  "Honor 8C",
  "Honor 8S",
  "Honor 8X",
  "Honor 9",
  "Honor 9 Lite",
  "Honor 9X",
  "Honor Play",
  "Honor View 20",
  "Htc 10",
  "Htc Desire 12",
  "Htc Desire 530",
  "Htc Desire 620",
  "Htc Desire 626",
  "Htc Desire 728",
  "Htc Desire 816",
  "Htc Desire 820",
  "Htc Desire 825",
  "Htc Desire 826",
  "Htc Desire 828",
  "Htc Desire 830",
  "Htc Desire Eye",
  "Htc One A9",
  "Htc One M7",
  "Htc One M8",
  "Htc One M9",
  "Htc One M9 Plus",
  "Htc U11",
  "Htc U11 Life",
  "Huawei Ascend P7",
  "Huawei G7",
  "Huawei G8",
  "Huawei GR3",
  "Huawei GR5",
  "Huawei GR5 2017",
  "Huawei Mate 10",
  "Huawei Mate 10 Lite",
  "Huawei Mate 10 Pro",
  "Huawei Mate 20",
  "Huawei Mate 20 Lite",
  "Huawei Mate 20 Pro",
  "Huawei Mate 30",
  "Huawei Mate 30 Pro",
  "Huawei Mate 40 Pro",
  "Huawei Mate 7",
  "Huawei Mate 8",
  "Huawei Mate 9",
  "Huawei Mate S",
  "Huawei Nova",
  "Huawei Nova 5T",
  "Huawei Nova 9",
  "Huawei Nova 9 Se",
  "Huawei Nova Y70",
  "Huawei Nova Y90",
  "Huawei P10",
  "Huawei P10 Lite",
  "Huawei P10 Plus",
  "Huawei P20",
  "Huawei P20 Lite",
  "Huawei P20 Pro",
  "Huawei P30",
  "Huawei P30 Lite",
  "Huawei P30 Pro",
  "Huawei P40",
  "Huawei P40 Lite",
  "Huawei P40 Lite E",
  "Huawei P40 Pro",
  "Huawei P8",
  "Huawei P8 Lite",
  "Huawei P9",
  "Huawei P9 Lite",
  "Huawei P 9 Lite 2017",
  "Huawei P9 Lite Mini",
  "Huawei P Smart",
  "Huawei P Smart 2018",
  "Huawei P Smart 2019",
  "Huawei P Smart 2020",
  "Huawei P Smart 2021",
  "Huawei P Smart Pro",
  "Huawei P Smart S",
  "Huawei P Smart Z",
  "Huawei Y5 2018",
  "Huawei Y5 2019",
  "Huawei Y5 Prime 2018",
  "Huawei Y6",
  "Huawei Y6 2",
  "Huawei Y6 2018",
  "Huawei Y6 2019",
  "Huawei Y6P",
  "Huawei Y6P 2020",
  "Huawei Y6 Prime 2018",
  "Huawei Y6S",
  "Huawei Y6S 2019",
  "Huawei Y7",
  "Huawei Y7 2018",
  "Huawei Y7 2019",
  "Huawei Y7 Prime 2019",
  "Huawei Y8P",
  "Huawei Y9 2018",
  "Huawei Y9 2019",
  "Huawei Y9 Prime 2019",
  "Infinix Note 7",
  "Infinix Zero 8",
  "Iphone 11",
  "Iphone 11 Pro",
  "Iphone 11 Pro Max",
  "Iphone 5",
  "Iphone 5S",
  "Iphone 6",
  "Iphone 6 Plus",
  "Iphone 6S",
  "Iphone 6S Plus",
  "Iphone 7",
  "Iphone 7 Plus",
  "Iphone 8",
  "Iphone 8 Plus",
  "Iphone Se Plus",
  "iPhone 12",
  "iPhone 12 Mini",
  "iPhone 12 Pro",
  "iPhone 12 Pro Max",
  "iPhone 13",
  "iPhone 13 Mini",
  "iPhone 13 Pro",
  "iPhone 13 Pro Max",
  "iPhone 14",
  "İPhone 14 Plus",
  "İPhone 14 Pro",
  "İPhone 14 Pro Max",
  "iPhone 4/4S",
  "iPhone SE",
  "iPhone SE 2020",
  "iPhone X",
  "iPhone XR",
  "iPhone XS",
  "iPhone XS Max",
  "Lenovo A1000",
  "Lenovo A2010",
  "Lenovo A5000",
  "Lenovo A6000",
  "Lenovo A7000",
  "Lenovo A7010",
  "Lenovo K5",
  "Lenovo K5 Note",
  "Lenovo K6",
  "Lenovo K6 Note",
  "Lenovo Moto E4",
  "Lenovo Moto E4 Plus",
  "Lenovo Moto G4",
  "Lenovo Moto G5",
  "Lenovo Moto G5S",
  "Lenovo Moto G5S Plus",
  "Lenovo Moto Z",
  "Lenovo Moto Z2 Play",
  "Lenovo Moto Z Play",
  "Lenovo One Vision",
  "Lenovo P2",
  "Lenovo P70",
  "Lenovo S60",
  "Lenovo S90",
  "Lenovo Vibe C",
  "Lenovo Vibe P1",
  "Lenovo Vibe P1m",
  "Lenovo Vibe P1 Pro",
  "Lenovo Vibe X2",
  "Lg G2",
  "Lg G3",
  "Lg G3 Beat",
  "Lg G3 Stylus",
  "Lg G4",
  "Lg G4 Beat",
  "Lg G4c",
  "Lg G4 Stylus",
  "Lg G5",
  "Lg G5 Se",
  "Lg G6",
  "Lg G7 ThinQ",
  "Lg K10",
  "Lg K10 (2017)",
  "Lg K11",
  "LG K20 (2019)",
  "Lg K4",
  "LG K40",
  "LG K41S",
  "LG K50S",
  "LG K61",
  "Lg K7",
  "Lg K8",
  "Lg K8 (2017)",
  "Lg K9",
  "Lg L Bello",
  "Lg L Leon",
  "Lg Q6",
  "Lg Q7",
  "Lg Stylus",
  "Lg Stylus 2",
  "Lg Stylus 3",
  "Lg V10",
  "Lg V20",
  "Lg V30",
  "Lg V30 Plus",
  "Lg X",
  "Lg X Power",
  "Lg X Screen",
  "Mate 30 Lite",
  "Meizu 16TH",
  "Meizu M10",
  "Meizu M3 Note",
  "Meizu M5S",
  "Meizu M6",
  "Meizu M6S",
  "Meizu M6T",
  "Meizu MX4",
  "Meizu MX4 Pro",
  "Meizu MX5",
  "Meizu Note 8",
  "Meizu Note 9",
  "Meizu Pro 6",
  "Meizu X8",
  "Mi 10",
  "Mi 10 Lite",
  "Mi 10 Pro",
  "Mi 10 T",
  "Mi 10T Lite",
  "Mi 10 T Pro",
  "Mi 9T Pro",
  "Mi Note 10 Lite",
  "Nokia 2",
  "Nokia 3",
  "Nokia 5",
  "Nokia 5.1 Plus",
  "Nokia 6",
  "Nokia 6.1",
  "Nokia 7.1",
  "Nokia 8",
  "Nokia Lumia 535",
  "Nokia Lumia 540",
  "Nokia Lumia 550",
  "Nokia Lumia 650",
  "Nokia Lumia 950",
  "Nokia Lumia 950 XL",
  "Note 10 Pro",
  "OnePlus 5",
  "One Plus 9",
  "One Plus 9 Pro",
  "Oppo A12",
  "Oppo A15",
  "Oppo A15S",
  "Oppo A16",
  "Oppo A31",
  "Oppo A52",
  "Oppo A5 2020",
  "Oppo A54 4G",
  "Oppo A5S",
  "Oppo A7",
  "Oppo A72",
  "Oppo A73",
  "Oppo A74 4G",
  "Oppo A91",
  "Oppo A92",
  "Oppo A9 2020",
  "Oppo AX7",
  "Oppo Realme 5 Pro",
  "Oppo Realme 6",
  "Oppo Realme 6 Pro",
  "Oppo Realme C15",
  "Oppo Reno",
  "Oppo Reno 2",
  "Oppo Reno 2Z",
  "Oppo Reno 3",
  "Oppo Reno 4",
  "Oppo Reno 4 Lite",
  "Oppo Reno 4 Pro",
  "Oppo Reno 5",
  "Oppo Reno 5 Lite",
  "Oppo Reno 5 Pro",
  "Oppo Reno 6",
  "Oppo Reno Z",
  "Oppo RX17 Neo",
  "Oppo RX 17 Pro",
  "Oppo RX 7 Neo",
  "P40 Pro",
  "Poco F2",
  "Poco F2 Pro",
  "Poco F3",
  "Poco X3 Pro",
  "P Smart 2018",
  "P Smart Pro 2019",
  "Realme 5",
  "Realme 5i",
  "Realme 5 Pro",
  "Realme 6",
  "Realme 6i",
  "Realme 6 Pro",
  "Realme 7",
  "Realme 7 Pro",
  "Realme 8",
  "Realme 8 Pro",
  "Realme C11",
  "Realme C11 2021",
  "Realme C2",
  "Realme C20",
  "Realme C21",
  "Realme C25",
  "Realme C25S",
  "Realme C3",
  "Realme XT",
  "Redmi 6A",
  "Redmi 8",
  "Redmi Note 10",
  "Redmi Note 10 Pro",
  "Redmi Note 7 Pro",
  "Redmi Note 8",
  "Redmi Note 8 Pro",
  "Redmi Note 8S",
  "Redmi Note 8T",
  "Redmi Note 9",
  "Redmi Note 9 Pro",
  "Redmi Note 9S",
  "Reeder P13 Blue 2021",
  "Reeder P13 Blue 2022",
  "Reeder P13 Blue Max 2022",
  "Reeder P13 Blue Max L 2022",
  "Reeder P13 Blue Max Pro",
  "Reeder P13 Blue Max Pro Lite 2022",
  "Reeder s19 Max 19",
  "Reno 10X Zoom",
  "Reno 3 Pro",
  "Samsung A52S 5G",
  "Samsung Galax M13",
  "Samsung Galaxy A01 Core",
  "Samsung Galaxy A03 S",
  "Samsung Galaxy A10",
  "Samsung Galaxy A10s",
  "Samsung Galaxy A12",
  "Samsung Galaxy A13 4G",
  "Samsung Galaxy A20",
  "Samsung Galaxy A22",
  "Samsung Galaxy A23",
  "Samsung Galaxy A30",
  "Samsung Galaxy A32",
  "Samsung Galaxy A52",
  "Samsung Galaxy A70",
  "Samsung Galaxy A72",
  "Samsung Galaxy A73",
  "Samsung Galaxy M22",
  "Samsung Galaxy M23",
  "Samsung Galaxy M32",
  "Samsung Galaxy M33",
  "Samsung Galaxy M52",
  "Samsung Galaxy M52 5G",
  "Samsung Galaxy M53",
  "Samsung Galaxy Z Flip 3 5G",
  "Sony Xperia C3",
  "Sony Xperia C4",
  "Sony Xperia C5 Ultra",
  "Sony Xperia E4",
  "Sony Xperia E4g",
  "Sony Xperia E5",
  "Sony Xperia L1",
  "Sony Xperia L2",
  "Sony Xperia M2",
  "Sony Xperia M4 Aqua",
  "Sony Xperia M5",
  "Sony Xperia T2 Ultra",
  "Sony Xperia T3",
  "Sony Xperia X",
  "Sony Xperia XA",
  "Sony Xperia Xa1",
  "Sony Xperia XA1 Plus",
  "Sony Xperia XA1 Ultra",
  "Sony Xperia XA2",
  "Sony Xperia XA2 Ultra",
  "Sony Xperia XA Ultra",
  "Sony Xperia X Compact",
  "Sony Xperia Xz",
  "Sony Xperia Xz1",
  "Sony Xperia Xz Premium",
  "Sony Xperia Z",
  "Sony Xperia Z1",
  "Sony Xperia Z2",
  "Sony Xperia Z3",
  "Sony Xperia Z3 Compact",
  "Sony Xperia Z3 Plus",
  "Sony Xperia Z5",
  "Sony Xperia Z5 Compact",
  "Sony Xperia Z5 Premium",
  "Tecno Spark 7 / 7T",
  "Turkcell T60",
  "Turkcell T70",
  "Turkcell T80",
  "Türk Telekom TT175",
  "Vestel Venüs 5000",
  "Vestel Venüs 5530",
  "Vestel Venüs E2 Plus",
  "Vestel Venüs E3",
  "Vestel Venüs E4",
  "Vestel Venüs GO",
  "Vestel Venüs V3 5010",
  "Vestel Venüs V3 5020",
  "Vestel Venüs V3 5040",
  "Vestel Venüs V3 5070",
  "Vestel Venüs V3 5570",
  "Vestel Venüs V3 5580",
  "Vestel Venüs V4",
  "Vestel Venüs V5",
  "Vestel Venüs V6",
  "Vestel Venüs V7",
  "Vestel Venüs Z10",
  "Vestel Venüs Z20",
  "Vestel Venüs Z30",
  "Vivo Y11S",
  "Vivo Y20",
  "Vivo Y20S",
  "Vivo Y70",
  "Vodafone Smart 6",
  "Vodafone Smart Style 7",
  "Xiaomi Mi 11",
  "Xiaomi Mi 11 Lite",
  "Xiaomi Mi 11 Pro",
  "Xiaomi Mi 11 Ultra",
  "Xiaomi Mi 4",
  "Xiaomi Mi 4C",
  "Xiaomi Mi 5",
  "Xiaomi Mi 5S",
  "Xiaomi Mi 5S Plus",
  "Xiaomi Mi 6",
  "Xiaomi Mi 6X",
  "Xiaomi Mi 8",
  "Xiaomi Mi 8 Lite",
  "Xiaomi Mi 8 SE",
  "Xiaomi Mi 9",
  "Xiaomi Mi 9 Lite",
  "Xiaomi Mi 9 SE",
  "Xiaomi Mi 9T",
  "Xiaomi Mi 9T Pro",
  "Xiaomi Mi A1",
  "Xiaomi Mi A2 (Mi 6X)",
  "Xiaomi Mi A2 Lite",
  "Xiaomi Mi A3",
  "Xiaomi Mi Max",
  "Xiaomi Mi Max 2",
  "Xiaomi Mi Max 3",
  "Xiaomi Mi Mix",
  "Xiaomi Mi Mix 2",
  "Xiaomi Mi Mix 2S",
  "Xiaomi Mi Mix 3",
  "Xiaomi Mi Note 10",
  "Xiaomi Mi Note 10 Lite",
  "Xiaomi Mi Note 2",
  "Xiaomi Mi Note 3",
  "Xiaomi Mi Play",
  "Xiaomi Note 8",
  "Xiaomi Note 8 Pro",
  "Xiaomi Note 8T",
  "Xiaomi Poco F2 Pro",
  "Xiaomi Poco F3",
  "Xiaomi Poco M3",
  "Xiaomi Poco M3 Pro",
  "Xiaomi Pocophone F1",
  "Xiaomi Poco X3",
  "Xiaomi Poco X3 GT",
  "Xiaomi Poco X4 Pro",
  "Xiaomi Redmi 10 2022",
  "Xiaomi Redmi 3 Pro",
  "Xiaomi Redmi 3S",
  "Xiaomi Redmi 4A",
  "Xiaomi Redmi 4X",
  "Xiaomi Redmi 5",
  "Xiaomi Redmi 5+ Plus",
  "Xiaomi Redmi 5A",
  "Xiaomi Redmi 6",
  "Xiaomi Redmi 6 Pro",
  "Xiaomi Redmi 7",
  "Xiaomi Redmi 7A",
  "Xiaomi Redmi 8A",
  "Xiaomi Redmi 9",
  "Xiaomi Redmi 9A",
  "Xiaomi Redmi 9c",
  "Xiaomi Redmi 9T",
  "Xiaomi Redmi Go",
  "Xiaomi Redmi K20",
  "Xiaomi Redmi K30",
  "Xiaomi Redmi K30 Pro",
  "Xiaomi Redmi K40",
  "Xiaomi Redmi Note 10 4G",
  "Xiaomi Redmi Note 10 5G",
  "Xiaomi Redmi Note 10 Lite",
  "Xiaomi Redmi Note 10 Pro Max",
  "Xiaomi Redmi Note 10S",
  "Xiaomi Redmi Note 11 Pro",
  "Xiaomi Redmi Note 11S",
  "Xiaomi Redmi Note 3",
  "Xiaomi Redmi Note 4",
  "Xiaomi Redmi Note 4X",
  "Xiaomi Redmi Note 5",
  "Xiaomi Redmi Note 5A",
  "Xiaomi Redmi Note 5A Prime",
  "Xiaomi Redmi Note 5 Pro",
  "Xiaomi Redmi Note 6 Pro",
  "Xiaomi Redmi Note 7",
  "Xiaomi Redmi Note 9 4G",
  "Xiaomi Redmi Note 9 5G",
  "Xiaomi Redmi Note 9s",
  "Xiaomi Redmi S2",
  "Y5p 2020",
  "Y6 Prime 2019",
  "Y7p 2020",
  "Y9 Prime 2019",
] as const;

const caseBrands = [
  "Apple",
  "Belirtilmemiş",
  "Casper",
  "General Mobile",
  "Huawei",
  "Lenovo",
  "Oppo",
  "POCO",
  "Reeder",
  "Samsung",
  "Xiaomi",
] as const;

// # Cep telefon modeli

// TODO: Add KDV (no need if it's always 18)

type promptAnswers = {
  title: string;
  phoneType: string;
  phonesList: string[];
  mainModalCode: string;
  brand: string | undefined;
  colors: string[];
  globalPrice: string;
  price: string;
  stock: string;
  description: string;
  material: (typeof materials)[number];
  caseType: (typeof casesTypes)[number];
  guaranteePeriod: (typeof guaranteesPeriod)[number];
  caseBrand: (typeof caseBrands)[number];
  path: string;
};

// Questions collection
const promptQuestions: QuestionCollection = [
  {
    type: "input",
    name: "title",
    message: "Ürün adı yazınız",
    filter: (input) => {
      return capitalizeLetters(cleanUp(input));
    },
    validate: lengthValidator,
    suffix: ":",
  },
  {
    type: "input",
    name: "phoneType",
    message: "Telefonun bilinen adı yazınız",
    filter: (input) => {
      return cleanUp(input, false);
    },
    validate: lengthValidator,
    suffix: ":",
  },
  // {
  //   type: "input",
  //   name: "phonesList",
  //   message: "Telefon modelleri yazınız (aralarında virgül koyarak)",
  //   filter: (input, answer) => {
  //     return cleanUp(input)
  //       .split(",")
  //       .map((phoneAnswer) => {
  //         // return removeWhiteSpaces(upperLetters(phoneAnswer));
  //         return capitalizeLetters(phoneAnswer);
  //       });
  //   },
  //   validate: lengthValidator,
  //   suffix: ":",
  // },
  {
    type: "search-checkbox",
    name: "phonesList",
    message: "Telefon modelleri yazınız (aralarında virgül koyarak)",
    choices: phones,
    validate: lengthValidator,
    suffix: ":",
  },
  {
    type: "input",
    name: "mainModalCode",
    message: "Ana model kodu yazınız",
    filter: (input) => {
      return cleanUp(input).toUpperCase();
    },
    validate: lengthValidator,
    suffix: ":",
  },
  {
    type: "input",
    name: "brand",
    message: "Marka adı yazınız",
    // validate: lengthValidator,
    suffix: ":",
  },
  {
    type: "input",
    name: "colors",
    message: "Renkleri yazınız (aralarında virgül koyarak)",
    filter: (input) => {
      return cleanUp(input)
        .split(",")
        .map((colorAnswer) => {
          // return removeWhiteSpaces(capitalizeLetters(colorAnswer));
          return capitalizeLetters(colorAnswer);
        });
    },
    validate: lengthValidator,
    suffix: ":",
  },
  {
    type: "input",
    name: "globalPrice",
    message: "Piyasa fiyatı yazınız",
    validate: numberValidator,
    suffix: ":",
  },
  {
    type: "input",
    name: "price",
    message: "Trendyol satış fiyatı yazınız",
    validate: numberValidator,
    suffix: ":",
  },
  {
    type: "input",
    name: "stock",
    message: "Stock adedi yazınız",
    validate: numberValidator,
    suffix: ":",
  },
  {
    type: "input",
    name: "description",
    message: "Ürün açıklaması yazınız",
    validate: lengthValidator,
    suffix: ":",
  },
  {
    type: "search-list",
    name: "material",
    message: "Materyal seçiniz",
    choices: materials,
    suffix: ":",
  },
  {
    type: "search-list",
    name: "caseType",
    message: "Kılıf modeli seçiniz",
    choices: casesTypes,
    suffix: ":",
  },
  {
    type: "search-list",
    name: "guaranteePeriod",
    message: "Garanti süresi seçiniz",
    choices: guaranteesPeriod,
    suffix: ":",
  },
  {
    type: "search-list",
    name: "caseBrand",
    message: "Uyumlu marka seçiniz",
    choices: caseBrands,
    suffix: ":",
  },
  {
    type: "input",
    name: "path",
    message: "Path?",
    validate: lengthValidator,
    suffix: ":",
  },
];

async function main() {
  // Handling prompt
  const res = await prompt(promptQuestions)
    .then((answers) => {
      return answers;
    })
    .catch((error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
      } else {
        // Something else went wrong
      }
    });
  //
  const result = res as promptAnswers;
  compile(result);
}
main();

// - Helpers

/**
 * Trims extra whitespace and lowercases the text
 * @param text The text.
 * @param lowerCase Option to lowerCase the text. Defaults to true.
 * @returns Cleared up text.
 * @example cleanUp("   Text HERE ")
 */

function cleanUp(text: string, lowerCase = true) {
  const res = text.trim().replace(/\s+/g, " ");
  return lowerCase ? res.toLowerCase() : res;
}

/**
 * Trims extra whitespace, split it and uppercase first letter then it joins to create a string.
 *
 * @param text The text.
 * @returns Capitalized text.
 */
function capitalizeLetters(text: string) {
  return text
    .toLowerCase()
    .trim()
    .split(" ")
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

/**
 * Removes all whitespace.
 *
 * @param text The text.
 * @returns Text without any whitespace.
 */
function removeWhiteSpaces(text: string) {
  return text.replace(/\s/g, "");
}

/**
 * Generates random number.
 * @param length The length of the generated number.
 * @returns Random set of numbers.
 */
function digitGen(length: number) {
  let digit = "";
  for (let index = 0; index < length; index++) {
    digit += Math.round(Math.random() * 9);
  }
  return digit;
}
/**
 * It validates the string or the array. It checks if the length is bigger than zero. Since split returns [''], we need to check multiple times for the Array
 * @param text The text.
 * @returns
 */
function lengthValidator(text: string | string[]) {
  if (Array.isArray(text))
    return text.length > 0 && text[0].length > 0 ? true : false;
  if (text.trim().length <= 0) return false;
  return true;
}

function numberValidator(value: string) {
  return !isNaN(parseInt(value)) && lengthValidator(value);
}

function compile({
  brand,
  caseBrand,
  caseType,
  colors,
  description,
  globalPrice,
  guaranteePeriod,
  mainModalCode,
  material,
  phoneType,
  phonesList,
  price,
  stock,
  title,
  path,
}: promptAnswers) {
  const res = [];
  for (let i = 0; i < phonesList.length; i++) {
    // Example: Iphone 11 Pro (from Excel Sheet)
    const phoneName = phonesList[i];
    // - This doesn't work on 2 words brand
    // const phoneCode = capitalizeLetters(
    //   phonesList[i].split(" ").slice(1).join(" ")
    // );
    // - This works only if I wrote the phoneType the same as the phone brand written in the file
    // TODO: if the phoneType is 2 words, match for each one. For example: Samsung Galaxy, regex for both individually because sometimes the name is Galaxy without the samsung
    const regex = new RegExp(replaceTurkishI(phoneType).toLowerCase(), "gi");
    // Example: 11 Pro
    const phoneNameWithoutBrand = capitalizeLetters(
      cleanUp(
        replaceTurkishI(phoneName).toLowerCase().replace(regex, ""),
        false
      )
    );
    // Example: 11Pro
    const phoneCode = removeWhiteSpaces(phoneNameWithoutBrand);
    // Example: iPhone 11 Pro Uyumlu I Love Your Mom
    const productTitle = `${phoneType} ${phoneNameWithoutBrand} Uyumlu ${title}`;
    // Example: SB-11Pro
    const productModal = `${mainModalCode}-${phoneCode}`;
    // Example: 691
    const randomDigits = digitGen(3);
    for (let j = 0; j < colors.length; j++) {
      // Example: Kırmızı
      const color = colors[j];
      // Example: SuarSB-11ProSari-691
      const barcode = `${capitalizeLetters(
        brand ?? ""
      )}${productModal}-${removeWhiteSpaces(color)}-${randomDigits}`;

      // Fields
      const fields = {
        Barkod: "",
        "Model Kodu": "",
        Marka: "",
        Kategori: "",
        "Para Birimi": "",
        "Ürün Adı": "",
        "Ürün Açıklaması": "",
        "Piyasa Satış Fiyatı (KDV Dahil)": "",
        "Trendyol'da Satılacak Fiyat (KDV Dahil)": "",
        "Ürün Stok Adedi": "",
        "Stok Kodu": "",
        "KDV Oranı": KDV["3"],
        Desi: "",
        "Görsel 1": "",
        "Görsel 2": "",
        "Görsel 3": "",
        "Görsel 4": "",
        "Görsel 5": "",
        "Görsel 6": "",
        "Görsel 7": "",
        "Görsel 8": "",
        "Sevkiyat Süresi": "",
        "Sevkiyat Tipi": "",
        Renk: "",
        Materyal: "",
        Model: "",
        "Cep Telefonu Modeli": "",
        "Garanti Tipi": "",
        "Garanti Süresi": "",
        "Uyumlu Marka": "",
      };

      // let fields = {
      //   Barkod: "",
      //   "Model Kodu": "",
      //   Marka: "",
      //   Kategori: "",
      //   "Para Birimi": "",
      //   "Ürün Adı": "",
      //   "Ürün Açıklaması": "",
      //   "Piyasa Satış Fiyatı (KDV Dahil)": "",
      //   "Trendyol'da Satılacak Fiyat (KDV Dahil)": "",
      //   "Ürün Stok Adedi": "",
      //   "KDV Oranı": KDV["3"],
      //   Renk: "",
      //   Materyal: "",
      //   Model: "",
      //   "Cep Telefonu Modeli": "",
      //   "Garanti Süresi": "",
      //   "Uyumlu Marka": "",
      // };

      // Pass the data to the fields
      fields.Barkod = barcode;
      fields["Model Kodu"] = productModal;
      fields["Marka"] = brand ?? "";
      fields.Kategori = category;
      fields["Para Birimi"] = currency;
      fields["Ürün Adı"] = productTitle;
      fields["Ürün Açıklaması"] = description;
      fields["Piyasa Satış Fiyatı (KDV Dahil)"] = globalPrice;
      fields["Trendyol'da Satılacak Fiyat (KDV Dahil)"] = price;
      fields["Ürün Stok Adedi"] = stock;
      fields["Stok Kodu"] = mainModalCode;
      fields["KDV Oranı"] = KDV["3"];
      fields.Renk = color;
      fields.Materyal = material;
      fields.Model = caseType;
      fields["Cep Telefonu Modeli"] = phoneName;
      fields["Garanti Süresi"] = guaranteePeriod;
      fields["Uyumlu Marka"] = caseBrand;
      // Push to the array
      res.push(fields);
    }
  }
  writeToExcel(res, cleanUp(path, false).replace(/"/gi, ""), mainModalCode);
}

function replaceTurkishI(text: string) {
  return text.replace(/i̇/gi, "i").replace(/İ/gi, "I");
}

// import * as fs from "fs";
import * as XLSX from "xlsx";
// import * as ExcelJS from "exceljs";

// TODO: Don't override props. Just append to them. (for now it works but not in the way that I want. It should not replace props it should append rows only.)
// TODO: Create a file
function writeToExcel(
  resultArray: object[],
  path: string,
  mainModalCode: string
) {
  const sheetName = "Ürünlerinizi Burada Listeleyin";
  // Read the file into memory
  const workbook = XLSX.readFile("./trendyol.xlsx");

  // Convert the XLSX to JSON
  type worksheetsType = {
    [key: string]: object[];
  };
  const worksheets: worksheetsType = {};
  for (const sheetName of workbook.SheetNames) {
    // Some helper functions in XLSX.utils generate different views of the sheets:
    //     XLSX.utils.sheet_to_csv generates CSV
    //     XLSX.utils.sheet_to_txt generates UTF16 Formatted Text
    //     XLSX.utils.sheet_to_html generates HTML
    //     XLSX.utils.sheet_to_json generates an array of objects
    //     XLSX.utils.sheet_to_formulae generates a list of formulae
    worksheets[sheetName] = XLSX.utils.sheet_to_json(
      workbook.Sheets[sheetName]
    );
    // console.log(XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]));
  }

  // Show the data as JSON
  // console.log(
  //   "json:\n",
  //   JSON.stringify(worksheets["Ürünlerinizi Burada Listeleyin"]),
  //   "\n\n"
  // );

  // console.log(worksheets["Ürünlerinizi Burada Listeleyin"][0]);

  // Modify the XLSX
  worksheets[sheetName].push(...resultArray);

  // Update the XLSX file
  // XLSX.utils.sheet_add_json(workbook.Sheets[sheetName], worksheets[sheetName]);
  // XLSX.writeFile(workbook, path);

  // Create a new XLSX file
  const newBook = XLSX.utils.book_new();
  const newSheet = XLSX.utils.json_to_sheet(worksheets[sheetName]);
  XLSX.utils.book_append_sheet(newBook, newSheet, sheetName);
  XLSX.writeFile(newBook, `${path}\\${mainModalCode}.xlsx`);

  // [
  //   'Ürünlerinizi Burada Listeleyin',
  //   'Urun_Ozellik_Bilgileri',
  //   'Yardım'
  // ]
}

// const fields = {
//   Barkod: "732SuarKFAS-11Pembe",
//   "Model Kodu": "KFAS-11",
//   Marka: "SUAR",
//   Kategori: "766",
//   "Para Birimi": "TRY",
//   "Ürün Adı": "iPhone 11 Uyumlu Kedi Figürlü Aynalı Silikon Kılıf",
//   "Ürün Açıklaması":
//     "<div><ul>\r\n" +
//     "\t<li> Bu üstün kaliteli ve sağlam silikon kılıf, en üst düzeyde darbelere karşı koruma sağlar ve cihazınızı güvende tutar. Yüksek kaliteli malzeme kullanılarak üretilmiş olan kılıf, renk değişimi, sararma veya benzeri sorunlarla karşılaşmanızı engeller. Ürün modeli, cihazınızla mükemmel bir uyum sağlar ve tam oturur, böylece her açıdan maksimum koruma sağlar. Kapağı çıkartmadan kolaylıkla tüm slotlara (sarj ve kulaklık girişleri) erişebilirsiniz. Özel kalıbı sayesinde cihazınıza mükemmel bir şekilde uyar ve pratik kullanım sağlar. Ayrıca, kılıfın üzerinde yer alan muhteşem kedi figürleri ve ayna detaylarıyla da dikkat çeker, telefonunuza şık ve göz alıcı bir görünüm kazandırır.\r\n" +
//     "\t</li>\r\n" +
//     "</ul><div>",
//   "Piyasa Satış Fiyatı (KDV Dahil)": 200,
//   "Trendyol'da Satılacak Fiyat (KDV Dahil)": 149.9,
//   "Ürün Stok Adedi": 100,
//   "KDV Oranı": "18",
//   "Görsel 1":
//     "https://marketplace-supplier-media-center.oss-eu-central-1.aliyuncs.com/prod/582477/4b5535dc-338f-4ae1-86ee-729135adf76c/KFAS-11-pembe.jpg?x-oss-process=style/resized",
//   "Görsel 2":
//     "https://marketplace-supplier-media-center.oss-eu-central-1.aliyuncs.com/prod/582477/9dd2015a-f0cb-418f-9ab6-09aa489d63f3/KFAS-11-pembe2.jpg?x-oss-process=style/resized",
//   Renk: "Pembe",
//   Materyal: "Silikon",
//   Model: "Arka Kapak",
//   "Cep Telefonu Modeli": "Iphone 11",
//   "Garanti Süresi": "Belirtilmemiş",
//   "Uyumlu Marka": "Apple",
// };

// const fields = {
//   Barkod: "",
//   "Model Kodu": "",
//   Marka: "",
//   Kategori: "",
//   "Para Birimi": "",
//   "Ürün Adı": "",
//   "Ürün Açıklaması": "",
//   "Piyasa Satış Fiyatı (KDV Dahil)": 1,
//   "Trendyol'da Satılacak Fiyat (KDV Dahil)": 1,
//   "Ürün Stok Adedi": 1,
//   "KDV Oranı": "1",
//   Desi: 1,
//   "Görsel 1": "",
//   "Görsel 2": "",
//   "Görsel 3": "",
//   "Görsel 4": "",
//   "Görsel 5": "",
//   "Görsel 6": "",
//   "Görsel 7": "",
//   "Görsel 8": "",
//   "Sevkiyat Süresi": 1,
//   "Sevkiyat Tipi": "",
//   Renk: "",
//   Materyal: "",
//   Model: "",
//   "Cep Telefonu Modeli": "",
//   "Garanti Tipi": "",
//   "Garanti Süresi": "",
//   "Uyumlu Marka": "",
// };

// TODO: Remove unnecessary code and structure the files
