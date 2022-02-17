var calendar_change = false; //se è stato premuto il bottone delle disponibilità diventa true

async function renderCatalogo()
{
  calendar_change = false;

    $("#textdiv").empty();
    $("#textdiv").attr("aria-label", "Contenuto principale: Elenco degli uffici");
    let k=0;
    await $.ajax({
        type: 'GET',
        url: serverUrl + "mongo/offices",
        crossDomain: true,
        success: async function (data) {
          //Append di tutti i dati degli uffici
            for(office of data)
            {
                $("#textdiv").append(`
                  <div class="office${k}">
                    <div class="card mb-3" style="max-width: 850px;">
                      <div class="row g-0">
                        <div class="col-md-4 card_cont">
                          <img src=${office.img} class="img-fluid rounded-start officeimg" alt="Immagine dell'ufficio chiamato ${office.nome}">
                          <div class="container mod-btn-cont">
                              <button type="button" class="btn-primary btn-modifica" onclick="modifica_catalogo(${k})">Modifica o elimina ${`<br> ${office.nome}`} </button>
                          </div>
                        </div>
                        <div class="col-md-8">
                          <div class="card-body" id=cat${k}>
                          <div class="card-body" id=cat_data${k}>
                            <h4 class="card-title">${office.nome};</h4>
                            <p class="card-text">Indirizzo: ${office.indirizzo};</p>
                            <p class="card-text">MQ: ${office.mq}; tier: ${office.tier};</p>
                            <p class="card-text">Stato: ${office.stato};</p>
                            <p class="card-text">Costo base: ${office.costo_base};</p>
                            <p class="card-text">Descrizione: ${office.descrizione};</p>
                            <p class="card-text">Annotazioni: ${office.annotazione};</p>
                          </div>
                          <div class="occupato_text"
                          <p class="card-text occupato">${getoccupato(data, k) == '' ? `<br> Disponibilità non limitata`: `<br><h4>Indisponibile:</h4> ${getoccupato(data, k)}`} </p>
                          </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                `);

                k = k + 1;
            }
            $("#textdiv").prepend(`
              <div class="butdiv">
              <button type"button" class="btn-success btn-showoccupato" onclick="showoccupato(false)" aria-label="Visualizza le date in cui gli uffici non sono disponibili">Visualizza le disponibilità</button>
              <p role="alert" class="sr-only sr-only-focusable">Catalogo caricato</p>
              </div>`);
            $(".occupato_text").hide();

            let i = 0;
            //Se l'ufficio è non disponibile fino a nuova comunicazione lo lo rendo grigio
            for(occupato of $(`.occupato_text`))
            {
              if($(occupato).text().includes("Nuova comunicazione"))
              {
                $(`.office${i}`).addClass("nonDisp");
              }
              i=i+1;
            }
        },
        error: function () {
          $("#textdiv").prepend(`<div class="fail_upd">C'è stato un errore <p role="alert" class="sr-only sr-only-focusable">C'è stato un errore</p> </div>`);
          setTimeout(function(){$(".fail_upd").remove()}, 10000);
         }
    });
}

//Mostra o nosconde le date di disponibilità
function showoccupato(showhide)
{
  if (showhide)
  {
    $(".occupato_text").hide();
    $(".btn-showoccupato").text("Visualizza le disponibilità");
    $(".btn-showoccupato")[0].onclick = function() {showoccupato(false)};
    $(".btn-showoccupato").attr("aria-label", "Visualizza le date in cui gli uffici non sono disponibili");
  }
  else
  {
    $(".occupato_text").show();
    $(".btn-showoccupato").text("Nascondi le disponibilità");
    $(".btn-showoccupato")[0].onclick = function() {showoccupato(true)};
    $(".btn-showoccupato").attr("aria-label", "Nascondi le date in cui gli uffici non sono disponibili");
  }
}

//Funzione per modifiche ad un ufficio
function modifica_catalogo(k)
{
  calendar_change = false;
  //disabilito i bottoni di modifica
  $(".btn-modifica").attr("disabled", true);
  $(".btn-modifica").attr("aria-disabled", true);

  //Ottengo i dati e ne effettuo un parsing per inserirli nell'array dati
  let data = $(`#cat${k}`).text().split(";");
  let dati =[];

  for (let j = 0; j < data.length; j++)
  {
    //Viene preso ciò che è scritto dopo :, nel caso del nome dell'ufficio. viene isolato solo quello
    dati.push(data[j].split(': ')[1]!= undefined ? data[j].split(': ')[1].trim():data[j].split(': ')[0].trim());
  }
  /*
  dati : []
  0: nome Ufficio
  1: Indirizzo dell'Ufficio
  2: Metri quadri dell'Ufficio
  3: tier dell'Ufficio
  4: Stato dell'Ufficio
  5: Costo costo_base
  6: Descrizione
  7: annotazioni (non visibili al cliente)
  */

  //Nascondo i dati dell'ufficio e li sostituisco con un form
  $(`#cat_data${k}`).hide();
  $(`#cat${k}`).prepend(`
    <form aria-label="Form di modifica dell'ufficio">
      <div class="mb-3">
        <label for="name" class="form-label">Nome</label>
        <input type="text" class="form-control" value="${dati[0]}" id="name" aria-describedby="namehelp">
        <div id="namehelp" class="form-text">Nome dell'ufficio</div>
      </div>

      <div class="mb-3">
        <label for="address" class="form-label">Indirizzo</label>
        <input type="text" class="form-control" value="${dati[1]}" id="address" aria-describedby="addresshelp">
        <div id="addresshelp" class="form-text">Indirizzo dell'ufficio</div>
      </div>

      <div class="mb-3">
        <label for="mq" class="form-label">Metri quadri</label>
        <input type="number" min="20" max="500" class="form-control" value="${parseFloat(dati[2])}" id="mq" aria-describedby="mqhelp">
        <div id="mqhelp" class="form-text">Metri quadri dell'ufficio</div>
      </div>

      <div class="mb-3">
        <label for="tier" class="form-label">Tier</label>
        <input type="number" min="1" max="3" class="form-control" value="${parseFloat(dati[3])}" id="tier" aria-describedby="tierhelp">
        <div id="tierhelp" class="form-text">Tier dell'ufficio</div>
      </div>

      <div class="mb-3">
        <label for="stato" class="form-label">Stato</label>
        <select class="form-select selform" aria-label="Selezione stato dell'ufficio"  id="stato" aria-describedby="statushelp">
          <option ${dati[4] == "pessimo"?"selected":""} value="pessimo">Pessimo</option>
          <option ${dati[4] == "sufficiente"?"selected":""} value="sufficiente">Sufficiente</option>
          <option ${dati[4] == "buono"?"selected":""} value="buono">Buono</option>
          <option ${dati[4] == "ottimo"?"selected":""} value="ottimo">Ottimo</option>
        </select>
        <div id="statushelp" class="form-text">Stato dell'ufficio</div>
      </div>

      <div class="mb-3">
        <label for="costo" class="form-label">Costo base</label>
        <input type="number" min="20" max="500" class="form-control" value="${parseFloat(dati[5])}" id="costo" aria-describedby="costohelp">
        <div id="costohelp" class="form-text">Costo base dell'ufficio</div>
      </div>

      <div class="mb-3">
        <label for="desc" class="form-label">Descrizione</label>
        <textarea class="form-control" aria-label="Descrizione" id="desc" aria-describedby="descriptionhelp">${dati[6]}</textarea>
        <div id="descriptionhelp" class="form-text">Descrizione dell'ufficio</div>
      </div>

      <div class="mb-3">
        <label for="ann" class="form-label">Annotazioni</label>
        <textarea class="form-control" aria-label="Annotazioni" id="ann" aria-describedby="annhelp">${dati[7]}</textarea>
        <div id="annhelp" class="form-text">Annotazioni riguardo l'ufficio</div>
      </div>

      <div class="disponibilita">
        <button type="button" class="btn btn-success disp-btn" onclick="disp(${k})" aria-label="Modifica le date di disponibilità">Modifica disponibilità</button>
      </div>

      <button type="submit" class="btn btn-primary" onclick="change_cat('${dati[0]}')">Conferma modifiche</button>
      <button type="submit" class="btn btn-danger" onclick="delete_cat('${dati[0]}')">Elimina ufficio</button>
      <button type="button" class="btn btn-warning" onclick="resetform_cat(${k})">Annulla</button>
  </form>
  <p role="alert" class="sr-only sr-only-focusable">Form di moficia generato</p>

`);

//Rendo tutti i campi di input obbligatori
$("form input").attr("required", true);
$("form #desc").attr("required", true);

$("form").submit(function(e) {
  //Evito il submit immediato per poter chiamare le relative funzioni
    e.preventDefault();
});
}

//Conferma le modiifche al catalogo
async function change_cat(identifier, disp=false)
{
  let occupato = [];
  let formdata = {};
  let type="";

  //Se sono presenti input[type=date] li uso per modificare la disponibilità
  let calendars = $(`.calendar`);

  if (disp)
  {
    //In caso l'ufficio debba essere non disponibile fino a nuova comunicazione
    type="officedisp"

    formdata= {
      "ToChange":identifier
    }
  }
  else
  {
    type="office";
    //Se ci sono calendari o è stato premuto il bottone disponibilità
    if ((calendars.length > 0) || (calendar_change == true) )
    {
      let cal=[];
      for (let i = 0; i < calendars.length +1; i++)
      {
        //Trovo i calendari effettivamente ancora presenti
        if ($(`#start${i}`).val() != undefined)
        {
          cal.push(i);
        }
      }
      //inserisco le date in un array
      for(index of cal)
      {
        occupato.push({
          "from": $(`#start${index}`).val(),
          "to": $(`#end${index}`).val() != ""?$(`#end${index}`).val():"NC"
        })
      }
    }
    else
    {
      //Se non è necessario modificare le date
      occupato= null;
    }

    //Dati da inviare al server
    formdata= {
      "ToChange":identifier,
      "nome":$(`#name`).val(),
      "indirizzo":$(`#address`).val(),
      "mq":$(`#mq`).val(),
      "tier":$(`#tier`).val(),
      "stato":$(`#stato`).val(),
      "costo_base":$(`#costo`).val(),
      "descrizione":$(`#desc`).val(),
      "annotazione":$(`#ann`).val(),
      "occupato":occupato
    };

    //Controllo validità degli input per sicurezza
    for(input of $("input"))
    {
      if (!(input.checkValidity()))
      {
        $(input).css({"border":"1px solid red"});
        return;
      }
    }

    if (!($("form #desc")[0].checkValidity()))
    {
      $("form #desc").css({"border":"1px solid red"});
      return;
    }
  }

//Se va tutto bene effettuo la PUT
await $.ajax({
    url: serverUrl + `mongo/puthere?type=${type}`,
    type: 'PUT',
    data: JSON.stringify(formdata),
    crossDomain: true,
    contentType: 'application/json',
    success: function (data) {
      $("#textdiv").prepend(`<p role="alert" class="sr-only sr-only-focusable">Modifiche completate, la pagina verrà ricaricata</p>`);
      renderCatalogo();
      $("#textdiv").prepend(`<div class="success_upd">${data.msg}</div>`);
      setTimeout(function(){$(".success_upd").remove()}, 10000);
    },
    error: function(data) {
      $("#textdiv").prepend(`<div class="fail_upd">${data} <p role="alert" class="sr-only sr-only-focusable">C'è stato un errore</p> </div>`);
      setTimeout(function(){$(".fail_upd").remove()}, 10000);
     }
   });
}

//Per eliminare un ufficio dal catalogo
async function delete_cat(identifier)
{
  //Verifico se l'ufficio è stato noleggiato
  let bool = 0;
  await noleggiato(identifier).then(resp=> bool = resp);

  if (bool)
  {
    //Se si lo rendo indisponibile fino a nuova comunicazione
      change_cat(identifier, true);
  }
  else
  {
    //Altrimenti lo elimino
    await $.ajax({
        url: serverUrl + `mongo/deletehere?type=office`,
        type: 'DELETE',
        data: JSON.stringify({"nome": identifier}),
        crossDomain: true,
        contentType: 'application/json',
        success: async function (data) {
          $("#textdiv").prepend(`<p role="alert" class="sr-only sr-only-focusable">Ufficio eliminato, la pagina verrà ricaricata</p>`);
          renderCatalogo();
          $("#textdiv").prepend(`<div class="success_upd">${data.msg}</div>`);
          setTimeout(function(){$(".success_upd").remove()}, 10000);
        },
        error: function(data) {
          $("#textdiv").prepend(`<div class="fail_upd">${data} <p role="alert" class="sr-only sr-only-focusable">C'è stato un errore</p> </div>`);
          setTimeout(function(){$(".fail_upd").remove()}, 10000);
         }
    });
  }
}

//Funzione che mostra i calendari con le date di non disponibilità
async function disp(k)
{
  calendar_change = true;

  let d = new Date();
  let datestring = `${d.getFullYear()}-${d.getMonth()+1 < 10? `0${d.getMonth()+1}`:d.getMonth()+1}-${d.getDate() < 10? `0${d.getDate()}`:d.getDate()}`;

  let occuP='';
  let i=0;

if (k!=-1) {
  await $.ajax({
      url: serverUrl + `mongo/offices`,
      type: 'GET',
      crossDomain: true,
      success: async function (data) {
        for(occupato of data[k].occupato)
        {
          occuP += `
          <div class="date${i}">
            <label for="start${i}">Data di inizio:</label>
            <input type="date" class="calendar" id="start${i}" name="disp_start${i}" value="${occupato.from}" required>

            <label for="end${i}">Data di fine:</label>
            <input type="date" class="calendar" id="end${i}" name="disp_end${i}" value="${occupato.to}">

            <button type="button" class="btn btn-revoke" aria-label="Elimina queste date" onclick="revokedisp(${i})">&times</button>
          </div>
            `;
            i=i+1;
        }
      },
      error: function(data) {
        $("#textdiv").prepend(`<div class="fail_upd">${data} <p role="alert" class="sr-only sr-only-focusable">C'è stato un errore</p> </div>`);
        setTimeout(function(){$(".fail_upd").remove()}, 10000);       }
  });
}

//Aggiungo una nuova data
    $(`.disponibilita`).append(`${occuP}
      <div class="date${i}">
      <h5><b>Nuova data:</b></h5>
        <label for="start${i}">Data di inizio:</label>
        <input type="date" class="calendar" id="start${i}" name="disp_start${i}"  min="${datestring}" value="${datestring}" required>

        <label for="end${i}">Data di fine:</label>
        <input type="date" class="calendar" id="end${i}" name="disp_end${i}" min="${datestring}" value="${datestring}">

        <button type="button" class="btn btn-revoke" aria-label="Elimina queste date" onclick="revokedisp(${i})">&times</button>
        <p role="alert" class="sr-only sr-only-focusable">Date di non disponibilita caricate</p>
      </div>
      `);

      $(".disp-btn").attr("disabled", true);
      $(".disp-btn").attr("aria-disabled", true);


      let calendars = $(`.calendar`);

      for (let j = 0; j < calendars.length; j+=2)
      {
        (calendars[j]).onchange = function() {let id_start = calendars[j].id; let id_num = parseInt(id_start.charAt(id_start.length-1)); change_calendar(id_num);}
      }
}

//Funzione che rimuove le date di non disponibilità
function revokedisp(i)
{
   $(`.date${i}`).remove();
   $(`#end${i}`).remove();
   $(`#start${i}`).remove();
}

//Funzione di coerenza per i calendari
function change_calendar(k)
{
   $(`#end${k}`).prop("min", `${$(`#start${k}`).val()}`);

   if (new Date($(`#end${k}`).val()) < new Date(`${$(`#start${k}`).val()}`))
   {
     $(`#end${k}`).prop("value", `${$(`#start${k}`).val()}` )
   }
};

//Verifica se un ufficio è stato noleggiato
async function noleggiato(identifier)
{
  let found= false;
  await $.ajax({
      type: 'GET',
      url: serverUrl + "mongo/storico",
      crossDomain: true,
      success: async function (data) {
        for(storico of data)
        {
          if (found)
          {
            break;
          }

          if (storico.storico_noleggi != null)
          {
            for(elem of storico.storico_noleggi)
            {
              if (elem.office_id == identifier)
              {
                  found = true;
              }
            }
          }
        }
      },
      error: function() {
        $("#textdiv").prepend(`<div class="fail_upd">C'è stato un errore <p role="alert" class="sr-only sr-only-focusable">C'è stato un errore</p> </div>`);
      setTimeout(function(){$(".fail_upd").remove()}, 10000);
    }
  });
  return found;
}

//Ottiene le date di non disponibilità e crea un template literal
function getoccupato(data, i)
{
    let p ='';
    const dateoptions = {year: 'numeric', month: 'long', day: 'numeric' };

    for (date of data[i].occupato)
    {
        if (date.from == '')
        {
            return '';
        }
        if (new Date(date.to) < new Date()) //Indisponibilità terminata
        {
            p+=(``);
        }
        else
        {
          p +=(`
          <p class="card-text disp_from">Da: ${new Date(date.from).toLocaleDateString('it-IT',dateoptions)}</p>
          <p class="card-text disp_to">A: ${date.to == "NC" ? "Nuova comunicazione":new Date(date.to).toLocaleDateString('it-IT',dateoptions)}</p>
          <hr>
        `)
      }
    }
    return p;
}

//Tasto annulla: elimina il form
function resetform_cat(k)
{
    $(`#cat${k} form`).empty();
    $(`#cat_data${k}`).show();
    $(".btn-modifica").attr("disabled", false);
    $(".btn-modifica").attr("aria-disabled", false);
    $(".disp-btn").attr("disabled", false);
    $(".disp-btn").attr("aria-disabled", false);

    calendar_change = false;
}
