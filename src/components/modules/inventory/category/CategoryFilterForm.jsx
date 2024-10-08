import react from "react";
import { useTranslation } from 'react-i18next';
import InputForm from "../../../form-builders-filter/InputForm.jsx";
import { useDisclosure, useFullscreen, useHotkeys } from "@mantine/hooks";

function CategoryFilterForm(props) {

    const { t, i18 } = useTranslation();

    useHotkeys([['alt+n', () => {
        document.getElementById('ParentName').focus()
    }]], []);

    return (
        <>
            <InputForm
                label={t("Name")}
                placeHolder={t("Name")}
                nextField={"parentName"}
                id={"name"}
                name={"name"}
                module={props.module}
            />
            <InputForm
                label={t("ParentName")}
                placeHolder={t("ParentName")}
                nextField={"submit"}
                id={"parent_name"}
                name={"parent_name"}
                module={props.module}
            />

        </>
    );
}
export default CategoryFilterForm;
