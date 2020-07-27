const fs = require('fs');
const path = require('path');

class FileTool {

    /**
     * delete dir
     * @param {*} dir
     */
    async rmdirAsync(filePath) {
        if (!await fs.existsSync(filePath)) {
            return;
        }
        let stat = await fs.statSync(filePath);
        if (stat.isFile()) {
            await fs.unlinkSync(filePath);
        } else {
            let dirs = await fs.readdirSync(filePath);
            let tag = true;
            while (tag && dirs.length) {
                tag = false;
                let dir = dirs.pop();
                await this.rmdirAsync(path.join(filePath, dir));
                tag = true;
            }
            await fs.rmdirSync(filePath);
        }
    }

    /**
     * delete files by dir
     * @param {*} dirPath 
     */
    async deleteDirFiles(dirPath) {
        if (!await fs.existsSync(dirPath)) {
            return;
        };
        let arr = await fs.readdirSync(dirPath, { withFileTypes: true });
        let files = arr.filter((ele) => { return !ele.isDirectory() });
        let tag = true;
        while (tag && files.length) {
            tag = false;
            let ele = files.pop();
            await fs.unlinkSync(`${dirPath}${ele.name}`);
            tag = true;
        }
    }

    /**
     * mkdir
     * @param {*} dirname 
     */
    async mkdirsSync(dirname) {
        if (await fs.existsSync(dirname)) {
            return true;
        } else {
            if (await this.mkdirsSync(path.dirname(dirname))) {
                await fs.mkdirSync(dirname);
                return true;
            }
        }
    }
}

module.exports = FileTool;