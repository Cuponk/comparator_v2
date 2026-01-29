"use client";

function fetchPlayer() {
    fetch('/api/players/592450')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        alert(`Player Name: ${data.name}`);
    })
    .catch(error => {
        console.error('Error fetching player:', error);
    });
}

function playerButton() {
    return <>
    <button className="bg-white text-black px-4 py-2 rounded" onClick={fetchPlayer}>Get Player</button>  
    </>;
}

const page = () => {
    return( 
    <>   
    Player Page
    {playerButton()}
    </>);
};

export default page;
