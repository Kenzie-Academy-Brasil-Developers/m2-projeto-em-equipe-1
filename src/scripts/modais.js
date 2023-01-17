const modal = document.querySelector("#modal__container")

modal.showModal()


function fecharModal() {
    const btnFechar = document.querySelector("#BtnFecharModal")
    const modal = document.querySelector("#modal__container")

    btnFechar.addEventListener("click", () => modal.close())

    modal.addEventListener("click", (event) => {
        if (event.target.id == "modal__container") {
            modal.close()
        }
    })
}
fecharModal()