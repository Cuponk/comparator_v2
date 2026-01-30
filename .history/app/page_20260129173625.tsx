"use client";

import { useState } from "react";

const page = () => {

    const [player, setPlayer] = useState(null);
    const [playerId, setPlayerId] = useState("");
    const [search, setSearch] = useState("");
    const [term, setTerm] = useState('');

    function fetchPlayer(id: string) {
        fetch('/api/players/' + id) 
        .then(response => response.json())
        .then(data => {
            setPlayer(data);
        })
        .catch(error => {
            console.error('Error fetching player:', error);
        });
    }

    function renderPlayer() {
        if (!player) return null;

        return (
            <div className="mt-4 p-4 bg-gray-800 rounded">
                <h2 className="text-xl font-bold mb-2">Player Details</h2>
                <p><strong>ID:</strong> {player.id}</p>
                <p><strong>Name:</strong> {player.full_name}</p>
                <p><strong>Position:</strong> {player.position}</p>
                {/* Add more player fields as necessary */}
            </div>
        );
    }

    function searchPlayer(term: string) {
        fetch('/api/players/search/' + term)
        .then(response => response.json())
        .then(data => {
            setSearch(data);
        })
    }
    
    function renderSearchResults() {
        if (!search || search.length === 0) return null;

        return (
            <div className="mt-4 p-4 bg-gray-800 rounded">
                <h2 className="text-xl font-bold mb-2">Search Results</h2>
                <ul>
                    {search.map((player: any) => (
                        <li key={player.id}>
                            <button className="text-blue-400 underline" onClick={() => fetchPlayer(player.id)}>
                            {player.full_name} - {player.position}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    return( 
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white space-y-4">  
        Player Page
        <input type="text" placeholder="Player Name" className="px-4 py-2 rounded bg-gray-800 border border-gray-700 text-white" value={term} onChange={(e) => setTerm(e.target.value)} />
        <button className="bg-white text-black px-4 py-2 rounded" onClick={() => searchPlayer(term)}>
            Get Players
        </button>
        {renderPlayer()}
        {renderSearchResults()}
    </div>
    );
};

export default page;
