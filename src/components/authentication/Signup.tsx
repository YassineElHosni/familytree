import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { notification, Form, Input, Button } from "antd"

import useAuth from "../../contexts/auth-context"
import LoadingScreen from "../common/LoadingScreen"

export default function Signup() {
    const navigate = useNavigate()

    const authContext = useAuth()

    const [isLoading, setIsLoading] = useState(false)

    const onFinish = async (values: any) => {
        console.log("Success:", values)
        try {
            setIsLoading(true)
            await authContext.signup(values.email, values.password, values.username)
            notification.success({ message: "Sign up successfully!" })
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
        <Form name="basic" onFinish={onFinish} onFinishFailed={onFinishFailed}>
            {isLoading && <LoadingScreen />}
            <Form.Item label="Email" name="email" rules={[{ required: true, message: "Email required!" }]}>
                <Input />
            </Form.Item>

            <Form.Item label="Password" name="password" rules={[{ required: true, message: "Password required!" }]}>
                <Input.Password />
            </Form.Item>

            <Form.Item label="Username" name="username" rules={[{ required: true, message: "Username required!" }]}>
                <Input />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    )
}
