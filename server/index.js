const express = require('express');
      app = express();
const cors = require('cors');
const { Sequelize, DataTypes, Model } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
});

class Game extends Model {}
class Device extends Model {}
class Player extends Model {}

Game.init({
    code:DataTypes.NUMBER,
    passcode:DataTypes.TEXT,
    meeting:DataTypes.BOOLEAN,
    devices:DataTypes.TEXT,
    players:DataTypes.TEXT,
    imposters:DataTypes.TEXT,
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
    await sequelize.sync();

    app.use(express.json())
    app.use(cors());
    app.use(express.urlencoded({extended: true}));
    app.listen(4000)
}

main()