import { pegaToken } from './global.js';
import { requisicaoAtualizarPerfil, requisicaoLerPerfil, requisicaoPetsUsuario, requisicaoCriarPet, requisicaoDeletarPerfil, requisicaoEditarPetPeloId } from './requests.js';

const token = pegaToken();
if ( !token ) window.location.replace( '/' );

const modal = document.getElementById( "modal__container" );
const modalContent = document.querySelector( ".modal__container--content" );

async function renderUsuario( token ) {
  const perfil = await requisicaoLerPerfil( token );
  const { name, email, avatar_url, id } = perfil;
  const img = document.querySelector( '.foto-de-perfil > img' );
  const nomeUsuario = document.querySelector( '.info-nome > span' );
  const emailUsuario = document.querySelector( '.info-email > span' );
  const botoesUsuario = document.querySelectorAll( '.botoes > button' );

  botoesUsuario.forEach( botao => { botao.dataset.idUsuario = id } )

  img.src = avatar_url ? avatar_url : '/src/assets/default-user.svg';
  img.alt = `Foto de perfil de: ${name}`;
  nomeUsuario.innerText = name ? name : 'Nome do usuário';
  emailUsuario.innerText = email;

}
renderUsuario( token );

async function renderPetsUsuario( especie ) {
  let todosOsPets = await requisicaoPetsUsuario( token );
  if ( especie ) { todosOsPets = todosOsPets.filter( pet => pet.species.toLowerCase() == especie.toLowerCase() ) };

  const listaDePets = document.querySelector( '.render-pets' );
  listaDePets.innerHTML = '';

  todosOsPets.forEach( pet => {
    const { name, species, available_for_adoption, avatar_url, id } = pet;
    const adotavel = available_for_adoption ? 'Sim' : 'Não';

    listaDePets.insertAdjacentHTML( 'beforeend', `<li class="pet flex flex-row rounded-[4px] w-full break-all max-h-[200px]">
      <img src="${avatar_url}" alt="Foto de: ${name}"
        class="max-w-[41.666666667%] object-cover rounded-l-[4px]">
      <div class="info-pet flex flex-col gap-[16px] px-[36px] py-[42px] justify-center">
        <div class="info-pet__dados flex flex-col flex-wrap gap-[8px]">
          <p class="font-semibold text-sm text-[var(--purple)] line-2">Nome:
            <span class="font-normal text-[var(--black)] first-letter:uppercase">${name}</span>
          </p>
          <p class="font-semibold text-sm text-[var(--purple)]">Espécie:
            <span
              class="font-normal text-[var(--black)] first-letter:uppercase">${species}</span>
          </p>
          <p class="font-semibold text-sm text-[var(--purple)]">Adotável:
            <span class="font-normal text-[var(--black)] first-letter:uppercase">${adotavel}</span>
          </p>
        </div>
        <button data-pet-id="${id}"
          class="bg-[var(--purple)] py-[4px] px-[16px] font-semibold text-sm text-[var(--white)] rounded-[var(--radius)] self-start">Atualizar</button>
      </div>
    </li>`)
  } );

  atualizaPet();
}
renderPetsUsuario();
;

function atualizaPerfil() {
  const botaoAtualizaPerfil = document.getElementById( 'atualiza-perfil' );

  botaoAtualizaPerfil.addEventListener( 'click', async ( e ) => {
    modalContent.innerHTML = ''
    modalContent.insertAdjacentHTML( 'afterbegin',
      `<h3 class="modal__container--content--titulo">Atualizar perfil</h3>
      <form>
        <input name="name" type="text" placeholder="Nome" class="text-[var(--black)]">
        <input name="avatar_url" type="text" placeholder="Avatar" class="text-[var(--black)]">
        <button id="atualizar-perfil">Atualizar</button>
      </form>` )

    reqPatchAtualizaPerfil( token );
    modal.showModal();
  } )
}
function reqPatchAtualizaPerfil( token ) {
  const botaoAtualizar = document.getElementById( 'atualizar-perfil' );

  botaoAtualizar.addEventListener( 'click', async ( event ) => {
    event.preventDefault();

    const inputs = document.querySelectorAll( '.modal__container--content form input' );
    const novosDados = {};
    inputs.forEach( input => novosDados[input.name] = input.value );
    const patch = await requisicaoAtualizarPerfil( token, novosDados );
    const { message, response } = patch;

    if ( message ) renderToast( message, 'bg-[var(--red)]' )
    else if ( response ) renderToast( response, 'bg-[var(--red)]' )
    else { renderToast( 'Perfil atualizado com sucesso', 'bg-[var(--green)]' ); setTimeout( () => { window.location.reload() }, 1500 ) }
    modal.close();
  } );
}
atualizaPerfil();

function deletaPerfil() {
  const botaoDeletaPerfil = document.getElementById( 'deleta-perfil' );

  botaoDeletaPerfil.addEventListener( 'click', ( e ) => {
    modalContent.innerHTML = ''
    modalContent.insertAdjacentHTML( 'afterbegin',
      `<h3 class="modal__container--content--titulo">Deseja mesmo deletar sua conta?</h3>
      <button id="btn-cancelar">Não desejo deletar minha conta</button>
      <button id="btn-deletar">Quero deletar minha conta</button>` )

    reqDeletePerfil( token );
    modal.showModal();
  } )
}
function reqDeletePerfil( token ) {
  const botaoCancelar = document.getElementById( 'btn-cancelar' );
  const botaoDeletar = document.getElementById( 'btn-deletar' );
  botaoCancelar.addEventListener( 'click', () => { modal.close() } )
  botaoDeletar.addEventListener( 'click', async ( event ) => {
    event.preventDefault();

    const deleteReq = await requisicaoDeletarPerfil( token );
    const { message, response } = deleteReq;

    if ( message ) { renderToast( 'Conta excluída com sucesso!', 'bg-[var(--green)]' ); setTimeout( () => { window.location.replace( '/' ) }, 1500 ) }
    else if ( response ) renderToast( response, 'bg-[var(--red)]' )
    modal.close();
  } );

}
deletaPerfil();

function renderOpcoes( idSelect ) {
  const select = document.getElementById( `${idSelect}` );
  ['Aves', 'Cachorro', 'Gato', 'Repteis', 'Outros'].forEach( especie => {
    select.insertAdjacentHTML( 'beforeend', `<option class="border-none outline-none bg-[var(--white)] text-[var(--light-purple)] cursor-pointer"
      value="${especie}">${especie}</option>` )
  } )

}
renderOpcoes( 'select-especies' )

function cadastrarPet() {
  const botaoRegistraPet = document.getElementById( 'registra-pet' );

  botaoRegistraPet.addEventListener( 'click', ( e ) => {
    modalContent.innerHTML = ''
    modalContent.insertAdjacentHTML( 'afterbegin',
      `<h3 class="modal__container--content--titulo">Cadastrar pet</h3>
      <form>
        <input name="name" type="text" placeholder="Nome" class="text-[var(--black)]">
        <input name="bread" type="text" placeholder="Raça" class="text-[var(--black)]">
        <select name="species" id="form-cadastro-pet__select-especies"
          class="focus:outline-none px-[16px] font-normal text-[var(--black)] cursor-pointer">
          <option class="bg-[var(--white)] text-[var(--light-purple)]"
            value="" selected disabled>Espécie</option>
        </select>
        <input name="avatar_url" type="text" placeholder="Avatar" class="text-[var(--black)]">
        <button id="btn-cadastrar">Cadastrar</button>
      </form>` )
    renderOpcoes( 'form-cadastro-pet__select-especies' );
    reqPostCadastrarPet( token );
    modal.showModal();
  } )
}
function reqPostCadastrarPet( token ) {
  const botaoCadastrar = document.getElementById( 'btn-cadastrar' );

  botaoCadastrar.addEventListener( 'click', async ( event ) => {
    event.preventDefault();
    const select = document.getElementById( 'form-cadastro-pet__select-especies' );
    const inputs = document.querySelectorAll( '.modal__container--content form input' );
    const dadosDeCadastro = { species: select.value };

    inputs.forEach( input => dadosDeCadastro[input.name] = input.value );
    select.addEventListener( 'change', ( e ) => { dadosDeCadastro[select.name] = select.value } )

    const cadastrarPetReq = await requisicaoCriarPet( token, dadosDeCadastro );
    const { message, response } = cadastrarPetReq;

    if ( message ) renderToast( message, 'bg-[var(--red)]' )
    else if ( response ) renderToast( response, 'bg-[var(--red)]' )
    else { renderToast( 'Pet cadastrado com sucesso!', 'bg-[var(--green)]' ); setTimeout( () => { window.location.reload() }, 1500 ) }
    modal.close();
  } );
}
cadastrarPet();

function filtraPets() {
  const select = document.getElementById( 'select-especies' );
  const botaoBusca = document.getElementById( 'busca-pet' );

  botaoBusca.addEventListener( 'click', ( e ) => { renderPetsUsuario( select.value ) } )
}
filtraPets()

function atualizaPet() {
  const buttons = document.querySelectorAll( '[data-pet-id]' );

  buttons.forEach( button => {
    button.addEventListener( 'click', ( e ) => {
      const id = e.target.dataset.petId
      modalContent.innerHTML = ''
      modalContent.insertAdjacentHTML( 'afterbegin',
        `<h3 class="modal__container--content--titulo">Atualizar pet</h3>
      <form>
      <input name="name" type="text" placeholder="Nome" class="text-[var(--black)]">
        <input name="bread" type="text" placeholder="Raça" class="text-[var(--black)]">
        <select name="species" id="form-atualizar-pet__select-especies"
          class="focus:outline-none px-[16px] font-normal text-[var(--black)] cursor-pointer">
          <option class="bg-[var(--white)] text-[var(--light-purple)]"
            value="" selected disabled>Espécie</option>
        </select>
        <input name="avatar_url" type="text" placeholder="Avatar" class="text-[var(--black)]">
        <button id="btn-atualizar-pet">Atualizar</button>
      </form>` )
      renderOpcoes( 'form-atualizar-pet__select-especies' );
      reqPatchAtualizaPet( token, id );
      modal.showModal();

    } )
  } )
}
function reqPatchAtualizaPet( token, id ) {
  const botaoAtualizar = document.getElementById( 'btn-atualizar-pet' );

  botaoAtualizar.addEventListener( 'click', async ( event ) => {
    event.preventDefault();

    const select = document.getElementById( 'form-atualizar-pet__select-especies' );
    const inputs = document.querySelectorAll( '.modal__container--content form input' );
    const novosDados = { species: select.value };

    inputs.forEach( input => novosDados[input.name] = input.value );
    select.addEventListener( 'change', ( e ) => { novosDados[select.name] = select.value } )

    const atualizarPetReq = await requisicaoEditarPetPeloId( id, token, novosDados );
    const { message, response } = atualizarPetReq;

    if ( message ) renderToast( message, 'bg-[var(--red)]' )
    else if ( response ) renderToast( response, 'bg-[var(--red)]' )
    else { renderToast( 'Perfil atualizado com sucesso', 'bg-[var(--green)]' ); modal.close(); setTimeout( () => { window.location.reload() }, 1500 ) }
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
