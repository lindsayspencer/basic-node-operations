const fs = require("fs");

const done = output => {
  process.stdout.write(output);
  process.stdout.write("\nprompt > ");
};

const evaluateCmd = userInput => {
  const userInputArray = userInput.split(" ");
  const command = userInputArray[0];

  switch (command) {
    case "echo":
      commandLibrary.echo(userInputArray.slice(1).join(" "));
      break;
    case "cat":
      commandLibrary.cat(userInputArray.slice(1));
      break;
    case "sort":
      commandLibrary.sort(userInputArray.slice(1));
      break;
    case "wc":
      commandLibrary.wc(userInputArray.slice(1));
      break;
    case "uniq":
      commandLibrary.uniq(userInputArray.slice(1));
      break;
    case 'head':
        commandLibrary.head(userInputArray.slice(1));
        break;
    case 'tail':
        commandLibrary.tail(userInputArray.slice(1));
        break;
    default:
        commandLibrary.errorHandler();
  }
};

const commandLibrary = {
  echo: userInput => {
    done(userInput);
  },
  cat: fullPath => {
    const fileName = fullPath[0];
    fs.readFile(fileName, (err, data) => {
      if (err) throw err;
      done(data);
    });
  },
  sort: fullPath => {
    const fileName = fullPath[0];
    fs.readFile(fileName, "utf8", (err, data) => {
      if (err) throw err;
      const contents = data
        .toLowerCase()
        .split("\n")
        .sort()
        .join("\n");
      done(contents);
    });
  },
  wc: fullPath => {
    const fileName = fullPath[0];
    const reader = fs.createReadStream(fileName);
    reader.on("data", chunk => {
      const bytes = chunk.length;
      const data = chunk.toString();
      const lineCount = data.split("").filter(each => each === "\n").length;
      const lines = data.split("\n");
      let wordCount = 0;
      for (let i = 0; i < lines.length; i++) {
        wordCount = wordCount + lines[i].split(" ").length;
      }
      done(`lines: ${lineCount}, words: ${wordCount}, bytes: ${bytes}`);
    });
  },
  uniq: fullPath => {
    const fileName = fullPath[0];
    fs.readFile(fileName, "utf8", (err, data) => {
      if (err) throw err;
      let contents = data.toLowerCase().split("\n");
      for (let i = 0; i < contents.length; i++) {
        if (contents[i] === contents[i + 1]) {
          contents.splice(i, 1);
        }
      }
      contents = contents.sort().join("\n");
      done(contents);
    });
  }, 
  'head': (fullPath) => {
      const fileName = fullPath[0];
      fs.readFile(fileName, 'utf8', (err, data) => {
        if (err) throw err;
        const n = 2;
        let splitData = data.split('\n');
        let headData = [];
        for(let i = 0; i < n; i++){
            headData.push(splitData[i]);
        }
        const head = headData.join('\n');
        done(head);
      });
  },
  'tail': (fullPath) => {
    const fileName = fullPath[0];
    fs.readFile(fileName, 'utf8', (err, data) => {
        if(err) throw err;
        const n = 2;
        let splitData = data.split('\n');
        let tailData = splitData.slice(n);
        const tail = tailData.join('\n');
        done(tail);
    })
  },
  'errorHandler': () => {
      const errorMessage = "Command is not recognized";
      done(errorMessage);
  }
};

module.exports.commandLibrary = commandLibrary;
module.exports.evaluateCmd = evaluateCmd;

// line count, word count, byte count
//
