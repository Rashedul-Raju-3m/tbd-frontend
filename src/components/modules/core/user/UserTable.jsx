import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {
    Group,
    Box,
     ActionIcon, Text
} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {
    IconEye,
    IconEdit,
    IconTrash,
} from "@tabler/icons-react";
import {DataTable} from 'mantine-datatable';
import {useDispatch, useSelector} from "react-redux";
import {
    deleteEntityData, editEntityData,
    getIndexEntityData,
    setFetching,
    setFormLoading,
    setInsertType
} from "../../../../store/core/crudSlice.js";
import {modals} from "@mantine/modals";
import KeywordSearch from "../../filter/KeywordSearch.jsx";
import {useDisclosure} from "@mantine/hooks";
import UserViewModel from "./UserViewModel.jsx";

function UserTable() {
    const dispatch = useDispatch();
    const {t, i18n} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 65; //TabList height 104
    const [userViewModel, setUserViewModel] = useState(false)

    const fetching = useSelector((state) => state.crudSlice.fetching)
    const searchKeyword = useSelector((state) => state.crudSlice.searchKeyword)
    const indexData = useSelector((state) => state.crudSlice.indexEntityData)

    const perPage = 50;
    const [page,setPage] = useState(1);

    useEffect(() => {
        const value = {
            url: 'user',
            param: {
                term: searchKeyword,
                page: page,
                offset : perPage
            }
        }
        dispatch(getIndexEntityData(value))
    }, [fetching]);

    return (
        <>
            <Box p={8}>
                <div radius="xl">
                    <Box bg={`white`}  >
                        <Box pt={'xs'} pb={`xs`} pl={`md`} pr={8} >
                            <KeywordSearch />
                        </Box>
                    </Box>
                    <Box bg={`white`}>
                            <Box pb={`xs`} pl={`md`} pr={'md'} >

                        <DataTable
                            withTableBorder
                            records={indexData.data}
                            columns={[
                                {
                                    accessor: 'index',
                                    title: 'S/N',
                                    textAlignment: 'right',
                                    render: (item) => (indexData.data.indexOf(item) + 1)
                                },
                                { accessor: 'name',  title: "Name" },
                                { accessor: 'username',  title: "User Name" },
                                { accessor: 'email',  title: "Email" },
                                { accessor: 'mobile',  title: "Mobile" },
                                {
                                    accessor: "action",
                                    title: "Action",
                                    textAlign: "right",
                                    render: (data) => (
                                        <Group gap={4} justify="right" wrap="nowrap">
                                            <ActionIcon
                                                size="sm"
                                                variant="subtle"
                                                color="green"
                                                onClick={()=>{
                                                    setUserViewModel(true)
                                                    dispatch(editEntityData('user/' + data.id))
                                                }}
                                            >
                                                <IconEye size={16}/>
                                            </ActionIcon>
                                            <ActionIcon
                                                size="sm"
                                                variant="subtle"
                                                color="blue"
                                                onClick={() => {
                                                    dispatch(setInsertType('update'))
                                                    dispatch(editEntityData('user/' + data.id))
                                                    dispatch(setFormLoading(true))
                                                }}
                                            >
                                                <IconEdit size={16}/>
                                            </ActionIcon>
                                            <ActionIcon
                                                size="sm"
                                                variant="subtle"
                                                color="red"
                                                onClick={() => {
                                                    modals.openConfirmModal({
                                                        title: (
                                                            <Text size="md"> {t("FormConfirmationTitle")}</Text>
                                                        ),
                                                        children: (
                                                            <Text size="sm"> {t("FormConfirmationMessage")}</Text>
                                                        ),
                                                        labels: {confirm: 'Confirm', cancel: 'Cancel'},
                                                        onCancel: () => console.log('Cancel'),
                                                        onConfirm: () => {
                                                            dispatch(deleteEntityData('user/' + data.id))
                                                            dispatch(setFetching(true))
                                                        },
                                                    });
                                                }}
                                            >
                                                <IconTrash size={16}/>
                                            </ActionIcon>
                                        </Group>
                                    ),
                                },

                            ]
                            }
                            fetching={fetching}
                            totalRecords={indexData.total}
                            recordsPerPage={perPage}
                            page={page}
                            onPageChange={(p) => {
                                setPage(p)
                                dispatch(setFetching(true))
                            }}
                            loaderSize="xs"
                            loaderColor="grape"
                            height={height}
                            scrollAreaProps={{ type: 'never' }}
                        />

                            </Box>

                    </Box>
                </div>
            </Box>
            {
                userViewModel && <UserViewModel  userViewModel={userViewModel} setUserViewModel={setUserViewModel}/>
            }

        </>
    );
}

export default UserTable;