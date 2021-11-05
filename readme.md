# FTP Controller

## 使い方
1. npmをインストール
    ```
    $ npm i -D @itkyk/ftp-controller
    ```

2. `package.json`へスクリプトを追加
    ```json
    "script": {
      "ftp:init": "dtp-controller --init",
      "deplpy:prev": "ftp-controller --deploy preview",
      "deploy:stg": "ftp-controller --deploy staging"
    }
    ```
  

3. 追加した`init`コマンドを叩く
    ```
    $ npm run ftp:init
    ```
   プロジェクトのルートディレクトリに`/ftp/.env.template`が作成されます。
   この作られたテンプレートの`.env`ファイルを編集して設定ファイルを作成。
   例) `.env.template` → `.env.preview`
  

4. `deploy`コマンドを叩く
    ```
    $ npm run deploy:prev
    ```

## How to Use
1. npm module install
    ```
        $ npm i -D @itkyk/ftp-controller
    ```

2. add scripts in `package.json`
    ```json
        "script": {
          "ftp:init": "dtp-controller --init",
          "deplpy:prev": "ftp-controller --deploy preview",
          "deploy:stg": "ftp-controller --deploy staging"
        }
    ```
   
3. hit npm init command
    ```
        $ npm run ftp:init
    ```
   this command is add template file of `.env`.  
    You should rewrite that template file name.  
   ex) `.env.template` → `.env.preview`

4. hit npm deploy command
    ```
        $ npm run deploy:prev
    ```