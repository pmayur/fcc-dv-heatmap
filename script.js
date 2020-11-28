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
    buckets = 4;

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

    // returns a color from the color array
    var colorScale = d3
        .scaleLinear()
        .domain([
            0,
            buckets - 1,
            d3.max(data.monthlyVariance, function (d) {
                return d.variance;
            }),
        ])
        .range(COLORS);

    /* =========================== X AXIS ============================ */
    var x = d3
        .scaleBand()
        .range([0, width])
        .domain(
            data.monthlyVariance.map(function (val) {
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

    /* =========================== Y AXIS ============================ */
    var y = d3.scaleBand().range([height, 0]).domain(MONTHS.reverse());

    // Append Y AXIS to the svg element
    svg.append("g").attr("id", "y-axis").call(d3.axisLeft(y).tickSizeOuter(0));

    svg.selectAll(".hour")
        .data(data.monthlyVariance)
        .enter()
        .append("rect")
        .attr("x", (d) => x(d.year))
        .attr("y", (d) => y(MONTHS[d.month - 1]))
        .attr("class", "hour bordered")
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .style("fill", COLORS[0])
        .style("fill", function (d) {
            return colorScale(d.variance);
        });
});
