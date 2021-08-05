const express = require('express');
const app = express();
const path = require('path');
const request = require('request');
require('dotenv').config();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

const leagueImageUrl = 'https://media.api-sports.io/football/leagues/';
const leagueIds = {
    premier: { id:39, name:'Premier League' },
    laliga: { id:140, name:'La Liga' },
    bundesliga: { id:78, name:'Bundesliga' },
    seriea: { id:135, name:'Serie A' },
    ligue1: { id:61, name:'Ligue 1' },
    mls: { id:253, name:'MLS' },
    ligamx: { id:262, name:'Liga MX' }
}

app.get('/', (req, res)=>{
    res.render('index', { pageTitle : 'Football Search App'});
});

app.get('/league/team', (req, res) => {
    let teamId = req.query.id;
    let options = {
        method: 'GET',
        url: 'https://v3.football.api-sports.io/players/squads',
        qs: {team: teamId},
        headers: {
          'x-rapidapi-host': 'v3.football.api-sports.io',
          'x-rapidapi-key': process.env.RAPID_API_KEY
        }
    };
    request(options, (error, response, body) => {
        if(error) {
            console.log(error);
            //
            res.render('index');
        } else {
            let data = JSON.parse(body);
            res.render('team', {data : data, teamName:req.query.name, teamId:teamId, pageTitle:req.query.name});
        }
    });
});

app.get('/league/:league', (req, res) => {
    let lg = req.params.league;
    let imageURL = leagueImageUrl.concat(leagueIds[lg].id, '.png');

    let options = {
        method: 'GET',
        url: 'https://v3.football.api-sports.io/teams',
        qs: {league: leagueIds[lg].id, season: '2021'},
        headers: {
            'x-rapidapi-key': process.env.RAPID_API_KEY,
            'x-rapidapi-host': 'v3.football.api-sports.io'
        }
    }
    request(options, (error, response, body) => {
        if(error) {
            console.log(error);
            res.render('index');
        } else {
            let data = JSON.parse(body);
            res.render('league', {data : data, league : leagueIds[lg].name, id:leagueIds[lg].id, imageURL:imageURL, pageTitle:leagueIds[lg].name});
        }
    });
    
});

app.get('*', (req, res)=>{
    res.render('notfound', {pageTitle:'Not Found'});
});


app.listen(3000, ()=>{
    console.log('Server started at port 3000.');
});