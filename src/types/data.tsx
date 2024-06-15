import { generateClient } from "aws-amplify/api";
import { Schema } from "../../amplify/data/resource";

export type Parent = Schema["Parent"]["type"];
export type Child = Schema["Child"]["type"];

export const client = generateClient<Schema>();
