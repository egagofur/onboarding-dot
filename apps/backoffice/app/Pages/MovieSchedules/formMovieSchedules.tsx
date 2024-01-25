import React, { useContext } from 'react';
import * as yup from 'yup';
import { TInertiaProps } from '../../Modules/Inertia/Entities';
import { IMovieSchedule } from 'interface-models/movie/movie-schedule.interface';
import { createYupSync } from '../../Utils/utils';
import { AppContext } from '../../Contexts/App';
import { Button, Col, Form, InputNumber, Row, Select, TimePicker } from 'antd';
import { MainLayout } from '../../Layouts/MainLayout';
import { Section } from '../../Components/molecules/Section';
import { FormContainer } from '../../Components/organisms/FormContainer';
import { Link } from '@inertiajs/inertia-react';
import { Route } from '../../Common/Route/Route';
import { BasicDatePicker } from '../../Components/molecules/Pickers/BasicDatePicker';
import { IMovie } from 'interface-models/movie/movie.interface';
import { IStudio } from 'interface-models/movie/studio.interface';
import {
    createMovieSchedule,
    updateMovieSchedule,
} from '../../Modules/Movie-Schedules/Action';
import moment from 'moment-timezone';

interface IProps extends TInertiaProps {
    isEdit?: boolean;
    data: IMovieSchedule[];
    movies: IMovie[];
    studios: IStudio[];
    id: number;
}

const schema = yup.object().shape({
    startTime: yup.string().required('Field name is required'),
    endTime: yup.string().required('Field name is required'),
    price: yup.number().required('Field name is required'),
    date: yup.string().required('Field name is required'),
    movie: yup.number().required('Field name is required'),
    studios: yup.number().required('Field name is required'),
});

const formMovieSchedules = (props: IProps) => {
    const yupSync = createYupSync(schema);
    const [isLoading, setIsLoading] = React.useState(false);
    const { notifyNavigating } = useContext(AppContext);
    const [form] = Form.useForm();

    console.log(props);

    const onFinish = async () => {
        setIsLoading(true);
        const data = form.getFieldsValue();

        try {
            await form.validateFields();
            props.isEdit
                ? updateMovieSchedule(props.id, data)
                : createMovieSchedule(data);
            notifyNavigating();
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    };

    return (
        <MainLayout
            title={props?.isEdit ? 'Edit Form' : 'Create new Movie Schedule'}
        >
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
                            // @ts-ignore
                            startTime: moment(props?.data?.startTime),
                            // @ts-ignore
                            endTime: moment(props?.data?.endTime),
                            // @ts-ignore
                            movie: props?.data?.movie?.id,
                            // @ts-ignore
                            studios: props?.data?.studios?.id,
                        }
                    }
                    buttonAction={[
                        <Button>
                            <Link href={Route.MovieSchedules}>Cancel</Link>
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
                                label="Start time"
                                name="startTime"
                                required
                                rules={[yupSync]}
                            >
                                <TimePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col sm={12} lg={24}>
                            <Form.Item
                                label="End time"
                                name="endTime"
                                required
                                rules={[yupSync]}
                            >
                                <TimePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col sm={12} lg={24}>
                            <Form.Item
                                label="Price"
                                name="price"
                                required
                                rules={[yupSync]}
                            >
                                <InputNumber
                                    style={{
                                        width: '100%',
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col sm={12} lg={24}>
                            <Form.Item
                                label="Date"
                                name="date"
                                required
                                rules={[yupSync]}
                            >
                                <BasicDatePicker
                                    style={{
                                        width: '100%',
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col sm={12} lg={24}>
                            <Form.Item
                                label="Movie Name"
                                name="movie"
                                required
                                rules={[yupSync]}
                            >
                                <Select>
                                    {props?.movies?.map((movie) => (
                                        <Select.Option value={movie.id}>
                                            {movie.title}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col sm={12} lg={24}>
                            <Form.Item
                                label="Studio Number"
                                name="studios"
                                required
                                rules={[yupSync]}
                            >
                                <Select>
                                    {props?.studios?.map((studio) => (
                                        <Select.Option value={studio.id}>
                                            {studio.studioNumber}
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

export default formMovieSchedules;
