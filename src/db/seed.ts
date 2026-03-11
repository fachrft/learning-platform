import "dotenv/config";
import { db } from "./index";
import { Users } from "./schema/users";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

async function main() {
  console.log("Seeding database...");

  const adminEmail = "admin@gmail.com";

  const existingAdmin = await db.query.Users.findFirst({
    where: eq(Users.email, adminEmail),
  });

  if (existingAdmin) {
    console.log("✅ Admin udah ada, skip doang!");
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash("password", 10);

  console.log("Creating admin user...");

  await db.insert(Users).values({
    id: crypto.randomUUID(),
    email: adminEmail,
    name: "Admin Seefluencer",
    password: hashedPassword,
    role: "admin",
  });

  console.log("✅ Seed completed!");
  console.log("Admin Email: ", adminEmail);
  console.log("Admin Pass: admin123");

  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed failed!");
  console.error(err);
  process.exit(1);
});
