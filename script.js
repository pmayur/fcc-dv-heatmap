// Link for data about yearly global temperatures (1775 - 2015)
const DATA_SOURCE =
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const COLORS = ["#adce74", "#61b15a", "#d08752", "#c75643"];

// Dimensions for graph
var margin = { top: 30, right: 30, bottom: 30, left: 60 },
    width = 1200 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom,
    buckets = 4,
    legendHeight = 120,
    legendWidth = width + margin.left + margin.right;

// append an svg object to the body of the page
var svg = d3
    .select("#root")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom + legendHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json(DATA_SOURCE).then((data) => {
    // data format contains { baseTemperature, monthlyVariance}
    // monthlyVariance, contains array of { year, month, variance}

    // stores the base temperature upon which the temperature varies
    const BASE_TEMP = data.baseTemperature;

    // stores the minimum and maximum temperature variance in the dataset
    var TEMP = {
        MIN: data.monthlyVariance[0].variance,
        MAX: data.monthlyVariance[0].variance,
    };

    // returns a color from the color array
    var colorScale = d3
        .scaleQuantize()
        .domain([0, buckets - 1])
        .range(COLORS);

    // X Axis
    var x = d3
        .scaleBand()
        .range([0, width])
        .domain(
            data.monthlyVariance.map(function (val) {
                if (val.variance > TEMP.MAX) {
                    TEMP.MAX = val.variance;
                }
                if (val.variance < TEMP.MIN) {
                    TEMP.MIN = val.variance;
                }

                return val.year;
            })
        )
        .padding(0.1);

    // Append X AXIS to svg element
    svg.append("g")
        .style("font-size", 15)
        .attr("transform", "translate(0," + height + ")")
        .attr("id", "x-axis")
        .call(
            d3
                .axisBottom(x)
                .tickValues(
                    x.domain().filter(function (year) {
                        // set ticks to years divisible by 10
                        return year % 10 === 0;
                    })
                )
                .tickSizeOuter(0)
                .tickFormat((y) => d3.timeFormat("%Y")(new Date(`${y}`)))
        );

    // Y Axis
    var y = d3.scaleBand().range([height, 0]).domain(MONTHS.reverse());

    // Append Y AXIS to the svg element
    svg.append("g").attr("id", "y-axis").call(d3.axisLeft(y).tickSizeOuter(0));

    // the heatmap for the variance
    svg.selectAll(".map")
        .data(data.monthlyVariance)
        .enter()
        .append("rect")
        .attr("x", (d) => x(d.year))
        .attr("y", (d) => y(MONTHS[11 - (d.month - 1)]))
        .attr("data-month", (d) => d.month - 1)
        .attr("data-year", (d) => d.year)
        .attr("data-temp", (d) => d.variance)
        .attr("class", "cell")
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .style("fill", COLORS[0])
        .style("fill", function (d) {
            return colorScale(d.variance);
        })
        .on("mouseover", function (d) {
            let month = d.srcElement.getAttribute("data-month");
            let year = d.srcElement.getAttribute("data-year");
            let value = d.srcElement.getAttribute("data-temp");

            tooltip.attr("data-year", year);

            tooltip
                .html(
                    MONTHS[parseInt(11 - month)] +
                        "  " +
                        year +
                        "<br/>" +
                        "Base Variance: " + BASE_TEMP +
                        "<br/>" +
                        "Variance: " + value 
                )
                .style("left", d.pageX + "px")
                .style("top", d.pageY - 28 + "px");

            tooltip.transition().duration(200).style("opacity", 0.9);
        })
        .on("mouseout", function (d) {
            tooltip.transition().duration(500).style("opacity", 0);
        });

    // creates an array for legend axis
    legendArray = createLegendArray(TEMP.MIN, TEMP.MAX, BASE_TEMP);

    // legend axis
    var legend = d3
        .scaleBand()
        .range([0, width / 3])
        .domain(legendArray)
        .round(0.1);

    // append legend axis
    svg.append("g")
        .style("font-size", 15)
        .attr(
            "transform",
            "translate(" + 0 + "," + (height + legendHeight) + ")"
        )
        .call(d3.axisBottom(legend));

    // create legend box
    var legendSVG = svg
        .append("g")
        .classed("legend", true)
        .attr("id", "legend")
        .attr("transform", "translate(" + 0 + "," + (height + 50) + ")");

    // add rect elements to legend box
    legendSVG
        .append("g")
        .selectAll("rect")
        .data(legendArray)
        .enter()
        .append("rect")
        .style("fill", function (d, i) {
            if (i < 4) return COLORS[i];
            else return "#ffffff";
        })
        .attr("x", (d) => legend(d) + 37)
        .attr("y", 35)
        .attr("width", legend.bandwidth())
        .attr("height", 20);

    // append legend box to the map
    legendSVG
        .append("g")
        .attr(
            "transform",
            "translate(" + height + "," + (legendHeight - 30) + ")"
        )
        .call(legend);

    var tooltip = d3
        .select("#root")
        .append("div")
        .attr("id", "tooltip")
        .style("opacity", 0);
});

// converts and returns float to a precision of 2
const preciseFLoat = (flt) => {
    return parseFloat(flt.toFixed(2));
};

// creates an array from min to max values
const createLegendArray = (min, max, base) => {
    let minVal = preciseFLoat(min + base);
    let maxVal = preciseFLoat(max + base);

    var legendArray = [minVal];
    var start = minVal;

    while (start < maxVal) {
        start += (maxVal - minVal) / 4;
        legendArray.push(preciseFLoat(start));
    }

    return legendArray;
};
