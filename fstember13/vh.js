var util = require("util"),
    io = require("socket.io");
var socket,
    players,
	vamp,
	hunt,
	no_of_hunters;
	
var Player = function() 
{
    var id;
    return 
	{
        id: id
    }
};

function init() 
{
    players = [];
	no_of_hunters =4;
	hunt = new Array(no_of_hunters);
	socket = io.listen(1012);
	socket.configure(function() 
	{
		socket.set("transports", ["websocket"]);
		socket.set("log level", 2);
	});
	init_posi_randomiser();
	setEventHandlers();
};

function init_posi_randomiser()
	{
		var no_of_points = 94;
		var temp3;
		var temp = new Array(no_of_points);
		for(var i=0;i<no_of_points;i++)
		{
			temp[i]=i;
		}
		for(var i=0;i<no_of_points;i++)
		{
			var temp2 = Math.floor((no_of_points) * Math.random());
			for(var j=0;j<(hunt.length+1);j++)
			{
				temp3 = temp[j];
				temp[j] = temp[temp2];
				temp[temp2] = temp3;
			}
		}
		
		vamp = temp[0];
		for(var i=0;i<hunt.length;i++)
		{
			hunt[i]=temp[i+1];
		}
	}

var setEventHandlers = function() 
{
    socket.sockets.on("connection", onSocketConnection);
};

function onSocketConnection(client) 
{
    util.log("New player has connected: "+client.id);
	this.emit("player positions", {vamp: vamp,hunt :hunt});
    client.on("disconnect", onClientDisconnect);
    client.on("new player", onNewPlayer);
};

function onClientDisconnect() 
{
    util.log("Player has disconnected: "+this.id);
	onRemovePlayer(this.id);
	this.broadcast.emit("remove player", {id: this.id});
};

function onNewPlayer(data)
{
	var newPlayer = new Player();
	newPlayer.id = this.id;
	this.broadcast.emit("new player", {id: newPlayer.id});
	var i, existingPlayer;
	for (i = 0; i < players.length; i++) 
	{
		existingPlayer = players[i];
		this.emit("new player", {id: existingPlayer.id});
	};
	players.push(newPlayer);
};

function onRemovePlayer(data) 
{
	var removePlayer = playerById(data);
	if (!removePlayer) {
		util.log("Player not found: "+data);
		return;
	};
	players.splice(players.indexOf(removePlayer), 1);
};

function playerById(id) {
    var i;
    for (i = 0; i < players.length; i++) {
        if (players[i].id == id)
            return players[i];
    };

    return false;
};
init();