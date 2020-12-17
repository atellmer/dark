export type Callback = () => boolean;

export type Task = {
  id: number;
  priority: TaskPriority;
  calllback: () => void;
};

export enum TaskPriority {
  HIGHT = 'HIGHT',
  NORMAL = 'NORMAL',
};
