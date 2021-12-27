import gotQL from "gotql";
import config from "@/config";

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
    .query(config.env.HASURA_URL, query, options)
    .then((response) => console.log(response.data))
    .catch(console.error);
