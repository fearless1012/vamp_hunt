function vamp_turn()
{
	calculate();
	
	for(var j=0;j<no_of_hunters;j++)
	hunter_points(hunt[j]);

	console.log(vamp);
//______________________________________________
//getting all available points for the vampire
//----------------------------------------------	
	var vamp_avail = new Array();
	var temp=0,rtemp,btemp;
	
	for(var i=0;i<road_connected[vamp].length;i++)
	{
		vamp_avail[temp]=road_connected[vamp][i];
		temp++;
	}
	rtemp=temp;
	for(var i=0;i<bus_points.length;i++)
	{
		if(bus_points[i]==vamp)
		{
			for(var j=0;j<bus_connected[vamp].length;j++)
			{
				if(j!=i)
				{
					vamp_avail[temp]=bus_connected[vamp][bus_points[j]];
					temp++;	
				}
			}
			break;
		}
	}
	btemp=temp;
	for(var i=0;i<u_points.length;i++)
	{
		if(u_points[i]==vamp)
		{
			for(var j=0;j<u_points.length;j++)
			{
				if(j!=i)
				{
					vamp_avail[temp]=u_points[j];
					temp++;	
				}
			}
			break;
		}	
	}

//_________________________________________________________________
//Sorting the available points in ascending order of hunt_points
//-----------------------------------------------------------------

	var max;
	max=hunt_points[vamp_avail[0]];
	for(var i=1;i<temp;i++)
	{
		if(hunt_points[vamp_avail[i]]>max)
		{
			max=hunt_points[vamp_avail[i]];
		}
	}
	console.log("max="+max);
	if(max<=0)
	console.log("you win");
	else
	{
		var next_vamp=new Array();
		var temp2=0;
		for(var i=0;i<temp;i++)
		{
			if(hunt_points[vamp_avail[i]]==max)
			{
				next_vamp[temp2]=vamp_avail[i];
				temp2++;
			}
		}
		console.log("temp2="+temp2);
		var next_vamp_posi = Math.floor((temp2) * Math.random());
		vamp=next_vamp[next_vamp_posi];
		
		for(var i=0;i<temp;i++)
		{
			if(vamp==vamp_avail[i])
			{
				if(i<rtemp)
				{console.log("road"+vamp);
	//			show_move(road);
				}
				else if(i<btemp)
				{console.log("bus"+vamp);
		//		show_move(bus);
				}
				else
				{console.log("ug"+vamp);
			//	show_move(ug);
				}
			}
		}
		turn=-1;
		round++;
	//	if(round%4==0)
		console.log(vamp);
		hunt_turn();
	}
}
function hunter_points(chosen)
{
		hunt_points[chosen]-=10;
		for(var i=0;i<road_connected[chosen].length;i++)
		{
			hunt_points[road_connected[chosen][i]] -= 1;
		}
		for(var i=0;i<bus_points.length;i++)
		{
			if(bus_points[i]==chosen)
			{
				for(var j=0;j<bus_connected[chosen].length;j++)
				{
					if(j!=i)
					hunt_points[bus_connected[chosen][j]] -= 1 ;
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
					hunt_points[u_points[j]] -= 1;
				}
				break;
			}	
		}
	}
function calculate()
{
	for(var i=0;i<no_of_points;i++)
	{
		hunt_points[i] = road_connected[i].length;
	}
	for(var j=0;j<bus_points.length;j++)
	{
		hunt_points[bus_points[j]]+=bus_connected[bus_points[j]].length;
	}
	for(var i=0;i<u_points.length;i++)
	{
		hunt_points[u_points[i]]+=3;
	}
}
function hunt_turn()
{
	if(hunt[turn]==vamp)
	{
		console.log("you win");
	}
	turn++;
	if(turn==no_of_hunters)
	{
		vamp_turn();
	}
}
