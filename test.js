const regex = new RegExp("\".+\"")
const txt = `"xxx.xxxxx.xxxx/general-user-service/api/user/v2"`

const result = txt.search(regex)
console.log(txt.substring(result))

const compareFn = (a, b) => {
    return a.localeCompare(b)
}

const arr = ["baa", "cdc", "adc", "aaa",]
console.log(arr.sort(compareFn))

const pendingSlices = [
    "strings",
    "",
    "fmt",
    "io",
    "slices",
    "slices",
    "",
    "",
    "slices",
    "slices",
    "",
    "reflect",
    "",
    "reflect",
    "",
    "",
    "",
]

function parsePackageGroup() {
    let result = []
    let indices = []
    let start = -1
    let end = -1
    for (let i = 0; i < pendingSlices.length; i++) {
        const name = pendingSlices[i]
        if (name != "") {
            indices.push(i)
            if (start == -1) {
                start = i
            }
            end = i
        } else {
            if (start != -1) {
                result.push([start, end + 1])
                start = -1
                end = -1
            }
        }
    }
    if (start != -1) {
        result.push([start, end + 1])
    }
}

parsePackageGroup()