/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
import * as yup from 'yup';
import React from 'react';
import {
    Form,
    Checkbox,
    Button,
    Input,
    Typography,
    Space,
    notification,
    Row,
    Col,
    Select,
} from 'antd';
import { LoginLayout } from '../Layouts';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import { Link } from '@inertiajs/inertia-react';
import { TInertiaProps } from '../Modules/Inertia/Entities';
import { createYupSync, isMobileScreen } from '../Utils/utils';
import { themeColors } from '../Utils/theme';
import { FormContainer } from '../Components/organisms/FormContainer';
import { TRegister } from '../Modules/Auth/Register/Entities';
import { doRegister } from '../Modules/Auth/Register/Action';
import { IUserForm } from '../Modules/User/Entities';
import { IRole } from '../Modules/Role/Entities';
import { IUser } from '../Modules/Profile/Entities';

const schema: yup.SchemaOf<IUserForm> = yup.object().shape({
    email: yup
        .string()
        .email('Field Email wajib berformat email')
        .required('Field Email wajib diisi'),
    password: yup
        .string()
        .required('Field password is required')
        .min(8, 'Password at least have 8 character')
        .test(
            'isFormatValid',
            'At least password has include 1 number and Alphabet',
            (value) => {
                const hasUpperCase = /[A-Z]/.test(value);
                const hasNumber = /[0-9]/.test(value);

                if (hasNumber && hasUpperCase) {
                    return true;
                }

                return false;
            },
        ),
    phoneNumber: yup.string().required('Field Phone Number wajib diisi'),
    fullname: yup.string().required('Field Full Name wajib diisi'),
    roles: yup.array().of(yup.number().required('Field roles is required')),
});

const formItemSpacingStyle = {
    marginBottom: '16px',
};

interface IProps extends TInertiaProps {
    roles: IRole[];
    data?: IUser;
}

const Register = (props: IProps) => {
    const yupSync = createYupSync(schema);
    const [form] = Form.useForm<TRegister>();

    const isMobile = isMobileScreen();

    const [api, contextHolder] = notification.useNotification();

    const openNotification = (type: string) => {
        if (type === 'error') {
            api.error({
                message: 'Error',
                description: 'Terjadi Kesalahan',
                placement: 'topRight',
            });
        }
        if (type === 'success') {
            api.success({
                message: 'Success',
                description: 'Welcome Joen Doe',
                placement: 'topRight',
            });
        }
    };

    const onSubmit = (registerData: TRegister): void => {
        doRegister(registerData);
    };

    return (
        <LoginLayout title="Login">
            {contextHolder}

            <Row align="middle" justify="center" style={{ height: '80%' }}>
                <Col
                    span={24}
                    style={{ padding: `4rem ${isMobile ? '' : '7rem'}` }}
                >
                    <Space
                        direction="vertical"
                        style={{
                            width: '100%',
                            alignItems: 'center',
                            textAlign: 'center',
                        }}
                    >
                        <Typography.Title level={4}>Register</Typography.Title>
                        <Typography.Text style={{ opacity: 0.5 }}>
                            Welcome back! Register to continue
                        </Typography.Text>
                    </Space>

                    <FormContainer
                        form={form}
                        name="basic"
                        labelAlign="left"
                        initialValues={{ remember: true }}
                        autoComplete="off"
                        errors={props.error}
                        style={{ paddingTop: '2.5rem' }}
                        onFinish={onSubmit}
                        className="login-form"
                    >
                        <Form.Item
                            name={'fullname'}
                            rules={[yupSync]}
                            style={formItemSpacingStyle}
                        >
                            <Input name="fullname" placeholder="full name" />
                        </Form.Item>
                        <Form.Item
                            name={'phoneNumber'}
                            rules={[yupSync]}
                            style={formItemSpacingStyle}
                        >
                            <Input
                                name="phoneNumber"
                                placeholder="phone number"
                            />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            rules={[yupSync]}
                            style={formItemSpacingStyle}
                        >
                            <Input
                                placeholder="Email"
                                prefix={<UserOutlined />}
                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[yupSync]}
                            style={formItemSpacingStyle}
                        >
                            <Input.Password
                                placeholder="Password"
                                prefix={<LockOutlined />}
                            />
                        </Form.Item>
                        <Form.Item name="roles" rules={[yupSync]} required>
                            <Select placeholder="Select" mode="multiple">
                                {props.roles.map((role) => (
                                    <Select.Option
                                        value={role.id}
                                        key={role.id}
                                    >
                                        {role.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item style={formItemSpacingStyle}>
                            <Form.Item
                                name="remember"
                                valuePropName="checked"
                                noStyle
                            >
                                <Checkbox>Remember me</Checkbox>
                            </Form.Item>
                            <Link
                                href="/auth/forgot-password"
                                className="login-form-forgot"
                                style={{ color: themeColors.primary }}
                            >
                                Forgot Password?
                            </Link>
                        </Form.Item>
                        <Form.Item style={formItemSpacingStyle}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="login-form-button"
                            >
                                Register
                            </Button>
                        </Form.Item>
                        <Form.Item
                            style={{
                                textAlign: 'center',
                                ...formItemSpacingStyle,
                            }}
                        >
                            Or{' '}
                            <Link
                                href="/auth/login"
                                style={{ color: themeColors.primary }}
                            >
                                Login now!
                            </Link>
                        </Form.Item>
                    </FormContainer>
                </Col>
            </Row>
        </LoginLayout>
    );
};
export default Register;
