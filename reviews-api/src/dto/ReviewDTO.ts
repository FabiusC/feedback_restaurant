export class ReviewDTO {
  private ratespeedservice: number;
  private ratesatisfactionfood: number;
  private idemployee: number | null;
  private rateemployee: number | null;
  private comment: string;
  private ispublic: boolean;

  constructor(
    ratespeedservice: number,
    ratesatisfactionfood: number,
    idemployee: number | null,
    rateemployee: number | null,
    comment: string,
    ispublic: boolean = false
  ) {
    this.ratespeedservice = ratespeedservice;
    this.ratesatisfactionfood = ratesatisfactionfood;
    this.idemployee = idemployee;
    this.rateemployee = rateemployee;
    this.comment = comment;
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

  public getIsPublic(): boolean {
    return this.ispublic;
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
    if (this.idemployee !== null && (this.rateemployee === null || this.rateemployee < 1 || this.rateemployee > 5)) {
      return false;
    }

    // Validar que si no hay empleado, no debe haber calificación de empleado
    if (this.idemployee === null && this.rateemployee !== null) {
      return false;
    }

    // Validar que el comentario no exceda 500 caracteres
    if (this.comment && this.comment.length > 500) {
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
      json.ispublic || json.isPublic || false
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
