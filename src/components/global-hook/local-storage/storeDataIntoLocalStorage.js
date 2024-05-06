import axios from "axios";

const storeDataIntoLocalStorage = async (user_id) => {
    const apiBackendRoutes = [
        'inventory/stock-item',
        'core/customer/local-storage',
        'core/vendor/local-storage'
    ];
    const localStorageKeys = [
        'user-products',
        'core-customers',
        'core-vendors'
    ];

    for (let i = 0; i < apiBackendRoutes.length; i++) {
        try {
            const response = await axios({
                method: 'get',
                url: `${import.meta.env.VITE_API_GATEWAY_URL + apiBackendRoutes[i]}`,
                headers: {
                    "Accept": `application/json`,
                    "Content-Type": `application/json`,
                    "Access-Control-Allow-Origin": '*',
                    "X-Api-Key": import.meta.env.VITE_API_KEY,
                    "X-Api-User": user_id
                }
            })
            if (response.data.data) {
                localStorage.setItem(localStorageKeys[i], JSON.stringify(response.data.data));
            }
        } catch (error) {
            console.log(error);
        }
    }
};

export default storeDataIntoLocalStorage;