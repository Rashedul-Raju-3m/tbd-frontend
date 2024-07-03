import React, { useEffect, useState } from "react";
import {
    Box, Grid, Progress, Title
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";

import CategoryTable from "./CategoryTable";
import CategoryForm from "./CategoryForm";
import CategoryUpdateForm from "./CategoryUpdateForm.jsx";
import { editEntityData, setFormLoading, setSearchKeyword } from "../../../../store/core/crudSlice.js";
import { setEntityNewData, setInsertType } from "../../../../store/inventory/crudSlice.js";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";
import InventoryHeaderNavbar from "../configuraton/InventoryHeaderNavbar";
import { useNavigate, useParams } from "react-router-dom";

function CategoryIndex() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    const insertType = useSelector((state) => state.inventoryCrudSlice.insertType)
    const productCategoryFilterData = useSelector((state) => state.inventoryCrudSlice.productCategoryFilterData)

    const progress = getLoadingProgress()
    const configData = getConfigData()
    const navigate = useNavigate()

    const { categoryId } = useParams();

    useEffect(() => {
        categoryId ? ((
            dispatch(setInsertType('update')),
            dispatch(editEntityData(`inventory/category-group/${categoryId}`))
        )) : ((
            dispatch(setInsertType('create')),
            dispatch(setSearchKeyword('')),
            dispatch(setEntityNewData([])),
            navigate('/inventory/category', { replace: true })
        ))
    }, [categoryId, dispatch, navigate, productCategoryFilterData])


    return (
        <>
            {progress !== 100 &&
                <Progress color="red" size={"xs"} striped animated value={progress} transitionDuration={200} />}
            {progress === 100 &&
                <Box>
                    {configData &&
                        <>
                            <InventoryHeaderNavbar
                                pageTitle={t('ProductCategory')}
                                roles={t('Roles')}
                                allowZeroPercentage={configData.zero_stock}
                                currencySymbol={configData.currency.symbol}
                            />
                            <Box p={'8'}>
                                <Grid columns={24} gutter={{ base: 8 }}>
                                    <Grid.Col span={15} >
                                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                            <CategoryTable />
                                        </Box>
                                    </Grid.Col>
                                    <Grid.Col span={9}>
                                        {
                                            insertType === 'create'
                                                ? <CategoryForm />
                                                : <CategoryUpdateForm />
                                        }
                                    </Grid.Col>
                                </Grid>
                            </Box>
                        </>
                    }
                </Box>

            }
        </>
    );
}

export default CategoryIndex;
