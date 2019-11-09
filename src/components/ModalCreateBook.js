import React, { useState } from 'react'
import { Modal, Form, Input, Icon, Select, notification } from 'antd';
import { useMutation } from 'react-apollo';
import gql from 'graphql-tag';

function ModalCreateBook({ active, setActive, form: { getFieldDecorator, validateFields, resetFields } }) {

    const [mutate, { loading }] = useMutation(gql`
        mutation createBook($data: CreateBookInput!) {
            createBook(data: $data) {
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

    function onModalSubmit() {
        validateFields(async (err, values) => {
            if (!err) {
                const user = JSON.parse(localStorage.getItem('user'))

                const { data, errors } = await mutate({
                    variables: {
                        data: {
                            ...values,
                            ISBN: +values.ISBN,
                            writer: {
                                id: +user.id
                            }
                        }
                    }
                })
                if (!errors) {
                    notification.success({
                        message: `Livro ${data.createBook.title} cadastrado`
                    })
                    setActive(false)
                    resetFields()
                }
            }

        })
    }
    console.log(active)

    return (
        <Modal
            title="Title"
            visible={active}
            onOk={onModalSubmit}
            confirmLoading={loading}
            onCancel={() => setActive(false)}
        >
            <Form>
                <Form.Item>
                    {getFieldDecorator('title', {
                        rules: [{ required: true, message: 'Digite o titulo do livro' }],
                    })(
                        <Input
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Titulo"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('ISBN', {
                        rules: [{ required: true, message: 'Digite o ISBN do livro!' }],
                    })(
                        <Input
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="ISBN"
                            type="number"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('publicationDate', {
                        rules: [{ required: true, message: 'Digite a data de publicação!' }],
                    })(
                        <Input
                            prefix={<Icon type="calendar" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Data de publicação"
                            type="date"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('genre', {})(
                        <Select
                            placeholder="Selecione um genero"
                        >
                            <Select.Option value="COMEDY"> Comédia </Select.Option>
                            <Select.Option value="DRAMA">Drama </Select.Option>
                            <Select.Option value="FANTASY">Fantasia </Select.Option>
                            <Select.Option value="ACTION">Ação </Select.Option>
                            <Select.Option value="ADVENTURE"> Aventura </Select.Option>
                            <Select.Option value="HORROR"> Horror </Select.Option>
                            <Select.Option value="ROMANCE"> Romance </Select.Option>
                        </Select>,
                    )}
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default Form.create({ name: 'create-book' })(ModalCreateBook)