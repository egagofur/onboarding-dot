import React, { useContext } from 'react';
import { MainLayout } from '../../Layouts/MainLayout';
import { IPaginationMeta } from 'apps/backoffice/src/common/interface/index.interface';
import { AppContext } from '../../Contexts/App';
import { ColumnsType } from 'antd/es/table';
import { Button } from 'antd';
import { Route, route } from '../../Common/Route/Route';
import { DataTable } from '../../Components/organisms/DataTable';
import { useTableFilter } from '../../Utils/hooks';
import { paginationTransform } from '../../Components/organisms/DataTable/DataTable';
import { formatDate } from '../../Utils/utils';
import { RowActionButtons } from '../../Components/molecules/RowActionButtons';
import { useModal } from '../../Utils/modal';
import { IMovieSchedule } from 'interface-models/movie/movie-schedule.interface';
import { deleteMovieSchedule } from '../../Modules/MovieSchedules/Action';
import { Section } from '../../Components/molecules/Section';

interface IProps {
    data: IMovieSchedule[];
    meta: IPaginationMeta;
    movieNowPlaying: IMovieSchedule[];
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
            deleteMovieSchedule(id);
            notifyNavigating();
        } catch (error) {
            console.log(error);
        }
    };

    const colums: ColumnsType<IMovieSchedule> = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: 'Start Time',
            dataIndex: 'startTime',
            align: 'center',
            render: (value) => formatDate(value),
        },
        {
            title: 'End Time',
            dataIndex: 'endTime',
            align: 'center',
            render: (value) => formatDate(value),
        },
        {
            title: 'Price',
            dataIndex: 'price',
            align: 'center',
        },
        {
            title: 'Movie Name',
            dataIndex: 'movie',
            align: 'center',
            render: (value, record) => record?.movie?.title,
        },
        {
            title: 'Studio Number',
            dataIndex: 'date',
            align: 'center',
            render: (value, record) => record?.studios?.studioNumber,
        },
        {
            title: 'Action',
            dataIndex: 'id',
            align: 'center',
            render: (value, record) => (
                <RowActionButtons
                    actions={[
                        {
                            type: 'edit',
                            href: route(Route.MovieSchedulesEdit, {
                                id: record.id,
                            }),
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
            title="CRUD Movie Schedules"
            topActions={
                <Button
                    href={Route.MovieSchedulesCreate}
                    size="middle"
                    type="primary"
                >
                    New Schedule
                </Button>
            }
        >
            <Section>
                <DataTable
                    onChange={implementTableFilter}
                    search={filters.search}
                    pagination={paginationTransform(props.meta)}
                    loading={isFetching}
                    columns={colums}
                    dataSource={props.data}
                />

                <h4>Movie Schedules</h4>
                <DataTable
                    loading={isFetching}
                    columns={colums}
                    dataSource={props.movieNowPlaying}
                />
            </Section>
        </MainLayout>
    );
};

export default IndexPage;
