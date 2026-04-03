import { User } from '../../../src/domain/entities/user.entity';

describe('User entity', () => {
  describe('create', () => {
    it('should create a user with normalized (lowercase) email', () => {
      const user = User.create('Test@Example.COM', 'user-1');

      expect(user.id).toBe('user-1');
      expect(user.email).toBe('test@example.com');
      expect(user.createdAt).toBeInstanceOf(Date);
    });

    it('should throw when email format is invalid', () => {
      expect(() => User.create('not-an-email', 'user-1')).toThrow('Invalid email format');
    });

    it('should throw when email has no domain', () => {
      expect(() => User.create('user@', 'user-1')).toThrow('Invalid email format');
    });

    it('should trim whitespace from email', () => {
      const user = User.create('  user@example.com  ', 'user-1');
      expect(user.email).toBe('user@example.com');
    });
  });

  describe('reconstitute', () => {
    it('should restore user from persisted data without validation', () => {
      const createdAt = new Date('2024-01-01');
      const user = User.reconstitute({ id: 'user-1', email: 'test@example.com', createdAt });

      expect(user.id).toBe('user-1');
      expect(user.email).toBe('test@example.com');
      expect(user.createdAt).toBe(createdAt);
    });
  });

  describe('toPlainObject', () => {
    it('should return a plain object with all props', () => {
      const user = User.create('user@example.com', 'user-1');
      const plain = user.toPlainObject();

      expect(plain.id).toBe('user-1');
      expect(plain.email).toBe('user@example.com');
      expect(plain.createdAt).toBeInstanceOf(Date);
    });
  });
});
