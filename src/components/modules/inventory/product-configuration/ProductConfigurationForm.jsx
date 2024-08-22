import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Button, rem, Flex, Grid, Box, ScrollArea, Text, Title, Stack } from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { IconCheck, IconDeviceFloppy } from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import Shortcut from "../../shortcut/Shortcut";
import { setValidationData, updateEntityData } from "../../../../store/inventory/crudSlice.js";
import SwitchForm from "../../../form-builders/SwitchForm.jsx";
import getProductConfigData from "../../../global-hook/config-data/getProductConfigData.js";

function ProductConfigurationForm() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 100; //TabList height 104
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);

    const validationMessage = useSelector((state) => state.inventoryCrudSlice.validationMessage)
    const validation = useSelector((state) => state.inventoryCrudSlice.validation)

    const [formLoad, setFormLoad] = useState(true);
    const [setFormData, setFormDataForUpdate] = useState(false);



    localStorage.setItem('product-configuration', JSON.stringify(getProductConfigData()));

    const productConfigData = localStorage.getItem('product-configuration') ? JSON.parse(localStorage.getItem('product-configuration')) : []

    const form = useForm({
        initialValues: {
            brand: productConfigData.brand ? productConfigData.brand : '',
            color: productConfigData.color ? productConfigData.color : '',
            size: productConfigData.size ? productConfigData.size : '',
            model: productConfigData.model ? productConfigData.model : '',
            measurement: productConfigData.measurement ? productConfigData.measurement : '',
            product_image: productConfigData.product_image ? productConfigData.product_image : '',
            product_gallery: productConfigData.product_gallery ? productConfigData.product_gallery : '',
            is_multi_price: productConfigData.is_multi_price ? productConfigData.is_multi_price : '',
            zero_stock: productConfigData.zero_stock ? productConfigData.zero_stock : '',
            stock_item: productConfigData.stock_item ? productConfigData.stock_item : '',
            is_stock_history: productConfigData.is_stock_history ? productConfigData.is_stock_history : '',
            mrp_price: productConfigData.mrp_price ? productConfigData.mrp_price : '',
            total_price: productConfigData.total_price ? productConfigData.total_price : '',
            purchase_price: productConfigData.purchase_price ? productConfigData.purchase_price : '',

        },
        validate: {
            // brand: isNotEmpty(),
            // color: isNotEmpty(),
            // size: isNotEmpty(),
        }
    });


    useEffect(() => {
        if (validationMessage.message === 'success') {
            notifications.show({
                color: 'teal',
                title: t('UpdateSuccessfully'),
                icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                loading: false,
                autoClose: 700,
                style: { backgroundColor: 'lightgray' },
            });

            setTimeout(() => {
                setSaveCreateLoading(false)
            }, 700)
        }
    }, [validation, validationMessage]);

    useEffect(() => {
        setFormLoad(true)
        setFormDataForUpdate(true)
    }, [dispatch])


    useHotkeys([['alt+n', () => {
        document.getElementById('brand').click()
    }]], []);

    useHotkeys([['alt+r', () => {
        form.reset()
    }]], []);

    useHotkeys([['alt+s', () => {
        document.getElementById('EntityFormSubmit').click()
    }]], []);


    return (
        <Box>
            <form onSubmit={form.onSubmit((values) => {
                form.values['brand'] = (values.brand === true || values.brand == 1) ? 1 : 0
                form.values['color'] = (values.color === true || values.color == 1) ? 1 : 0
                form.values['size'] = (values.size === true || values.size == 1) ? 1 : 0
                form.values['model'] = (values.model === true || values.model == 1) ? 1 : 0
                form.values['measurement'] = (values.measurement === true || values.measurement == 1) ? 1 : 0
                form.values['product_image'] = (values.product_image === true || values.product_image == 1) ? 1 : 0
                form.values['product_gallery'] = (values.product_gallery === true || values.product_gallery == 1) ? 1 : 0
                form.values['is_multi_price'] = (values.is_multi_price === true || values.is_multi_price == 1) ? 1 : 0
                form.values['zero_stock'] = (values.zero_stock === true || values.zero_stock == 1) ? 1 : 0
                form.values['stock_item'] = (values.stock_item === true || values.stock_item == 1) ? 1 : 0
                form.values['is_stock_history'] = (values.is_stock_history === true || values.is_stock_history == 1) ? 1 : 0
                form.values['mrp_price'] = (values.mrp_price === true || values.mrp_price == 1) ? 1 : 0
                form.values['total_price'] = (values.total_price === true || values.total_price == 1) ? 1 : 0
                form.values['purchase_price'] = (values.purchase_price === true || values.purchase_price == 1) ? 1 : 0
                dispatch(setValidationData(false))
                console.log(values)
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
                //             url: 'inventory/product-configuration',
                //             data: values
                //         }
                //         dispatch(updateEntityData(value))
                //     },
                // });
            })}>
                <Grid columns={24} gutter={{ base: 8 }}>
                    <Grid.Col span={7}>
                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'}>
                            <Box bg={"white"}>
                                <Box pl={`xs`} pr={8} pt={'8'} pb={'10'} mb={'4'} className={'boxBackground borderRadiusAll'}>
                                    <Grid>
                                        <Grid.Col >
                                            <Title order={6} pt={'4'}>{t('SkuManagement')}</Title>
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                                <Box pl={`xs`} pr={'xs'} className={'borderRadiusAll'}>
                                    <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
                                        <Box pl={'xs'} pt={'xs'} >


                                            <Box mt={'xs'}>
                                                <Grid gutter={{ base: 1 }}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t('Brand')}
                                                            label=''
                                                            nextField={'color'}
                                                            name={'brand'}
                                                            form={form}
                                                            color="red"
                                                            id={'brand'}
                                                            position={'left'}
                                                            defaultChecked={productConfigData.brand}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'} pt={'1'}>{t('Brand')}</Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={'xs'}>
                                                <Grid gutter={{ base: 1 }}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t('Color')}
                                                            label=''
                                                            nextField={'size'}
                                                            name={'color'}
                                                            form={form}
                                                            color="red"
                                                            id={'color'}
                                                            position={'left'}
                                                            defaultChecked={productConfigData.color}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'} pt={'1'}>{t('Color')}</Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={'xs'}>
                                                <Grid gutter={{ base: 1 }}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t('Size')}
                                                            label=''
                                                            nextField={'model'}
                                                            name={'size'}
                                                            form={form}
                                                            color="red"
                                                            id={'size'}
                                                            position={'left'}
                                                            defaultChecked={productConfigData.size}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'} pt={'1'}>{t('Size')}</Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={'xs'}>
                                                <Grid gutter={{ base: 1 }}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t('Model')}
                                                            label=''
                                                            nextField={'measurement'}
                                                            name={'model'}
                                                            form={form}
                                                            color="red"
                                                            id={'model'}
                                                            position={'left'}
                                                            defaultChecked={productConfigData.model}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'} pt={'1'}>{t('Model')}</Grid.Col>
                                                </Grid>
                                            </Box>

                                        </Box>
                                    </ScrollArea>
                                </Box>
                            </Box>
                        </Box>
                    </Grid.Col>
                    <Grid.Col span={8}>
                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'}>
                            <Box bg={"white"}>
                                <Box pl={`xs`} pr={8} pt={'8'} pb={'10'} mb={'4'}
                                    className={'boxBackground borderRadiusAll'}>
                                    <Grid>
                                        <Grid.Col >
                                            <Title order={6} pt={'4'} >{t('Product')}</Title>
                                        </Grid.Col>

                                    </Grid>
                                </Box>
                                <Box pl={`xs`} pr={'xs'} className={'borderRadiusAll'}>
                                    <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
                                        <Box pl={'xs'} pt={'xs'}>
                                            <Box mt={'xs'}>
                                                <Grid gutter={{ base: 1 }}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t('Measurement')}
                                                            label=''
                                                            nextField={'product_image'}
                                                            name={'measurement'}
                                                            form={form}
                                                            color="red"
                                                            id={'measurement'}
                                                            position={'left'}
                                                            defaultChecked={productConfigData.measurement}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'} pt={'1'}>{t('Measurement')}</Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={'xs'}>
                                                <Grid gutter={{ base: 1 }}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t('ProductImage')}
                                                            label=''
                                                            nextField={'product_gallery'}
                                                            name={'product_image'}
                                                            form={form}
                                                            color="red"
                                                            id={'product_image'}
                                                            position={'left'}
                                                            defaultChecked={productConfigData.product_image}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'}
                                                        pt={'1'}>{t('ProductImage')}</Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={'xs'}>
                                                <Grid gutter={{ base: 1 }}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t('ProductGallery')}
                                                            label=''
                                                            nextField={'is_multi_price'}
                                                            name={'product_gallery'}
                                                            form={form}
                                                            color="red"
                                                            id={'product_gallery'}
                                                            position={'left'}
                                                            defaultChecked={productConfigData.product_gallery}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'} pt={'1'}>{t('ProductGallery')}</Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={'xs'}>
                                                <Grid gutter={{ base: 1 }}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t('ProductMultiPrice')}
                                                            label=''
                                                            nextField={'zero_stock'}
                                                            name={'is_multi_price'}
                                                            form={form}
                                                            color="red"
                                                            id={'is_multi_price'}
                                                            position={'left'}
                                                            defaultChecked={productConfigData.is_multi_price}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'} pt={'1'}>{t('ProductMultiPrice')}</Grid.Col>
                                                </Grid>
                                            </Box>

                                        </Box>

                                    </ScrollArea>
                                </Box>
                            </Box>
                        </Box>
                    </Grid.Col>
                    <Grid.Col span={8}>
                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} mb={'xs'}>
                            <Box bg={"white"}>
                                <Box pl={`xs`} pr={8} pt={'6'} pb={'6'} mb={'4'} className={'boxBackground borderRadiusAll'}>
                                    <Grid>
                                        <Grid.Col span={6}>
                                            <Title order={6} pt={'6'}>{t('Sales')}</Title>
                                        </Grid.Col>
                                        <Grid.Col span={6}>
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
                                                </>
                                            </Stack>
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                                <Box pl={`xs`} pr={'xs'} className={'borderRadiusAll'}>
                                    <ScrollArea h={height / 2 - 42} scrollbarSize={2} scrollbars="y" type="never">
                                        <Box pt={'xs'} pl={'xs'}>
                                            <Box mt={'xs'}>
                                                <Grid gutter={{ base: 1 }}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t('ZeroStockAllowed')}
                                                            label=''
                                                            nextField={'stock_item'}
                                                            name={'zero_stock'}
                                                            form={form}
                                                            color="red"
                                                            id={'zero_stock'}
                                                            position={'left'}
                                                            defaultChecked={productConfigData.zero_stock}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'}
                                                        pt={'1'}>{t('ZeroStockAllowed')}</Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={'xs'}>
                                                <Grid gutter={{ base: 1 }}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t('StockItem')}
                                                            label=''
                                                            nextField={'is_stock_history'}
                                                            name={'stock_item'}
                                                            form={form}
                                                            color="red"
                                                            id={'stock_item'}
                                                            position={'left'}
                                                            defaultChecked={productConfigData.stock_item}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'}
                                                        pt={'1'}>{t('StockItem')}</Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box mt={'xs'}>
                                                <Grid gutter={{ base: 1 }}>
                                                    <Grid.Col span={2}>
                                                        <SwitchForm
                                                            tooltip={t('StockHistory')}
                                                            label=''
                                                            nextField={'mrp_price'}
                                                            name={'is_stock_history'}
                                                            form={form}
                                                            color="red"
                                                            id={'is_stock_history'}
                                                            position={'left'}
                                                            defaultChecked={productConfigData.is_stock_history}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={6} fz={'sm'} pt={'1'}>{t('StockHistory')}</Grid.Col>
                                                </Grid>
                                            </Box>




                                        </Box>
                                    </ScrollArea>
                                </Box>
                            </Box>
                        </Box>
                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'}>
                            <Box bg={"white"}>
                                <Box pl={`xs`} pr={8} pt={'8'} pb={'10'} mb={'4'}
                                    className={'boxBackground borderRadiusAll'}>
                                    <Grid>
                                        <Grid.Col >
                                            <Title order={6} pt={'4'} >{t('Purchase')}</Title>
                                        </Grid.Col>

                                    </Grid>
                                </Box>
                                <Box pl={`xs`} pr={'xs'} className={'borderRadiusAll'}>
                                    <ScrollArea h={height / 2 - 40} scrollbarSize={2} scrollbars="y" type="never">
                                        <Box pl={'xs'} pt={'xs'}>
                                            <Box pt={'xs'} pl={'xs'}>
                                                <Box mt={'xs'}>
                                                    <Grid gutter={{ base: 1 }}>
                                                        <Grid.Col span={2}>
                                                            <SwitchForm
                                                                tooltip={t('MrpPrice')}
                                                                label=''
                                                                nextField={'total_price'}
                                                                name={'mrp_price'}
                                                                form={form}
                                                                color="red"
                                                                id={'mrp_price'}
                                                                position={'left'}
                                                                defaultChecked={productConfigData.mrp_price}
                                                            />
                                                        </Grid.Col>
                                                        <Grid.Col span={6} fz={'sm'}
                                                            pt={'1'}>
                                                            {t('MrpPrice')}
                                                        </Grid.Col>
                                                    </Grid>
                                                </Box>
                                                <Box mt={'xs'}>
                                                    <Grid gutter={{ base: 1 }}>
                                                        <Grid.Col span={2}>
                                                            <SwitchForm
                                                                tooltip={t('TotalPrice')}
                                                                label=''
                                                                nextField={'purchase_price'}
                                                                name={'total_price'}
                                                                form={form}
                                                                color="red"
                                                                id={'total_price'}
                                                                position={'left'}
                                                                defaultChecked={productConfigData.total_price}
                                                            />
                                                        </Grid.Col>
                                                        <Grid.Col span={6} fz={'sm'}
                                                            pt={'1'}>
                                                            {t('TotalPrice')}
                                                        </Grid.Col>
                                                    </Grid>
                                                </Box>
                                                <Box mt={'xs'}>
                                                    <Grid gutter={{ base: 1 }}>
                                                        <Grid.Col span={2}>
                                                            <SwitchForm
                                                                tooltip={t('PurchasePrice')}
                                                                label=''
                                                                nextField={'EntityFormSubmit'}
                                                                name={'purchase_price'}
                                                                form={form}
                                                                color="red"
                                                                id={'purchase_price'}
                                                                position={'left'}
                                                                defaultChecked={productConfigData.purchase_price}
                                                            />
                                                        </Grid.Col>
                                                        <Grid.Col span={6} fz={'sm'} pt={'1'}>
                                                            {t('PurchasePrice')}
                                                        </Grid.Col>
                                                    </Grid>
                                                </Box>
                                            </Box>
                                        </Box>

                                    </ScrollArea>
                                </Box>
                            </Box>
                        </Box>
                    </Grid.Col>
                    <Grid.Col span={1}>
                        <Box bg={'white'} className={'borderRadiusAll'} pt={'16'}>
                            <Shortcut
                                form={form}
                                FormSubmit={'EntityFormSubmit'}
                                Name={'name'}
                                inputType="select"
                            />
                        </Box>
                    </Grid.Col>
                </Grid>
            </form >
        </Box >
    );
}

export default ProductConfigurationForm;