const box = document.querySelector('.box')

let n = 4
let b = []
let p = []
let won = false

const MAX_TILES = 40
const MAX_N = Math.floor(Math.sqrt(MAX_TILES + 1))

const rc = i => ({ r: (i / n) | 0, c: i % n })
const adj = (a, b) =>
	Math.abs(rc(a).r - rc(b).r) + Math.abs(rc(a).c - rc(b).c) === 1

const rects = () =>
	new Map(p.map(x => [x, x.getBoundingClientRect()]))

function build() {
	box.innerHTML = ''
	p = []
	b = Array.from({ length: n * n - 1 }, (_, i) => i + 1).concat(null)

	box.style.gridTemplateColumns = `repeat(${n},1fr)`
	box.style.gridTemplateRows = `repeat(${n},1fr)`

	for (let v = 1; v < n * n; v++) {
		const d = document.createElement('div')
		d.className = 'piece'
		const s = document.createElement('span')
		s.textContent = v
		d.appendChild(s)
		d.onclick = () => move(v)
		box.appendChild(d)
		p.push(d)
	}
}

function render(a = false) {
	const prev = a ? rects() : null

	b.forEach((v, i) => {
		if (!v) return
		const x = p[v - 1]
		x.style.gridRowStart = rc(i).r + 1
		x.style.gridColumnStart = rc(i).c + 1
	})

	if (!a) return

	requestAnimationFrame(() => {
		p.forEach(x => {
			const o = prev.get(x)
			const c = x.getBoundingClientRect()
			const dx = o.left - c.left
			const dy = o.top - c.top
			if (!dx && !dy) return
			x.style.transition = 'none'
			x.style.transform = `translate(${dx}px,${dy}px)`
			requestAnimationFrame(() => {
				x.style.transition = 'transform 180ms ease'
				x.style.transform = 'translate(0,0)'
			})
		})
	})
}

function move(v) {
	const i = b.indexOf(v)
	const e = b.indexOf(null)
	if (!adj(i, e)) return
	;[b[i], b[e]] = [b[e], b[i]]
	render(true)
	if (solved()) setTimeout(win, 200)
}

function solved() {
	return b.slice(0, -1).every((v, i) => v === i + 1) && b.at(-1) === null
}

function shuffle(k = n * n * 10) {
	while (k--) {
		const e = b.indexOf(null)
		const m = b.map((_, i) => i).filter(i => adj(i, e))
		const r = m[(Math.random() * m.length) | 0]
		;[b[r], b[e]] = [b[e], b[r]]
	}
}

function win() {
	if (won) return
	won = true

	setTimeout(() => {
		n = n < MAX_N ? n + 1 : 4
		won = false
		build()
		shuffle()
		render()
	}, 800)
}

build()
shuffle()
render()