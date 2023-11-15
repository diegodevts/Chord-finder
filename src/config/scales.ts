export const scales = [
    { sequence: [0, 2, 4, 5, 7, 9, 11], type: "major" },
    { sequence: [0, 2, 3, 5, 7, 8, 10], type: "minor" },
    { sequence: [0, 2, 3, 5, 7, 8, 11], type: "minor_harmonic" },
    { sequence: [0, 2, 3, 5, 7, 9, 11], type: "minor_melodic" },
    { sequence: [0, 3, 6, 9], type: "diminished" },
    { sequence: [0, 2, 4, 6, 8, 10], type: "aumented" }
]

export async function testScales(indexes: number[], note: string) {
    const asserts = []
    scales.forEach((scale) => {
        let acumulator = 0
        scale.sequence.forEach((sequence) => {
            if (indexes.includes(sequence)) {
                acumulator += 1
            }
        })

        asserts.push({ note, acumulator, scale: scale.type })
    })

    const bestAsserts = asserts.find(
        (assert) =>
            Math.max(...asserts.map((each) => each.acumulator)) ==
            assert.acumulator
    )

    return bestAsserts
}
