// // import { run } from './sierpinski-triangle';

// // run();

import {
  h,
  View,
  Text,
  createComponent,
  Fragment,
  memo,
  forwardRef,
  useState,
  Reducer,
  useReducer,
  useUpdate,
  useCallback,
  useMemo,
  useEffect,
  useContext,
  createContext,
  useRef,
  useImperativeHandle,
} from '../src/core';
import { render, createPortal } from '../src/platform/browser';


const domElement = document.getElementById('root');

// const div = (props = {}) => View({ ...props, as: 'div' });
// const button = (props = {}) => View({ ...props, as: 'button' });
// const table = (props = {}) => View({ ...props, as: 'table' });
// const tbody = (props = {}) => View({ ...props, as: 'tbody' });
// const tr = (props = {}) => View({ ...props, as: 'tr' });
// const td = (props = {}) => View({ ...props, as: 'td' });

// const createMeasurer = () => {
//   let startTime;
//   let lastMeasureName;
//   const start = (name: string) => {
//     startTime = performance.now();
//     lastMeasureName = name;
//   };
//   const stop = () => {
//     const last = lastMeasureName;

//     if (lastMeasureName) {
//       setTimeout(() => {
//         lastMeasureName = null;
//         const stopTime = performance.now();
//         const diff = stopTime - startTime;

//         console.log(`${last}: ${diff}`);
//       }, 0);
//     }
//   };

//   return {
//     start,
//     stop,
//   };
// };

// const measurer = createMeasurer();

// let nextId = 0;
// const buildData = (count, prefix = '') => {
//   return Array(count).fill(0).map((_, idx) => ({
//     id: ++nextId,
//     name: `item: ${idx + 1} ${prefix}`,
//     select: false,
//   }))
// }

// const state = {
//   list: [],
// };

// type HeaderProps = {
//   onCreate: Function;
//   onAdd: Function;
//   onUpdateAll: Function;
//   onSwap: Function;
//   onClear: Function;
// }

// const Header = createComponent<HeaderProps>(({ onCreate, onAdd, onUpdateAll, onSwap, onClear }) => {
//   return div({
//     style: 'width: 100%; height: 64px; background-color: blueviolet; display: flex; align-items: center; padding: 16px;',
//     slot: [
//       button({
//         slot: Text('create 10000 rows'),
//         onClick: onCreate,
//       }),
//       button({
//         slot: Text('Add 1000 rows'),
//         onClick: onAdd,
//       }),
//       button({
//         slot: Text('update every 10th row'),
//         onClick: onUpdateAll,
//       }),
//       button({
//         slot: Text('swap rows'),
//         onClick: onSwap,
//       }),
//       button({
//         slot: Text('clear rows'),
//         onClick: onClear,
//       }),
//     ],
//   });
// });

// const MemoHeader = memo(Header);

// type RowProps = {
//   id: number,
//   name: string;
//   selected: boolean;
//   onRemove: Function;
//   onHighlight: Function;
// };

// const Row = createComponent<RowProps>(({ id, name, selected, onRemove, onHighlight }) => {
//   const handleRemove = useCallback(() => onRemove(id), []);
//   const handleHighlight = useCallback(() => onHighlight(id), []);
//   const className = `${selected ? 'selected' : ''}`;

//   // console.log('render', id);

//   return (
//     <tr class={className}>
//       <td class='cell'>{name}</td>
//       <td class='cell'>zzz</td>
//       <td class='cell'>xxx</td>
//       <td class='cell'>
//         <button onClick={handleRemove}>remove</button>
//         <button onClick={handleHighlight}>highlight</button>
//       </td>
//     </tr>
//   );
// });

// const MemoRow = memo<RowProps>(Row, (props, nextProps) =>
//   props.name !== nextProps.name ||
//   props.selected !== nextProps.selected,
// );

// type ListProps = {
//   items: Array<{ id: number, name: string; select: boolean }>;
//   onRemove: Function;
//   onHighlight: Function;
// };

// const List = createComponent<ListProps>(({ items, onRemove, onHighlight }) => {
//   return (
//     <table class='table'>
//       <tbody>
//         {items.map((item) => {
//           return (
//             <MemoRow
//               key={item.id}
//               id={item.id}
//               name={item.name}
//               selected={item.select}
//               onRemove={onRemove}
//               onHighlight={onHighlight}
//             />
//           );
//         })}
//       </tbody>
//     </table>
//   )
// });

// const MemoList = memo(List);

// const Bench = createComponent(() => {
//   const handleCreate = useCallback(() => {
//     state.list = buildData(10);
//     measurer.start('create');
//     forceUpdate();
//     measurer.stop();
//   }, []);
//   const handleAdd = useCallback(() => {
//     state.list.push(...buildData(1000, '!!!'));
//     state.list = [...state.list];
//     measurer.start('add');
//     forceUpdate();
//     measurer.stop();
//   }, []);
//   const handleUpdateAll = useCallback(() => {
//     state.list = state.list.map((x, idx) => ({ ...x, name: (idx + 1) % 10 === 0 ? x.name + '!!!' : x.name }));
//     measurer.start('update every 10th');
//     forceUpdate();
//     measurer.stop();
//   }, []);
//   const handleRemove = useCallback((id) => {
//     state.list = state.list.filter((z) => z.id !== id);
//     measurer.start('remove');
//     forceUpdate();
//     measurer.stop();
//   }, []);
//   const handleHightlight = useCallback((id) => {
//     const idx = state.list.findIndex(z => z.id === id);
//     state.list[idx].select = !state.list[idx].select;
//     state.list = [...state.list];
//     measurer.start('highlight');
//     forceUpdate();
//     measurer.stop();
//   }, []);
//   const handleSwap = useCallback(() => {
//     if (state.list.length === 0) return;
//     const temp = state.list[1];
//     state.list[1] = state.list[state.list.length - 2];
//     state.list[state.list.length - 2] = temp;
//     state.list = [...state.list];
//     measurer.start('swap');
//     forceUpdate();
//     measurer.stop();
//   }, []);
//   const handleClear = useCallback(() => {
//     state.list = [];
//     measurer.start('clear');
//     forceUpdate();
//     measurer.stop();
//   }, []);

//   return (
//     <Fragment>
//       <MemoHeader
//         onCreate={handleCreate}
//         onAdd={handleAdd}
//         onUpdateAll={handleUpdateAll}
//         onSwap={handleSwap}
//         onClear={handleClear}
//       />
//       <MemoList
//         items={state.list}
//         onRemove={handleRemove}
//         onHighlight={handleHightlight}
//       />
//     </Fragment>
//   );
// });

// function forceUpdate() {
//   render(Bench(), domElement);
// }

// render(Bench(), domElement);

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

const TextField = forwardRef(
  createComponent<TextFieldProps, HTMLInputElement>(({ value, fulllWidth, onEnter, onChange }, ref) => {
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
        ref={ref}
        style={`width: ${fulllWidth ? '100%' : 'auto'}`}
        value={value}
        onInput={handleChange}
        onKeyDown={handleKeyDown}
      />
    )
  }, { displayName: 'TextField' }),
);

type CheckboxProps = {
  value: boolean;
  label: string;
  onChange: (e, value: boolean) => void;
};

const Checkbox = createComponent<CheckboxProps>(({ value, label, onChange }) => {
  const handleInput = (e: InputEvent) => onChange(e, !value);

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
    if (taskName) {
      setTasks([
        new TodoTask(taskName),
        ...tasks,
      ]);

      setTaskName('');
      textFieldRef.current.focus();
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
          ref={textFieldRef}
          value={taskName}
          fulllWidth
          onEnter={handleAddTask}
          onChange={handleChangeTaskName}
        />
        <button onClick={handleAddTask}>Add</button>
      </div>
      <div>
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
    </div>
  )
}, { displayName: 'TodoApp' });

render(TodoApp(), domElement);
