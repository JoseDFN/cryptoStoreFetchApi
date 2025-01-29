const URL_API = "http://localhost:3000";
const myHeaders = new Headers({
    "Content-Type": "application/json"
});
const getProduct = async () => {
    try {
        const response = await fetch(`${URL_API}/products`);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: No se pudieron obtener los productos`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error al obtener productos:', error);
        return []; // Devolver un array vacío en caso de error
    }
};
const postProduct = async (datos) => {
    try {
        return await fetch(`${URL_API}/contacts`, {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(datos)
        });
    } catch (error) {
        console.error('Error en la solicitud POST:', error.message);
    }
}
const patchProduct = async (datos,id) =>{

    try {
        return await fetch(`${URL_API}/contacts/${id}`, {
            method: "PATCH",
            headers: myHeaders,
            body: JSON.stringify(datos)
        });
    } catch (error) {
        console.error('Error en la solicitud POST:', error.message);
    }

}
const deleteProduct = async (id) =>{

    try {
        return await fetch(`${URL_API}/contacts/${id}`, {
            method: "DELETE",
            headers: myHeaders,
        });
    } catch (error) {
        console.error('Error en la solicitud POST:', error.message);
    }

}
export {
    getProduct as getProducts,
    postProduct as postProducts,
    patchProduct as patchProducts,
    deleteProduct as deleteProducts
};