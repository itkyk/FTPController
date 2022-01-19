# FTP Controller

## 使い方
1. npmをインストール
    ```
    $ npm i -D @itkyk/ftp-controller
    ```

2. `package.json`へスクリプトを追加
    ```json
    "script": {
      "ftp:init": "ftpController --init",
      "deploy:prev": "ftpController --deploy preview",
      "deploy:stg": "ftpController --deploy staging"
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
5. 完了
    - 完了すると、`/ftp/ftp-upload.log`が出力されます。
   

### Options
| option | value | description | 
|----------|---------|----------------|
| --init, -i | - | .envファイルのテンプレート作成<br>他optionとpの併用不可 |
|--deploy, -d < value > | String | FTPアップ時のコマンドです。<br>`.env`後ろの拡張子をvalueとして与えてください。<br>(ex) .env.preview → --deploy preview |
|--list, -l | Boolean | `true`にするとFTPアップ時にconsoleにアップしたファイルが表示されます。 |

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
          "ftp:init": "ftpController --init",
          "deploy:prev": "ftpController --deploy preview",
          "deploy:stg": "ftpController --deploy staging"
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
   
5. finished
- When complete, `/ftp/ftp-upload.log` will be output.

### Options
| option | value | description | 
|----------|---------|----------------|
| --init, -i | - | Create template file of `.env`file<br>This option can't be used with other options. |
|--deploy, -d < value > | string | FTP deploy option.<br>You give extension of `.env` file.<br>(ex) .env.preview → --deploy preview |
|--list, -l | boolean | if `true` and when finish uploading, push log by console |


### Options of env
| option | value | default<br>(指定しなかった場合) | description | 
|----------|---------|---------|----------------|
| user |  String | - |FTP ID |
| password | String | - | FTP pass word |
| host | String | - | FTP URL |
| port |  Number | - | FTP access PORT |
| localRoot | String | /dist/ | File upload destination path |
| remoteRoot | String | /htdocs/ | Directory target to upload |
| include | Array | "\*", "\**/\*" | Specify the file to upload. In the <br> .env file, write as follows.<br>```include: "*, **/*"``` |
| exclude | Array | - | Specify the file that will not be uploaded. In the <br> .env file, write as follows.<br>```include: "*, **/*"``` |
| deleteRemote | Boolean | false | Specifies whether to delete all existing files at the destination before uploading. |
| forcePasv | Boolean | false | Specifies whether passive mode enforces. |
| sftp | Boolean | -|Specifies whether to use SFTP. |