"use client";

import { useState } from "react";

const page = () => {

    const [player, setPlayer] = useState(null);

    function fetchPlayer() {
        fetch('/api/players/' + '592450') 
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
        <input type="text" placeholder="Player ID" className="px-4 py-2 rounded bg-gray-800 border border-gray-700 text-white" />
        <button className="bg-white text-black px-4 py-2 rounded" onClick={fetchPlayer}>
            Get Player
        </button>
        {player && player.full_name}
    </div>
    );
};

export default page;
