use ftp::{FtpStream, FtpError};
use std::fs;
use std::fs::File;
use std::io::{Error as IoError, Read, BufReader};
use std::time::Duration;

use std::option::Option::Some;
use std::path::Path;
use std::path::PathBuf;
use std::hash::{Hash, Hasher};
use std::collections::hash_map::DefaultHasher;
use indicatif::{ProgressBar, ProgressStyle};
use std::fmt;
use std::error::Error;

// カスタムエラー型の定義
#[derive(Debug)]
pub enum FtpControllerError {
    IoError(IoError),
    FtpError(FtpError),
    PathError(String),
    ConversionError(String),
    // MkdirError(String), // 未使用のためコメントアウト
    FileOpenError(String),
    FileUploadError(String),
    FileListError(String),
    FileDeleteError(String),
    DirCreateError(String),
    FileVerificationError(String),
    TransferModeError(String),
}

impl fmt::Display for FtpControllerError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::IoError(err) => write!(f, "IO error: {}", err),
            Self::FtpError(err) => write!(f, "FTP error: {}", err),
            Self::PathError(msg) => write!(f, "Path error: {}", msg),
            Self::ConversionError(msg) => write!(f, "Conversion error: {}", msg),
            // Self::MkdirError(msg) => write!(f, "Directory creation error: {}", msg),
            Self::FileOpenError(msg) => write!(f, "File open error: {}", msg),
            Self::FileUploadError(msg) => write!(f, "File upload error: {}", msg),
            Self::FileListError(msg) => write!(f, "File listing error: {}", msg),
            Self::FileDeleteError(msg) => write!(f, "File deletion error: {}", msg),
            Self::DirCreateError(msg) => write!(f, "Directory creation error: {}", msg),
            Self::FileVerificationError(msg) => write!(f, "File verification error: {}", msg),
            Self::TransferModeError(msg) => write!(f, "Transfer mode error: {}", msg),
        }
    }
}

impl Error for FtpControllerError {}

impl From<IoError> for FtpControllerError {
    fn from(error: IoError) -> Self {
        Self::IoError(error)
    }
}

impl From<FtpError> for FtpControllerError {
    fn from(error: FtpError) -> Self {
        Self::FtpError(error)
    }
}

struct DeletePathMap {
    file_type: String,
    file_name: String,
}


impl Hash for DeletePathMap {
    fn hash<H: Hasher>(&self, state: &mut H) {
        self.file_type.hash(state);
        self.file_name.hash(state);
    }
}


fn get_remotes(target: &str, dir: &PathBuf) -> Result<(Vec<PathBuf>, Vec<PathBuf>), FtpControllerError> {
    let mut paths = Vec::new();
    let mut dirs = Vec::new();
    if dir.is_dir() {
        for entry in fs::read_dir(dir)? {
            let entry = entry?;
            let path = entry.path();
            if path.is_dir() {
                let (result_files, result_dir) = &mut get_remotes(&target, &path)?;
                paths.append(result_files);
                let vec_dir = &mut Vec::new();
                let stripped_path = path.strip_prefix(Path::new(&target))
                    .map_err(|e| FtpControllerError::PathError(format!("Failed to strip prefix: {}", e)))?;
                vec_dir.push(stripped_path.to_path_buf());
                dirs.append(vec_dir);
                dirs.append(result_dir);
            } else {
                let entry_path = &entry.path();
                let p = entry_path.to_str()
                    .ok_or_else(|| FtpControllerError::ConversionError(format!("Failed to convert path to string: {:?}", entry_path)))?;
                let res = Path::new(&p).strip_prefix(Path::new(&target));
                if let Ok(stripped) = res {
                    let buf_path = stripped.to_path_buf();
                    paths.push(buf_path);
                }
            }
        }
    }
    Ok((paths, dirs))
}

fn create_dirs(mut ftp: FtpStream, dir_list: Vec<PathBuf>) -> Result<FtpStream, FtpControllerError> {
    for dir in dir_list {
        let dir_str = dir.to_str()
            .ok_or_else(|| FtpControllerError::ConversionError(format!("Failed to convert directory path to string: {:?}", dir)))?;

        // ディレクトリ作成の失敗をログに記録するが、処理は続行する（存在するディレクトリの場合など）
        if let Err(e) = ftp.mkdir(dir_str) {
            eprintln!("Warning: Could not create directory {}: {}", dir_str, e);
            // 処理は継続
        }
    }
    Ok(ftp)
}

pub fn upload_files(mut ftp: FtpStream, local: &str) -> Result<FtpStream, FtpControllerError> {
    // バイナリモードを明示的に設定し、設定に失敗した場合は続行しない
    ftp.transfer_type(ftp::types::FileType::Binary)
        .map_err(|e| FtpControllerError::TransferModeError(format!("Failed to set binary transfer mode: {}", e)))?;

    // タイムアウト設定
    ftp.set_timeout(Some(Duration::from_secs(300)))
        .map_err(|e| FtpControllerError::FtpError(e))?;

    let entries_path = PathBuf::from(&local);
    let (files, dirs) = get_remotes(&local, &entries_path)?;
    ftp = create_dirs(ftp, dirs)?;

    let count = files.len() as u64;
    let bar = ProgressBar::new(count);

    // プログレスバーのスタイル設定でエラーが発生した場合のバックアップスタイル
    let style_result = ProgressStyle::with_template("[{elapsed_precise}] {bar:40.cyan/blue} {pos:>7}/{len:7} {msg}");

    if let Ok(style) = style_result {
        bar.set_style(style.progress_chars("##-"));
    } else {
        // シンプルなスタイルをフォールバックとして使用
        eprintln!("Warning: Failed to set progress bar style");
    }

    const MAX_RETRIES: u8 = 3;

    for file in files {
        let mut full_path = PathBuf::new();
        full_path.push(&local);

        let file_str = file.to_str()
            .ok_or_else(|| FtpControllerError::ConversionError(format!("Failed to convert file path to string: {:?}", file)))?;

        full_path.push(file_str);

        let full_path_str = full_path.to_str()
            .ok_or_else(|| FtpControllerError::ConversionError(format!("Failed to convert full path to string: {:?}", full_path)))?;

        // ファイルを開く
        let file_data = File::open(&full_path)
            .map_err(|e| FtpControllerError::FileOpenError(format!("Cannot open file {}: {}", full_path_str, e)))?;
        
        // ファイルサイズを取得
        let metadata = fs::metadata(&full_path)
            .map_err(|e| FtpControllerError::IoError(e))?;
        let file_size = metadata.len();
        
        // 0バイトのファイルの場合は特別処理
        if file_size == 0 {
            // 空ファイルを作成
            if let Err(e) = ftp.put(file_str, &mut BufReader::new(file_data)) {
                return Err(FtpControllerError::FileUploadError(format!(
                    "Failed to upload empty file {}: {}", file_str, e
                )));
            }
        } else {
            // リトライロジック
            let mut retry_count = 0;
            let mut upload_success = false;
            
            while !upload_success && retry_count < MAX_RETRIES {
                // 再度ファイルを開く（リトライの場合）
                let mut file_to_upload = File::open(&full_path)
                    .map_err(|e| FtpControllerError::FileOpenError(format!("Cannot open file for retry {}: {}", full_path_str, e)))?;
                
                // バイナリモードを再確認
                ftp.transfer_type(ftp::types::FileType::Binary)
                    .map_err(|e| FtpControllerError::TransferModeError(format!("Failed to set binary transfer mode: {}", e)))?;
                
                // FTP にファイルをアップロード
                if let Err(e) = ftp.put(file_str, &mut file_to_upload) {
                    retry_count += 1;
                    if retry_count >= MAX_RETRIES {
                        return Err(FtpControllerError::FileUploadError(format!(
                            "Failed to upload file {} after {} retries: {}", file_str, MAX_RETRIES, e
                        )));
                    }
                    eprintln!("Warning: Upload attempt {} failed for file {}: {}. Retrying...", retry_count, file_str, e);
                    continue;
                }
                
                // アップロード後のファイルサイズ検証
                match ftp.size(file_str) {
                    Ok(remote_size) => {
                        if remote_size != file_size {
                            retry_count += 1;
                            if retry_count >= MAX_RETRIES {
                                return Err(FtpControllerError::FileVerificationError(format!(
                                    "File size mismatch after upload for {}: local={}, remote={}", 
                                    file_str, file_size, remote_size
                                )));
                            }
                            eprintln!("Warning: File size mismatch for {}: local={}, remote={}. Retrying upload...", 
                                      file_str, file_size, remote_size);
                            // リモートファイルを削除してリトライ
                            let _ = ftp.rm(file_str);
                            continue;
                        }
                        upload_success = true;
                    },
                    Err(e) => {
                        retry_count += 1;
                        if retry_count >= MAX_RETRIES {
                            return Err(FtpControllerError::FileVerificationError(format!(
                                "Could not verify file size after upload for {}: {}", file_str, e
                            )));
                        }
                        eprintln!("Warning: Could not verify file size for {}. Retrying upload...", file_str);
                        continue;
                    }
                }
            }
        }

        bar.set_message(file_str.to_string());
        bar.inc(1);
    }

    bar.finish();
    Ok(ftp)
}

fn get_delete_files(mut ftp: FtpStream, root: &str) -> Result<(FtpStream, Vec<DeletePathMap>), FtpControllerError> {
    let mut files: Vec<DeletePathMap> = Vec::new();

    // FTPサーバーからファイルリストを取得
    let file_list = ftp.list(Some(root))
        .map_err(|e| FtpControllerError::FileListError(format!("Failed to list directory {}: {}", root, e)))?;

    for file in file_list {
        let arr_file_data = file.split_whitespace().collect::<Vec<&str>>();

        // ファイル名部分が存在するか確認
        if arr_file_data.is_empty() {
            eprintln!("Warning: Empty file entry encountered, skipping");
            continue;
        }

        let file_2 = &file;

        // ファイル名を取得（配列の最後の要素）
        let file_1 = if !arr_file_data.is_empty() {
            arr_file_data[arr_file_data.len() - 1]
        } else {
            // 何らかの理由で分割後の配列が空だった場合はスキップ
            eprintln!("Warning: Could not parse file entry: {}", file);
            continue;
        };

        // ファイルタイプが判別できることを確認
        if file_2.is_empty() {
            eprintln!("Warning: Empty file type encountered, skipping");
            continue;
        }

        let file_data = DeletePathMap {
            file_type: if !file_2.is_empty() {
                file_2[..1].to_string()
            } else {
                // タイプが取得できない場合はファイルと仮定
                "f".to_string()
            },
            file_name: file_1.to_string()
        };

        files.push(file_data);
    }

    Ok((ftp, files))
}

fn delete (mut ftp: FtpStream, path: &str) -> Result<FtpStream, FtpControllerError> {
    // ファイル削除時のエラーハンドリングを追加
    ftp.rm(path).map_err(|e| {
        eprintln!("Warning: Failed to delete file {}: {}", path, e);
        FtpControllerError::FileDeleteError(format!("Failed to delete file {}: {}", path, e))
    })?;

    Ok(ftp)
}

fn delete_files(mut ftp: FtpStream, root: &str) -> Result<FtpStream, FtpControllerError> {
    // ファイルリスト取得
    let (temp_ftp, file_list) = get_delete_files(ftp, root)?;
    ftp = temp_ftp;

    for item in file_list {
        let mut delete_path = DefaultHasher::new();
        item.hash(&mut delete_path);
        let _ = delete_path.finish();

        if item.file_type != String::from("d") {
            // ファイルの場合
            let mut path = PathBuf::from(root);
            path.push(&item.file_name);

            let path_str = path.to_str()
                .ok_or_else(|| FtpControllerError::ConversionError(format!("Failed to convert path to string: {:?}", path)))?;

            // ファイル削除実行
            ftp = delete(ftp, path_str)?;
        } else {
            // ディレクトリの場合は再帰的に処理
            let mut path = PathBuf::from(root);
            path.push(&item.file_name);

            let path_str = path.to_str()
                .ok_or_else(|| FtpControllerError::ConversionError(format!("Failed to convert path to string: {:?}", path)))?;

            // サブディレクトリ内のファイルを削除
            ftp = delete_files(ftp, path_str)?;

            // 空になったディレクトリを削除
            if let Err(e) = ftp.rmdir(path_str) {
                eprintln!("Warning: Failed to remove directory {}: {}", path_str, e);
                // ディレクトリの削除に失敗しても処理は続行
            }
        }
    }

    Ok(ftp)
}

pub fn ftp_init(local: &str, remote: &str, host: &str, user: &str, pw: &str, is_delete: bool) -> Result<(), FtpControllerError> {
    const MAX_CONNECTION_RETRIES: u8 = 3;
    let mut connection_retry = 0;
    
    // 接続リトライループ
    loop {
        // FTP接続
        let connect_result = FtpStream::connect(host);
        
        if let Err(e) = &connect_result {
            connection_retry += 1;
            if connection_retry >= MAX_CONNECTION_RETRIES {
                return Err(FtpControllerError::FtpError(e.clone()));
            }
            eprintln!("Warning: Connection attempt {} failed: {}. Retrying...", connection_retry, e);
            continue;
        }
        
        let mut ftp = connect_result?;
        
        // 接続タイムアウトの設定
        ftp.set_timeout(Some(Duration::from_secs(300)))
            .map_err(|e| FtpControllerError::FtpError(e))?;

        // ログイン
        if let Err(e) = ftp.login(user, pw) {
            connection_retry += 1;
            if connection_retry >= MAX_CONNECTION_RETRIES {
                return Err(FtpControllerError::FtpError(e));
            }
            eprintln!("Warning: Login attempt {} failed: {}. Retrying...", connection_retry, e);
            continue;
        }

        // バイナリモードを設定（失敗した場合は続行しない）
        ftp.transfer_type(ftp::types::FileType::Binary)
            .map_err(|e| FtpControllerError::TransferModeError(format!("Failed to set binary transfer mode: {}", e)))?;

        // リモートディレクトリ階層を作成し移動
        for remote_root in remote.split("/").collect::<Vec<_>>() {
            if remote_root.is_empty() {
                continue;
            }

            // ディレクトリが存在するか確認
            let dir_exists = ftp.size(remote_root).is_ok();

            // 存在しない場合は作成
            if !dir_exists {
                if let Err(e) = ftp.mkdir(remote_root) {
                    eprintln!("Warning: Could not create directory {}: {}", remote_root, e);
                    // 既に存在する場合など、エラーを記録するが処理は続行
                }
            }

            // ディレクトリに移動
            if let Err(e) = ftp.cwd(remote_root) {
                return Err(FtpControllerError::DirCreateError(
                    format!("Failed to change to directory {}: {}", remote_root, e)
                ));
            }
        }

        // ファイル削除処理（要求された場合）
        if is_delete {
            println!("Start delete remote");
            let last_delete_root = PathBuf::from("./");

            let last_delete_root_str = last_delete_root.to_str()
                .ok_or_else(|| FtpControllerError::ConversionError(format!(
                    "Failed to convert path to string: {:?}", last_delete_root
                )))?;

            ftp = delete_files(ftp, last_delete_root_str)?;
            println!("Finish delete remote");
        }

        // アップロード処理
        println!("Start Upload");
        ftp = upload_files(ftp, local)?;
        println!("End Upload");

        // 接続を正常に終了
        if let Err(e) = ftp.quit() {
            eprintln!("Warning: Error when closing FTP connection: {}", e);
            // 接続終了時のエラーは最終結果に影響しないので、警告だけ出して続行
        }

        // すべての処理が成功したのでループを抜ける
        break;
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile;

    #[test]
    fn test_get_remotes_empty_dir() {
        let temp_dir = tempfile::tempdir().unwrap();
        let dir_path = temp_dir.path().to_path_buf();
        let result = get_remotes(dir_path.to_str().unwrap(), &dir_path);
        assert!(result.is_ok());
        let (files, dirs) = result.unwrap();
        assert!(files.is_empty());
        assert!(dirs.is_empty());
    }

    #[test]
    fn test_delete_path_map_hash() {
        let a = DeletePathMap { file_type: "f".to_string(), file_name: "file.txt".to_string() };
        let b = DeletePathMap { file_type: "f".to_string(), file_name: "file.txt".to_string() };
        let mut hasher_a = DefaultHasher::new();
        let mut hasher_b = DefaultHasher::new();
        a.hash(&mut hasher_a);
        b.hash(&mut hasher_b);
        assert_eq!(hasher_a.finish(), hasher_b.finish());
    }
}
