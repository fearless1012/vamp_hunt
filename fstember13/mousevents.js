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
				draw_map();
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