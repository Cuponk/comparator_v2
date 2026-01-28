import { fetchPlayer } from "./mlb-api";
import { PrismaClient } from "../generated/prisma/client";

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

export class PlayerNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "PlayerNotFoundError";
    }
}

export class PlayerIngestionError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "PlayerIngestionError";
    }
}

function validatePlayerData(data: rawPlayerData) {
    if (!data.id || !data.fullName) {
        throw new PlayerNotFoundError(`Player data is missing required fields: ${JSON.stringify(data)}`);
    }
}

export function mapPlayerData(rawData: rawPlayerData) {
    try {
        validatePlayerData(rawData);
        
        return {
            id: rawData.id,
            full_name: rawData.fullName,
            first_name: rawData.firstName,
            last_name: rawData.lastName,
            number: rawData.primaryNumber,
            position: rawData.primaryPosition.abbreviation,
            position_category: rawData.primaryPosition.type,
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

    } catch (error) {
        throw new PlayerNotFoundError(`Error mapping player data: ${error}`);
    }
}

export async function getMappedPlayer(playerId: number) {
    try {
        const rawPlayer = await fetchPlayer(playerId);
        if (!rawPlayer) {
            throw new PlayerNotFoundError(`Player with ID ${playerId} not found.`);
        }
        return mapPlayerData(rawPlayer);
    } catch (error) {
        throw new PlayerNotFoundError(`Error mapping player data: ${error}`);
    }
}

export async function upsertPlayer(prisma: PrismaClient, playerData: ReturnType<typeof mapPlayerData>) {
    try {
        return await prisma.player.upsert({
            where: { id: playerData.id },
            update: playerData,
            create: playerData
            
        });
    } catch (error) {
        throw new PlayerIngestionError(`Error upserting player data: ${error}`);
    }
}
