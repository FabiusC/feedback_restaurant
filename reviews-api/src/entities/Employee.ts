export class Employee {
  private idemployee: number;
  public name: string;
  public email: string;
  public isactive: boolean;
  private createdat: Date;

  constructor(
    idemployee: number,
    name: string,
    email: string,
    isactive: boolean = true,
    createdat: Date = new Date()
  ) {
    this.idemployee = idemployee;
    this.name = name;
    this.email = email;
    this.isactive = isactive;
    this.createdat = createdat;
  }

  // Getters
  public getId(): number {
    return this.idemployee;
  }

  public getName(): string {
    return this.name;
  }

  public getEmail(): string {
    return this.email;
  }

  public getIsActive(): boolean {
    return this.isactive;
  }

  public getCreatedAt(): Date {
    return this.createdat;
  }

  // Business methods
  public deactivate(): void {
    this.isactive = false;
  }

  public activate(): void {
    this.isactive = true;
  }

  public updateName(name: string): void {
    this.name = name;
  }

  public updateEmail(email: string): void {
    this.email = email;
  }
}
