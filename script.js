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

// Dimensions for graph
var margin = { top: 30, right: 30, bottom: 30, left: 60 },
    width = 1200 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

// append an svg object to the body of the page
var svg = d3
    .select("#root")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json(DATA_SOURCE).then((data) => {
    // data format contains { baseVariance, monthlyVariance}
    // monthlyVariance, contains array of { year, month, variance}

    // get the from and to years of data available
    const DATE = {
        FROM: data.monthlyVariance[0].year,
        TO: data.monthlyVariance[data.monthlyVariance.length - 1].year,
    };

    /* =========================== X AXIS ============================ */
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

    /* =========================== Y AXIS ============================ */
    var y = d3.scaleBand().range([height, 0]).domain(MONTHS.reverse());

    // Append Y AXIS to the svg element
    svg.append("g")
        .attr("id", "y-axis")
        .call(d3.axisLeft(y).tickSizeOuter(0));
});
