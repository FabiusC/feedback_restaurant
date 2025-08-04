import DatabaseConnection from "../data/database/connection";
import { EmployeeRepository } from "../data/repositories/EmployeeRepository";
import { ReviewRepository } from "../data/repositories/ReviewRepository";
import { Employee } from "../entities/Employee";
import { Review } from "../entities/Review";

async function seedData() {
  const db = DatabaseConnection.getInstance();
  const employeeRepo = new EmployeeRepository();
  const reviewRepo = new ReviewRepository();

  try {
    console.log("🌱 Starting database seeding...");

    // Create sample employees
    const employees = [
      new Employee(0, "Juan Pérez", "juan.perez@restaurant.com", true),
      new Employee(0, "María García", "maria.garcia@restaurant.com", true),
      new Employee(0, "Carlos López", "carlos.lopez@restaurant.com", true),
      new Employee(0, "Ana Rodríguez", "ana.rodriguez@restaurant.com", true),
      new Employee(0, "Luis Martínez", "luis.martinez@restaurant.com", true),
    ];

    console.log("👥 Creating employees...");
    const savedEmployees = [];
    for (const employee of employees) {
      const savedEmployee = await employeeRepo.save(employee);
      savedEmployees.push(savedEmployee);
      console.log(
        `✅ Created employee: ${savedEmployee.getName()} (ID: ${savedEmployee.getId()})`
      );
    }

    // Create sample reviews
    const reviews = [
      // Reviews for Juan Pérez (ID: 1)
      new Review(
        0,
        5,
        4,
        1,
        5,
        "Excellent service, very attentive and friendly. The food was delicious.",
        true
      ),
      new Review(
        0,
        4,
        5,
        1,
        4,
        "Very good service, the food is excellent. Recommended.",
        true
      ),
      new Review(0, 3, 4, 1, 4, "Good service, the food was good.", false),

      // Reviews for María García (ID: 2)
      new Review(
        0,
        5,
        5,
        2,
        5,
        "Maria is an excellent waitress, very professional and friendly.",
        true
      ),
      new Review(
        0,
        4,
        4,
        2,
        5,
        "Very good service, Maria is very attentive.",
        true
      ),
      new Review(
        0,
        5,
        4,
        2,
        4,
        "Excellent attention, the food is very good.",
        true
      ),

      // Reviews for Carlos López (ID: 3)
      new Review(0, 3, 4, 3, 3, "Regular service, the food was good.", false),
      new Review(
        0,
        4,
        3,
        3,
        4,
        "Good service, the food could be improved.",
        false
      ),
      new Review(0, 5, 4, 3, 4, "The service improved a lot, very good.", true),

      // Reviews for Ana Rodríguez (ID: 4)
      new Review(
        0,
        5,
        5,
        4,
        5,
        "Ana is fantastic, very professional and friendly.",
        true
      ),
      new Review(
        0,
        4,
        5,
        4,
        5,
        "Excellent service, Ana is very attentive.",
        true
      ),
      new Review(
        0,
        5,
        4,
        4,
        5,
        "Very good service, the food is delicious.",
        true
      ),

      // Reviews for Luis Martínez (ID: 5)
      new Review(0, 4, 4, 5, 4, "Good service, Luis is very friendly.", true),
      new Review(0, 3, 4, 5, 3, "Acceptable service, the food is good.", false),
      new Review(0, 4, 5, 5, 4, "Very good food, correct service.", true),
    ];

    console.log("📝 Creating reviews...");
    for (const review of reviews) {
      const savedReview = await reviewRepo.save(review);
      const employee = savedEmployees.find(
        (emp) => emp.getId() === savedReview.getIdEmployee()
      );
      console.log(
        `✅ Created review for ${employee?.getName()}: ${savedReview
          .getComment()
          .substring(0, 50)}...`
      );
    }

    console.log("🎉 Database seeding completed successfully!");
    console.log("\n📋 Summary:");
    console.log(`   - ${savedEmployees.length} employees created`);
    console.log(`   - ${reviews.length} reviews created`);
    console.log("\n🔗 You can now test the API endpoints:");
    console.log("   - GET http://localhost:3000/reviews/public");
    console.log("   - GET http://localhost:3000/employees/1/stats");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    await db.close();
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  seedData()
    .then(() => {
      console.log("✅ Seeding completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Seeding failed:", error);
      process.exit(1);
    });
}

export default seedData;
