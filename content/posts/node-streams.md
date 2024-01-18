---
  title: "Dive into streams with NodeJS"
  date: 2019-04-04T15:15:04+05:30
  tags: "code"
  tranding: false
  readTime: "1 min"
  thumbnail: /images/blog/stream.svg
#   featureImage: /images/blog/feature-image-06.jpg
---

You know the time you had to fit that streaming code you wrote into your async/await promise workflow. Well, let me take you through all you need to know about streams and promises.

Let start with a super simple example: Copy data from a file to another while uppercasing all its contents.

```js
const fs = require("fs");
const { Transform } = require("stream");

// Tranform Stream that uppercases data
const uppercase = new Transform();
uppercase._transform = function (data, enc, cb) {
  cb(null, data.toString().toUpperCase());
};

const copyUppercase = (filename) => {
  const input = fs.createReadStream(filename);
  const output = fs.createWriteStream(`uppercased_${filename}`);
  input.pipe(uppercase).pipe(output);
};
```

Ok, now let's look at the problem. Firstly the function doesn't wait for the stream to finish processing. Secondly - Error handling. Nodejs Streams don't forward errors by default. A naive approach to promisifying the above code would look like this.

```js
const copyUppercase = (filename) => {
  return new Promise((res, rej) => {
    const input = fs.createReadStream(filename);
    const output = fs.createWriteStream(`uppercased_${filename}`);

    input.pipe(uppercase).pipe(output).on("finish", res);

    input.on("error", rej);
    uppercase.on("error", rej);
    output.on("error", rej);
  });
};
```

phew. that's a handful. Let's fix it now. Introducing [pipeline](https://nodejs.org/api/stream.html#stream_stream_pipeline_source_transforms_destination_callback). the pipeline function was added to Nodejs in v10.0. Here's the function definition.

```js
stream.pipeline(source[, ...transforms], destination, callback)
```

The function takes in a list of streams starting with the input stream, followed by the transformation streams, and the output stream at the end. The function doesn't return a promise. however, the final parameter is a callback function which returns an error and the resolved value which makes it promisify-able. Let's rewrite that function one last time now.

```js
const util = require("util");
const stream = require("stream");
const pipeline = util.promisify(stream.pipeline);

const copyUppercase = async (filename) => {
  const input = fs.createReadStream(filename);
  const output = fs.createWriteStream(`uppercased_${filename}`);

  await pipeline(input, uppercase, output);
};
```

That's it. pipeline just promisified our streams and propagated the errors for us. Could it get any better?. You had to ask. The newer version of Nodejs also allows async generators. So you could write the whole thing like this.

```js
const copyUppercase = async (filename) => {
  const input = fs.createReadStream(filename);
  const output = fs.createWriteStream(`uppercased_${filename}`);

  await pipeline(
    input,
    async function* (source) {
      source.setEncoding("utf8"); // Work with strings rather than `Buffer`s.
      for await (const chunk of source) {
        yield chunk.toUpperCase();
      }
    },
    output
  );
};
```
