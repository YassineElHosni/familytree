import React from 'react'
import { Form, Input, Modal, Select } from 'antd'

const GENDER_OPTIONS = ['MALE', 'FEMALE']

export default function MemberForm({ values, onSave, onCancel, members, isEdit }) {
    const [form] = Form.useForm()

    const gender = Form.useWatch('gender', form)
    const partner = Form.useWatch('partner', form)

    return (
        <Modal
            open={true}
            onOk={() => form.submit()}
            onCancel={onCancel}
            okText="Save"
            title={isEdit ? 'Edit member' : 'Create a member'}
        >
            <Form form={form} initialValues={values} onFinish={onSave} layout="vertical">
                <Form.Item hidden name="uid">
                    <Input />
                </Form.Item>
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
                    <Input placeholder="Set first name" />
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
                    <Input placeholder="Set last name" />
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
                    <Select
                        disabled={!!partner}
                        options={GENDER_OPTIONS.map(o => ({ label: o, value: o }))}
                        placeholder="Select gender"
                    />
                </Form.Item>
                <Form.Item
                    label={`Partner ${gender ? `(${gender === 'MALE' ? 'Wife' : 'Husband'})` : ''}`}
                    name="partner"
                >
                    <Select
                        allowClear={!isEdit}
                        options={
                            !gender
                                ? []
                                : members
                                      .filter(o => o.gender !== gender)
                                      .map(o => ({ label: `${o.firstName} ${o.lastName}`, value: o.uid }))
                        }
                        placeholder={!gender ? 'Must first select a gender !' : 'Select partner'}
                    />
                </Form.Item>
            </Form>
        </Modal>
    )
}
