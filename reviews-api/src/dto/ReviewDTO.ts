export class ReviewDTO {
  private ratespeedservice: number;
  private ratesatisfactionfood: number;
  private idemployee: number | null;
  private rateemployee: number | null;
  private comment: string;
  private ispublic: boolean | undefined;

  constructor(
    ratespeedservice?: number,
    ratesatisfactionfood?: number,
    idemployee?: number | null,
    rateemployee?: number | null,
    comment?: string,
    ispublic?: boolean
  ) {
    this.ratespeedservice = ratespeedservice || 0;
    this.ratesatisfactionfood = ratesatisfactionfood || 0;
    this.idemployee = idemployee || null;
    this.rateemployee = rateemployee || null;
    this.comment = comment || "";
    this.ispublic = ispublic;
  }

  // Getters
  public getSpeedRating(): number {
    return this.ratespeedservice;
  }

  public getFoodRating(): number {
    return this.ratesatisfactionfood;
  }

  public getIdEmployeeSelected(): number | null {
    return this.idemployee;
  }

  public getEmployeeRating(): number | null {
    return this.rateemployee;
  }

  public getComment(): string {
    return this.comment;
  }

  public getIsPublic(): boolean | undefined {
    return this.ispublic;
  }

  // Setters
  public setSpeedRating(rating: number): void {
    this.ratespeedservice = rating;
  }

  public setFoodRating(rating: number): void {
    this.ratesatisfactionfood = rating;
  }

  public setIdEmployeeSelected(id: number | null): void {
    this.idemployee = id;
  }

  public setEmployeeRating(rating: number | null): void {
    this.rateemployee = rating;
  }

  public setComment(comment: string): void {
    this.comment = comment;
  }

  public setIsPublic(isPublic: boolean | undefined): void {
    this.ispublic = isPublic;
  }

  // Validation methods
  public validate(): boolean {
    // Validar que las calificaciones estén entre 1 y 5
    if (this.ratespeedservice < 1 || this.ratespeedservice > 5) {
      return false;
    }

    if (this.ratesatisfactionfood < 1 || this.ratesatisfactionfood > 5) {
      return false;
    }

    // Validar que si hay empleado, debe haber calificación de empleado
    if (
      this.idemployee !== null &&
      (this.rateemployee === null ||
        this.rateemployee < 1 ||
        this.rateemployee > 5)
    ) {
      return false;
    }

    // Validar que si no hay empleado, no debe haber calificación de empleado
    if (this.idemployee === null && this.rateemployee !== null) {
      return false;
    }

    // Validar que el comentario no esté vacío
    if (!this.comment || this.comment.trim().length === 0) {
      return false;
    }

    // Validar que el comentario no exceda 1000 caracteres (según los tests)
    if (this.comment && this.comment.length > 1000) {
      return false;
    }

    // Validar que isPublic esté definido
    if (this.ispublic === undefined) {
      return false;
    }

    return true;
  }

  // Static factory method
  public static fromJSON(json: any): ReviewDTO {
    return new ReviewDTO(
      json.ratespeedservice || json.speedRating,
      json.ratesatisfactionfood || json.foodRating,
      json.idemployee || json.idEmployeeSelected || null,
      json.rateemployee || json.employeeRating || null,
      json.comment || "",
      json.ispublic !== undefined
        ? json.ispublic
        : json.isPublic !== undefined
        ? json.isPublic
        : undefined
    );
  }

  // Convert to plain object
  public toJSON(): any {
    return {
      ratespeedservice: this.ratespeedservice,
      ratesatisfactionfood: this.ratesatisfactionfood,
      idemployee: this.idemployee,
      rateemployee: this.rateemployee,
      comment: this.comment,
      ispublic: this.ispublic,
    };
  }
}
