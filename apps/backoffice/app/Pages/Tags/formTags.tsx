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
import { ITags } from 'interface-models/movie/tags.interface';
import { Link } from '@inertiajs/inertia-react';
import { createTags, updateTags } from '../../Modules/Tags/Action';

interface IProps extends TInertiaProps {
    isEdit?: boolean;
    data: ITags[];
    id: number;
}

const schema = yup.object().shape({
    name: yup.string().required('Field name is required'),
});

const FormTags = (props: IProps) => {
    const yupSync = createYupSync(schema);
    const [isLoading, setIsLoading] = React.useState(false);
    const { notifyNavigating } = useContext(AppContext);
    const [form] = Form.useForm();

    const onFinish = async (data: ITags) => {
        setIsLoading(true);

        try {
            props.isEdit ? updateTags(props.id, data) : createTags(data);
            notifyNavigating();
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }
    };

    return (
        <MainLayout title={props?.isEdit ? 'Edit Form' : 'Create new tags'}>
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
                            <Link href={Route.Tags}>Cancel</Link>
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
                                label="Name"
                                name="name"
                                required
                                rules={[yupSync]}
                            >
                                <Input placeholder="Name" />
                            </Form.Item>
                        </Col>
                    </Row>
                </FormContainer>
            </Section>
        </MainLayout>
    );
};

export default FormTags;
