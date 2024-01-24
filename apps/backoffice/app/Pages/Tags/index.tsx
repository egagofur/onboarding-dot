import React, { useContext } from 'react';
import { MainLayout } from '../../Layouts/MainLayout';
import { ITags } from 'interface-models/movie/tags.interface';
import { IPaginationMeta } from 'apps/backoffice/src/common/interface/index.interface';
import { AppContext } from '../../Contexts/App';
import { ColumnsType } from 'antd/es/table';
import { Button, Space } from 'antd';
import { Route, route } from '../../Common/Route/Route';
import { DataTable } from '../../Components/organisms/DataTable';
import { useTableFilter } from '../../Utils/hooks';
import { paginationTransform } from '../../Components/organisms/DataTable/DataTable';
import { formatDate } from '../../Utils/utils';

interface IProps {
    data: ITags[];
    meta: IPaginationMeta;
}

interface IFilters {
    name: string;
}

const IndexPage = (props: IProps) => {
    const { notifyNavigating } = useContext(AppContext);

    const {
        implementTableFilter,
        filters,
        status: { isFetching },
    } = useTableFilter<IFilters>();

    const handleDeleteButton = (id: number) => {
        try {
        } catch (error) {}
    };

    const colums: ColumnsType<ITags> = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            align: 'center',
            render: (value) => formatDate(value),
        },
        {
            title: 'Action',
            dataIndex: 'id',
            align: 'center',
            render: (value, record) => (
                <Space>
                    <Button href={route(Route.TagsEdit, { id: record.id })}>
                        Edit
                    </Button>
                    <Button
                        onClick={() => handleDeleteButton(record.id)}
                        type="primary"
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <MainLayout
            title="CRUD Tags"
            topActions={
                <Button href={Route.TagsCreate} size="middle" type="primary">
                    New Tags
                </Button>
            }
        >
            <DataTable
                onChange={implementTableFilter}
                search={filters.search}
                pagination={paginationTransform(props.meta)}
                loading={isFetching}
                columns={colums}
                dataSource={props.data}
            />
        </MainLayout>
    );
};

export default IndexPage;
