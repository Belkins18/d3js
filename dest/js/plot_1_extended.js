function CSVToArray( strData, strDelimiter ){
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
        (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
    );


    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;


    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec( strData )){

        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[ 1 ];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
            strMatchedDelimiter.length &&
            strMatchedDelimiter !== strDelimiter
        ){

            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push( [] );

        }

        var strMatchedValue;

        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[ 2 ]){

            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            strMatchedValue = arrMatches[ 2 ].replace(
                new RegExp( "\"\"", "g" ),
                "\""
            );

        } else {

            // We found a non-quoted value.
            strMatchedValue = arrMatches[ 3 ];

        }


        // Now that we have our value string, let's add
        // it to the data array.
        arrData[ arrData.length - 1 ].push( strMatchedValue );
    }

    // Return the parsed data.
    console.log(arrData)
    return( arrData );
}
// Система отступов для d3
var margin = {top: 10, right: 50, bottom: 30, left: 40};
var width = 500 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

var svg = d3.select("#chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("class", "chart__cnt")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// Для работы с .csv
/*
    d3.csv(path, function(){}, function(){})
*/
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
            .range([0, 15]);


        var g = svg.selectAll('g.point')
            .data(countries)
            .enter()
            .append('g')
            .attr('class', 'point');
        g.append('circle')
            .attr('class', 'point__circle')
            .attr('fill', function (d){ return d.color; })

            .attr('cx', function (d){ return x(d.kids); })
            .attr('cy', height).transition().duration(500)
            .attr('cy', function (d){ return y(d.life); })
            .attr('r', function (d){ return r(Math.sqrt(d.population)); })

            .attr('data-country', function (d) { return d.country });
        g.append('text')
            .attr('class', 'point__text')
            .text(function (d) { return d.country })
            .attr('x', function (d){ return x(d.kids) + r(Math.sqrt(d.population)); })
            .attr('y', function (d){ return y(d.life); })

            .attr('dx', 4)
            .attr('dy', 4);



        var axis = svg.append('g')
            .attr('class', 'axis');

        axis.append('g')
            .attr('class', 'axis__x')
            .attr('transform', 'translate(0,' + ( height + 5) +')')
            .call(
                d3.svg.axis()
                    .scale(x)
                    .orient('bottom')
            );
        axis.append('g')
            .attr('class', 'axis__y')
            .call(
                d3.svg.axis()
                    .scale(y)
                    .orient('left')
            );
    }
);