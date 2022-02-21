// const taskMode = require ('../models/task.js');
import TaskModel from "../models/task.js";

const Tasks = [
    new TaskModel( uuidv4(),'task model 1',1),
    new TaskModel(uuidv4(),'task model 2',2),
    new TaskModel( uuidv4(),'task model 3',3),
    new TaskModel( uuidv4(),'task model 4',2),
    new TaskModel(uuidv4(),'task model 5',1),
    new TaskModel( uuidv4(),'task model 6',1),
    new TaskModel(uuidv4(),'task model 7',2),
    new TaskModel( uuidv4(),'task model 8',3),
    new TaskModel( uuidv4(),'task model 9',2),
    new TaskModel(uuidv4(),'task model 10',1),
];
export default Tasks;