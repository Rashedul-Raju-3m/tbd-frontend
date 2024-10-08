import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
    rem,
    Grid, Tooltip, TextInput, ActionIcon, Select, Button, Flex, Box
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {
    IconBrandOkRu, IconFileTypeXls,
    IconFilter,
    IconInfoCircle, IconPdf,
    IconRestore,
    IconSearch,
    IconX,
} from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { setSearchKeyword } from "../../store/core/crudSlice.js";
import FilterModel from "../../components/modules/filter/FilterModel.jsx";
import { setFetching, setInvoiceBatchFilterData, storeEntityData } from "../../store/inventory/crudSlice.js";
import _FilterSearch from '../../components/modules/inventory/invoice-batch/drawer/_FilterSearch.jsx'

function SearchActionMenu(props) {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { isOnline } = useOutletContext();

    const [searchKeywordTooltip, setSearchKeywordTooltip] = useState(false)
    const [filterModel, setFilterModel] = useState(false)

    const invoiceBatchFilterData = useSelector((state) => state.inventoryCrudSlice.invoiceBatchFilterData)

    /*START GET CUSTOMER DROPDOWN FROM LOCAL STORAGE*/
    const [customersDropdownData, setCustomersDropdownData] = useState([])
    const [refreshCustomerDropdown, setRefreshCustomerDropdown] = useState(false)

    useEffect(() => {
        let coreCustomers = localStorage.getItem('core-customers');
        coreCustomers = coreCustomers ? JSON.parse(coreCustomers) : []
        if (coreCustomers && coreCustomers.length > 0) {
            const transformedData = coreCustomers.map(type => {
                return ({ 'label': type.mobile + ' -- ' + type.name, 'value': String(type.id) })
            });
            setCustomersDropdownData(transformedData);
            setRefreshCustomerDropdown(false)
        }
    }, [refreshCustomerDropdown])
    /*END GET CUSTOMER DROPDOWN FROM LOCAL STORAGE*/

    let [resetKey, setResetKey] = useState(0);

    const resetDropDownState = () => setResetKey(prevKey => prevKey + 1);

    useHotkeys(
        [['alt+F', () => {
            document.getElementById('SearchKeyword').focus();
        }]
        ], []
    );


    return (
        <>

            <Box>
                <ActionIcon.Group mt={'1'} justify="center">
                    <ActionIcon variant="default"
                        c={'red.4'}
                        size="lg" aria-label="Filter"
                        onClick={() => {
                            invoiceBatchFilterData.searchKeyword.length > 0 || invoiceBatchFilterData.customer_id || invoiceBatchFilterData.start_date ?
                                (dispatch(setFetching(true)),
                                    setSearchKeywordTooltip(false))
                                :
                                (setSearchKeywordTooltip(true),
                                    setTimeout(() => {
                                        setSearchKeywordTooltip(false)
                                    }, 1500))
                        }}
                    >
                        <Tooltip
                            label={t('SearchButton')}
                            px={16}
                            py={2}
                            withArrow
                            position={"bottom"}
                            c={'red'}
                            bg={`red.1`}
                            transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
                        >
                            <IconSearch style={{ width: rem(18) }} stroke={1.5} />
                        </Tooltip>
                    </ActionIcon>
                    <ActionIcon
                        variant="default"
                        size="lg"
                        c={'gray.6'}
                        aria-label="Settings"
                        onClick={(e) => {
                            setFilterModel(true)
                        }}
                    >
                        <Tooltip
                            label={t("FilterButton")}
                            px={16}
                            py={2}
                            withArrow
                            position={"bottom"}
                            c={'red'}
                            bg={`red.1`}
                            transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
                        >
                            <IconFilter style={{ width: rem(18) }} stroke={1.0} />
                        </Tooltip>
                    </ActionIcon>
                    <ActionIcon variant="default" c={'gray.6'}
                        size="lg" aria-label="Settings">
                        <Tooltip
                            label={t("ResetButton")}
                            px={16}
                            py={2}
                            withArrow
                            position={"bottom"}
                            c={'red'}
                            bg={`red.1`}
                            transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
                        >
                            <IconRestore style={{ width: rem(18) }} stroke={1.5} onClick={() => {
                                dispatch(setFetching(true))
                                setRefreshCustomerDropdown(true)
                                resetDropDownState();
                                dispatch(setInvoiceBatchFilterData({
                                    ...invoiceBatchFilterData,
                                    ['customer_id']: '',
                                    ['start_date']: '',
                                    ['end_date']: '',
                                    ['searchKeyword']: '',
                                }));
                            }} />
                        </Tooltip>
                    </ActionIcon>
                    <ActionIcon variant="default"
                        c={'green.8'}
                        size="lg" aria-label="Filter"
                        onClick={() => {
                            searchKeyword.length > 0 ?
                                (dispatch(setFetching(true)),
                                    setSearchKeywordTooltip(false))
                                :
                                (setSearchKeywordTooltip(true),
                                    setTimeout(() => {
                                        setSearchKeywordTooltip(false)
                                    }, 1500))
                        }}
                    >
                        <Tooltip
                            label={t('DownloadPdfFile')}
                            px={16}
                            py={2}
                            withArrow
                            position={"bottom"}
                            c={'red'}
                            bg={`red.1`}
                            transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
                        >
                            <IconPdf style={{ width: rem(18) }} stroke={1.5} />
                        </Tooltip>
                    </ActionIcon>
                    <ActionIcon variant="default"
                        c={'green.8'}
                        size="lg" aria-label="Filter"
                        onClick={() => {
                            searchKeyword.length > 0 ?
                                (dispatch(setFetching(true)),
                                    setSearchKeywordTooltip(false))
                                :
                                (setSearchKeywordTooltip(true),
                                    setTimeout(() => {
                                        setSearchKeywordTooltip(false)
                                    }, 1500))
                        }}
                    >
                        <Tooltip
                            label={t('DownloadExcelFile')}
                            px={16}
                            py={2}
                            withArrow
                            position={"bottom"}
                            c={'red'}
                            bg={`red.1`}
                            transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
                        >
                            <IconFileTypeXls style={{ width: rem(18) }} stroke={1.5} />
                        </Tooltip>
                    </ActionIcon>

                </ActionIcon.Group>
            </Box>

            {
                filterModel &&
                <_FilterSearch filterModel={filterModel} setFilterModel={setFilterModel} module={props.module} />
            }
        </>
    );
}

export default SearchActionMenu;
