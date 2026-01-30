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
}

export async function fetchPlayers() {
    const players = await fetch(baseUrl + "people?season=2025&game_type=REGULAR_SEASON&hasStats=true")
        .then(response => {
            if (!response.ok) {
                throw new Error('Response code:' + response.status);
            }
            return response.json();
        })
        .then(response => { response.people })
        .catch(error => {
            console.error('Error fetching players:', error);
            throw error;
        });

    return players;
}

