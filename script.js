document.getElementById('chatFile').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;

  if (file.name.endsWith('.zip')) {
    const zip = new JSZip();
    zip.loadAsync(file).then(function(contents) {
      for (let filename in contents.files) {
        if (filename.endsWith('.txt')) {
          zip.file(filename).async('string').then(function(text) {
            parseChat(text);
          });
          break;
        }
      }
    });
  } else if (file.name.endsWith('.txt')) {
    const reader = new FileReader();
    reader.onload = function(e) {
      parseChat(e.target.result);
    };
    reader.readAsText(file);
  } else {
    alert("Only .txt or .zip files supported.");
  }
});

function parseChat(content) {
  const lines = content.split('\n');
  let output = "";

  lines.forEach(line => {
    const match = line.match(/^(\[?\d{1,2}\/\d{1,2}\/\d{2,4}, \d{1,2}:\d{2}(?: [APap][Mm])?\]?) (.*?): (.*)$/);
    if (match) {
      const [_, date, sender, message] = match;
      output += `<strong>${sender}</strong> <em>(${date})</em>: ${message}<br>`;
    } else {
      output += `${line}<br>`;
    }
  });

  document.getElementById('chatContainer').innerHTML = output;
}
