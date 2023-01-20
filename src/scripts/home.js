import { logoff } from './logoff.js';
import { fecharModal } from './modais.js';
import { requisicaoCriarAdocao, requisicaoLerPerfil, requisicaoLerTodosOsPets } from './requests.js';
import { toast } from './toast.js';

const token = localStorage.getItem( '@KenziePets:Usuario' );
if ( !token ) window.location.replace( '/' );

document.querySelector( '.menu__perfil' ).addEventListener( 'click', () => window.location.replace( '/src/pages/perfil.html' ) )
document.querySelector( '.menu__logout' ).addEventListener( 'click', () => logoff() )

const modal = document.getElementById( "modal__container" );
const modalContent = document.querySelector( ".modal__container--content" );
const red = '#C20803'
const green = '#08C203'

function ativarHamburguer() {
  const menu = document.querySelector( "#hamburguer" )
  const botoes = document.querySelector( "#menu" )

  menu.addEventListener( 'click', () => {
    botoes.classList.toggle( "hidden" );

    if ( !botoes.classList.contains( "hidden" ) ) {
      menu.innerText = "close"
    } else {
      menu.innerText = "menu"
    }
  } )
}

async function renderTodosPets() {
  const idUser = ( await requisicaoLerPerfil( token ) ).id;

  let todosOsPets = ( await requisicaoLerTodosOsPets( token ) ).filter( pet => pet.available_for_adoption );

  const listaDePets = document.querySelector( '.list-cards' );
  listaDePets.innerHTML = '';

  todosOsPets.forEach( pet => {
    const { name, species, available_for_adoption, avatar_url, id } = pet;

    listaDePets.insertAdjacentHTML( 'beforeend', `<li class="list-cards__li">
            <img class="list-cards__foto rounded-t-[4px]" src="${avatar_url ? avatar_url : 'https://via.placeholder/150/0F0'}" alt="animal">
            <div class="list-cards__info">
            <div class="flex flex-col">
              <span class="list-cards__nome">${name}</span>
              <span class="list-cards__especie mt-[4px]">${species}</span>
            </div>  
              <button class="list-cards__botao" data-user="${idUser}" data-id="${id}">${available_for_adoption ? 'Me adota ?' : 'Pet adotado'}</button>
            </div>
          </li>`)
  } );
  modalAdocao()
}
function modalAdocao() {
  const botoesMeAdota = document.querySelectorAll( "[data-id]" )
  botoesMeAdota.forEach( botao => {

    botao.addEventListener( "click", ( e ) => {
      modalContent.innerHTML = ''
      modalContent.insertAdjacentHTML( 'afterbegin',
        `<h3 class="modal__container--content--titulo">Deseja adotar o Pet?</h3>
      <button id="btn-cancelar">Não desejo adotá-lo</button>
      <button  id="btn-adotar">Quero adotar este Pet</button>` )

      reqAdotarPet( token, e.target.dataset.id );
      modal.showModal();
    } )

  } )
}

renderTodosPets();

function reqAdotarPet( token, id ) {
  const botaoCancelar = document.getElementById( 'btn-cancelar' );
  const botaoAdotar = document.getElementById( 'btn-adotar' );
  botaoCancelar.addEventListener( 'click', () => { modal.close() } )
  botaoAdotar.addEventListener( 'click', async ( event ) => {
    event.preventDefault();

    const adotarPet = await requisicaoCriarAdocao( token, { pet_id: id } );
    const { message, response } = adotarPet;

    if ( response || message ) toast( response || message, red )
    else { toast( 'O Pet foi adotado', green ); setTimeout( () => window.location.reload(), 1500 ) }
    modal.close();
  } );

}

fecharModal();
ativarHamburguer();
