
async function renderAnagrafica()
{
    $("#textdiv").empty();
    $("#textdiv").attr("aria-label", "Contenuto principale: Elenco di tutti i clienti");
    let i = 0;
    await $.ajax({
        type: 'GET',
        url: serverUrl + "mongo/people",
        crossDomain: true,
        success: async function (data) {
            for (user of data['Clienti']) {
                $("#textdiv").append(`
                    <div class="card mb-3" style="max-width: 600px;">
                      <div class="row g-0">
                        <div class="col-md-4 card_cont">
                          <img src="${user.img}" class="img-fluid rounded-start" alt="Immagine dell'utente ${user.nome}">
                            <div class=container>
                                <button type="button" class="btn-primary btn-modifica" onclick="modifica_carta(${i})">Modifica o elimina ${`<br> ${user.nome}`} </button>
                            </div>
                        </div>
                        <div class="col-md-8">
                          <div class="card-body" id="carta${i}">
                            <div id="pers_data${i}">
                            <h4 class="card-title dato">${user.nome}; </h4>
                            <p class="card-text dato">Indirizzo: ${user.indirizzo}; </p>
                            <p class="card-text dato">Mail: ${user.mail}; </p>
                            <p class="card-text dato">Annotazioni: ${user.annotazioni}; </p>
                            <p class="card-text dato">Tier cliente: ${user.tier_cliente}; </p>
                            </div>
                            <div class="storico_text"
                            <p class="card-text storico">${await getstorico(data, i) == '' ? `<br> Nessun noleggio effettuato`: `<br><h4>Storico noleggi:</h4> ${await getstorico(data, i)}`} </p>
                            </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    `);

                i = i + 1;
            }
            $("#textdiv").prepend(`
              <div class="butdiv">
              <button type"button" class="btn-success btn-showstorico" onclick="showstorico(false)" aria-label="Visualizza lo storico noleggi dei clienti">Visualizza storico noleggi</button>
              </div>`);

             $(".storico_text").hide();

        },
        error: function() { console.log("error in renderAnagrafica") }
    })
}

async function showstorico(showhide)
{
  if (showhide)
  {
    $(".storico_text").hide();
    $(".btn-showstorico").text("Visualizza storico noleggi");
    $(".btn-showstorico")[0].onclick = function() {showstorico(false)};
    $(".btn-showoccupato").prop("aria-label", "Visualizza Lo storico noleggi dei clienti");
  }
  else
  {
    $(".storico_text").show();
    $(".btn-showstorico").text("Nascondi storico noleggi");
    $(".btn-showstorico")[0].onclick = function() {showstorico(true)};
    $(".btn-showoccupato").prop("aria-label", "Nascondi lo storico noleggi dei clienti");
  }
}


async function getstorico(data, i)
{
    let p =''
    if (data.Clienti[i].storico_noleggi != null) {
      for (noleggio of data.Clienti[i].storico_noleggi)
      {
          if (noleggio.office_id == '')
          {
              return '';
          }
          p +=(`<p class="card-text">Ufficio: ${noleggio.office_id}</p>
                      <p class="card-text">Inizio: ${noleggio.inizio}</p>
                      <p class="card-text">Fine: ${noleggio.fine}</p>
                      <p class="card-text">Incasso: ${noleggio.pagamento} €</p>
                      <p class="card-text">Danni: ${noleggio.danno} €</p>
                      <p class="card-text">Metodo di pagamento: ${noleggio.metodo_pagamento}</p>
                      <p class="card-text">Stato: ${noleggio.concluso}</p>
                     <hr>`);
      }
  }
    return p;
}


async function modifica_carta(i)
{
    $(".btn-modifica").attr("disabled", true);
    $(".btn-modifica").attr("aria-disabled", true);

    let data = $(`#carta${i} .dato`).text().split('; ');

    let dati =[];

    for (let j = 0; j < data.length; j++)
    {
      dati.push(data[j].split(': ')[1]!= undefined ? data[j].split(': ')[1].trim():data[j].split(': ')[0].trim());
    }

    $(`#pers_data${i}`).hide();
    $(`#carta${i}`).prepend(`
        <form arial-label="Form di modifica dell'utente">
          <div class="mb-3">
            <label for="name" class="form-label">Nome</label>
            <input type="text" class="form-control" value="${dati[0]}" id="name" aria-describedby="namehelp">
            <div id="namehelp" class="form-text">Nome dell'utente</div>
          </div>

          <div class="mb-3">
            <label for="address" class="form-label">Indirizzo</label>
            <input type="text" class="form-control" value="${dati[1]}" id="address" aria-describedby="addresshelp">
            <div id="addresshelp" class="form-text">Indirizzo dell'utente</div>
          </div>

          <div class="mb-3">
            <label for="mail" class="form-label">Mail</label>
            <input type="email" class="form-control" value="${dati[2]}" id="mail" aria-describedby="mailhelp">
            <div id="mailhelp" class="form-text">Mail dell'utente</div>
          </div>

          <div class="mb-3">
            <label for="tier" class="form-label">Tier</label>
            <input type="number" min="0" max="5" class="form-control" value="${parseFloat(dati[4])}" id="tier" aria-describedby="tierhelp">
            <div id="tierhelp" class="form-text">Tier dell'utente</div>
          </div>

          <div class="mb-3">
            <label for="annotations" class="form-label">Annotazioni</label>
            <textarea class="form-control" aria-label="Annotazioni" id="annotations" aria-describedby="annhelp">${dati[3]}</textarea>
            <div id="annhelp" class="form-text">Annotazioni riguardo l'utente</div>
          </div>

          <button type="submit" class="btn btn-primary" onclick="change_ppl('${dati[0]}')">Conferma modifiche</button>
          <button type="submit" class="btn btn-danger btn-delete" onclick="delete_ppl('${dati[0]}')">Elimina utente</button>
          <button type="button" class="btn btn-warning" onclick="resetform_ppl(${i})">Annulla</button>
    </form>
    `);

    $("form input").attr("required", true);

    $("form").submit(function(e) {
        e.preventDefault();
    });
}

async function change_ppl(identifier)
{
  let formdata= {
    "ToChange":identifier,
    "nome":$(`#name`).val(),
    "indirizzo":$(`#address`).val(),
    "mail":$(`#mail`).val(),
    "tier":$(`#tier`).val(),
    "annotazione":$(`#annotations`).val()
  };

  for(input of $("input"))
  {
    if (!(input.checkValidity()))
    {
      $(input).css({"border":"1px solid red"});
      return;
    }
  }

await $.ajax({
    url: serverUrl + "mongo/puthere?type=cliente",
    type: 'PUT',
    data: JSON.stringify(formdata),
    crossDomain: true,
    contentType: 'application/json',
    success: async function (data) {
      await renderAnagrafica();
      $("#textdiv").prepend(`<div class="success_upd">${data.msg}</div>`);
      setTimeout(function(){$(".success_upd").remove()}, 10000);
    },
    error: function(data) {
      $("#textdiv").prepend(`<div class="fail_upd">${data}</div>`);
      setTimeout(function(){$(".fail_upd").remove()}, 10000);
     }
});

}

async function hasrent(identifier)
{
  let rented= false;
  await $.ajax({
      type: 'GET',
      url: serverUrl + `mongo/people?nome=${identifier}`,
      crossDomain: true,
      success: async function (data) {
        for(elem of data.val.storico_noleggi)
        {
          if (elem.concluso != "Concluso")
          {
              rented = true;
          }
        }
    },
      error: function() { console.log("error in hasrent") }
  });

  return rented;
}

async function delete_ppl(identifier)
{
  let bool = 0;
  await hasrent(identifier).then(resp=> bool = resp);

  if (bool)
  {
    $("form").append(`<div class="fail_upd">Questo cliente ha noleggi in corso o prenotati, impossibile eliminare<div>`);
    $(".btn-delete").attr("disabled", true);
    $(".btn-delete").attr("aria-disabled", true);
    return;
  }
  await $.ajax({
      url: serverUrl + "mongo/deletehere?type=clienti",
      type: 'DELETE',
      data: JSON.stringify({"nome": identifier}),
      crossDomain: true,
      contentType: 'application/json',
      success: async function (data) {
        await renderAnagrafica();
        $("#textdiv").prepend(`<div class="success_upd">${data.msg}</div>`);
        setTimeout(function(){$(".success_upd").remove()}, 10000);
      },
      error: function(data) {
        $("#textdiv").prepend(`<div class="fail_upd">${data}</div>`);
        setTimeout(function(){$(".fail_upd").remove()}, 10000);
       }
  });
}


async function resetform_ppl(i)
{
    $(`#carta${i} form`).remove();
    $(`#pers_data${i}`).show();
    $(".btn-modifica").attr("disabled", false);
    $(".btn-modifica").attr("aria-disabled", false);
}
