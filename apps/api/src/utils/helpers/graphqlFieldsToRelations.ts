import { GraphQLResolveInfo } from "graphql";
import { resolveFieldMap, resolveSelections, FieldSelections } from "@jenyus-org/graphql-utils";

export const fieldsToRelations = (
    info: GraphQLResolveInfo,
    options?: {
        depth?: number;
        root?: string;
    }
) => {
    const fieldMap = resolveFieldMap(info);
    console.log(fieldMap);
    const rootField = Object.getOwnPropertyNames(fieldMap)[0];
    const fieldSelections: FieldSelections[] = [
        {
            field: rootField,
            selections: ["*.*"],
        },
    ];
    const fields = resolveSelections(fieldSelections, info);

    const relationSelections: FieldSelections[] = [
        {
            field: rootField,
            selections: ["**.**"],
        },
    ];
    const relations = resolveSelections(relationSelections, info);
    console.log({
        relations,
        fields,
    });
    return { populate: relations, fields };
};

export const getFields = (info: GraphQLResolveInfo, field: string) => {
    const fieldMap = resolveFieldMap(info);
    console.log(Object.getOwnPropertyNames(fieldMap));
    const rootField = Object.getOwnPropertyNames(fieldMap)[0];
    const fieldSelections: FieldSelections[] = [
        {
            field: rootField,
            selections: ["*."],
        },
    ];

    const fields = resolveSelections(fieldSelections, info);
    console.log(fields);
    return { fields };
};
