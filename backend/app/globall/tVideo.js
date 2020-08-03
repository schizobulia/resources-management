const FfmpegCommand = require('fluent-ffmpeg');
const task = require('./task');
const fs = require('fs');
const path = require('path');

/**
 * video Conversion class
 */
class VieoConversion {

    constructor(){
        // FfmpegCommand.setFfmpegPath(path.join(__dirname, '../../ffmpeg/bin/ffmpeg.exe'));
    }
    /**
     * 
     * @param {*} inputFile input file path 
     * @param {*} outputFile output file path
     */
    hls(argument) {
        let that = this;
        FfmpegCommand(argument.inputFile)
            .output(argument.outputFile + '_n1.m3u8')
            .videoCodec('libx264')

            .output(argument.outputFile + '_n2.m3u8')
            .videoCodec('libx264')
            .videoBitrate(`1024k`, true)

            .output(argument.outputFile + '_n3.m3u8')
            .videoCodec('libx264')
            .videoBitrate(`512k`, true)

            .audioChannels(2)
            .addOption('-hls_time', 10)
            .addOption('-hls_list_size', 0)
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