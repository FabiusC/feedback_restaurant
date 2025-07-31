export class Review {
  private idreview: number;
  private ratespeedservice: number;
  private ratesatisfactionfood: number;
  private idemployee: number | null;
  private rateemployee: number | null;
  private comment: string;
  private ispublic: boolean;
  private date: Date;

  constructor(
    idreview: number,
    ratespeedservice: number,
    ratesatisfactionfood: number,
    idemployee: number | null,
    rateemployee: number | null,
    comment: string,
    ispublic: boolean = false,
    date: Date = new Date()
  ) {
    this.idreview = idreview;
    this.ratespeedservice = ratespeedservice;
    this.ratesatisfactionfood = ratesatisfactionfood;
    this.idemployee = idemployee;
    this.rateemployee = rateemployee;
    this.comment = comment;
    this.ispublic = ispublic;
    this.date = date;
  }

  // Getters
  public getId(): number {
    return this.idreview;
  }

  public getSpeedRating(): number {
    return this.ratespeedservice;
  }

  public getFoodRating(): number {
    return this.ratesatisfactionfood;
  }

  public getIdEmployee(): number | null {
    return this.idemployee;
  }

  public getEmployeeRating(): number | null {
    return this.rateemployee;
  }

  public getComment(): string {
    return this.comment;
  }

  public getIsPublic(): boolean {
    return this.ispublic;
  }

  public getCreatedAt(): Date {
    return this.date;
  }

  // Business methods
  public validate(): boolean {
    // Validar que las calificaciones estén entre 1 y 5
    if (this.ratespeedservice < 1 || this.ratespeedservice > 5) {
      return false;
    }

    if (this.ratesatisfactionfood < 1 || this.ratesatisfactionfood > 5) {
      return false;
    }

    // Validar que si hay empleado, debe haber calificación de empleado
    if (this.idemployee !== null && (this.rateemployee === null || this.rateemployee < 1 || this.rateemployee > 5)) {
      return false;
    }

    // Validar que si no hay empleado, no debe haber calificación de empleado
    if (this.idemployee === null && this.rateemployee !== null) {
      return false;
    }

    // Validar que el comentario no esté vacío si es público
    if (this.ispublic && (!this.comment || this.comment.trim().length === 0)) {
      return false;
    }

    // Validar que el comentario no exceda 500 caracteres
    if (this.comment && this.comment.length > 500) {
      return false;
    }

    return true;
  }

  public approve(): void {
    this.ispublic = true;
  }

  public reject(): void {
    this.ispublic = false;
  }

  public updateComment(comment: string): void {
    this.comment = comment;
  }

  public getAverageRating(): number {
    const totalRatings = [this.ratespeedservice, this.ratesatisfactionfood];
    if (this.rateemployee !== null) {
      totalRatings.push(this.rateemployee);
    }
    return totalRatings.reduce((sum, rating) => sum + rating, 0) / totalRatings.length;
  }
}
