import React from 'react';
import { MainLayout } from '../../Layouts/MainLayout';
import { DataTable } from '../../Components/organisms/DataTable';
import { IMovie } from 'interface-models/movie/movie.interface';
import { IPaginationMeta } from 'apps/backoffice/src/common/interface/index.interface';
import { ColumnsType } from 'antd/es/table';
import { useTableFilter } from '../../Utils/hooks';
import { paginationTransform } from '../../Components/organisms/DataTable/DataTable';
import { formatDate } from '../../Utils/utils';
import { Button } from '../../Components/atoms/Button';
import { Route, route } from '../../Common/Route/Route';

interface IProps {
    data: IMovie[];
    meta: IPaginationMeta;
}

interface IFilters {
    title: string;
    overview: string;
    releaseDate: string;
    createdAt: string;
}

const IndexPage = (props: IProps) => {
    const {
        implementTableFilter,
        filters,
        status: { isFetching },
    } = useTableFilter<IFilters>();

    const colums: ColumnsType<IMovie> = [
        {
            title: 'Title',
            dataIndex: 'title',
            align: 'center',
        },
        {
            title: 'Tags',
            dataIndex: 'tags',
            align: 'center',
        },
        {
            title: 'Overview',
            dataIndex: 'overview',
            align: 'center',
        },
        {
            title: 'Release Date',
            dataIndex: 'playUntil',
            align: 'center',
            render: (value: string) => formatDate(value),
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            align: 'center',
            render: (value: string) => formatDate(value),
        },
        {
            title: 'Poster',
            dataIndex: 'poster',
            align: 'center',
        },
        {
            title: 'Action',
            dataIndex: 'id',
            align: 'center',
            render: (value, record) => (
                <Button href={route(Route.MovieEdit, { id: record.id })}>
                    Edit
                </Button>
            ),
        },
    ];

    return (
        <MainLayout
            title="Movies CRUD"
            topActions={
                <Button href={Route.MovieCreate} size="middle" type="primary">
                    New Movie
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
