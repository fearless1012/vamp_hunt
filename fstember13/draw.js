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
		for(var i=0;i<no_of_points;i++)
		{
			draw_points(i);
			if(change_pos==0){
				available_points[i]=0;
			}
			if(change_pos==5)
				context.fillStyle = 'orange';
			else
				context.fillStyle = 'blue';
			context.beginPath();
			context.arc(mousePos.x,mousePos.y,point_radius+10,0,Math.PI*2,true);
			context.fill();
		}
		draw_bus();
		draw_underground();
	};
}

//Draw the points
function draw_points(i)
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
				context.fillStyle = 'orange';
		context.strokeStyle = '#003300';
		
		if(available_points[i]==1)
		context.fillStyle = '#003300';

		context.stroke();
		context.fill();
		context.fillStyle = 'yellow';
		context.fillText(i, x[i]-point_radius, y[i]); //- use when you need to know point number !
}
function draw_bus()
{
	for(var i=0;i<bus_points.length;i++)
	{
		draw_point(x[bus_points[i]],y[bus_points[i]],point_radius+2,'blue');
	}	
}
function draw_underground()
{
	for(var i=0;i<u_points.length;i++)
	{
		draw_point(x[u_points[i]],y[u_points[i]],point_radius+4,'red');
	}	
}
function draw_point(x,y,radius,color)
{
	context.beginPath();
		context.arc(x,y,radius,0,Math.PI*2,true);
		context.lineWidth = 2;
		context.strokeStyle = color;
		context.stroke();
}
function draw_menu()
{
	context.fillStyle = '#565051';
	context.fillRect(0,map_size+1,map_size,canvas.height);
	//context.fillRect(map_size,0,canvas.height,canvas.height);
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