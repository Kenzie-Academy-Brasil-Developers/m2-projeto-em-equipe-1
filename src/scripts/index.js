import { fecharModal } from "../scripts/modais.js"
import { requisicaoCadastrarUsuario, requisicaoFazerLogin } from "../scripts/requests.js"
import { toast } from "./toast.js"

const red = '#C20803'
const green = '#08C203'


function protegerRota() {
    const usuario = JSON.parse(localStorage.getItem("@KenziePets:Usuario")) || []

    if (usuario.token) {
        window.location.replace("/src/pages/home.html")
    }
}

protegerRota()

function ativarHamburguer() {
    const menu = document.querySelector("#hamburguer")
    const botoes = document.querySelector("#menu")

    menu.addEventListener('click', () => {
        botoes.classList.toggle("hidden");

        if (!botoes.classList.contains("hidden")) {
            menu.innerText = "close"
        } else {
            menu.innerText = "menu"
        }
    })
}

function chamarFuncaoCadastro() {
    const btnCadastro = document.querySelector(".menu__registro > button")

    btnCadastro.addEventListener("click", () => fazerCadastro())
}

function chamarFuncaoLogin() {
    const btnLogin = document.querySelector(".menu__login > button")

    btnLogin.addEventListener("click", () => { fazerLogin() })
}

function fazerCadastro() {
    const modal = document.querySelector("#modal__container")
    const modalConteudo = document.querySelector(".modal__container--content")
    const usuario = {}

    modalConteudo.innerHTML = ""

    modalConteudo.insertAdjacentHTML("beforeend", `
    <h3 class="modal__container--content--titulo">Cadastrar</h3>
    <form>
        <input name="name" type="text" placeholder="Nome">
        <input name="email" type="text" placeholder="Email">
        <input name="password" type="password" placeholder="Senha">
        <input name="avatar_url" type="text" placeholder="Avatar?">
        <button id="modal__container--content--btn-fazer-cadastro">Cadastrar</button>
        <p>Já tem cadastro? <span>Clique aqui</span> para se logar.</p>
    </form>
    `)

    modal.showModal()
    fecharModal()

    const naoTemCadastro = document.querySelector(".modal__container--content > form > p > span")
    naoTemCadastro.addEventListener("click", () => {
        modal.close()
        fazerLogin()
    })

    const inputs = document.querySelectorAll(".modal__container--content > form > input")
    const btnFazerCadastro = document.querySelector("#modal__container--content--btn-fazer-cadastro")

    btnFazerCadastro.addEventListener("click", async (event) => {
        event.preventDefault()

        inputs.forEach(input => {
            usuario[input.name] = input.value
        })

        const requisicao = await requisicaoCadastrarUsuario(usuario)

        if (requisicao.id) {
            modal.close()
            toast("Usuário cadastrado com sucesso", green)
            setTimeout(() => fazerLogin(), 1500)
        }
    })
}

export function fazerLogin() {
    const modal = document.querySelector("#modal__container")
    const modalConteudo = document.querySelector(".modal__container--content")
    const usuario = {}


    modalConteudo.innerHTML = ""

    modalConteudo.insertAdjacentHTML("beforeend", `
    <h3 class="modal__container--content--titulo">Login</h3>
    <form>
        <input name="email" type="text" placeholder="Email">
        <input name="password" type="password" placeholder="Senha">
        <button id="modal__container--content--btn-fazer-login">Entrar</button>
        <p>Não tem cadastro? <span>Clique aqui</span> para se cadastrar.</p>
    </form>
    `)

    modal.showModal()
    fecharModal()

    const naoTemCadastro = document.querySelector(".modal__container--content > form > p > span")
    naoTemCadastro.addEventListener("click", () => {
        modal.close()
        fazerCadastro()
    })

    const inputs = document.querySelectorAll(".modal__container--content > form > input")
    const btnLogin = document.querySelector("#modal__container--content--btn-fazer-login")

    btnLogin.addEventListener("click", async (event) => {
        event.preventDefault()

        inputs.forEach(input => {
            usuario[input.name] = input.value
        })
        const requisicao = await requisicaoFazerLogin(usuario)

        if (requisicao.token) {
            modal.close()
            toast("Usuário logado com sucesso", green)
            localStorage.setItem("@KenziePets:Usuario", JSON.stringify(requisicao))
            setTimeout(() => window.location.replace("/src/pages/home.html"), 1000)
        }
    })
}

ativarHamburguer()
chamarFuncaoCadastro()
chamarFuncaoLogin()