import { useState, useEffect } from 'react'

import './convidados.css'

function Convidados() {
    const [nomeConvidado, setNomeConvidado] = useState('')
    const [convidados, setConvidados] = useState([])
    const [convidadossalvos, setConvidadosSalvos] = useState(0)

    const indexDB = () => {
        localforage.config({
            driver: localforage.INDEXEDDB, // Tenta usar IndexedDB primeiro
            name: 'meu-casamento', // Nome do banco de dados
            version: 1.0,
            storeName: 'lista-convidados', // Nome da "tabela" onde os dados serão salvos
            description: 'Armazenamento de dados da aplicação'
        })
    }

    useEffect(() => {
        const carregarListaConvidados = async () => {
            indexDB()
            try {
                const listaSalva = await localforage.getItem('lista-convidados')
                if (listaSalva) {
                    setConvidados(listaSalva)
                    console.log('Lista de convidados carregada com sucesso!')
                }
            } catch (error) {
                console.error('Erro ao carregar a lista de convidados:', error)
            }
        }

        carregarListaConvidados()
    }, [])

    const adicionarConvidado = async (nome) => {
        setConvidados([...convidados, nome])
        indexDB()
    }

    const removerConvidado = (index) => {
        const novaLista = [...convidados]
        novaLista.splice(index, 1)
        setConvidados(novaLista)
        if (novaLista.length === 0) {
            localforage.removeItem('lista-convidados')
        }
    }

    const salvarListaConvidados = async () => {
        indexDB()
        try {
            await localforage.setItem('lista-convidados', convidados)
            const listaSalva = await localforage.getItem('lista-convidados')
            setConvidadosSalvos(listaSalva.length)
        } catch (error) {
            console.error('Erro ao salvar a lista de convidados:', error)
        }
    }

    return (
        <section className='lista'>
            <h2>Convidados</h2>
            <input type="text" value={nomeConvidado} onChange={(e) => setNomeConvidado(e.target.value)} placeholder='Nome convidado' />
            <button onClick={() => adicionarConvidado(nomeConvidado)}>Adicionar</button>
            <article>
                {convidados.length > 0 ?
                    <>
                        <div className='convidado destaque'>
                            <p>{convidados.length} convidados</p>
                            <p>Lista salva com {convidadossalvos} nome(s)</p>
                            <button onClick={salvarListaConvidados} className='btn-salvar'>salvar Lista</button>
                        </div>
                        {
                            convidados.map((convidado, index) => (
                                <div key={index} className='convidado'>
                                    <p>{convidado}</p>
                                    <button onClick={() => removerConvidado(index)}>Remover</button>
                                </div>
                            ))

                        }

                    </>
                    : "Lista vazia"
                }

            </article>
        </section>
    )
}

export default Convidados