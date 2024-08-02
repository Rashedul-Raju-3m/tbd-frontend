import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {
    Group,
    Box,
    ActionIcon,
    Text,
    Menu,
    rem
} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {
    IconTrashX,
    IconDotsVertical, IconX
} from "@tabler/icons-react";
import {DataTable} from 'mantine-datatable';
import {useDispatch, useSelector} from "react-redux";
import {
    editEntityData,
    getIndexEntityData,
    setFetching, setFormLoading,
    setInsertType,
    showEntityData, deleteEntityData
} from "../../../../../store/production/crudSlice.js";
import {modals} from "@mantine/modals";
import tableCss from "../../../../../assets/css/Table.module.css";
import __RecipeAddItem from "./__RecipeAddItem.jsx";

function _RecipeTable() {

    const dispatch = useDispatch();
    const {t, i18n} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const tableHeight = mainAreaHeight - 120; //TabList height 104

    const perPage = 50;
    const [page, setPage] = useState(1);

    const fetching = useSelector((state) => state.productionCrudSlice.fetching)
    const indexData = useSelector((state) => state.productionCrudSlice.indexEntityData)

    useEffect(() => {
        const value = {
            url: 'production/recipe',
            param: {
                page: page,
                offset: perPage
            }
        }
        dispatch(getIndexEntityData(value))
    }, [fetching]);


    return (
        <>
            <Box pb={'xs'}>
                <__RecipeAddItem/>
            </Box>
            <Box className={'borderRadiusAll'}>
                <DataTable
                    classNames={{
                        root: tableCss.root,
                        table: tableCss.table,
                        header: tableCss.header,
                        footer: tableCss.footer,
                        pagination: tableCss.pagination,
                    }}
                    records={indexData.data}
                    columns={[
                        {
                            accessor: 'index',
                            title: t('S/N'),
                            textAlignment: 'right',
                            render: (item) => (indexData.data.indexOf(item) + 1)
                        },
                        {accessor: 'product_name', title: t("Item")},
                        {accessor: 'unit_name', title: t("Uom")},
                        {accessor: 'quantity', title: t("Quantity"), textAlign: 'center'},
                        {accessor: 'price', title: t("Price"), textAlign: 'center'},
                        {accessor: 'sub_total', title: t("SubTotal"), textAlign: 'center'},
                        {accessor: 'wastage_percent', title: t("Wastage%"), textAlign: 'center'},
                        {accessor: 'wastage_quantity', title: t("WastageQuantity"), textAlign: 'center'},
                        {accessor: 'wastage_amount', title: t("WastageAmount"), textAlign: 'center'},
                        {
                            accessor: 'status',
                            title: t("Status"),
                            render: (item) => (
                                <>
                                    {item.status == 1 ? 'Active' : 'Inactive'}
                                </>
                            )
                        },
                        {
                            accessor: "action",
                            title: t("Action"),
                            textAlign: "right",
                            render: (data) => (
                                <Group gap={4} justify="right" wrap="nowrap">
                                    <ActionIcon
                                        size="sm"
                                        variant="subtle"
                                        color="red"
                                        onClick={() => {
                                            dispatch(deleteEntityData('production/recipe/'+data.id))
                                            dispatch(setFetching(true))
                                        }}
                                    >
                                        <IconX size={16} style={{ width: '70%', height: '70%' }}
                                               stroke={1.5} />
                                    </ActionIcon>
                                </Group>
                            ),
                        },
                    ]
                    }
                    fetching={fetching}
                    totalRecords={indexData.total}
                    recordsPerPage={perPage}
                    page={page}
                    onPageChange={(p) => {
                        setPage(p)
                        dispatch(setFetching(true))
                    }}
                    loaderSize="xs"
                    loaderColor="grape"
                    height={tableHeight}
                    scrollAreaProps={{type: 'never'}}
                />
            </Box>
        </>
    );
}

export default _RecipeTable;