export default function StackedAreaChart(container) {
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


    let selected = null, xDomain, data;

    svg.append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)// the size of clip-path is the same as
    .attr("height", height); // the chart area

    
	function update(_data){
        	// update scales, encodings, axes (use the total count)
            data = _data;
            let keys = selected? [selected] : data.columns.slice(1)
            console.log("THE KEYS ARE",keys)
            var stack = d3.stack()
                            .keys(keys)
                            .order(d3.stackOrderNone)
                            .offset(d3.stackOffsetNone);

            var series = stack(data);
            //console.log("THE SERIES IS",series)

            console.log("THE XDOMAIN IS",xDomain)
            console.log("THE DATA IS",data)
            xScale.domain(xDomain? xDomain:d3.extent(data, d => d.date))
            yScale.domain([0, d3.max(series, d => d3.max(d, d => d[1]))]).nice()
            color.domain(keys)


            const toolTip = svg.append("text")
                            .attr("class", "tooltip")
                            .attr("dx", 10)
        
            let area = d3.area()
                .x(d => xScale(d.data.date))
                .y0(d => yScale(d[0]))
                .y1(d => yScale(d[1]))
        
            console.log(yScale(0))
            svg.selectAll("path")
                .remove()
            svg.selectAll(".tooltip")
                .text("")
            //Create areas
            svg.selectAll(".stack-area-path")
                .data(series)
                .join("path")
                    .attr("fill", ({key}) => color(key))
                    .attr("d", area)
                    .attr("clip-path", "url(#clip)")
                .on("mouseover", (event, d, i) => 
                                {
                                    toolTip.text(d["key"])
                                })
                .on("mouseout", (event, d, i) => 
                                {
                                    toolTip.text(d["key"])
                                })
                .on("click", (event, d) => 
                                {
                                    // toggle selected based on d.key
                                    if (selected === d.key) {
                                    selected = null;
                                    } else {
                                        selected = d.key;
                                    }
                                    update(data); // simply update the chart again
                                })
                
        
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
    function filterByDate(range){
		xDomain = range;  // -- (3)
		update(data); // -- (4)
	}
	return {
		update,
        filterByDate
	}
}