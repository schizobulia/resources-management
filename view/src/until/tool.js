

export default {
    /**
     * get api url
     */
    getUrl() {
        return 'http://47.100.178.137:8888';
    },

    /**
     * 获取Hls视频路径
     * @param {*} sid 
     */
    getStaticVideoHlsUrl(sid) {
        let baseUrl = this.getUrl();
        return [`${baseUrl}/public/video/${sid}/1024/${sid}_1024_n1.m3u8`,
        `${baseUrl}/public/video/${sid}/1024/${sid}_1024_n2.m3u8`,
        `${baseUrl}/public/video/${sid}/1024/${sid}_1024_n3.m3u8`,];
    },

    loadSourceVideo(url, callback) {
        let request = new XMLHttpRequest();
        request.responseType = 'blob';
        request.open('get', url, true);
        request.setRequestHeader('Authorization', `Bearer ${this.getToken()}`);
        request.onreadystatechange = e => {
            if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
                callback(URL.createObjectURL(request.response))
            }
        };
        request.send(null);
    },

    /**
     * 获取源视频路径
     * @param {*} filename 
     */
    getStaticVideoSourceUrl(filename) {
        let baseUrl = this.getUrl();
        return `${baseUrl}/video/${filename}`;
    },

    /**
     * Access permissions
     */
    getAuto: function () {
        return window.localStorage.getItem('roal') || '';
    },

    /**
     * Set the permissions
     * @param {*} roal 
     */
    setAuto(roal) {
        window.localStorage.setItem('roal', roal);
    },

    setToken(token) {
        window.localStorage.setItem('token', token);
    },

    getToken() {
        return window.localStorage.getItem('token') || '';
    }
}