import axios from 'axios';
import { message } from 'antd';
import Tool from './tool';

export default {
    httpPost: function (url, data, headers, callback) {
        axios.post(Tool.getUrl() + url, data)
            .then(function (response) {
                if (response.status === 200) {
                    let res = response.data;
                    if (res.code !== 1) {
                        message.error(res.err);
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
            }
            callback(res);
        }).catch((error) => {
            console.log(error);
            callback(0);
        }).finally(() => {

        })
    }
};