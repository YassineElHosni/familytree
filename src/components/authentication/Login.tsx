import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { notification, Form, Input, Checkbox, Button } from "antd"

import useAuth from "../../contexts/auth-context"
import LoadingScreen from "../common/LoadingScreen"

export default function Login() {
    const navigate = useNavigate()

    const authContext = useAuth()

    const [isLoading, setIsLoading] = useState(false)

    const onFinish = async (values: any) => {
        console.log("Success:", values)
        try {
            setIsLoading(true)
            await authContext.login(values.email, values.password)
            navigate("/")
        } catch {
            notification.error({ message: "Oops, an error occured!" })
        }
        setIsLoading(false)
    }

    const onFinishFailed = (errorInfo: any) => {
        console.log("Failed:", errorInfo)
    }

    return (
        <Form name="basic" initialValues={{ remember: true }} onFinish={onFinish} onFinishFailed={onFinishFailed}>
            {isLoading && <LoadingScreen />}
            <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: "Please input your username!" }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please input your password!" }]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
                <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    )
}
