const utils = {
    max: 8,
    pLine: 4,
    isUndefined: obj => {
        return typeof obj === 'undefined'
    },
    getDownLeft: (x, y) => {
        const getDl = (x, y) => {
            let newX = x + 1
            let newY = y
            if (x >= max) {
                newY = y - 1
            }
            return [newX, newY]
        }
        const mid = getDl(x, y)
        const target = getDl(mid[0], mid[1])
        return mid.concat(target)
    },
    getDownRight: (x, y) => {
        const getDr = (x, y) => {
            let newX = x + 1
            let newY = y
            if (x < max) {
                newY = y + 1
            }
            return [newX, newY]
        }
        const mid = getDr(x, y)
        const target = getDr(mid[0], mid[1])
        return mid.concat(target)
    },
    getUpLeft: (x, y) => {
        const newX = x - 1
        let newY = y
        if (x <= max) {
            newY = y - 1
        }
        if (this.isUndefined(this.board[newX])|| this.isUndefined(this.board[newX][newY])) {
            return false
        }
        return this.board[newX][newY]
    },
    getUpRight: (x, y) => {
        const newX = x - 1
        let newY = y
        if (x > this.max) {
            newY = y + 1
        }
        if (this.isUndefined(this.board[newX])|| this.isUndefined(this.board[newX][newY])) {
            return false
        }
        return this.board[newX][newY]
    },
    getRight: (x, y) => {
        const getR = (x, y) => {
            return [x, y + 1]
        }
        const mid = getR(x, y)
        const target = getR(mid[0], mid[1])
        return mid.concat(target)
    },
    getLeft: (x, y) => {
        const getL = (x, y) => {
            return [x, y - 1]
        }
        const mid = getL(x, y)
        const target = getL(mid[0], mid[1])
        return mid.concat(target)
    }
}