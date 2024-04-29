import React from 'react'
import { Form, Input, Modal, Select } from 'antd'

const GENDER_OPTIONS = ['MALE', 'FEMALE']

export default function PersonForm({ values, onSave, onCancel, persons }) {
    const [form] = Form.useForm()

    const gender = Form.useWatch('gender', form)

    return (
        <Modal open={true} onOk={() => form.submit()} onCancel={onCancel} okText="Save">
            <Form form={form} initialValues={values} onFinish={onSave} layout="vertical">
                <Form.Item
                    label="First name"
                    name="firstName"
                    rules={[
                        {
                            required: true,
                            message: '${label} required!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Last name (family name)"
                    name="lastName"
                    rules={[
                        {
                            required: true,
                            message: '${label} required!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Gender"
                    name="gender"
                    rules={[
                        {
                            required: true,
                            message: '${label} required!',
                        },
                    ]}
                >
                    <Select options={GENDER_OPTIONS.map(o => ({ label: o, value: o }))} />
                </Form.Item>
                <Form.Item
                    label={`Partner ${gender ? `(${gender === 'MALE' ? 'Wife' : 'Husband'})` : ''}`}
                    name="partner"
                    rules={[
                        {
                            required: true,
                            message: '${label} required!',
                        },
                    ]}
                >
                    <Select
                        options={
                            !gender
                                ? []
                                : persons
                                      .filter(o => o.gender !== gender)
                                      .map(o => ({ label: `${o.firstName} ${o.lastName}`, value: o.uid }))
                        }
                    />
                </Form.Item>
            </Form>
        </Modal>
    )
}
