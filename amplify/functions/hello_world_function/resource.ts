import { defineFunction } from "@aws-amplify/backend";

export const helloWorldFunction = defineFunction({
    name: "Hello World Function",
    entry: "./handler.ts"
}); 