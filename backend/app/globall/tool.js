class Tool {
    /**
     * create random number
     */
    random() {
        return parseInt(Math.random() * 11111111111111111)
            + new Date().getTime()
            + parseInt(Math.random() * 33333333333333333);
    }
}

module.exports = Tool;