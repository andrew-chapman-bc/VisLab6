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
   const areaChart1 = AreaChart(".chart-container1");

    areaChart1.update(data);
    const areaChart2 = StackedAreaChart(".chart-container2");

    areaChart2.update(data);

    areaChart1.on("brushed", (range)=>{
        areaChart2.filterByDate(range); // coordinating with stackedAreaChart
    })
});








