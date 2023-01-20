export function fecharModal() {
    const btnFechar = document.querySelector("#BtnFecharModal")
    const modal = document.querySelector("#modal__container")
    const modalConteudo = document.querySelector(".modal__container--content")

    btnFechar.addEventListener("click", () => {
        modal.close()
        modalConteudo.innerHTML = ""
    })

    modal.addEventListener("click", (event) => {
        if (event.target.id == "modal__container") {
            modal.close()
            modalConteudo.innerHTML = ""
        }
    })
}
fecharModal()