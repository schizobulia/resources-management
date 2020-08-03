const task = require('./task');
const FfmpegCommand = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

/**
 * image conversion class
 */
class ImageConversion {

    /**
     * image conversion webp
     * @param {*} inputFile input file path 
     * @param {*} outputFile output file path
     */
    webp(argument) {
        let that = this;
        FfmpegCommand(argument.inputFile)
            .output(`${argument.outputFile}/1_img.webp`)
            .outputOptions([
                '-vf scale=iw:ih',
                '-codec libwebp',
                '-lossless 0',
                '-quality 90',
            ])
            .output(`${argument.outputFile}/2_img.webp`)
            .outputOptions([
                '-vf scale=iw:ih',
                '-codec libwebp',
                '-lossless 0',
                '-quality 70',
            ])
            .output(`${argument.outputFile}/3_img.webp`)
            .outputOptions([
                '-vf scale=iw:ih',
                '-codec libwebp',
                '-lossless 0',
                '-quality 50',
            ])
            .output(`${argument.outputFile}/4_img.webp`)
            .outputOptions([
                '-vf scale=iw:ih',
                '-codec libwebp',
                '-lossless 0',
                '-quality 30',
            ])
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
    async getImageSourceConf() {
        return JSON.parse(await fs.readFileSync(path.join(__dirname, '../../db/image_config.json')));
    }

    /**
     * set source file config
     * @param {*} filePath 
     * @param {*} data 
     */
    async setImageSourceConf(endFileName) {
        let data = await this.getImageSourceConf();
        data.endFile = endFileName;
        data.id += 1;
        return await fs.writeFileSync(path.join(__dirname, '../../db/image_config.json'), JSON.stringify(data));
    }
}

module.exports = ImageConversion;