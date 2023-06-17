# Trendyol Kılıf Toplu Ürün Yükleme

Automaticly generate Excel data for your Trendyol Kılıf product.

## Installation

Git clone the repo.
SSH:

    git clone git@github.com:H7ioo/trendyol-toplu-urun-ekleme.git

Install the dependencies:

    npm install

## Usage

Run the app:

    npm run start

You will face several prompts, you need to fill them all with real information.
Last prompt is path, you need to paste folder path so it creates the file there.

## Exmaple & Notes

1.  "Ürün adı" should not contain the phone name.
    - Starbucks Sulu Kılıf ✅
    - iPhone 11 Uyumlu Starbucks Sulu Kılıf ❌
2.  "Telefonun bilinen adı yazınız" should contain the same words with the phone model.
    - Telefonun bilinen adı: Samsung. Telefon modelli: Samsung A10 ✅ 
    - Telefonun bilinen adı: Samsung Galaxy. Telefon modelli: Samsung A10 ❌
    ![CLI example image](https://i.imgur.com/FzCMB0h.png)
3.  "Ürün açıklaması" should be HTML
    ![CLI example image](https://i.imgur.com/WwN4Nuf.png)
4.  "Path" should be a folder path. Path format should look something like this: "C:\Users\user\Downloads\" OR C:\Users\user\Downloads\
    ![CLI example image](https://i.imgur.com/FFG0Lim.png)
