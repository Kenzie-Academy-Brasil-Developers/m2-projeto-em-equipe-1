const modal = document.querySelector( "#modal__container" )
const modalContent = document.querySelector( ".modal__container--content" );

export function fecharModal() {
  const btnFechar = document.getElementById( "BtnFecharModal" )

  btnFechar.addEventListener( "click", () => { modal.close(); modalContent.innerHTML = '' } )
  modal.addEventListener( "click", ( event ) => {
    if ( event.target.id == "modal__container" ) { modal.close(); modalContent.innerHTML = '' }
  } )
}
fecharModal();
