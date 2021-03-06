// Used to print the crossfilter data instances to the console for debugging
// Snippet nicked from code institute
function print_filter(filter){
	var f=eval(filter);
	if (typeof(f.length) != "undefined") {}else{}
	if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
	if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
	console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
}

/*
{"division":1,
"lost":12,
"played":42,
"season":"2068-01-01T00:00:00.000Z",
"finishing_position":6,
"drew":12,
"goals_for":62,
"won":18,
"goals_against":68,
"_id":{"$oid":"5a4bb4b57d94a508b7338ba6"},
"points":48},
*/

// On load snippet taken from https://stackoverflow.com/questions/9550760/hide-page-until-everything-is-loaded-advanced
$(window).on('load', function(){
    $("#cover").hide();
});

queue()
    // -- GETTING THE DATA --
    .defer(d3.json, "/cfcdvdv/seasons")
    .await(makeGraphs);

function makeGraphs(error, seasons_data){
    if (error) {
        console.log("Error receiving data-set with error: " + error.statusText);
        throw error;
    } else {
        console.log('Data object successfully received.')
    }


    // -- PREPARING THE DATA --
    // Get just the first year from the season key. 2013-14 becomes 2013
    seasons_data.forEach(function (d) {
        d.season = parseInt(d.season.slice(0,4));
    });

    // Create a crossfilter instance using the data
    var ndx = crossfilter(seasons_data);

    // Create a dimension from the crossfilter instance using the season year
    var seasonDim = ndx.dimension(function(d){
        return d.season;
    });

    // Get earliest and latest season for x axis scale
    var earliestSeason = seasonDim.bottom(1)[0].season;
    var latestSeason = seasonDim.top(1)[0].season;

    // CREATING OUR GROUPS
    // Create a group based on the division held per season
    var divisionBySeason = seasonDim.group().reduceSum(function(d){
        return d.division;
    });

        // Create a group based on the games lost per season
    var gamesWonBySeason = seasonDim.group().reduceSum(function(d){
        return d.won;
    });

        // Create a group based on the games lost per season
    var gamesLostBySeason = seasonDim.group().reduceSum(function(d){
        return d.lost;
    });

        // Create a group based on the games played per season
    var gamesPlayedBySeason = seasonDim.group().reduceSum(function(d){
        return d.played;
    });

        // Create a group based on the finishing position at the end of the season
    var finishingPositionBySeason = seasonDim.group().reduceSum(function(d){
        return d.finishing_position;
    });

        // Create a group based on the games drawn per season
    var gamesDrawnBySeason = seasonDim.group().reduceSum(function(d){
        return d.drew;
    });

        // Create a group based on the goals scored per season
    var goalsScoredBySeason = seasonDim.group().reduceSum(function(d){
        return d.goals_for;
    });

        // Create a group based on the goals conceded per season
    var goalsConcededBySeason = seasonDim.group().reduceSum(function(d){
        return d.goals_against;
    });

        // Create a group based on the points earned per season
    var pointsBySeason = seasonDim.group().reduceSum(function(d){
        return d.points;
    });

    // -- CREATING THE GRAPHS --
    var windowWidth = $(window).width();

    var stackedLineGraph = dc.lineChart('#stacked-line-chart');

    // Size the graph based on the parent element
    var parentWidth = $('#stacked-line-chart').parent().width();
    if (windowWidth > 800){
        var lineGraphWidth = parentWidth * 0.6;
    } else {
        var lineGraphWidth = parentWidth * 0.95;
    };

    stackedLineGraph
        .width(lineGraphWidth)
        .height(lineGraphWidth / 2.5)
        .dimension(seasonDim)
        .group(gamesWonBySeason, 'Won')
        .stack(gamesDrawnBySeason, 'Drawn')
        .stack(gamesLostBySeason, 'Lost')
        .stack(gamesPlayedBySeason, 'Played')
        .stack(goalsScoredBySeason, 'For')
        .stack(goalsConcededBySeason, 'Against')
        .stack(finishingPositionBySeason, 'Finished')
        .stack(pointsBySeason, 'Points')
        .x(d3.scale.linear().domain([earliestSeason, latestSeason]))
        .legend(dc.legend().x(lineGraphWidth * 0.8).y(10).itemHeight(lineGraphWidth * 0.01).gap(5))
        .yAxisLabel('Value')
        .xAxisLabel('Season');


    // -- TIME IN DIVISION PIE-CHART --

    // Prepare the data
    var divisionDim = ndx.dimension(function(d){
        return d.division;
    });

    var divisionMeasure = divisionDim.group().reduceCount();

    // The chart
    var pieChart = dc.pieChart('#time-in-division-piechart');

    pieChartColours = d3.scale.linear().domain([1,2]).range(['#338', '#88D'])

    pieChart
        // Sized relative to the line-graph
        .width(lineGraphWidth * 0.3)
        .height(lineGraphWidth * 0.3)
        .dimension(divisionDim)
        .group(divisionMeasure)
        .colors(pieChartColours);

    // -- DATA TABLE --

    var seasonsDataTable = dc.dataTable('#seasons-data-table')

    seasonsDataTable
        .dimension(seasonDim)
        .group(function(d){
            return d.season;
        })
        .size(Infinity)
        .columns([
            function (d) {
                return  '';
            },
            function(d){
                return d.division;
            },
            function(d){
                return d.played;
            },
            function(d){
                return d.won;
            },
            function(d){
                return d.drew;
            },
            function(d){
                return d.lost;
            },
            function(d){
                return d.goals_for;
            },
            function(d){
                return d.goals_against;
            },
            function(d){
                return d.finishing_position;
            },
            function(d){
                return d.points;
            }
        ]);

    // -- RENDER THE CHARTS --
    dc.renderAll();
}