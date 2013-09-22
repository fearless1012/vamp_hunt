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
function draw_map(mousePos)
{
	var map = new Image();
	map.src = "map2.jpg";
	map.onload = function() 
	{
		context.drawImage(map, 0, 0,map_size,map_size);
		draw_underground();
		draw_bus();
		
		for(var i=0;i<no_of_points;i++)
		{
			draw_points(i);
		}
		draw_hunters();
		draw_vampire();
	};
}

//Draw the points
function draw_points(i)
{
		context.lineWidth = 2;
		context.fillStyle = 'green';
		context.strokeStyle = '#003300';
				
		if(available_points[i]==1)
		context.fillStyle = '#003300';
		else if(available_points[i]==3)
		{
			context.fillStyle = 'aqua';
			context.strokeStyle='aqua';
		}
		else if(available_points[i]==4)
		{
			context.fillStyle = 'pink';
			context.strokeStyle='pink';
		}
		
		draw_point(x[i],y[i],point_radius,0);
		context.fill();
		
		context.fillStyle = 'yellow';
		context.fillText(i, x[i]-point_radius, y[i]); //- use when you need to know point number !
}
function draw_bus()
{
	for(var i=0;i<bus_points.length;i++)
	{
		context.strokeStyle = '000080';
		if(available_points[bus_points[i]]==3)
		context.strokeStyle = 'aqua';
		else if(available_points[bus_points[i]]==4)
		{
			context.strokeStyle='pink';
		}
		draw_point(x[bus_points[i]],y[bus_points[i]],point_radius+2);
	}	
}
function draw_underground()
{
	for(var i=0;i<u_points.length;i++)
	{
		context.strokeStyle = 'red';
		draw_point(x[u_points[i]],y[u_points[i]],point_radius+4);
		if(available_points[u_points[i]]==4)
		{
			context.fillStyle='pink';
			context.fill();
		}
	}	
}
function draw_point(x,y,radius)
{
	context.beginPath();
	context.arc(x,y,radius,0,Math.PI*2,true);
	context.lineWidth = 2;
	context.stroke();
}
function draw_hunters()
{
	for(var i=0;i<no_of_hunters;i++)
	{
		if(change_pos==0||(change_pos==1&&i!=turn))
		{
			context.fillStyle = 'yellow';
						
			draw_point(x[hunt[i]],y[hunt[i]],point_radius);
			if(i==turn)
			{
				context.fillStyle = "orange";
				context.linewidth=5;
			}
			context.strokeStyle = 'yellow';
			context.stroke();
			context.fill();
		}
	}
}
function draw_vampire()
{
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