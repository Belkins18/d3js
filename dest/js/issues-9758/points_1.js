// Система отступов для d3
var margin = {top: 30, right: 30, bottom: 30, left: 30};
var width = 300 - margin.left - margin.right;
var height = 240 - margin.top - margin.bottom;

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
            .range([0, 10]);


        var g = svg.selectAll('g.point')
            .data(countries)
            .enter()
            .append('g')
            .attr('class', 'point');
        g.append('circle')
            .attr('class', 'point__circle')
            // .attr('fill', function (d){ return d.color; })
            .attr('fill', '#f8bd4f')

            .attr('cx', function (d){ return x(d.kids); })
            .attr('cy', height).transition().duration(500)
            .attr('cy', function (d){ return y(d.life); })
            .attr('r', function (d){ return r(Math.sqrt(d.population)); })

            .attr('data-country', function (d) { return d.country });
        // g.append('text')
        //     .attr('class', 'point__text')
        //     .text(function (d) { return d.country })
        //     .attr('x', function (d){ return x(d.kids) + r(Math.sqrt(d.population)); })
        //     .attr('y', function (d){ return y(d.life); })
        //
        //     .attr('dx', 4)
        //     .attr('dy', 4);

        var horizontal_line = svg
            .append('g')
            .attr('class', 'grid')
            .append('g')
            .attr('class', 'grid_h');
        horizontal_line
            .selectAll('g.grid.grid_h')
            .data(countries)
            .enter()
            .append('line')
            .attr('class', 'grid-line')
            .attr('y1', -10)
            .attr('y2', height)
            .attr('x1', 0)
            .attr('x2', height)
            .attr('stroke-dasharray', '5,5');



        var axis = svg.append('g')
            .attr('class', 'axis');

        var axis_top = axis.append('g')
            .attr('class', 'axis__x axis__x_top')
            .attr('transform', 'translate(0 ,' + (- 10) +')')
            .call(
                d3.svg.axis()
                    .scale(x)
                    .orient('top')
            );

        var axis_bottom = axis.append('g')
            .attr('class', 'axis__x axis__x_bottom')
            .attr('transform', 'translate(0,' + ( height ) +')')
            .call(
                d3.svg.axis()
                    .scale(x)
                    .orient('bottom')
            );

        var axis_left = axis.append('g')
            .attr('class', 'axis__y')
            .call(
                d3.svg.axis()
                    .scale(y)
                    .orient('left')
            );
    }
);