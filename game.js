const {
    max,
    pLine,
    isUndefined,
    getDownLeft,
    getDownRight,
    getRight,
    getLeft
} = utils

const width = 9
class Game {
    constructor() {
        // this.max = 8
        this.board = []
        this.used = []
        this.nextPoint = []
        this.blank = 0
        // this.pLine = 4
        this.p1 = 1
        this.p2 = 2
    }

    init = () => {
        this.generateBoard()
        // this.initP1()
        // this.genNeiber()
        // this.dfs(this.board[0][0])
    }
    generateBoard = () => {
        for (let i = 0; i < width; i ++) {
            this.board[i] = []
            this.used[i] = []
            this.nextPoint[i] = []
            for (let j = 0; j < width; j ++) {
                if (j < 4 - i) {
                    this.board[i].push(this.p1)
                } else if (j > width - i + 3) {
                    this.board[i].push(this.p2)
                } else {
                    this.board[i].push(this.blank)
                }
                this.used[i].push(0)
                this.nextPoint[i].push([])
            }
        }

        // i = max - 1
        // while (i >= 0) {
        //     let j = 0
        //     let l = []
        //     let k = []
        //     while (j < i + 1) {
        //         // neiber = this.genNeiberDown(i, j)
        //         l.push(new Point(i, j, this.blank))
        //         k.push(0)
        //         j += 1
        //     }
        //     this.board.push(l)
        //     this.used.push(k)
        //     i -= 1
        // }
        console.log(this.board)

    }

    swap = (x1, y1, x2, y2) => {
        const v1 = this.board[x1][y1]
        this.board[x1][y1] = this.board[x2][y2]
        this.board[x2][y2] = v1
        return this.board
    }

    isOnBoard = (coord) => {
        const x = coord[0]
        const y = coord[1]
        if (x > 2 * max || y > max || x < 0 || y < 0) {
            return false
        }
        if (x <= max) {
            return y <= x
        } else {
            return y <= 2 * max - x
        }
    }

    genNeiber = () => {
        for(let i = 0; i < this.board.length; i ++) {
            for (let j = 0; j < this.board[i].length; j ++) {
                const neiber = this.genPointNeiber(i, j)
                // neiber.forEach(item => {
                //     this.board[item[0]][item[1]].v += ` neiber of ${i}, ${j}`
                // })
                this.board[i][j].neiber = neiber
            }
        }
    }

    genPointNeiber = (x, y) => {
        let whole = []
        if (x < max) {
            whole = [
                [x + 2, y],
                [x + 2, y + 2],
                [x, y - 2],
                [x, y + 2],
                [x - 2, y],
                [x - 2, y - 2],
            ]
        }
        if (x == max) {
            whole = [
                [x + 2, y - 2],
                [x + 2, y],
                [x, y - 2],
                [x, y + 2],
                [x - 2, y - 2],
                [x - 2, y]
            ]
        }
        if (x > max) {
            whole = [
                [x + 2, y -2],
                [x + 2, y],
                [x - 2, y],
                [x - 2, y + 2],
                [x, y - 2],
                [x, y + 2],
            ]
        }
        return whole.filter(item => this.isOnBoard(item))
    }

    initP1 = () => {
        let i = 0
        while (i < pLine) {
            let j = 0
            while (j < i + 1) {
                this.board[i][j].v = this.p1
                j += 1
            }
            i += 1
        }
        // console.log(this.board)
        // debugger;
    }

    // countAvp = () => {
    //     for (let i = 0; i < this.board.length; i++) {
    //         for (let j = 0;j < this.board[i].length; j++) {
    //             if (this.board[i][j].v !== 0) {
    //                 this.seachNext(this.board[i][j])
    //             }
    //         }
    //     }
    //     console.log(this.board)
    // }


    checkJumpMove = (x1, y1, x2, y2) => {
        if (isUndefined(this.board[x1]) || isUndefined(this.board[x2])) {
            return false
        }
        if (isUndefined(this.board[x1][y1]) || isUndefined(this.board[x2][y2])) {
            return false
        }
        if (this.board[x1][y1] !== 0 && this.board[x2][y2] === 0) {
            return true
        }
        return false
    }

    moveTo = (x, y, v) => {
        this.board[x][y] = v
    }

    count = 0
    dfs = (point) => {
        this.count += 1
        this.used[point.x][point.y] = 1
        console.log(`set used ${point.x}, ${point.y} to 1`)
        // console.log(this.used[0][0], this.used[2][0])
        // console.log(point.neiber)
        for (let i = 0; i < point.neiber.length; i ++) {
            const x = point.neiber[i][0]
            const y = point.neiber[i][1]

            if (this.count < 200) {
                console.log(`check ${x}, ${y} in this.used: ${this.used[x][y]}`)
                console.log(this.board[x][y])
                if (this.used[x][y] === 0) {
                    this.dfs(this.board[x][y])
                }
                // console.log(this.board[x][y])

            }
        }
        console.log(this.used)
    }

    searchNextDown = (x, y) => {
        const v = this.board[x][y]

        // check downleft
        let path = getDownLeft(x, y)
        if (this.checkJumpMove(path[0], path[1], path[2], path[3])) {
            this.moveTo(path[2], path[3], v)
            this.board[x][y] = this.blank
            this.searchNextDown(path[2], path[3])
            return
        }
        // check downRight
        path = getDownRight(x, y)
        if (this.checkJumpMove(path[0], path[1], path[2], path[3])) {
            this.moveTo(path[2], path[3], v)
            this.board[x][y] = this.blank
            this.searchNextDown(path[2], path[3])
            return
        }

        // check right
        path = getRight(x, y)
        if (this.checkJumpMove(path[0], path[1], path[2], path[3])) {
            this.moveTo(path[2], path[3], v)
            this.board[x][y] = this.blank
            this.searchNextDown(path[2], path[3])
            return
        }
        // check left
        path = getLeft(x, y)
        if (this.checkJumpMove(path[0], path[1], path[2], path[3])) {
            this.moveTo(path[2], path[3], v)
            this.board[x][y] = this.blank
            this.searchNextDown(path[2], path[3])
            return
        }
        // lowerline available

    }
}

class Point {
    constructor(x, y, v, neiber) {
        this.x = x
        this.y = y
        this.v = v
        this.neiber = neiber
    }
}