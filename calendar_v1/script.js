
var date = "2018-01-01";

var momentDate = moment(date);
var daysInMonth = momentDate.daysInMonth();

var monthCount = 0;
var january = 0;
var december = 11;
var calendarCol = 7;

var daysTemplate = $("#days-template").html();
var calendarTemplate = Handlebars.compile(daysTemplate);

var calendarPage = {
  dayNum: 0,
  monthVal: 0,
  yearVal: 0
};

function calendarPageGen(date, days) {
  for (var i = 1; i <= daysInMonth; i++) {
    $(".month").text(date.format("MMMM YYYY"));
    calendarPage.dayNum = i;
    $(".calendar-days").append(calendarTemplate(calendarPage));
    calendarGridGen(calendarCol);
  }
};

function calendarGridGen(col){
  var dayWidth = $(".day").width();
  var dayMargin = $(".day").css("margin").replace("px", "");
  var calendarPadding = $(".calendar-page").css("padding").replace("px", "");
  var calendarWidth = ((dayWidth*calendarCol) + ((dayMargin)*calendarCol)*2) + (calendarPadding*2);
  $(".calendar-page").css("width" , calendarWidth);
}

function moveMonth(btnClass) {
  if (btnClass.includes("next") && monthCount < december) {
    monthCount++;
  } else if (btnClass.includes("prev") && monthCount > january) {
    monthCount--;
  }
  $(".calendar-days").empty();
  momentDate = moment(date).add({months: monthCount});
  daysInMonth = momentDate.daysInMonth();
  calendarPageGen(momentDate, daysInMonth);
};

$(".btn").click(function(){
  var thisClass = $(this).attr("class");
  moveMonth(thisClass);
});

calendarPageGen(momentDate, daysInMonth);
