var buttongroup =`
<div class="butdiv">
  <button type="button" class="btn-success" onclick="shownolo()">Visualizza i noleggi in corso o futuri</button>
  <button type="button" class="btn-success" onclick="showstory()">Visualizza lo storico noleggi</button>
<div>`

async function renderNoleggi()
{
  $("#textdiv").empty();
  $("#textdiv").append(
  `<h2>Area noleggi NoloNolo+</h2>
  ${buttongroup}
  <hr>
  `);
}

//TODO form al posto delle info e non in alto, conferma noleggi, VISUALIZZARE FATTURA, funzionario = sessionstorage
async function shownolo()
{
  $("#textdiv").empty();
  $("#textdiv").append(`${buttongroup}`);

  await $.ajax({
      url: serverUrl + `mongo/storico`,
      type: 'GET',
      crossDomain: true,
      success: async function (data){
        let p='';
        let i=0;
        for(person of data)
        {
          if (person.storico_noleggi != null)
          {
            for(storico of person.storico_noleggi)
            {

              if (!(new Date(storico.fine) < new Date()) ||(storico.concluso !="Concluso"))
              {
                p+=(`
                <div class="noleggio${i} nolo">
                <h4> <span id ="or_office">${storico.office_id};</span> </h4>
                <p>Cliente: <span id ="or_client">${person.Nome};</span> </p>
                <p>Data di inizio: <span id ="or_start">${storico.inizio}; </span></p>
                <p>Data di fine: <span id ="or_end">${storico.fine}; </span></p>
                <p>Pagamento: ${storico.pagamento}; </p>
                <p>Stato: ${storico.concluso}</p>`);

                if (new Date(storico.inizio) > new Date()) //futuro
                {
                  p+=(`
                    <button type="button" class="btn-primary btn-mod" onclick="modnolo(${i})">Modifica</button>
                    <button type="button" class="btn-danger btn-del" onclick="delnolo(${i})">Elimina</button>
                    <hr>
                    </div>
                    </div>
                    `);
                }
                else if (storico.concluso == "Da confermare")
                {
                  p+=(`
                    <button type="button" class="btn-success btn-conf" onclick="confirmnolo(${i})">Conferma restituzione</button>
                    <span class="damage"></span>
                    <hr>
                    </div>
                    </div>
                    `);
                }
                else
                {
                  p+=(`
                    <hr>
                    </div>
                    `);
                }
              }
                i=i+1;
            }
          }
        }
        $("#textdiv").append(`<h2>Noleggi in corso o futuri:</h2>`);
        $("#textdiv").append(`<div class="futurenolo">`);
        $("#textdiv").append(`${p}`);
      },

      error: function(data){
        $("#textdiv").prepend(`<div class="fail_upd">${data}</div>`);
        setTimeout(function(){$(".fail_upd").remove()}, 10000);
       }
  });
}

async function confirmnolo(i)
{
  $("button").prop("disabled", true);
  $("button").prop("aria-disabled", true);

  $(`.noleggio${i} .damage`).append(`
    <form>
      <div class="mb-3">
        <label for="danni" class="form-label">Danni</label>
        <input type="number" class="form-control" min='0' value='0' id="danni" aria-describedby="damagehelp" required>
        <div id="damagehelp" class="form-text">Danni imputabili al cliente</div>
      </div>
      <button type="button" class="btn-success btn-mod" onclick="confirm(${i})">Conferma</button>
      <button type="button" class="btn-warning btn-del" onclick="annullaform(${i})">Annula</button>
    </form>
    `);
}

async function confirm(i)
{
  let data = $(`.noleggio${i}`).text().split('; ');

  let dati =[];

  for (let j = 0; j < data.length; j++)
  {
    dati.push(data[j].split(': ')[1]!= undefined ? data[j].split(': ')[1].trim():data[j].split(': ')[0].trim());
  };

    let confirmdata={
      "office": dati[0],
      "nome": dati[1],
      "or_inizio": dati[2],
      "or_fine": dati[3],
      "danno": $('#danni').val(),
      "funzionario":JSON.parse(localStorage.getItem('user')).nome
    }

    await $.ajax({
        url: serverUrl + `mongo/putnoleggi?type=confirm`,
        type: 'PUT',
        data: JSON.stringify(confirmdata),
        crossDomain: true,
        contentType: 'application/json',
        success: async function (data) {
          await shownolo();
          $("#textdiv").prepend(`<div class="success_upd">${data}</div>`);
          setTimeout(function(){$(".success_upd").remove()}, 10000);
        },
        error: function(data) {
          $("#textdiv").prepend(`<div class="fail_upd">${data}</div>`);
          setTimeout(function(){$(".fail_upd").remove()}, 10000);
         }
       });
  }

async function delnolo(i)
{
  let data = $(`.noleggio${i}`).text().split('; ');

  let dati =[];

  for (let j = 0; j < data.length; j++)
  {
    dati.push(data[j].split(': ')[1]!= undefined ? data[j].split(': ')[1].trim():data[j].split(': ')[0].trim());
  };

  let deldata={
    "office": dati[0],
    "nome": dati[1],
    "inizio": dati[2],
    "fine": dati[3]
  }


  await $.ajax({
      url: serverUrl + `mongo/deletenoleggi`,
      type: 'DELETE',
      data: JSON.stringify(deldata),
      crossDomain: true,
      contentType: 'application/json',
      success: async function (data) {
        await shownolo();
        $("#textdiv").prepend(`<div class="success_upd">${data}</div>`);
        setTimeout(function(){$(".success_upd").remove()}, 10000);
      },
      error: function(data) {
        $("#textdiv").prepend(`<div class="fail_upd">${data}</div>`);
        setTimeout(function(){$(".fail_upd").remove()}, 10000);
       }
     });
}


async function modnolo(i)
{
  $(".btn-mod").attr("disabled", true);
  $(".btn-mod").attr("aria-disabled", true);

  let data = $(`.noleggio${i}`).text().split('; ');

  let dati =[];

  for (let j = 0; j < data.length; j++)
  {
    dati.push(data[j].split(': ')[1]!= undefined ? data[j].split(': ')[1].trim():data[j].split(': ')[0].trim());
  };

  let d = new Date();
  let datestring = `${d.getFullYear()}-${d.getMonth()+1 < 10? `0${d.getMonth()+1}`:d.getMonth()+1}-${d.getDate() < 10? `0${d.getDate()}`:d.getDate()}`;

  $(`.noleggio${i}`).hide();

  $(`.futurenolo`).prepend(`
<div class ="formnoleggio">
  <form>
  <h4>${dati[0]}</h4>
  <p>Cliente: ${dati[1]}</p>

  <div class="mb-3">
    <label for="startdate" class="form-label">Data di inizio</label>
    <input type="date" class="form-control" min="${datestring}" value="${dati[2]}" id="startdate" aria-describedby="startdatehelp"required>
    <div id="startdatehelp" class="form-text">Data di inizio del noleggio</div>
  </div>

  <div class="mb-3">
    <label for="enddate" class="form-label">Data di fine</label>
    <input type="date" class="form-control" min="${datestring}" value="${dati[3]}" id="enddate" aria-describedby="enddatehelp" required>
    <div id="enddatehelp" class="form-text">Data di fine del noleggio</div>
  </div>

  <div class="mb-3">
    <label for="pay" class="form-label">Costo</label>
    <input type="number" step="0.01" class="form-control" min='0' value="${parseFloat(dati[4])}" id="pay" aria-describedby="payhelp" required>
    <div id="payhelp" class="form-text">Costo del noleggio</div>
  </div>
  <p>Stato: ${dati[5].substring(0, dati[5].indexOf("M")-1)}</p>

  <button type="submit" class="btn btn-primary btn-futurenolo" onclick="putnolo(${i})">Conferma modifiche </button>
  <button type="button" class="btn btn-warning btn-futurenolo" onclick="annullaform(${i})">Annulla modifiche </button>
  <hr>
  </form>
  </div>
  `);

  $(`form #startdate`)[0].onchange = function()
  {
    $(`form #enddate`).prop("min", `${$(`form #startdate`)[0].value}`);

    if (new Date($(`form #enddate`).val()) < new Date(`${$(`form #startdate`)[0].value}`))
    {
      $(`form #enddate`).prop("value", `${$(`form #startdate`)[0].value}` )
    }
  }

  $("form").submit(function(e) {
      e.preventDefault();
  });
}

async function annullaform(i)
{
    $("form").remove();
    $(`.noleggio${i}`).show();

    $("button").attr("disabled", false);
    $("button").attr("aria-disabled", false);
}

async function putnolo(i)
{

  for(input of $("input"))
  {
    if (!(input.checkValidity()))
    {
      $(input).css({"border":"1px solid red"});
      return;
    }
  }

  let formdata ={
    "inizio":$("#startdate").val(),
    "fine":$("#enddate").val(),
    "costo":$("#pay").val(),
    "nome":$(`.noleggio${i} #or_client`)[0].outerText.substring(0, $(`.noleggio${i} #or_client`)[0].outerText.indexOf(`;`)),
    "office":$(`.noleggio${i} #or_office`)[0].outerText.substring(0,$(`.noleggio${i} #or_office`)[0].outerText.indexOf(`;`)),
    "or_inizio":$(`.noleggio${i} #or_start`)[0].outerText.substring(0,$(`.noleggio${i} #or_start`)[0].outerText.indexOf(`;`)),
    "or_fine":$(`.noleggio${i} #or_end`)[0].outerText.substring(0,$(`.noleggio${i} #or_end`)[0].outerText.indexOf(`;`))
  };


await $.ajax({
    url: serverUrl + `mongo/putnoleggi`,
    type: 'PUT',
    data: JSON.stringify(formdata),
    crossDomain: true,
    contentType: 'application/json',
    success: async function (data) {
      await shownolo();
      $("#textdiv").prepend(`<div class="success_upd">${data}</div>`);
      setTimeout(function(){$(".success_upd").remove()}, 10000);
    },
    error: function(data) {
      $("#textdiv").prepend(`<div class="fail_upd">${data}</div>`);
      setTimeout(function(){$(".fail_upd").remove()}, 10000);
     }
   });
}

async function showstory()
{
  $("#textdiv").empty();
  $("#textdiv").append(`${buttongroup}`);

  await $.ajax({
      url: serverUrl + `mongo/storico`,
      type: 'GET',
      crossDomain: true,
      success: async function (data){
        let p='';
        let i=0;
        for(person of data)
        {
          if (person.storico_noleggi != null)
          {
            for(storico of person.storico_noleggi)
            {
              if ((new Date(storico.fine) < new Date()) && (storico.concluso == "Concluso"))
              {
                p+=(`<div class="noleggio${i} nolo">
                <h4> ${storico.office_id}; </h4>
                <p>Cliente: ${person.Nome}; </p>
                <p>Data di inizio: ${storico.inizio}; </p>
                <p>Data di fine: ${storico.fine}; </p>
                <p>Pagamento: ${storico.pagamento}; </p>
                <p>Danni: ${storico.danno}; </p>
                <p>Stato: ${storico.concluso}</p>
                <button type="button" class="btn btn-fattura btn-warning" onclick="">Visualizza Fattura</button>
                <hr>
                </div>`);
              }
                i=i+1;
            }
          }
        }
        $("#textdiv").append(`<h2>Noleggi conclusi: </h2>`);
        $("#textdiv").append(`<div class="storynolo">`);
        $("#textdiv").append(`${p}`);
      },

      error: function(data){
        $("#textdiv").prepend(`<div class="fail_upd">${data}</div>`);
        setTimeout(function(){$(".fail_upd").remove()}, 10000);
       }
  });
}
