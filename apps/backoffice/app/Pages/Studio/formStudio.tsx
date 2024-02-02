import React, { useContext } from 'react';
import { MainLayout } from '../../Layouts/MainLayout';
import { FormContainer } from '../../Components/organisms/FormContainer';
import { Section } from '../../Components/molecules/Section';
import * as yup from 'yup';
import { createYupSync } from '../../Utils/utils';
import { TInertiaProps } from '../../Modules/Inertia/Entities';
import { Button, Col, Form, Input, Row } from 'antd';
import { AppContext } from '../../Contexts/App';
import { Route } from '../../Common/Route/Route';
import { Link } from '@inertiajs/inertia-react';
import { IStudio } from 'interface-models/movie/studio.interface';
import { createStudio, updateStudio } from '../../Modules/Studio/Action';

interface IProps extends TInertiaProps {
    isEdit?: boolean;
    data: IStudio[];
    id: number;
}

const schema = yup.object().shape({
    studioNumber: yup.number().required('Field name is required'),
    seatCapacity: yup.number().required('Field name is required'),
});

const FormStudio = (props: IProps) => {
    const yupSync = createYupSync(schema);
    const [isLoading, setIsLoading] = React.useState(false);
    const { notifyNavigating } = useContext(AppContext);
    const [form] = Form.useForm();

    const onFinish = async (data: IStudio) => {
        setIsLoading(true);

        try {
            props.isEdit ? updateStudio(props.id, data) : createStudio(data);
            notifyNavigating();
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }
    };

    return (
        <MainLayout title={props?.isEdit ? 'Edit Form' : 'Create new studio'}>
            <Section
                style={{
                    width: '60%',
                    margin: 'auto',
                }}
            >
                <FormContainer
                    errors={props.error}
                    form={form}
                    onFinish={onFinish}
                    layout="vertical"
                    initialValues={
                        props.isEdit && {
                            ...props.data,
                        }
                    }
                    buttonAction={[
                        <Button>
                            <Link href={Route.Studios}>Cancel</Link>
                        </Button>,
                        <Button
                            type="primary"
                            htmlType="submit"
                            disabled={isLoading}
                        >
                            Save
                        </Button>,
                    ]}
                >
                    <Row gutter={12}>
                        <Col sm={12} lg={24}>
                            <Form.Item
                                label="Studio Number"
                                name="studioNumber"
                                required
                                rules={[yupSync]}
                            >
                                <Input placeholder="Studio Number" />
                            </Form.Item>
                        </Col>
                        <Col sm={12} lg={24}>
                            <Form.Item
                                label="Seat Capacity"
                                name="seatCapacity"
                                required
                                rules={[yupSync]}
                            >
                                <Input placeholder="Studio Capacity" />
                            </Form.Item>
                        </Col>
                    </Row>
                </FormContainer>
            </Section>
        </MainLayout>
    );
};

export default FormStudio;
