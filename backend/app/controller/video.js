'use strict';

const Controller = require('egg').Controller;
const fs = require('fs');
const ffpmeg = require('../globall/tFfmpeg');
const mFile = require('../globall/tFile');
const path = require('path');
const task = require('../globall/task');

class VideoController extends Controller {
    async index() {
        const { ctx } = this;
        let q = ctx.request.body.q || '/';
        let basePath = this.config.baseDir + '/source' + q;
        const arr = await fs.readdirSync(basePath, { withFileTypes: true });
        let list = {
            files: arr.filter((ele) => { return !ele.isDirectory() }),
            dirs: arr.filter((ele) => { return ele.isDirectory() })
        };
        ctx.body = { code: 1, data: list };
    }

    /**
     * upload source video file
     */
    async upload() {
        const { ctx } = this;
        let tmpNum = new Date().getTime();  //create random number for temporary

        let info = ctx.request.body;
        let baseDir = `${this.config.baseDir}/tmp/${tmpNum}`;
        if (info.index == 0) {
            if (await fs.existsSync(baseDir)) {  //如果存在就先删除
                await Tool.rmdirAsync(baseDir);
            }
            await fs.mkdirSync(baseDir);
        }
        await fs.appendFileSync(path.join(baseDir,
            info.index + '.' + info.name.split('.')[1]), info.data, { encoding: "binary" });
        if (info.index == info.len) {
            let index = 0;
            while (info.len > -1) {
                let text = await fs.readFileSync(`${baseDir}/${index}.${info.name.split('.')[1]}`, { encoding: "binary" });
                await fs.appendFileSync(path.join(this.config.baseDir, `/mirror${info.dir}`, info.name), text, { encoding: "binary" });
                index++;
                info.len--;
            }
            await Tool.rmdirAsync(baseDir);
        }
        ctx.body = { code: 1, data: { index: info.index } };
    }

    /**
     * video to hls
     */
    async conversion() {
        const { ctx } = this;
        const { mu, sid } = ctx.request.body;
        let isExitTask = task.getAllTasks().find(function (task) {
            if (task) {
                return task.mark === `${sid}-${mu}.m3u8`;
            }
        })
        if (isExitTask) {
            ctx.body = { code: 2, err: 'task is start now' };
            return;
        }

        ctx.validate({ mu: ['1024'], sid: 'string', }, { mu: mu, sid: sid });
        let outPutFilePath = `${this.config.baseDir}/app/public/video/${sid}/`;

        //mkdir source video dir 
        if (!await fs.existsSync(outPutFilePath)) {
            await fs.mkdirSync(outPutFilePath);
        }
        outPutFilePath = `${outPutFilePath}${mu}/`;
        //mkdir mu dir
        if (await fs.existsSync(outPutFilePath)) {
            await mFile.deleteDirFiles(outPutFilePath);
        } else {
            await fs.mkdirSync(outPutFilePath);
        }
        let fileName = `${sid}-${mu}.m3u8`;
        let hlsFilePath = `${outPutFilePath}${fileName}`;
        let taskId = task.addTask(fileName, ffpmeg.hls);
        task.startTask(taskId, { inputFile: `${this.config.baseDir}/source/video/${sid}.mp4`, outputFile: hlsFilePath, arg: { mu: mu } });
        if (taskId) {
            ctx.body = { code: 1, path: `/public/video/${sid}/${mu}/${fileName}` };
        } else {
            ctx.body = { code: 0, err: res.err };
        }
    }

    async tasks() {
        const { ctx } = this;
        ctx.body = { code: 1, data: task.getAllTasks() };
    }
}

module.exports = VideoController;
