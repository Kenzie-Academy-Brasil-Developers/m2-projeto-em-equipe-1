import { fazerLogin } from "./index.js"
import { fecharModal } from "./modais.js"
import { toast } from "./toast.js"

const red = '#C20803'
const green = '#08C203'

export async function requisicaoFazerLogin(dados) {
    const requisicao = await fetch("http://localhost:3333/session/login", {
        method: "POST",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(dados)
    })

        const requisicaoJson = await requisicao.json()

        if(!requisicao.ok){
            toast(requisicaoJson.message, red)
        }

    return requisicaoJson
}

export async function requisicaoCadastrarUsuario(dados) {
    const requisicao = await fetch("http://localhost:3333/users", {
        method: "POST",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(dados)
    })

    const requisicaoJson = await requisicao.json()

        if(!requisicao.ok){
            toast(requisicaoJson.message, red)
        }

    return requisicaoJson
}

export async function requisicaoLerTodosOsPerfis(token) {
    const requisicao = await fetch("http://localhost:3333/users", {
        method: "GET",
        headers: {
            'Content-Type': "application/json",
            Authorization: `Bearer ${token}`
        }
    })

        .then(resp => resp.json())

    return requisicao
}

export async function requisicaoLerPerfil(token) {
    const requisicao = await fetch("http://localhost:3333/users/profile", {
        method: "GET",
        headers: {
            'Content-Type': "application/json",
            Authorization: `Bearer ${token}`
        }
    })

        .then(resp => resp.json())

    return requisicao
}

export async function requisicaoAtualizarPerfil(token, dados) {
    const requisicao = await fetch("http://localhost:3333/users/profile", {
        method: "PATCH",
        headers: {
            'Content-Type': "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(dados)
    })

        .then(resp => resp.json())

    return requisicao
}

export async function requisicaoDeletarPerfil(token) {
    const requisicao = await fetch("http://localhost:3333/users/profile", {
        method: "DELETE",
        headers: {
            'Content-Type': "application/json",
            Authorization: `Bearer ${token}`
        }
    })

        .then(resp => resp.json())

    return requisicao
}

export async function requisicaoCriarPet(token, dados) {
    const requisicao = await fetch("http://localhost:3333/pets", {
        method: "POST",
        headers: {
            'Content-Type': "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(dados)
    })

        .then(resp => resp.json())

    return requisicao
}

export async function requisicaoLerTodosOsPets(token) {
    const requisicao = await fetch("http://localhost:3333/pets", {
        method: "GET",
        headers: {
            'Content-Type': "application/json",
            Authorization: `Bearer ${token}`
        }
    })

        .then(resp => resp.json())

    return requisicao
}

export async function requisicaoLerOsMeusPets() {
    const requisicao = await fetch("http://localhost:3333/pets/my_pets", {
        method: "GET",
        headers: {
            'Content-Type': "application/json",
            Authorization: `Bearer ${token}`
        }
    })

        .then(resp => resp.json())

    return requisicao
}

export async function requisicaoEditarPetPeloId(id, token, dados) {
    const requisicao = await fetch(`http://localhost:3333/pets/${id}`, {
        method: "PATCH",
        headers: {
            'Content-Type': "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(dados)
    })

        .then(resp => resp.json())

    return requisicao
}

export async function requisicaoDeletarPetPeloId(id, token) {
    const requisicao = await fetch(`http://localhost:3333/pets/${id}`, {
        method: "DELETE",
        headers: {
            'Content-Type': "application/json",
            Authorization: `Bearer ${token}`
        }
    })

        .then(resp => resp.json())

    return requisicao
}

export async function requisicaoCriarAdocao(token, dados) {
    const requisicao = await fetch("http://localhost:3333/adoptions", {
        method: "POST",
        headers: {
            'Content-Type': "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(dados)
    })

        .then(resp => resp.json())

    return requisicao
}

export async function requisicaoLerAdocaoPeloId(id, token) {
    const requisicao = await fetch(`http://localhost:3333/adoptions/${id}`, {
        method: "GET",
        headers: {
            'Content-Type': "application/json",
            Authorization: `Bearer ${token}`
        }
    })

        .then(resp => resp.json())

    return requisicao
}

export async function requisicaoLerTodasAsAdocoes(token) {
    const requisicao = await fetch("http://localhost:3333/adoptions", {
        method: "GET",
        headers: {
            'Content-Type': "application/json",
            Authorization: `Bearer ${token}`
        }
    })

        .then(resp => resp.json())

    return requisicao
}

export async function requisicaoLerOsMeusAdotados() {
    const requisicao = await fetch("http://localhost:3333/adoptions/myAdoptions", {
        method: "GET",
        headers: {
            'Content-Type': "application/json",
            Authorization: `Bearer ${token}`
        }
    })

        .then(resp => resp.json())

    return requisicao
}

export async function requisicaoEditarAdotadoPeloId(id, token, dados) {
    const requisicao = await fetch(`http://localhost:3333/adoptions/update/${id}`, {
        method: "PATCH",
        headers: {
            'Content-Type': "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(dados)
    })

        .then(resp => resp.json())

    return requisicao
}

export async function requisicaoDeletarPetAdotadoPeloId(id, token) {
    const requisicao = await fetch(`http://localhost:3333/adoptions/delete/${id}`, {
        method: "DELETE",
        headers: {
            'Content-Type': "application/json",
            Authorization: `Bearer ${token}`
        }
    })

        .then(resp => resp.json())

    return requisicao
}