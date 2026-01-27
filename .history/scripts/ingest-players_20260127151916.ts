import { PrismaClient } from "@prisma/client/extension";
import { getMappedPlayer, upsertPlayer } from "../app/lib/mappers";

const prisma = new PrismaClient();

async function ingestPlayers(playerIds: number[]) {

    console.log("starting ingestion")

    for(let i = 0; i < playerIds.length; i++) {

        const mappedPlayer = await getMappedPlayer(playerIds[i]);

        upsertPlayer(prisma, mappedPlayer);
    }
}