const regex = new RegExp("\".+\"")
const txt = `"xxx.xxxxx.xxxx/general-user-service/api/user/v2"`

const result = txt.search(regex)
console.log(txt.substring(result))

const compareFn = (a, b) => {
    return a.localeCompare(b)
}

const arr = ["baa", "cdc", "adc", "aaa",]
console.log(arr.sort(compareFn))