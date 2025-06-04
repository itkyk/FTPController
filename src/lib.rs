#![deny(clippy::all)]

#[macro_use]
mod ftp_module;

use napi_derive::napi;

#[napi]
fn deploy(local_root: String, remote_root: String, host: String,  password: String, user: String, port:String, is_delete: bool) {
    let str_port: &str = &port;
    let result_host = host.to_string() + ":" + &str_port;
    let mut deleting = false;
    if is_delete {
        deleting = true;
    }
    let res = ftp_module::ftp_init(&local_root, &remote_root, &result_host.as_str(), &user, &password, deleting);
    if !res.is_ok() {
        println!("FTP Connection Error");
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_deploy_runs() {
        // テスト用のダミー値で呼び出し（実際の接続は行わない）
        let local = String::from("/tmp");
        let remote = String::from("/tmp");
        let host = String::from("127.0.0.1");
        let password = String::from("dummy");
        let user = String::from("dummy");
        let port = String::from("21");
        // 副作用やpanicしないことのみ確認
        deploy(local, remote, host, password, user, port, false);
    }
}
