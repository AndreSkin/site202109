var serverUrl = "https://site202109.tw.cs.unibo.it/";
//var serverUrl = "https://localhost:8000/";

$(document).ready(function(){
  setactive_side("home");


  let auth = localStorage.getItem('permesso');
  if ((parseInt(auth) < 2)  || (localStorage.length < 1))
  {
    window.location.href = serverUrl;
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
            renderHome();
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

function renderHome()
{
    $("#textdiv").empty();
    $("#textdiv").append(`<div><h1>Benvenuto nel Back Office di NoloNolo+ ${JSON.parse(localStorage.getItem('user')).nome}</div>`);
    $("#textdiv").append(`
        <div>
        <h2>Cosa è possibile fare?</h2>
        <ul>
        <li><big>Per visualizzare l'inventario, le relative ìe disponibilità ed effettuare modifiche premere su Catalogo</big></li>
        <li><big>Per visualizzare l'anagrafica dei clienti ed effettuare modifiche premere su Anagrafica</big></li>
        <li><big>Per aggiungere un nuovo utente o un ufficio premere su Aggiungi</big></li>
        <li><big>Per visualizzare i noleggi in corso o quelli terminati con relative fatture premere su Noleggi</big></li>
        <li><big>Per accedere al front office premere su Front office</big></li>
        <li><big>Per accedere all'area manager premere su Area Manager</big> (potrebbe essere richiesto di autenticarsi)</li>
        </ul>
        </div>
      `);
    $("#textdiv").attr("aria-label", "Contenuto principale: messaggio di saluto");
}
