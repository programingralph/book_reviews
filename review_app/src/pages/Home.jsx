import React from "react";
import { Navbar, BookReview } from "../components";

const Home = () => {
    return (
        <div className="bg-black">
            <Navbar/>
            <h1 className="text-red-500">Search bar For display purpose only please register or login in order to use</h1>
            <BookReview/>
        </div>
    )
}

export default Home;