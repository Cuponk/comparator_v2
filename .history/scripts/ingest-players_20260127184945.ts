import { PrismaClient } from "@prisma/client/extension";
import { getMappedPlayer, upsertPlayer } from "../app/lib/mappers";

const prisma = new PrismaClient();

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
}

const playerIdsToIngest = [592450, 660271]; // Example player IDs (Judge and Ohtani)

ingestPlayers(playerIdsToIngest)
    .then(() => {
        console.log("Ingestion process completed.");
        prisma.$disconnect();
    })
    .catch((error) => {
        console.error("Ingestion process failed:", error);
        prisma.$disconnect();
    });
