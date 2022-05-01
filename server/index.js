const express = require('express');
      app = express();
const cors = require('cors');
const crypto = require('crypto');
const { Sequelize, DataTypes, Model } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
});
const objectkeys=(object,keys)=>{
    let objectkeys=Object.keys(object);
    let includes=keys.every(key=>objectkeys.includes(key));
    return includes;
}
const colors=["blue","green","red","yellow","black","brown","pink","purple","orange","gray","lightgray","cyan"]
const code={
    animals:["Monkey","Tiger","Panda","Dog","Cat","Dragon","Mouse","Hamster","Unicorn","Person","Turtle","Bird"],
    verbs:["Running","Walking","Talking","Hiding","Dying","Crying","Writing","Reading","Eating","Drinking","Dinning","Dancing"],
    places:["Your house","Thailand","Japan","China","Russia","Ukraine","the USA","Germany","France","Spain","Mexico","the UK"]
}

class Game extends Model {}
class Device extends Model {}
class Player extends Model {}

Game.init({
    code:DataTypes.NUMBER,
    passcode:DataTypes.TEXT,
    meeting:DataTypes.BOOLEAN,
    started:DataTypes.BOOLEAN,
    devices:DataTypes.TEXT,
    players:DataTypes.TEXT,
    imposters:DataTypes.TEXT,
    tasks:DataTypes.NUMBER,
},{sequelize})
Device.init({
    code:DataTypes.NUMBER,
    passcode:DataTypes.TEXT,
    tasks:DataTypes.NUMBER,
    went:DataTypes.TEXT,
    game:DataTypes.NUMBER,
},{sequelize})
Player.init({
    imposter:DataTypes.BOOLEAN,
    color: DataTypes.NUMBER,
    code:DataTypes.TEXT,
    tasks:DataTypes.NUMBER,
    done:DataTypes.TEXT,
    game:DataTypes.NUMBER,
},{sequelize})

async function main(){
    await sequelize.authenticate();
    await sequelize.sync({force:true});

    app.listen(4000)
}

app.use(express.json())
app.use(cors());
app.use(express.urlencoded({extended: true}));
main()

// this is used to create a game
app.post("/game/", async function(req, res){
    let code=crypto.randomBytes(3).toString('hex')
    while(await Game.findOne({where:{code:code}})){
        code=crypto.randomBytes(3).toString('hex')
    }
    let game=await Game.create({
        code:code,
        passcode:crypto.randomBytes(10).toString('hex'),
        meeting:false,
        started:false,
        devices:JSON.stringify([]),
        players:JSON.stringify([]),
        imposters:JSON.stringify([]),
    })
    res.json(game)
})

// for a device to join a game
app.post("/:game/join/", async function(req, res){
    let game=await Game.findOne({where:{code:req.params.game}})
    if(!game){
        res.status(404).send("Game not found");return
    }
    let code=crypto.randomBytes(3).toString('hex')
    while(await Device.findOne({where:{
        code:code,
        game:game.id,
    }})){code=crypto.randomBytes(3).toString('hex')}
    let device=await Device.create({
        code:crypto.randomBytes(3).toString('hex'),
        passcode:crypto.randomBytes(10).toString('hex'),
        tasks:0,
        went:JSON.stringify([]),
        game:game.id,
    })
    game.devices=JSON.parse(game.devices)
    game.devices.push(device.id)
    game.devices=JSON.stringify(game.devices)
    game.save()
    res.json(device)
})

// to get all of the devices in a game
app.get("/:game/devices/", async function(req, res){
    let game=await Game.findOne({where:{code:req.params.game,passcode:req.query.passcode}})
    if(!game){
        res.status(404).send("Game not found");return
    }
    let devices=await Device.findAll({where:{game:game.id}})
    res.json(devices)
})

// to roespone when there is an update to the devices in the game
app.get("/:game/devices/update/", async function(req, res){
    let game=await Game.findOne({where:{code:req.params.game,passcode:req.query.passcode}})
    if(!game){
        res.status(404).send("Game not found");return
    }
    let past=await Device.findAll({where:{game:game.id}})
    let interval=setInterval(async ()=>{
        let current=await Device.findAll({where:{game:game.id}})
        if(JSON.stringify(past)!=JSON.stringify(current)){
            res.json(await Device.findAll({where:{game:game.id}}));
            clearInterval(interval)
    }},1000)
})

// when game is started, send info back
app.get("/:game/started/", async function(req, res){
    let game=await Game.findOne({where:{code:req.params.game}})
    if(!game){
        res.status(404).send("Game not found");return
    }else{
        if(
            await Device.findOne({where:{passcode:req.query.passcode,game:game.id}})||
            await Game.findOne({where:{code:req.params.game,passcode:req.query.passcode}})
        ){
            let interval=setInterval(async ()=>{
                if(await Game.findOne({where:{code:req.params.game,started:true}})){
                    res.json({started:true});
                    clearInterval(interval)
            }},1000)
        }else{res.status(404).send("Game not found");return}
    }
})

// start a game
app.post("/:game/start/", async function(req, res){
    if(!(req.body.playerdata&&req.body.tasks)){
        res.status(406).send("No player data");return
    }
    let imposters=[];
    let players=[];
    if(req.body.playerdata.length>12){
        res.status(406).send("Too many players");return
    }
    let game=await Game.findOne({where:{code:req.params.game,passcode:req.query.passcode}})
    if(!game){
        res.status(404).send("Game not found");return
    }
    req.body.playerdata.forEach(i=>{
        let newplayer=Player.create({
            imposter:i.imposter,
            color:i.color,
            code:i.code,
            tasks:req.body.tasks-0,
            done:JSON.stringify([]),
            game:req.params.game,
        })
        players.push(newplayer.id)
        if(i.imposter==true){players.push(newplayer.id)}
    })
    game.started=true
    game.players=JSON.stringify(players)
    game.imposters=JSON.stringify(imposters)
    game.save()
    res.json({started:true})
})

// returns 410 if the game has finished, and
// 307 if there is a meeting and 308 when one ends
app.get("/:game/updates/",async function(req, res) {
    let game=await Game.findOne({where:{code:req.params.game}})
    if(!game){
        res.status(404).send("Game not found");return
    }else{
        if(
            await Device.findOne({where:{passcode:req.query.passcode,game:game.id}})||
            await Game.findOne({where:{code:req.params.game,passcode:req.query.passcode}})
        ){
            let pastgame=(await Game.findOne({where:{code:req.params.game}}))
            let interval=setInterval(async ()=>{
                const parse=JSON.parse
                let currentgame=await Game.findOne({where:{code:req.params.game}})
                if(currentgame.tasks==0||parse(currentgame.players).length<=parse(pastgame.imposters).length){
                    res.status(410).send("Game finished")
                    clearInterval(interval)
                }if(pastgame.meeting!=currentgame.meeting){
                    if(pastgame.meeting==true) res.status(308).send("Meeting ended");
                    else res.status(307).send("Meeting started");
                    clearInterval(interval)
            }},1000)
        }else{res.status(404).send("Game not found");return}
    }
})

// toggles a meeting for a game
app.post("/:game/meeting/toggle/",async function(req, res){
    let game=await Game.findOne({where:{code:req.params.game,passcode:req.query.passcode}})
    if(!game){
        res.status(404).send("Game not found");return
    }
    game.meeting=!game.meeting
    game.save()
    res.json({meeting:game.meeting})
})