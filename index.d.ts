type seqGenerator = Generator<string, void, unknown>;

/**
 * Generator-based combination builder for a given character set.
 *
 * This class is provided for customization of default charset.
 */
export class Sequence {
	/** Yields digits from 0 to 9. */
	digits(): seqGenerator;

	/** Yields lowercase letters from 'a' to 'z'. */
	lowers(): seqGenerator;

	/** Yields uppercase letters from 'A' to 'Z'. */
	uppers(): seqGenerator;

	/** Yields all characters from 'digits', 'uppers' and 'lowers'. */
	charSet(): seqGenerator;

	/**
	 * Recursively builds sequences of characters of the given length,
	 * prefixing each sequence with the provided string.
	 *
	 * @param length Length of sequences to generate (default: `1`).
	 * @param prefix Prefix to prepend to each sequence (default: `''`).
	 */
	private recurseSequence(length: number, prefix: string): seqGenerator;

	/**
	 * Yields all possible character sequences
	 *
	 * @param opts Optional configurations:
	 *   - minLength: Minimum string length (default: `1`)
	 *   - minLength: Maximum string length (default: `Infinity`)
	 */
	sequence(opts?: { minLength?: number, maxLength?: number }): seqGenerator;
}

/**
 * Default generator for producing character combinations.
 *
 * Equivalent to `new Sequence().sequence`.
 *
 * For changing default charset, extend the `Sequence` class.
 */
declare const sequence: Sequence['sequence'];
export default sequence;
