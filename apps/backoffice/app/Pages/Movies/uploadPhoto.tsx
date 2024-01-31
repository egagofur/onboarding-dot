import React, { useContext, useState } from 'react';
import { MainLayout } from '../../Layouts/MainLayout';
import { Section } from '../../Components/molecules/Section';
import { FormContainer } from '../../Components/organisms/FormContainer';
import { TInertiaProps } from '../../Modules/Inertia/Entities';
import { Button, Form, message } from 'antd';
import Dragger from 'antd/es/upload/Dragger';
import * as yup from 'yup';
import { createYupSync } from '../../Utils/utils';
import { AppContext } from '../../Contexts/App';
import { uploadFile } from '../../Modules/Movies/Action';
import { InboxOutlined } from '@ant-design/icons';
import { Route } from '../../Common/Route/Route';

type IProps = TInertiaProps;

const schema = yup.object().shape({
    file: yup.mixed().required(),
});

const UploadPhoto = (props: IProps) => {
    const yupSync = createYupSync(schema);
    const [form] = Form.useForm();
    const { notifyNavigating } = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(false);

    const handleUpload = (info) => {
        if (form.getFieldValue('file').fileList.length > 1) {
            form.getFieldValue('file').fileList.shift();
        }
        if (info.file.status === 'done') {
            form.setFieldValue('file', info.file?.response.data.file_url);
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    };

    const onFinish = async (data: string) => {
        setIsLoading(true);

        try {
            uploadFile(data);
            notifyNavigating();
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }
    };

    return (
        <MainLayout title="Uploaded file">
            <Section>
                <FormContainer
                    form={form}
                    onFinish={onFinish}
                    errors={props.error}
                    centered
                    buttonAction={[
                        <Button
                            type="primary"
                            htmlType="submit"
                            disabled={
                                form
                                    .getFieldsError()
                                    .filter(({ errors }) => errors.length)
                                    .length > 0 && isLoading
                            }
                        >
                            Submit
                        </Button>,
                    ]}
                >
                    <Form.Item label="File" name="file" rules={[yupSync]}>
                        <Dragger
                            name="file"
                            onChange={handleUpload}
                            action={`${location.origin}${Route.UploadPhoto}`}
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">
                                Click or drag file to this area to upload
                            </p>
                        </Dragger>
                    </Form.Item>
                </FormContainer>
            </Section>
        </MainLayout>
    );
};

export default UploadPhoto;
