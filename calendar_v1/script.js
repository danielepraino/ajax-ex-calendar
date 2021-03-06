//creo una variabile con la data di partenza
var date = "2018-01-01";

//assegno la data alla funzione moment
//e vado a recuperarmi il numero di giorni per ogni mese
var momentDate = moment(date);
var daysInMonth = momentDate.daysInMonth();

//dichiaro alcune variabili che mi torneranno utili successivamente
//monthCount per incrementare o decrementare il numero del mese
//january e december per settare dei limiti per lo scorrimento del calendario
//calendarCol per settare il numero di giorni che voglio visualizzare per riga
var monthCount = 0;
var january = 0;
var december = 11;
var calendarCol = 7;

//dichiaro le variabili per handlebarjs
var daysTemplate = $("#days-template").html();
var calendarTemplate = Handlebars.compile(daysTemplate);

//creo un oggetto da passare poi ad handlebarjs
var calendarPage = {
  dayNum: 0
};

//creo una funzione che crea la pagina calendario, con il nome del mese
//e il numero dei giorni
function calendarPageGen(date, days) {
  for (var i = 1; i <= daysInMonth; i++) {
    $(".month").text(date.format("MMMM YYYY"));
    calendarPage.dayNum = i;
    $(".calendar-days").append(calendarTemplate(calendarPage));
    calendarGridGen(calendarCol);
  }
};

//creo una funzione per generare la griglia del calendario in maniera dinamica
function calendarGridGen(col){
  var dayWidth = $(".day").width();
  var dayMargin = $(".day").css("margin").replace("px", "");
  var calendarPadding = $(".calendar-page").css("padding").replace("px", "");
  var calendarWidth = ((dayWidth*calendarCol) + ((dayMargin)*calendarCol)*2) + (calendarPadding*2);
  $(".calendar-page").css("width" , calendarWidth);
}

//creo una funzione per lo scorrimento del calendario
//controllo se la classe del bottone è next e il monthCount (contatore di scorrimento)
//è minore di december (mese limite settato in precedenza), allora incrementa monthCount
//altrimenti se la classe del bottone è prev e monthCount è maggiore di january
//allora decrementa monthCount
//inoltre pulisco ogni volta la pagina calendario e vado sia ad incrementare il mese
//che a richiamare la funzione che crea la pagina calendario
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

//creo una funzione che al click del bottone memorizza la sua classe in una variabile
//e la passa alla funzione che richiamo per effettuare lo scorrimento calendario
$(".btn").click(function(){
  var thisClass = $(this).attr("class");
  moveMonth(thisClass);
});

//richiamo la funzione per generare subito la prima pagina del calendario
calendarPageGen(momentDate, daysInMonth);
