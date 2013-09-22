/**************************************************
** GAME VARIABLES
**************************************************/
var canvas,			// Canvas DOM element
	context;		// Canvas rendering context
var map_size,
	no_of_points,
	point_radius,
	x,y,
	vamp,
	no_of_hunters,
	hunt,
	caught,
	available_points,
	change_pos,
	bus_points,ug_points,
	road_connected, bus_connected, ug_connected,
	turn,round,hunt_points;
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
		
		canvas2 = document.getElementById("menuCanvas");
		context2 = canvas.getContext("2d");
		
		//initialise variables
		init_variables();
		load_connections();
		
		// Maximise the canvas
		resize();
			
		// Calculate a random start position for the players
		//	init_posi_randomiser();

		// Start listening for events
		setEventHandlers();
		
		//initialise positions 
		init_posi_randomiser();
		
		//start with vampire
	    vamp_turn();
	}
	
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
	
function init_variables()
	{
		no_of_points = 94;
		change_pos = 0;
		
		hunt_points=new Array(no_of_points);
		
		no_of_hunters = 4;
		hunt = new Array(no_of_hunters);
		
		turn=no_of_hunters;
		round=0;
		
		x = new Array(no_of_points);
		y = new Array(no_of_points);	
		
		available_points = new Array(no_of_points);
		
		road_connected = new Array(no_of_points);
		bus_connected = new Array(no_of_points);
		underground_connected = new Array(no_of_points);
		
		for(var i=0;i<no_of_points;i++)
		{
			available_points[i] = 0;
			hunt_points[i]=0;
		}
	}
	

/**************************************************
** GAME EVENT HANDLERS
**************************************************/
function resize()
	{
		var size;
		
		if(window.innerWidth<window.innerHeight)
		size=9*window.innerWidth/10;
		else
		size=9*window.innerHeight/10;
		
		canvas.width = size;
		canvas.height = size;
		
		//canvas2.width = size/3;
		//canvas2.height = size;
		
		map_size = size;
		
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
	}

// mouse down
function onMousedown(e) 
	{
		var mousePos = getMousePos(e);
		for(var i=0;i<no_of_points;i++)
		{
			if(mousePos.x>=(x[i]-point_radius) && mousePos.x<=(x[i]+point_radius) && mousePos.y>=(y[i]-point_radius) && mousePos.y<=(y[i]+point_radius))
			{
				show_places(i);
				if(i==hunt[turn])
				{
					change_pos = 1;
				}
			}
		}
	}

function onMouseup(e) 
	{
		if(change_pos)
		{
		var mousePos = getMousePos(e);
			for(var i=0;i<no_of_points;i++)
			{
				if(mousePos.x>=(x[i]-point_radius) && mousePos.x<=(x[i]+point_radius) && mousePos.y>=(y[i]-point_radius) && mousePos.y<=(y[i]+point_radius))
				{ 
					if(available_points[i]==1||available_points[i]==3||available_points[i]==4)
					{
						hunt[turn]=i;
						hunt_turn();
					}
				}
			}
		change_pos = 0;
		}
	}

function onMousemove(e) 
	{
		var mousePos = getMousePos(e);
		if(!change_pos)
		{		
			for(var i=0;i<no_of_points;i++)
			{
				available_points[i] = 0;
			}
			canvas.style.cursor = 'default';
			for(var i=0;i<no_of_points;i++)
			{
				if(mousePos.x>=(x[i]-point_radius) && mousePos.x<=(x[i]+point_radius) && mousePos.y>=(y[i]-point_radius) && mousePos.y<=(y[i]+point_radius))
				{
					show_places(i);
					if(i==hunt[turn])
					{
						canvas.style.cursor = 'pointer';
					}
				}
			}
		}
		draw_map(mousePos);
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
			if(bus_points[i]==chosen)
			{
				for(var j=0;j<bus_connected[chosen].length;j++)
				{
					if(j!=i)
					available_points[bus_connected[chosen][j]] = 3 ;
				}
				break;
			}
		}
	
		for(var i=0;i<u_points.length;i++)
		{
			if(u_points[i]==chosen)
			{
				for(var j=0;j<u_points.length;j++)
				{
					if(j!=i)
					available_points[u_points[j]] = 4 ;
				}
				break;
			}	
		}
		for(var j=0;j<no_of_hunters;j++)
		{
			available_points[hunt[j]] = 5;
		}
	}