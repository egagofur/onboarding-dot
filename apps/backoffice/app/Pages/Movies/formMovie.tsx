import React, { useContext } from 'react';
import { MainLayout } from '../../Layouts/MainLayout';
import { FormContainer } from '../../Components/organisms/FormContainer';
import { Section } from '../../Components/molecules/Section';
import * as yup from 'yup';
import { createYupSync } from '../../Utils/utils';
import { TInertiaProps } from '../../Modules/Inertia/Entities';
import { IMovie } from 'interface-models/movie/movie.interface';
import { ITags } from 'interface-models/movie/tags.interface';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import { BasicDatePicker } from '../../Components/molecules/Pickers/BasicDatePicker';
import dayjs from 'dayjs';
import { createMovie, updateMovie } from '../../Modules/Movie/Action';
import { AppContext } from '../../Contexts/App';
import { Route } from '../../Common/Route/Route';
import { Link } from '@inertiajs/inertia-react';

interface IProps extends TInertiaProps {
    isEdit?: boolean;
    data: IMovie;
    tags: ITags[];
}

const schema = yup.object().shape({
    title: yup.string().required('Field title is required'),
    overview: yup.string().required('Field overview is required'),
    poster: yup.string().required('Field poster is required'),
    playUntil: yup.string().required('Field play until is required'),
    shedule: yup.array().of(yup.number().required()),
    tags: yup.array().of(yup.number().required()),
});

const formMovie = (props: IProps) => {
    const yupSync = createYupSync(schema);
    const [isLoading, setIsLoading] = React.useState(false);
    const { notifyNavigating } = useContext(AppContext);
    const [form] = Form.useForm();

    const handlePlayUntilDateChange = (dateString: dayjs.Dayjs) => {
        form.setFieldValue('playUntil', dateString);
    };

    const onFinish = async () => {
        setIsLoading(true);
        const data = form.getFieldsValue();

        try {
            await form.validateFields();
            props.isEdit ? updateMovie(props.data.id, data) : createMovie(data);
            notifyNavigating();
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    };

    return (
        <MainLayout title={props?.isEdit ? 'Edit Form' : 'Create new Movie'}>
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
                            tags: props.data.tag.map((tag) => tag.id),
                        }
                    }
                    buttonAction={[
                        <Button>
                            <Link href={Route.Movies}>Cancel</Link>
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
                                label="Title"
                                name="title"
                                required
                                rules={[yupSync]}
                            >
                                <Input placeholder="Title" />
                            </Form.Item>
                        </Col>
                        <Col sm={12} lg={24}>
                            <Form.Item
                                label="Overview"
                                name="overview"
                                required
                                rules={[yupSync]}
                            >
                                <Input placeholder="Overview" />
                            </Form.Item>
                        </Col>
                        <Col sm={12} lg={24}>
                            <Form.Item
                                label="Poster"
                                name="poster"
                                required
                                rules={[yupSync]}
                            >
                                <Input placeholder="Link poster" />
                            </Form.Item>
                        </Col>
                        <Col sm={12} lg={24}>
                            <Form.Item
                                label="Play Until"
                                name="playUntil"
                                required
                                rules={[yupSync]}
                            >
                                <BasicDatePicker
                                    onChange={handlePlayUntilDateChange}
                                    style={{
                                        width: '100%',
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col sm={12} lg={24}>
                            <Form.Item
                                label="Tags"
                                name="tags"
                                required
                                rules={[yupSync]}
                            >
                                <Select
                                    placeholder="Select tag"
                                    mode="multiple"
                                >
                                    {props.tags.map((tag) => (
                                        <Select.Option
                                            key={tag.name}
                                            value={tag.id}
                                        >
                                            {tag.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </FormContainer>
            </Section>
        </MainLayout>
    );
};

export default formMovie;
