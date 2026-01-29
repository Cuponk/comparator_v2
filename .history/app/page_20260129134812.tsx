import React from "react";

function fetchData() {
    return <>
    <button className="bg-white text-black px-4 py-2 rounded">Get Player</button>  
    </>;
}

const page = () => {
    return( 
    <>   
    Player Page
    {fetchData()}
    </>);
};

export default page;
