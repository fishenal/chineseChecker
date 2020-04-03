const width = 9
const total = width * width
class Game {
    constructor() {
        this.board = new Array(total)
        this.used = []
        this.nextPoints = new Array(total)
        this.jumpPoints = new Array(total)
        this.p1 = [
            0,  1,  2,  3,
            9, 10, 11,
            18, 19,
            27
        ]
        this.p2 = [
            53,
            61,62,
            69,70,71,
            77,78,79,80
        ]
        this.p1Destiny = [...this.p2]
        this.p2Destiny = [...this.p1]
    }

    init = () => {
        this.generateBoard()
        this.genNextPoints()
        this.genJumpPoints()
    }

    getBoard = () => {
        return [...this.board]
    }

    generateBoard = () => {
        for (let i = 0; i < total; i ++) {
            if (this.p1.indexOf(i) > -1) {
                this.board[i] = 1
            } else if(this.p2.indexOf(i) > -1) {
                this.board[i] = 2
            }
            else {
                this.board[i] = 0
            }
        }
        // console.log(this.board)
    }

    checkWin = () => {
        let p1Win = true
        let p2Win = true
        for (let i = 0; i < this.p1Destiny.length; i ++) {
            if (this.board[this.p1Destiny[i]] != 1) {
                p1Win = false
                break
            }
        }
        for (let i = 0; i < this.p2Destiny.length; i ++) {
            if (this.board[this.p2Destiny[i]] != 2) {
                p2Win = false
                break
            }
        }
        return {
            p1Win, p2Win
        }
    }

    genNextPoints = (x, y) => {
        this.board.forEach((p, idx) => {
            const colIdx = idx % width
            const rowIdx = Math.floor(idx / width)
            const pleft = idx - 1;
            const pright = idx + 1;
            const ptop = idx - 9;
            const pbottom = idx + 9;
            const ptopright = idx - 9 + 1;
            const pbottomleft = idx + 9 - 1;
            const nextPoints = [];
            if (colIdx > 0 && pleft >= 0) {
                nextPoints.push(pleft)
            }
            if (colIdx < width - 1 && pright < total) {
                nextPoints.push(pright)
            }
            if (ptop >= 0) {
                nextPoints.push(ptop)
            }
            if (pbottom < total) {
                nextPoints.push(pbottom)
            }
            if (rowIdx > 0 && colIdx < width - 1 && ptopright < total) {
                nextPoints.push(ptopright)
            }
            if (colIdx > 0 && pbottomleft < total) {
                nextPoints.push(pbottomleft)
            }
            this.nextPoints[idx] = nextPoints
        })
        // console.log(this.nextPoints)
    }

    genJumpPoints = (x, y) => {
        this.board.forEach((p, idx) => {
            const colIdx = idx % width
            const rowIdx = Math.floor(idx / width)
            const pleft = idx - 1;
            const pright = idx + 1;
            const ptop = idx - 9;
            const pbottom = idx + 9;
            const ptopright = idx - 9 + 1;
            const pbottomleft = idx + 9 - 1;
            const jumpPoints = [];
            if (
                colIdx > 1 &&
                pleft - 1 >= 0 &&
                this.board[pleft] !== 0 &&
                this.board[pleft - 1] == 0
            ) {
                jumpPoints.push(pleft - 1)
            }
            if (
                ptop - 9 >= 0 &&
                this.board[ptop] !== 0 &&
                this.board[ptop - 9] == 0
            ) {
                jumpPoints.push(ptop - 9)
            }
            if (
                colIdx < width - 2 &&
                pright + 1 < total &&
                this.board[pright] !== 0 &&
                this.board[pright + 1] == 0
            ) {
                jumpPoints.push(pright + 1)
            }

            if (
                pbottom + 9 < total &&
                this.board[pbottom] !== 0 &&
                this.board[pbottom + 9] == 0
            ) {
                jumpPoints.push(pbottom + 9)
            }

            if (
                rowIdx > 1 &&
                colIdx < width - 2 &&
                ptopright - 8 < total &&
                this.board[ptopright] !== 0 &&
                this.board[ptopright - 8] == 0
            ) {
                jumpPoints.push(ptopright - 8)
            }

            if (
                colIdx > 1 &&
                pbottomleft + 8 < total &&
                this.board[ptopright] !== 0 &&
                this.board[ptopright + 8] == 0
            ) {
                jumpPoints.push(pbottomleft + 8)
            }

            this.jumpPoints[idx] = jumpPoints
        })
        // console.log(this.jumpPoints)
    }

    swap = (p1, p2) => {
        const v1 = this.board[p1]
        this.board[p1] = this.board[p2]
        this.board[p2] = v1
    }

    dps = (pIdx, desIdx, searched, prevs) => {
        searched.push(pIdx)
        for(let i = 0; i < this.jumpPoints[pIdx].length; i ++ ) {
            const tIdx = this.jumpPoints[pIdx][i]
            if (searched.indexOf(tIdx) === -1) {
                // if (tIdx == desIdx) {
                //     break
                // }
                this.dps(tIdx, desIdx, searched, prevs)
            }
        }
        prevs.push(pIdx)
    }
    bfs = (pIdx, desIdx, searched, prevs) => {
        const dist = new Array(total)
        for (let a = 0; a < total; a ++) {
            dist[a] = -1
        }
        dist[pIdx] = 0
        searched.push(pIdx)
        let find = false
        while(searched.length > 0) {
            // console.log(searched)
            const currentIdx = searched.shift()
            const neibers = this.jumpPoints[currentIdx]
            if (currentIdx == desIdx) {
                find = true
                break
            }
            for (let i = 0; i < neibers.length; i ++) {
                if (dist[neibers[i]] == -1) {
                    searched.push(neibers[i])
                    dist[neibers[i]] = dist[currentIdx] + 1
                    prevs[neibers[i]] = currentIdx
                }
            }
        }
        return find
    }
    findPath = (p1, p2) => {
        const searched = []
        const prevs = new Array(total)
        const paths = []
        const find = this.bfs(p1, p2, searched, prevs)

        if (find) {
            const start = p1
            let target = p2
            paths.push(target)
            while (start != target) {
                paths.push(prevs[target])
                target = prevs[target]
            }
        }
        return paths
    }

}