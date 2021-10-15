d3.csv('unemployment.csv', d3.autoType).then(data=>{
    console.log('in the function: ', data);
    data.forEach(function(d) {
        temp = 0
        console.log('yeet');
        for (const key in d) {
            if(key == 'date') {
                continue
            }
            temp += d[key]
        }
        d.total = temp
   });
   console.log('should have total: ', data);
   const areaChart1 = AreaChart(".chart-container1");

    areaChart1.update(data);
    const areaChart2 = StackedAreaChart(".chart-container2");

    areaChart2.update(data);
});


// input: selector for a chart container e.g., ".chart"
function AreaChart(container){

	// initialization
    const thingy = d3.select("body")
                .append('div')
                .attr('class', container.substring(1))

    const outerWidth = 800;
    const outerHeight = 500;

    const margin = {top:40, left:40, bottom:25, right:25};
    const width = outerWidth - margin.left - margin.right;
    const height = outerHeight - margin.top - margin.bottom;
    const svg = d3.select(container)
                .append('svg')
                .attr('width', outerWidth)
                .attr('height', outerHeight)
                .append('g')
                .attr('transform', `translate(${margin.left}, ${margin.top})`);

    let xScale = d3.scaleTime()
                .rangeRound([0, width])
                //.paddingInner(0.1)

    let yScale = d3.scaleLinear()
                .range([height,0]); 

    svg.append("path")
        .attr('class', 'area-path')

    svg.append('g')
        .attr('class', 'axis-y-axis')

    svg.append('g')
        .attr('class', 'axis-x-axis')

    svg.append("text")
        .attr("class", "y-axis-title")

    

	function update(data){ 

		// update scales, encodings, axes (use the total count)
        xScale.domain(d3.extent(data, d => d.date))
    
        yScale.domain([0, d3.max(data, d => d.total)]).nice()

        area = d3.area()
				.x(function(d) { return xScale(d.date); })
				.y0(function(d) { return yScale(0); })
				.y1(function(d) { return yScale(d.total); });

        console.log(yScale(0))
        //Create areas
		svg.select(".area-path")
            .datum(data)
            .attr("d", area);

        //Scales 
        let totalExtent = d3.extent(data, d => d.total)

        console.log(data, totalExtent)
    


        const xAxis = d3.axisBottom()
                        .scale(xScale)

        const yAxis = d3.axisLeft()
                        .scale(yScale)

        svg.select(".axis-x-axis")
            .call(xAxis)
            .attr("transform", `translate(0, ${height})`)
                
        svg.select(".axis-y-axis")
            .call(yAxis)
		
	}

	return {
		update // ES6 shorthand for "update": update
	};
}


function StackedAreaChart(container) {
    const thingy = d3.select("body")
                .append('div')
                .attr('class', container.substring(1))
	// initialization

    const outerWidth = 800;
    const outerHeight = 500;

    const margin = {top:40, left:40, bottom:25, right:25};
    const width = outerWidth - margin.left - margin.right;
    const height = outerHeight - margin.top - margin.bottom;
    const svg = d3.select(container)
                .append('svg')
                .attr('width', outerWidth)
                .attr('height', outerHeight)
                .append('g')
                .attr('transform', `translate(${margin.left}, ${margin.top})`);

    let xScale = d3.scaleTime()
                .rangeRound([0, width])
                //.paddingInner(0.1)

    let yScale = d3.scaleLinear()
                .range([height,0]); 
            
    let color = d3.scaleOrdinal(d3.schemeTableau10)

    svg.append("path")
        .attr('class', 'stack-area-path')

    svg.append('g')
        .attr('class', 'axis-y-axis')

    svg.append('g')
        .attr('class', 'axis-x-axis')

    svg.append("text")
        .attr("class", "y-axis-title")


    
	function update(data){
        	// update scales, encodings, axes (use the total count)
            let keys = data.columns.slice(1)
            console.log("THE KEYS ARE",keys)
            var stack = d3.stack()
                            .keys(keys)
                            .order(d3.stackOrderNone)
                            .offset(d3.stackOffsetNone);

            var series = stack(data);
            console.log("THE SERIES IS",series)

            xScale.domain(d3.extent(data, d => d.date))
            yScale.domain([0, d3.max(series, d => d3.max(d, d => d[1]))]).nice()
            color.domain(keys)


            const toolTip = svg.append("text")
                            .attr("class", "tooltip")
                            .attr("dx", 10)
        
            area = d3.area()
                .x(d => xScale(d.data.date))
                .y0(d => yScale(d[0]))
                .y1(d => yScale(d[1]))
        
            console.log(yScale(0))
            //Create areas
            svg.selectAll(".stack-area-path")
                .data(series)
                .join("path")
                    .attr("fill", ({key}) => color(key))
                    .attr("d", area)
                .on("mouseover", (event, d, i) => 
                                {
                                    toolTip.text(d["key"])
                                })
                .on("mouseout", (event, d, i) => 
                                {
                                    toolTip.text(d["key"])
                                })
                //.append("title")
                //    .text(({key}) => key);
        
            //Scales 
            let totalExtent = d3.extent(data, d => d.total)
        
            console.log(data, totalExtent)
            
        
        
            const xAxis = d3.axisBottom()
                            .scale(xScale)
        
            const yAxis = d3.axisLeft()
                            .scale(yScale)
    
            svg.select(".axis-x-axis")
                .call(xAxis)
                .attr("transform", `translate(0, ${height})`)
                        
            svg.select(".axis-y-axis")
                .call(yAxis)

            

	}
	return {
		update
	}
}


