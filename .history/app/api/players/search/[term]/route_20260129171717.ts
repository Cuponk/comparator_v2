import { PrismaClient } from "../../../../generated/prisma/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
    url: "file:./prisma/dev.db"
});

const prisma = new PrismaClient({ adapter });

export async function GET(request: Request, context: { params: Promise<{ term: string }> }) {
    const term = await context.params

    const players = await prisma.player.findMany({
        where: {
            full_name: {
                contains: term.term
            }
        },
        take: 10
    });

    if (!players) {
        return new Response(JSON.stringify({ error: "Players not found" }), {
            status: 404
        });
    }

    return new Response(JSON.stringify(players), {
        status: 200
    });
}