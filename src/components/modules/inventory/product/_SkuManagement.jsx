import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {
    Button,
    rem,
    Grid,
    Box,
    ScrollArea,
    Text,
    Title,
    Flex,
    Stack,
    LoadingOverlay,
    TextInput, Table,
} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {
  IconCheck,
  IconDeviceFloppy,
} from "@tabler/icons-react";
import {useDispatch, useSelector} from "react-redux";
import {isNotEmpty, useForm} from "@mantine/form";
import {notifications} from "@mantine/notifications";

import {
    setFormLoading,
} from "../../../../store/core/crudSlice.js";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import {
getProductSkuItemIndexEntityData, inlineUpdateEntityData, storeEntityData,
} from "../../../../store/inventory/crudSlice.js";
import {modals} from "@mantine/modals";
import getSettingParticularDropdownData from "../../../global-hook/dropdown/getSettingParticularDropdownData.js";

function _SkuManagement(props) {
    const {id, isBrand, isColor, isGrade, isSize, isMultiPrice} = props;
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight / 2; //TabList height 104

    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const [setFormData, setFormDataForUpdate] = useState(false);
    const [formLoad, setFormLoad] = useState(true);

    const entityEditData = useSelector((state) => state.crudSlice.entityEditData);
    const formLoading = useSelector((state) => state.crudSlice.formLoading);

    const form = useForm({
        initialValues: {
            product_id: "",
            color_id: "",
            brand_id: "",
            size_id: "",
            grade_id: "",
        },
        validate: {
          color_id: isColor ? isNotEmpty() : undefined,
          brand_id: isBrand ? isNotEmpty() : undefined,
          size_id: isSize ? isNotEmpty() : undefined,
          grade_id: isGrade ? isNotEmpty() : undefined,
        },
    });

    useEffect(() => {
        setFormLoad(true);
        setFormDataForUpdate(true);
    }, [dispatch, formLoading]);

    useEffect(() => {
        form.setValues({});

        dispatch(setFormLoading(false));
        setTimeout(() => {
            setFormLoad(false);
            setFormDataForUpdate(false);
        }, 500);
    }, [entityEditData, dispatch, setFormData]);

    const productSkuIndexEntityData = useSelector((state) => state.inventoryCrudSlice.productSkuIndexEntityData);
  const [reloadSkuItemData, setReloadSkuItemData] = useState(false);

    useEffect(() => {
        const value = {
            url: 'inventory/product/stock/sku/' + id,
            param: {
                term: null,
            }
        }
        dispatch(getProductSkuItemIndexEntityData(value))
        setReloadSkuItemData(false)
    }, [reloadSkuItemData]);

    const [brandData, setBrandData] = useState(null);
    const [colorData, setColorData] = useState(null);
    const [sizeData, setSizeData] = useState(null);
    const [gradeData, setGradeData] = useState(null);

    const [priceData, setPriceData] = useState([]);
    const [multiplePriceFieldName, setMultiplePriceFieldName] = useState([]);

    useEffect(() => {
        if (productSkuIndexEntityData?.data) {
            setPriceData(productSkuIndexEntityData.data.map((sku) => sku?.price || ''));
            isMultiPrice && setMultiplePriceFieldName(productSkuIndexEntityData?.data[0]?.price_field_array);
        }
    }, [productSkuIndexEntityData]);

    const [wholesalePriceData, setWholesalePriceData] = useState([]);
    useEffect(() => {
        if (productSkuIndexEntityData?.data?.length > 0) {
            const initialPriceData = productSkuIndexEntityData.data.map((sku) => {
                return sku.price_field.map((field) => ({
                    id: field.id,
                    slug: field.price_field_slug,
                    price: field.price !== null ? field.price : ''
                }));
            });
            setWholesalePriceData(initialPriceData);
        }
    }, [productSkuIndexEntityData]);

    const handleSkuData = (value, stockId, priceFieldSlug, skuIndex, fieldIndex,settingId) => {
        if (priceFieldSlug != 'price') {
            const updatedPriceData = [...wholesalePriceData];
            updatedPriceData[skuIndex][fieldIndex].price = value;
            setWholesalePriceData(updatedPriceData);

            const updateData = {
                url: 'inventory/product/stock/sku/inline-update/' + stockId,
                data: {
                    value: value,
                    field: priceFieldSlug,
                    setting_id: settingId,
                }
            }
            setTimeout(() => {
                dispatch(inlineUpdateEntityData(updateData))
            }, 500)
        }

        if (priceFieldSlug === 'price') {
            const newPriceData = [...priceData];
            newPriceData[skuIndex] = value;
            setPriceData(newPriceData);
            const updateData = {
                url: 'inventory/product/stock/sku/inline-update/' + stockId,
                data: {
                    value: value,
                    field: priceFieldSlug,
                }
            }
            setTimeout(() => {
                dispatch(inlineUpdateEntityData(updateData))
            }, 500)
        }
    };

    return (
        <Box>
            <Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
                <Box
                    pl={`xs`}
                    pb={"6"}
                    pr={8}
                    pt={"6"}
                    mb={"4"}
                    className={"boxBackground borderRadiusAll"}
                >
                    <Grid>
                        <Grid.Col span={6}>
                            <Title order={6} pt={"6"}>
                                {t("SKUItem")}
                            </Title>
                        </Grid.Col>
                        <Grid.Col span={6}></Grid.Col>
                    </Grid>
                </Box>
                <Box className={"borderRadiusAll"}>
                    <ScrollArea scrollbars="y" type="never">
                        <Box>
                            <LoadingOverlay
                                visible={formLoad}
                                zIndex={1000}
                                overlayProps={{radius: "sm", blur: 2}}
                            />
                        </Box>
                        <Box>
                            <form
                                onSubmit={form.onSubmit((values) => {
                                    form.values.product_id = id;

                                  const existingProductItem = productSkuIndexEntityData.data.find(item =>
                                      Number(item.color_id) === Number(values.color_id) &&
                                      Number(item.brand_id) === Number(values.brand_id) &&
                                      Number(item.size_id) === Number(values.size_id) &&
                                      Number(item.grade_id) === Number(values.grade_id)
                                  );

                                  if (existingProductItem){
                                    notifications.show({
                                      loading: true,
                                      color: "red",
                                      title: "Already exists",
                                      message:
                                          "Data will be loaded in 3 seconds, you cannot close this yet",
                                      autoClose: 1000,
                                      withCloseButton: true,
                                    });
                                    return;
                                  }
                                    modals.openConfirmModal({
                                      title: <Text size="md"> {t("FormConfirmationTitle")}</Text>,
                                      children: (
                                          <Text size="sm"> {t("FormConfirmationMessage")}</Text>
                                      ),
                                      labels: {confirm: t("Submit"), cancel: t("Cancel")},
                                      confirmProps: {color: "red"},
                                      onCancel: () => console.log("Cancel"),
                                      onConfirm: () => {
                                        const value = {
                                          url: "inventory/product/stock/sku",
                                          data: values,
                                        };
                                        dispatch(storeEntityData(value));

                                        notifications.show({
                                          color: "teal",
                                          title: t("UpdateSuccessfully"),
                                          icon: <IconCheck style={{width: rem(18), height: rem(18)}}/>,
                                          loading: false,
                                          autoClose: 700,
                                          style: {backgroundColor: "lightgray"},
                                        });

                                        setTimeout(() => {
                                          form.reset();
                                          setColorData(null)
                                          setBrandData(null)
                                          setSizeData(null)
                                          setGradeData(null)
                                          setReloadSkuItemData(true);
                                          setSaveCreateLoading(true);
                                        }, 500);
                                      },
                                    });

                                })}
                            >
                                <>
                                    <Box
                                        pl={4}
                                        pr={4}
                                        pt={"4"}
                                        pb={2}
                                        className={"boxBackground  border-bottom-none"}
                                    >
                                        <Grid columns={11}>
                                            <Grid.Col span={10}>
                                                <Grid gutter={{base: 2}}>
                                                    {isColor && (
                                                        <Grid.Col span={"auto"}>
                                                            <SelectForm
                                                                tooltip={t("ChooseColor")}
                                                                placeholder={t("ChooseColor")}
                                                                name={"color_id"}
                                                                form={form}
                                                                dropdownValue={getSettingParticularDropdownData('color')}
                                                                mt={0}
                                                                id={"color_id"}
                                                                nextField={"size_id"}
                                                                searchable={true}
                                                                value={colorData}
                                                                changeValue={setColorData}
                                                            />
                                                        </Grid.Col>
                                                    )}
                                                    {isSize && (
                                                        <Grid.Col span={"auto"}>
                                                            <SelectForm
                                                                tooltip={t("ChooseSize")}
                                                                placeholder={t("ChooseSize")}
                                                                name={"size_id"}
                                                                form={form}
                                                                dropdownValue={getSettingParticularDropdownData('size')}
                                                                mt={0}
                                                                id={"size_id"}
                                                                nextField={"brand_id"}
                                                                searchable={true}
                                                                value={sizeData}
                                                                changeValue={setSizeData}
                                                            />
                                                        </Grid.Col>
                                                    )}
                                                    {isBrand && (
                                                        <Grid.Col span={"auto"}>
                                                            <SelectForm
                                                                tooltip={t("ChooseBrand")}
                                                                placeholder={t("ChooseBrand")}
                                                                name={"brand_id"}
                                                                form={form}
                                                                dropdownValue={getSettingParticularDropdownData('brand')}
                                                                mt={0}
                                                                id={"brand_id"}
                                                                nextField={"grade_id"}
                                                                searchable={true}
                                                                value={brandData}
                                                                changeValue={setBrandData}
                                                            />
                                                        </Grid.Col>
                                                    )}
                                                    {isGrade && (
                                                        <Grid.Col span={"auto"}>
                                                            <SelectForm
                                                                tooltip={t("ChooseProductGrade")}
                                                                placeholder={t("ChooseProductGrade")}
                                                                name={"grade_id"}
                                                                form={form}
                                                                dropdownValue={getSettingParticularDropdownData('product-grade')}
                                                                mt={0}
                                                                id={"grade_id"}
                                                                nextField={"EntityFormSubmitSkuItem"}
                                                                searchable={true}
                                                                value={gradeData}
                                                                changeValue={setGradeData}
                                                            />
                                                        </Grid.Col>
                                                    )}
                                                </Grid>
                                            </Grid.Col>
                                            <Grid.Col span={1}>
                                                <Stack right align="flex-end" pt={"3"}>
                                                    <>
                                                        {isOnline && (
                                                            <Button
                                                                size="xs"
                                                                color={`green.8`}
                                                                type="submit"
                                                                id="EntityFormSubmitSkuItem"
                                                                leftSection={<IconDeviceFloppy size={16}/>}
                                                            >
                                                                <Flex direction={`column`} gap={0}>
                                                                    <Text fz={14} fw={400}>
                                                                        {t("Add")}
                                                                    </Text>
                                                                </Flex>
                                                            </Button>
                                                        )}
                                                    </>
                                                </Stack>
                                            </Grid.Col>
                                        </Grid>
                                    </Box>
                                </>
                            </form>

                            <Box pl={`xs`} pr={"xs"} className={"borderRadiusAll"}>
                                <ScrollArea
                                    h={height - 105}
                                    scrollbarSize={2}
                                    scrollbars="y"
                                    type="never"
                                >
                                    <Box>
                                        <Table stickyHeader>
                                            <Table.Thead>
                                                <Table.Tr>
                                                    <Table.Th fz="xs">
                                                        {t("S/N")}
                                                    </Table.Th>
                                                    <Table.Th fz="xs">
                                                        {t("Name")}
                                                    </Table.Th>

                                                    {
                                                        isColor &&
                                                        <Table.Th fz="xs" ta="center">
                                                            {t("Color")}
                                                        </Table.Th>
                                                    }

                                                    {
                                                        isSize &&
                                                        <Table.Th fz="xs" ta="center">
                                                            {t("Size")}
                                                        </Table.Th>
                                                    }

                                                    {
                                                        isBrand &&
                                                        <Table.Th fz="xs" ta="center">
                                                            {t("Brand")}
                                                        </Table.Th>
                                                    }

                                                    {
                                                        isGrade &&
                                                        <Table.Th fz="xs" ta="center">
                                                            {t("Grade")}
                                                        </Table.Th>
                                                    }

                                                    <Table.Th fz="xs" ta="center">
                                                        {t("Price")}
                                                    </Table.Th>
                                                    {
                                                        isMultiPrice && multiplePriceFieldName?.length > 0 &&
                                                        multiplePriceFieldName.map((priceFieldName, index) => (
                                                            <Table.Th fz="xs" ta="center" key={index}>
                                                                {priceFieldName}
                                                            </Table.Th>
                                                        ))
                                                    }
                                                </Table.Tr>
                                            </Table.Thead>
                                            <Table.Tbody>
                                                {productSkuIndexEntityData?.data?.length > 0 ? (
                                                    productSkuIndexEntityData.data.map((sku, index) => {
                                                        return (
                                                            <Table.Tr key={sku.id}>
                                                                <Table.Th fz="xs">
                                                                    {index + 1}
                                                                </Table.Th>
                                                                <Table.Th fz="xs">
                                                                    {sku.name}
                                                                </Table.Th>
                                                                {
                                                                    isColor &&
                                                                    <Table.Th fz="xs" ta="center">
                                                                        {sku.color_name}
                                                                    </Table.Th>
                                                                }
                                                                {
                                                                    isSize &&
                                                                    <Table.Th fz="xs" ta="center">
                                                                        {sku.size_name}
                                                                    </Table.Th>
                                                                }
                                                                {
                                                                    isBrand &&
                                                                    <Table.Th fz="xs" ta="center">
                                                                        {sku.brand_name}
                                                                    </Table.Th>
                                                                }
                                                                {
                                                                    isGrade &&
                                                                    <Table.Th fz="xs" ta="center">
                                                                        {sku.grade_name}
                                                                    </Table.Th>
                                                                }

                                                                <Table.Th fz="xs" ta="center">
                                                                    <TextInput
                                                                        type="number"
                                                                        label=""
                                                                        size="xs"
                                                                        id={'inline-update-price-' + sku.stock_id}
                                                                        value={priceData[index]}
                                                                        onChange={(e) => {
                                                                            handleSkuData(e.target.value, sku.stock_id, 'price', index, null, null)
                                                                        }}
                                                                    />
                                                                </Table.Th>

                                                                {sku.price_field?.map((field, fieldIndex) => (
                                                                    <Table.Th fz="xs" ta="center" key={field.id}>
                                                                        <TextInput
                                                                            type="number"
                                                                            label=""
                                                                            size="xs"
                                                                            id={`inline-update-${field.price_field_slug}-${sku.stock_id}`}
                                                                            value={wholesalePriceData[index]?.[fieldIndex]?.price || ''}
                                                                            onChange={(e) =>
                                                                                handleSkuData(e.target.value, sku.stock_id, field.price_field_slug, index, fieldIndex,field.id)
                                                                            }
                                                                        />
                                                                    </Table.Th>
                                                                ))}
                                                            </Table.Tr>
                                                        )
                                                    })
                                                ) : (
                                                    <Table.Tr>
                                                        <Table.Th colSpan="4" fz="xs" ta="center">
                                                            No data available
                                                        </Table.Th>
                                                    </Table.Tr>
                                                )}
                                            </Table.Tbody>
                                        </Table>
                                    </Box>
                                </ScrollArea>
                            </Box>
                        </Box>
                    </ScrollArea>
                </Box>
            </Box>
        </Box>
    );
}

export default _SkuManagement;
