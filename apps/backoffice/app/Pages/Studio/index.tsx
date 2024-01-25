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
import { IStudio } from 'interface-models/movie/studio.interface';
import { deleteStudio } from '../../Modules/Studio/Action';
import { RowActionButtons } from '../../Components/molecules/RowActionButtons';
import { useModal } from '../../Utils/modal';

interface IProps {
    data: IStudio[];
    meta: IPaginationMeta;
}

interface IFilters {
    studioNumber: string;
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
            deleteStudio(id);
            notifyNavigating();
        } catch (error) {
            console.log(error);
        }
    };

    const colums: ColumnsType<IStudio> = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: 'Studio Number',
            dataIndex: 'studioNumber',
            align: 'center',
        },
        {
            title: 'Studio Capacity',
            dataIndex: 'seatCapacity',
            align: 'center',
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
                            href: route(Route.StudiosEdit, { id: record.id }),
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
            title="CRUD Studio"
            topActions={
                <Button href={Route.StudiosCreate} size="middle" type="primary">
                    New Studio
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
