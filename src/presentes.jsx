import { useState, useEffect } from 'react'
import './convidados.css'

function Presentes() {
    const [nomePresente, setNomePresente] = useState('')
    const [presentes, setPresentes] = useState([])
    const [presentesSalvos, setPresentesSalvos] = useState(0)

    const indexDB = () => {
        localforage.config({
            driver: localforage.INDEXEDDB, // Tenta usar IndexedDB primeiro
            name: 'meu-casamento', // Nome do banco de dados
            version: 1.0,
            storeName: 'lista-presentes', // Nome da "tabela" onde os dados serão salvos
            description: 'Armazenamento de dados da aplicação'
        })
    }

    useEffect(() => {
        const carregarListaPresentes = async () => {
            indexDB()
            try {
                const listaSalva = await localforage.getItem('lista-presentes')
                if (listaSalva) {
                    setPresentes(listaSalva)
                } else {
                    await localforage.setItem('lista-presentes', [])
                }
            } catch (error) {
                console.error('Erro ao carregar a lista de presentes:', error)
            }
        }

        carregarListaPresentes()
    }, [])

    const adicionarPresente = async (nome) => {
        setPresentes([...presentes, nome])
        indexDB()
    }

    const removerPresente = (index) => {
        const novaLista = [...presentes]
        novaLista.splice(index, 1)
        setPresentes(novaLista)
        if (novaLista.length === 0) {
            localforage.removeItem('lista-presentes')
        }
    }

    const salvarListaPresentes = async () => {
        indexDB()
        try {
            await localforage.setItem('lista-presentes', presentes)
            const listaSalva = await localforage.getItem('lista-presentes')
            setPresentesSalvos(listaSalva.length)
        } catch (error) {
            console.error('Erro ao salvar a lista de presentes:', error)
        }
    }

    return (
        <section className='lista'>
            <h2>Presentes</h2>
            <input type="text" value={nomePresente} onChange={(e) => setNomePresente(e.target.value)} placeholder='Nome do presente' />
            <button onClick={() => adicionarPresente(nomePresente)}>Adicionar</button>
            <article>
                {presentes.length > 0 ?
                    <>
                        <div className='convidado destaque'>
                            <p>{presentes.length} presentes</p>
                            <p>Lista salva com {presentesSalvos} nome(s)</p>
                            <button onClick={salvarListaPresentes} className='btn-salvar'>salvar Lista</button>
                        </div>
                        {
                            presentes.map((presente, index) => (
                                <div key={index} className='convidado'>
                                    <p>{presente}</p>
                                    <button onClick={() => removerPresente(index)}>Remover</button>
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

export default Presentes