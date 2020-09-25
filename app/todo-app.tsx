
import {
  h,
  View,
  Text,
  createComponent,
  useState,
  useMemo,
  useRef,
  forwardRef,
} from '../src/core';
import { render } from '../src/platform/browser';


const domElement = document.getElementById('root');

const div = (props = {}) => View({ ...props, as: 'div' });
const button = (props = {}) => View({ ...props, as: 'button' });
const input = (props = {}) => View({ ...props, isVoid: true, as: 'input' });
const label = (props = {}) => View({ ...props, as: 'label' });

class TodoTask {
  private static nextId: number = 0;
  public id: number;
  public name: string;
  public completed: boolean;

  constructor(name: string, completed: boolean = false) {
    this.id = ++TodoTask.nextId;
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

const TextField = forwardRef(createComponent<TextFieldProps, HTMLInputElement>(({ value, fulllWidth, onEnter, onChange }, ref) => {
    const handleChange = (e: InputEvent) => onChange(e, (e.target as HTMLInputElement).value);
    const handleKeyDown = (e: KeyboardEvent) => onEnter && e.key === 'Enter' && onEnter(e);

    return (
      input({
        ref,
        value,
        style: `width: ${fulllWidth ? '100%' : 'auto'}`,
        onInput: handleChange,
        onKeyDown: handleKeyDown,
      })
    )
  }, { displayName: 'TextField' }));

type CheckboxProps = {
  value: boolean;
  labelText: string;
  onChange: (e, value: boolean) => void;
};

const Checkbox = createComponent<CheckboxProps>(({ value, labelText, onChange }) => {
  const handleInput = (e: InputEvent) => onChange(e, !value);

  return (
    label({
      slot: [
        input({
          style: 'margin-right: 10px',
          type: 'checkbox',
          checked: value || undefined,
          onInput: handleInput,
        }),
        Text(labelText),
      ],
    })
  )
}, { displayName: 'Checkbox' });

type TaskItemProps = {
  task: TodoTask;
  onComplete: (id: number, complted: boolean) => void;
  onRemove: (id: number) => void;
};

const TaskItem = createComponent<TaskItemProps>(({ task, onComplete, onRemove }) => {
  const handleCompleted = (_, completed: boolean) => onComplete(task.id, completed);
  const handleRemove = () => onRemove(task.id);

  return (
    div({
      style: 'display: flex; justify-content: space-between; border-bottom: 1px solid yellow; padding: 6px;',
      slot: [
        div({
          style: 'display: flex;',
          slot: [
            div({
              style: 'margin-right: 10px;',
              slot: [
                Checkbox({
                  value: task.completed,
                  labelText: task.completed ? 'yes' : 'no',
                  onChange: handleCompleted,
                }),
              ],
            }),
            Text(task.name),
          ],
        }),
        button({
          slot: [Text('remove')],
          onClick: handleRemove,
        }),
      ],
    })
  )
}, { displayName: 'TaskItem' });

const TodoApp = createComponent(() => {
  const sourseTasks = useMemo(() => [
    new TodoTask('Learn Dark', true),
    new TodoTask('Learn React', true),
    new TodoTask('Learn Angular'),
    new TodoTask('Learn Vue'),
  ], []);
  const [tasks, setTasks] = useState<Array<TodoTask>>(sourseTasks);
  const [taskName, setTaskName] = useState('');
  const textFieldRef = useRef<HTMLInputElement>(null);
  const handleChangeTaskName = (_, value: string) => setTaskName(value);
  const handleAddTask = () => {
    if (!taskName) return;
    setTasks([
      new TodoTask(taskName),
      ...tasks,
    ]);
    setTaskName('');
    textFieldRef.current.focus();
  };
  const handleComplete = (id: number, completed: boolean) => {
    tasks
      .find(x => x.id === id)
      .completed = completed;
    setTasks([...tasks]);
  };
  const handleRemove = (id: number) => setTasks(tasks.filter(x => x.id !== id));

  return (
    div({
      style: 'padding: 16px',
      slot: [
        div({
          style: 'display: flex; margin-bottom: 20px;',
          slot: [
            TextField({
              ref: textFieldRef,
              value: taskName,
              fulllWidth: true,
              onEnter: handleAddTask,
              onChange: handleChangeTaskName,
            }),
            button({
              slot: Text('Add'),
              onClick: handleAddTask,
            }),
          ],
        }),
        div({
          slot: tasks.map(task => (
            TaskItem({
              key: task.id,
              task,
              onComplete: handleComplete,
              onRemove: handleRemove,
            })
          )),
        }),
      ],
    })
  )
}, { displayName: 'TodoApp' });

render(TodoApp(), domElement);
