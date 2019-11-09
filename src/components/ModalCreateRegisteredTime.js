import React from 'react'
import { Modal, Form, Input, Icon, Select, notification } from 'antd';
import { useMutation } from 'react-apollo';
import gql from 'graphql-tag';

function ModalCreateRegisteredTime({ active, setActive, form: { getFieldDecorator, validateFields, resetFields } }) {
    const [mutate, { loading }] = useMutation(gql`
        mutation createRegisteredTime($data: CreateRegisteredTimeInput!) {
            createRegisteredTime(data: $data) {
                id
                timeRegistered
                user {
                    id
                    name
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
                            user: {
                                // Parse to Int using +
                                id: +user.id
                            }
                        }
                    }
                })
                if (!errors) {
                    notification.success({
                        message: `Hora ${data.createRegisteredTime.timeRegistered} cadastrada`
                    })
                    setActive(false)
                    resetFields()
                }
            }
        })
    }

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
                    {getFieldDecorator('timeRegistered', {
                        rules: [{ required: true, message: 'Digite a hora do ponto' }],
                    })(
                        <Input
                            prefix={<Icon type="clock-circle" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Hora"
                        />
                    )}
                </Form.Item>
                <Form.Item>
                    <Select placeholder="Selecione o tipo de ponto">
                        <Select.Option value="ENTRANCE">Entrada</Select.Option>
                        <Select.Option value="EXIT">Saída</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default Form.create({ name: 'create-registered-time' })(ModalCreateRegisteredTime)
