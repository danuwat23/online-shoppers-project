/* =========================================================
   ONLINE SHOPPERS PURCHASING INTENTION
   INTERACTIVE DATA VISUALIZATION
   D3.js
========================================================= */


/* =========================================================
   DATA PATH
========================================================= */

const DATA_PATH =
    "../../data/cleaned/online_cleaned.csv";



/* =========================================================
   MONTH
========================================================= */

const monthOrder = [

    "Feb",
    "Mar",
    "May",
    "June",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"

];


const monthLabels = {

    Feb: "ก.พ.",
    Mar: "มี.ค.",
    May: "พ.ค.",
    June: "มิ.ย.",
    Jul: "ก.ค.",
    Aug: "ส.ค.",
    Sep: "ก.ย.",
    Oct: "ต.ค.",
    Nov: "พ.ย.",
    Dec: "ธ.ค."

};



/* =========================================================
   VISITOR
========================================================= */

const visitorLabels = {

    Returning_Visitor:
        "Returning Visitor",

    New_Visitor:
        "New Visitor",

    Other:
        "Other"

};



/* =========================================================
   GLOBAL
========================================================= */

let allData = [];

let filteredData = [];



/* =========================================================
   TOOLTIP
========================================================= */

const tooltip =
    d3.select("body")

        .append("div")

        .attr(
            "class",
            "tooltip"
        )

        .style(
            "opacity",
            0
        );



/* =========================================================
   LOAD DATA
========================================================= */

d3.csv(DATA_PATH)

    .then(function(raw) {


        allData =
            raw.map(function(d) {

                return {

                    ...d,

                    Administrative:
                        toNumber(
                            d.Administrative
                        ),

                    Administrative_Duration:
                        toNumber(
                            d.Administrative_Duration
                        ),

                    Informational:
                        toNumber(
                            d.Informational
                        ),

                    Informational_Duration:
                        toNumber(
                            d.Informational_Duration
                        ),

                    ProductRelated:
                        toNumber(
                            d.ProductRelated
                        ),

                    ProductRelated_Duration:
                        toNumber(
                            d.ProductRelated_Duration
                        ),

                    BounceRates:
                        toNumber(
                            d.BounceRates
                        ),

                    ExitRates:
                        toNumber(
                            d.ExitRates
                        ),

                    PageValues:
                        toNumber(
                            d.PageValues
                        ),

                    SpecialDay:
                        toNumber(
                            d.SpecialDay
                        ),

                    OperatingSystems:
                        toNumber(
                            d.OperatingSystems
                        ),

                    Browser:
                        toNumber(
                            d.Browser
                        ),

                    Region:
                        toNumber(
                            d.Region
                        ),

                    TrafficType:
                        toNumber(
                            d.TrafficType
                        ),

                    Weekend:
                        parseBoolean(
                            d.Weekend
                        ),

                    Revenue:
                        parseBoolean(
                            d.Revenue
                        )

                };

            });


        populateFilters();

        updateDashboard();


        setStatus(

            "โหลดข้อมูลสำเร็จ " +

            formatNumber(
                allData.length
            ) +

            " records"

        );


    })

    .catch(function(error) {


        console.error(error);


        setStatus(
            "ไม่สามารถโหลดข้อมูลได้ กรุณาตรวจสอบตำแหน่ง CSV"
        );


        d3.selectAll(".chart")

            .html(`

                <div class="empty">

                    ⚠️ ไม่สามารถโหลดข้อมูล CSV ได้

                    <br><br>

                    กรุณาตรวจสอบไฟล์

                    <br>

                    data/cleaned/online_cleaned.csv

                </div>

            `);

    });



/* =========================================================
   DATA HELPERS
========================================================= */

function toNumber(value) {

    const n =
        Number(value);

    return Number.isFinite(n)
        ? n
        : 0;

}


function parseBoolean(value) {

    return String(value)
        .trim()
        .toLowerCase()
        === "true";

}


function formatNumber(value) {

    return d3.format(",")(
        value || 0
    );

}


function formatPercent(value) {

    return (
        value || 0
    ).toFixed(2) + "%";

}



/* =========================================================
   FILTER
========================================================= */

function populateFilters() {


    const months =

        [...new Set(

            allData

                .map(
                    d => d.Month
                )

                .filter(Boolean)

        )]

        .sort(

            function(a, b) {

                return (

                    monthOrder.indexOf(a)

                    -

                    monthOrder.indexOf(b)

                );

            }

        );


    d3.select(
        "#monthFilter"
    )

        .selectAll(
            "option.filter-month"
        )

        .data(months)

        .join("option")

        .attr(
            "class",
            "filter-month"
        )

        .attr(
            "value",
            d => d
        )

        .text(
            d =>
                monthLabels[d] || d
        );



    const visitors =

        [...new Set(

            allData

                .map(
                    d =>
                        d.VisitorType
                )

                .filter(Boolean)

        )]

        .sort();


    d3.select(
        "#visitorFilter"
    )

        .selectAll(
            "option.filter-visitor"
        )

        .data(visitors)

        .join("option")

        .attr(
            "class",
            "filter-visitor"
        )

        .attr(
            "value",
            d => d
        )

        .text(

            d =>
                visitorLabels[d] || d

        );



    d3.selectAll(

        "#monthFilter," +

        "#visitorFilter," +

        "#revenueFilter"

    )

        .on(
            "change",
            updateDashboard
        );


    d3.select(
        "#resetBtn"
    )

        .on(
            "click",
            resetFilters
        );

}



/* =========================================================
   RESET
========================================================= */

function resetFilters() {


    d3.select(
        "#monthFilter"
    )
        .property(
            "value",
            "All"
        );


    d3.select(
        "#visitorFilter"
    )
        .property(
            "value",
            "All"
        );


    d3.select(
        "#revenueFilter"
    )
        .property(
            "value",
            "All"
        );


    updateDashboard();

}



/* =========================================================
   FILTER DATA
========================================================= */

function getFilteredData() {


    const month =

        d3.select(
            "#monthFilter"
        )
        .property(
            "value"
        );


    const visitor =

        d3.select(
            "#visitorFilter"
        )
        .property(
            "value"
        );


    const revenue =

        d3.select(
            "#revenueFilter"
        )
        .property(
            "value"
        );


    return allData.filter(

        function(d) {


            const monthOK =

                month === "All"

                ||

                d.Month === month;


            const visitorOK =

                visitor === "All"

                ||

                d.VisitorType === visitor;


            const revenueOK =

                revenue === "All"

                ||

                String(
                    d.Revenue
                ).toLowerCase()

                ===

                revenue;


            return (

                monthOK &&

                visitorOK &&

                revenueOK

            );

        }

    );

}



/* =========================================================
   UPDATE
========================================================= */

function updateDashboard() {


    filteredData =
        getFilteredData();


    updateKPI(
        filteredData
    );


    drawLineChart(
        filteredData
    );


    drawDonutChart(
        filteredData
    );


    drawVisitorChart(
        filteredData
    );


    drawWeekendChart(
        filteredData
    );


    drawTrafficChart(
        filteredData
    );

}



/* =========================================================
   KPI
========================================================= */

function updateKPI(data) {


    const sessions =
        data.length;


    const purchases =
        data.filter(
            d => d.Revenue
        ).length;


    const rate =

        sessions > 0

            ?

        (
            purchases /
            sessions
        ) * 100

            :

        0;


    const pageValue =

        d3.mean(
            data,
            d =>
                d.PageValues
        ) || 0;



    animateNumber(
        "#kpiSessions",
        sessions
    );


    animateNumber(
        "#kpiRevenue",
        purchases
    );


    animateText(
        "#kpiRate",
        formatPercent(rate)
    );


    animateText(
        "#kpiPageValue",
        pageValue.toFixed(2)
    );

}



/* =========================================================
   KPI ANIMATION
========================================================= */

function animateNumber(
    selector,
    value
) {


    const element =
        d3.select(
            selector
        );


    const old =
        Number(
            element.text()
                .replace(/,/g, "")
        ) || 0;


    element

        .transition()

        .duration(700)

        .tween(

            "text",

            function() {

                const interpolate =
                    d3.interpolateNumber(
                        old,
                        value
                    );


                return function(t) {

                    this.textContent =
                        formatNumber(
                            interpolate(t)
                        );

                };

            }

        );

}



function animateText(
    selector,
    value
) {


    d3.select(
        selector
    )

        .style(
            "opacity",
            0
        )

        .text(
            value
        )

        .transition()

        .duration(500)

        .style(
            "opacity",
            1
        );

}



/* =========================================================
   SVG
========================================================= */

function createSVG(

    selector,

    width = 620,

    height = 350,

    margin = {

        top: 30,

        right: 30,

        bottom: 75,

        left: 75

    }

) {


    d3.select(
        selector
    )
        .selectAll("*")
        .remove();


    const svg =

        d3.select(
            selector
        )

        .append("svg")

        .attr(
            "viewBox",
            `0 0 ${width} ${height}`
        )

        .attr(
            "preserveAspectRatio",
            "xMidYMid meet"
        );


    const innerWidth =

        width
        -
        margin.left
        -
        margin.right;


    const innerHeight =

        height
        -
        margin.top
        -
        margin.bottom;


    const g =

        svg.append("g")

        .attr(

            "transform",

            `translate(
                ${margin.left},
                ${margin.top}
            )`

        );


    return {

        svg,

        g,

        innerWidth,

        innerHeight

    };

}



/* =========================================================
   GRID
========================================================= */

function addGrid(
    g,
    scale,
    size
) {


    g.append("g")

        .attr(
            "class",
            "grid"
        )

        .call(

            d3.axisLeft(
                scale
            )

            .tickSize(
                -size
            )

            .tickFormat("")

        );

}



/* =========================================================
   AXIS TITLES
========================================================= */

function addAxisTitles(

    g,

    innerWidth,

    innerHeight,

    xTitle,

    yTitle

) {


    g.append("text")

        .attr(
            "class",
            "axis-title"
        )

        .attr(
            "x",
            innerWidth / 2
        )

        .attr(
            "y",
            innerHeight + 53
        )

        .attr(
            "text-anchor",
            "middle"
        )

        .text(
            xTitle
        );


    g.append("text")

        .attr(
            "class",
            "axis-title"
        )

        .attr(
            "transform",
            "rotate(-90)"
        )

        .attr(
            "x",
            -innerHeight / 2
        )

        .attr(
            "y",
            -52
        )

        .attr(
            "text-anchor",
            "middle"
        )

        .text(
            yTitle
        );

}



/* =========================================================
   DETAILS BOX
========================================================= */

function updateDetails(

    selector,

    chartType,

    xAxis,

    yAxis,

    total,

    description,

    extraHTML = ""

) {


    const box =
        d3.select(
            selector
        );


    box

        .style(
            "opacity",
            0
        )

        .html(`

            <div class="detail-title">

                <span>
                    📊
                </span>

                รายละเอียดข้อมูล

            </div>


            <div class="detail-grid">


                <div class="detail-item">

                    <span>
                        ประเภทกราฟ
                    </span>

                    <strong>
                        ${chartType}
                    </strong>

                </div>


                <div class="detail-item">

                    <span>
                        แกน X
                    </span>

                    <strong>
                        ${xAxis}
                    </strong>

                </div>


                <div class="detail-item">

                    <span>
                        แกน Y
                    </span>

                    <strong>
                        ${yAxis}
                    </strong>

                </div>


                <div class="detail-item">

                    <span>
                        จำนวนข้อมูล
                    </span>

                    <strong>
                        ${formatNumber(total)}
                    </strong>

                </div>


            </div>


            ${extraHTML}


            <div class="detail-description">

                <span>
                    💡
                </span>

                ${description}

            </div>

        `)

        .transition()

        .duration(600)

        .delay(150)

        .style(
            "opacity",
            1
        );

}



/* =========================================================
   LINE CHART
========================================================= */

function drawLineChart(data) {


    const {

        g,

        innerWidth,

        innerHeight

    } = createSVG(

        "#lineChart",

        620,

        350,

        {

            top: 30,

            right: 30,

            bottom: 75,

            left: 75

        }

    );


    const grouped =

        monthOrder

            .map(function(month) {

                return {

                    month,

                    value:

                        data.filter(

                            d =>
                                d.Month
                                ===
                                month

                        ).length

                };

            })

            .filter(
                d =>
                    d.value > 0
            );


    if (
        grouped.length === 0
    ) {

        showEmpty(
            "#lineChart"
        );

        updateDetails(

            "#lineDetails",

            "Line Chart",

            "เดือน",

            "จำนวน Sessions (ครั้ง)",

            0,

            "ไม่มีข้อมูลสำหรับตัวกรองที่เลือก"

        );

        return;

    }



    const x =

        d3.scalePoint()

            .domain(

                grouped.map(
                    d =>
                        d.month
                )

            )

            .range([
                0,
                innerWidth
            ])

            .padding(
                .35
            );


    const y =

        d3.scaleLinear()

            .domain([

                0,

                d3.max(
                    grouped,
                    d =>
                        d.value
                ) || 1

            ])

            .nice()

            .range([

                innerHeight,
                0

            ]);


    addGrid(
        g,
        y,
        innerWidth
    );


    g.append("g")

        .attr(
            "class",
            "axis"
        )

        .attr(

            "transform",

            `translate(
                0,
                ${innerHeight}
            )`

        )

        .call(

            d3.axisBottom(x)

                .tickFormat(

                    d =>
                        monthLabels[d]
                        || d

                )

        );


    g.append("g")

        .attr(
            "class",
            "axis"
        )

        .call(

            d3.axisLeft(y)

                .ticks(6)

                .tickFormat(
                    formatNumber
                )

        );


    addAxisTitles(

        g,

        innerWidth,

        innerHeight,

        "เดือน",

        "จำนวน Sessions (ครั้ง)"

    );



    /* AREA */

    const area =

        d3.area()

            .x(
                d =>
                    x(d.month)
            )

            .y0(
                innerHeight
            )

            .y1(
                d =>
                    y(d.value)
            )

            .curve(
                d3.curveMonotoneX
            );


    const areaPath =

        g.append("path")

            .datum(
                grouped
            )

            .attr(
                "class",
                "area"
            )

            .attr(
                "d",
                area
            )

            .style(
                "opacity",
                0
            );


    areaPath

        .transition()

        .duration(900)

        .style(
            "opacity",
            1
        );



    /* LINE */

    const line =

        d3.line()

            .x(
                d =>
                    x(d.month)
            )

            .y(
                d =>
                    y(d.value)
            )

            .curve(
                d3.curveMonotoneX
            );


    const path =

        g.append("path")

            .datum(
                grouped
            )

            .attr(
                "class",
                "main-line"
            )

            .attr(
                "d",
                line
            );


    const length =
        path.node()
            .getTotalLength();


    path

        .attr(
            "stroke-dasharray",
            length
        )

        .attr(
            "stroke-dashoffset",
            length
        )

        .transition()

        .duration(1200)

        .ease(
            d3.easeCubicOut
        )

        .attr(
            "stroke-dashoffset",
            0
        );



    /* DOTS */

    g.selectAll(
        ".line-dot"
    )

        .data(
            grouped
        )

        .join("circle")

        .attr(
            "class",
            "line-dot"
        )

        .attr(
            "cx",
            d =>
                x(d.month)
        )

        .attr(
            "cy",
            d =>
                y(d.value)
        )

        .attr(
            "r",
            0
        )

        .on(

            "mousemove",

            function(
                event,
                d
            ) {

                showTip(

                    event,

                    `

                    <b>
                    ${monthLabels[d.month]
                    || d.month}
                    </b>

                    <br>

                    Sessions:
                    ${formatNumber(
                        d.value
                    )}

                    `

                );

            }

        )

        .on(
            "mouseleave",
            hideTip
        )

        .transition()

        .delay(
            600
        )

        .duration(
            450
        )

        .attr(
            "r",
            5
        );



    /* VALUES */

    g.selectAll(
        ".line-value"
    )

        .data(
            grouped
        )

        .join("text")

        .attr(
            "class",
            "value-label"
        )

        .attr(
            "x",
            d =>
                x(d.month)
        )

        .attr(
            "y",
            d =>
                y(d.value) - 12
        )

        .attr(
            "text-anchor",
            "middle"
        )

        .style(
            "opacity",
            0
        )

        .text(

            d =>
                formatNumber(
                    d.value
                )

        )

        .transition()

        .delay(
            700
        )

        .duration(
            500
        )

        .style(
            "opacity",
            1
        );



    const max =
        grouped.reduce(

            (a,b) =>
                b.value > a.value
                    ? b
                    : a

        );


    const min =
        grouped.reduce(

            (a,b) =>
                b.value < a.value
                    ? b
                    : a

        );


    updateDetails(

        "#lineDetails",

        "Line Chart",

        "เดือน",

        "จำนวน Sessions (ครั้ง)",

        data.length,

        "กราฟนี้แสดงแนวโน้มจำนวนผู้เข้าชมเว็บไซต์ในแต่ละเดือน",

        `

        <div class="detail-highlight">

            <div>

                <span>
                    เดือนที่มี Sessions สูงสุด
                </span>

                <strong>
                    ${monthLabels[max.month]}
                </strong>

            </div>


            <div>

                <span>
                    จำนวนสูงสุด
                </span>

                <strong>
                    ${formatNumber(max.value)}
                </strong>

            </div>


            <div>

                <span>
                    จำนวนต่ำสุด
                </span>

                <strong>
                    ${formatNumber(min.value)}
                </strong>

            </div>

        </div>

        `

    );

}



/* =========================================================
   DONUT
========================================================= */

function drawDonutChart(data) {


    d3.select(
        "#donutChart"
    )
        .selectAll("*")
        .remove();


    const width = 620;

    const height = 350;

    const cx = 270;

    const cy = 165;

    const radius = 105;


    const svg =

        d3.select(
            "#donutChart"
        )

        .append("svg")

        .attr(
            "viewBox",
            `0 0 ${width} ${height}`
        )

        .attr(
            "preserveAspectRatio",
            "xMidYMid meet"
        );


    const values = [

        {

            key: "true",

            label: "ซื้อ",

            value:

                data.filter(
                    d =>
                        d.Revenue
                ).length

        },

        {

            key: "false",

            label: "ไม่ซื้อ",

            value:

                data.filter(
                    d =>
                        !d.Revenue
                ).length

        }

    ];


    const total =
        d3.sum(
            values,
            d =>
                d.value
        );


    if (
        total === 0
    ) {

        showEmpty(
            "#donutChart"
        );

        updateDetails(

            "#donutDetails",

            "Donut Chart",

            "ไม่มี",

            "ไม่มี",

            0,

            "ไม่มีข้อมูลสำหรับตัวกรองที่เลือก"

        );

        return;

    }



    const pie =

        d3.pie()

            .sort(null)

            .value(
                d =>
                    d.value
            );


    const arc =

        d3.arc()

            .innerRadius(62)

            .outerRadius(radius);


    const color =

        d3.scaleOrdinal()

            .domain([
                "true",
                "false"
            ])

            .range([
                "#2563df",
                "#e83f96"
            ]);


    const chart =

        svg.append("g")

            .attr(

                "transform",

                `translate(
                    ${cx},
                    ${cy}
                )`

            );



    const arcs =

        chart.selectAll("path")

            .data(
                pie(values)
            )

            .join("path")

            .attr(
                "fill",
                d =>
                    color(
                        d.data.key
                    )
            )

            .attr(
                "stroke",
                "#fff"
            )

            .attr(
                "stroke-width",
                3
            )

            .on(

                "mousemove",

                function(
                    event,
                    d
                ) {

                    const percent =

                        d.data.value
                        /
                        total
                        *
                        100;


                    showTip(

                        event,

                        `

                        <b>
                        ${d.data.label}
                        </b>

                        <br>

                        จำนวน:
                        ${formatNumber(
                            d.data.value
                        )}

                        <br>

                        สัดส่วน:
                        ${percent.toFixed(2)}%

                        `

                    );

                }

            )

            .on(
                "mouseleave",
                hideTip
            );



    /* DONUT ANIMATION */

    arcs

        .transition()

        .duration(1100)

        .attrTween(

            "d",

            function(d) {

                const interpolate =

                    d3.interpolate(

                        {
                            startAngle: 0,
                            endAngle: 0
                        },

                        d

                    );


                return function(t) {

                    return arc(
                        interpolate(t)
                    );

                };

            }

        );



    /* CENTER */

    chart.append("text")

        .attr(
            "class",
            "donut-total"
        )

        .attr(
            "text-anchor",
            "middle"
        )

        .attr(
            "dy",
            "-3"
        )

        .style(
            "opacity",
            0
        )

        .text(
            formatNumber(total)
        )

        .transition()

        .delay(700)

        .duration(500)

        .style(
            "opacity",
            1
        );


    chart.append("text")

        .attr(
            "class",
            "donut-center-label"
        )

        .attr(
            "text-anchor",
            "middle"
        )

        .attr(
            "dy",
            "20"
        )

        .text(
            "Sessions"
        );



    /* LEGEND */

    const legend =

        svg.append("g")

            .attr(
                "transform",
                "translate(445,105)"
            );


    values.forEach(

        function(d, i) {


            const row =

                legend.append("g")

                    .attr(

                        "transform",

                        `translate(
                            0,
                            ${i * 38}
                        )`

                    )

                    .style(
                        "opacity",
                        0
                    );


            row.append("rect")

                .attr(
                    "width",
                    14
                )

                .attr(
                    "height",
                    14
                )

                .attr(
                    "rx",
                    3
                )

                .attr(
                    "fill",
                    color(d.key)
                );


            row.append("text")

                .attr(
                    "x",
                    22
                )

                .attr(
                    "y",
                    12
                )

                .text(

                    `${d.label} ${formatNumber(
                        d.value
                    )}`

                );


            row

                .transition()

                .delay(
                    600 + i * 150
                )

                .duration(400)

                .style(
                    "opacity",
                    1
                );

        }

    );



    const purchase =
        values[0].value;


    const notPurchase =
        values[1].value;


    updateDetails(

        "#donutDetails",

        "Donut Chart",

        "ไม่มี",

        "ไม่มี",

        total,

        "กราฟนี้ใช้แสดงสัดส่วนระหว่างผู้ที่ซื้อสินค้าและผู้ที่ไม่ซื้อสินค้า",

        `

        <div class="detail-highlight">

            <div>

                <span>
                    ซื้อสินค้า
                </span>

                <strong>
                    ${formatNumber(purchase)}
                </strong>

                <small>
                    ${formatPercent(
                        purchase / total * 100
                    )}
                </small>

            </div>


            <div>

                <span>
                    ไม่ซื้อสินค้า
                </span>

                <strong>
                    ${formatNumber(notPurchase)}
                </strong>

                <small>
                    ${formatPercent(
                        notPurchase / total * 100
                    )}
                </small>

            </div>

        </div>

        `

    );

}



/* =========================================================
   VISITOR BAR
========================================================= */

function drawVisitorChart(data) {


    const {

        g,

        innerWidth,

        innerHeight

    } = createSVG(

        "#visitorChart",

        620,

        350,

        {

            top: 30,

            right: 30,

            bottom: 90,

            left: 75

        }

    );


    const categories = [

        "Returning_Visitor",

        "New_Visitor",

        "Other"

    ];


    const grouped =

        categories

            .map(function(key) {

                return {

                    key,

                    label:
                        visitorLabels[key]
                        || key,

                    value:

                        data.filter(

                            d =>

                                d.VisitorType
                                ===
                                key

                                &&

                                d.Revenue

                        ).length

                };

            })

            .filter(
                d =>
                    d.value > 0
            );


    if (
        grouped.length === 0
    ) {

        showEmpty(
            "#visitorChart"
        );

        updateDetails(

            "#visitorDetails",

            "Bar Chart",

            "ประเภทผู้เข้าชม",

            "จำนวนการซื้อ (Sessions)",

            0,

            "ไม่มีข้อมูลสำหรับตัวกรองที่เลือก"

        );

        return;

    }



    const x =

        d3.scaleBand()

            .domain(

                grouped.map(
                    d =>
                        d.key
                )

            )

            .range([
                0,
                innerWidth
            ])

            .padding(
                .28
            );


    const y =

        d3.scaleLinear()

            .domain([

                0,

                d3.max(
                    grouped,
                    d =>
                        d.value
                ) || 1

            ])

            .nice()

            .range([
                innerHeight,
                0
            ]);


    addGrid(
        g,
        y,
        innerWidth
    );


    g.append("g")

        .attr(
            "class",
            "axis"
        )

        .attr(

            "transform",

            `translate(
                0,
                ${innerHeight}
            )`

        )

        .call(

            d3.axisBottom(x)

                .tickFormat(

                    d =>
                        visitorLabels[d]
                        || d

                )

        )

        .selectAll("text")

        .attr(
            "transform",
            "rotate(-20)"
        )

        .style(
            "text-anchor",
            "end"
        );


    g.append("g")

        .attr(
            "class",
            "axis"
        )

        .call(

            d3.axisLeft(y)

                .ticks(6)

                .tickFormat(
                    formatNumber
                )

        );


    addAxisTitles(

        g,

        innerWidth,

        innerHeight,

        "ประเภทผู้เข้าชม",

        "จำนวนการซื้อ (Sessions)"

    );



    const bars =

        g.selectAll(
            ".visitor-bar"
        )

        .data(
            grouped
        )

        .join("rect")

        .attr(
            "class",
            "visitor-bar"
        )

        .attr(
            "x",
            d =>
                x(d.key)
        )

        .attr(
            "width",
            x.bandwidth()
        )

        .attr(
            "y",
            innerHeight
        )

        .attr(
            "height",
            0
        )

        .on(

            "mousemove",

            function(
                event,
                d
            ) {

                showTip(

                    event,

                    `

                    <b>
                    ${d.label}
                    </b>

                    <br>

                    ซื้อ:
                    ${formatNumber(d.value)}
                    sessions

                    `

                );

            }

        )

        .on(
            "mouseleave",
            hideTip
        );


    bars

        .transition()

        .duration(800)

        .delay(
            (d, i) =>
                i * 130
        )

        .attr(
            "y",
            d =>
                y(d.value)
        )

        .attr(

            "height",

            d =>
                innerHeight
                -
                y(d.value)

        );



    g.selectAll(
        ".visitor-value"
    )

        .data(
            grouped
        )

        .join("text")

        .attr(
            "class",
            "value-label"
        )

        .attr(

            "x",

            d =>
                x(d.key)
                +
                x.bandwidth() / 2

        )

        .attr(
            "y",
            d =>
                y(d.value) - 10
        )

        .attr(
            "text-anchor",
            "middle"
        )

        .style(
            "opacity",
            0
        )

        .text(

            d =>
                formatNumber(d.value)

        )

        .transition()

        .delay(700)

        .duration(500)

        .style(
            "opacity",
            1
        );



    const max =

        grouped.reduce(

            (a,b) =>
                b.value > a.value
                    ? b
                    : a

        );


    updateDetails(

        "#visitorDetails",

        "Bar Chart",

        "ประเภทผู้เข้าชม",

        "จำนวนการซื้อ (Sessions)",

        data.length,

        "กราฟนี้เปรียบเทียบจำนวนการซื้อสินค้าของผู้เข้าชมแต่ละประเภท",

        `

        <div class="detail-highlight">

            <div>

                <span>
                    ประเภทที่ซื้อมากที่สุด
                </span>

                <strong>
                    ${max.label}
                </strong>

            </div>


            <div>

                <span>
                    จำนวนการซื้อ
                </span>

                <strong>
                    ${formatNumber(max.value)}
                </strong>

            </div>

        </div>

        `

    );

}



/* =========================================================
   WEEKEND
========================================================= */

function drawWeekendChart(data) {


    const {

        g,

        innerWidth,

        innerHeight

    } = createSVG(

        "#weekendChart",

        620,

        350,

        {

            top: 30,

            right: 30,

            bottom: 75,

            left: 75

        }

    );


    const grouped = [

        {

            key:
                "weekday",

            label:
                "วันธรรมดา",

            value:

                data.filter(
                    d =>
                        !d.Weekend
                ).length

        },

        {

            key:
                "weekend",

            label:
                "วันหยุด",

            value:

                data.filter(
                    d =>
                        d.Weekend
                ).length

        }

    ];


    const x =

        d3.scaleBand()

            .domain(

                grouped.map(
                    d =>
                        d.key
                )

            )

            .range([
                0,
                innerWidth
            ])

            .padding(
                .3
            );


    const y =

        d3.scaleLinear()

            .domain([

                0,

                d3.max(
                    grouped,
                    d =>
                        d.value
                ) || 1

            ])

            .nice()

            .range([
                innerHeight,
                0
            ]);


    addGrid(
        g,
        y,
        innerWidth
    );


    g.append("g")

        .attr(
            "class",
            "axis"
        )

        .attr(

            "transform",

            `translate(
                0,
                ${innerHeight}
            )`

        )

        .call(

            d3.axisBottom(x)

                .tickFormat(

                    d => {

                        const item =
                            grouped.find(
                                x =>
                                    x.key
                                    ===
                                    d
                            );

                        return item
                            ? item.label
                            : d;

                    }

                )

        );


    g.append("g")

        .attr(
            "class",
            "axis"
        )

        .call(

            d3.axisLeft(y)

                .ticks(6)

                .tickFormat(
                    formatNumber
                )

        );


    addAxisTitles(

        g,

        innerWidth,

        innerHeight,

        "ประเภทวัน",

        "จำนวน Sessions (ครั้ง)"

    );



    const bars =

        g.selectAll(
            ".weekend-bar"
        )

        .data(
            grouped
        )

        .join("rect")

        .attr(
            "class",
            "weekend-bar"
        )

        .attr(
            "x",
            d =>
                x(d.key)
        )

        .attr(
            "width",
            x.bandwidth()
        )

        .attr(
            "y",
            innerHeight
        )

        .attr(
            "height",
            0
        )

        .on(

            "mousemove",

            function(
                event,
                d
            ) {

                showTip(

                    event,

                    `

                    <b>
                    ${d.label}
                    </b>

                    <br>

                    Sessions:
                    ${formatNumber(d.value)}

                    `

                );

            }

        )

        .on(
            "mouseleave",
            hideTip
        );


    bars

        .transition()

        .duration(850)

        .delay(
            (d,i) =>
                i * 160
        )

        .attr(
            "y",
            d =>
                y(d.value)
        )

        .attr(
            "height",
            d =>
                innerHeight
                -
                y(d.value)
        );



    g.selectAll(
        ".weekend-value"
    )

        .data(
            grouped
        )

        .join("text")

        .attr(
            "class",
            "value-label"
        )

        .attr(

            "x",

            d =>
                x(d.key)
                +
                x.bandwidth() / 2

        )

        .attr(
            "y",
            d =>
                y(d.value) - 10
        )

        .attr(
            "text-anchor",
            "middle"
        )

        .style(
            "opacity",
            0
        )

        .text(
            d =>
                formatNumber(d.value)
        )

        .transition()

        .delay(700)

        .duration(500)

        .style(
            "opacity",
            1
        );



    const weekday =
        grouped[0].value;


    const weekend =
        grouped[1].value;


    updateDetails(

        "#weekendDetails",

        "Bar Chart",

        "ประเภทวัน",

        "จำนวน Sessions (ครั้ง)",

        data.length,

        "กราฟนี้เปรียบเทียบจำนวน Sessions ระหว่างวันธรรมดาและวันหยุด",

        `

        <div class="detail-highlight">

            <div>

                <span>
                    วันธรรมดา
                </span>

                <strong>
                    ${formatNumber(weekday)}
                </strong>

            </div>


            <div>

                <span>
                    วันหยุด
                </span>

                <strong>
                    ${formatNumber(weekend)}
                </strong>

            </div>

        </div>

        `

    );

}



/* =========================================================
   TRAFFIC
========================================================= */

function drawTrafficChart(data) {


    const {

        g,

        innerWidth,

        innerHeight

    } = createSVG(

        "#trafficChart",

        1100,

        480,

        {

            top: 30,

            right: 70,

            bottom: 75,

            left: 115

        }

    );


    const grouped =

        d3.rollups(

            data,

            rows =>
                rows.length,

            d =>
                d.TrafficType

        )

        .map(

            function([
                key,
                value
            ]) {

                return {

                    key:
                        String(key),

                    value

                };

            }

        )

        .sort(

            function(a,b) {

                return d3.descending(
                    a.value,
                    b.value
                );

            }

        )

        .slice(
            0,
            10
        )

        .reverse();



    if (
        grouped.length === 0
    ) {

        showEmpty(
            "#trafficChart"
        );

        updateDetails(

            "#trafficDetails",

            "Horizontal Bar Chart",

            "จำนวน Sessions (ครั้ง)",

            "Traffic Type",

            0,

            "ไม่มีข้อมูลสำหรับตัวกรองที่เลือก"

        );

        return;

    }



    const x =

        d3.scaleLinear()

            .domain([

                0,

                d3.max(
                    grouped,
                    d =>
                        d.value
                ) || 1

            ])

            .nice()

            .range([
                0,
                innerWidth
            ]);


    const y =

        d3.scaleBand()

            .domain(

                grouped.map(
                    d =>
                        d.key
                )

            )

            .range([
                innerHeight,
                0
            ])

            .padding(
                .22
            );



    g.append("g")

        .attr(
            "class",
            "grid"
        )

        .attr(
            "transform",
            `translate(0,${innerHeight})`
        )

        .call(

            d3.axisBottom(x)

                .tickSize(
                    -innerHeight
                )

                .tickFormat("")

        );


    g.append("g")

        .attr(
            "class",
            "axis"
        )

        .call(

            d3.axisLeft(y)

                .tickFormat(
                    d =>
                        `Traffic ${d}`
                )

        );


    g.append("g")

        .attr(
            "class",
            "axis"
        )

        .attr(

            "transform",

            `translate(
                0,
                ${innerHeight}
            )`

        )

        .call(

            d3.axisBottom(x)

                .ticks(7)

                .tickFormat(
                    formatNumber
                )

        );



    g.append("text")

        .attr(
            "class",
            "axis-title"
        )

        .attr(
            "x",
            innerWidth / 2
        )

        .attr(
            "y",
            innerHeight + 53
        )

        .attr(
            "text-anchor",
            "middle"
        )

        .text(
            "จำนวน Sessions (ครั้ง)"
        );


    g.append("text")

        .attr(
            "class",
            "axis-title"
        )

        .attr(
            "transform",
            "rotate(-90)"
        )

        .attr(
            "x",
            -innerHeight / 2
        )

        .attr(
            "y",
            -85
        )

        .attr(
            "text-anchor",
            "middle"
        )

        .text(
            "Traffic Type"
        );



    const bars =

        g.selectAll(
            ".traffic-bar"
        )

        .data(
            grouped
        )

        .join("rect")

        .attr(
            "class",
            "traffic-bar"
        )

        .attr(
            "x",
            0
        )

        .attr(
            "y",
            d =>
                y(d.key)
        )

        .attr(
            "height",
            y.bandwidth()
        )

        .attr(
            "width",
            0
        )

        .on(

            "mousemove",

            function(
                event,
                d
            ) {

                showTip(

                    event,

                    `

                    <b>
                    Traffic Type ${d.key}
                    </b>

                    <br>

                    Sessions:
                    ${formatNumber(d.value)}

                    `

                );

            }

        )

        .on(
            "mouseleave",
            hideTip
        );


    bars

        .transition()

        .duration(900)

        .delay(
            (d,i) =>
                i * 70
        )

        .attr(
            "width",
            d =>
                x(d.value)
        );



    g.selectAll(
        ".traffic-value"
    )

        .data(
            grouped
        )

        .join("text")

        .attr(
            "class",
            "value-label"
        )

        .attr(
            "x",
            d =>
                x(d.value) + 8
        )

        .attr(

            "y",

            d =>
                y(d.key)
                +
                y.bandwidth() / 2
                +
                4

        )

        .style(
            "opacity",
            0
        )

        .text(
            d =>
                formatNumber(d.value)
        )

        .transition()

        .delay(850)

        .duration(450)

        .style(
            "opacity",
            1
        );



    const highest =

        grouped.reduce(

            (a,b) =>
                b.value > a.value
                    ? b
                    : a

        );


    updateDetails(

        "#trafficDetails",

        "Horizontal Bar Chart",

        "จำนวน Sessions (ครั้ง)",

        "Traffic Type",

        data.length,

        "กราฟนี้แสดง Traffic Type ที่มีจำนวน Sessions สูงสุด 10 อันดับแรก",

        `

        <div class="detail-highlight">

            <div>

                <span>
                    Traffic Type สูงสุด
                </span>

                <strong>
                    Traffic ${highest.key}
                </strong>

            </div>


            <div>

                <span>
                    Sessions
                </span>

                <strong>
                    ${formatNumber(
                        highest.value
                    )}
                </strong>

            </div>

        </div>

        `

    );

}



/* =========================================================
   EMPTY
========================================================= */

function showEmpty(selector) {


    d3.select(
        selector
    )

        .html(`

            <div class="empty">

                <div class="empty-icon">
                    📭
                </div>

                ไม่มีข้อมูล
                สำหรับตัวกรองที่เลือก

            </div>

        `);

}



/* =========================================================
   TOOLTIP
========================================================= */

function showTip(
    event,
    html
) {


    tooltip

        .style(
            "opacity",
            1
        )

        .html(
            html
        )

        .style(
            "left",
            `${event.clientX + 14}px`
        )

        .style(
            "top",
            `${event.clientY + 14}px`
        );

}


function hideTip() {

    tooltip

        .style(
            "opacity",
            0
        );

}



/* =========================================================
   STATUS
========================================================= */

function setStatus(text) {

    d3.select(
        "#status"
    )
        .text(
            text
        );

}