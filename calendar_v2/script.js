//creo una variabile con la data di partenza
var startDate = "2018-01-01";

//assegno la data alla funzione moment
//e vado a recuperarmi il numero di giorni per ogni mese
var momentDate = moment(startDate);
var daysInMonth = momentDate.daysInMonth();

//dichiaro alcune variabili che mi torneranno utili successivamente
//monthCount per incrementare o decrementare il numero del mese
//january e december per settare dei limiti per lo scorrimento del calendario
//calendarCol per settare il numero di giorni che voglio visualizzare per riga
//holidays per memorizzare l'oggetto API
var monthCount = 0;
var january = 0;
var december = 11;
var calendarCol = 7;
var holidays;

//dichiaro le variabili per handlebarjs
var daysTemplate = $("#days-template").html();
var calendarTemplate = Handlebars.compile(daysTemplate);

//creo un oggetto da passare poi ad handlebarjs
var calendarPage = {
  dayNum: 0,
  holidayDate: 0
};

//creo una funzione che mi permette di recuperare l'oggetto holidays tramite API
//richiamo la funzione di controllo per le festività
function callAPI(currentDate){
  $.ajax({
    url: "https://flynn.boolean.careers/exercises/api/holidays",
    method: "GET",
    data: {
      year: currentDate.year(),
      month: currentDate.month()
    },
    success: function(obj) {
      holidays = obj.response;
      holidaysCheck();
    },
    error: function() {
      alert("errore");
    }
  });
}

//creo una funzione per lo scorrimento del calendario
//controllo se la classe del bottone è next e il monthCount (contatore di scorrimento)
//è minore di december (mese limite settato in precedenza), allora incrementa monthCount
//altrimenti se la classe del bottone è prev e monthCount è maggiore di january
//allora decrementa monthCount
//inoltre pulisco ogni volta la pagina calendario e vado ad incrementare il mese
//a richiamare la funzione che mi restituisce l'API e a richiamare
//la funzione che crea la pagina calendario
function moveMonth(btnClass) {
  if (btnClass.includes("next") && monthCount < december) {
    monthCount++;
  } else if (btnClass.includes("prev") && monthCount > january) {
    monthCount--;
  }
  $(".calendar-days").empty();
  momentDate = moment(startDate).add({months: monthCount});
  daysInMonth = momentDate.daysInMonth();
  callAPI(momentDate);
  calendarPageGen(momentDate, daysInMonth, calendarPage);
};

//creo una funzione che crea la pagina calendario, con il nome del mese
//e il numero dei giorni
function calendarPageGen(currentDate, days, obj) {
  for (var i = 1; i <= days; i++) {
    $(".month").text(currentDate.format("MMMM YYYY"));
    obj.dayNum = i;
    obj.holidayDate = currentDate.format("YYYY-MM-") + dateFormatter(i);
    $(".calendar-days").append(calendarTemplate(obj));
    calendarGridGen(calendarCol);
  }
};

//creo una funzione per generare la griglia del calendario in maniera dinamica
function calendarGridGen(col){
  var dayWidth = $(".day").width();
  var dayMargin = $(".day").css("margin").replace("px", "");
  var calendarPadding = $(".calendar-page").css("padding").replace("px", "");
  var calendarWidth = ((dayWidth*col) + ((dayMargin)*col)*2) + (calendarPadding*2);
  $(".calendar-page").css("width" , calendarWidth);
}

//creo una funzione che al click del bottone memorizza la sua classe in una variabile
//e la passa alla funzione che richiamo per effettuare lo scorrimento calendario
$(".btn").click(function(){
  var thisClass = $(this).attr("class");
  moveMonth(thisClass);
});

//creo una funzione per il check delle festività, innanzitutto devo controllare
//se la lunghezza di holidays è maggiore di 0, visto che alcuni mesi sono sprovvisti
//di festività, altrimenti potrebbe generare un errore, successivamente controllo
//se la data della festività è uguale all'attributo data-holiday del giorno
//allora inserisco il nome della festività nello span e aggiungo la classe
//highlight che evidenzia la casella relativa
function holidaysCheck(){
  if (holidays.length > 0) {
    $(".day").each(function() {
      for (var j = 0; j < holidays.length; j++) {
        if(holidays[j].date == $(this).attr("data-holiday")) {
          $(this).find(".holiday-name").text(holidays[j].name);
          $(".day[data-holiday=" + holidays[j].date + "]").addClass("highlight");
        }
      }
    });
  }
}

//creo una funzione che aggiunge uno zero al giorno, se il giorno è minore di 10
//in questo modo ho la stessa data formattata come da API
function dateFormatter(num) {
  if (num < 10){
    return num = "0" + num;
  } else {
    return num;
  }
}

//richiamo le funzioni per generare subito la prima pagina del calendario
callAPI(momentDate);
calendarPageGen(momentDate, daysInMonth, calendarPage);
