//the ufo map itself
var map = new UFOs(document);

//things relating to time/years
var years, year, year_max, year_min, year_span;
var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

//speed that we move through the date, keep track of last time we added something to reduce time between months to prevent large stale periodss
var speed = 0;
var last_added = 0;

var currentYear = document.getElementById("currentYear");
var speed_controller = document.getElementById("speedController");

var ready = false;

function convertToDate(year_t){
        return months[parseInt(year_t.slice(-4).substring(0,2))]+" " + year_t.slice(-2)+", " +year_t.substring(0,4);
}

$.getJSON("used_data/years.json",function(data){
    years = data;
    year_max = parseInt(years[years.length-1]);
    year_min = parseInt(years[0]);
    year = years[0];
    year_span = year_max-year_min;
    document.getElementById("firstYear").innerHTML = convertToDate(years[0]);
    document.getElementById("lastYear").innerHTML = convertToDate(years[years.length-1]);
    ready = true;
});

$("#cover").click(function(){
    if(ready){
    updateTimeline();
    $("#cover").fadeOut();
    setTimeout(update,500);
    $("#cover").unbind("click");
    }
});

var days_in_month = [31,28,31,30,31,30,31,31,30,31,30,31];

function incrementYear(){
    var month = parseInt(year.slice(-4).substring(0,2));
    var day = parseInt(year.slice(-2));
    var tyear = parseInt(year.substring(0,4));
    day++;
    if(day>days_in_month[month-1]){
          month++;
          day=1;
    }
    if(month >= days_in_month.length){
        tyear++;
        month = 1;
    }
    month = month+"";
    if(month.length < 2){
      month="0"+month;
    }
    day = day+"";
    if(day.length <  2){
      day="0"+day;
    }
    year = tyear.toString()+month+day;
    if(parseInt(year) > year_max){
      year = years[0];
    }
}



function update(){
  incrementYear();
  last_added++;
  updateTimeline();
  currentYear.innerHTML = months[parseInt(year.slice(-4).substring(0,2))]+" " + year.slice(-2)+", " +year.substring(0,4);
  if(years.indexOf(year) > -1){
    $.getJSON("used_data/"+year+".json",function(data){
          var tdata;
          var added = false
          for(var i = 0; i < data.length; i++)
          {
                added = true;
                last_added = 0;
                tdata = data[i];
                if(tdata != undefined){
                  var x = tdata[2];
                  var y=  tdata[3];
                  var xi = x, yi = y;
                  y +=81.5;
                  y/=-145.68+81.5;
                  x-=26.45;
                  x/=60.55-28.5;
                  if(x < 1 && x > 0 && y < 1 && y > 0){
                    map.addUFOPercent(x,y);
              }
            }
          }

        });
}
  var time = 1000-(speed*9)-Math.pow(3,last_added);
    if(time < 0){
      time = 10;
    }
    setTimeout(update,time);
}

$(window).resize(function(){
  map.resize();
});

$("#restart").click(function(){
	year = years[0];
});

var timeline = document.getElementById("timeline");

var ctx = timeline.getContext("2d");
function updateTimeline(){
  ctx.fillStyle = "#333333";
  ctx.fillRect(0,0,timeline.width,timeline.height);
  ctx.fillStyle="#0000FF";
  ctx.fillRect(0,0,timeline.width*(parseInt(year)-year_min)/year_span,timeline.height);

}
document.getElementById("slider").value = 50;
$("#slider").mousedown(function(){
  this.style.cursor = "grabbing";
});;
$("#slider").mouseup(function(){
    this.style.cursor="grab";
});
$('#slider').change(function(){
  speed = document.getElementById("slider").value;
});
