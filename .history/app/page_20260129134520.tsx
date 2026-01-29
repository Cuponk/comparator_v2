import React from "react";

function fetchData() {
    console.log("Fetching data...");
}

const page = () => {
    return( 
    <>   
    Player Page
    <button className="bg-white text-black px-4 py-2 rounded" onClick={fetchData}>Click Me</button>
    </>);
};

export default page;
