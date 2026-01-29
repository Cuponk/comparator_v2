"use client";

import { useState } from "react";

const page = () => {

    const [player, setPlayer] = useState(null);

    function fetchPlayer() {
        fetch('/api/players/592450')
        .then(response => response.json())
        .then(data => {
            setPlayer(data);
        })
        .catch(error => {
            console.error('Error fetching player:', error);
        });
    }

    return( 
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white space-y-4">  
        Player Page
        <button className="bg-white text-black px-4 py-2 rounded" onClick={fetchPlayer}>
            Get Player
        </button>
        {player && (
            <div className="mt-4 p-4 bg-gray-800 rounded">
                <h2 className="text-xl font-bold mb-2">Player Info</h2>
                <pre>{JSON.stringify(player, null, 2)}</pre>
            </div>
        )}
    </div>
    );
};

export default page;
