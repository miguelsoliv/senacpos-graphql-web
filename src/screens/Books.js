import React, { useState, useEffect } from 'react'
import { Table, Button } from 'antd';
import ModalCreateBook from '../components/ModalCreateBook';
import { useQuery, useSubscription } from 'react-apollo';
import gql from 'graphql-tag';

// const dataSource = [
//     {
//         id: "1",
//         title: "Teste",
//         ISBN: 2193821,
//         publicationDate: "2019-05-05",
//         genre: "ADVENTURE",
//         writerName: "Miguel",
//     }, {
//         id: "2",
//         title: "Teste",
//         ISBN: 2193821,
//         publicationDate: "2019-05-05",
//         genre: "ADVENTURE",
//         writerName: "Miguel",
//     }, {
//         id: "3",
//         title: "Livro Teste",
//         ISBN: 13412312,
//         publicationDate: "2019-05-05",
//         genre: null,
//         writerName: "Miguel",
//     }
// ]

const columns = [
    {
        title: 'Título',
        dataIndex: 'title',
        key: 'title',
    },
    {
        title: 'ISBN',
        dataIndex: 'ISBN',
        key: 'ISBN',
    },
    {
        title: 'Data de Publicação',
        dataIndex: 'publicationDate',
        key: 'publicationDate',
    },
    {
        title: 'Genero',
        dataIndex: 'genre',
        key: 'genre',
    },
    {
        title: 'Autor',
        dataIndex: 'writer.firstname',
        key: 'writer',
    },
];

export default function Books() {
    const [active, setActive] = useState(false)

    const { data, loading, refetch, updateQuery } = useQuery(gql`
        query allBooks {
            allBooks {
                id
                title
                ISBN
                publicationDate
                genre
                writer {
                    id
                    firstname
                }
            }
        } 
    `)

    useSubscription(gql`
        subscription {
            onCreatedBook {
                id
                title
                ISBN
                publicationDate
                genre
                writer {
                    id
                    firstname
                }
            }
        }
    `, {
            onSubscriptionData({ subscriptionData }) {
                updateQuery((prev) => {
                    if (!subscriptionData.data) {
                        return prev
                    }

                    return Object.assign({}, prev, {
                        allBooks: [
                            ...prev.allBooks,
                            subscriptionData.data.onCreatedBook
                        ]
                    })
                })
            }
        })

    useEffect(() => {
        refetch()
    }, [active, refetch])


    return (
        <>
            <Button type="primary" onClick={() => setActive(true)} style={{ marginBottom: 16 }}>
                Adicionar
            </Button>
            <Table dataSource={data && data.allBooks} loading={loading} columns={columns} pagination={false} />
            <ModalCreateBook active={active} setActive={setActive} />
        </>
    )
}
