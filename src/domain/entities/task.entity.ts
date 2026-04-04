export interface TaskProps {
  id: string;
  userId: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Task {
  private constructor(private readonly props: TaskProps) {}

  static create(props: Omit<TaskProps, 'createdAt' | 'updatedAt'>): Task {
    return new Task({
      ...props,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: TaskProps): Task {
    return new Task(props);
  }

  get id(): string {
    return this.props.id;
  }
  get userId(): string {
    return this.props.userId;
  }
  get title(): string {
    return this.props.title;
  }
  get description(): string {
    return this.props.description;
  }
  get completed(): boolean {
    return this.props.completed;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  complete(): Task {
    return new Task({ ...this.props, completed: true, updatedAt: new Date() });
  }

  reopen(): Task {
    return new Task({ ...this.props, completed: false, updatedAt: new Date() });
  }

  updateDetails(title: string, description: string): Task {
    return new Task({ ...this.props, title, description, updatedAt: new Date() });
  }

  toggleCompleted(): Task {
    return this.props.completed ? this.reopen() : this.complete();
  }

  toPlainObject(): TaskProps {
    return { ...this.props };
  }
}
