const FfmpegCommand = require('fluent-ffmpeg');
const task = require('./task');
const fs = require('fs');

class VieoConversion {
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
    async getVideoSourceConf(filePath){
        return JSON.parse(await fs.readFileSync(`${filePath}_config.json`));
    }

    /**
     * set source file config
     * @param {*} filePath 
     * @param {*} data 
     */
    async setVideoSourceConf(filePath, endFileName){
        let data = JSON.parse(await fs.readFileSync(`${filePath}_config.json`));
        data.endFile = endFileName;
        data.id += 1;
        return await fs.writeFileSync(`${filePath}_config.json`, JSON.stringify(data));
    }
}

module.exports = VieoConversion;