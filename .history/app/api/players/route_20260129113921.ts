import { PrismaClient } from "../../generated/prisma/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: "file:./prisma/dev.db"
})
const prisma = new PrismaClient({ adapter })

const player = await prisma.player.findFirst({
  where: {
    id: 592450
  }
});

export async function GET() {
  return new Response(JSON.stringify(player), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
}