import "dotenv/config";
import { PrismaClient } from "@prisma/client/extension";

const baseUrl = process.env.MLB_URL;

//only fetch judge and ohtani for now
export async function fetchOhtani() {
    const url = baseUrl + "people/660271"
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Response code:' + response.status);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error("Unknown Error")
        }
        throw error;
    }
}

export async function fetchJudge() {
    const url = baseUrl + "people/592450"
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Response code:' + response.status);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error("Unknown Error")
        }
        throw error;
    }
}

