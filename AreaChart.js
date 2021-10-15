// input: selector for a chart container e.g., ".chart"
export default function AreaChart(container){

	// initialization
    const thingy = d3.select("body")
                .append('div')
                .attr('class', container.substring(1))


    const outerWidth = 800;
    const outerHeight = 200;

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

    const listeners = { brushed: null };
    const brush = d3.brushX()
                .extent([[0, 0.5], [width, height - margin.bottom + 0.5]])
                .on("brush", brushed)
                .on("end", brushended);
        
    const gb = svg.append("g").attr('class', 'brush').call(brush);
          
    function brushed(event) {
        if (event.selection) {
            console.log("brushed", event.selection);
            listeners["brushed"](event.selection.map(xScale.invert));
        }
    }
          
    function brushended({selection}) {
        if (!selection) {
            listeners["brushed"](null);
        }
    }
        
            // function brushended(event) {
            //     const selection = event.selection;
            //     if (!event.sourceEvent || !selection) return;
            //     const [x0, x1] = selection.map(d => interval.round(x.invert(d)));
            //     d3.select(this).transition().call(brush.move, x1 > x0 ? [x0, x1].map(x) : null);
            // }

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

        let area = d3.area()
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
    function on(event, listener) {
		listeners[event] = listener;
    }

	return {
		update, // ES6 shorthand for "update": update
        on
	};
}