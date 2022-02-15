var serverUrl = "https://site202109.tw.cs.unibo.it/";
//var serverUrl = "https://localhost:8000/";

var funzionario = JSON.parse(sessionStorage.getItem('user')).nome;

$(document).ready(function(){
  setactive_side("home");

  let auth = sessionStorage.getItem('permesso');
  if (parseInt(auth) < 2)
  {
    window.location.href = serverUrl
  }
})


async function setactive_side(id)
{
    let active = document.getElementsByClassName("active_side");
    for(act of active)
    {
        $(act).removeClass("active_side");
    }

    $("#" + id).addClass("active_side");

    switch (id)
    {
        case "home":
            await renderHome();
            break;

        case "catalogo":
            await renderCatalogo();
            break;

        case "anagrafica":
            await renderAnagrafica();
            break;

        case "noleggi":
            await renderNoleggi();
            break;

        case "addelem":
            await renderAddelem();
            break;

        default:
            console.log(`ID ${id} non trovato`);
    }
}

async function renderHome()
{
    $("#textdiv").empty();
    $("#textdiv").append(`<div><h1>Benvenuto nel Back Office di NoloNolo+ ${funzionario}</div>`);
    $("#textdiv").attr("aria-label", "Contenuto principale: messaggio di saluto");
}
