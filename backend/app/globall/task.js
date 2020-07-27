const Tool = require('./tool');
let tasks = [];

/**
 * task
 */
module.exports = {
    /**
     * add task
     * @param {*} callback 
     */
    addTask: function (type, callback) {
        let task = {};
        task.status = 0;  //0: add  1: start   2：remove  3：pause  4：end
        task.id = new Tool().random();
        task.mark = type;
        task.even = callback;
        tasks.push(task);
        return task.id;
    },

    /**
     * start task
     * @param {*} id 
     * @param {*} arg 
     */
    startTask(id, arg) {
        let task = this.findTask(id);
        task.status = 1;
        task.even(arg);
        return task.status;
    },

    /**
     * remove task
     * @param {*} id 
     */
    removeTask(id) {
        let index = tasks.findIndex(function (t) {
            if (t) {
                return id === t.id;
            }
        });
        let task = tasks[index];
        if (task.status === 1) {
            this.pasuseTask(3);
        }
        delete tasks[index];
        return task.status;
    },

    pasuseTask(id) {

    },

    /**
     * task status id end
     * @param {*} id 
     */
    endTask(id) {
        let task = this.findTask(id);
        task.status = 4;
        let thread = setTimeout(() => {
            this.removeTask(id);
            clearTimeout(thread);
        }, 3000);
        return task.status;
    },

    /**
     * find task
     * @param {*} id 
     */
    findTask(id) {
        let task = tasks.find(function (t) {
            if (t) {
                return id === t.id;
            }
        });
        if (!task) {
            throw new Error('task is not add');
        }
        return task;
    },

    /**
     * get all task
     */
    getAllTasks() {
        return tasks;
    }
}