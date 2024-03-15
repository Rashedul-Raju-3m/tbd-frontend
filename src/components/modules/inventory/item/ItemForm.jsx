import React, {useEffect, useState} from "react";
import {useNavigate, useOutletContext} from "react-router-dom";
import {
    Button,
    rem, Flex,
    Grid, Box, ScrollArea, Tooltip, Group, Text, LoadingOverlay, Title,
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {
    IconCheck,
    IconDeviceFloppy, IconInfoCircle, IconPlus,
    IconRestore,
} from "@tabler/icons-react";
import {useDisclosure, useHotkeys} from "@mantine/hooks";
import {useDispatch, useSelector} from "react-redux";
import {hasLength, useForm} from "@mantine/form";
import {modals} from "@mantine/modals";
import {notifications} from "@mantine/notifications";

import Shortcut from "../../shortcut/Shortcut";
import InputForm from "../../../form-builders/InputForm";
import SelectForm from "../../../form-builders/SelectForm";
import TextAreaForm from "../../../form-builders/TextAreaForm";
import SwitchForm from "../../../form-builders/SwitchForm";
import {getBusinessModelDropdown, getCategoryDropdown} from "../../../../store/inventory/utilitySlice";
import {getSettingDropdown} from "../../../../store/inventory/utilitySlice.js";
import {getProductUnitDropdown} from "../../../../store/utility/utilitySlice.js";
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

function ItemForm() {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 116; //TabList height 104
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

    const [productTypeData, setProductTypeData] = useState(null);
    const productTypeDropdownData = useSelector((state) => state.inventoryUtilitySlice.settingDropdown)

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


    const [productUnitData, setProductUnitData] = useState(null);
    const productUnitDropdownData = useSelector((state) => state.utilitySlice.productUnitDropdownData)
    let productUnitDropdown = productUnitDropdownData && productUnitDropdownData.length > 0 ?
        productUnitDropdown.map((type, index) => {
            return ({'label': type.name, 'value': String(type.id)})
        }) : []
    useEffect(() => {
        const value = {
            url: 'utility/select/product-unit'
        }
        dispatch(getProductUnitDropdown(value))
        //  dispatch(setDropdownLoad(false))
    }, [dropdownLoad]);


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
                            url: 'vendor',
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
                <Box pb={`xs`} pl={`xs`} pr={8}>
                    <Grid>
                        <Grid.Col span={6} h={54}>
                            <Title order={6} mt={'xs'} pl={'6'}>{t('CategoryGroupInformation')}</Title>
                        </Grid.Col>
                        <Grid.Col span={6}>
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
                                                {t("CreateAndSave")}
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
                <Box m={'md'}>
                 <Grid columns={24}>
                    <Grid.Col span={'auto'}>
                        <ScrollArea h={height} scrollbarSize={2} type="never">
                            <Box pb={'md'}>
                                <SelectForm
                                    tooltip={t('ProductType')}
                                    label={t('ProductType')}
                                    placeholder={t('ChooseProductType')}
                                    required={true}
                                    name={'product_type'}
                                    form={form}
                                    dropdownValue={productTypeDropdown}
                                    mt={0}
                                    id={'product_type'}
                                    nextField={'category'}
                                    searchable={false}
                                    value={productTypeData}
                                    changeValue={setProductTypeData}
                                />
                                 <SelectForm
                                    tooltip={t('ProductType')}
                                    label={t('ProductType')}
                                    placeholder={t('ChooseProductType')}
                                    required={true}
                                    name={'product_type'}
                                    form={form}
                                    dropdownValue={productUnitDropdown}
                                    mt={0}
                                    id={'product_type'}
                                    nextField={'category'}
                                    searchable={false}
                                    value={productUnitData}
                                    changeValue={setProductUnitData}
                                />
                                <Grid gutter={{base: 6}}>
                                    <Grid.Col span={10}>


                                    </Grid.Col>
                                    <Grid.Col span={2}>
                                        <Button
                                            mt={32}
                                            color={'gray'}
                                            variant={'outline'}
                                            onClick={open}>
                                            <IconPlus size={12} opacity={0.5}
                                            /></Button>
                                    </Grid.Col>
                                    {opened &&
                                    <CategoryGroupModal openedModel={opened} open={open} close={close}/>
                                    }
                                </Grid>
                                <Grid gutter={{base: 6}}>
                                    <Grid.Col span={10}>
                                        <SelectForm
                                            tooltip={t('Category')}
                                            label={t('Category')}
                                            placeholder={t('Category')}
                                            required={true}
                                            nextField={'name'}
                                            name={'category'}
                                            form={form}
                                            dropdownValue={categoryDropdown}
                                            mt={8}
                                            id={'category'}
                                            searchable={false}
                                            value={categoryData}
                                            changeValue={setCategoryData}
                                        />

                                    </Grid.Col>
                                    <Grid.Col span={2}><Button mt={32} color={'gray'} variant={'outline'}
                                                               onClick={open}><IconPlus size={16}
                                                                                        opacity={0.5}/></Button></Grid.Col>
                                    {opened &&
                                    <CustomerGroupModel openedModel={opened} open={open} close={close}/>
                                    }
                                </Grid>
                                <InputForm
                                    tooltip={t('ProductNameValidateMessage')}
                                    label={t('ProductName')}
                                    placeholder={t('ProductName')}
                                    required={true}
                                    nextField={'product_unit'}
                                    form={form}
                                    name={'name'}
                                    mt={8}
                                    id={'name'}
                                />
                                <InputForm
                                    tooltip={t('ProductNameValidateMessage')}
                                    label={t('AlternativeProductName')}
                                    placeholder={t('AlternativeProductName')}
                                    required={false}
                                    nextField={'product_unit'}
                                    form={form}
                                    name={'name'}
                                    mt={8}
                                    id={'name'}
                                />
                                <InputForm
                                    tooltip={t('BarcodeValidateMessage')}
                                    label={t('Barcode')}
                                    placeholder={t('Barcode')}
                                    required={false}
                                    nextField={'product_unit'}
                                    form={form}
                                    name={'barcode'}
                                    mt={8}
                                    id={'barcode'}
                                />
                                <InputForm
                                    tooltip={t('SkuValidateMessage')}
                                    label={t('ProductSku')}
                                    placeholder={t('ProductSku')}
                                    required={false}
                                    nextField={'product_unit'}
                                    form={form}
                                    name={'sku'}
                                    mt={8}
                                    id={'sku'}
                                />

                                <Grid gutter={{base: 6}}>
                                    <Grid.Col span={6}>
                                        <InputForm
                                            tooltip={t('OpeningQuantityValidateMessage')}
                                            label={t('OpeningQuantity')}
                                            placeholder={t('OpeningQuantity')}
                                            required={true}
                                            nextField={'status'}
                                            form={form}
                                            name={'name'}
                                            mt={8}
                                            id={'name'}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <SelectForm
                                            tooltip={t('ProductUnit')}
                                            label={t('ProductUnit')}
                                            placeholder={t('ChooseProductUnit')}
                                            required={true}
                                            name={'product_unit'}
                                            form={form}
                                            dropdownValue={["Family", "Local"]}
                                            mt={8}
                                            id={'product_unit'}
                                            nextField={'category'}
                                            searchable={false}
                                            value={customerGroupData}
                                            changeValue={setCustomerGroupData}
                                        />

                                    </Grid.Col>
                                </Grid>
                                <Grid gutter={{base: 6}}>
                                    <Grid.Col span={6}>
                                        <InputForm
                                            tooltip={t('SalesPriceValidateMessage')}
                                            label={t('SalesPrice')}
                                            placeholder={t('SalesPrice')}
                                            required={true}
                                            nextField={'status'}
                                            form={form}
                                            name={'sales_price'}
                                            mt={8}
                                            id={'sales_price'}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <InputForm
                                            tooltip={t('PurchasePriceValidateMessage')}
                                            label={t('PurchasePrice')}
                                            placeholder={t('PurchasePrice')}
                                            required={true}
                                            nextField={'brand'}
                                            form={form}
                                            name={'sales_price'}
                                            mt={8}
                                            id={'sales_price'}
                                        />
                                    </Grid.Col>
                                </Grid>
                                <Grid gutter={{base: 6}}>
                                    <Grid.Col span={6}>
                                        <InputForm
                                            tooltip={t('MinimumQuantityValidateMessage')}
                                            label={t('MinimumQuantity')}
                                            placeholder={t('MinimumQuantity')}
                                            required={true}
                                            nextField={'status'}
                                            form={form}
                                            name={'min_quantity'}
                                            mt={8}
                                            id={'min_quantity'}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <InputForm
                                            tooltip={t('ReorderQuantityValidateMessage')}
                                            label={t('ReorderQuantity')}
                                            placeholder={t('ReorderQuantity')}
                                            required={true}
                                            nextField={'status'}
                                            form={form}
                                            name={'name'}
                                            mt={8}
                                            id={'name'}
                                        />
                                    </Grid.Col>
                                </Grid>
                                <SelectForm
                                    tooltip={t('BrandNameValidateMessage')}
                                    label={t('Brand')}
                                    placeholder={t('ChooseBrand')}
                                    required={true}
                                    name={'brand'}
                                    form={form}
                                    dropdownValue={["Family", "Local"]}
                                    mt={8}
                                    id={'brand'}
                                    nextField={'category'}
                                    searchable={false}
                                    value={customerGroupData}
                                    changeValue={setCustomerGroupData}
                                />

                                <SwitchForm
                                        tooltip={t('Status')}
                                        label={t('Status')}
                                        nextField={'EntityFormSubmit'}
                                        name={'status'}
                                        form={form}
                                        mt={12}
                                        id={'status'}
                                        position={'left'}
                                        // defaultChecked={!!(formLoading && entityEditData.status === 1)}
                                        defaultChecked={1}
                                    />


                            </Box>
                        </ScrollArea>
                    </Grid.Col>
                    <Grid.Col span={3}>
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
export default ItemForm;