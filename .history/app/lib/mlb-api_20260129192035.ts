import "dotenv/config";

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
        return formatted;
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error("Unknown Error")
        }
        throw error;
    }
};

export async function fetchPlayers() {
    try {
        const url = baseUrl + "sports/1/players?season=2025&game_type=REGULAR_SEASON&hasStats=true";
        console.log("Fetching players from URL:", url);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Response code:' + response.status);
        }
        const result = await response.json();
        const players = result.people;
        console.log(`Fetched ${players.length} players.`);
        return players;
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error("Unknown Error")
        }
        throw error;
    }
};

export async function fetchCareerHitting(id: number) {
    let stats: any = {};
    try {
        const url = baseUrl + "people/" + id + "/stats?stats=career&group=hitting";
        console.log("Fetching career hitting from URL:", url);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Response code:' + response.status);
        }
        const result = await response.json();
        stats = result.stats[0].splits[0].stat;
        console.log(`Fetched career hitting stats for player ID ${id}.`);
        return stats;
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error("Unknown Error")
        }
        throw error;
    }
};

export async function fetchCareerPitching(id: number) {

}

export async function fetchSeasonHitting(id: number) {

}

export async function fetchSeasonPitching(id: number) {

}

export async function fetchHittingGameLog(id: number) {

}
export async function fetchPitchingGameLog(id: number) {

}
export const getAllPlayerIds = async () => {
    const players = await fetchPlayers();
    return players.map((player: any) => player.id);
};