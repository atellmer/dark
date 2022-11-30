import { View, Text, createComponent, useState, useRef, forwardRef } from '@dark-engine/core';
import { createRoot, type SyntheticEvent } from '@dark-engine/platform-browser';

const div = (props = {}) => View({ ...props, as: 'div' });
const button = (props = {}) => View({ ...props, as: 'button' });
const input = (props = {}) => View({ ...props, isVoid: true, as: 'input' });
const label = (props = {}) => View({ ...props, as: 'label' });

class TodoTask {
  private static nextId = 0;
  public id: number;
  public name: string;
  public completed: boolean;

  constructor(name: string, completed = false) {
    this.id = ++TodoTask.nextId;
    this.name = name;
    this.completed = completed;
  }
}

type TextFieldProps = {
  value: string;
  fulllWidth?: boolean;
  onEnter?: (e: SyntheticEvent<KeyboardEvent, HTMLInputElement>) => void;
  onChange: (e: SyntheticEvent<InputEvent, HTMLInputElement>, value: string) => void;
};

const TextField = forwardRef(
  createComponent<TextFieldProps, HTMLInputElement>((props, ref) => {
    const { value, fulllWidth, onEnter, onChange } = props;

    const handleChange = (e: SyntheticEvent<InputEvent, HTMLInputElement>) => {
      onChange(e, e.target.value);
    };

    const handleKeyDown = (e: SyntheticEvent<KeyboardEvent, HTMLInputElement>) => {
      onEnter && e.sourceEvent.key === 'Enter' && onEnter(e);
    };

    return input({
      ref,
      value,
      style: `width: ${fulllWidth ? '100%' : 'auto'}`,
      onInput: handleChange,
      onKeyDown: handleKeyDown,
    });
  }),
);

type CheckboxProps = {
  value: boolean;
  labelText: string;
  onChange: (e, value: boolean) => void;
};

const Checkbox = createComponent<CheckboxProps>(props => {
  const { value, labelText, onChange } = props;

  const handleInput = (e: SyntheticEvent<InputEvent, HTMLInputElement>) => onChange(e, !value);

  return label({
    slot: [
      input({
        style: 'margin-right: 10px',
        type: 'checkbox',
        value: value,
        onInput: handleInput,
      }),
      Text(labelText),
    ],
  });
});

type TaskItemProps = {
  task: TodoTask;
  onComplete: (id: number, complted: boolean) => void;
  onRemove: (id: number) => void;
};

const TaskItem = createComponent<TaskItemProps>(props => {
  const { task, onComplete, onRemove } = props;

  const handleCompleted = (_, completed: boolean) => onComplete(task.id, completed);

  const handleRemove = () => onRemove(task.id);

  return div({
    style: 'display: flex; justify-content: space-between; border-bottom: 1px solid #666; padding: 6px;',
    slot: [
      div({
        style: 'display: flex;',
        slot: [
          div({
            style: `margin-right: 10px; ${task.completed ? 'text-decoration: line-through;' : ''}`,
            slot: [
              Checkbox({
                value: task.completed,
                labelText: task.name,
                onChange: handleCompleted,
              }),
            ],
          }),
        ],
      }),
      button({
        slot: [Text('remove')],
        onClick: handleRemove,
      }),
    ],
  });
});

const App = createComponent(() => {
  const [tasks, setTasks] = useState<Array<TodoTask>>(() => [
    new TodoTask('Learn Dark', true),
    new TodoTask('Learn React', true),
    new TodoTask('Learn Angular'),
    new TodoTask('Learn Vue'),
  ]);
  const [taskName, setTaskName] = useState('');
  const textFieldRef = useRef<HTMLInputElement>(null);

  const handleChangeTaskName = (_, value: string) => setTaskName(value);

  const handleAddTask = () => {
    if (!taskName) return;
    setTasks([new TodoTask(taskName), ...tasks]);
    setTaskName('');
    textFieldRef.current.focus();
  };

  const handleComplete = (id: number, completed: boolean) => {
    tasks.find(x => x.id === id).completed = completed;
    setTasks([...tasks]);
  };

  const handleRemove = (id: number) => setTasks(tasks.filter(x => x.id !== id));

  return div({
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
        slot: tasks.map(task =>
          TaskItem({
            key: task.id,
            task,
            onComplete: handleComplete,
            onRemove: handleRemove,
          }),
        ),
      }),
    ],
  });
});

createRoot(document.getElementById('root')).render(App());
