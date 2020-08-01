const FfmpegCommand = require('fluent-ffmpeg');
const task = require('./task');
const fs = require('fs');
const path = require('path');

class VieoConversion {

    constructor(){
        FfmpegCommand.setFfmpegPath(path.join(__dirname, '../../ffmpeg/bin/ffmpeg.exe'));
    }
    /**
     * 
     * @param {*} inputFile input file path 
     * @param {*} outputFile output file path
     * @param {*} arg   argument
     */
    hls(argument) {
        let that = this;
        FfmpegCommand(argument.inputFile)
            .output(argument.outputFile + '_n1.m3u8')
            .videoCodec('libx264')
            .size('1820x1080')

            .output(argument.outputFile + '_n2.m3u8')
            .videoCodec('libx264')
            .size('1280x1024')

            .output(argument.outputFile + '_n3.m3u8')
            .videoCodec('libx264')
            .size('800x600')

            // .videoBitrate(`${argument.arg.mu}k`, true)
            // .audioChannels(2)
            // // set hls segments time
            .addOption('-hls_time', 10)
            // include all the segments in the list
            .addOption('-hls_list_size', 0)
            // setup event handlers
            .on('start', () => {
            })
            .on('end', () => {
                task.endTask(that.id);
            })
            .on('stderr', function (stderrLine) {
            })
            .on('error', function (err) {
                task.endTask(that.id);
            }).run();
    }

    /**
     * get source file config
     * @param {*} filePath 
     */
    async getVideoSourceConf(){
        return JSON.parse(await fs.readFileSync(path.join(__dirname, '../../db/video_config.json')));
    }

    /**
     * set source file config
     * @param {*} filePath 
     * @param {*} data 
     */
    async setVideoSourceConf(endFileName){
        let data = await this.getVideoSourceConf();
        data.endFile = endFileName;
        data.id += 1;
        return await fs.writeFileSync(path.join(__dirname, '../../db/video_config.json'), JSON.stringify(data));
    }
}

module.exports = VieoConversion;