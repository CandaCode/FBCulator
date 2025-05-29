export const E48_VALUES = [
  1.00, 1.05, 1.10, 1.15, 1.21, 1.27, 1.33, 1.40, 1.47, 1.54, 1.62, 1.69,
  1.78, 1.87, 1.96, 2.05, 2.15, 2.26, 2.37, 2.49, 2.61, 2.74, 2.87, 3.01,
  3.16, 3.32, 3.48, 3.65, 3.83, 4.02, 4.22, 4.42, 4.64, 4.87, 5.11, 5.36,
  5.62, 5.90, 6.19, 6.49, 6.81, 7.15, 7.50, 7.87, 8.25, 8.66, 9.09, 9.53
];

export function generateE48Values() {
  const values = [];
  for (let i = 0; i <= 6; i++) {
    const multiplier = Math.pow(10, i);
    E48_VALUES.forEach(value => {
      // convert to kΩ so the rest of the code can work in kilo-ohms
      values.push((value * multiplier) / 1000);
    });
  }
  return values;
}

export const E48_ALL_VALUES = generateE48Values();

export function findNearestE48Value(value) {
  return E48_ALL_VALUES.reduce((prev, curr) => {
    return Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev;
  });
}
