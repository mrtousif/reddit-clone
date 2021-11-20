import gotQL from "gotql";

const query = {
    operation: {
        name: "users",
        fields: ["name", "age", "id"],
    },
};

const options = {
    headers: {
        Authorization: "Bearer <token>",
    },
    debug: false,
    useHttp2: false,
};

gotQL
    .query("mygraphqlendpoint.com.br/api", query, options)
    .then((response) => console.log(response.data))
    .catch(console.error);
