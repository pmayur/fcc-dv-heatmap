// Link for data about yearly global temperatures (1775 - 2015)
const DATA_SOURCE =
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

const COLORS = [
    "#ffffd9",
    "#edf8b1",
    "#c7e9b4",
    "#7fcdbb",
    "#41b6c4",
    "#1d91c0",
    "#225ea8",
    "#253494",
    "#081d58",
];

// Dimensions for graph
var margin = { top: 50, right: 0, bottom: 100, left: 30 },
    width = 960 - margin.left - margin.right,
    height = 430 - margin.top - margin.bottom,
    gridSize = Math.floor(width / 24),
    buckets = 9;

const dataHandler = (error, data) => {
    // get the from and to years of data available
    const DATE = {
        FROM: data[0].year,
        TO: data[data.length - 1].year,
    };

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

    // returns a color from the color array
    var colorScale = d3
        .scaleLinear()
        .domain([
            0,
            buckets - 1,
            d3.max(data, function (d) {
                return d.value;
            }),
        ])
        .range(COLORS);

    // create an svg element and append it to the dom
    var svg = d3
        .select("#root")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // create an x axis
    var x = d3
        .scaleTime()
        .range([0, width])
        .domain([new Date(`${DATE.FROM}`), new Date(`${DATE.TO}`)]);

    // Append X AXIS to svg element
    svg.append("g")
        .style("font-size", 15)
        .attr("transform", "translate(0," + height + ")")
        .attr("id", "x-axis")
        .call(
            d3
                .axisBottom(x)
                .ticks((DATE.TO - DATE.FROM) / 10)
                .tickSizeOuter(0)
        );

        var dayLabels = svg.selectAll(".dayLabel")
        .data(MONTHS)
        .enter().append("text")
          .text(function (d) { return d; })
          .attr("x", 0)
          .attr("y", function (d, i) { return i * gridSize; })
          .style("text-anchor", "end")
          .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
};

d3.json(DATA_SOURCE).then((data) => {
    dataHandler(null, data.monthlyVariance);
});
