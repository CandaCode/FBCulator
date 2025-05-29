import assert from 'assert';
import { generateE48Values, findNearestE48Value } from '../src/utils/resistors.js';

const values = generateE48Values();
assert.ok(values.length > 0, 'no values generated');
// first value should be 1 ohm -> 0.001 kΩ
assert.strictEqual(values[0], 0.001);
// check a higher decade value exists
assert.ok(values.includes(100), '100 kΩ not found');
// nearest value to 5.5kΩ should be 5.62kΩ in the E48 series
assert.strictEqual(findNearestE48Value(5.5), 5.62);
console.log('resistor util tests passed');
