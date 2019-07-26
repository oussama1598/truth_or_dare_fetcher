export default function(fn) {
  return (...args) =>
    new Promise((resolve, reject) => {
      fn(...args, (err, ...results) => {
        if (err) return reject(err);

        return resolve([...results]);
      })
    }
    )
}
