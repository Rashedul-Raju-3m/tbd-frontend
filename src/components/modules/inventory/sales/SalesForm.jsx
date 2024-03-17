import React, {useEffect, useState} from "react";
import {useNavigate, useOutletContext} from "react-router-dom";
import {
    Button,
    rem, Flex,Tabs,Center,Switch,ActionIcon,
    Grid, Box, ScrollArea, Tooltip, Group, Text, LoadingOverlay, Title,
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {
    IconCheck,
    IconDeviceFloppy, IconInfoCircle, IconPlus,IconUserCog,IconStackPush,IconPrinter,IconReceipt,IconPercentage,IconCurrencyTaka,
    IconRestore,IconPhoto,IconMessage,IconEyeEdit,IconRowRemove,IconTrash
} from "@tabler/icons-react";
import {useDisclosure, useHotkeys,useToggle} from "@mantine/hooks";
import {useDispatch, useSelector} from "react-redux";
import {hasLength, useForm} from "@mantine/form";
import {modals} from "@mantine/modals";
import {notifications} from "@mantine/notifications";

import Shortcut from "../../shortcut/Shortcut";
import InputForm from "../../../form-builders/InputForm";
import SelectForm from "../../../form-builders/SelectForm";
import TextAreaForm from "../../../form-builders/TextAreaForm";
import SwitchForm from "../../../form-builders/SwitchForm";
import {getBrandDropdown, getCategoryDropdown} from "../../../../store/inventory/utilitySlice";
import {getSettingDropdown,getProductUnitDropdown} from "../../../../store/utility/utilitySlice.js";

import {
    setEntityNewData,
    setFetching,
    setFormLoading,
    setValidationData,
    storeEntityData,
    getShowEntityData,
    updateEntityData,

} from "../../../../store/inventory/crudSlice.js";
import CategoryGroupModal from "../category/CategoryGroupModal";
import {setDropdownLoad} from "../../../../store/inventory/crudSlice";
import ProductForm from "../product/ProductForm";
import ProductUpdateForm from "../product/ProductUpdateForm";

function SalesForm() {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 200; //TabList height 104
    const formHeight = mainAreaHeight - 380; //TabList height 104
    const navigate = useNavigate();
    const [opened, {open, close}] = useDisclosure(false);
    const icon = <IconInfoCircle />;
    const [customerGroupData, setCustomerGroupData] = useState(null);
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const [customerData, setCustomerData] = useState(null);
    const formLoading = useSelector((state) => state.crudSlice.formLoading)

    const showEntityData = useSelector((state) => state.inventoryCrudSlice.showEntityData)
    const validationMessage = useSelector((state) => state.inventoryCrudSlice.validationMessage)
    const validation = useSelector((state) => state.inventoryCrudSlice.validation)

    const [setFormData, setFormDataForUpdate] = useState(false);
    const [formLoad, setFormLoad] = useState(true);

    const [categoryData, setCategoryData] = useState(null);
    const categoryDropdownData = useSelector((state) => state.inventoryUtilitySlice.categoryDropdownData)
    const dropdownLoad = useSelector((state) => state.inventoryCrudSlice.dropdownLoad)
    let categoryDropdown = categoryDropdownData && categoryDropdownData.length > 0 ?
        categoryDropdownData.map((type, index) => {
            return ({'label': type.name, 'value': String(type.id)})
        }) : []
    useEffect(() => {
        const value = {
            url: 'inventory/select/category',
            param: {
                type: 'parent'
            }
        }
        dispatch(getCategoryDropdown(value))
        //  dispatch(setDropdownLoad(false))
    }, [dropdownLoad]);

    const [brandData, setBrandData] = useState(null);
    const brandDropdownData = useSelector((state) => state.inventoryUtilitySlice.brandDropdownData)
    const dropdownBrandLoad = useSelector((state) => state.inventoryCrudSlice.dropdownLoad)
    let brandDropdown = brandDropdownData && brandDropdownData.length > 0 ?
        brandDropdownData.map((type, index) => {
            return ({'label': type.name, 'value': String(type.id)})
        }) : []
    useEffect(() => {
        const value = {
            url: 'inventory/select/product-brand',
        }
        dispatch(getBrandDropdown(value))
        //  dispatch(setDropdownLoad(false))
    }, [dropdownBrandLoad]);

    const [productTypeData, setProductTypeData] = useState(null);
    const productTypeDropdownData = useSelector((state) => state.utilityUtilitySlice.settingDropdown)
    let productTypeDropdown = productTypeDropdownData && productTypeDropdownData.length > 0 ?
        productTypeDropdownData.map((type, index) => {
            return ({'label': type.name, 'value': String(type.id)})
        }) : []

    useEffect(() => {
        const value = {
            url : 'utility/select/setting',
            param : {
                'dropdown-type' : 'product-type'
            }
        }
        dispatch(getSettingDropdown(value))
    }, []);

    const [productUnitData, setProductUnitData] = useState(null);
    const productUnitDropdownData = useSelector((state) => state.utilityUtilitySlice.productUnitDropdown)
    let productUnitDropdown = productUnitDropdownData && productUnitDropdownData.length > 0 ?
        productUnitDropdownData.map((type, index) => {
            return ({'label': type.name, 'value': String(type.id)})
        }) : []
    useEffect(() => {
        const value = {
            url: 'utility/select/product-unit'
        }
        dispatch(getProductUnitDropdown(value))
    }, []);

    const form = useForm({
        initialValues: {
            company_name: '', name: '', mobile: '', tp_percent: '', email: ''
        },
        validate: {
            company_name: hasLength({min: 2, max: 20}),
            name: hasLength({min: 2, max: 20}),
            mobile: (value) => (!/^\d+$/.test(value)),
            // tp_percent: (value) => (value && !/^\d*\.?\d*$/.test(value)),
            // email: (value) => (value && !/^\S+@\S+$/.test(value)),
        }
    });

    useHotkeys([['alt+n', () => {
        document.getElementById('CompanyName').focus()
    }]], []);

    useHotkeys([['alt+r', () => {
        form.reset()
    }]], []);

    useHotkeys([['alt+s', () => {
        document.getElementById('EntityFormSubmit').click()
    }]], []);

    const [value, discountType] = useToggle(['Flat', 'Percent']);

    return (
        <Box bg={"white"} mt={`xs`}>
            <form onSubmit={form.onSubmit((values) => {
                modals.openConfirmModal({
                    title: 'Please confirm your action',
                    children: (
                        <Text size="sm">
                            This action is so important that you are required to confirm it with a
                            modal. Please click
                            one of these buttons to proceed.
                        </Text>
                    ),
                    labels: {confirm: 'Confirm', cancel: 'Cancel'},
                    onCancel: () => console.log('Cancel'),
                    onConfirm: () => {

                        const value = {
                            url: 'item',
                            data: values
                        }

                        dispatch(storeEntityData(value))

                        notifications.show({
                            color: 'teal',
                            title: t('CreateSuccessfully'),
                            icon: <IconCheck style={{width: rem(18), height: rem(18)}}/>,
                            loading: false,
                            autoClose: 700,
                            style: {backgroundColor: 'lightgray'},
                        });

                        setTimeout(() => {
                            form.reset()
                            setCustomerData(null)
                            dispatch(setFetching(true))
                        }, 700)
                    },
                });
            })}>
                <Box pb={`xs`} pl={`xs`} pr={8} bg={'indigo.1'}>
                    <Grid columns={48} >
                        <Grid.Col span={28}>
                            <Grid gutter={{base: 6}} >
                                <Grid.Col span={3}>
                                    <InputForm
                                        tooltip={t('SalesPriceValidateMessage')}
                                        label=''
                                        placeholder={t('barcode')}
                                        required={true}
                                        nextField={'status'}
                                        form={form}
                                        name={'sales_price'}
                                        id={'sales_price'}
                                    />
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <SelectForm
                                        tooltip={t('Category')}
                                        label=''
                                        placeholder={t('SelectStockItem')}
                                        required={true}
                                        nextField={'name'}
                                        name={'category_id'}
                                        form={form}
                                        dropdownValue={categoryDropdown}
                                        id={'category_id'}
                                        searchable={false}
                                        value={categoryData}
                                        changeValue={setCategoryData}
                                    />

                                </Grid.Col>
                                <Grid.Col span={1}><Button color={'gray'} variant={'outline'}
                                                           onClick={open}><IconPlus size={16}
                                                                                    opacity={0.5}/></Button></Grid.Col>
                                {opened &&
                                <CustomerGroupModel openedModel={opened} open={open} close={close}/>
                                }
                                <Grid.Col span={1}><Center  mt={4} ></Center></Grid.Col>
                            </Grid>
                        </Grid.Col>
                        <Grid.Col span={16}>
                            <Grid gutter={{base: 6}}>
                                <Grid.Col span={4}>
                                    <InputForm
                                        tooltip={t('SalesPriceValidateMessage')}
                                        label=''
                                        placeholder={t('SalesPrice')}
                                        required={true}
                                        nextField={'status'}
                                        form={form}
                                        name={'sales_price'}
                                        id={'sales_price'}
                                    />
                                </Grid.Col>
                                <Grid.Col span={3}>
                                    <InputForm
                                        tooltip={t('PurchasePriceValidateMessage')}
                                        label=''
                                        placeholder={t('quantity')}
                                        required={true}
                                        nextField={'brand'}
                                        form={form}
                                        name={'sales_price'}
                                        id={'sales_price'}
                                    />
                                </Grid.Col>
                                <Grid.Col span={3}>
                                    <InputForm
                                        tooltip={t('SalesPriceValidateMessage')}
                                        label=''
                                        placeholder={t('percent')}
                                        required={true}
                                        nextField={'status'}
                                        form={form}
                                        name={'sales_price'}
                                        id={'sales_price'}
                                    />
                                </Grid.Col>
                                <Grid.Col span={1}><Text  pt={'4'} ta={'center'} ></Text></Grid.Col>
                            </Grid>
                        </Grid.Col>
                        <Grid.Col span={4}>
                            <Group mr={'md'} pos={`absolute`} right={0}  gap={0}>
                                <>
                                    {!saveCreateLoading &&
                                        <Button
                                        size="xs"
                                        color={`indigo.6`}
                                        type="submit"
                                        mt={4}
                                        mr={'xs'}
                                        id="EntityFormSubmit"
                                        leftSection={<IconDeviceFloppy size={16}/>}
                                    >
                                        <Flex direction={`column`} gap={0}>
                                            <Text fz={12} fw={400}>
                                                {t("Add")}
                                            </Text>
                                        </Flex>
                                    </Button>
                                    }
                                </>
                            </Group>
                        </Grid.Col>
                    </Grid>
                </Box>
                <Box  h={1} bg={`gray.3`}></Box>
                <Box mt={'xs'}>
                 <Grid columns={24}>
                    <Grid.Col span={16}>
                        <Grid columns={'32'} gutter={{base: 6}} bg={'gray.2'} pt={4} p={'xs'}>
                            <Grid.Col span={4}>{t('ItemName')}</Grid.Col>
                            <Grid.Col span={4}>{t('MRP')}</Grid.Col>
                            <Grid.Col span={4}>{t('Stock')}</Grid.Col>
                            <Grid.Col span={4}>{t('Quantity')}</Grid.Col>
                            <Grid.Col span={4}>{t('Price')}</Grid.Col>
                            <Grid.Col span={4}>{t('Discount')}(%)</Grid.Col>
                            <Grid.Col span={4}>{t('SubTotal')}</Grid.Col>
                            <Grid.Col span={4}>{t('Action')}</Grid.Col>
                        </Grid>
                        <ScrollArea  p={'xs'} h={height} scrollbarSize={2} type="never">
                            <Grid columns={'32'} gutter={{base: 6}}>
                                <Grid.Col span={4}>Pencil</Grid.Col>
                                <Grid.Col span={4}>12.50</Grid.Col>
                                <Grid.Col span={4}>200</Grid.Col>
                                <Grid.Col span={4}>20</Grid.Col>
                                <Grid.Col span={4}>11.50</Grid.Col>
                                <Grid.Col span={4}>5</Grid.Col>
                                <Grid.Col span={4}>560.50</Grid.Col>
                                <Grid.Col span={4}>
                                    <Group>
                                        <ActionIcon variant="outline" color="red" size="sm" aria-label="Settings">
                                            <IconTrash style={{ width: '70%', height: '70%' }} stroke={1.5} />
                                        </ActionIcon>
                                    </Group>
                                </Grid.Col>
                            </Grid>
                            <Grid columns={'32'} gutter={{base: 6}}>
                                <Grid.Col span={4}>Pencil</Grid.Col>
                                <Grid.Col span={4}>12.50</Grid.Col>
                                <Grid.Col span={4}>200</Grid.Col>
                                <Grid.Col span={4}>20</Grid.Col>
                                <Grid.Col span={4}>11.50</Grid.Col>
                                <Grid.Col span={4}>5</Grid.Col>
                                <Grid.Col span={4}>560.50</Grid.Col>
                                <Grid.Col span={4}>
                                    <Group>
                                        <ActionIcon variant="outline" color="red" size="sm" aria-label="Settings">
                                            <IconTrash style={{ width: '70%', height: '70%' }} stroke={1.5} />
                                        </ActionIcon>
                                    </Group>
                                </Grid.Col>
                            </Grid>
                            <Grid columns={'32'} gutter={{base: 6}}>
                                <Grid.Col span={4}>Pencil</Grid.Col>
                                <Grid.Col span={4}>12.50</Grid.Col>
                                <Grid.Col span={4}>200</Grid.Col>
                                <Grid.Col span={4}>20</Grid.Col>
                                <Grid.Col span={4}>11.50</Grid.Col>
                                <Grid.Col span={4}>5</Grid.Col>
                                <Grid.Col span={4}>560.50</Grid.Col>
                                <Grid.Col span={4}>
                                    <Group>
                                        <ActionIcon variant="outline" color="red" size="sm" aria-label="Settings">
                                            <IconTrash style={{ width: '70%', height: '70%' }} stroke={1.5} />
                                        </ActionIcon>
                                    </Group>
                                </Grid.Col>
                            </Grid>
                            <Grid columns={'32'} gutter={{base: 6}}>
                                <Grid.Col span={4}>Pencil</Grid.Col>
                                <Grid.Col span={4}>12.50</Grid.Col>
                                <Grid.Col span={4}>200</Grid.Col>
                                <Grid.Col span={4}>20</Grid.Col>
                                <Grid.Col span={4}>11.50</Grid.Col>
                                <Grid.Col span={4}>5</Grid.Col>
                                <Grid.Col span={4}>560.50</Grid.Col>
                                <Grid.Col span={4}>
                                    <Group>
                                        <ActionIcon variant="outline" color="red" size="sm" aria-label="Settings">
                                            <IconTrash style={{ width: '70%', height: '70%' }} stroke={1.5} />
                                        </ActionIcon>
                                    </Group>
                                </Grid.Col>
                            </Grid>
                            <Grid columns={'32'} gutter={{base: 6}}>
                                <Grid.Col span={4}>Pencil</Grid.Col>
                                <Grid.Col span={4}>12.50</Grid.Col>
                                <Grid.Col span={4}>200</Grid.Col>
                                <Grid.Col span={4}>20</Grid.Col>
                                <Grid.Col span={4}>11.50</Grid.Col>
                                <Grid.Col span={4}>5</Grid.Col>
                                <Grid.Col span={4}>560.50</Grid.Col>
                                <Grid.Col span={4}>
                                    <Group>
                                        <ActionIcon variant="outline" color="red" size="sm" aria-label="Settings">
                                            <IconTrash style={{ width: '70%', height: '70%' }} stroke={1.5} />
                                        </ActionIcon>
                                    </Group>
                                </Grid.Col>
                            </Grid>
                            <Grid columns={'32'} gutter={{base: 6}}>
                                <Grid.Col span={4}>Pencil</Grid.Col>
                                <Grid.Col span={4}>12.50</Grid.Col>
                                <Grid.Col span={4}>200</Grid.Col>
                                <Grid.Col span={4}>20</Grid.Col>
                                <Grid.Col span={4}>11.50</Grid.Col>
                                <Grid.Col span={4}>5</Grid.Col>
                                <Grid.Col span={4}>560.50</Grid.Col>
                                <Grid.Col span={4}>
                                    <Group>
                                        <ActionIcon variant="outline" color="red" size="sm" aria-label="Settings">
                                            <IconTrash style={{ width: '70%', height: '70%' }} stroke={1.5} />
                                        </ActionIcon>
                                    </Group>
                                </Grid.Col>
                            </Grid>
                        </ScrollArea>
                    </Grid.Col>
                    <Grid.Col span={7} bg={'gray.1'}>
                        <Box bg={'indigo.3'}>
                            <Grid gutter={{base: 6}} >
                                <Grid.Col span={10} pl={'xs'}>
                                    <SelectForm
                                        tooltip={t('CustomerValidateMessage')}
                                        label=''
                                        placeholder={t('Customer')}
                                        required={false}
                                        nextField={'name'}
                                        name={'category_id'}
                                        form={form}
                                        dropdownValue={categoryDropdown}
                                        id={'category_id'}
                                        searchable={false}
                                        value={categoryData}
                                        changeValue={setCategoryData}
                                    />
                                </Grid.Col>
                                <Grid.Col span={2}><Button mt={1} color={'red'} variant={'filled'}
                                                           onClick={open}><IconUserCog size={16}
                                                                                       opacity={0.5}/></Button></Grid.Col>
                                {opened &&
                                <CustomerGroupModel openedModel={opened} open={open} close={close}/>
                                }
                            </Grid>
                            <Box  h={1} mt={'4'} bg={`gray.3`}></Box>
                            <Box mt={'1'}>
                                <Grid gutter={{base:6}} bg={'gray.2'}>
                                    <Grid.Col span={6}>
                                        <Center fz={'xl'}>1200000</Center>
                                        <Center fz={'xs'}>{t('Outstanding')}</Center>
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <Center mt={'xs'}>
                                            <Group>
                                                <ActionIcon >
                                                    <IconMessage size={18} stroke={1.5} />
                                                </ActionIcon>
                                                <ActionIcon variant="light" >
                                                    <IconEyeEdit size={18} stroke={1.5} />
                                                </ActionIcon>
                                            </Group>
                                        </Center>
                                    </Grid.Col>
                                </Grid>
                            </Box>
                        </Box>
                        <ScrollArea h={formHeight} scrollbarSize={2} type="never" bg={'white'}>
                            <Box>
                                <Grid gutter={{base: 6}}>
                                    <Grid.Col span={6}>
                                        <Center>1200000</Center>
                                        <Center fz={'xs'}>{t('SubTotal')}</Center>
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <Center>asdas</Center>
                                        <Center fz={'xs'}>{t('VAT')}</Center>
                                    </Grid.Col>
                                </Grid>
                                <Grid gutter={{base: 6}}>
                                    <Grid.Col span={6}>
                                        <Box h={1} ml={'xl'} mr={'xl'}  bg={`red.3`}></Box>
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <Box h={1}  ml={'xl'} mr={'xl'} bg={`red.3`}></Box>
                                    </Grid.Col>
                                </Grid>
                                <Grid gutter={{base: 6}}>
                                    <Grid.Col span={6}>
                                        <Center>2000</Center>
                                        <Center fz={'xs'}>{t('Discount')}</Center>
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <Center>12341241</Center>
                                        <Center fz={'xs'}>{t('Total')}</Center>
                                    </Grid.Col>
                                </Grid>
                            </Box>
                            <Box>
                                <Tabs variant="outline" defaultValue="cash">
                                    <Tabs.List grow position="apart">
                                        <Tabs.Tab value="cash" icon={<IconPhoto size="0.8rem" />}>CASH</Tabs.Tab>
                                        <Tabs.Tab value="mobile" icon={<IconInfoCircle size="0.8rem" />}>MOBILE</Tabs.Tab>
                                        <Tabs.Tab value="bank" icon={<IconInfoCircle size="0.8rem" />}>BANK</Tabs.Tab>
                                    </Tabs.List>

                                    <Tabs.Panel value="cash" pt="xs">

                                    </Tabs.Panel>
                                    <Tabs.Panel value="mobile" pt="xs">

                                        <Grid gutter={{base: 6}}>
                                            <Grid.Col span={'auto'}>
                                                <SelectForm
                                                    tooltip={t('ProductUnitValidateMessage')}
                                                    label=''
                                                    placeholder={t('ChooseMobileAccount')}
                                                    required={true}
                                                    name={'mobile_account'}
                                                    form={form}
                                                    dropdownValue={productUnitDropdown}
                                                    mt={8}
                                                    id={'mobile_account'}
                                                    nextField={'payment_mobile'}
                                                    searchable={false}
                                                    value={productUnitData}
                                                    changeValue={setProductUnitData}
                                                />
                                            </Grid.Col>
                                        </Grid>

                                        <Grid gutter={{base: 6}}>
                                            <Grid.Col span={6}>
                                                <InputForm
                                                    tooltip={t('ReorderQuantityValidateMessage')}
                                                    label=''
                                                    placeholder={t('PaymentMobile')}
                                                    required={false}
                                                    nextField={'transaction_id'}
                                                    form={form}
                                                    name={'payment_mobile'}
                                                    mt={8}
                                                    id={'payment_mobile'}
                                                />
                                            </Grid.Col>
                                            <Grid.Col span={6}>
                                                <InputForm
                                                    tooltip={t('TransactionIDValidateMessage')}
                                                    label=''
                                                    placeholder={t('TransactionID')}
                                                    required={false}
                                                    nextField={'status'}
                                                    form={form}
                                                    name={'transaction_id'}
                                                    mt={8}
                                                    id={'transaction_id'}
                                                />
                                            </Grid.Col>
                                        </Grid>
                                    </Tabs.Panel>
                                    <Tabs.Panel value="bank" pt="xs">

                                        <Grid gutter={{base: 6}}>
                                            <Grid.Col span={'auto'}>
                                                <SelectForm
                                                    tooltip={t('ProductUnitValidateMessage')}
                                                    label=''
                                                    placeholder={t('ChooseBankAccount')}
                                                    required={true}
                                                    name={'bank_account'}
                                                    form={form}
                                                    dropdownValue={productUnitDropdown}
                                                    mt={8}
                                                    id={'bank_account'}
                                                    nextField={'payment_mobile'}
                                                    searchable={false}
                                                    value={productUnitData}
                                                    changeValue={setProductUnitData}
                                                />
                                            </Grid.Col>
                                        </Grid>

                                        <Grid gutter={{base: 6}}>
                                            <Grid.Col span={6}>
                                                <SelectForm
                                                    tooltip={t('ProductUnitValidateMessage')}
                                                    label=''
                                                    placeholder={t('ChooseBankAccount')}
                                                    required={true}
                                                    name={'BankAccountCard'}
                                                    form={form}
                                                    dropdownValue={productUnitDropdown}
                                                    mt={8}
                                                    id={'paymentCard_id'}
                                                    nextField={'transaction_id'}
                                                    searchable={false}
                                                    value={productUnitData}
                                                    changeValue={setProductUnitData}
                                                />
                                            </Grid.Col>
                                            <Grid.Col span={6}>
                                                <InputForm
                                                    tooltip={t('TransactionIDValidateMessage')}
                                                    label=''
                                                    placeholder={t('paymentCard_id')}
                                                    required={false}
                                                    nextField={'status'}
                                                    form={form}
                                                    name={'transaction_id'}
                                                    mt={8}
                                                    id={'transaction_id'}
                                                />
                                            </Grid.Col>
                                        </Grid>

                                    </Tabs.Panel>
                                </Tabs>
                            </Box>
                            <Box>
                                <TextAreaForm
                                    tooltip={t('Address')}
                                    label=''
                                    placeholder={t('Narration')}
                                    required={false}
                                    nextField={'Status'}
                                    name={'address'}
                                    form={form}
                                    mt={8}
                                    id={'Address'}
                                />
                            </Box>
                            <Box>
                                <SelectForm
                                    tooltip={t('ProductUnitValidateMessage')}
                                    label=''
                                    placeholder={t('SalesBy')}
                                    required={true}
                                    name={'mobile_account'}
                                    form={form}
                                    dropdownValue={productUnitDropdown}
                                    mt={8}
                                    id={'mobile_account'}
                                    nextField={'payment_mobile'}
                                    searchable={false}
                                    value={productUnitData}
                                    changeValue={setProductUnitData}
                                />
                            </Box>
                        </ScrollArea>
                        <Box bg={'gray.2'}>
                            <Box>
                                <Grid gutter={{base: 6}}>
                                    <Grid.Col span={3}>
                                        <Button fullWidth mt={'8'} onClick={() => discountType()} variant="filled" fz={'xs'}
                                                leftSection= {
                                                    value === 'Flat' ? <IconCurrencyTaka size={14} />:<IconPercentage size={14} />
                                                }   color="red">{value}</Button>
                                    </Grid.Col>
                                    <Grid.Col span={3}>
                                        <InputForm
                                            tooltip={t('DiscountValidateMessage')}
                                            label=''
                                            placeholder={t('discount')}
                                            required={false}
                                            nextField={'status'}
                                            form={form}
                                            name={'transaction_id'}
                                            mt={8}
                                            id={'transaction_id'}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <InputForm
                                            tooltip={t('DeliveryChargeValidateMessage')}
                                            label=''
                                            placeholder={t('Amount')}
                                            required={false}
                                            nextField={'status'}
                                            form={form}
                                            name={'amount'}
                                            mt={8}
                                            id={'amount'}
                                        />
                                    </Grid.Col>
                                </Grid>
                            </Box>
                            <Box bg={'white'}>
                                <Grid gutter={{base: 6}}>
                                    <Grid.Col span={3}>
                                        <Switch fullWidth size="lg" mt={'6'} onLabel={t('Profit')} offLabel={t('Hide')} radius="xs" />
                                    </Grid.Col>
                                    <Grid.Col span={3}><Center fz={'md'} mt={'xs'}>1200</Center></Grid.Col>
                                    <Grid.Col span={6}>
                                        <InputForm
                                            tooltip={t('AmountValidateMessage')}
                                            label=''
                                            placeholder={t('Amount')}
                                            required={false}
                                            nextField={'status'}
                                            form={form}
                                            name={'amount'}
                                            mt={8}
                                            id={'amount'}
                                        />
                                    </Grid.Col>
                                </Grid>
                            </Box>
                            <Box>
                                <SelectForm
                                    tooltip={t('ProductUnitValidateMessage')}
                                    label=''
                                    placeholder={t('OrderProcess')}
                                    required={true}
                                    name={'mobile_account'}
                                    form={form}
                                    dropdownValue={productUnitDropdown}
                                    mt={8}
                                    id={'mobile_account'}
                                    nextField={'payment_mobile'}
                                    searchable={false}
                                    value={productUnitData}
                                    changeValue={setProductUnitData}
                                />
                            </Box>
                            <Box mt={'xs'}>
                                <Button.Group fullWidth>
                                    <Button fullWidth variant="filled" leftSection={<IconPrinter size={14} />}  color="violet">Print</Button>
                                    <Button fullWidth variant="filled" leftSection={<IconReceipt size={14} />}  color="red">Pos</Button>
                                    <Button fullWidth variant="filled" leftSection={<IconDeviceFloppy size={14} />}  color="blue">Save</Button>
                                    <Button fullWidth variant="filled" leftSection={<IconStackPush size={14} />}  color="yellow">Hold</Button>
                                </Button.Group>
                            </Box>
                        </Box>
                     </Grid.Col>
                    <Grid.Col span={1}>
                        <Shortcut
                            form={form}
                            FormSubmit={'EntityFormSubmit'}
                            Name={'CompanyName'}
                        />
                    </Grid.Col>
                </Grid>
                </Box>
            </form>
        </Box>

    );
}
export default SalesForm;
