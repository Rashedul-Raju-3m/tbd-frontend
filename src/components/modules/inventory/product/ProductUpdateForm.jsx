import React, { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import {
    Button,
    rem,
    Grid, Box, ScrollArea, Group, Text, Title, Flex, Stack, ActionIcon, LoadingOverlay, Table,
    Menu,
    TextInput,
    Card,
    Badge,
    Image,
    SimpleGrid,
    Center,
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {
    IconCheck,
    IconDeviceFloppy,
    IconDotsVertical,
    IconX,
    IconSortAscendingNumbers,
    IconTrashX,
} from "@tabler/icons-react";
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import InputForm from "../../../form-builders/InputForm";
import { useDispatch, useSelector } from "react-redux";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

import {
    setEditEntityData,
    setFetching, setFormLoading, setInsertType,
    updateEntityData
} from "../../../../store/core/crudSlice.js";
import { DataTable } from 'mantine-datatable';
import tableCss from "../../../../assets/css/Table.module.css";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import SwitchForm from "../../../form-builders/SwitchForm.jsx";
import getSettingProductTypeDropdownData from "../../../global-hook/dropdown/getSettingProductTypeDropdownData.js";
import getSettingProductUnitDropdownData from "../../../global-hook/dropdown/getSettingProductUnitDropdownData.js";
import getSettingCategoryDropdownData from "../../../global-hook/dropdown/getSettingCategoryDropdownData.js";
import InputButtonForm from "../../../form-builders/InputButtonForm";
import { deleteEntityData, storeEntityData } from "../../../../store/inventory/crudSlice.js";
import { modals } from "@mantine/modals";
import { Dropzone } from "@mantine/dropzone";
import productsDataStoreIntoLocalStorage from "../../../global-hook/local-storage/productsDataStoreIntoLocalStorage.js";

function ProductUpdateForm() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 100; //TabList height 104

    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const [setFormData, setFormDataForUpdate] = useState(false);
    const [formLoad, setFormLoad] = useState(true);

    const entityEditData = useSelector((state) => state.crudSlice.entityEditData)
    const formLoading = useSelector((state) => state.crudSlice.formLoading)

    const [categoryData, setCategoryData] = useState(null);
    const [productTypeData, setProductTypeData] = useState(null);
    const [productUnitData, setProductUnitData] = useState(null);
    const [measurmentUnitData, setMeasurmentUnitData] = useState(null);

    // Data's that will come from product Management
    const [colorDropdown, setColorDropdown] = useState(true);
    const [sizeDropdown, setSizeDropdown] = useState(true);
    const [brandDropdown, setBrandDropdown] = useState(true);
    const [titleDropdown, setTitleDropdown] = useState(true);

    const heightCalc = height - 402
    const tableHeight = height - 480

    // Table input fields edit enable disable comes from config

    const [priceInput, setPriceInput] = useState(true);
    const [vatInput, setVatInput] = useState(true);
    const [attInput, setAttInput] = useState(true);

    // forms enable disable comes from config

    const [loadMeasurment, setLoadMeasurment] = useState(true);
    const [loadGallery, setLoadGallery] = useState(true);
    const [loadSku, setLoadSku] = useState(true);


    const form = useForm({
        initialValues: {
            product_type_id: '', category_id: '', unit_id: '', name: '', alternative_name: '', barcode: '', sku: '', sales_price: '', purchase_price: '', min_quantity: '', status: true
        },
        validate: {
            product_type_id: isNotEmpty(),
            category_id: isNotEmpty(),
            unit_id: isNotEmpty(),
            name: hasLength({ min: 2, max: 20 }),
            sales_price: (value) => {
                const isNumberOrFractional = /^-?\d+(\.\d+)?$/.test(value);
                if (!isNumberOrFractional) {
                    return true;
                }
            },
        }
    });
    const dropDownform = useForm({
        initialValues: {
            color: '', brand: '', size: '', title: ''
        },
        validate: {

        }
    })
    const handleDropDownFormSubmit = (values) => {
        console.log("Child form values:", values);
        // dispatch(setValidationData(false))
        // modals.openConfirmModal({
        //     title: (
        //         <Text size="md"> {t("FormConfirmationTitle")}</Text>
        //     ),
        //     children: (
        //         <Text size="sm"> {t("FormConfirmationMessage")}</Text>
        //     ),
        //     labels: { confirm: t('Submit'), cancel: t('Cancel') }, confirmProps: { color: 'red' },
        //     onCancel: () => console.log('Cancel'),
        //     onConfirm: () => {
        //         const value = {
        //             url: 'core/customer',
        //             data: values
        //         }
        //         dispatch(storeEntityData(value))
        //     },
        // });
    };

    const [featureImage, setFeatureImage] = useState(null);
    const [additionalImages, setAdditionalImages] = useState(Array(4).fill(null));

    const handleFeatureImageDrop = (files) => {
        if (files[0]) {
            setFeatureImage(URL.createObjectURL(files[0]));
        }
    };

    const handleAdditionalImageDrop = (files, index) => {
        if (files[0]) {
            const newAdditionalImages = [...additionalImages];
            newAdditionalImages[index] = URL.createObjectURL(files[0]);
            setAdditionalImages(newAdditionalImages);
        }
    };

    useEffect(() => {
        setFormLoad(true)
        setFormDataForUpdate(true)
    }, [dispatch, formLoading])
    //console.log(entityEditData);
    useEffect(() => {

        form.setValues({
            product_type_id: entityEditData.product_type_id ? entityEditData.product_type_id : '',
            category_id: entityEditData.category_id ? entityEditData.category_id : '',
            unit_id: entityEditData.unit_id ? entityEditData.unit_id : '',
            name: entityEditData.product_name ? entityEditData.product_name : '',
            alternative_name: entityEditData.alternative_name ? entityEditData.alternative_name : '',
            barcode: entityEditData.barcode ? entityEditData.barcode : '',
            sku: entityEditData.sku ? entityEditData.sku : '',
            sales_price: entityEditData.sales_price ? entityEditData.sales_price : '',
            purchase_price: entityEditData.purchase_price ? entityEditData.purchase_price : '',
            min_quantity: entityEditData.min_quantity ? entityEditData.min_quantity : '',
            status: entityEditData.status ? entityEditData.status : '',
        })

        dispatch(setFormLoading(false))
        setTimeout(() => {
            setFormLoad(false)
            setFormDataForUpdate(false)
        }, 500)

    }, [entityEditData, dispatch, setFormData])


    useHotkeys([['alt+n', () => {
        !groupDrawer && document.getElementById('product_type_id').focus()
    }]], []);

    useHotkeys([['alt+r', () => {
        form.reset()
    }]], []);

    useHotkeys([['alt+s', () => {
        !groupDrawer && document.getElementById('EntityFormSubmit').click()
    }]], []);

    const data = [
        {
            name: 'Foysal Mahmud hasan Rafi Babul',
            color: 'red',
            size: 'xl',
            stock: '100',
            brand: 'Apex',
            title: 'title'
        },
        {
            name: 'shoe',
            color: 'red',
            size: 'xl',
            stock: '100',
            brand: 'Apex',
            title: 'title'
        },
        {
            name: 'shoe',
            color: 'red',
            size: 'xl',
            stock: '100',
            brand: 'Apex',
            title: 'title'
        },
        {
            name: 'shoe',
            color: 'red',
            size: 'xl',
            stock: '100',
            brand: 'Apex',
            title: 'title'
        },
        {
            name: 'shoe',
            color: 'red',
            size: 'xl',
            stock: '100',
            brand: 'Apex',
            title: 'title'
        },
        {
            name: 'shoe',
            color: 'red',
            size: 'xl',
            stock: '100',
            brand: 'Apex',
            title: 'title'
        }, {
            name: 'shoe',
            color: 'red',
            size: 'xl',
            stock: '100',
            brand: 'Apex',
            title: 'title'
        }, {
            name: 'shoe',
            color: 'red',
            size: 'xl',
            stock: '100',
            brand: 'Apex',
            title: 'title'
        }, {
            name: 'shoe',
            color: 'red',
            size: 'xl',
            stock: '100',
            brand: 'Apex',
            title: 'title'
        }, {
            name: 'shoe',
            color: 'red',
            size: 'xl',
            stock: '100',
            brand: 'Apex',
            title: 'title'
        }
    ]
    const brand = [
        'apex', 'bata', 'pegasus'
    ]
    const color = [
        'black', 'white', 'yellow'
    ]
    const size = [
        'small', 'medium', 'large'
    ]
    const title = [
        'title1', 'title2', 'title3'
    ]

    const [brandData, setBrandData] = useState(null)
    const [colorData, setColorData] = useState(null)
    const [sizeData, setSizeData] = useState(null)
    const [titleData, setTitleData] = useState(null)


    return (
        <Box>
            <form onSubmit={form.onSubmit((values) => {
                modals.openConfirmModal({
                    title: (
                        <Text size="md"> {t("FormConfirmationTitle")}</Text>
                    ),
                    children: (
                        <Text size="sm"> {t("FormConfirmationMessage")}</Text>
                    ),
                    labels: { confirm: t('Submit'), cancel: t('Cancel') }, confirmProps: { color: 'red' },
                    onCancel: () => console.log('Cancel'),
                    onConfirm: () => {
                        setSaveCreateLoading(true)
                        const storedProducts = localStorage.getItem('core-products');
                        const localProducts = storedProducts ? JSON.parse(storedProducts) : [];
                        const updatedProducts = localProducts.map(product => {
                            if (product.id === entityEditData.id) {
                                return {
                                    ...product,
                                    product_name: values.name,
                                    alternative_name: values.alternative_name
                                };
                            }
                            return product
                        });
                        localStorage.setItem('core-products', JSON.stringify(updatedProducts));
                        const value = {
                            url: 'inventory/product/' + entityEditData.id,
                            data: values
                        }
                        dispatch(updateEntityData(value))
                        notifications.show({
                            color: 'teal',
                            title: t('UpdateSuccessfully'),
                            icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                            loading: false,
                            autoClose: 700,
                            style: { backgroundColor: 'lightgray' },
                        });

                        setTimeout(() => {
                            productsDataStoreIntoLocalStorage()
                            form.reset()
                            dispatch(setInsertType('create'))
                            dispatch(setEditEntityData([]))
                            setProductTypeData(null)
                            setCategoryData(null)
                            setProductUnitData(null)
                            dispatch(setFetching(true))
                            setSaveCreateLoading(false)
                            navigate('/inventory/product', { replace: true })
                        }, 700)
                    },
                });
            })}>
                <Grid columns={24} gutter={{ base: 8 }}>
                    <Grid.Col span={8} >
                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                            <Box pl={`xs`} pb={'6'} pr={8} pt={'6'} mb={'4'} className={'boxBackground borderRadiusAll'} >
                                <Grid>
                                    <Grid.Col span={6} >
                                        <Title order={6} pt={'6'}>{t('UpdateProduct')}</Title>
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        {/* <Stack right align="flex-end">
                                            <>
                                                {
                                                    !saveCreateLoading && isOnline &&
                                                    <Button
                                                        size="xs"
                                                        color={`green.8`}
                                                        type="submit"
                                                        id="EntityFormSubmit"
                                                        leftSection={<IconDeviceFloppy size={16} />}
                                                    >
                                                        <Flex direction={`column`} gap={0}>
                                                            <Text fz={14} fw={400}>
                                                                {t("UpdateAndSave")}
                                                            </Text>
                                                        </Flex>
                                                    </Button>
                                                }
                                            </></Stack> */}
                                    </Grid.Col>
                                </Grid>
                            </Box>
                            <Box pl={`xs`} pr={'xs'} className={'borderRadiusAll'}>
                                <ScrollArea h={height + 4} scrollbarSize={2} scrollbars="y" type="never">
                                    <Box>
                                        <LoadingOverlay visible={formLoad} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                                        <Box mt={'xs'}>
                                            <SelectForm
                                                tooltip={t('ChooseProductType')}
                                                label={t('ProductType')}
                                                placeholder={t('ChooseProductType')}
                                                required={true}
                                                name={'product_type_id'}
                                                form={form}
                                                dropdownValue={getSettingProductTypeDropdownData()}
                                                mt={0}
                                                id={'product_type_id'}
                                                nextField={'category_id'}
                                                searchable={true}
                                                value={productTypeData ? String(productTypeData) : (entityEditData.product_type_id ? String(entityEditData.product_type_id) : null)}
                                                changeValue={setProductTypeData}
                                            />
                                        </Box>
                                        <Box mt={'xs'}>
                                            <Grid gutter={{ base: 6 }}>
                                                <Grid.Col span={12}>
                                                    <SelectForm
                                                        tooltip={t('ChooseCategory')}
                                                        label={t('Category')}
                                                        placeholder={t('ChooseCategory')}
                                                        required={true}
                                                        nextField={'name'}
                                                        name={'category_id'}
                                                        form={form}
                                                        dropdownValue={getSettingCategoryDropdownData()}
                                                        id={'category_id'}
                                                        searchable={true}
                                                        value={categoryData ? String(categoryData) : (entityEditData.category_id ? String(entityEditData.category_id) : null)}
                                                        changeValue={setCategoryData}
                                                    />
                                                </Grid.Col>
                                            </Grid>
                                        </Box>
                                        <Box mt={'xs'}>
                                            <InputForm
                                                tooltip={t('ProductNameValidateMessage')}
                                                label={t('ProductName')}
                                                placeholder={t('ProductName')}
                                                required={true}
                                                nextField={'alternative_name'}
                                                form={form}
                                                name={'name'}
                                                mt={8}
                                                id={'name'}
                                            />
                                        </Box>
                                        <Box mt={'xs'}>
                                            <InputForm
                                                tooltip={t('AlternativeProductNameValidateMessage')}
                                                label={t('AlternativeProductName')}
                                                placeholder={t('AlternativeProductName')}
                                                required={false}
                                                nextField={'sku'}
                                                form={form}
                                                name={'alternative_name'}
                                                mt={8}
                                                id={'alternative_name'}
                                            />
                                        </Box>
                                        <Box mt={'xs'}>
                                            <Grid gutter={{ base: 6 }}>
                                                <Grid.Col span={6}>
                                                    <InputForm
                                                        tooltip={t('ProductSkuValidateMessage')}
                                                        label={t('ProductSku')}
                                                        placeholder={t('ProductSku')}
                                                        required={false}
                                                        nextField={'barcode'}
                                                        form={form}
                                                        name={'sku'}
                                                        mt={8}
                                                        id={'sku'}
                                                    />
                                                </Grid.Col>
                                                <Grid.Col span={6}>
                                                    <InputForm
                                                        tooltip={t('BarcodeValidateMessage')}
                                                        label={t('Barcode')}
                                                        placeholder={t('Barcode')}
                                                        required={false}
                                                        nextField={'unit_id'}
                                                        form={form}
                                                        name={'barcode'}
                                                        mt={8}
                                                        id={'barcode'}
                                                    />
                                                </Grid.Col>
                                            </Grid>
                                        </Box>

                                        <Box mt={'xs'}>
                                            <Grid gutter={{ base: 6 }}>
                                                <Grid.Col span={6}>
                                                    <InputForm
                                                        tooltip={t('SalesPriceValidateMessage')}
                                                        label={t('SalesPrice')}
                                                        placeholder={t('SalesPrice')}
                                                        required={true}
                                                        nextField={'purchase_price'}
                                                        form={form}
                                                        name={'sales_price'}
                                                        mt={8}
                                                        id={'sales_price'}
                                                    />
                                                </Grid.Col>
                                                <Grid.Col span={6}>
                                                    <InputForm
                                                        tooltip={t('PurchasePrice')}
                                                        label={t('PurchasePrice')}
                                                        placeholder={t('PurchasePrice')}
                                                        required={false}
                                                        nextField={'min_quantity'}
                                                        form={form}
                                                        name={'purchase_price'}
                                                        mt={8}
                                                        id={'purchase_price'}
                                                    />
                                                </Grid.Col>
                                            </Grid>
                                        </Box>
                                        <Box mt={'xs'}>
                                            <Grid gutter={{ base: 6 }}>
                                                <Grid.Col span={6}>
                                                    <SelectForm
                                                        tooltip={t('ChooseProductUnit')}
                                                        label={t('ProductUnit')}
                                                        placeholder={t('ChooseProductUnit')}
                                                        required={true}
                                                        name={'unit_id'}
                                                        form={form}
                                                        dropdownValue={getSettingProductUnitDropdownData()}
                                                        mt={8}
                                                        id={'unit_id'}
                                                        nextField={'min_quantity'}
                                                        searchable={true}
                                                        changeValue={setProductUnitData}
                                                        value={productUnitData ? String(productUnitData) : (entityEditData.unit_id ? String(entityEditData.unit_id) : null)}
                                                    />
                                                </Grid.Col>
                                                <Grid.Col span={6}>
                                                    <InputForm
                                                        tooltip={t('MinimumQuantityValidateMessage')}
                                                        label={t('MinimumQuantity')}
                                                        placeholder={t('MinimumQuantity')}
                                                        required={false}
                                                        form={form}
                                                        name={'min_quantity'}
                                                        mt={8}
                                                        id={'min_quantity'}
                                                    />
                                                </Grid.Col>
                                            </Grid>
                                        </Box>
                                        <Box mt={'md'}>
                                            <Grid gutter={{ base: 6 }}>
                                                <Grid.Col span={6}>
                                                    <Box mt={'xs'}>
                                                        <Grid columns={6} gutter={{ base: 1 }}>
                                                            <Grid.Col span={2}>
                                                                <SwitchForm
                                                                    tooltip={t('Status')}
                                                                    label=''
                                                                    nextField={'EntityFormSubmit'}
                                                                    name={'status'}
                                                                    form={form}
                                                                    color="red"
                                                                    id={'status'}
                                                                    position={'left'}
                                                                    defaultChecked={1}
                                                                    checked={form.values.status}
                                                                />
                                                            </Grid.Col>
                                                            <Grid.Col span={4} fz={'sm'} pt={'1'}>{t('Status')}
                                                            </Grid.Col>
                                                        </Grid>
                                                    </Box>
                                                </Grid.Col>
                                            </Grid>
                                        </Box>
                                    </Box>
                                </ScrollArea>
                            </Box>
                        </Box>
                    </Grid.Col>
                    <Grid.Col span={16}>
                        <Stack gap={'8'}>
                            <Grid columns={12} gutter={{ base: 8 }}>
                                {loadMeasurment &&
                                    <Grid.Col span={6} >
                                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                            <Box pl={`4`} pb={'3'} pr={8} pt={'3'} mb={'4'} className={'boxBackground borderRadiusAll'} >
                                                <Grid gutter={'4'}>
                                                    <Grid.Col span={5}>
                                                        <SelectForm
                                                            tooltip={t('ChooseProductUnit')}
                                                            label=''
                                                            placeholder={t('ChooseProductUnit')}
                                                            required={true}
                                                            name={'unit_id'}
                                                            form={form}
                                                            dropdownValue={getSettingProductUnitDropdownData()}
                                                            id={'unit_id'}
                                                            nextField={'quantity'}
                                                            searchable={true}
                                                            value={measurmentUnitData}
                                                            changeValue={setMeasurmentUnitData}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={3}>
                                                        <InputButtonForm
                                                            tooltip=''
                                                            label=''
                                                            placeholder={t('QTY')}
                                                            required={true}
                                                            nextField={'EntityFormSubmit'}
                                                            form={form}
                                                            name={'quantity'}
                                                            id={'quantity'}
                                                            leftSection={<IconSortAscendingNumbers size={16} opacity={0.5} />}
                                                            rightSection={(entityEditData.unit_name ? String(entityEditData.unit_name) : '')}
                                                            closeIcon={false}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={4}>
                                                        <Stack right align="flex-end" pt={'3'}>
                                                            <>
                                                                {
                                                                    !saveCreateLoading && isOnline &&
                                                                    <Button
                                                                        size="xs"
                                                                        color={`red.3`}
                                                                        type="submit"
                                                                        id="EntityFormSubmit"
                                                                        leftSection={<IconDeviceFloppy size={18} />}
                                                                    >
                                                                        <Flex direction={`column`} gap={0}>
                                                                            <Text fz={14} fw={400}>
                                                                                {t("AddMeasurment")}
                                                                            </Text>
                                                                        </Flex>
                                                                    </Button>
                                                                }
                                                            </>
                                                        </Stack>
                                                    </Grid.Col>

                                                </Grid>
                                            </Box>
                                            <Box pl={`xs`} pr={'xs'} className={'borderRadiusAll'}>
                                                <ScrollArea h={heightCalc} scrollbarSize={2} scrollbars="y" type="never">
                                                    <Box>
                                                        <LoadingOverlay visible={formLoad} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                                                    </Box>
                                                    <Box>
                                                        <Table stickyHeader >
                                                            <Table.Thead>
                                                                <Table.Tr>
                                                                    <Table.Th fz="xs" w={'20'}>{t('S/N')}</Table.Th>
                                                                    <Table.Th fz="xs" ta="left" w={'300'}>{t('Name')}</Table.Th>
                                                                    <Table.Th fz="xs" ta="center" w={'60'}>{t('QTY')}</Table.Th>
                                                                    <Table.Th ta="right" fz="xs" w={'80'}>{t('Unit')}</Table.Th>
                                                                    <Table.Th ta="right" fz="xs" w={'80'}></Table.Th>
                                                                </Table.Tr>
                                                            </Table.Thead>
                                                            <Table.Tbody>
                                                                <Table.Tr>
                                                                    <Table.Th fz="xs" w={'20'}>1</Table.Th>
                                                                    <Table.Th fz="xs" ta="left" w={'300'}>Pcs</Table.Th>
                                                                    <Table.Th fz="xs" ta="center" w={'60'}>20</Table.Th>
                                                                    <Table.Th ta="right" fz="xs" w={'80'}>Box</Table.Th>
                                                                    <Table.Th ta="right" fz="xs" w={'80'}><ActionIcon size="sm" variant="transparent" color="red">
                                                                        <IconX height={'18'} width={'18'} stroke={1.5} />
                                                                    </ActionIcon></Table.Th>
                                                                </Table.Tr>
                                                                <Table.Tr>
                                                                    <Table.Th fz="xs" w={'20'}>1</Table.Th>
                                                                    <Table.Th fz="xs" ta="left" w={'300'}>Pcs</Table.Th>
                                                                    <Table.Th fz="xs" ta="center" w={'60'}>20</Table.Th>
                                                                    <Table.Th ta="right" fz="xs" w={'80'}>Box</Table.Th>
                                                                    <Table.Th ta="right" fz="xs" w={'80'}><ActionIcon size="sm" variant="transparent" color="red">
                                                                        <IconX height={'18'} width={'18'} stroke={1.5} />
                                                                    </ActionIcon></Table.Th>
                                                                </Table.Tr>
                                                                <Table.Tr>
                                                                    <Table.Th fz="xs" w={'20'}>1</Table.Th>
                                                                    <Table.Th fz="xs" ta="left" w={'300'}>Pcs</Table.Th>
                                                                    <Table.Th fz="xs" ta="center" w={'60'}>20</Table.Th>
                                                                    <Table.Th ta="right" fz="xs" w={'80'}>Box</Table.Th>
                                                                    <Table.Th ta="right" fz="xs" w={'80'}><ActionIcon size="sm" variant="transparent" color="red">
                                                                        <IconX height={'18'} width={'18'} stroke={1.5} />
                                                                    </ActionIcon></Table.Th>
                                                                </Table.Tr>
                                                            </Table.Tbody>
                                                        </Table>
                                                    </Box>
                                                    {/* Temporary buttons to check dropdown functionality */}
                                                    <Group justify={'space-between'} gap={'xs'} grow>

                                                        <Button color={colorDropdown ? "green.8" : "red.5"} onClick={
                                                            () => {
                                                                colorDropdown && setColorDropdown(false)
                                                                !colorDropdown && setColorDropdown(true)
                                                            }
                                                        }>
                                                            Color
                                                        </Button >
                                                        <Button color={brandDropdown ? "green.8" : "red.5"} onClick={
                                                            () => {
                                                                brandDropdown && setBrandDropdown(false)
                                                                !brandDropdown && setBrandDropdown(true)
                                                            }
                                                        }>
                                                            Brand
                                                        </Button>
                                                        <Button color={sizeDropdown ? "green.8" : "red.5"} onClick={
                                                            () => {
                                                                sizeDropdown && setSizeDropdown(false)
                                                                !sizeDropdown && setSizeDropdown(true)

                                                            }}>
                                                            Size
                                                        </Button>
                                                        <Button color={titleDropdown ? "green.8" : "red.5"} onClick={
                                                            () => {
                                                                titleDropdown && setTitleDropdown(false)
                                                                !titleDropdown && setTitleDropdown(true)
                                                            }
                                                        }>
                                                            Title
                                                        </Button>
                                                    </Group>
                                                </ScrollArea>

                                            </Box>
                                        </Box>
                                    </Grid.Col>
                                }

                                {loadGallery &&
                                    <Grid.Col span={6} >
                                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                            <Box pl={`xs`} pb={'6'} pr={8} pt={'6'} mb={'4'} className={'boxBackground borderRadiusAll'} >
                                                <Grid>
                                                    <Grid.Col span={6} >
                                                        <Title order={6} pt={'4'} pb={4}>{t('Gallery')}</Title>
                                                    </Grid.Col>
                                                    <Grid.Col span={6}>

                                                    </Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box className={'borderRadiusAll'}>

                                                <Card h={heightCalc} padding="xs">
                                                    <Card.Section p={'xs'}>
                                                        <Dropzone
                                                            onDrop={handleFeatureImageDrop}
                                                            accept={['image/*']}
                                                            h={190}
                                                            p={0}
                                                            styles={(theme) => ({
                                                                root: {
                                                                    border: featureImage ? 'none' : undefined,
                                                                },
                                                            })}
                                                        >
                                                            {featureImage ? (
                                                                <Image src={featureImage} height={190} fit="cover" alt="Feature image" />
                                                            ) : (
                                                                <Center h={190}>
                                                                    <Text >Select feature image</Text>
                                                                </Center>
                                                            )}
                                                        </Dropzone>
                                                    </Card.Section>
                                                    <SimpleGrid cols={4}>
                                                        {additionalImages.map((image, index) => (
                                                            <Dropzone
                                                                key={index}
                                                                onDrop={(files) => handleAdditionalImageDrop(files, index)}
                                                                accept={['image/*']}
                                                                // maxSize={3 * 1024 ** 2}
                                                                h={100}
                                                                p={0}
                                                                styles={(theme) => ({
                                                                    root: {
                                                                        border: image ? 'none' : undefined,
                                                                    },
                                                                })}
                                                            >
                                                                {image ? (
                                                                    <Image
                                                                        src={image}
                                                                        height={100}
                                                                        width="100%"
                                                                        alt={`Additional image ${index + 1}`}
                                                                        fit="cover"
                                                                    />
                                                                ) : (
                                                                    <Center h={100}>
                                                                        <Text>Select image</Text>
                                                                    </Center>
                                                                )}
                                                            </Dropzone>
                                                        ))}
                                                    </SimpleGrid>
                                                </Card>

                                            </Box>
                                        </Box>
                                    </Grid.Col>
                                }
                            </Grid>
                            <Grid columns={12} gutter={{ base: 8 }}>
                                {loadSku &&
                                    <Grid.Col span={12}>
                                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                            <Box pl={`xs`} pb={'6'} pr={8} pt={'6'} mb={'4'} className={'boxBackground borderRadiusAll'} >
                                                <Grid>
                                                    <Grid.Col span={6} >
                                                        <Title order={6} pt={'6'}>{t('SKUItem')}</Title>
                                                    </Grid.Col>
                                                    <Grid.Col span={6}>
                                                        <Stack right align="flex-end">
                                                            <>
                                                                {
                                                                    !saveCreateLoading && isOnline &&
                                                                    <Button
                                                                        size="xs"
                                                                        color={`green.8`}
                                                                        onClick={
                                                                            () => {
                                                                                handleDropDownFormSubmit(dropDownform.values)
                                                                            }
                                                                        }
                                                                        id="EntityDropDownSubmit"
                                                                        leftSection={<IconDeviceFloppy size={16} />}
                                                                    >
                                                                        <Flex direction={`column`} gap={0}>
                                                                            <Text fz={14} fw={400}>
                                                                                {t("Add")}
                                                                            </Text>
                                                                        </Flex>
                                                                    </Button>
                                                                }
                                                            </></Stack>
                                                    </Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box className={'borderRadiusAll'} mb={'xs'}>
                                                <ScrollArea h={heightCalc - 46} scrollbarSize={2} scrollbars="y" type="never">
                                                    <Box>
                                                        <dropDownform >
                                                            <>
                                                                <LoadingOverlay visible={formLoad} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                                                                <Box pl={4} pr={4} pt={'4'} pb={2} className={'boxBackground  border-bottom-none'} >
                                                                    <Grid columns={12} gutter={{ base: 2 }}>
                                                                        {colorDropdown &&
                                                                            <Grid.Col span={'auto'}>
                                                                                <SelectForm
                                                                                    tooltip={t('ChooseProdcutColor')}
                                                                                    label={t('Color')}
                                                                                    placeholder={t('ChooseColor')}
                                                                                    // required={true}
                                                                                    name={'color'}
                                                                                    form={dropDownform}
                                                                                    dropdownValue={color}
                                                                                    mt={0}
                                                                                    id={'color'}
                                                                                    nextField={'size'}
                                                                                    searchable={true}
                                                                                    value={colorData}
                                                                                    changeValue={setColorData}
                                                                                />
                                                                            </Grid.Col>
                                                                        }
                                                                        {sizeDropdown &&
                                                                            <Grid.Col span={'auto'}>
                                                                                <SelectForm
                                                                                    tooltip={t('ChooseProductSize')}
                                                                                    label={t('Size')}
                                                                                    placeholder={t('ChooseSize')}
                                                                                    // required={true}
                                                                                    name={'size'}
                                                                                    form={dropDownform}
                                                                                    dropdownValue={size}
                                                                                    mt={0}
                                                                                    id={'size'}
                                                                                    nextField={'brand'}
                                                                                    searchable={true}
                                                                                    value={sizeData}
                                                                                    changeValue={setSizeData}
                                                                                />

                                                                            </Grid.Col>
                                                                        }
                                                                        {brandDropdown &&
                                                                            <Grid.Col span={'auto'}>
                                                                                < SelectForm
                                                                                    tooltip={t('ChooseProductBrand')}
                                                                                    label={t('Brand')}
                                                                                    placeholder={t('ChooseBrand')}
                                                                                    // required={true}
                                                                                    name={'brand'}
                                                                                    form={dropDownform}
                                                                                    dropdownValue={brand}
                                                                                    mt={0}
                                                                                    id={'brand'}
                                                                                    nextField={'title'}
                                                                                    searchable={true}
                                                                                    value={brandData}
                                                                                    changeValue={setBrandData}
                                                                                />

                                                                            </Grid.Col>
                                                                        }
                                                                        {titleDropdown &&
                                                                            <Grid.Col span={'auto'}>
                                                                                <SelectForm
                                                                                    tooltip={t('ChooseProductType')}
                                                                                    label={t('Title')}
                                                                                    placeholder={t('ChooseProductType')}
                                                                                    // required={true}
                                                                                    name={'title'}
                                                                                    form={dropDownform}
                                                                                    dropdownValue={title}
                                                                                    mt={0}
                                                                                    id={'title'}
                                                                                    nextField={'EntityDropDownSubmit'}
                                                                                    searchable={true}
                                                                                    value={titleData}
                                                                                    changeValue={setTitleData}
                                                                                />

                                                                            </Grid.Col>
                                                                        }
                                                                    </Grid>
                                                                </Box>
                                                            </>
                                                        </dropDownform>
                                                        <Box className={'border-top-none'}>
                                                            <DataTable
                                                                classNames={{
                                                                    root: tableCss.root,
                                                                    table: tableCss.table,
                                                                    header: tableCss.header,
                                                                    footer: tableCss.footer,
                                                                    pagination: tableCss.pagination,
                                                                }}
                                                                records={data}
                                                                columns={[
                                                                    {
                                                                        accessor: 'index',
                                                                        title: t('S/N'),
                                                                        textAlignment: 'right   ',
                                                                        render: (item) => (data.indexOf(item) + 1),
                                                                        width: 50
                                                                    },
                                                                    { accessor: 'name', title: t("Name"), width: 200 },
                                                                    ...(sizeDropdown ? [{ accessor: 'size', title: t("Size"), width: 60 }] : []),
                                                                    ...(colorDropdown ? [{ accessor: 'color', title: t("Color"), width: 80 }] : []),
                                                                    ...(brandDropdown ? [{ accessor: 'brand', title: t("Brand"), width: 80 }] : []),
                                                                    ...(titleDropdown ? [{ accessor: 'title', title: t("Title"), width: 80 }] : []),
                                                                    {
                                                                        accessor: 'price', title: t("Price"), textAlign: "center",
                                                                        width: '100px',
                                                                        render: (item) => {
                                                                            const [editedPrice, setEditedPrice] = useState(item.price);

                                                                            const handlPriceChange = (e) => {
                                                                                const editedPrice = e.currentTarget.value;
                                                                                setEditedPrice(editedPrice);
                                                                                console.log(editedPrice)
                                                                            };

                                                                            return (
                                                                                priceInput ?
                                                                                    <>
                                                                                        <TextInput
                                                                                            type="number"
                                                                                            label=""
                                                                                            size="xs"
                                                                                            value={editedPrice}
                                                                                            onChange={handlPriceChange}
                                                                                        // onKeyDown={getHotkeyHandler([
                                                                                        //     ['Enter', (e) => {
                                                                                        //         document.getElementById('inline-update-quantity-' + item.product_id).focus();
                                                                                        //     }],
                                                                                        // ])}
                                                                                        />
                                                                                    </>
                                                                                    :
                                                                                    1000
                                                                            );
                                                                        }
                                                                    },
                                                                    {
                                                                        accessor: 'vat', title: t("Vat"), textAlign: "center",
                                                                        width: '100px',
                                                                        render: (item) => {
                                                                            const [editedVat, setEditedVat] = useState(item.vat);

                                                                            const handlVatChange = (e) => {
                                                                                const editedVat = e.currentTarget.value;
                                                                                setEditedVat(editedVat);
                                                                                console.log(editedVat)
                                                                            };

                                                                            return (
                                                                                !vatInput ?
                                                                                    <>
                                                                                        <TextInput
                                                                                            type="number"
                                                                                            label=""
                                                                                            size="xs"
                                                                                            value={editedVat}
                                                                                            onChange={handlVatChange}
                                                                                        // onKeyDown={getHotkeyHandler([
                                                                                        //     ['Enter', (e) => {
                                                                                        //         document.getElementById('inline-update-quantity-' + item.product_id).focus();
                                                                                        //     }],
                                                                                        // ])}
                                                                                        />
                                                                                    </>
                                                                                    :
                                                                                    '10%'
                                                                            );
                                                                        }
                                                                    },
                                                                    {
                                                                        accessor: 'att', title: t("ATT"), textAlign: "center",
                                                                        width: '100px',
                                                                        render: (item) => {
                                                                            const [editedAtt, setEditedAtt] = useState(item.att);

                                                                            const handlAttChange = (e) => {
                                                                                const editedAtt = e.currentTarget.value;
                                                                                setEditedAtt(editedAtt);
                                                                                console.log(editedAtt)
                                                                            };

                                                                            return (
                                                                                attInput ?
                                                                                    <>
                                                                                        <TextInput
                                                                                            type="number"
                                                                                            label=""
                                                                                            size="xs"
                                                                                            value={editedAtt}
                                                                                            onChange={handlAttChange}
                                                                                        // onKeyDown={getHotkeyHandler([
                                                                                        //     ['Enter', (e) => {
                                                                                        //         document.getElementById('inline-update-quantity-' + item.product_id).focus();
                                                                                        //     }],
                                                                                        // ])}
                                                                                        />
                                                                                    </>
                                                                                    :
                                                                                    10
                                                                            );
                                                                        }
                                                                    },
                                                                    {
                                                                        accessor: "action",
                                                                        title: t("Action"),
                                                                        textAlign: "right",
                                                                        render: (data) => (
                                                                            <Group gap={4} justify="right" wrap="nowrap">
                                                                                <Menu position="bottom-end" offset={3} withArrow trigger="hover" openDelay={100} closeDelay={400}>
                                                                                    <Menu.Target>
                                                                                        <ActionIcon size="sm" variant="outline" color="red" radius="xl" aria-label="Settings">
                                                                                            <IconDotsVertical height={'18'} width={'18'} stroke={1.5} />
                                                                                        </ActionIcon>
                                                                                    </Menu.Target>
                                                                                    <Menu.Dropdown>
                                                                                        <Menu.Item
                                                                                            // href={`/inventory/sales/edit/${data.id}`}
                                                                                            onClick={() => {
                                                                                                dispatch(setInsertType('update'))
                                                                                                dispatch(editEntityData('inventory/product/' + data.id))
                                                                                                dispatch(setFormLoading(true))
                                                                                                navigate(`/inventory/product/${data.id}`)
                                                                                            }}
                                                                                        >
                                                                                            {t('Edit')}
                                                                                        </Menu.Item>

                                                                                        <Menu.Item
                                                                                            onClick={() => {
                                                                                                setViewDrawer(true)
                                                                                                dispatch(showEntityData('inventory/product/' + data.id))
                                                                                            }}
                                                                                            target="_blank"
                                                                                            component="a"
                                                                                            w={'200'}
                                                                                        >
                                                                                            {t('Show')}
                                                                                        </Menu.Item>
                                                                                        <Menu.Item
                                                                                            // href={``}
                                                                                            target="_blank"
                                                                                            component="a"
                                                                                            w={'200'}
                                                                                            mt={'2'}
                                                                                            bg={'red.1'}
                                                                                            c={'red.6'}
                                                                                            onClick={() => {
                                                                                                modals.openConfirmModal({
                                                                                                    title: (
                                                                                                        <Text size="md"> {t("FormConfirmationTitle")}</Text>
                                                                                                    ),
                                                                                                    children: (
                                                                                                        <Text size="sm"> {t("FormConfirmationMessage")}</Text>
                                                                                                    ),
                                                                                                    labels: { confirm: 'Confirm', cancel: 'Cancel' },
                                                                                                    confirmProps: { color: 'red.6' },
                                                                                                    onCancel: () => console.log('Cancel'),
                                                                                                    onConfirm: () => {
                                                                                                        dispatch(deleteEntityData('inventory/product/' + data.id))
                                                                                                        dispatch(setFetching(true))
                                                                                                    },
                                                                                                });
                                                                                            }}
                                                                                            rightSection={<IconTrashX style={{ width: rem(14), height: rem(14) }} />}
                                                                                        >
                                                                                            {t('Delete')}
                                                                                        </Menu.Item>
                                                                                    </Menu.Dropdown>
                                                                                </Menu>
                                                                            </Group>
                                                                        ),
                                                                    },
                                                                ]
                                                                }
                                                                // fetching={fetching}
                                                                // totalRecords={indexData.total}
                                                                // recordsPerPage={perPage}
                                                                // page={page}
                                                                // onPageChange={(p) => {
                                                                //     setPage(p)
                                                                //     dispatch(setFetching(true))
                                                                // }}
                                                                loaderSize="xs"
                                                                loaderColor="grape"
                                                                height={tableHeight}
                                                                scrollAreaProps={{ type: 'never' }}
                                                            />
                                                        </Box>
                                                    </Box>

                                                </ScrollArea>
                                                <Box pl={`xs`} pb={'6'} pr={8} pt={'6'} className={'boxBackground borderRadiusAll border-left-none border-right-none border-bottom-none'} >
                                                    <Group justify="flex-end">
                                                        <Stack right align="flex-end">
                                                            <>
                                                                {
                                                                    !saveCreateLoading && isOnline &&
                                                                    <Button
                                                                        size="xs"
                                                                        color={`green.8`}
                                                                        // type="submit"
                                                                        // id="EntityFormSubmit"
                                                                        leftSection={<IconDeviceFloppy size={16} />}
                                                                    >
                                                                        <Flex direction={`column`} gap={0}>
                                                                            <Text fz={14} fw={400}>
                                                                                {t("Preview")}
                                                                            </Text>
                                                                        </Flex>
                                                                    </Button>
                                                                }
                                                            </></Stack>
                                                        <Stack right align="flex-end">
                                                            <>
                                                                {
                                                                    !saveCreateLoading && isOnline &&
                                                                    <Button
                                                                        size="xs"
                                                                        color={`green.8`}
                                                                        type="submit"
                                                                        id="EntityFormSubmit"
                                                                        leftSection={<IconDeviceFloppy size={16} />}
                                                                    >
                                                                        <Flex direction={`column`} gap={0}>
                                                                            <Text fz={14} fw={400}>
                                                                                {t("UpdateAndSave")}
                                                                            </Text>
                                                                        </Flex>
                                                                    </Button>
                                                                }
                                                            </></Stack>
                                                    </Group>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Grid.Col>
                                }
                            </Grid>
                        </Stack>
                    </Grid.Col>
                </Grid>
            </form>
        </Box >
    )
}

export default ProductUpdateForm;
