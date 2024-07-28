import React, { useEffect, useState } from "react";
import {
    Box, Button,
    Grid, Progress, Title
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";

import VendorTable from "./VendorTable";
import VendorForm from "./VendorForm";
import VendorUpdateForm from "./VendorUpdateForm.jsx";
import {
    editEntityData,
    setEntityNewData,
    setFormLoading,
    setInsertType,
    setSearchKeyword,
    setVendorFilterData
} from "../../../../store/core/crudSlice.js";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import CoreHeaderNavbar from "../CoreHeaderNavbar";
import { useNavigate, useParams } from "react-router-dom";
import getCustomerDropdownData from "../../../global-hook/dropdown/getCustomerDropdownData.js";

function VendorIndex() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { vendorId } = useParams();
    const navigate = useNavigate();

    const insertType = useSelector((state) => state.crudSlice.insertType)
    const vendorFilterData = useSelector((state) => state.crudSlice.vendorFilterData)
    const customerDropDownData = getCustomerDropdownData()

    const progress = getLoadingProgress()

    useEffect(() => {
        vendorId ? ((
            dispatch(setInsertType('update')),
            dispatch(editEntityData(`core/vendor/${vendorId}`)),
            dispatch(setFormLoading(true))
        )) : ((
            dispatch(setInsertType('create')),
            dispatch(setSearchKeyword('')),
            dispatch(setEntityNewData([])),
            dispatch(setVendorFilterData({
                ...vendorFilterData,
                ['name']: '',
                ['mobile']: '',
                ['company']: ''
            })),
            navigate('/core/vendor', { replace: true })
        ))
    }, [vendorId, dispatch, navigate])


    return (
        <>
            {progress !== 100 &&
                <Progress color="red" size={"xs"} striped animated value={progress} transitionDuration={200} />}
            {progress === 100 &&
                <>
                    <CoreHeaderNavbar
                        pageTitle={t('ManageVendor')}
                        roles={t('Roles')}
                        allowZeroPercentage=''
                        currencySymbol=''
                    />
                    <Box p={'8'}>
                        <Grid columns={24} gutter={{ base: 8 }}>
                            <Grid.Col span={15} >
                                <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                    <VendorTable />
                                </Box>
                            </Grid.Col>
                            <Grid.Col span={9}>
                                {
                                    insertType === 'create'
                                        ? <VendorForm customerDropDownData={customerDropDownData} />
                                        : <VendorUpdateForm customerDropDownData={customerDropDownData} />
                                }
                            </Grid.Col>
                        </Grid>
                    </Box>
                </>
            }
        </>
    );
}

export default VendorIndex;
