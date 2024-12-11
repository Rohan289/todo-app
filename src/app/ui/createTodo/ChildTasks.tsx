import React from 'react';

import { ChildTasksType } from "./ChildTasks.model";

const ChildTasks: React.FC<ChildTasksType> = ({ bugs, features }) => {
        console.log(bugs,features);
        
        return <div>ChildTasks</div>
}
export default ChildTasks;