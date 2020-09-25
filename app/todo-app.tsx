
import {
  h,
  createComponent,
  useState,
} from '../src/core';
import { render } from '../src/platform/browser';


const domElement = document.getElementById('root');

let nextId = 0;

class TodoTask {
  public id: number;
  public name: string;
  public completed: boolean;

  constructor(name: string, completed: boolean = false) {
    this.id = ++nextId;
    this.name = name;
    this.completed = completed;
  }
}

type TextFieldProps = {
  value: string;
  fulllWidth?: boolean;
  onEnter?: (e: KeyboardEvent) => void;
  onChange: (e: InputEvent, value: string) => void;
};

const TextField = createComponent<TextFieldProps>(({ value, fulllWidth, onEnter, onChange }) => {
  const handleChange = (e: InputEvent) => {
    const value = (e.target as HTMLInputElement).value;

    onChange(e, value);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!onEnter) return;
    if (e.key === 'Enter') {
      onEnter(e);
    }
  };

  return (
    <input
      style={`width: ${fulllWidth ? '100%' : 'auto'}`}
      value={value}
      onInput={handleChange}
      onKeyDown={handleKeyDown}
    />
  )
}, { displayName: 'TextField' });

type CheckboxProps = {
  value: boolean;
  label: string;
  onChange: (e, value: boolean) => void;
};

const Checkbox = createComponent<CheckboxProps>(({ value, label, onChange }) => {
  const handleInput = (e: InputEvent) => onChange(e, !value);;

  return (
    <label>
      <input
        style='margin-right: 10px'
        type='checkbox'
        checked={value || undefined}
        onInput={handleInput}
      />
      {label}
    </label>
  )
}, { displayName: 'Checkbox' });

type TaskItemProps = {
  task: TodoTask;
  onComplete: (task: TodoTask, complted: boolean) => void;
};

const TaskItem = createComponent<TaskItemProps>(({ task, onComplete }) => {
  const handleCompleted = (_, completed: boolean) => onComplete(task, completed);

  return (
    <div style='display: flex; border-bottom: 1px solid yellow; padding: 6px;'>
      <div style='margin-right: 10px;'>
        <Checkbox
          value={task.completed}
          label={task.completed ? 'yes' : 'no'}
          onChange={handleCompleted}
        />
      </div>
      <div>{task.name}</div>
    </div>
  )
}, { displayName: 'TaskItem' });

const taskList = [
  new TodoTask('Learn Dark', true),
  new TodoTask('Learn React', true),
  new TodoTask('Learn Angular'),
  new TodoTask('Learn Vue'),
];

const TodoApp = createComponent(() => {
  const [tasks, setTasks] = useState<Array<TodoTask>>(taskList);
  const [taskName, setTaskName] = useState('');

  const handleChangeTaskName = (_, value: string) => setTaskName(value);

  const handleAddTask = () => {
    if (taskName) {
      setTasks([
        new TodoTask(taskName),
        ...tasks,
      ]);

      setTaskName('');
    }
  };

  const handleComplete = (task: TodoTask, completed: boolean) => {
    const idx = tasks.findIndex(x => x === task);

    task.completed = completed;
    tasks.splice(idx, 1, task);
    setTasks([...tasks]);
  };

  return (
    <div style='padding: 16px'>
      <div style='display: flex; margin-bottom: 20px;'>
        <TextField
          value={taskName}
          fulllWidth
          onEnter={handleAddTask}
          onChange={handleChangeTaskName}
        />
        <button onClick={handleAddTask}>Add</button>
      </div>
      {tasks.map(task => {
        return (
          <TaskItem
            key={task.id}
            task={task}
            onComplete={handleComplete}
          />
        )
      })}
    </div>
  )
}, { displayName: 'TodoApp' });

render(TodoApp(), domElement);
