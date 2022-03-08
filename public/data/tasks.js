import TaskModel from "../models/task.js";

const Tasks = [
    new TaskModel (uuidv4(), ' task title 1', 1),
    new TaskModel (uuidv4(), ' task title 2', 2),
    new TaskModel (uuidv4(), ' task title 3', 3),
    new TaskModel (uuidv4(), ' task title 4', 2),
    new TaskModel (uuidv4(), ' task title 5', 3),
    new TaskModel (uuidv4(), ' task title 6', 2),
    new TaskModel (uuidv4(), ' task title 7', 3),
    new TaskModel (uuidv4(), ' task title 8', 1),
    new TaskModel (uuidv4(), ' task title 9', 2),
    new TaskModel (uuidv4(), ' task title 10', 3)
];
    export default Tasks;
