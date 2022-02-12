
async function renderAddelem() {
    $("#textdiv").empty();
    $("#textdiv").append(`
      <h3>Aggiungi un utente o un ufficio</h3>
        <button type="button" class="btn btn-success disp-btn" onclick="renderaddPerson()">Aggiungi un utente</button>
        <button type="button" class="btn btn-success disp-btn" onclick="renderaddOffice()">Aggiungi un ufficio</button>
      `)
}

async function renderaddPerson(type) {
    $("#textdiv").empty();
    $("#textdiv").append(`
    <h3>Aggiungi un utente</h3>

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

    <form>
        <div class="mb-3">
          <label for="name" class="form-label">Nome</label>
          <input type="text" class="form-control" placeholder="Nome dell'utente" id="name" aria-describedby="namehelp">
          <div id="namehelp" class="form-text">Nome dell'utente</div>
        </div>

      <div class="mb-3">
      <label for="address" class="form-label">Indirizzo</label>
      <input type="text" class="form-control" placeholder="Indirizzo dell'utente" id="address" aria-describedby="addresshelp">
      <div id="addresshelp" class="form-text">Indirizzo dell'utente</div>
    </div>

      <div class="mb-3">
      <label for="address" class="form-label">Mail</label>
      <input type="email" class="form-control" placeholder="Mail dell'utente" id="mail" aria-describedby="mailhelp">
      <div id="mailhelp" class="form-text">Mail dell'utente</div>
    </div>

    <button type="submit" class="btn btn-primary" onclick="addPerson()">Aggiungi</button>
    <button type="button" class="btn btn-warning" onclick="renderAddelem()">Annulla</button>
</form>
`);

    $("form input").attr("required", true);

    $("form").submit(function (e) {
        e.preventDefault();
    });

}
async function addPerson() {

    let chkd = $("input[type='radio']:checked").val();

    let persondata = {
        "nome": $(`#name`).val(),
        "indirizzo": $(`#address`).val(),
        "mail": $(`#mail`).val(),
        "psw": "default",
        "tier": "0",
        "img": "../img/avatar.jpg",
        "annotazioni": "",
        "storico": []
    };

    for (input of $("input")) {
        if (!(input.checkValidity())) {
            $(input).css({ "border": "1px solid red" });
            return;
        }
    }

    await $.ajax({
        url: serverUrl + `mongo/posthere?type=${chkd}`,
        type: 'POST',
        data: JSON.stringify(persondata),
        crossDomain: true,
        contentType: 'application/json',
        success: async function (data) {
            await renderAddelem();
            $("#textdiv").prepend(`<div class="success_upd">${data.msg}</div>`);
            setTimeout(function () { $(".success_upd").remove() }, 10000);
        },
        error: function (data) {
            $("#textdiv").prepend(`<div class="fail_upd">${data}</div>`);
            setTimeout(function () { $(".fail_upd").remove() }, 10000);
        }
    });

}

async function renderaddOffice() {
    $("#textdiv").empty();
    $("#textdiv").append(`
    <h3>Aggiungi un ufficio</h3>

    <form>
        <div class="mb-3">
          <label for="name" class="form-label">Nome</label>
          <input type="text" class="form-control" placeholder="Nome dell'ufficio" id="name" aria-describedby="namehelp">
          <div id="namehelp" class="form-text">Nome dell'ufficio</div>
        </div>

      <div class="mb-3">
      <label for="address" class="form-label">Indirizzo</label>
      <input type="text" class="form-control" placeholder="Indirizzo dell'ufficio" id="address" aria-describedby="addresshelp">
      <div id="addresshelp" class="form-text">Indirizzo dell'ufficio</div>
    </div>

    <div class="mb-3">
      <label for="mq" class="form-label">Metri quadri</label>
      <input type="number" min="20" max="500" class="form-control" placeholder="Grandezza dell'ufficio in MQ" id="mq" value="40" aria-describedby="mqhelp">
      <div id="mqhelp" class="form-text">Metri quadri dell'ufficio</div>
    </div>

    <div class="mb-3">
      <label for="tier" class="form-label">Tier</label>
      <input type="number" min="1" max="3" class="form-control" placeholder="Tier dell'ufficio" id="tier" value="2" aria-describedby="tierhelp">
      <div id="tierhelp" class="form-text">Tier dell'ufficio</div>
    </div>

    <div class="mb-3">
    <label for="stato" class="form-label">Stato</label>
    <select class="form-select selform" aria-label="Selezione stato dell'ufficio" id="stato" aria-describedby="statushelp">
      <option value="pessimo">Pessimo</option>
      <option value="sufficiente">Sufficiente</option>
      <option selected value="buono">Buono</option>
      <option value="ottimo">Ottimo</option>
    </select>
      <div id="statushelp" class="form-text">Stato dell'ufficio</div>
    </div>

    <div class="mb-3">
      <label for="costo" class="form-label">Costo base</label>
      <input type="number" min="20" max="500" class="form-control" placeholder="Costo base dell'ufficio" id="costo" value="120" aria-describedby="costohelp">
      <div id="costohelp" class="form-text">Costo base dell'ufficio</div>
    </div>

    <div class="mb-3">
    <label for="desc" class="form-label">Descrizione</label>
    <input type="text" class="form-control" placeholder="Descrizione dell'ufficio" id="desc" aria-describedby="descriptionhelp">
    <div id="descriptionhelp" class="form-text">Descrizione dell'ufficio</div>
    </div>

    <div class="mb-3">
      <label for="ann" class="form-label">Annotazioni</label>
      <input type="text" class="form-control" placeholder="Annotazioni riguardo l'ufficio" id="ann" aria-describedby="annhelp">
      <div id="annhelp" class="form-text">Annotazioni riguardo l'ufficio</div>
    </div>

<div class="disponibilita">
    <button type="button" class="btn btn-success disp-btn" onclick="disp(${-1})">Modifica disponibilità </button>
</div>

        <button type="submit" class="btn btn-primary" onclick="addoffice()">Aggiungi</button>
        <button type="button" class="btn btn-warning" onclick="renderAddelem()">Annulla</button>
    </form>
  `);
    $("input").attr("required", true);
    $("#ann").attr("required", false);

    $("form").submit(function (e) {
        e.preventDefault();
    });
}

async function addoffice() {
    let occupato = [];

    if ($("#start0").val() != undefined && $("#end0").val() != undefined) 
    {
        occupato.push({ "from": $("#start0").val(), "to": $("#end0").val() })
    }
    let formdata = {
        "nome": $(`#name`).val(),
        "indirizzo": $(`#address`).val(),
        "occupato": occupato,
        "mq": $(`#mq`).val(),
        "tier": $(`#tier`).val(),
        "stato": $(`#stato`).val(),
        "costo_base": $(`#costo`).val(),
        "img": "../img/Ufficio.jpg",
        "descrizione": $(`#desc`).val(),
        "annotazione": $(`#ann`).val(),
    };

    for (input of $("input")) {
        if (!(input.checkValidity())) {
            $(input).css({ "border": "1px solid red" });
            return;
        }
    }

    await $.ajax({
        url: serverUrl + "mongo/posthere?type=uffici",
        type: 'POST',
        data: JSON.stringify(formdata),
        crossDomain: true,
        contentType: 'application/json',
        success: function (data) {
            renderAddelem();
            $("#textdiv").prepend(`<div class="success_upd">${data.msg}</div>`);
            setTimeout(function () { $(".success_upd").remove() }, 10000);
        },
        error: function (data) {
            $("#textdiv").prepend(`<div class="fail_upd">${data}</div>`);
            setTimeout(function () { $(".fail_upd").remove() }, 10000);
        }
    });

}
