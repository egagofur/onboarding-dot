import React, { useContext } from 'react';
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
import { Space, Tag } from 'antd';
import { deleteMovie } from '../../Modules/Movies/Action';
import { AppContext } from '../../Contexts/App';
import { RowActionButtons } from '../../Components/molecules/RowActionButtons';
import { useModal } from '../../Utils/modal';

interface IProps {
    data: IMovie[];
    meta: IPaginationMeta;
}

interface IFilters {
    title: string;
}

const IndexPage = (props: IProps) => {
    const { notifyNavigating } = useContext(AppContext);
    const {
        implementTableFilter,
        filters,
        status: { isFetching },
    } = useTableFilter<IFilters>();

    const handleDeleteButton = async (id: number) => {
        try {
            deleteMovie(id);
            notifyNavigating();
        } catch (error) {
            console.log(error);
        }
    };

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
            render: (value, record) => {
                const tags = record.tag.map((tag) => tag.name).join(', ');
                return <Tag color="blue">{tags}</Tag>;
            },
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
            width: '142px',
            render: (value, record) => (
                <RowActionButtons
                    actions={[
                        {
                            type: 'edit',
                            href: route(Route.MovieEdit, { id: record.id }),
                        },
                        {
                            type: 'delete',
                            onClick: () => {
                                useModal({
                                    title: 'Are You Sure? ',
                                    type: 'confirm',
                                    variant: 'danger',
                                    onOk: () => handleDeleteButton(record.id),
                                });
                            },
                        },
                    ]}
                />
            ),
        },
    ];

    return (
        <MainLayout
            title="Movies CRUD"
            topActions={
                <Space>
                    <Button
                        href={Route.UploadPhoto}
                        size="middle"
                        type="primary"
                    >
                        Upload File
                    </Button>
                    <Button
                        href={Route.MovieCreate}
                        size="middle"
                        type="primary"
                    >
                        New Movie
                    </Button>
                </Space>
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
