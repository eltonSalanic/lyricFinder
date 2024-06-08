import bodyParser from "body-parser";
import express from "express";
import axios from "axios";

//grab API keys
import dotenv from 'dotenv';
dotenv.config();
const API_KEY = process.env.API_KEY;
const API_URL = "https://api.genius.com";
console.log(process.env);
console.log(API_KEY);

const app = express();

app.use(express.static("public"));

const config = {
    headers: { Authorization: `Bearer ${API_KEY}`},
};


app.use(bodyParser.urlencoded({extended: true}));


app.post("/search-songs", async (req, res)=>{
    //Get Song ID From user search
    const searchTerm = req.body.songSearch; //stores what user searched for
    const searchQuery = "?q=" + searchTerm; //generates the query with song name
    const nameSearchURL = API_URL + "/search" + searchQuery; //generates the full url

    const response = await axios.get(nameSearchURL, config); //gets song ID and sends authentication header

    let results = response.data.response.hits;
    res.render("index.ejs", {searchResults: results}); //sends results as an array of only songs
});

app.post("/get-lyrics", async (req, res)=>{
    //Get lyrics using song id as search query parameter
    const songId = req.body.songSelection//stores song id as string
    const idSearchURL = API_URL + "/songs/" + songId; //generates full URL
    const response = await axios.get(idSearchURL, config); //gets song from Genius API using ID

    res.render("index.ejs", {lyrics: response.data.response.song.embed_content, songTitle: response.data.response.song.title}); //render lyrics as html
});


app.get("/", async (req, res)=>{
    res.render("index.ejs");
});

app.listen(3000, ()=>{
    console.log("Server is up and running");
})

