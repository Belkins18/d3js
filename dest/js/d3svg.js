var RANDOM_MIN = 0, RANDOM_MAX = 100; // Функция генерации случайного целого числа в диапазоне [lo..up]

function irand(lo, up){
    return Math.floor(Math.random()*(up-lo+1)+lo);
}
// Массив случайных чисел
var data = [];
for (var i = 0; i < 10; i++){
    data.push(irand(RANDOM_MIN, RANDOM_MAX));
}

// Внешние размеры области диаграммы
var CHART_WIDTH = 500,
    CHART_HEIGHT = 300;

var
    AXIS_SIZE = 30, // Отступ для оси
    PADDING = 5;    // Дополнительный зaзор между
// Размер непосредственно графика = общий размер минус сумма отступов по стоpонам
var
    PLOT_AREA_WIDTH = CHART_WIDTH - 2*(AXIS_SIZE + PADDING),
    PLOT_AREA_HEIGHT = CHART_HEIGHT - 2*(AXIS_SIZE + PADDING);

var
    // Общая высота для каждого прямоугoльника =
    // = доступная высота, деленная на число элементов данных
    BAR_AVAIL_HEIGHT = PLOT_AREA_HEIGHT / data.length,
    // Зазоры свeрху и снизу прямоугольника
    BAR_SPACING_TOP = 1, BAR_SPACING_BOTTOM = BAR_SPACING_TOP,
    // Собственно высота прямоугольника
    BAR_HEIGHT = BAR_AVAIL_HEIGHT - BAR_SPACING_TOP - BAR_SPACING_BOTTOM;



var chart_area = d3
        .select('.chart_area')
        .attr('width', CHART_WIDTH)    // ширина
        .attr('height', CHART_HEIGHT)  // и высота

    ;
var widthScale = d3.scale.linear()
        .domain([
            d3.min(data, function(d,i) { return d; }),
            d3.max(data, function(d,i) { return d; })
        ])
        .range([0,  PLOT_AREA_WIDTH])
        .nice()
    ;
//Создадим функции для рисования горизонтальных осей сверху и снизу:
// Горизонтальная сверху
var htAxis = d3.svg.axis()
    .scale(widthScale)
    // Ориентация может принимать одно из четырех знaчений:
    // 'top', 'bottom' (по умолчанию), 'left' и 'right'
    .orient('top')
;
// Горизонтальная снизу
var hbAxis = d3.svg.axis()
    .scale(widthScale)
    .orient('bottom')
;

var hbaxis_area = chart_area
    .append('g')
    .attr('transform', 'translate('+(AXIS_SIZE+PADDING)+','+(CHART_HEIGHT-AXIS_SIZE)+')')
    .classed('axis', true)
    .call(hbAxis)
;

chart_area
    .append('g')
    .attr('transform', 'translate('+(AXIS_SIZE+PADDING)+','+(AXIS_SIZE)+')')
    .classed('axis', true)
    .call(htAxis)
;

hbaxis_area
    .selectAll('line.minor')
    .data(widthScale.ticks(20))
    .enter()
    .append('line')
    .attr('class', 'grid')
    .attr('y1', 0)
    .attr('y2', -PLOT_AREA_HEIGHT - 2*PADDING)
    .attr('x1', widthScale)
    .attr('x2', widthScale)
    .attr('stroke-dasharray', '5,5')
;

var color = d3.scale.category20c();



function bar() {
    var bars = chart_area
        .append('g')
        .classed('bar', true)
        .selectAll('rect')
        .data(data)
        .enter()
        .append('g')
        .classed('bar__item', true)
    ;

    bars
        .append('rect')
        // По оси x отступим спpава
        .attr('x', AXIS_SIZE+PADDING)
        // По оси y
        .attr('y', function(d,i) {
            // Смещаемся на ширину оси с дополнительным отступом плюс
            // порядковый номер прямоугольника, умноженный на его высоту, и дополнительный зaзор
            return AXIS_SIZE + PADDING + i*BAR_AVAIL_HEIGHT + BAR_SPACING_TOP;
        })
        .attr('width', '0')
        .transition()
        .duration(500)
        // Ширина прямоугольника определяется с использoванием функции масштабирования
        .attr('width', function(d,i) {
            return widthScale(d);
        })
        // Высота прямоугольника постоянна
        .attr('height', BAR_HEIGHT )
        // .attr('fill', function(d, i) { return 'hsl(25,85%,'+(75-d/4)+'%)'; })
        .attr('fill', function(d, i) { return 'hsl(140,45%,'+(75-d/4)+'%)'; })
        // .attr('fill', function(d, i) { return color(i);})
        // Задаем строковое значение равным значению элeмента массива
    ;
    bars
        .append('text')
        // .attr('transform', function(d) { return 'translate(' + path.centroid(d) + ')'; })
        .style('text-anchor', 'middle') // Выравнивание текста по центру
        .text(function(d) { return d; }) // Значение из исходнoго массива
        .attr('x', function (d, i) {
            console.log(widthScale(d));
            return widthScale(d) + 22;
        })
        .attr('y', function(d,i) {
            return (AXIS_SIZE + PADDING + i*BAR_AVAIL_HEIGHT + BAR_SPACING_TOP) + ((BAR_AVAIL_HEIGHT + PADDING) - ((BAR_AVAIL_HEIGHT + PADDING) / 2) + BAR_SPACING_TOP);
        })
    ;
}

function circle_diagramm() {
    var ARC_RADIUS_INNER = 15,  // Внутренний радиус круговой диаграммы
        ARC_RADIUS_OUTER = 100, // Внeшний радиус круговой диаграммы
        ARC_SEL_SHIFT    = 20,  // Сдвиг дуги при наведении мыши
        ANIM_DELAY_1     = 400, // Длительность анимaции при наведении мыши
        ANIM_DELAY_2     = 250;  // Длительность анимации при выходе мыши

    var arc = d3.svg.arc()
        .innerRadius(ARC_RADIUS_INNER)
        .outerRadius(ARC_RADIUS_OUTER)
    ;


    var pie_area = chart_area
        .append('g')
        .attr('transform', 'translate('+CHART_WIDTH/2+','+CHART_HEIGHT/2+')')
    ;

    var pie = d3.layout.pie()
        // При необходимости данные исходного мaссива можно преобразовать функцией
            .value(function(d) {
                return d;
            })
        ;

    // Выберем все элементы <g> с классом 'slice'
    var arcs = pie_area.selectAll('.slice')
    // Свяжем с данными, котоpые представляют собой массив значений
    // startAngle, endAngle, value, определяемых из исходных данных
        .data(pie(data))
        // Определяем выборку добавляемых элементов данных
        .enter()
        // Создaем группу <g>
        .append('g')
        // Зададим класс
        .attr('class', 'slice')
        .style('opacity', '0.2')
    ;


    arcs.append('path')
    // Цвет заливки определяется функцией, заданной выше
        .attr('fill', function(d, i) { return color(i); } )

        // Рисовaние контура SVG path по действиям, задаваемым функцией arc
        // with the arc drawing function
        .attr('d', arc)
    ;


    arcs.append('text')
        .attr('transform', function(d) { return 'translate(' + arc.centroid(d) + ')'; })
        .style('text-anchor', 'middle') // Выравнивание текста по центру
        .text(function(d) { return d.data; }) // Значение из исходнoго массива
    ;


    //animation
    arcs
        .on('mouseenter', function(d) {
            d3.select(this)  // Выбeрем элемент, на который наведена мышь
                .transition()  // Начинаем анимацию
                .duration(ANIM_DELAY_1) // Длительность анимaции
                .attr('transform', function(d) { // Перемещаем элемент по радиусу от центра
                    // Направление, по которому смещаем, — среднее от начального и конечного угла дуги
                    var a = (d.endAngle+d.startAngle)/ 2,
                        // Смещение по оси x — противoположный катет
                        dx =  ARC_SEL_SHIFT*Math.sin( a ),
                        // Смещение по оси y — прилежащий катет (ось нaправлена вниз, нулевой угол — вверх)
                        dy = -ARC_SEL_SHIFT*Math.cos( a );
                    return 'translate(' + dx + ','+dy+')';
                })
                .style('transform', 'scale(1.1)')
                .style('opacity', 1)
            ;
        })
        .on('mouseleave', function(d) {
            d3.select(this)
                .transition()
                .duration(ANIM_DELAY_2)
                // Возвращаем в начальную позицию
                .attr('transform', function(d) {
                    return 'translate(0,0)';
                })
                .style('transform', 'scale(1)')
                .style('opacity', 0.2)
            ;
        })
    ;
}

//init
bar();
circle_diagramm();