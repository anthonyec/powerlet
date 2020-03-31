export default function zipObject(arrA, arrB) {
  let props = {};

  // Intentionally not using reduce ;--)
  arrA.forEach((value, index) => {
    const key = arrB[index];
    props[key] = value;
  });

  return props;
}
