import React, { useState, useEffect } from 'react'
import { Table, Button } from 'antd';
import ModalCreateBook from '../components/ModalCreateBook';
import { useQuery, useSubscription } from 'react-apollo';
import gql from 'graphql-tag';

const columns = [
    {
        title: 'Hora Registrada',
        dataIndex: 'timeRegistered',
        key: 'timeRegistered'
    },
    {
        title: 'Usuário',
        dataIndex: 'user.name',
        key: 'user'
    }
];

export default function RegisteredTimes() {
    const [active, setActive] = useState(false)

    const { data, loading, refetch, updateQuery } = useQuery(gql`
        query allRegisteredTimes {
            allRegisteredTimes {
                id
                timeRegistered
                user {
                    id
                    name
                }
            }
        } 
    `)

    useSubscription(gql`
        subscription {
            onCreatedRegisteredTime {
                id
                timeRegistered
                user {
                    id
                    name
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
                    allRegisteredTimes: [
                        ...prev.allRegisteredTimes,
                        subscriptionData.data.onCreatedRegisteredTime
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
            <Table dataSource={data && data.allRegisteredTimes} loading={loading} columns={columns} pagination={false} />
            <ModalCreateBook active={active} setActive={setActive} />
        </>
    )
}
