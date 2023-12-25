function intersection(mapA, mapB) {
  const _intersection = new Map();

  for (const [key, value] of mapB.entries()) {
    if (mapA.has(key)) {
      _intersection.set(key, value);
    }
  }
  return _intersection;
}

module.exports = { intersection };
