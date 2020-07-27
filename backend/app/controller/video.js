'use strict';

const Controller = require('egg').Controller;
const fs = require('fs');
const VieoConversion = require('../globall/tFfmpeg');
const FileTool = require('../globall/tFile');
const path = require('path');
const task = require('../globall/task');
const pump = require('mz-modules/pump');

class VideoController extends Controller {

    /**
     * get source file directory
     */
    async index() {
        const { ctx } = this;
        let q = ctx.request.body.q || '/';
        let basePath = this.config.baseDir + '/source' + q;
        const arr = await fs.readdirSync(basePath, { withFileTypes: true });
        let list = {
            dirs: arr.filter((ele) => { return ele.isDirectory() })
        };
        ctx.body = { code: 1, data: list };
    }

    async video() {
        const { ctx } = this;
        let filePath = `${this.config.baseDir}/source/video/${ctx.params.filename}`;
        ctx.attachment(ctx.params.filename);
        ctx.set('Content-Type', 'application/octet-stream');
        ctx.body = fs.createReadStream(filePath);
    }

    /**
     * upload source video file
     */
    async upload() {
        const { ctx } = this;
        const stream = await this.ctx.getFileStream();
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
            let videoConf = new VieoConversion();
            let sourceFileConf = await videoConf.getVideoSourceConf(`${this.config.baseDir}/source/video/video`); //new file id
            let sid = `${sourceFileConf.id + 1}.${fileName.split('.')[1]}`;
            //create source video
            while (info.len > -1) {
                let text = await fs.readFileSync(`${baseDir}/${index}.${info.name.split('.')[1]}`, { encoding: "binary" });
                await fs.appendFileSync(path.join(this.config.baseDir,
                    `/source/video/`, sid),
                    text, { encoding: "binary" });
                index++;
                info.len--;
            }
            //create hls and update config
            let m3u8OutPutPath = `${this.config.baseDir}/app/public/video/${sid.split('.')[0]}/1024/`;
            await new FileTool().mkdirsSync(m3u8OutPutPath);
            let taskId = task.addTask(sid, new VieoConversion().hls);
            task.startTask(taskId, {
                inputFile: `${this.config.baseDir}/source/video/${sid}`,
                outputFile: `${m3u8OutPutPath}/${sourceFileConf.id + 1}`, arg: { mu: '1024' }
            });
            await videoConf.setVideoSourceConf(`${this.config.baseDir}/source/video/video`, sid);
            await fileTool.rmdirAsync(baseDir);
            ctx.body = { code: 1, data: { index: info.index, source: `/video/${sid}`, hls: `/public/video/${sid.split('.')[0]}/1024/${sourceFileConf.id + 1}` } };
            return;
        }
        ctx.body = { code: 1, data: { index: info.index, hls: null, source: null } };
    }

    /**
     * video to hls
     */
    async conversion() {
        const { ctx } = this;
        const { mu, sid } = ctx.request.body;
        ctx.validate({ mu: ['1024'], sid: 'string', }, { mu: mu, sid: sid });
        let hlsDirName = sid.split('.')[0];
        let isExitTask = task.getAllTasks().find(function (task) {
            if (task) {
                return task.mark === `${hlsDirName}_${mu}`;
            }
        });
        if (isExitTask) {
            ctx.body = { code: 2, err: 'task is start now' };
            return;
        }

        let outPutFilePath = `${this.config.baseDir}/app/public/video/${hlsDirName}/`;

        //mkdir source video dir 
        if (!await fs.existsSync(outPutFilePath)) {
            await fs.mkdirSync(outPutFilePath);
        }
        outPutFilePath = `${outPutFilePath}/${mu}/`;
        //mkdir mu dir
        if (await fs.existsSync(outPutFilePath)) {
            let fileTool = new FileTool();
            await fileTool.deleteDirFiles(outPutFilePath);
        } else {
            await fs.mkdirSync(outPutFilePath);
        }
        let fileName = `${hlsDirName}_${mu}`;
        let hlsFilePath = `${outPutFilePath}${fileName}`;
        let taskId = task.addTask(fileName, new VieoConversion().hls);
        task.startTask(taskId, { inputFile: `${this.config.baseDir}/source/video/${sid}`, outputFile: hlsFilePath, arg: { mu: mu } });
        if (taskId) {
            ctx.body = { code: 1, path: `/public/video/${hlsDirName}/${mu}/${fileName}` };
        } else {
            ctx.body = { code: 0, err: res.err };
        }
    }

    /**
     * Get the task about the video
     */
    async tasks() {
        const { ctx } = this;
        ctx.body = { code: 1, data: task.getAllTasks().filter((ele) => ele.mark.split('.')[1] === 'm3u8') };
    }
}

module.exports = VideoController;
