import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
    Button, rem, Center, Switch, ActionIcon,
    Grid, Box, ScrollArea, Tooltip, Group, Text, Drawer
} from "@mantine/core";
import { useTranslation } from 'react-i18next';

import {
    IconDeviceFloppy,
    IconStackPush,
    IconPrinter,
    IconReceipt,
    IconPercentage,
    IconCurrencyTaka,
    IconMessage,
    IconEyeEdit, IconDiscountOff, IconCurrency, IconPlusMinus, IconCheck, IconTallymark1,IconCalendar

} from "@tabler/icons-react";
import { useHotkeys, useToggle } from "@mantine/hooks";
import {useDispatch, useSelector} from "react-redux";
import { isNotEmpty, useForm } from "@mantine/form";

import SelectForm from "../../../../form-builders/SelectForm";
import TextAreaForm from "../../../../form-builders/TextAreaForm";

import {getSalesDetails, storeEntityData,} from "../../../../../store/inventory/crudSlice.js";
import InputNumberForm from "../../../../form-builders/InputNumberForm";
import InputButtonForm from "../../../../form-builders/InputButtonForm";
import { notifications } from "@mantine/notifications";
import customerDataStoreIntoLocalStorage from "../../../../global-hook/local-storage/customerDataStoreIntoLocalStorage.js";
import _addCustomer from "../../../popover-form/_addCustomer.jsx";
import DatePickerForm from "../../../../form-builders/DatePicker";
import _GenericInvoiceForm from "../../sales/_GenericInvoiceForm";

function _AddTransaction(props) {
    const configData = localStorage.getItem('config-data');

    const currencySymbol = configData?.currency?.symbol;
    const domainId = configData?.domain_id;
    const isSMSActive = configData?.is_active_sms;
    const isZeroReceiveAllow = configData?.is_zero_receive_allow;
    const {addTransactionDrawer,setAddTransactionDrawer,invoiceBatchData} = props
    const { isOnline, mainAreaHeight } = useOutletContext();
    const { t, i18n } = useTranslation();
    const height = mainAreaHeight - 30; //TabList height 104
    const closeModel = () => {
        setAddTransactionDrawer(false)
    }
    const dispatch = useDispatch();
    const entityNewData = useSelector((state) => state.inventoryCrudSlice.entityNewData);


    const transactionModeData = JSON.parse(localStorage.getItem('accounting-transaction-mode')) ? JSON.parse(localStorage.getItem('accounting-transaction-mode')) : [];

    const [salesSubTotalAmount, setSalesSubTotalAmount] = useState(0);
    const [salesProfitAmount, setSalesProfitAmount] = useState(0);
    const [salesVatAmount, setSalesVatAmount] = useState(0);
    const [salesDiscountAmount, setSalesDiscountAmount] = useState(0);
    const [salesTotalAmount, setSalesTotalAmount] = useState(0);
    const [salesDueAmount, setSalesDueAmount] = useState(0);
    const [hoveredModeId, setHoveredModeId] = useState(false);
    const [isShowSMSPackageModel, setIsShowSMSPackageModel] = useState(false)
    const [customerViewModel, setCustomerViewModel] = useState(false);

    const [tempCardProducts, setTempCardProducts] = useState([])
    const [loadCardProducts, setLoadCardProducts] = useState(false)
    const [discountType, setDiscountType] = useToggle(['Flat', 'Percent']);
    const [provisionMode, setProvisionMode] = useToggle(['Item', 'Invoice']);
    const [invoicePrintData, setInvoicePrintData] = useState(null)
    const [invoicePrintForSave, setInvoicePrintForSave] = useState(false)

    const [lastClicked, setLastClicked] = useState(null);

    const handleClick = (event) => {
        setLastClicked(event.currentTarget.name);
    };


    useEffect(() => {
        const tempProducts = localStorage.getItem('temp-sales-products');
        setTempCardProducts(tempProducts ? JSON.parse(tempProducts) : [])
        setLoadCardProducts(false)
    }, [loadCardProducts])

    const [customerData, setCustomerData] = useState(null);
    const [salesByUser, setSalesByUser] = useState(null);
    const [orderProcess, setOrderProcess] = useState(null);

    const form = useForm({
        initialValues: {
            invoice_batch_id : invoiceBatchData.id,
            created_by_id : JSON.parse(localStorage.getItem('user')).id,
            sales_by_id : JSON.parse(localStorage.getItem('user')).id,
            customer_id: invoiceBatchData.customer_id,
            provision_discount: '',
            provision_mode: '',
            discount_calculation: '',
            discount_type: '',
            comment: '',
            invoice_date: ''
        },
        validate: {
            discount_calculation: isNotEmpty(),
        }
    });

    const [returnOrDueText, setReturnOrDueText] = useState('Due');

    useEffect(() => {
        setSalesSubTotalAmount(0);
        setSalesDueAmount(0);
    }, []);

    useEffect(() => {
        const totalAmount = salesSubTotalAmount - salesDiscountAmount;
        setSalesTotalAmount(totalAmount);
        setSalesDueAmount(totalAmount);
        setSalesProfitAmount(totalAmount - 0)
    }, [salesSubTotalAmount, salesDiscountAmount]);

    useEffect(() => {
        let discountAmount = 0;
        if (form.values.discount && Number(form.values.discount) > 0) {
            if (discountType === 'Flat') {
                discountAmount = form.values.discount;
            } else if (discountType === 'Percent') {
                discountAmount = (salesSubTotalAmount * form.values.discount) / 100;
            }
        }
        setSalesDiscountAmount(discountAmount);

        let returnOrDueAmount = 0;
        let receiveAmount = form.values.receive_amount == '' ? 0 : form.values.receive_amount
        if (receiveAmount >= 0) {
            const text = salesTotalAmount < receiveAmount ? 'Return' : 'Due';
            setReturnOrDueText(text);
            returnOrDueAmount = salesTotalAmount - receiveAmount;
            setSalesDueAmount(returnOrDueAmount);
        }
    }, [form.values.discount, discountType, form.values.receive_amount, salesSubTotalAmount, salesTotalAmount]);


    const [profitShow, setProfitShow] = useState(false);

    /*START GET CUSTOMER DROPDOWN FROM LOCAL STORAGE*/
    const [refreshCustomerDropdown, setRefreshCustomerDropdown] = useState(false)
    const [customersDropdownData, setCustomersDropdownData] = useState([])
    const [defaultCustomerId, setDefaultCustomerId] = useState(null)

    useEffect(() => {
        const fetchCustomers = async () => {
            await customerDataStoreIntoLocalStorage();
            let coreCustomers = localStorage.getItem('core-customers');
            coreCustomers = coreCustomers ? JSON.parse(coreCustomers) : []
            let defaultId = defaultCustomerId;
            if (coreCustomers && coreCustomers.length > 0) {
                const transformedData = coreCustomers.map(type => {
                    if (type.name === 'Default') {
                        defaultId = type.id;
                    }
                    return ({ 'label': type.mobile + ' -- ' + type.name, 'value': String(type.id) })
                });

                setCustomersDropdownData(transformedData);
                setDefaultCustomerId(defaultId);
            }
            setRefreshCustomerDropdown(false);
        };

        fetchCustomers();
    }, [refreshCustomerDropdown]);
    /*END GET CUSTOMER DROPDOWN FROM LOCAL STORAGE*/

    /*START GET SALES BY / USERS DROPDOWN FROM LOCAL STORAGE*/
    const [salesByDropdownData, setSalesByDropdownData] = useState([])
    useEffect(() => {
        let coreUsers = localStorage.getItem('core-users') ? JSON.parse(localStorage.getItem('core-users')) : [];
        if (coreUsers && coreUsers.length > 0) {
            const transformedData = coreUsers.map(type => {
                return ({ 'label': type.username + ' - ' + type.email, 'value': String(type.id) })
            });
            setSalesByDropdownData(transformedData);
        }
    }, [])
    /*END GET SALES BY / USERS DROPDOWN FROM LOCAL STORAGE*/

    /*START FOR TRANSACTION MODE DEFAULT SELECT*/
    /*useEffect(() => {
        if (transactionModeData && transactionModeData.length > 0) {
            for (let mode of transactionModeData) {
                if (mode.is_selected) {
                    form.setFieldValue('transaction_mode_id', form.values.transaction_mode_id ? form.values.transaction_mode_id : mode.id);
                    break;
                }
            }
        }
    }, [transactionModeData, form]);*/
    /*END FOR TRANSACTION MODE DEFAULT SELECT*/

    /*START FOR SUBMIT Disabled*/
    const isDefaultCustomer = !customerData || customerData == defaultCustomerId;
    const isDisabled = isDefaultCustomer && (isZeroReceiveAllow ? false : salesDueAmount > 0);
    /*END FOR SUBMIT Disabled*/

    /*START GET CUSTOMER DATA FROM LOCAL STORAGE*/
    const [customerObject, setCustomerObject] = useState({});
    useEffect(() => {
        if (customerData && (customerData != defaultCustomerId)) {
            const coreCustomers = JSON.parse(localStorage.getItem('core-customers') || '[]');
            const foundCustomer = coreCustomers.find(type => type.id == customerData);

            if (foundCustomer) {
                setCustomerObject(foundCustomer);
            }
        }
    }, [customerData]);
    /*END GET CUSTOMER DATA FROM LOCAL STORAGE*/

    useHotkeys([['alt+n', () => {
        // document.getElementById('customer_id').focus()
    }]], []);

    useHotkeys([['alt+r', () => {
        form.reset()
    }]], []);

    useHotkeys([['alt+s', () => {
        document.getElementById('EntityFormSubmit').click()
    }]], []);

    const inputGroupCurrency = (
        <Text style={{ textAlign: 'right', width: '100%', paddingRight: 16 }}
              color={'gray'}
        >
            {currencySymbol}
        </Text>
    );

    useEffect(() => {
        if (entityNewData?.data?.id && (lastClicked === 'print' || lastClicked==='pos')){
            setTimeout(() => {
                dispatch(getSalesDetails('inventory/sales/'+entityNewData?.data?.id))
            }, 400);
        }
    }, [entityNewData, dispatch, lastClicked]);

    useEffect(() => {
        if (entityNewData?.data?.id && (lastClicked === 'print' || lastClicked==='pos')){
            setTimeout(() => {
                setInvoicePrintForSave(true)
            }, 500);
        }
    }, [entityNewData, lastClicked]);

    useEffect(() => {
        setTimeout(() => {
            if (invoicePrintForSave) {
                let printContents = document.getElementById('printElement').innerHTML;
                let originalContents = document.body.innerHTML;
                document.body.innerHTML = printContents;
                window.print();
                document.body.innerHTML = originalContents;
                window.location.reload()
            }
        },500)
    }, [invoicePrintForSave]);

    return (
        <>
            <Drawer.Root title={t('AddTransaction')} opened={addTransactionDrawer} position="right" onClose={closeModel} size={'30%'} >
                    <Drawer.Overlay />
                    <Drawer.Content>
                        <Drawer.Header>
                            <Drawer.Title>{t('AddTransaction')}</Drawer.Title>
                            <Drawer.CloseButton />
                        </Drawer.Header>
                        <form onSubmit={form.onSubmit((values) => {

                            const options = {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit'
                            };
                            const formValue = {}
                            formValue['invoice_batch_id'] = form.values.invoice_batch_id ? form.values.invoice_batch_id : null;
                            formValue['created_by_id'] = Number(form.values.created_by_id);
                            formValue['sales_by_id'] = form.values.sales_by_id;
                            formValue['customer_id'] = form.values.customer_id ? form.values.customer_id : null;
                            formValue['provision_discount'] = form.values.provision_discount ? form.values.provision_discount : null;
                            formValue['provision_mode'] = provisionMode;
                            formValue['discount_calculation'] = form.values.discount_calculation ? form.values.discount_calculation : null;
                            formValue['discount_type'] = discountType;
                            formValue['comment'] = form.values.comment;
                            formValue['invoice_date'] = form.values.invoice_date && new Date(form.values.invoice_date).toLocaleDateString("en-CA", options)

                            console.log(formValue)


                            // console.log(form.values)
                            /*const options = {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit'
                            };

                            if (values.invoice_date) {
                                let date = new Date(values.invoice_date);
                                form.values.invoice_date = date.toLocaleDateString("en-CA", options);
                            }

                            console.log(form.values)*/

                            /*const options = {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit'
                            };
                            form.values['invoice_date'] = form.values.invoice_date && new Date(form.values.invoice_date).toLocaleDateString("en-CA", options)

                            console.log(form.values)*/


                            /*const tempProducts = localStorage.getItem('temp-sales-products');
                            let items = tempProducts ? JSON.parse(tempProducts) : [];
                            let createdBy = JSON.parse(localStorage.getItem('user'));

                            let transformedArray = items.map(product => {
                                return {
                                    "product_id": product.product_id,
                                    "item_name": product.display_name,
                                    "sales_price": product.sales_price,
                                    "price": product.price,
                                    "percent": product.percent,
                                    "quantity": product.quantity,
                                    "uom": product.unit_name,
                                    "unit_id": product.unit_id,
                                    "purchase_price": product.purchase_price,
                                    "sub_total": product.sub_total
                                }
                            });

                            const options = {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit'
                            };
                            const formValue = {}
                            formValue['customer_id'] = form.values.customer_id ? form.values.customer_id : defaultCustomerId;
                            formValue['sub_total'] = salesSubTotalAmount;
                            formValue['transaction_mode_id'] = form.values.transaction_mode_id;
                            formValue['discount_type'] = discountType;
                            formValue['discount'] = salesDiscountAmount;
                            formValue['discount_calculation'] = discountType === 'Percent' ? form.values.discount : 0;
                            formValue['vat'] = 0;
                            formValue['total'] = salesTotalAmount;
                            formValue['sales_by_id'] = form.values.sales_by;
                            formValue['created_by_id'] = Number(createdBy['id']);
                            formValue['process'] = form.values.order_process;
                            formValue['narration'] = form.values.narration;
                            formValue['invoice_date'] = form.values.invoice_date && new Date(form.values.invoice_date).toLocaleDateString("en-CA", options)
                            ;
                            formValue['items'] = transformedArray ? transformedArray : [];

                            const hasReceiveAmount = form.values.receive_amount;
                            const isDefaultCustomer = !form.values.customer_id || form.values.customer_id == defaultCustomerId;
                            formValue['payment'] = hasReceiveAmount
                                ? (customerData && customerData != defaultCustomerId
                                    ? form.values.receive_amount
                                    : isZeroReceiveAllow
                                        ? salesTotalAmount
                                        : form.values.receive_amount)
                                : (isZeroReceiveAllow && isDefaultCustomer
                                    ? salesTotalAmount
                                    : 0);

                            if (items && items.length > 0) {
                                const data = {
                                    url: 'inventory/sales',
                                    data: formValue
                                }
                                dispatch(storeEntityData(data))

                                notifications.show({
                                    color: 'teal',
                                    title: t('CreateSuccessfully'),
                                    icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                                    loading: false,
                                    autoClose: 700,
                                    style: { backgroundColor: 'lightgray' },
                                });

                                setTimeout(() => {
                                    localStorage.removeItem('temp-sales-products');
                                    form.reset()
                                    setCustomerData(null)
                                    setSalesByUser(null)
                                    setOrderProcess(null)
                                    props.setLoadCardProducts(true)
                                }, 500)
                            } else {
                                notifications.show({
                                    color: 'red',
                                    title: t('PleaseChooseItems'),
                                    icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                                    loading: false,
                                    autoClose: 700,
                                    style: { backgroundColor: 'lightgray' },
                                });
                            }*/

                        })}>
                        <ScrollArea  p={'md'} h={height}  scrollbarSize={2} type="never" bg={'gray.1'}>
                            <Box>
                                <Grid columns={48}>
                                    <Box className={'borderRadiusAll'} w={'100%'}>
                                        <Box h={'42'} pl={`xs`} fz={'sm'} fw={'600'} pr={8} pt={'xs'}  className={'boxBackground textColor borderRadiusAll'} >
                                            {t('Invoice')}: {invoiceBatchData && invoiceBatchData.invoice && invoiceBatchData.invoice}
                                        </Box>
                                        <Box className={'borderRadiusAll border-top-none'} fz={'sm'}  >
                                            <Box pl={`xs`} fz={'sm'} fw={'600'} pr={'xs'} pt={'6'} pb={'xs'} className={'boxBackground textColor'} >
                                                <Grid gutter={{ base: 4 }}>
                                                    <Grid.Col span={'6'}>
                                                        <Grid columns={15} gutter={{ base: 4 }}>
                                                            <Grid.Col span={6} ><Text fz="sm" lh="xs">{t('Customer')}</Text></Grid.Col>
                                                            <Grid.Col span={9} >
                                                                <Text fz="sm" lh="xs">
                                                                    {invoiceBatchData && invoiceBatchData.customer_name && invoiceBatchData.customer_name}
                                                                </Text>
                                                            </Grid.Col>
                                                        </Grid>
                                                        <Grid columns={15} gutter={{ base: 4 }}>
                                                            <Grid.Col span={6} ><Text fz="sm" lh="xs">{t('Mobile')}</Text></Grid.Col>
                                                            <Grid.Col span={9} >
                                                                <Text fz="sm" lh="xs">
                                                                    {invoiceBatchData && invoiceBatchData.customer_mobile && invoiceBatchData.customer_mobile}
                                                                </Text>
                                                            </Grid.Col>
                                                        </Grid>
                                                        <Grid columns={15} gutter={{ base: 4 }}>
                                                            <Grid.Col span={6} ><Text fz="sm" lh="xs">{t('Address')}</Text></Grid.Col>
                                                            <Grid.Col span={9} >
                                                                <Text fz="sm" lh="xs">
                                                                    {invoiceBatchData && invoiceBatchData.customer_address && invoiceBatchData.customer_address}
                                                                </Text>
                                                            </Grid.Col>
                                                        </Grid>
                                                        <Grid columns={15} gutter={{ base: 4 }}>
                                                            <Grid.Col span={6} ><Text fz="sm" lh="xs">{t('Balance')}</Text></Grid.Col>
                                                            <Grid.Col span={9} >
                                                                <Text fz="sm" lh="xs">
                                                                    {invoiceBatchData && invoiceBatchData.balance ? Number(invoiceBatchData.balance).toFixed(2) : 0.00}
                                                                </Text>
                                                            </Grid.Col>
                                                        </Grid>
                                                    </Grid.Col>
                                                    <Grid.Col span={'6'}>
                                                        <Grid columns={15} gutter={{ base: 4 }}>
                                                            <Grid.Col span={6} ><Text fz="sm" lh="xs">{t('Created')}</Text></Grid.Col>
                                                            <Grid.Col span={9} >
                                                                <Text fz="sm" lh="xs">
                                                                    {invoiceBatchData && invoiceBatchData.created && invoiceBatchData.created}
                                                                </Text>
                                                            </Grid.Col>
                                                        </Grid>
                                                        <Grid columns={15} gutter={{ base: 4 }}>
                                                            <Grid.Col span={6} ><Text fz="sm" lh="xs">{t('CreatedBy')}</Text></Grid.Col>
                                                            <Grid.Col span={9} >
                                                                <Text fz="sm" lh="xs">
                                                                    {invoiceBatchData && invoiceBatchData.created_by_name && invoiceBatchData.created_by_name}
                                                                </Text>
                                                            </Grid.Col>
                                                        </Grid>
                                                    </Grid.Col>
                                                </Grid>
                                            </Box>
                                        </Box>

                                        <Box p={'xs'} bg={'orange.1'}>
                                            <Grid gutter={{ base: 4 }}>
                                                <Grid.Col span={3}>
                                                    <Center fz={'md'}
                                                            fw={'800'}>{currencySymbol} {Number(props?.invoiceBatchData?.sub_total).toFixed(2)}</Center>
                                                </Grid.Col>
                                                <Grid.Col span={3}>
                                                    <Center fz={'md'}
                                                            fw={'800'}> {currencySymbol} {Number(props?.invoiceBatchData?.discount).toFixed(2)}</Center>
                                                </Grid.Col>
                                                <Grid.Col span={3}>
                                                    <Center fz={'md'}
                                                            fw={'800'}>  {currencySymbol} {Number(props?.invoiceBatchData?.total).toFixed(2)}</Center>
                                                </Grid.Col>
                                                <Grid.Col span={3}>
                                                    <Center fz={'md'}
                                                            fw={'800'}>{currencySymbol} {Number(props?.invoiceBatchData?.received).toFixed(2)}</Center>
                                                </Grid.Col>
                                            </Grid>
                                            <Grid gutter={{ base: 4 }}>
                                                <Grid.Col span={3}>
                                                    <Box h={1} ml={'xl'} mr={'xl'} bg={`red.3`}></Box>
                                                </Grid.Col>
                                                <Grid.Col span={3}>
                                                    <Box h={1} ml={'xl'} mr={'xl'} bg={`red.3`}></Box>
                                                </Grid.Col>
                                                <Grid.Col span={3}>
                                                    <Box h={1} ml={'xl'} mr={'xl'} bg={`red.3`}></Box>
                                                </Grid.Col>
                                                <Grid.Col span={3}>
                                                    <Box h={1} ml={'xl'} mr={'xl'} bg={`red.3`}></Box>
                                                </Grid.Col>
                                            </Grid>
                                            <Grid gutter={{ base: 4 }}>
                                                <Grid.Col span={3}>
                                                    <Center fz={'xs'} c="dimmed" >{t('SubTotal')}</Center>
                                                </Grid.Col>
                                                <Grid.Col span={3}>
                                                    <Center fz={'xs'} c="dimmed" >{t('Discount')}</Center>
                                                </Grid.Col>
                                                <Grid.Col span={3}>
                                                    <Center fz={'xs'} c="dimmed">{t('Total')}</Center>
                                                </Grid.Col>
                                                <Grid.Col span={3}>
                                                    <Center fz={'xs'} c="dimmed">{t('Received')}</Center>
                                                </Grid.Col>
                                            </Grid>
                                        </Box>
                                        <ScrollArea  bg={'gray.1'}>
                                            <Box p={'xs'} className={'boxBackground'} mt={'4'} pt={'xs'} mb={'xs'} pb={'xs'} >
                                                <Grid gutter={{ base: 2 }}>
                                                    <Grid.Col span={4}>

                                                    </Grid.Col>
                                                    <Grid.Col span={4}>&nbsp;</Grid.Col>
                                                    <Grid.Col span={4}>
                                                        <Box fz={'xl'} pr={'8'} mt={'4'} c={'red'} style={{ textAlign: 'right', float: 'right' }} fw={'800'}>
                                                            <DatePickerForm
                                                                tooltip={t('InvoiceDateValidateMessage')}
                                                                label=''
                                                                placeholder={t('InvoiceDate')}
                                                                required={false}
                                                                nextField={'provision_discount'}
                                                                form={form}
                                                                name={'invoice_date'}
                                                                id={'invoice_date'}
                                                                leftSection={<IconCalendar size={16} opacity={0.5} />}
                                                                rightSection={<IconCalendar size={16} opacity={0.5} />}
                                                                rightSectionWidth={30}
                                                                closeIcon={true}
                                                            />
                                                        </Box>
                                                    </Grid.Col>
                                                </Grid>
                                                <Box mt={'xs'} h={1} bg={`red.3`}>&nbsp;</Box>
                                                <Grid gutter={{ base: 2 }} mt={'xs'}>
                                                    <Grid.Col span={8}>
                                                        {t('ProvisionDiscount')}
                                                    </Grid.Col>
                                                    <Grid.Col span={4}>
                                                        <InputNumberForm
                                                            type="number"
                                                            tooltip={t('ProvisionDiscountValidateMessage')}
                                                            label=''
                                                            placeholder={t('Amount')}
                                                            required={false}
                                                            nextField={'discount_calculation'}
                                                            form={form}
                                                            name={'provision_discount'}
                                                            id={'provision_discount'}
                                                            rightIcon={<IconCurrency size={16} opacity={0.5} />}
                                                            leftSection={<IconPlusMinus size={16} opacity={0.5} />}
                                                            closeIcon={true}
                                                        />
                                                    </Grid.Col>
                                                </Grid>
                                                <Grid gutter={{ base: 2 }} mt={'xs'}>
                                                    <Grid.Col span={4}>
                                                        <Button
                                                            fullWidth
                                                            onClick={() => setProvisionMode()}
                                                            variant="filled"
                                                            fz={'xs'}
                                                            color="green.8">
                                                            {provisionMode}
                                                        </Button>
                                                    </Grid.Col>
                                                    <Grid.Col span={4}>
                                                        <Button
                                                            fullWidth
                                                            onClick={() => setDiscountType()}
                                                            variant="filled"
                                                            fz={'xs'}
                                                            leftSection={
                                                                discountType === 'Flat' ? <IconCurrencyTaka size={14} /> :
                                                                    <IconPercentage size={14} />
                                                            } color="red.4">
                                                            {discountType}
                                                        </Button>
                                                    </Grid.Col>
                                                    <Grid.Col span={4}>
                                                        <InputButtonForm
                                                            tooltip={t('DiscountValidateMessage')}
                                                            label=''
                                                            placeholder={t('Discount')}
                                                            required={false}
                                                            nextField={'narration'}
                                                            form={form}
                                                            name={'discount_calculation'}
                                                            id={'discount_calculation'}
                                                            leftSection={<IconDiscountOff size={16} opacity={0.5} />}
                                                            rightSection={inputGroupCurrency}
                                                            rightSectionWidth={30}
                                                        />
                                                    </Grid.Col>

                                                </Grid>
                                            </Box>
                                            <Box>

                                                <Box p={'xs'} pt={'0'}>
                                                    <TextAreaForm
                                                        tooltip={t('Narration')}
                                                        label=''
                                                        placeholder={t('Narration')}
                                                        required={false}
                                                        nextField={'entityDataSubmit'}
                                                        name={'comment'}
                                                        form={form}
                                                        mt={8}
                                                        id={'narration'}
                                                    />
                                                </Box>
                                            </Box>
                                        </ScrollArea>
                                    </Box>
                                </Grid>
                            </Box>
                        </ScrollArea>
                        <Box  className={'boxBackground'} p={'md'}>
                            <Box>
                                <Button.Group fullWidth>

                                    <Button
                                        fullWidth
                                        variant="filled"
                                        type={'submit'}
                                        onClick={handleClick}
                                        name="print"
                                        leftSection={<IconPrinter size={14} />}
                                        color="orange.5"
                                        disabled={isDisabled}
                                        style={{
                                            transition: "all 0.3s ease",
                                            backgroundColor: isDisabled ? "#f1f3f500" : ""
                                        }}
                                    >
                                        Print
                                    </Button>

                                    <Button
                                        fullWidth
                                        type={'submit'}
                                        onClick={handleClick}
                                        name="save"
                                        variant="filled"
                                        leftSection={<IconDeviceFloppy size={14} />}
                                        color="green"
                                        id="entityDataSubmit"
                                        // disabled={isDisabled}
                                        /*style={{
                                            transition: "all 0.3s ease",
                                            backgroundColor: isDisabled ? "#f1f3f500" : ""
                                        }}*/
                                    >
                                        Save
                                    </Button>
                                </Button.Group>
                            </Box>
                        </Box>
                        </form>
                    </Drawer.Content>
            </Drawer.Root>
        </>

    );
}

export default _AddTransaction;
