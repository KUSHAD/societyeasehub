import { type Prisma } from "@prisma/client";
import { eachDayOfInterval, subDays } from "date-fns";
import { convertAmountToMiliUnits } from "~/lib/utils";
import { db } from "~/server/db";

export async function seed(SEED_SOCIETY_ID: string) {
  const SEED_ACCOUNTS = [
    {
      id: "clxo1eo6200003b71yub9se00",
      name: "Checking",
      societyId: SEED_SOCIETY_ID,
    },
    {
      id: "clxo1sv7m00003b70och180lu",
      name: "Savings",
      societyId: SEED_SOCIETY_ID,
    },
  ];

  const SEED_CATEGORIES = [
    {
      id: "cjld2cjxh0000qzrmn831i7rn",
      name: "Food",
      societyId: SEED_SOCIETY_ID,
    },
    {
      id: "cjld2cyuq0000t3rmniod1foy",
      name: "Clothing",
      societyId: SEED_SOCIETY_ID,
    },
    {
      id: "clxowrsv7m00003b70och18034",
      name: "Rent",
      societyId: SEED_SOCIETY_ID,
    },
    {
      id: "cjld2c322uq0000t3rmniod142foy",
      name: "Health",
      societyId: SEED_SOCIETY_ID,
    },
    {
      id: "cjl24d2cyuq0000t3rmniod1foy",
      name: "Cloth",
      societyId: SEED_SOCIETY_ID,
    },
  ];

  const SEED_PAYEES = [
    {
      id: "clxo1zv3o00003b703rt7m2u5",
      name: "Kushad",
      societyId: SEED_SOCIETY_ID,
    },
    {
      id: "clxo21p2l00003b70pujzkc5d",
      name: "Amitava",
      societyId: SEED_SOCIETY_ID,
    },
    {
      id: "clxo21wx400003b70xlpo84j2",
      name: "Keya",
      societyId: SEED_SOCIETY_ID,
    },
  ];

  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 90);

  const SEED_TRANSACTIONS: Omit<
    Prisma.FinanceTransactionCreateInput & {
      societyId: string;
      payeeId: string;
      categoryId: string;
      accountId: string;
    },
    "account" | "society" | "payee" | "category"
  >[] = [];

  const generateRandomAmount = (
    category: Omit<
      Prisma.FinanceCategoryCreateInput & { societyId: string },
      "society"
    >,
  ) => {
    switch (category.name) {
      case "Rent":
        return Math.random() * 400 + 90;
      case "Utilities":
        return Math.random() * 200 + 60;
      case "Health":
        return Math.random() * 100 + 40;
      case "Transportation":
      case "Clothing":
        return Math.random() * 30 + 20;
      case "Food":
        return Math.random() * 20 + 10;
      default:
        return Math.random() * 40 + 70;
    }
  };

  const generateRandomTransactionForDay = (day: Date) => {
    const numTransactions = Math.floor(Math.random() * 4) + 1;

    for (let i = 0; i < numTransactions; i++) {
      const category =
        SEED_CATEGORIES[Math.floor(Math.random() * SEED_CATEGORIES.length)];
      const account =
        SEED_ACCOUNTS[Math.floor(Math.random() * SEED_ACCOUNTS.length)];
      const payee = SEED_PAYEES[Math.floor(Math.random() * SEED_PAYEES.length)];
      const isExpense = Math.random() > 0.6;

      const amount = generateRandomAmount(category!);

      const formattedAmount = convertAmountToMiliUnits(
        isExpense ? -amount : amount,
      );

      SEED_TRANSACTIONS.push({
        accountId: account?.id ?? "clxo1eo6200003b71yub9se00",
        amount: formattedAmount,
        date: day,
        categoryId: category?.id ?? "clxowrsv7m00003b70och18034",
        payeeId: payee?.id ?? "clxo1zv3o00003b703rt7m2u5",
        societyId: SEED_SOCIETY_ID,
        notes: "Random Transaction",
      });
    }
  };

  const generateTransactions = () => {
    const days = eachDayOfInterval({ start: defaultFrom, end: defaultTo });

    days.forEach((day) => generateRandomTransactionForDay(day));
  };

  generateTransactions();

  const main = async () => {
    try {
      await db.financeAccount.deleteMany({});
      await db.financeCategory.deleteMany({});
      await db.financePayee.deleteMany({});
      await db.financeTransaction.deleteMany({});
      await db.financeAccount.createMany({ data: SEED_ACCOUNTS });
      await db.financeCategory.createMany({ data: SEED_CATEGORIES });
      await db.financePayee.createMany({ data: SEED_PAYEES });
      await db.financeTransaction.createMany({ data: SEED_TRANSACTIONS });
    } catch (error) {
      console.error(`Error while seeding`, error);
      process.exit(1);
    }
  };

  await main();
}
