import React, { useContext } from 'react';
import { MainLayout } from '../../Layouts/MainLayout';
import { ITags } from 'interface-models/movie/tags.interface';
import { IPaginationMeta } from 'apps/backoffice/src/common/interface/index.interface';
import { AppContext } from '../../Contexts/App';
import { ColumnsType } from 'antd/es/table';
import { Button } from 'antd';
import { Route, route } from '../../Common/Route/Route';
import { DataTable } from '../../Components/organisms/DataTable';
import { useTableFilter } from '../../Utils/hooks';
import { paginationTransform } from '../../Components/organisms/DataTable/DataTable';
import { formatDate } from '../../Utils/utils';
import { deleteTags } from '../../Modules/Tags/Action';
import { RowActionButtons } from '../../Components/molecules/RowActionButtons';
import { useModal } from '../../Utils/modal';

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
            deleteTags(id);
            notifyNavigating();
        } catch (error) {
            console.log(error);
        }
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
                <RowActionButtons
                    actions={[
                        {
                            type: 'edit',
                            href: route(Route.TagsEdit, { id: record.id }),
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
