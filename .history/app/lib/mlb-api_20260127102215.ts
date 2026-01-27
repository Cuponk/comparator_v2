import "dotenv/config";
import { PrismaClient } from "@prisma/client/extension";

const baseUrl = process.env.MLB_URL;

//only fetch judge and ohtani for now
export async function fetchPlayer(playerId: number) {
    const url = baseUrl + "people/" + playerId;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Response code:' + response.status);
        }
        const result = await response.json();
        const formatted = result.people[0];
        console.log(formatted);
        return formatted;
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error("Unknown Error")
        }
        throw error;
    }
}

export const fetchJudge = async () => {
    const judgeId = 592450;
    return await fetchPlayer(judgeId);
}

export const fetchOhtani = async () => {
    const ohtaniId = 660271;
    return await fetchPlayer(ohtaniId);
}

await fetchPlayer(592450);