import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {getShowEntityData} from "../../../store/inventory/crudSlice.js";
const getConfigData = () => {
    const dispatch = useDispatch();
    const configData = useSelector((state) => state.inventoryCrudSlice.showEntityData)
    useEffect(() => {
        dispatch(getShowEntityData('inventory/config'))
    }, [dispatch]);

    return configData;
};

export default getConfigData;



