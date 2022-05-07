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
    await sequelize.sync();

    await Game.destroy({
        where: {},
        truncate: true
    })
    await Device.destroy({
        where: {},
        truncate: true
    })
    await Player.destroy({
        where: {},
        truncate: true
    })

    app.listen(4000)
}

app.use(express.json())
app.use(cors());
app.use(express.urlencoded({extended: true}));
main()

app.get("/reset/",async function(req, res){
    await Game.destroy({
        where: {},
        truncate: true
    })
    await Device.destroy({
        where: {},
        truncate: true
    })
    await Player.destroy({
        where: {},
        truncate: true
    })
    res.send("reset")
})

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

    if(req.body.playerdata.length>12){
        res.status(406).send("Too many players");return
    }
    let game=await Game.findOne({where:{code:req.params.game,passcode:req.query.passcode}})
    if(!game){
        res.status(404).send("Game not found");return
    }
    for(let i of req.body.playerdata){
        let newplayer=await Player.create({
            imposter:i.imposter,
            color:i.color,
            code:i.code,
            tasks:i.imposter?0:req.body.tasks-0,
            done:JSON.stringify([]),
            game:req.params.game,
        })

        // don't touch it, it works start

        console.log(game)
        let imposters=JSON.parse(game.imposters);
        let players=JSON.parse(game.players);
        players.push(newplayer.id)
        if(i.imposter==true){imposters.push(newplayer.id)}
        game.players=JSON.stringify(players)
        game.imposters=JSON.stringify(imposters)
        await game.save()

        // don't touch it, it works end

    }
    game.started=true
    let t=req.body.tasks-0
    console.log(t,req.body.tasks,JSON.parse(game.players),JSON.parse(game.imposters))
    game.tasks=(t*JSON.parse(game.players).length)-(t*JSON.parse(game.imposters).length)
    await game.save()
    res.json({started:true})
})

// returns 410 if the game has finished, and
// 307 if there is a meeting and 302 when one ends
app.get("/:game/updates/",async function(req, res) {
    let game=await Game.findOne({where:{code:req.params.game}})
    if(!await Game.findOne({where:{code:req.params.game}})){
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
                console.log(parse(currentgame.players),parse(currentgame.imposters))
                if(currentgame.tasks==0||parse(currentgame.imposters).length==0||parse(currentgame.players).length-1<=parse(pastgame.imposters).length){
                    res.status(410).send(currentgame.tasks==0||parse(currentgame.imposters).length==0?"Crewmates win":"Imposters win")
                    clearInterval(interval)
                }else if(pastgame.meeting!=currentgame.meeting){
                    console.log(pastgame.meeting,currentgame.meeting)
                    if(!!currentgame.meeting==false) res.status(302).send("Meeting ended");
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
    if(req.body.eliminated){
        for(let i of req.body.eliminated){
            let player=await Player.findOne({where:{id:i}})
            await player.destroy()
            let {players,imposters}=game
            game.imposters=JSON.stringify(JSON.parse(imposters).filter(x=>x!=i))
            game.players=JSON.stringify(JSON.parse(players).filter(x=>x!=i))
            await game.save()
            game=await Game.findOne({where:{code:req.params.game,passcode:req.query.passcode}})
        }
    }
    game.meeting=!!!game.meeting
    game.save()
    res.json({meeting:game.meeting})
})

// gets a list of all players
app.get("/:game/players/",async function(req, res){
    const parse=JSON.parse
    let game=await Game.findOne({where:{code:req.params.game}})
    if(!await Game.findOne({where:{code:req.params.game}})){
        res.status(404).send("Game not found");return
    }else{
        if(
            await Device.findOne({where:{passcode:req.query.passcode,game:game.id}})||
            await Game.findOne({where:{code:req.params.game,passcode:req.query.passcode}})
        ){
            let players=[];
            let imposters=[];
            console.log(parse(game.players))
            for(let i of parse(game.players)){
                let player=await Player.findOne({where:{id:i-0}})
                players.push(player)
                if(parse(game.imposters).includes(i-0)){
                    imposters.push(player)
                }
            }
            res.json({
                players:players,
                imposters:imposters
            })
        }else{res.status(404).send("Game not found");return}
    }
})

app.post("/:game/:device/:player/task/",async function(req, res){
    let game=await Game.findOne({where:{code:req.params.game}})
    if(!await Game.findOne({where:{code:req.params.game}})){
        res.status(404).send("Game not found");return
    }else{
        if(
            await Device.findOne({where:{passcode:req.query.passcode,game:game.id}})||
            await Game.findOne({where:{code:req.params.game,passcode:req.query.passcode}})
        ){
            let player=await Player.findOne({where:{id:req.params.player-0,game:req.params.game}})
            if(!player){
                res.status(404).send("Player not found");return
            }else{
                if(player.tasks!=0){
                    player.tasks--
                    game.tasks--
                }
                let done=JSON.parse(player.done)
                done.push(req.params.device)
                player.done=JSON.stringify(done)
                await game.save()
                await player.save()
                res.json({sucess:true})
            }
        }else{res.status(404).send("Game not found");return}
    }
})