import { fetchPlayer } from "./mlb-api";
import { PrismaClient } from "@prisma/client/extension";

interface rawPlayerData {
    id: number;
    fullName: string;
    firstName: string;
    lastName: string;
    primaryNumber: string;
    birthDate: string;
    currentAge: number;
    birthCity: string;
    birthStateProvince: string;
    birthCountry: string;
    height: string;
    weight: number;
    active: boolean;
    primaryPosition: {
        code: string;
        name: string;
        type: string;
        abbreviation: string;
    };
    mlbDebutDate: string;
    batSide: {
        code: string;
        description: string;
    };
    pitchHand: {
        code: string;
        description: string;
    };
}

export function mapPlayerData(rawData: rawPlayerData) {
    return {
        id: rawData.id,
        full_name: rawData.fullName,
        first_name: rawData.firstName,
        last_name: rawData.lastName,
        number: rawData.primaryNumber,
        position: rawData.primaryPosition.abbreviation,
        positionCategory: rawData.primaryPosition.type,
        batting_hand: rawData.batSide.code,
        throwing_hand: rawData.pitchHand.code,
        height: rawData.height,
        weight: rawData.weight,
        birth_date: rawData.birthDate,
        birth_city: rawData.birthCity,
        birth_state: rawData.birthStateProvince,
        birth_country: rawData.birthCountry,
        debut_date: rawData.mlbDebutDate,
        final_game_date: null,
        active: rawData.active,
    };
}

export async function getMappedPlayer(playerId: number) {
    const rawPlayer = await fetchPlayer(playerId);
    return mapPlayerData(rawPlayer);
}

export async function upsertPlayer(prisma: PrismaClient, playerData: ReturnType<typeof mapPlayerData>) {
    return await prisma.player.upsert({
        where: { id: playerData.id },
        update: playerData,
        create: playerData
    });
}
