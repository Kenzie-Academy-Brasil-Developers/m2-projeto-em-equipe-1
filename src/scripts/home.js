import { pegaToken } from './global.js';
import { requisicaoCriarAdocao, requisicaoLerPerfil, requisicaoLerTodosOsPets } from './requests.js';

const token = pegaToken();
if ( !token ) window.location.replace( '/' );

const modal = document.getElementById( "modal__container" );
const modalContent = document.querySelector( ".modal__container--content" );

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
              <span class="list-cards__nome">${name}</span>
              <span class="list-cards__especie mt-[4px]">${species}</span>
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

    if ( response || message ) renderToast( response || message, 'bg-[var(--red)]' )
    else { renderToast( 'O Pet foi adotado', 'bg-[var(--green)]' ); setTimeout( () => window.location.reload(), 1500 ) }
    modal.close();
  } );

}

function fecharModal() {
  const btnFechar = document.getElementById( "BtnFecharModal" )

  btnFechar.addEventListener( "click", () => { modal.close(); modalContent.innerHTML = '' } )
  modal.addEventListener( "click", ( event ) => {
    if ( event.target.id == "modal__container" ) { modal.close(); modalContent.innerHTML = '' }
  } )
}
fecharModal();

function renderToast( text, color ) {
  const toast = document.getElementById( 'toast' );
  toast.classList.add( color )
  toast.insertAdjacentHTML( 'afterbegin', `<h2>${text}</h2>` );

  toast.show();
  setTimeout( () => toast.classList.add( 'close-error' ), 2000 )
  setTimeout( () => { toast.close(); toast.classList.remove( 'close-error', color ); toast.innerHTML = '' }, 3500 )
}
