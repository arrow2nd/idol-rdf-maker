# idol-rdf-maker

[![publish](https://github.com/arrow2nd/idol-rdf-maker/actions/workflows/publish.yml/badge.svg)](https://github.com/arrow2nd/idol-rdf-maker/actions/workflows/publish.yml)
[![update](https://github.com/arrow2nd/idol-rdf-maker/actions/workflows/update.yml/badge.svg)](https://github.com/arrow2nd/idol-rdf-maker/actions/workflows/update.yml)
![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/arrow2nd.idol-rdf-maker)
![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/arrow2nd.idol-rdf-maker)
[![GitHub license](https://img.shields.io/github/license/arrow2nd/idol-rdf-maker)](https://github.com/arrow2nd/idol-rdf-maker/blob/main/LICENSE)

[im@sparql](https://sparql.crssnky.xyz/imas/) の RDF データ作成をちょっとだけサポートする VSCode 拡張

![clothes](https://user-images.githubusercontent.com/44780846/165919803-49e22b6f-e2a8-41df-ac33-8fa620096ca0.gif)

## これは何？

対話形式で情報を入力するだけで、 im@sparql のデータを作成することができる VSCode 拡張です。

それぞれの機能は、コマンドパレットよりコマンドを呼び出すことで利用できます。

## 機能

### 衣装データの作成

- createClothes
- createClothesForEachIdol (アイドル毎に衣装説明文が異なるもの)
- createClothesNormalAndAnother (アナザー衣装が存在するもの)

### ユニットデータの作成

- createUnit

### ライブデータの作成

- createLive

### ランキングデータの作成

- createRanking

### 所属・所有アイドルデータの作成

- createImasWhose (imas:whose)
- createSchemaMember (schema:member)

### 出演者・CV データの作成

- createImasCV (imas:cv)
- createSchemaActor (schema:actor)

## 仕様

- 開いているファイルの拡張子が `.rdf` の場合にのみ、コマンドパレットに表示されます

## 参考

- [im@sparql](https://sparql.crssnky.xyz/imas/) の RDFmaker
