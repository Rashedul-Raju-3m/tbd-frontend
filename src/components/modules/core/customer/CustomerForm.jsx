import React, {useEffect, useState} from "react";
import {
    Button,
    Grid,
    Box, TextInput
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {IconPlus} from "@tabler/icons-react";
import {useDisclosure, useHotkeys} from "@mantine/hooks";
import CustomerGroupModel from "./CustomerGroupModal";
import {useDispatch, useSelector} from "react-redux";

import InputForm from "../../../form-builders/InputForm";
import SelectForm from "../../../form-builders/SelectForm";
import TextAreaForm from "../../../form-builders/TextAreaForm";
import SwitchForm from "../../../form-builders/SwitchForm";
import {
    getExecutiveDropdown,
    getLocationDropdown,

} from "../../../../store/core/utilitySlice";

function CustomerForm(props) {
    const {form} = props
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    // const [searchValue, setSearchValue] = useState('');
    const [opened, {open, close}] = useDisclosure(false);

    const locationDropdownData = useSelector((state) => state.utilitySlice.locationDropdownData)
    const executiveDropdownData = useSelector((state) => state.utilitySlice.executiveDropdownData)
    const entityEditData = useSelector((state) => state.crudSlice.editEntityData)
    const formLoading = useSelector((state) => state.crudSlice.formLoading)


    let locationDropdown = locationDropdownData && locationDropdownData.length > 0 ? locationDropdownData.map((type, index) => {
        return ({'label': type.name, 'value': String(type.id)})
    }) : []
    let executiveDropdown = executiveDropdownData && executiveDropdownData.length > 0 ? executiveDropdownData.map((type, index) => {
        return ({'label': type.name, 'value': String(type.id)})
    }) : []
    useEffect(() => {

        const valueForLocation = {
            url: 'core/select/location',
            param: {
                term: ''
            }
        }
        const valueForExecutive = {
            url: 'core/select/executive',
            param: {
                term: ''
            }
        }
        dispatch(getLocationDropdown(valueForLocation))
        dispatch(getExecutiveDropdown(valueForExecutive))
    }, []);

   /* const userDropdownData = useSelector((state) => state.customerSlice.userDropdownData)
    useEffect(() => {
        if (searchValue.length > 1) {
            const param = {
                "value": searchValue
            }
            const apiData = {
                'url': 'users/keyword/search',
                'param': param
            }
            dispatch(getUserDropdown(apiData))

        }
    }, [searchValue]);
    let testDropdown = userDropdownData && userDropdownData.length > 0 ? userDropdownData.map((type, index) => {
        return ({'label': type.full_name, 'value': String(type.id)})
    }) : []*/


    useHotkeys([['shift+n', () => {
        document.getElementById('CustomerName').focus()
    }]], []);

    return (
        <Box p={`md`}>

            <InputForm
                tooltip={t('NameValidateMessage')}
                label={t('Name')}
                placeholder={t('CustomerName')}
                required={true}
                nextField={'CustomerGroup'}
                name={'name'}
                form={form}
                mt={0}
                id={'CustomerName'}
                value={"test"}
            />

            <Grid gutter={{base: 6}}>
                <Grid.Col span={10}>
                    <SelectForm
                        tooltip={t('CustomerGroup')}
                        label={t('CustomerGroup')}
                        placeholder={t('ChooseCustomerGroup')}
                        required={false}
                        nextField={'CreditLimit'}
                        name={'customer_group'}
                        form={form}
                        dropdownValue={["Family", "Local"]}
                        mt={8}
                        id={'CustomerGroup'}
                        searchable={false}
                        value={props.customerGroup && !formLoading ? props.customerGroup : String(entityEditData.customer_group)}
                        changeValue={props.setCustomerGroup}
                    />
                    {/*<SelectServerSideForm
                        tooltip={t('CustomerGroup')}
                        label={t('CustomerGroup')}
                        placeholder={t('ChooseCustomerGroup')}
                        required = {false}
                        nextField = {'CreditLimit'}
                        name = {'customer_group'}
                        form = {form}
                        mt={8}
                        id = {'CustomerGroup'}
                        searchable={true}
                        searchValue={searchValue}
                        setSearchValue={setSearchValue}
                        dropdownValue={testDropdown}
                    />*/}
                </Grid.Col>
                <Grid.Col span={2}><Button mt={32} color={'gray'} variant={'outline'} onClick={open}><IconPlus size={16} opacity={0.5}/></Button></Grid.Col>
                {opened &&
                    <CustomerGroupModel openedModel={opened} open={open} close={close}/>
                }
            </Grid>

            <InputForm
                tooltip={t('CreditLimit')}
                label={t('CreditLimit')}
                placeholder={t('CreditLimit')}
                required={false}
                nextField={'OLDReferenceNo'}
                name={'credit_limit'}
                form={form}
                mt={8}
                id={'CreditLimit'}
            />

            <InputForm
                tooltip={t('OLDReferenceNo')}
                label={t('OLDReferenceNo')}
                placeholder={t('OLDReferenceNo')}
                required={false}
                nextField={'Mobile'}
                name={'reference_id'}
                form={form}
                mt={8}
                id={'OLDReferenceNo'}
            />

            <InputForm
                tooltip={t('MobileValidateMessage')}
                label={t('Mobile')}
                placeholder={t('Mobile')}
                required={true}
                nextField={'AlternativeMobile'}
                name={'mobile'}
                form={form}
                mt={8}
                id={'Mobile'}
            />

            <InputForm
                tooltip={t('AlternativeMobile')}
                label={t('AlternativeMobile')}
                placeholder={t('AlternativeMobile')}
                required={false}
                nextField={'Email'}
                name={'alternative_mobile'}
                form={form}
                mt={8}
                id={'AlternativeMobile'}
            />

            <InputForm
                tooltip={t('InvalidEmail')}
                label={t('Email')}
                placeholder={t('Email')}
                required={false}
                nextField={'Location'}
                name={'email'}
                form={form}
                mt={8}
                id={'Email'}
            />

            <SelectForm
                tooltip={t('Location')}
                label={t('Location')}
                placeholder={t('ChooseLocation')}
                required={false}
                nextField={'MarketingExecutive'}
                name={'location_id'}
                form={form}
                dropdownValue={locationDropdown}
                mt={8}
                id={'Location'}
                searchable={true}
                value={props.location && !formLoading ? props.location : String(entityEditData.location_id)}
                changeValue={props.setLocation}
            />


            <SelectForm
                tooltip={t('MarketingExecutive')}
                label={t('MarketingExecutive')}
                placeholder={t('ChooseMarketingExecutive')}
                required={false}
                nextField={'Address'}
                name={'marketing_id'}
                form={form}
                dropdownValue={executiveDropdown}
                mt={8}
                id={'MarketingExecutive'}
                searchable={true}
                value={props.marketing && !formLoading ? props.marketing : String(entityEditData.marketing_id)}
                changeValue={props.setMarketing}
            />


            <TextAreaForm
                tooltip={t('Address')}
                label={t('Address')}
                placeholder={t('Address')}
                required={false}
                nextField={'Status'}
                name={'address'}
                form={form}
                mt={8}
                id={'Address'}
            />

            <SwitchForm
                tooltip={t('Status')}
                label={t('Status')}
                nextField={'Address'}
                name={'status'}
                form={form}
                mt={12}
                id={'Status'}
                position={'left'}
                // defaultChecked={!!(formLoading && entityEditData.status === 1)}
                defaultChecked={1}
            />
        </Box>
    );
}

export default CustomerForm;