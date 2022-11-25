/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 1 - Star Break Coffee
*/
class ChartController {


	constructor(elementSelector, MARGIN, WIDTH, HEIGHT) {
		this.MARGIN = MARGIN
		this.WIDTH = WIDTH
		this.HEIGHT = HEIGHT
		this.svg = d3.select(elementSelector).append("svg")
			.attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
			.attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
		this.g = this.svg.append("g")
			.attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)
		this._addName()
		this._addAxis()
	}

	_addName(youName = "Sakonnapat Whungsestakoun 6404062630180 sec2") {
		this.g.append("text")
			.attr("x", WIDTH / 2)
			.attr("y", HEIGHT + 75)
			.attr("font-size", "15px")
			.attr("text-anchor", "middle")
			.text(youName)
			.attr("fill", "Blue")
	}

	_addAxis() {
		// X label
		this.g.append("text")
			.attr("class", "x axis-label")
			.attr("x", WIDTH / 2)
			.attr("y", HEIGHT + 60)
			.attr("font-size", "20px")
			.attr("text-anchor", "middle")
			.text("month")

		// Y label
		this.g.append("text")
			.attr("class", "y axis-label")
			.attr("x", - (HEIGHT / 2))
			.attr("y", -80)
			.attr("font-size", "20px")
			.attr("text-anchor", "middle")
			.attr("transform", "rotate(-90)")
			.text("Receipts (baht)")

	}
	setData(data, shape) {
		data.forEach(d => {
			d.revenue = Number(d.revenue)
		})

		const x = d3.scaleBand()
			.domain(data.map(d => d.month))
			.range([0, WIDTH])
			.paddingInner(0.3)
			.paddingOuter(0.2)

		const y = d3.scaleLinear()
			.domain([0, d3.max(data, d => d.revenue)])
			.range([HEIGHT, 0])

		const xAxisCall = d3.axisBottom(x)
		this.g.append("g")
			.attr("class", "x axis")
			.attr("transform", `translate(0, ${HEIGHT})`)
			.call(xAxisCall)
			.selectAll("text")
			.attr("y", "10")
			.attr("x", "-5")
			.attr("text-anchor", "end")
			.attr("transform", "rotate(-40)")

		const yAxisCall = d3.axisLeft(y)
			.ticks(3)
			.tickFormat(d => d + "Baht")
		this.g.append("g")
			.attr("class", "y axis")
			.call(yAxisCall)

		const rects = this.g.selectAll(shape)
			.data(data)

		const color = d3.scaleOrdinal()
			.domain(data.map(d => d.revenue))
			.range(d3.schemePastel1)

		if (shape == "rect") {
			rects.enter().append("rect")
				.attr("y", d => y(d.revenue))
				.attr("x", (d) => x(d.month))
				.attr("width", x.bandwidth)
				.attr("height", d => HEIGHT - y(d.revenue))
				.attr("fill", d => color(d.month))
		}
		else {
			rects.enter().append(shape)
				.attr("cy", d => y(d.revenue))
				.attr("cx", (d) => x(d.month))
				.attr("r", "10")
				.attr("fill", d => color(d.revenue))
		}
	}
}

const MARGIN = {LEFT: 100, RIGHT: 10, TOP: 20, BOTTOM: 100}
const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM

const test = new ChartController("#chart-area", MARGIN, WIDTH, HEIGHT)
const test2 = new ChartController("#chart-area2", MARGIN, WIDTH, HEIGHT)

d3.csv("data/revenues.csv").then(data => {
	test.setData(data, "rect")
	test2.setData(data, "circle")
})
