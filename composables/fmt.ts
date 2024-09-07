// Copyright (c) 2024 kirisauce
// kirisauce's website is licensed under Mulan PSL v2.
// You can use this software according to the terms and conditions of the Mulan PSL v2.
// You may obtain a copy of Mulan PSL v2 at:
//          http://license.coscl.org.cn/MulanPSL2
// THIS SOFTWARE IS PROVIDED ON AN "AS IS" BASIS, WITHOUT WARRANTIES OF ANY KIND,
// EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO NON-INFRINGEMENT,
// MERCHANTABILITY OR FIT FOR A PARTICULAR PURPOSE.
// See the Mulan PSL v2 for more details

export function formatFloat(value: float, precision: number): string {
    let tmpString = String(value);
    let i = tmpString.indexOf(".");

    if (i == -1) {
        return tmpString + "." + "0".repeat(precision);
    }

    let lengthAfter = tmpString.length - i - 1;

    if (lengthAfter < precision) {
        return tmpString + "0".repeat(precision - lengthAfter);
    } else if (lengthAfter > precision) {
        return tmpString.substring(
            0,
            tmpString.length - (lengthAfter - precision),
        );
    } else {
        return tmpString;
    }
}
