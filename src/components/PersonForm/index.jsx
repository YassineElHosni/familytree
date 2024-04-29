import React from 'react'
import { Button, Form, Input, Select } from 'antd'

const GENDER_OPTIONS = ['male', 'female']

export default function PersonForm({ values, onChange }) {
    return (
        <Form initialValues={values} onFinish={onChange} layout="vertical">
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
                label="Last name"
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
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Save
                </Button>
            </Form.Item>
        </Form>
    )
}
