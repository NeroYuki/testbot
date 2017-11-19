const Discord = require ("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
var request = require('request');
var fs = require('fs');

client.login(config.token);

client.on("ready", () => {
    console.log("Hello World");
});

function findMax(s1,s2,s3,s4) {
    let smax = s1;
    if (s2>smax) smax = s2;
    if (s3>smax) smax = s3;
    if (s4>smax) smax = s4;
    return smax;
}

var players = ["","","",""];
var playerscore = [0,0,0,0];
var scoreadd = [0,0,0,0];
let rteamscore = 0;
let bteamscore = 0;

function resetmatch() {
    players = ["","","",""];
    playerscore = [0,0,0,0];
    scoreadd = [0,0,0,0];
    rteamscore = 0;
    bteamscore = 0;
}
client.on("message", (message) => {
    const args = message.content.split(/\s+/g).slice(1);
    if (!message.content.startsWith(config.prefix)|| message.author.bot) return;
     
    else if (message.content.startsWith(config.prefix + "profileid")) {
        const args = message.content.split(/\s+/g).slice(1);
        let uid = args[0];
        message.channel.send("http://ops.dgsrz.com/profile.php?uid="+uid);
    }
    else if (message.content.startsWith(config.prefix + "matchadd")) {
        players[0] = args[0]; playerscore[0] = 0;
        players[1] = args[1]; playerscore[1] = 0;
        players[2] = args[2]; playerscore[2] = 0;
        players[3] = args[3]; playerscore[3] = 0;
        rteamscore = playerscore[0]+playerscore[1];
        bteamscore = playerscore[2]+playerscore[3];
        message.channel.send("__**Red Team:**__ "+"**"+ rteamscore +"**\n" + players[0]+": "+playerscore[0] + "\n" + players[1]+": "+playerscore[1] + "\n__**Blue Team: **__"+"**"+ bteamscore +"**\n"  + players[2]+": "+ playerscore[2] + "\n" + players[3]+": "+playerscore[3]);  
    }
    else if (message.content.startsWith(config.prefix + "scoreadd")) {
        let tempscoremax = findMax (parseInt(args[0]),parseInt(args[1]),parseInt(args[2]),parseInt(args[3]));
        scoreadd[0] = Math.floor(parseInt(args[0])/tempscoremax*1000000);
        scoreadd[1] = Math.floor(parseInt(args[1])/tempscoremax*1000000);
        scoreadd[2] = Math.floor(parseInt(args[2])/tempscoremax*1000000);
        scoreadd[3] = Math.floor(parseInt(args[3])/tempscoremax*1000000);
        playerscore[0] += scoreadd[0];
        playerscore[1] += scoreadd[1];
        playerscore[2] += scoreadd[2];
        playerscore[3] += scoreadd[3];
        rteamscore = playerscore[0]+playerscore[1];
        bteamscore = playerscore[2]+playerscore[3];
        if (rteamscore>bteamscore) {
        message.channel.send("__**Red Team:**__ "+"**"+ rteamscore +"**\n" 
        + players[0]+": "+playerscore[0] + "   *(+"+scoreadd[0]+ ")*\n" 
        + players[1]+": "+playerscore[1] + "   *(+"+scoreadd[1]+ ")*\n__**Blue Team: **__"+"**"+ bteamscore +"**\n"  
        + players[2]+": "+playerscore[2] + "   *(+"+scoreadd[2]+ ")*\n" 
        + players[3]+": "+playerscore[3] + "   *(+"+scoreadd[3]+ ")*\n**Red Team is winning by "+ Math.abs(rteamscore-bteamscore)+"**");
        }
        if (bteamscore>rteamscore) {
        message.channel.send("__**Red Team:**__ "+"**"+ rteamscore +"**\n" 
        + players[0]+": "+playerscore[0] + "   *(+"+scoreadd[0]+ ")*\n" 
        + players[1]+": "+playerscore[1] + "   *(+"+scoreadd[1]+ ")*\n__**Blue Team: **__"+"**"+ bteamscore +"**\n"  
        + players[2]+": "+playerscore[2] + "   *(+"+scoreadd[2]+ ")*\n"
        + players[3]+": "+playerscore[3] + "   *(+"+scoreadd[3]+ ")*\n**Blue Team is winning by "+ Math.abs(rteamscore-bteamscore)+"**");
        }
    }
    else if (message.content.startsWith(config.prefix + "scorecheck")) {
        if (rteamscore>bteamscore) {
        message.channel.send("__**Red Team:**__ "+"**"+ rteamscore +"**\n" 
        + players[0]+": "+playerscore[0] + "\n" 
        + players[1]+": "+playerscore[1] + "\n__**Blue Team: **__"+"**"+ bteamscore +"**\n"  
        + players[2]+": "+playerscore[2] + "\n" 
        + players[3]+": "+playerscore[3] +"\n**Red Team is winning by "+ Math.abs(rteamscore-bteamscore)+"**");
        }
        if (bteamscore>rteamscore) {
        message.channel.send("__**Red Team:**__ "+"**"+ rteamscore +"**\n" 
        + players[0]+": "+playerscore[0] + "\n" 
        + players[1]+": "+playerscore[1] + "\n__**Blue Team: **__"+"**"+ bteamscore +"**\n"  
        + players[2]+": "+playerscore[2] + "\n" 
        + players[3]+": "+playerscore[3] +"\n**Blue Team is winning by "+ Math.abs(rteamscore-bteamscore)+"**");
        }
    }
    else if (message.content.startsWith(config.prefix + "scoreundo")) {
        playerscore[0] -= scoreadd[0];
        playerscore[1] -= scoreadd[1];
        playerscore[2] -= scoreadd[2];
        playerscore[3] -= scoreadd[3];
        rteamscore = playerscore[0]+playerscore[1];
        bteamscore = playerscore[2]+playerscore[3];
        message.channel.send("Score Reverted");        
    }
    else if (message.content.startsWith(config.prefix + "matchend")) {
        if (rteamscore>bteamscore) {
            message.channel.send("**Red Team won by " + Math.abs(rteamscore-bteamscore)+"**\nCongrats to our winner **"+players[0] +"** and **"+players[1]+"**");
        }
        if (bteamscore>rteamscore) {
            message.channel.send("**Blue Team won by " + Math.abs(rteamscore-bteamscore)+"**\nCongrats to our winner **"+players[2] +"** and **"+players[3]+"**");
        }
        resetmatch();
    }
    else if (message.content.startsWith(config.prefix + "invite")){
        message.channel.send("https://discordapp.com/oauth2/authorize?client_id=339667494639894538&scope=bot");
    }
});