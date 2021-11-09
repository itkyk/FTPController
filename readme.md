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
   

### Options
| option | value | description | 
|----------|---------|----------------|
| --init, -i | - | .envファイルのテンプレート作成<br>他optionとpの併用不可 |
|--deploy, -d < value > | String | FTPアップ時のコマンドです。<br>`.env`後ろの拡張子をvalueとして与えてください。<br>(ex) .env.preview → --deploy preview |

### envファイル設定
| option | value | default<br>(指定しなかった場合) | description | 
|----------|---------|---------|----------------|
| user |  String | - |FTP ID |
| password | String | - | FTP pass word |
| host | String | - | FTP URL |
| port |  Number | - | FTP access PORT |
| localRoot | String | /dist/ | ファイルアップ先のパス |
| remoteRoot | String | /htdocs/ | アップ先のディレクトリターゲット |
| include | Array | "\*", "\**/\*" | アップするファイルを指定。<br>.envファイルでは以下のように記述してください。<br>```include: "*, **/*"``` |
| exclude | Array | - | アップしないファイルを指定。<br>.envファイルでは以下のように記述してください。<br>```include: "*, **/*"``` |
| deleteRemote | Boolean | false | アップロードする前に宛先にある既存のファイルをすべて削除するかどうか指定します。 |
| forcePasv | Boolean | false | パッシブモードが強制するかどうか指定します。 |
| sftp | Boolean | -| SFTPを使用するかどうか指定します。 |
## How to Use
1. Npm module install
    ```
        $ npm i -D @itkyk/ftp-controller
    ```

2. Add scripts in `package.json`
    ```json
        "script": {
          "ftp:init": "dtp-controller --init",
          "deplpy:prev": "ftp-controller --deploy preview",
          "deploy:stg": "ftp-controller --deploy staging"
        }
    ```
   
3. Run npm init command
    ```
        $ npm run ftp:init
    ```
   This command is added template file of `.env`.  
   We recommend that  you rewrite file name of that template.  
   ex) `.env.template` → `.env.preview`

4. Run npm deploy command
    ```
        $ npm run deploy:prev
    ```

### Options
| option | value | description | 
|----------|---------|----------------|
| --init, -i | - | Create template file of `.env`file<br>This option can't be used with other options. |
|--deploy, -d < value > | string | FTP deploy option.<br>You give extension of `.env` file.<br>(ex) .env.preview → --deploy preview |
