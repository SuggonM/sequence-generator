class Sequence {
	*numbers () {
		for (const i of Array(10).keys()) {
			yield i;
		}
	}
	*lowers() {
		for (const i of Array(26).keys()) {
			yield String.fromCharCode(i+97);
		}
	}
	*uppers() {
		for (const i of Array(26).keys()) {
			yield String.fromCharCode(i+65);
		}
	}
	*charSet() {
		yield* this.numbers();
		yield* this.lowers();
		yield* this.uppers();
	}

	/* -------------------------------------- */

	*#recurseSequence(length = 1, prefix = '') {
		if (length === 0) {
			yield prefix;
			return;
		}
		for (const char of this.charSet()) {
			yield* this.#recurseSequence(length - 1, prefix + char);
		}
	}

	*sequence(opts = {}) {
		const minLength = opts.minLength ?? 1;
		const maxLength = opts.maxLength ?? Infinity;

		let length = minLength;
		while (length <= maxLength) {
			yield* this.#recurseSequence(length++);
		}
	}
}

const seq = new Sequence();
export default seq.sequence.bind(seq);
export { Sequence };
