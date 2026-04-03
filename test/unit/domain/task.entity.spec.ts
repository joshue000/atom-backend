import { Task } from '../../../src/domain/entities/task.entity';

describe('Task entity', () => {
  const baseProps = {
    id: 'task-1',
    userId: 'user-1',
    title: 'Test task',
    description: 'A description',
    completed: false,
  };

  describe('create', () => {
    it('should create a task with completed=false and timestamps', () => {
      const before = new Date();
      const task = Task.create(baseProps);
      const after = new Date();

      expect(task.id).toBe('task-1');
      expect(task.userId).toBe('user-1');
      expect(task.title).toBe('Test task');
      expect(task.description).toBe('A description');
      expect(task.completed).toBe(false);
      expect(task.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(task.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  describe('complete', () => {
    it('should return a new task with completed=true', () => {
      const task = Task.create(baseProps);
      const completed = task.complete();

      expect(completed.completed).toBe(true);
      expect(task.completed).toBe(false); // original unchanged (immutable)
    });
  });

  describe('reopen', () => {
    it('should return a new task with completed=false', () => {
      const task = Task.reconstitute({ ...baseProps, completed: true, createdAt: new Date(), updatedAt: new Date() });
      const reopened = task.reopen();

      expect(reopened.completed).toBe(false);
      expect(task.completed).toBe(true); // original unchanged
    });
  });

  describe('toggleCompleted', () => {
    it('should toggle from false to true', () => {
      const task = Task.create(baseProps);
      expect(task.toggleCompleted().completed).toBe(true);
    });

    it('should toggle from true to false', () => {
      const task = Task.reconstitute({ ...baseProps, completed: true, createdAt: new Date(), updatedAt: new Date() });
      expect(task.toggleCompleted().completed).toBe(false);
    });
  });

  describe('updateDetails', () => {
    it('should update title and description', () => {
      const task = Task.create(baseProps);
      const updated = task.updateDetails('New title', 'New description');

      expect(updated.title).toBe('New title');
      expect(updated.description).toBe('New description');
      expect(task.title).toBe('Test task'); // original unchanged
    });
  });

  describe('reconstitute', () => {
    it('should restore task from persisted data', () => {
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const task = Task.reconstitute({ ...baseProps, completed: true, createdAt, updatedAt });

      expect(task.id).toBe('task-1');
      expect(task.completed).toBe(true);
      expect(task.createdAt).toBe(createdAt);
      expect(task.updatedAt).toBe(updatedAt);
    });
  });
});
