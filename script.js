import AreaChart from './AreaChart.js';
import StackedAreaChart from './StackedAreaChart.js'; 


d3.csv('unemployment.csv', d3.autoType).then(data=>{
    console.log('in the function: ', data);
    data.forEach(function(d) {
        let temp = 0
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
   
    const stackedAreaChart = StackedAreaChart(".chart-container2");
    stackedAreaChart.update(data);

    const areaChart = AreaChart(".chart-container1");
    areaChart.update(data);

    areaChart.on("brushed", (range)=>{
        stackedAreaChart.filterByDate(range); // coordinating with stackedAreaChart
    })
});








