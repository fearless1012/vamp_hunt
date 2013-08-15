/**************************************************
** GAME VARIABLES
**************************************************/
var canvas,			// Canvas DOM element
	context,			// Canvas rendering context
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
	road_connected , rail_connected , underground_connected;
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
		
	};
	
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
		rail_connected = new Array(no_of_points);
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
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		
		if(canvas.width<canvas.height)
		map_size = 5*canvas.width/6;
		else
		map_size = 5*canvas.height/6;
		
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
	};

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
					}
				}
				draw_map();
			}
			else
			{
				//draw_map();
				if(change_pos==5)
					context.fillStyle = 'pink';
				else
					context.fillStyle = 'blue';

					context.beginPath();
				context.arc(mousePos.x,mousePos.y,point_radius,0,Math.PI*2,true);
				context.fill();
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
	};

function onNewPlayer(data) 
	{
		console.log("New player connected: "+data.id);
		var newPlayer = new Player();
		newPlayer.id = data.id;
		remotePlayers.push(newPlayer);
	};

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
		
	};
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
};
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
	}

/**************************************************
** GAME DRAW
**************************************************/
function draw() 
{ 
	// Draw the map
	draw_map();
	//Draw the menu
	draw_menu();
}
	
// Draw the map
function draw_map()
{
	var map = new Image();
	map.src = "map.jpg";
	map.onload = function() 
	{
		context.drawImage(map, 0, 0,map_size,map_size);
		draw_points();
	};
}

//Draw the points
function draw_points()
{
	for(var i=0;i<no_of_points;i++)
	{
		context.beginPath();
		context.arc(x[i],y[i],point_radius,0,Math.PI*2,true);
		context.lineWidth = 2;
		if(i==vamp&&change_pos!=5)
		context.fillStyle = 'pink';
		else
		context.fillStyle = 'green';
		for(var j=0;j<hunt.length;j++)
			if(hunt[j]==i&&change_pos!=(j+1))
				context.fillStyle = 'blue';
		context.fill();
		if(!available_points[i])
		context.strokeStyle = '#003300';
		else if(available_points[i]==1)
		context.strokeStyle = 'red';
		else
		context.strokeStyle = 'yellow';
		context.stroke();
		context.fillStyle = 'yellow';
	//	context.fillText(i, x[i]-point_radius, y[i]); - use when you need to know point number !
		if(change_pos==0)
		{
		//available_points[i]=0;
		console.log("PP");
		}
		else
		{
			console.log(i);
		}	
	}
}
function draw_menu()
{
	context.fillStyle = 'black';
	context.fillRect(0,map_size,map_size,canvas.height);
	context.fill();
	context.fillStyle = 'orange';
	var arc_y = map_size*(11/10);
	var arc_x = map_size/8;
	for(var i=0;i<4;i++)
		{
			context.beginPath();
			context.arc(arc_x+(arc_x*i*2),arc_y,arc_x/2,0,Math.PI*2,true);
			context.stroke();
			context.fill();
		}
}