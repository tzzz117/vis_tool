/*
vis 2
tong zhao 
*/


vis_init();

function vis_init(){

	d3.csv("data1/2010.csv", function(error, links) {
		
		if(error) 
			alert("error !");
		
		d3.select("#main_svg").remove();

		var nodes = {};

		////////////////////////////////////////////////////////////

	  	tx_ = {};
 	 	ty_ = {};
 	 	abx_ = {};
	  	aby_ = {};
 	 	kx_ = {};
	  	ky_ = {};
 	 	title_ = {};
  
  		// Compute the distinct nodes from the links.
		links.forEach(function(link) {
			
			title_[link.target] = link.title;
			
			tx_[link.target] = link.t_x;
			ty_[link.target] = link.t_y;
			
			abx_[link.target] = link.ab_x;
			aby_[link.target] = link.ab_y;
			
			kx_[link.target] = link.k_x;
			ky_[link.target] = link.k_y;
			
			link.source = nodes[link.source] || 
        	(nodes[link.source] = {name: link.source});
    		link.target = nodes[link.target] || 
        	(nodes[link.target] = {name: link.target});	
			
	});


////////////////////////////////////////////////////////////////////
	var width = 1100,
    	height = 900;

	var force = d3.layout.force()
    	.nodes(d3.values(nodes))
    	.links(links)
    	.size([width, height])
    	.linkDistance(11)
  	    .charge(-100)
    	.on("tick", tick)
    	.start();
    	
  
  
  // display clustergram_container and clust_instruct_container
  d3.select('#clustergram_container').style('display','block');
  d3.select('#clust_instruct_container').style('display','block');

// initailize clust_group with id clust_group
  var svg = d3.select("#svg_div")
      .append("svg")
      .attr('id', 'main_svg')
      // the svg can be larger than the visualization - use svg_height and svg_width
      .attr("width",  width )
      .attr("height", height )
      .attr('border',1)
 //     .call( zoom ) 
      .append("g")
      .attr('id', 'clust_group')
//      .attr("transform", "translate(" + (margin.left) + "," + (margin.top) + ")");


	// build the arrow.
	svg.append("svg:defs").selectAll("marker")
    .data(["end"])      // Different link/path types can be defined here
  	.enter().append("svg:marker")    // This section adds in the arrows
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 25)
    .attr("refY", -1.5)
    .attr("markerWidth", 7)
    .attr("markerHeight", 7)
    .attr("orient", "auto")
  	.append("svg:path")
    .attr("d", "M0,-5L10,0L0,5");

		// add the links and the arrows
		var path = svg.append("svg:g").selectAll("path")
    		.data(force.links())
  			.enter().append("svg:path")
			//    .attr("class", function(d) { return "link " + d.type; })
    		.attr("class", "link")
    		.attr("marker-end", "url(#end)");
    	
    	
		// define the nodes
		var node = svg.selectAll(".node")
    		.data(force.nodes())
  			.enter().append("g")
    		.attr("class", "node");
    	
    	
    	node.append("circle")
  		  	.attr("r", 5)
    		.style("fill", "9AFFF2")
    		
    		.on('click', function(d, i) {
				
				d3.select(this)
					.attr("r", 11)	
					.style("fill", "FF6D12");
			
				$('#_doi').val(d.name);
				$('#_t').val(title_[d.name]);
			
			})
			
    		.call(force.drag);
	

	// add the curvy lines
	function tick() {
    	path.attr("d", function(d) {
        	var dx = d.target.x - d.source.x,
            	dy = d.target.y - d.source.y,
            	dr = Math.sqrt(dx * dx + dy * dy);
        	return "M" + 
            	d.source.x + "," + 
            	d.source.y + "A" + 
            	dr + "," + dr + " 0 0,1 " + 
            	d.target.x + "," + 
            	d.target.y;
    	});

    	node.attr("transform", function(d) { 
  	    	return "translate(" + d.x + "," + d.y + ")"; });
		}
	
	$('#up').on('click', function(event) {
	        svg.attr( "transform","translate(0, -200)" );
	});	
	
	$('#down').on('click', function(event) {
	        svg.attr( "transform","translate(0, 200)" );
	});	
	
	$('#left').on('click', function(event) {
	        svg.attr( "transform","translate(-200, 0)" );
	});	
	
	$('#right').on('click', function(event) {
	        svg.attr( "transform","translate(200, 0)" );
	});	
	
	
	$('#search_yr').on('click', function(event) {
	//	"vis();"
		var yr = parseInt($('#_yr').val());
		
		if(yr<=2000 || yr>=2016){
			alert("invalid yr");			
		}else{
			vis($('#_yr').val());
		}
	        
	});	
	
	
	$('#_reset').on('click', function(event) {
	// reset
		var itt = $('#_doi').val();
	       console.log("itt : "+itt)
		
		d3.selectAll(".node").selectAll("circle")
			.attr("r", 5)
    		.style("fill", "9AFFF2");
		
	});	
	
	
	$('#search_id').on('click', function(event) {
	//	get_nbr($('#_doi').val(), $('#_pct').val()
    		
	       diff = {};
	       var itt = $('#_doi').val();
	       console.log("itt : "+itt)
	       
	       if( $('#_pct').val().length ==0 ){
	        	alert("empty pct");
	       
	       }else{
	       	       
	        var pct = parseInt($('#_pct').val()) ;  
	    	console.log("pct : "+pct)
	    	
	    	if(pct <=0 || pct>=100){
	    		alert("invalid pct");
	    	
	    	}else{
	    	
	    		if (itt in tx_){
	        
	        		var type =  $('#_sim').val();
	        		console.log("type : "+type)
	        	
	        		for (var key in tx_){
	        		
	        			var dx = 100, dy = 100;
	        		
	        			if(type==="title"){	        	
							
							dx = tx_[key] - tx_[itt];
            				dy =  ty_[key] - ty_[itt];
	        	
	        			}else if(type==="abstract"){
	        			
	        				dx = abx_[key] - abx_[itt];
            				dy =  aby_[key] - aby_[itt];

	        			}else{
	        				
	        				dx = kx_[key] - kx_[itt];
            				dy =  ky_[key] - ky_[itt];
	        			} 	       	       	
            	
            			diff[key]  = Math.sqrt(dx * dx + dy * dy);	
            				
					}   			

			
			
						var tuples = [];

						for (var key in diff) 
							tuples.push([key, diff[key]]);
			

						tuples.sort(function(a, b) {
    						a = a[1];
    						b = b[1];

    						return a < b ? -1 : (a > b ? 1 : 0);
						});

						var cnt = tuples.length * pct/100;
						
						hset = {};
			
						for (var i = 0; i < cnt; i++) {
							console.log("id : "+tuples[i][0])
							console.log("diff : "+tuples[i][1])
    						hset[tuples[i][0]] = 1; 
						}
			
						
				
						d3.selectAll(".node").selectAll("circle")
					
							.style("fill", function(d){
						
								if(d.name === itt){
									return "FF6D12";
								}else if (d.name in hset){
									
									if(type==="title"){
										return "#FFCC00";
										
									}else if(type==="abstract"){
										return "#E53B3B";
										
									}else{
										return "#AB8EFA";
									}
									
									
								
								}else{
									return "9AFFF2";
								}
							
							} )
					
							.attr("r", function(d){
						
								if(d.name === itt){
									return 11;
								}else if (d.name in hset){
									return 8;
								}else{
									return 5;
								}
							
							})
	        	    	    
	    			//draw bar chart-
	    			
	        
	        	}else{	        	
	        		alert("invalid id");
	        	}
	    	
	    	
	    	}	// end if pct <=0 || pct>=100
	    		
	       
	       
	       } // end if $('#_pct').val().length ==0
	       						        
	       
	});		//end search id
	




	});		//end d3.csv open file

}	// end vis_init




function vis(yrs){

	d3.csv("data1/"+yrs+".csv", function(error, links) {

		if(error) 
			alert("error !");
		
		d3.select("#main_svg").remove();

		var nodes = {};

		/////////////////////////////////////////////////////////////////

 	 	tx_ = {};
  	 	ty_ = {};
 	 	abx_ = {};
 	 	aby_ = {};
 	 	kx_ = {};
 	 	ky_ = {};
 	 	title_ = {};
  
  		// Compute the distinct nodes from the links.
		links.forEach(function(link) {
	
			title_[link.target] = link.title;
			
			tx_[link.target] = link.t_x;
			ty_[link.target] = link.t_y;
			
			abx_[link.target] = link.ab_x;
			aby_[link.target] = link.ab_y;
			
			kx_[link.target] = link.k_x;
			ky_[link.target] = link.k_y;
			
			
			link.source = nodes[link.source] || 
        	(nodes[link.source] = {name: link.source});
    		link.target = nodes[link.target] || 
        	(nodes[link.target] = {name: link.target});	
			
	});

  // use Jquery autocomplete
/*  ////////////////////////////////
  $( "#gene_search_box" ).autocomplete({
    source: 
  });
*/


////////////////////////////////////////////////////////////////////
		var width = 1100,
    		height = 900;

		var force = d3.layout.force()
    	.nodes(d3.values(nodes))
    	.links(links)
    	.size([width, height])
    	.linkDistance(11)
  	  	.charge(-100)
    	.on("tick", tick)
    	.start();
  
  

		// initailize clust_group with id clust_group
  		var svg = d3.select("#svg_div")
      		.append("svg")
      		.attr('id', 'main_svg')
     	 // the svg can be larger than the visualization - use svg_height and svg_width
     		 .attr("width",  width )
     		 .attr("height", height )
     		 .attr('border',1)
 		//     .call( zoom ) 
      		.append("g")
     		 .attr('id', 'clust_group')
	//  	   .attr("transform", "translate(" + (margin.left) + "," + (margin.top) + ")");


		// build the arrow.
		svg.append("svg:defs").selectAll("marker")
  	 	 	.data(["end"])      // Different link/path types can be defined here
 		 	.enter().append("svg:marker")    // This section adds in the arrows
  		  	.attr("id", String)
   		 	.attr("viewBox", "0 -5 10 10")
   		 	.attr("refX", 25)
    		.attr("refY", -1.5)
  		  	.attr("markerWidth", 7)
   		 	.attr("markerHeight", 7)
 	   		.attr("orient", "auto")
 			.append("svg:path")
  	  		.attr("d", "M0,-5L10,0L0,5");

		// add the links and the arrows
		var path = svg.append("svg:g").selectAll("path")
    		.data(force.links())
  			.enter().append("svg:path")
			//    .attr("class", function(d) { return "link " + d.type; })
  		  	.attr("class", "link")
    		.attr("marker-end", "url(#end)");

		// define the nodes
		var node = svg.selectAll(".node")
    		.data(force.nodes())
  			.enter().append("g")
    		.attr("class", "node")
    		.call(force.drag);

		// add the nodes
    	node.append("circle")
    		.attr("r", 5)
   		 	.style("fill", "9AFFF2")
    		
    		.on('click', function(d, i) {
				
				d3.select(this)
					.attr("r", 11)	
					.style("fill", "FF6D12");
			
				$('#_doi').val(d.name);
				$('#_t').val(title_[d.name]);
			
			})
		

    	.call(force.drag);
    	    	    	
    	

		// add the curvy lines
		function tick() {
    		path.attr("d", function(d) {
    	    	var dx = d.target.x - d.source.x,
        	    	dy = d.target.y - d.source.y,
            		dr = Math.sqrt(dx * dx + dy * dy);
        		return "M" + 
   		         	d.source.x + "," + 
        	    	d.source.y + "A" + 
            		dr + "," + dr + " 0 0,1 " + 
            		d.target.x + "," + 
            		d.target.y;
    	});

    	node.attr("transform", function(d) { 
  	    	return "translate(" + d.x + "," + d.y + ")"; });
		}


		$('#up').on('click', function(event) {
	        svg.attr( "transform","translate(0, -200)" );
		});	
	
		$('#down').on('click', function(event) {
	        svg.attr( "transform","translate(0, 200)" );
		});	
	
		$('#left').on('click', function(event) {
	        svg.attr( "transform","translate(-200, 0)" );
		});	
	
		$('#right').on('click', function(event) {
	        svg.attr( "transform","translate(200, 0)" );
		});	
	
	
		
		$('#search_yr').on('click', function(event) {
		//	"vis();"
			var yr = parseInt($('#_yr').val());
		
			if(yr<=2000 || yr>=2016){
				alert("invalid yr");			
			}else{
				vis($('#_yr').val());
			}	   	     
		});
		
			
		$('#_reset').on('click', function(event) {
		// reset
			d3.selectAll(".node").selectAll("circle")
				.attr("r", 5)
    			.style("fill", "9AFFF2");
		
		});	
	
	

		$('#search_id').on('click', function(event) {
		//	$('#_doi').val()	 $('#_pct').val()
    		
	       diff = {};
	       var itt = $('#_doi').val();
	       console.log("itt : "+itt)
	       
	       if( $('#_pct').val().length ==0 ){
	        	alert("empty pct");
	       
	       }else{
	       	       
	        var pct = parseInt($('#_pct').val()) ;  
	    	console.log("pct : "+pct)
	    	
	    	if(pct <=0 || pct>=100){
	    		alert("invalid pct");
	    	
	    	}else{
	    	
	    		if (itt in tx_){
	        
	        		var type =  $('#_sim').val();
	        		console.log("type : "+type)
	        	
	        		for (var key in tx_){
	        		
	        			var dx = 100, dy = 100;
	        		
	        			if(type==="title"){	        	
							
							dx = tx_[key] - tx_[itt];
            				dy =  ty_[key] - ty_[itt];
	        	
	        			}else if(type==="abstract"){
	        			
	        				dx = abx_[key] - abx_[itt];
            				dy =  aby_[key] - aby_[itt];

	        			}else{
	        				
	        				dx = kx_[key] - kx_[itt];
            				dy =  ky_[key] - ky_[itt];
	        			} 	       	       	
            	
            			diff[key]  = Math.sqrt(dx * dx + dy * dy);	
            				
					}   			

			
			
						var tuples = [];

						for (var key in diff) 
							tuples.push([key, diff[key]]);
			

						tuples.sort(function(a, b) {
    						a = a[1];
    						b = b[1];

    						return a < b ? -1 : (a > b ? 1 : 0);
						});

						var cnt = tuples.length * pct/100;
						
						hset = {};
			
						for (var i = 0; i < cnt; i++) {
							console.log("id : "+tuples[i][0])
							console.log("diff : "+tuples[i][1])
    						hset[tuples[i][0]] = 1; 
						}
			
						
				
						d3.selectAll(".node").selectAll("circle")
					
							.style("fill", function(d){
						
								if(d.name === itt){
									return "FF6D12";
								}else if (d.name in hset){
									
									if(type==="title"){
										return "#FFCC00";
										
									}else if(type==="abstract"){
										return "#E53B3B";
										
									}else{
										return "#AB8EFA";
									}
									
									
								
								}else{
									return "9AFFF2";
								}
							
							} )
					
							.attr("r", function(d){
						
								if(d.name === itt){
									return 11;
								}else if (d.name in hset){
									return 8;
								}else{
									return 5;
								}
							
							})
	        	    	    
	    			//draw bar chart-
	    			
	        
	        	}else{	        	
	        		alert("invalid id");
	        	}
	    	
	    	
	    	}	// end if pct <=0 || pct>=100
	    		
	       
	       
	       } // end if $('#_pct').val().length ==0
	       						        
	       
	});		//end search id
	
		
	
	
	});		//end d3 csv open file
}
	
