// Copyright (c) 2024 kirisauce
// kirisauce's website is licensed under Mulan PSL v2.
// You can use this software according to the terms and conditions of the Mulan PSL v2.
// You may obtain a copy of Mulan PSL v2 at:
//          http://license.coscl.org.cn/MulanPSL2
// THIS SOFTWARE IS PROVIDED ON AN "AS IS" BASIS, WITHOUT WARRANTIES OF ANY KIND,
// EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO NON-INFRINGEMENT,
// MERCHANTABILITY OR FIT FOR A PARTICULAR PURPOSE.
// See the Mulan PSL v2 for more details

function setClientValue(key: string, value: string) {
    if (process.client) {
        window.localStorage.setItem(key, value);
    }
}

function removeClientValue(key: string) {
    if (process.client) {
        window.localStorage.removeItem(key);
    }
}

function getClientValue(key: string) {
    if (process.client) {
        return window.localStorage.getItem(key);
    }
}

export class DeserializeError extends Error {
    constructor(typeName: string) {
        super(`error while deserializing String into ${typeName}`);

        this.name = "DeserializeError";
        this.typeName = typeName;
    }
}

export function booleanDeserializer(serialized: string): boolean {
    let v = serialized.toLowerCase();

    if (v == "true") {
        return true;
    } else if (v == "false") {
        return false;
    } else {
        throw DeserializeError("Boolean");
    }
}

export function persistentValue<T>(
    key: string,
    defaultValue: () => T,
    deserializer: (string) => T = String,
    serializer: (T) => string = String,
) {
    if (getClientValue(key) === undefined) {
        setClientValue(key, defaultValue());
    }

    let tempValue = ref(getClientValue(key));

    return computed({
        get() {
            return deserializer(tempValue.value);
        },

        set(newValue) {
            let newValueString = serializer(newValue);
            tempValue.value = newValueString;
            setClientValue(key, newValueString);
        },
    });
}
