// Система отступов для d3
var margin = {top: 50, right: 30, bottom: 30, left: 30};
// var width = 320 - margin.left - margin.right;
// var height = 300 - margin.top - margin.bottom;
var width = 800 - margin.left - margin.right;
var height = 700 - margin.top - margin.bottom;


var svg_wraper = d3.select(".chart-wrapper")
    .attr("style", "width: "+(width + margin.left + margin.right)+"px; height: "
        +(height + margin.top + margin.bottom)+"px")
    .style("margin", "auto")
    .style("position", "relative");
var svg = d3.select("#chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("class", "chart__cnt")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv(
    'http://d3-js.ru/data/gapminder-extended.csv',
    function (country){
        country.gdp = Number(country.gdp);
        country.kids = Number(country.kids);
        country.life = Number(country.life);
        country.median_age = Number(country.median_age);
        country.population = Number(country.population);
        return country;
    },
    function (countries){
        console.log(countries);
        var x = d3.scale.linear()
            .domain([0 , d3.max(countries, function (d) {
                return d.kids;
            })])
            .range([0, width]);
        var y = d3.scale.linear()
            .domain(d3.extent(countries, function (d) { return d.life })) //мин и макс продолжительности жизни
            .range([(height - 10) , 0]);
        var r = d3.scale.linear()
            .domain([0, Math.sqrt(d3.max(countries, function (d) { return d.population }))]) //мин и макс продолжительности жизни
            .range([0, 20]);

        // добавляем заголовок
        svg.append("text")
            .attr("x", 0)
            .attr("y", -15 )
            .attr("text-anchor", "start")
            .attr("fill", "#ffffff")
            .style("font-size", "22px")
            .style("font-family", "Arial")
            .text("График значений");

        var svg_tooltip = d3.select(".tooltip")
            .style("position", "absolute");

        // размер осей
        var svg__axis = svg
            .append("g")
            .attr("class", "axis")
            .attr("width", width)
            .attr("height", height);
        // point_wrap
        var point_wrap = svg
            .append('g')
            .attr('class', 'point-wrap')
            .attr("width", width)
            .attr("height", height)
            .attr("transform", "translate(" + 0 + "," + 0 + ")");
        // point
        var point = point_wrap.selectAll('g.point')
            .data(countries)
            .enter()
            .append('g')
            .attr('class', 'point')
            .style('position', 'relative')

            // animation
            .on("mouseover", function(d) {
                d3.select(this)
                    .select('.point__circle')
                    .transition()
                    .duration(500)
                    .attr('fill', '#ffffff')
                    .style('cursor', 'pointer');
                d3.select(".tooltip")
                    .style('opacity', '1')
                    .style('padding', '0 5px 0 5px')
                    .style('top', ''+y(d.life)  + 'px')
                    // .style('left', ''+x(d.kids) - ( r(Math.sqrt(d.population)) / 2 ) + 'px')
                    .style('left', ''+x(d.kids) + 'px')
                    .append('span').attr('class', 'tooltip__text')
                    .html(Math.ceil(d.population / 1000000) + ' m')

            })
            .on("mouseout", function(d) {
                d3.select(this)
                    .select('.point__circle')
                    .transition()
                    .duration(500)
                    .attr('fill', '#f8bd4f')
                    .style('cursor', 'default');
                d3.select(".tooltip")
                    .style('opacity', '0')
                    .style('top', ''+y(d.life)  + 'px')
                    .style('left', ''+x(d.kids) - ( r(Math.sqrt(d.population)) / 2 ) + 'px')
                    .style('padding', '0')
                    .select('.tooltip__text')
                    .remove()
            });



        // circle
        var circle = point.append('circle')
            .attr('class', 'point__circle')
            .attr('fill', '#f8bd4f')
            .attr('cx', function (d){ return x(d.kids); })
            .attr('cy', height).transition().duration(1500)
            .attr('cy', function (d){ return y(d.life); })
            .attr('r', function (d){
                return r(Math.sqrt(d.population)); })
            .attr('data-country', function (d) { return d.country });


        // var axis_top = svg__axis.append('g')
        //     .attr('class', 'axis__x axis__x_top')
        //     .attr('transform', 'translate(0 ,' + (- 10) +')')
        //     .call(
        //         d3.svg.axis()
        //             .scale(x)
        //             .orient('top')
        //     );
        var axis_bottom = svg__axis.append('g')
            .attr('class', 'axis__x axis__x_bottom')
            .attr('transform', 'translate(0,' + ( height ) +')')
            .call(
                d3.svg.axis()
                    .scale(x)
                    .orient('bottom')
            );
        var axis_left = svg__axis.append('g')
            .attr('class', 'axis__y')
            .call(
                d3.svg.axis()
                    .scale(y)
                    .orient('left')
            );

        // создаем набор вертикальных линий для сетки
        d3.selectAll("g.axis__x g.tick")
            .append("line") // добавляем линию
            .classed("grid-line", true) // добавляем класс
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 0)
            .attr("y2", - (height));

        // рисуем горизонтальные линии
        d3.selectAll("g.axis__y g.tick")
            .append("line")
            .classed("grid-line", true)
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", width)
            .attr("y2", 0);
    }
);