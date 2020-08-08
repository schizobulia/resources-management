import axios from 'axios';
import { message } from 'antd';
import Tool from './tool';
import router from 'umi/router';

export default {
    httpPost: function (url, data, headers, callback) {
        axios.post(Tool.getUrl() + url, data)
            .then(function (response) {
                if (response.status === 200) {
                    let res = response.data;
                    if (res.code !== 1) {
                        message.error(res.err);
                        this.httpError(res.err);
                    }
                    callback(res);
                } else {
                    callback(0);
                }
            })
            .catch(function (error) {
                console.log(error);
                callback(0);
            });
    },

    httpget: function (url, headers, callback) {
        let options = {
            method: 'GET',
            headers: Object.assign(headers, { Authorization: `Bearer ${Tool.getToken()}`, 'content-type': 'application/x-www-form-urlencoded' }),
            url: Tool.getUrl() + url,
        };
        axios(options).then((response) => {
            let res = response.data;
            if (res.code !== 1) {
                message.error(res.err);
                this.httpError(res.err);
            }
            callback(res);
        }).catch((error) => {
            console.log(error);
            callback(0);
        }).finally(() => {

        })
    },

    /**
     * slice file and upload
     * @param {*} file 
     * @param {*} url   
     * @param {*} form 
     * @param {*} callbak
     * return { code: 1, data: { index: index } } 
     */
    uploadFileShard: function (file, url, callbak) {

        let fileObj = {
            chunks: [],
            name: ''
        };

        let chunk = 100 * 1024;
        let now_index = 0;
        let start = 0;
        let as = file.name.split('.');
        fileObj.name = new Date().getTime() + '.' + as[as.length - 1];

        //文件分片
        for (let i = 0; i < Math.ceil(file.size / chunk); i++) {
            let end = start + chunk;
            fileObj.chunks[i] = file.slice(start, end);
            start = end;
        }
        //获取文件二进制数据
        let getFileBinary = function (file, cb) {
            var reader = new FileReader();
            reader.readAsBinaryString(file);
            reader.onload = function (e) {
                if (typeof cb === "function") {
                    cb.call(this, this.result);
                }
            }
        }
        let upload = function () {
            if (fileObj.chunks.length - 1 !== now_index) {
                getFileBinary(fileObj.chunks[now_index], function (binary) {
                    var formdata = new FormData();
                    formdata.append("index", now_index);
                    formdata.append("len", fileObj.chunks.length - 1);
                    formdata.append("name", fileObj.name);
                    formdata.append("file", fileObj.chunks[now_index]);
                    let options = {
                        method: 'POST',
                        headers: { Authorization: `Bearer ${Tool.getToken()}`, 'content-type': 'application/x-www-form-urlencoded' },
                        url: Tool.getUrl() + url,
                        processData: false,
                        contentType: false,
                        data: formdata,
                    };

                    axios(options).then((response) => {
                        let res = response.data;
                        if (parseInt(res.code) === 1) {
                            upload(now_index);
                            now_index += 1;
                            callbak(res, fileObj.chunks.length - 1, fileObj.name);
                        } else {
                            callbak(0);
                        }
                    }).catch((error) => {
                        console.error(error.responseJSON.message);
                    }).finally(() => {
                    });
                })
            }
        }
        upload(now_index);
    },


    httpError(msg) {
        let err = { code: msg };
        console.log(err);
        if (err.code === "EPERM") {
        }
        if (err.code === "credentials_required") {
        }
        if (err.code === "invalid_param") {
        }
        if (err.code === "invalid_token") {
            router.push('/users/login');
        }
        if (err.code === "jwt expired") {
            router.push('/users/login');
        }
    }
};