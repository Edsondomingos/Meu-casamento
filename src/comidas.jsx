import { useState, useEffect } from 'react'
import './convidados.css'

function Comidas() {
    const [nomeComida, setNomeComida] = useState('')
    const [comidas, setComidas] = useState([])
    const [comidasSalvas, setComidasSalvas] = useState(0)

    const indexDB = () => {
        localforage.config({
            driver: localforage.INDEXEDDB, // Tenta usar IndexedDB primeiro
            name: 'meu-casamento', // Nome do banco de dados
            version: 1.0,
            storeName: 'lista-comidas', // Nome da "tabela" onde os dados serão salvos
            description: 'Armazenamento de dados da aplicação'
        })
    }

    useEffect(() => {
        const carregarListaComidas = async () => {
            indexDB()
            try {
                const listaSalva = await localforage.getItem('lista-comidas')
                if (listaSalva) {
                    setComidas(listaSalva)
                } else {
                    await localforage.setItem('lista-comidas', [])
                }
            } catch (error) {
                console.error('Erro ao carregar a lista de comidas:', error)
            }
        }

        carregarListaComidas()
    }, [])

    const adicionarComida = async (nome) => {
        setComidas([...comidas, nome])
        indexDB()
    }

    const removerComida = (index) => {
        const novaLista = [...comidas]
        novaLista.splice(index, 1)
        setComidas(novaLista)
        if (novaLista.length === 0) {
            localforage.removeItem('lista-comidas')
        }
    }

    const salvarListaComidas = async () => {
        indexDB()
        try {
            await localforage.setItem('lista-comidas', comidas)
            const listaSalva = await localforage.getItem('lista-comidas')
            setComidasSalvas(listaSalva.length)
        } catch (error) {
            console.error('Erro ao salvar a lista de comidas:', error)
        }
    }

    return (
        <section className='lista'>
            <h2>Comida</h2>
            <input type="text" value={nomeComida} onChange={(e) => setNomeComida(e.target.value)} placeholder='Nome da comida' />
            <button onClick={() => adicionarComida(nomeComida)}>Adicionar</button>
            <article>
                {comidas.length > 0 ?
                    <>
                        <div className='convidado destaque'>
                            <p>{comidas.length} comidas</p>
                            <p>Lista salva com {comidasSalvas} nome(s)</p>
                            <button onClick={salvarListaComidas} className='btn-salvar'>salvar Lista</button>
                        </div>
                        {
                            comidas.map((comida, index) => (
                                <div key={index} className='convidado'>
                                    <p>{comida}</p>
                                    <button onClick={() => removerComida(index)}>Remover</button>
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

export default Comidas