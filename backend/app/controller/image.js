'use strict';

const Controller = require('egg').Controller;
const fs = require('fs');
const path = require('path');
const FileTool = require('../globall/tFile');
const task = require('../globall/task');
const pump = require('mz-modules/pump');
let ImageConversion = require('../globall/tImage');

class ImageController extends Controller {


    /**
     * upload source video file
     */
    async upload() {
        const { ctx } = this;
        const stream = await this.ctx.getFileStream();
        ctx.validate({ index: 'string', len: 'string', name: 'string' }, stream.fields);
        let info = stream.fields;
        let fileName = info.name;
        let fileTool = new FileTool();
        let baseDir = `${this.config.baseDir}/tmp/${fileName.split('.')[0]}`;

        if (info.index == 0) {
            if (await fs.existsSync(baseDir)) {  //if it exists, delete it
                await fileTool.rmdirAsync(baseDir);
            }
            await fs.mkdirSync(baseDir);
        }

        const writeStream = fs.createWriteStream(path.join(this.config.baseDir, `/tmp/${fileName.split('.')[0]}`, info.index + '.' + fileName.split('.')[1]));
        await pump(stream, writeStream);

        //merge files
        if (info.index == info.len) {
            let index = 0;
            let videoConf = new ImageConversion();
            let sourceFileConf = await videoConf.getImageSourceConf(); //new file id
            let sid = `${sourceFileConf.id + 1}.${fileName.split('.')[1]}`;
            //create source image
            while (info.len > -1) {
                let text = await fs.readFileSync(`${baseDir}/${index}.${info.name.split('.')[1]}`, { encoding: "binary" });
                await fs.appendFileSync(path.join(this.config.baseDir, `/source/image/`, sid), text, { encoding: "binary" });
                index++;
                info.len--;
            }
            //create webp and update config
            let imageOutPutPath = `${this.config.baseDir}/app/public/image/${sid.split('.')}/`;
            await new FileTool().mkdirsSync(imageOutPutPath);
            let taskId = task.addTask('image', new ImageConversion().webp);
            task.startTask(taskId, {
                inputFile: `${this.config.baseDir}/source/image/${sid}`,
                outputFile: `${imageOutPutPath}/${sourceFileConf.id + 1}`, arg: {}
            });
            await videoConf.setImageSourceConf(sid);
            await fileTool.rmdirAsync(baseDir);
            ctx.body = { code: 1, data: { index: info.index, source: `/image/${sid}`, hls: `/public/image/${sid.split('.')[0]}/1_img.webp` } };
            return;
        }
        ctx.body = { code: 1, data: { index: info.index, hls: null, source: null } };
    }

    /**
     * video to hls
     */
    async conversion() {
        const { ctx } = this;
        const { sid } = ctx.request.body;
        ctx.validate({ sid: 'string', }, { sid: sid });
        let isExitTask = task.getAllTasks().find(function (task) {
            if (task) {
                return task.mark === `image`;
            }
        });
        if (isExitTask) {
            ctx.body = { code: 2, err: 'task is start now' };
            return;
        }

        let outPutFilePath = `${this.config.baseDir}/app/public/image/${sid.split('.')[0]}/`;

        //mkdir source image dir 
        if (!await fs.existsSync(outPutFilePath)) {
            await fs.mkdirSync(outPutFilePath);
        }
        outPutFilePath = `${outPutFilePath}/${mu}/`;
        //mkdir webp dir
        if (await fs.existsSync(outPutFilePath)) {
            let fileTool = new FileTool();
            await fileTool.deleteDirFiles(outPutFilePath);
        } else {
            await fs.mkdirSync(outPutFilePath);
        }

        let taskId = task.addTask('image', new ImageConversion().webp);
        task.startTask(taskId, { inputFile: `${this.config.baseDir}/source/image/${sid}`, outputFile: outPutFilePath, arg: {} });
        if (taskId) {
            ctx.body = { code: 1, path: `/public/image/${sid.split('.')[0]}/1_img.webp` };
        } else {
            ctx.body = { code: 0, err: res.err };
        }
    }
}

module.exports = ImageController;