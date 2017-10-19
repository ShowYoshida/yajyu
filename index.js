require('dotenv').config();
const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const path = require("path");
const express = require('express');
const app = express();
const discordToken = process.env.DiscordToken;
const prefix = "*";

// Server cfg
app.get('/', function (req, res) {
  fs.readFile('./index.html', 'utf-8' , doReard );
    function doReard(err, data) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      res.end();
	}
});
app.listen(process.env.PORT || 3000);


// fileSearch
function findSoundFile(finename,findCallBack,errCallback){
    let walk = function(p) {
        fs.readdir(p, function(err, files) {
            if (err) {
                errCallback(err);
                return;
            }
            files.forEach(function(f) {
                var fp = path.join(p, f);
                if(fs.statSync(fp).isDirectory()) {
                    walk(fp);
                } else {
                    let findfileName = f.split('.')[0];
                    if ( finename == findfileName ){
                        findCallBack(fp);
                    }
                }
            });
        });
    };
    walk('./sounds');
}


client.on('ready',() => {
    client.user.setGame('Dev mode');
});
client.on( 'message', message => {
    if (!message.guild) return;
    if (message.content.startsWith(prefix + 'join')) {
        if (message.member.voiceChannel) {
            message.member.voiceChannel.join()
                .then(connection => { 
                    message.reply('Excuse me from VoiceChannel');
                })
                .catch(console.log);
        } else {
            message.reply('Idk where I join to');
            return;
        }
    }
    if (message.content.startsWith(prefix + 'leave')) {
        message.member.voiceChannel.leave();
    }
    if (message.member.voiceChannel){
        message.reply('idk where I say');
        return;
    }   
    if (message.member.voiceChannel.connection){
        findSoundFile(
                message.content,
                (filename) => {
                    const dispatcher = message.member.voiceChannel.connection.playFile(filename);
                    dispatcher.on('end', () => {
                    });
                    dispatcher.on('error', e => {
                        console.log(e);
                    });
                },
                (err) => {
                    console.log(err);
                }
        );
    }
});

client.login(discordToken);
