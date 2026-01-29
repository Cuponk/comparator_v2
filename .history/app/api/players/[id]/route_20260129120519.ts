import { request } from "http";
import { PrismaClient } from "../../../generated/prisma/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: "file:./prisma/dev.db"
})
const prisma = new PrismaClient({ adapter })


export async function GET(request: Request, { params }: { params: { id: string } }) {
  const playerId = parseInt(params.id, 10);
  const player = await prisma.player.findUnique({
    where: { id: playerId },
  });

  if (!player) {
    return new Response(JSON.stringify({ error: "Player not found" }), { status: 404 });
  }

  return new Response(JSON.stringify(player), { status: 200 });
}