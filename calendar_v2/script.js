//localizzo momentjs in italiano
moment.locale("it");

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
//monthBeginWith per memorizzare da che giorno inizia il mese
//currentDay per memorizzare il numero del giorno corrente (da 0 a 6)
var monthCount = 0;
var january = 0;
var december = 11;
var calendarCol = 7;
var holidays, monthBeginWith, currentDay;

//dichiaro le variabili per handlebarjs
var daysTemplate = $("#days-template").html();
var calendarTemplate = Handlebars.compile(daysTemplate);

var spacerTemplate = $("#spacer-template").html();
var spacerHolder = Handlebars.compile(spacerTemplate);

//creo gli oggetti da passare poi ad handlebarjs
var calendarPage = {
  num: 0,
  dayNum: 0,
  holidayDate: 0,
  dayName: "",
};

var spacer = {};

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
//e il numero dei giorni, inoltre vado a creare un quadrato vuoto per
//quanti sono i giorni prima del primo giorno iniziale del mese
//in questo modo creo lo spazio in stile calendario, vado anche a settare
//il nome del giorno per ogni casella
//prendo il numero del giorno della settimana corrente (da 0 a 6)
//controllo se il modulo 6 è true allora aggiunge al giorno la classe weekend
//se il modulo di 2 è true allora aggiunge al giorno la classe even,
//altrimenti aggiunge la classe odd
function calendarPageGen(currentDate, days, obj) {
  monthBeginWith = moment(currentDate).day();
  for (var a = 0; a < monthBeginWith; a++) {
    $(".calendar-days").append(spacerHolder(spacer));
  }

  for (var i = 1; i <= days; i++) {
    $(".month").text(currentDate.format("MMMM YYYY"));
    obj.num = obj.dayNum = i;
    obj.holidayDate = currentDate.format("YYYY-MM-") + dateFormatter(i);
    obj.dayName = moment(currentDate).add({days: i-1}).format("ddd");
    currentDay = moment(obj.holidayDate).day();
    $(".calendar-days").append(calendarTemplate(obj));
    calendarGridGen(calendarCol);

    if (!(currentDay % 6)) {
      $(".day[data-num=" + i + "]").find(".day-info").addClass("weekend");
    } else if (!(currentDay % 2)){
      $(".day[data-num=" + i + "]").find(".day-info").addClass("even");
    } else {
      $(".day[data-num=" + i + "]").find(".day-info").addClass("odd");
    }
  }
};

//creo una funzione per generare la larghezza della griglia del calendario
//in maniera dinamica in base alla caselle che vogliamo pe riga
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
      for (var j = 0; j < holidays.length; j++) {
        var holidayDay = $(".day[data-holiday=" + holidays[j].date + "]");
        holidayDay.find(".holiday-name").text(holidays[j].name);
        holidayDay.addClass("highlight");
      }
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
