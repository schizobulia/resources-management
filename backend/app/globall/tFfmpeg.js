const FfmpegCommand = require('fluent-ffmpeg');
const task = require('./task');

module.exports = {
    /**
     * 
     * @param {*} inputFile input file path 
     * @param {*} outputFile output file path
     * @param {*} arg   argument
     */
    hls: function (argument) {
        let that = this;
        FfmpegCommand(argument.inputFile)
            // set video bitrate
            .videoBitrate(argument.arg.mu)
            // set target codec
            .videoCodec('libx264')
            // set audio bitrate
            .audioBitrate('128k')
            // set number of audio channels
            .audioChannels(2)
            // set hls segments time
            .addOption('-hls_time', 10)
            // include all the segments in the list
            .addOption('-hls_list_size', 0)
            // setup event handlers
            .save(argument.outputFile)
            .on('start', () => {   //分片结束时回调
            })
            .on('end', () => {   //分片结束时回调
                task.endTask(that.id);
            })
            .on('stderr', function (stderrLine) { //在分片加密时的回调
            })
            .on('error', function (err) {        //
                task.endTask(that.id);
            });
    },
}