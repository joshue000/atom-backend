import { ValidationError } from '@domain/errors/domain.errors';

export interface UserProps {
  id: string;
  email: string;
  createdAt: Date;
}

export class User {
  private constructor(private readonly props: UserProps) {}

  static create(email: string, id: string): User {
    const normalizedEmail = email.toLowerCase().trim();
    if (!User.isValidEmail(normalizedEmail)) {
      throw new ValidationError(`Invalid email format: ${email}`);
    }
    return new User({ id, email: normalizedEmail, createdAt: new Date() });
  }

  static reconstitute(props: UserProps): User {
    return new User(props);
  }

  private static isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  get id(): string {
    return this.props.id;
  }
  get email(): string {
    return this.props.email;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }

  toPlainObject(): UserProps {
    return { ...this.props };
  }
}
