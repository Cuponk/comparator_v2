import "dotenv/config";
// import { PrismaClient } from "../generated/prisma/client";

const baseUrl = process.env.MLB_URL;

//only fetch judge and ohtani for now
export async function fetchPlayers() {
    const url = baseUrl + "people/660271"
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Response code:' + response.status);
        }
        const result = await response.json();
        console.log(result);
        return result
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

await fetchPlayers();