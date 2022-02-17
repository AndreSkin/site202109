
async function renderAddelem() {
    $("#textdiv").empty();
    $("#textdiv").append(`
      <h3>Aggiungi un utente o un ufficio</h3>
      <div class="butdiv">
        <button type="button" class="btn btn-success disp-btn" onclick="renderaddPerson()">Aggiungi un utente</button>
        <button type="button" class="btn btn-success disp-btn" onclick="renderaddOffice()">Aggiungi un ufficio</button>
        <p role="alert" class="sr-only sr-only-focusable">Pagina aggiungi caricata: scegliere la funzione desiderata</p>
        </div>
        <hr>
      `)
      $("#textdiv").attr("aria-label", "Contenuto principale: Scelta dell'elemento da aggiungere");
}

async function renderaddPerson() {
  //Form per inserire persone
  let url = serverUrl + 'mongo/posthere'
  let type = 'user';
    $("#textdiv").empty();
    $("#textdiv").attr("aria-label", "Contenuto principale: form per aggiungere un nuovo utente");
    $("#textdiv").append(`
    <h3>Aggiungi un utente</h3>

    <form method='post' action="${url}?type=${type}" enctype="multipart/form-data" id="tosub">

    <fieldset>
     <legend>Tipo di utente da inserire</legend>
    <div class="form-check">
        <input class="form-check-input" type="radio" value="user" name="Radiogrouptype" id="user" checked>
        <label class="form-check-label" for="user">
          Utente
        </label>
        </div>

        <div class="form-check">
        <input class="form-check-input" type="radio" value="dipendente" name="Radiogrouptype" id="Dipendente">
        <label class="form-check-label" for="Dipendente">
          Funzionario
        </label>
          </div>

        <div class="form-check">
        <input class="form-check-input" type="radio" value="manager" name="Radiogrouptype" id="Manager">
        <label class="form-check-label" for="Manager">
          Manager
        </label>
    </div>
    </fieldset>


    <div class="mb-3">
      <label for="image" class="form-label">Immagine profilo</label>
        <input type='file' class="imgup" id="image" name="image" accept="image/*" aria-describedby="imghelp"></input>
        <div id="imghelp" class="form-text">Immagine profilo dell'utente</div>
      </div>

        <div class="mb-3">
          <label for="name" class="form-label">Nome</label>
          <input type="text" class="form-control" placeholder="Nome dell'utente" id="name" name="nome" aria-describedby="namehelp"></input>
          <div id="namehelp" class="form-text">Nome dell'utente</div>
        </div>

      <div class="mb-3">
      <label for="address" class="form-label">Indirizzo</label>
      <input type="text" class="form-control" placeholder="Indirizzo dell'utente" id="address" name="address" aria-describedby="addresshelp"></input>
      <div id="addresshelp" class="form-text">Indirizzo dell'utente</div>
    </div>

      <div class="mb-3">
      <label for="mail" class="form-label">Mail</label>
      <input type="email" class="form-control" placeholder="Mail dell'utente" id="mail" name="mail" aria-describedby="mailhelp"></input>
      <div id="mailhelp" class="form-text">Mail dell'utente</div>
    </div>

    <button type="submit" class="btn btn-primary" >Aggiungi</button>
    <button type="button" class="btn btn-warning" onclick="renderAddelem()">Annulla</button>
</form>
<p role="alert" class="sr-only sr-only-focusable">Form per aggiungere persone caricato</p>
`);

    $("form input").attr("required", true);
    $("#image").prop("required",false);


    $("input[type='radio']").change(function(){
    if ($("input[type='radio']:checked").val()!="user")
    {
      $("#image").prop("disabled",true);
      $("#image").prop("aria-disabled",true);
    }
    else
    {
      $("#image").prop("disabled",false);
      $("#image").prop("aria-disabled",false);
    }
    type = $("input[type='radio']:checked").val();
  });


    $("form").submit(function (e) {
        e.preventDefault();

        let form = $('#tosub')[0];

        let data = new FormData(form);

        $.ajax({
            type: "POST",
            enctype: 'multipart/form-data',
            url: `${url}?type=${type}`,
            data: data,
            processData: false,
            contentType: false,
            success: function (data) {
                renderAddelem();
                $("#textdiv").prepend(`<div class="success_upd">${data.msg}</div>`);
                setTimeout(function () { $(".success_upd").remove() }, 10000);
            },
            error: function (data) {
                $("#textdiv").prepend(`<div class="fail_upd">Inserimento fallito</div>`);
                setTimeout(function () { $(".fail_upd").remove() }, 10000);
            }
        });
      });
}



async function renderaddOffice() {
  //Form per aggiungere uffici
  let url = serverUrl + 'mongo/posthere'
    $("#textdiv").empty();
    $("#textdiv").attr("aria-label", "Contenuto principale: form per inserire un nuovo ufficio");
    $("#textdiv").append(`
    <h3>Aggiungi un ufficio</h3>

    <form method='post' action="${url}?type=uffici" enctype="multipart/form-data" id="tosub_off">

    <div class="mb-3">
      <label for="image" class="form-label">Immagine dell'ufficio</label>
        <input type='file' class="imgup" id="image" name="image" accept="image/*" aria-describedby="imghelp" required></input>
        <div id="imghelp" class="form-text">Immagine dell'ufficio</div>
      </div>

        <div class="mb-3">
          <label for="name" class="form-label">Nome</label>
          <input type="text" class="form-control" placeholder="Nome dell'ufficio" id="name" name="nome" aria-describedby="namehelp"></input>
          <div id="namehelp" class="form-text">Nome dell'ufficio</div>
        </div>

      <div class="mb-3">
      <label for="address" class="form-label">Indirizzo</label>
      <input type="text" class="form-control" placeholder="Indirizzo dell'ufficio" id="address" name="indirizzo" aria-describedby="addresshelp"></input>
      <div id="addresshelp" class="form-text">Indirizzo dell'ufficio</div>
    </div>

    <div class="mb-3">
      <label for="mq" class="form-label">Metri quadri</label>
      <input type="number" min="20" max="500" class="form-control" placeholder="Grandezza dell'ufficio in MQ" id="mq" name="mq" value="80" aria-describedby="mqhelp"></input>
      <div id="mqhelp" class="form-text">Metri quadri dell'ufficio</div>
    </div>

    <div class="mb-3">
      <label for="tier" class="form-label">Tier</label>
      <input type="number" min="1" max="3" class="form-control" placeholder="Tier dell'ufficio" id="tier" name="tier" value="2" aria-describedby="tierhelp"></input>
      <div id="tierhelp" class="form-text">Tier dell'ufficio</div>
    </div>

    <div class="mb-3">
    <label for="stato" class="form-label">Stato</label>
    <select class="form-select selform" aria-label="Selezione stato dell'ufficio" id="stato" name="stato" aria-describedby="statushelp"></input>
      <option value="pessimo">Pessimo</option>
      <option value="sufficiente">Sufficiente</option>
      <option selected value="buono">Buono</option>
      <option value="ottimo">Ottimo</option>
    </select>
      <div id="statushelp" class="form-text">Stato dell'ufficio</div>
    </div>

    <div class="mb-3">
      <label for="costo" class="form-label">Costo base</label>
      <input type="number" min="20" max="500" class="form-control" placeholder="Costo base dell'ufficio" id="costo" name="costo_base" value="120" aria-describedby="costohelp"></input>
      <div id="costohelp" class="form-text">Costo base dell'ufficio</div>
    </div>

    <div class="mb-3">
    <label for="desc" class="form-label">Descrizione</label>
    <textarea class="form-control" aria-label="Descrizione ufficio" id="desc" name="descrizione" aria-describedby="descriptionhelp" required></textarea>
    <div id="descriptionhelp" class="form-text">Descrizione dell'ufficio</div>
    </div>

    <div class="mb-3">
      <label for="ann" class="form-label">Annotazioni</label>
      <textarea class="form-control" aria-label="Annotazioni" id="ann" name="annotazione" aria-describedby="annhelp"></textarea>
      <div id="annhelp" class="form-text">Annotazioni riguardo l'ufficio</div>
    </div>

        <button type="submit" class="btn btn-primary">Aggiungi</button>
        <button type="button" class="btn btn-warning" onclick="renderAddelem()">Annulla</button>
    </form>
    <p role="alert" class="sr-only sr-only-focusable">Form per inserire uffici caricato</p>
  `);
    $("input").attr("required", true);
    $("#ann").attr("required", false);

    $("form").submit(function (e) {
        e.preventDefault();

        let form = $('#tosub_off')[0];

        let data = new FormData(form);

        $.ajax({
            type: "POST",
            enctype: 'multipart/form-data',
            url: `${url}?type=uffici`,
            data: data,
            processData: false,
            contentType: false,
            success: function (data) {
                renderAddelem();
                $("#textdiv").prepend(`<div class="success_upd">${data.msg}</div>`);
                setTimeout(function () { $(".success_upd").remove() }, 10000);
            },
            error: function (data) {
                $("#textdiv").prepend(`<div class="fail_upd">Inserimento fallito</div>`);
                setTimeout(function () { $(".fail_upd").remove() }, 10000);
            }
        });
      });
}
