//
// Copyright (c) 2024 kirisauce
// kirisauce's website is licensed under Mulan PSL v2.
// You can use this software according to the terms and conditions of the Mulan PSL v2.
// You may obtain a copy of Mulan PSL v2 at:
//          http://license.coscl.org.cn/MulanPSL2
// THIS SOFTWARE IS PROVIDED ON AN "AS IS" BASIS, WITHOUT WARRANTIES OF ANY KIND,
// EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO NON-INFRINGEMENT,
// MERCHANTABILITY OR FIT FOR A PARTICULAR PURPOSE.
// See the Mulan PSL v2 for more details
//

// get a random integer within a range [begin, end]
export function randint(begin: int, end: int): int {
    if (begin == end) {
        return begin;
    } else if (begin > end) {
        let tmp = begin;
        begin = end;
        end = tmp;
    }

    return Math.floor((end - begin + 1) * Math.random() + begin);
}
