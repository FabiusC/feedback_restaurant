import { Review } from "../../entities/Review";
import DatabaseConnection from "../database/connection";

export class ReviewRepository {
  private db: DatabaseConnection;

  constructor() {
    this.db = DatabaseConnection.getInstance();
  }

  public async save(review: Review): Promise<Review> {
    try {
      const result = await this.db.query(
        `INSERT INTO review (ratespeedservice, ratesatisfactionfood, idemployee, rateemployee, comment, ispublic) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING idreview, date`,
        [
          review.getSpeedRating(),
          review.getFoodRating(),
          review.getIdEmployee(),
          review.getEmployeeRating(),
          review.getComment(),
          review.getIsPublic(),
        ]
      );

      const row = result.rows[0];
      return new Review(
        row.idreview,
        review.getSpeedRating(),
        review.getFoodRating(),
        review.getIdEmployee(),
        review.getEmployeeRating(),
        review.getComment(),
        review.getIsPublic(),
        new Date(row.date)
      );
    } catch (error) {
      console.error("Error saving review:", error);
      throw error;
    }
  }

  public async findPublicReviews(): Promise<Review[]> {
    try {
      const result = await this.db.query(
        "SELECT idreview, ratespeedservice, ratesatisfactionfood, idemployee, rateemployee, comment, ispublic, date FROM review WHERE ispublic = true ORDER BY date DESC"
      );

      return result.rows.map(
        (row: any) =>
          new Review(
            row.idreview,
            row.ratespeedservice,
            row.ratesatisfactionfood,
            row.idemployee,
            row.rateemployee,
            row.comment,
            row.ispublic,
            new Date(row.date)
          )
      );
    } catch (error) {
      console.error("Error finding public reviews:", error);
      throw error;
    }
  }

  public async findByEmployee(employeeId: number): Promise<Review[]> {
    try {
      const result = await this.db.query(
        "SELECT idreview, ratespeedservice, ratesatisfactionfood, idemployee, rateemployee, comment, ispublic, date FROM review WHERE idemployee = $1 ORDER BY date DESC",
        [employeeId]
      );

      return result.rows.map(
        (row: any) =>
          new Review(
            row.idreview,
            row.ratespeedservice,
            row.ratesatisfactionfood,
            row.idemployee,
            row.rateemployee,
            row.comment,
            row.ispublic,
            new Date(row.date)
          )
      );
    } catch (error) {
      console.error("Error finding reviews by employee:", error);
      throw error;
    }
  }

  public async getEmployeeStats(employeeId: number): Promise<{
    averageemployeerating: number;
    averagespeedservice: number;
    averagefoodsatisfaction: number;
    reviewcount: number;
  }> {
    try {
      const result = await this.db.query(
        `SELECT 
          AVG(rateemployee) AS averageemployeerating,
          AVG(ratespeedservice) AS averagespeedservice,
          AVG(ratesatisfactionfood) AS averagefoodsatisfaction,
          COUNT(*) AS reviewcount
        FROM review
        WHERE idemployee = $1 AND rateemployee IS NOT NULL`,
        [employeeId]
      );

      const row = result.rows[0];
      return {
        averageemployeerating: parseFloat(row.averageemployeerating) || 0,
        averagespeedservice: parseFloat(row.averagespeedservice) || 0,
        averagefoodsatisfaction: parseFloat(row.averagefoodsatisfaction) || 0,
        reviewcount: parseInt(row.reviewcount) || 0,
      };
    } catch (error) {
      console.error("Error getting employee stats:", error);
      throw error;
    }
  }
}
