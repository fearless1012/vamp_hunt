/**************************************************
** GAME VARIABLES
**************************************************/
var canvas,			// Canvas DOM element
	context,		// Canvas rendering context
	localPlayer,	// Local player
	remotePlayer,
	socket;
var map_size,
	no_of_points,
	point_radius,
	x,y,
	vamp,
	no_of_hunters,
	hunt,
	caught,
	available_points,
	vamp_turn,
	change_pos,
	bus_points,ug_points,
	road_connected, bus_connected, ug_connected;
	var Player = function () {
		var id;
	}

/**************************************************
** GAME INITIALISATION
**************************************************/
function init() 
	{
		// Declare the canvas and rendering context
		canvas = document.getElementById("gameCanvas");
		context = canvas.getContext("2d");
		
		//initialise variables
		init_variables();
		load_connections();
		
		// Maximise the canvas
		resize();
			
		socket = io.connect("http://localhost", {port: 1012, transports: ["websocket"]});
		remotePlayers = [];

		// Calculate a random start position for the players
		//	init_posi_randomiser();

		// Initialise the local player
		localPlayer = new Player();

		// Start listening for events
		setEventHandlers();
		
	}
	
function init_variables()
	{
		no_of_points = 94;
		vamp_turn = 1;
		change_pos = 0;
		
		no_of_hunters = 4;
		hunt = new Array(no_of_hunters);
		x = new Array(no_of_points);
		y = new Array(no_of_points);	
		
		available_points = new Array(no_of_points);
		
		road_connected = new Array(no_of_points);
		bus_connected = new Array(no_of_points);
		underground_connected = new Array(no_of_points);
		
		for(var i=0;i<no_of_points;i++)
		{
			available_points[i] = 0;
		}
	}
	

/**************************************************
** GAME EVENT HANDLERS
**************************************************/
function resize()
	{
		var size;
		
		if(window.innerWidth<window.innerHeight)
		size=window.innerWidth;
		else
		size=window.innerHeight;
		
		canvas.width = size;
		canvas.height = size;
		map_size = 5*size/6;
		
		point_radius = map_size/100;
		load_points();
		
		draw();
	}
		
var setEventHandlers = function() {
		// Mouse
		canvas.addEventListener('mousemove', onMousemove, false);
		canvas.addEventListener('mousedown', onMousedown, false);
		canvas.addEventListener('mouseup', onMouseup, false);

		// Window resize
		window.addEventListener("resize", resize, false);
		socket.on("connect", onSocketConnected);
		socket.on("disconnect", onSocketDisconnect);
		socket.on("new player", onNewPlayer);
		socket.on("remove player", onRemovePlayer);
		socket.on("player positions", Player_positions);
	}

// mouse down
function onMousedown(e) 
	{
		if (localPlayer) 
		{
			var mousePos = getMousePos(e);
			for(var i=0;i<no_of_points;i++)
			{
				if(mousePos.x>=(x[i]-point_radius) && mousePos.x<=(x[i]+point_radius) && mousePos.y>=(y[i]-point_radius) && mousePos.y<=(y[i]+point_radius))
				{
					show_places(i);
					if(i==vamp)
					{
						change_pos = 5;
					}
					for(var j=0;j<no_of_hunters;j++)
					{
						if(i==hunt[j])
						{
							change_pos = j+1;
						}
					}
				}
			}
		}
	}

function onMouseup(e) 
	{
		if (localPlayer) 
		{
			if(change_pos!=0)
			{
			var mousePos = getMousePos(e);
				for(var i=0;i<no_of_points;i++)
				{
					if(mousePos.x>=(x[i]-point_radius) && mousePos.x<=(x[i]+point_radius) && mousePos.y>=(y[i]-point_radius) && mousePos.y<=(y[i]+point_radius))
					{ 
						if(available_points[i]==1)
						{
							if(change_pos == 5)
							{
								vamp=i;
							}
							for(var j=0;j<no_of_hunters;j++)
							{
								if(change_pos==(j+1))
								{
									hunt[j]=i;
								}
							}
						}
					}
				}
			change_pos = 0;
			}
		}
	}

function onMousemove(e) 
	{
		canvas.style.cursor = 'default';
		if (localPlayer) 
		{
			var mousePos = getMousePos(e);
			if(change_pos==0)
			{				
				for(var i=0;i<no_of_points;i++)
				{
					if(mousePos.x>=(x[i]-point_radius) && mousePos.x<=(x[i]+point_radius) && mousePos.y>=(y[i]-point_radius) && mousePos.y<=(y[i]+point_radius))
					{
						show_places(i);
						if(i==vamp)
						{
							canvas.style.cursor = 'pointer';
						}
						for(var j=0;j<no_of_hunters;j++)
						{
							if(i==hunt[j])
							{
								canvas.style.cursor = 'pointer';
							}
						}
							
					}
				}
				draw_map();
			}
		}
	}
//get mouse position
function getMousePos(evt){
			var rect = canvas.getBoundingClientRect(), root =document.documentElement;
			var mouseX = evt.clientX - rect.top - root.scrollTop;
			var mouseY = evt.clientY - rect.left - root.scrollLeft;
			return {
			  x: mouseX,
			  y: mouseY
			}
		}
	  
function onSocketConnected(){
		console.log("Connected to socket server");
		socket.emit("new player");
		draw_map();
	}

function onSocketDisconnect()
	{
		console.log("Disconnected from socket server");
	}

function onNewPlayer(data) 
	{
		console.log("New player connected: "+data.id);
		var newPlayer = new Player();
		newPlayer.id = data.id;
		remotePlayers.push(newPlayer);
	}

function onRemovePlayer(data) 
	{
		var removePlayer = playerById(data.id);

		if (!removePlayer) 
		{
			console.log("Player not found: "+data.id);
			return;
		};
		//console.log(remotePlayers.length);
		remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);
		
	}
function Player_positions(data)
{
	vamp = data.vamp;
	hunt = data.hunt;
//	console.log(hunt[2]);
}
function playerById(id) {
    var i;
    for (i = 0; i < remotePlayers.length; i++) {
        if (remotePlayers[i].id == id)
            return remotePlayers[i];
    };

    return false;
}
/**************************************************
** GAME ANIMATION LOOP
**************************************************/

/**************************************************
** GAME UPDATE
**************************************************/
function show_places(chosen)
	{
		available_points[chosen]=2;
		for(var i=0;i<road_connected[chosen].length;i++)
		{
			available_points[road_connected[chosen][i]] = 1 ;
		}
		for(var i=0;i<bus_points.length;i++)
		{
			if(chosen==bus_points[i])
			{
				for(var i=0;i<bus_connected[chosen].length;i++)
				{
					available_points[bus_connected[chosen][i]] = 3 ;
				}
				break;
			}
		}
	
		for(var i=0;i<u_connected.length;i++)
		{
			if(chosen==i)
			{
				for(var i=0;i<u_connected.length;i++)
				{
					available_points[u_connected[chosen][i]] = 4 ;
				}
				break;
			}	
		}
	}