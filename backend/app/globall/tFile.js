const fs = require('fs');
const path = require('path');

module.exports = {

    /**
     * delete dir
     * @param {*} dir
     */
    rmdirAsync: async function (filePath) {
        if (!await fs.existsSync(filePath)) {
            return;
        }
        let stat = await fs.statSync(filePath);
        if (stat.isFile()) {
            await fs.unlinkSync(filePath);
        } else {
            let dirs = await fs.readdirSync(filePath);
            let ts = dirs.map(async (dir) => {
                await this.rmdirAsync(path.join(filePath, dir));
            })
            await Promise.all(ts);
            await fs.rmdirSync(filePath);
        }
    },


    deleteDirFiles: async function (dirPath) {
        if (!await fs.existsSync(dirPath)) {
            return;
        };
        let arr = await fs.readdirSync(dirPath, { withFileTypes: true });
        files = arr.filter((ele) => { return !ele.isDirectory() });
        let tag = true;
        while (tag && files.length) {
            tag = false;
            let ele = files.pop();
            await fs.unlinkSync(`${dirPath}${ele.name}`);
            tag = true;
        }
    }

}