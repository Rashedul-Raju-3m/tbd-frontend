import React, { useEffect, useState } from "react";
import {useNavigate, useOutletContext} from "react-router-dom";
import {
    Group,
    Box,
    ActionIcon,
    Menu, Button, rem,
} from "@mantine/core";
import {
    IconDotsVertical, IconTrashX,
} from "@tabler/icons-react";
import { DataTable } from 'mantine-datatable';
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';
import {
    getIndexEntityData,
    setFetching, storeAndUpdateProductionItem,
} from "../../../../store/production/crudSlice.js";
import KeywordSearch from "../common/KeywordSearch.jsx";
import tableCss from "../../../../assets/css/Table.module.css";

function _RecipeItemsTable() {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { t, i18n } = useTranslation();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 120; //TabList height 104

    const perPage = 50;
    const [page, setPage] = useState(1);

    const fetching = useSelector((state) => state.productionCrudSlice.fetching)
    const searchKeyword = useSelector((state) => state.productionCrudSlice.searchKeyword)
    const indexData = useSelector((state) => state.productionCrudSlice.indexEntityData)
    const recipeItemFilterData = useSelector((state) => state.productionCrudSlice.recipeItemFilterData)

    useEffect(() => {
        const value = {
            url: 'production/recipe-items',
            param: {
                term: searchKeyword,
                product_name: recipeItemFilterData.product_name,
                page: page,
                offset: perPage
            }
        }
        dispatch(getIndexEntityData(value))
    }, [fetching]);

    return (
        <>

            <Box pl={`xs`} pb={'xs'} pr={8} pt={'xs'} mb={'xs'} className={'boxBackground borderRadiusAll'} >
                <KeywordSearch module={'recipe-item'} />
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
                            accessor: 'id',
                            title: t('S/N'),
                            textAlignment: 'right',
                            render: (item) => (indexData.data.indexOf(item) + 1)
                        },
                        { accessor: 'product_name', title: t("Item") },
                        { accessor: 'unit_name', title: t("Uom") },
                        { accessor: 'license_date', title: t("LicenseDate") },
                        { accessor: 'initiate_date', title: t("InitiateDate") },
                        { accessor: 'waste_percent', title: t("Wastage%"),textAlign:"center"},
                        { accessor: 'quantity', title: t("Quantity"),textAlign:'center' },
                        {
                            accessor: 'total',
                            title: t("WastageQuantity"),
                            textAlign:'center',
                            render : (item) => (
                                <>
                                    {item.quantity && item.waste_percent ? ((Number(item.quantity)*Number(item.waste_percent))/100).toFixed(2) : "0.00"}
                                </>
                            )
                        },
                        { accessor: 'waste_amount', title: t("WastageAmount"),textAlign:'center' },
                        { accessor: 'material_amount', title: t("MaterialValue"),textAlign:'center' },
                        { accessor: 'value_added_amount', title: t("ValueAdded"),textAlign:'center' },
                        { accessor: 'sub_total', title: t("Total"),textAlign:'center' },
                        {
                            accessor: 'status',
                            title: t("Status"),
                            render: (item) => (
                                <>
                                    {item.status==1?'Active':'Inactive'}
                                </>
                            )
                        },
                        {
                            accessor: "action",
                            title: t("Action"),
                            textAlign: "right",
                            render: (item) => (
                                <Group gap={4} justify="right" wrap="nowrap">
                                    <Button component="a" size="compact-xs" radius="xs" variant="filled" fw={'100'} fz={'12'} color="red.3" mr={'4'}
                                            href={`/production/recipe/${item.id}`}
                                            /*onClick={(e) => {
                                                e.preventDefault();

                                                navigate('/production/recipe/'+item.id)
                                            }}*/
                                    >  {t('Recipe')}</Button>

                                    {/*<Menu position="bottom-end" offset={3} withArrow trigger="hover" openDelay={100} closeDelay={400}>
                                        <Menu.Target>
                                            <ActionIcon size="sm" variant="outline" color="red" radius="xl" aria-label="Settings">
                                                <IconDotsVertical height={'18'} width={'18'} stroke={1.5} />
                                            </ActionIcon>
                                        </Menu.Target>
                                        <Menu.Dropdown>
                                            <Menu.Item
                                                href={`/production/recipe/${item.id}`}
                                                component="a"
                                            >
                                                {t('Recipe')}
                                            </Menu.Item>
                                        </Menu.Dropdown>
                                    </Menu>*/}
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
                    height={height}
                    scrollAreaProps={{ type: 'never' }}
                />
            </Box>
        </>
    );
}

export default _RecipeItemsTable;