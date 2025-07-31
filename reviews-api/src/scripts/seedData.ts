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
        "Excelente servicio, muy atento y amable. La comida estaba deliciosa.",
        true
      ),
      new Review(
        0,
        4,
        5,
        1,
        4,
        "Muy buen servicio, la comida excelente. Recomendado.",
        true
      ),
      new Review(0, 3, 4, 1, 4, "Buen servicio, la comida estaba bien.", false),

      // Reviews for María García (ID: 2)
      new Review(
        0,
        5,
        5,
        2,
        5,
        "María es una excelente mesera, muy profesional y amigable.",
        true
      ),
      new Review(
        0,
        4,
        4,
        2,
        5,
        "Muy buen servicio, María es muy atenta.",
        true
      ),
      new Review(
        0,
        5,
        4,
        2,
        4,
        "Excelente atención, la comida muy buena.",
        true
      ),

      // Reviews for Carlos López (ID: 3)
      new Review(
        0,
        3,
        4,
        3,
        3,
        "Servicio regular, la comida estaba bien.",
        false
      ),
      new Review(
        0,
        4,
        3,
        3,
        4,
        "Buen servicio, la comida podría mejorar.",
        false
      ),
      new Review(0, 5, 4, 3, 4, "Mejoró mucho el servicio, muy bien.", true),

      // Reviews for Ana Rodríguez (ID: 4)
      new Review(
        0,
        5,
        5,
        4,
        5,
        "Ana es fantástica, muy profesional y amigable.",
        true
      ),
      new Review(0, 4, 5, 4, 5, "Excelente servicio, Ana es muy atenta.", true),
      new Review(
        0,
        5,
        4,
        4,
        5,
        "Muy buen servicio, la comida deliciosa.",
        true
      ),

      // Reviews for Luis Martínez (ID: 5)
      new Review(0, 4, 4, 5, 4, "Buen servicio, Luis es muy amable.", true),
      new Review(0, 3, 4, 5, 3, "Servicio aceptable, la comida bien.", false),
      new Review(0, 4, 5, 5, 4, "Muy buena comida, servicio correcto.", true),
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
