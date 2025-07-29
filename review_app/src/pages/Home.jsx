import React from "react";
import { Navbar } from "../components";

const Home = () => {
    return (
        <div className="bg-black">
            <Navbar/>
            <h1 className="text-red-500">This is the Home page</h1>
        </div>
    )
}

export default Home;