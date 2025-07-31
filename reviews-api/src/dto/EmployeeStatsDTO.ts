import { Review } from "../entities/Review";

export class EmployeeStatsDTO {
  private employeeId: number;
  private averageemployeerating: number;
  private averagespeedservice: number;
  private averagefoodsatisfaction: number;
  private reviewcount: number;

  constructor(employeeId: number) {
    this.employeeId = employeeId;
    this.averageemployeerating = 0;
    this.averagespeedservice = 0;
    this.averagefoodsatisfaction = 0;
    this.reviewcount = 0;
  }

  // Getters
  public getEmployeeId(): number {
    return this.employeeId;
  }

  public getAverageEmployeeRating(): number {
    return this.averageemployeerating;
  }

  public getAverageSpeedService(): number {
    return this.averagespeedservice;
  }

  public getAverageFoodSatisfaction(): number {
    return this.averagefoodsatisfaction;
  }

  public getReviewCount(): number {
    return this.reviewcount;
  }

  // Set statistics from database query
  public setStats(stats: {
    averageemployeerating: number;
    averagespeedservice: number;
    averagefoodsatisfaction: number;
    reviewcount: number;
  }): void {
    this.averageemployeerating = stats.averageemployeerating;
    this.averagespeedservice = stats.averagespeedservice;
    this.averagefoodsatisfaction = stats.averagefoodsatisfaction;
    this.reviewcount = stats.reviewcount;
  }

  // Convert to plain object matching API response format
  public toJSON(): any {
    return {
      averageemployeerating: this.averageemployeerating,
      averagespeedservice: this.averagespeedservice,
      averagefoodsatisfaction: this.averagefoodsatisfaction,
      reviewcount: this.reviewcount,
    };
  }

  // Performance indicators
  public getPerformanceLevel(): string {
    if (this.averageemployeerating >= 4.5) return "Excelente";
    if (this.averageemployeerating >= 4.0) return "Muy Bueno";
    if (this.averageemployeerating >= 3.5) return "Bueno";
    if (this.averageemployeerating >= 3.0) return "Regular";
    return "Necesita Mejora";
  }
}
