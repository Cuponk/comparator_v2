import "dotenv/config";
import { getMappedPlayer, upsertPlayer } from "../app/lib/mappers";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../app/generated/prisma/client";
import { getAllPlayerIds } from "../app/lib/mlb-api";

const playerIdsToIngest = await getAllPlayerIds();

const adapter = new PrismaBetterSqlite3({
  url: "file:./prisma/dev.db"
})
const prisma = new PrismaClient({ adapter })



async function ingestPlayers(playerIds: number[]) {

    console.log("starting ingestion")

    for(let i = 0; i < playerIds.length; i++) {
        try {
        const mappedPlayer = await getMappedPlayer(playerIds[i]);
        
        await upsertPlayer(prisma, mappedPlayer);
        console.log(`Successfully ingested player with ID: ${playerIds[i]}`);
        } catch (error) {
            console.error(`Failed to ingest player with ID: ${playerIds[i]}. Error: ${error}`);
        }
    }
    console.log("ingestion complete")
}

ingestPlayers(playerIdsToIngest).finally(async () => {
    await prisma.$disconnect();
});